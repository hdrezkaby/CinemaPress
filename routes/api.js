'use strict';

/**
 * Module dependencies.
 */

var CP_get = require('../lib/CP_get');
var CP_save = require('../lib/CP_save');
var CP_cache = require('../lib/CP_cache');
var CP_api = require('../modules/CP_api');

/**
 * Configuration dependencies.
 */

var config = require('../config/production/config');
Object.keys(config).length === 0 &&
  (config = require('../config/production/config.backup'));
var config_md5 = require('md5')(JSON.stringify(config));

var modules = require('../config/production/modules');
Object.keys(modules).length === 0 &&
  (modules = require('../config/production/modules.backup'));
var modules_md5 = require('md5')(JSON.stringify(modules));

setInterval(function() {
  if (
    config_md5 &&
    process.env['CP_CONFIG_MD5'] &&
    config_md5 !== process.env['CP_CONFIG_MD5']
  ) {
    config = require('../config/production/config');
    Object.keys(config).length === 0 &&
      (config = require('../config/production/config.backup'));
    config_md5 = process.env['CP_CONFIG_MD5'];
  }
  if (
    modules_md5 &&
    process.env['CP_MODULES_MD5'] &&
    modules_md5 !== process.env['CP_MODULES_MD5']
  ) {
    modules = require('../config/production/modules');
    Object.keys(modules).length === 0 &&
      (modules = require('../config/production/modules.backup'));
    modules_md5 = process.env['CP_MODULES_MD5'];
  }
}, 3333);

/**
 * Node dependencies.
 */

var Avatars = require('@dicebear/avatars').default;
var sprites = require('@dicebear/avatars-avataaars-sprites').default;
var avatars = new Avatars(sprites, {});
var request = require('request');
var fs = require('fs');
var md5 = require('md5');
var path = require('path');
var express = require('express');
var async = require('async');
var router = express.Router();
var LRU = require('lru-cache');
var tokens = new LRU({ maxAge: 3600000, max: 1000 });
var ips = new LRU({ maxAge: 3600000, max: 1000 });

var first = require(path.join(
  path.dirname(__filename),
  '..',
  'config',
  'names',
  'first.json'
));
var last = require(path.join(
  path.dirname(__filename),
  '..',
  'config',
  'names',
  'last.json'
));

router.post('/comments', function(req, res) {
  var form = req.body;
  var ip = getIp(req);
  var ava = req.cookies['CP_avatar']
    ? req.cookies['CP_avatar']
        .trim()
        .replace(/[^a-z0-9]/gi, '')
        .substring(0, 32)
    : '';
  var referrer = {};

  if (req.get('Referrer')) {
    referrer = new URL(req.get('Referrer'));
  }
  if ((!referrer.pathname || referrer.pathname === '/') && form.comment_url) {
    referrer = new URL(form.comment_url);
  }

  if (!referrer.pathname || referrer.pathname === '/') {
    return res.json({ status: 'error', code: 16, message: 'URL undefined' });
  }

  if (!modules.comments.status) {
    return res.json({ status: 'error', code: 1, message: 'Comments disabled' });
  }

  if (!ip) {
    return res.json({ status: 'error', code: 2, message: 'Not found IP' });
  }

  if (
    modules.comments.data.fast.blacklist &&
    modules.comments.data.fast.blacklist.length &&
    (modules.comments.data.fast.blacklist.indexOf(ip) + 1 ||
      (ava && modules.comments.data.fast.blacklist.indexOf(ava) + 1))
  ) {
    return res.json({ status: 'error', code: 17, message: 'You are blocked' });
  }

  var id =
    form.comment_id && parseInt(form.comment_id)
      ? '' + parseInt(form.comment_id)
      : '';

  async.series(
    {
      recaptcha: function(callback) {
        if (!modules.comments.data.fast.recaptcha_secret) {
          return callback();
        }
        if (!form.comment_recaptcha) {
          return callback({
            status: 'error',
            code: 3,
            message: 'Recaptcha error'
          });
        }
        request(
          'https://www.google.com/recaptcha/api/siteverify?' +
            'secret=' +
            modules.comments.data.fast.recaptcha_secret +
            '&' +
            'response=' +
            form.comment_recaptcha +
            '&' +
            'remoteip=' +
            ip,
          { timeout: 1000, agent: false },
          function(error, response, verify) {
            verify =
              verify && typeof verify === 'string' ? JSON.parse(verify) : {};
            if (
              !verify ||
              !verify.success ||
              parseFloat('' + verify.score) <=
                parseFloat(
                  '' + modules.comments.data.fast.recaptcha_score / 100
                )
            ) {
              return callback({
                status: 'error',
                code: 3,
                message:
                  verify && verify.score
                    ? 'Recaptcha score ' +
                      verify.score +
                      ' <= ' +
                      parseFloat(
                        '' + modules.comments.data.fast.recaptcha_score / 100
                      )
                    : 'Recaptcha error'
              });
            }
            return callback();
          }
        );
      },
      vote: function(callback) {
        if (
          !id ||
          !(form.comment_type === 'like' || form.comment_type === 'dislike')
        ) {
          return callback();
        }
        var t = form.comment_type;
        CP_get.comments({ comment_id: id }, 1, '', 1, function(err, result) {
          if (err) {
            console.error(err);
            return callback({
              status: 'error',
              code: 4,
              message: 'Not get «' + id + '»'
            });
          }
          if (result && result[0]) {
            var comment = result[0];
            if (ip === comment.comment_ip) {
              return callback({
                status: 'error',
                code: 5,
                message: 'You can not vote for your comment'
              });
            } else if (ip === comment.comment_vote_ip) {
              return callback({
                status: 'error',
                code: 6,
                message: 'You have already voted'
              });
            } else {
              var c = {};
              c['id'] = id;
              c['comment_id'] = id;
              c['comment_' + t] = parseInt(comment['comment_' + t]) + 1;
              c['comment_vote_ip'] = ip;
              CP_save.save(c, 'comment', function(err, result) {
                if (err) {
                  console.error(err);
                  return callback({
                    status: 'error',
                    code: 7,
                    message: 'Not save «' + id + '»'
                  });
                }
                return callback();
              });
            }
          } else {
            return callback({
              status: 'error',
              code: 8,
              message: 'Not found «' + id + '»'
            });
          }
        });
      },
      comment: function(callback) {
        if (!form.comment_text) {
          return callback();
        }
        var stopworls =
          modules.comments.data.fast.stopworls &&
          modules.comments.data.fast.stopworls.length
            ? modules.comments.data.fast.stopworls.filter(function(world) {
                return (
                  new RegExp(
                    '(\\s|^)' + world + '(\\s|,|\\.|!|\\?|$)',
                    'i'
                  ).test(form.comment_text) ||
                  new RegExp(
                    '(\\s|,|\\.|!|\\?|^)' + world + '(\\s|$)',
                    'i'
                  ).test(form.comment_text) ||
                  new RegExp(
                    '(\\s|,|\\.|!|\\?|^)' + world + '(\\s|,|\\.|!|\\?|$)',
                    'i'
                  ).test(form.comment_text)
                );
              })
            : [];
        if (stopworls.length) {
          return callback({
            status: 'error',
            code: 9,
            message: 'Stop worlds: «' + stopworls.join('», «') + '»'
          });
        }

        if (
          !modules.comments.data.fast.url_links &&
          /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/i.test(
            form.comment_text
          )
        ) {
          return callback({
            status: 'error',
            code: 10,
            message: modules.comments.data.fast.url_links_text
          });
        }

        if (
          !modules.comments.data.fast.bb_codes &&
          /[\[][^\]]*?]/i.test(form.comment_text)
        ) {
          return callback({
            status: 'error',
            code: 11,
            message: modules.comments.data.fast.bb_codes_text
          });
        }

        if (
          !modules.comments.data.fast.html_tags &&
          /[<][^>]*?>/i.test(form.comment_text)
        ) {
          return callback({
            status: 'error',
            code: 12,
            message: modules.comments.data.fast.html_tags_text
          });
        }

        if (
          modules.comments.data.fast.min_symbols &&
          form.comment_text &&
          (form.comment_text
            .replace(/[<][^>]*?>/gi, '')
            .replace(/[\[][^\]]*?]/gi, '')
            .replace(/\s+/g, ' ')
            .replace(/(^\s*)|(\s*)$/g, '').length <
            modules.comments.data.fast.min_symbols ||
            form.comment_text.length > 10000)
        ) {
          return callback({
            status: 'error',
            code: 13,
            message: modules.comments.data.fast.min_symbols_text
          });
        }

        form.comment_anonymous = form.comment_anonymous
          ? decodeURIComponent(form.comment_anonymous)
              .replace(/[<][^>]*?>/gi, '')
              .replace(/[\[][^\]]*?]/gi, '')
              .replace(/\s+/g, ' ')
              .replace(/(^\s*)|(\s*)$/g, '')
          : '';

        form.comment_title = form.comment_title
          ? decodeURIComponent(form.comment_title)
              .replace(/[<][^>]*?>/gi, '')
              .replace(/[\[][^\]]*?]/gi, '')
              .replace(/\s+/g, ' ')
              .replace(/(^\s*)|(\s*)$/g, '')
              .slice(0, 200)
          : '';

        if (
          form.comment_anonymous.length <= 0 ||
          form.comment_anonymous.length > 30
        ) {
          var one_length = first.length || 0;
          var two_length = last.length || 0;
          var ip_sum = ip.split('.');
          var one_num = parseInt(ip_sum[0]) + parseInt(ip_sum[1]);
          var two_num = parseInt(ip_sum[2]) + parseInt(ip_sum[3]);
          var fore_num = one_num + two_num;
          form.comment_anonymous =
            config.language === 'ru' && one_length && two_length
              ? decodeURIComponent(
                  first[one_num % one_length] + ' ' + last[two_num % two_length]
                )
              : 'Anonymous' + fore_num;
        }

        form.user_id = ip.replace(/[^0-9]/gi, '99');

        var data = {};
        data.comment_ip = ip;
        data.comment_title = form.comment_title;
        data.comment_url = referrer.pathname.replace(
          /(\/mobile-version|\/tv-version)/gi,
          ''
        );
        data.comment_confirm = modules.comments.data.fast.premoderate ? 0 : 1;
        data.comment_anonymous = form.comment_anonymous;
        data.comment_avatar =
          '/files/avatar/' + (ava || md5(data.comment_anonymous)) + '.svg';
        data.comment_text = form.comment_text
          .replace(/(^\n*)|(\n*)$/g, '')
          .replace(/\n+/g, '[br]')
          .replace(/\[(b|i|spoiler|search)]\[\/(b|i|spoiler|search)]/gi, '')
          .replace(
            /\[(b|i|spoiler|search)([^\]]*?)]\[\/(b|i|spoiler|search)]/gi,
            '[$1]$2[/$3]'
          )
          .replace(
            /\[(b|i|spoiler|search)]\[([^\]]*?)\/(b|i|spoiler|search)]/gi,
            '[$1]$2[/$3]'
          )
          .replace(
            /\[(b|i|spoiler|search)]\[\/([^\]]*?)(b|i|spoiler|search)]/gi,
            '[$1]$2[/$3]'
          )
          .replace(
            /\[(b|i|spoiler|search)]\s*([^\[]*?)\s*\[\/(b|i|spoiler|search)]/gi,
            '[$1]$2[/$3]'
          )
          .replace(
            /([a-zа-яё0-9]+)\[(b|i|spoiler|search)]([^\[]*?)\[\/(b|i|spoiler|search)]/gi,
            '$1 [$2]$3[/$4]'
          )
          .replace(
            /\[(b|i|spoiler|search)]([^\[]*?)\[\/(b|i|spoiler|search)]([a-zа-яё0-9]+)/gi,
            '[$1]$2[/$3] $4'
          )
          .replace(/\s+/g, ' ')
          .replace(/(^\s*)|(\s*)$/g, '');
        [
          'content_id',
          'movie_id',
          'season_id',
          'episode_id',
          'user_id',
          'reply_id',
          'comment_like',
          'comment_dislike',
          'comment_star'
        ].forEach(function(id) {
          if (form[id] && parseInt('' + form[id])) {
            data[id] = '' + parseInt('' + form[id]);
          }
        });

        if (!data['movie_id'] && !data['content_id']) {
          return callback({
            status: 'error',
            code: 14,
            message: 'Not ID'
          });
        }

        CP_save.save(data, 'comment', function(err) {
          if (err) {
            console.error(err);
            return callback({
              status: 'error',
              code: 15,
              message:
                'Not save «' + (data['movie_id'] || data['content_id']) + '»'
            });
          }
          callback();
          var avatar = path.join(
            path.dirname(__filename),
            '..',
            data.comment_avatar
          );
          if (!fs.existsSync(avatar)) {
            fs.writeFileSync(
              avatar,
              avatars.create(ava || md5(data.comment_anonymous))
            );
          }
        });
      }
    },
    function(err) {
      if (err) {
        return res.json(err);
      }
      return res.json({ status: 'success' });
    }
  );
});

router.get('/', function(req, res) {
  res.setHeader('Content-Type', 'application/json');

  var ip = (req.query['ip'] && req.query['ip'].trim()) || getIp(req);
  var token = req.query['token'] && req.query['token'].trim();
  if (
    !modules.api.status ||
    !modules.api.data ||
    !modules.api.data.tokens.length
  ) {
    console.error('[ERROR API]', 'TOKEN:', token, 'IP:', ip);
    return res.status(404).json({
      status: 'error',
      message: 'API is not activated.'
    });
  }
  if (!tokens.has('CP_VER') || tokens.get('CP_VER') !== process.env['CP_VER']) {
    tokens.reset();
    tokens.set('CP_VER', process.env['CP_VER']);
    modules.api.data.tokens.forEach(function(t) {
      var token = t
        .replace(/(^\s*)|(\s*)$/g, '')
        .replace(/\s*~\s*/g, '~')
        .split('~');
      if (token[0].charAt(0) === '#') return;
      var req_sec = token[1]
        ? token[1]
            .replace(/(^\s*)|(\s*)$/g, '')
            .replace(/\s*\/\s*/g, '/')
            .split('/')
        : ['10', '1'];
      var max = token[2]
        ? token[2].toLowerCase() === 'infinity' ||
          token[2].toLowerCase() === 'unlimited'
          ? Infinity
          : parseInt(token[2].replace(/[^0-9]/g, ''))
        : 1000;
      var req_sec_ip = token[3]
        ? token[3]
            .replace(/(^\s*)|(\s*)$/g, '')
            .replace(/\s*\/\s*/g, '/')
            .split('/')
        : ['2', '1'];
      var max_ip = token[4]
        ? token[4].toLowerCase() === 'infinity' ||
          token[4].toLowerCase() === 'unlimited'
          ? Infinity
          : parseInt(token[4].replace(/[^0-9]/g, ''))
        : Infinity;
      tokens.set(token[0], {
        req: parseInt(req_sec[0].replace(/[^0-9]/g, '') || '10'),
        sec: parseInt(req_sec[1].replace(/[^0-9]/g, '') || '1') * 1000,
        max: max,
        ip: {
          req: parseInt(req_sec_ip[0].replace(/[^0-9]/g, '') || '1'),
          sec: parseInt(req_sec_ip[1].replace(/[^0-9]/g, '') || '1') * 1000,
          max: max_ip
        }
      });
    });
  }
  if (tokens.has(token)) {
    var token_data = tokens.get(token);
    if (token_data.max <= 0) {
      return res.status(404).json({
        status: 'error',
        message: 'API token is out of the request limit per hour.'
      });
    }
    if (token_data.date) {
      var curr_ms = new Date() - token_data.date;
      var limit_ms = token_data.sec / token_data.req;
      if (curr_ms < limit_ms) {
        console.error(
          '[ERROR LIMIT]',
          'TOKEN:',
          token,
          'IP:',
          ip,
          curr_ms + 'ms',
          '<',
          limit_ms + 'ms'
        );
        return res.status(404).json({
          status: 'error',
          message:
            'API token is out of the request limit ' +
            (token_data.req + 'req/' + token_data.sec / 1000 + 'sec') +
            '.'
        });
      }
    }
    token_data.date = new Date();
    token_data.max = token_data.max - 1;
    tokens.set(token, token_data);
  } else {
    console.error('[ERROR NOT]', 'TOKEN:', token, 'IP:', ip);
    return res
      .status(404)
      .json({ status: 'error', message: 'API token does not exist.' });
  }
  if (!ips.has('CP_VER') || ips.get('CP_VER') !== process.env['CP_VER']) {
    ips.reset();
    ips.set('CP_VER', process.env['CP_VER']);
  }
  if (ips.has(ip)) {
    var ip_data = ips.get(ip);
    if (ip_data.max <= 0) {
      return res.status(404).json({
        status: 'error',
        message: 'IP is out of the request limit per hour.'
      });
    }
    if (ip_data.date) {
      var ip_curr_ms = new Date() - ip_data.date;
      var ip_limit_ms = ip_data.sec / ip_data.req;
      if (ip_curr_ms < ip_limit_ms) {
        console.error(
          '[ERROR LIMIT]',
          'TOKEN:',
          token,
          'IP:',
          ip,
          ip_curr_ms + 'ms',
          '<',
          ip_limit_ms + 'ms'
        );
        return res.status(404).json({
          status: 'error',
          message:
            'IP is out of the request limit ' +
            (ip_data.req + 'req/' + ip_data.sec / 1000 + 'sec') +
            '.'
        });
      }
    }
    ip_data.date = new Date();
    ip_data.max = ip_data.max - 1;
    ips.set(ip, ip_data);
  } else {
    ips.set(ip, tokens.get(token).ip);
  }
  var movie = false;
  var q = {};
  ['imdb_id', 'tmdb_id', 'douban_id', 'wa_id', 'tvmaze_id', 'movie_id'].forEach(
    function(key) {
      if (req.query[key] && req.query[key].replace(/[^0-9]/g, '')) {
        q[key] =
          "'" + decodeURIComponent(req.query[key].replace(/[^0-9]/g, '')) + "'";
        movie = true;
      }
    }
  );
  ['id', 'kp_id'].forEach(function(key) {
    if (req.query[key] && req.query[key].replace(/[^0-9]/g, '')) {
      q[key] = decodeURIComponent(req.query[key].replace(/[^0-9]/g, ''));
      movie = true;
    }
  });
  if (req.query['type'] && req.query['type'].replace(/[^0-9]/g, '')) {
    q['type'] = decodeURIComponent(req.query['type'].replace(/[^0-9]/g, ''));
  } else if (
    req.query['type'] &&
    (req.query['type'] === 'tv' || req.query['type'] === 'movie')
  ) {
    q['type'] = req.query['type'] === 'tv' ? 1 : 0;
  }
  if (
    req.query['limit'] &&
    req.query['limit'].replace(/[^0-9]/g, '') &&
    parseInt(req.query['limit'].replace(/[^0-9]/g, ''))
  ) {
    q['limit'] = parseInt(req.query['limit'].replace(/[^0-9]/g, ''));
    if (q['limit'] <= 0 || q['limit'] > 100) {
      q['limit'] = 100;
    }
  }
  if (
    req.query['page'] &&
    req.query['page'].replace(/[^0-9]/g, '') &&
    parseInt(req.query['page'].replace(/[^0-9]/g, ''))
  ) {
    q['page'] = parseInt(req.query['page'].replace(/[^0-9]/g, ''));
  }
  if (movie) {
    CP_api.movie(q, ip, function(err, result) {
      if (err) {
        return res.status(404).json({ status: 'error', message: err });
      }
      return res.json(result);
    });
  } else {
    CP_api.movies(q, ip, function(err, result) {
      if (err) {
        return res.status(404).json({ status: 'error', message: err });
      }
      return res.json(result);
    });
  }
});

router.all('/', function(req, res) {
  var player = typeof req.query['player'] !== 'undefined';
  var type = typeof req.query['type'] !== 'undefined' ? req.query['type'] : '';
  var queries = [];
  if (req.query['id'] && parseInt(req.query['id'].replace(/[^0-9]/g, ''))) {
    queries.push({
      id: parseInt(req.query['id'].replace(/[^0-9]/g, '')) + ''
    });
  } else if (
    (req.query['kp_id'] &&
      parseInt(req.query['kp_id'].replace(/[^0-9]/g, ''))) ||
    (req.body &&
      req.body['kinopoisk'] &&
      parseInt(req.body['kinopoisk'].replace(/[^0-9]/g, '')))
  ) {
    queries.push({
      id:
        (req.query['kp_id'] &&
          parseInt(req.query['kp_id'].replace(/[^0-9]/g, '')) + '') ||
        (req.body &&
          req.body['kinopoisk'] &&
          parseInt(req.body['kinopoisk'].replace(/[^0-9]/g, '')) + '')
    });
  }
  if (
    req.query['tmdb_id'] &&
    parseInt(req.query['tmdb_id'].replace(/[^0-9]/g, ''))
  ) {
    queries.push({
      type: type,
      id: 'custom.tmdb_id',
      'custom.tmdb_id':
        parseInt(req.query['tmdb_id'].replace(/[^0-9]/g, '')) + ''
    });
  }
  if (
    req.query['imdb_id'] &&
    parseInt(req.query['imdb_id'].replace(/[^0-9]/g, ''))
  ) {
    queries.push({
      id: 'custom.imdb_id',
      'custom.imdb_id':
        parseInt(req.query['imdb_id'].replace(/[^0-9]/g, '')) + ''
    });
  }
  if (
    req.query['douban_id'] &&
    parseInt(req.query['douban_id'].replace(/[^0-9]/g, ''))
  ) {
    queries.push({
      id: 'custom.douban_id',
      'custom.douban_id':
        parseInt(req.query['douban_id'].replace(/[^0-9]/g, '')) + ''
    });
  }
  if (
    req.query['tvmaze_id'] &&
    parseInt(req.query['tvmaze_id'].replace(/[^0-9]/g, ''))
  ) {
    queries.push({
      id: 'custom.tvmaze_id',
      'custom.tvmaze_id':
        parseInt(req.query['tvmaze_id'].replace(/[^0-9]/g, '')) + ''
    });
  }
  if (
    req.query['wa_id'] &&
    parseInt(req.query['wa_id'].replace(/[^0-9]/g, ''))
  ) {
    queries.push({
      id: 'custom.wa_id',
      'custom.wa_id': parseInt(req.query['wa_id'].replace(/[^0-9]/g, '')) + ''
    });
  }
  if (
    req.query['movie_id'] &&
    parseInt(req.query['movie_id'].replace(/[^0-9]/g, ''))
  ) {
    queries.push({
      id: 'custom.movie_id',
      'custom.movie_id':
        parseInt(req.query['movie_id'].replace(/[^0-9]/g, '')) + ''
    });
  }
  if (!queries.length) {
    return res.status(404).json({});
  }
  var current_movie = null;
  async.eachOfLimit(
    queries,
    1,
    function(query, query_index, callback) {
      if (current_movie) {
        return callback('STOP');
      }
      var req1 = {};
      req1['from'] = process.env.CP_RT;
      req1['certainly'] = true;
      CP_get.movies(Object.assign({}, req1, query), 1, '', 1, false, function(
        err,
        rt
      ) {
        if (err) {
          console.error(err);
          return callback('STOP');
        }
        var movie = (rt && rt[0]) || null;
        if (typeof movie.custom === 'object') {
          movie.custom = JSON.stringify(movie.custom);
        }
        if (
          movie &&
          (movie.player ||
            (movie.custom &&
              (movie.custom.indexOf('"player1"') + 1 ||
                movie.custom.indexOf('"player2"') + 1 ||
                movie.custom.indexOf('"player3"') + 1 ||
                movie.custom.indexOf('"player4"') + 1 ||
                movie.custom.indexOf('"player5"') + 1)) ||
            (modules.player.data.custom &&
              modules.player.data.custom.length &&
              modules.player.data.custom.filter(function(l) {
                return !/^#/i.test(l) && /~\s*iframe$/i.test(l);
              }).length))
        ) {
          var movie_custom = {};
          try {
            movie_custom = JSON.parse(movie.custom);
          } catch (e) {}
          if (player) {
            var players = movie.player
              ? movie.player.split(req.body.separator || ',')
              : [];
            [1, 2, 3, 4, 5].forEach(function(i) {
              if (movie_custom['player' + i]) {
                players.push(movie_custom['player' + i]);
              }
            });
            if (
              modules.player.data.custom &&
              modules.player.data.custom.length
            ) {
              for (var c = 0; c < modules.player.data.custom.length; c++) {
                var parse = modules.player.data.custom[c]
                  .replace(/\s*~\s*/g, '~')
                  .split('~');
                if (
                  modules.player.data.custom[c].charAt(0) === '#' ||
                  modules.player.data.custom[c].length < 2
                ) {
                  continue;
                }
                var p = {
                  url: parse[0],
                  iframe: parse[1] && parse[1].split('<>')[0].trim(),
                  translate: parse[2] || '',
                  quality: parse[3] || '',
                  uid: parse[4] || '',
                  format:
                    parse[1] && parse[1].split('<>')[1]
                      ? parse[1].split('<>')[1].trim()
                      : ''
                };
                if (p.iframe === 'iframe') {
                  if (movie_custom.type === '1') {
                    movie_custom.season =
                      (req.body &&
                        req.body['season'] &&
                        parseInt(req.body['season'].replace(/[^0-9]/g, ''))) ||
                      '1';
                    movie_custom.episode =
                      (req.body &&
                        req.body['episode'] &&
                        parseInt(req.body['episode'].replace(/[^0-9]/g, ''))) ||
                      '1';
                  }
                  if (p.url.indexOf('[imdb_id]') + 1 && !movie_custom.imdb_id) {
                    continue;
                  }
                  if (p.url.indexOf('[tmdb_id]') + 1 && !movie_custom.tmdb_id) {
                    continue;
                  }
                  if (
                    p.url.indexOf('[douban_id]') + 1 &&
                    !movie_custom.douban_id
                  ) {
                    continue;
                  }
                  if (
                    p.url.indexOf('[tvmaze_id]') + 1 &&
                    !movie_custom.tvmaze_id
                  ) {
                    continue;
                  }
                  if (p.url.indexOf('[wa_id]') + 1 && !movie_custom.wa_id) {
                    continue;
                  }
                  if (
                    p.url.indexOf('[movie_id]') + 1 &&
                    !movie_custom.movie_id
                  ) {
                    continue;
                  }
                  if (p.url.indexOf('[season]') + 1 && !movie_custom.season) {
                    continue;
                  }
                  if (p.url.indexOf('[episode]') + 1 && !movie_custom.episode) {
                    continue;
                  }
                  p.url = p.url
                    .replace(
                      /\[kp_id]/,
                      movie.kp_id && parseInt(movie.kp_id)
                        ? '' + (parseInt(movie.kp_id) % 1000000000)
                        : ''
                    )
                    .replace(
                      /\[imdb_id]/,
                      movie_custom.imdb_id ? movie_custom.imdb_id : ''
                    )
                    .replace(
                      /\[tmdb_id]/,
                      movie_custom.tmdb_id ? movie_custom.tmdb_id : ''
                    )
                    .replace(
                      /\[douban_id]/,
                      movie_custom.douban_id ? movie_custom.douban_id : ''
                    )
                    .replace(
                      /\[tvmaze_id]/,
                      movie_custom.tvmaze_id ? movie_custom.tvmaze_id : ''
                    )
                    .replace(
                      /\[wa_id]/,
                      movie_custom.wa_id ? movie_custom.wa_id : ''
                    )
                    .replace(
                      /\[movie_id]/,
                      movie_custom.movie_id ? movie_custom.movie_id : ''
                    )
                    .replace(
                      /\[year]/,
                      movie_custom.year ? movie_custom.year : ''
                    )
                    .replace(
                      /\[type]/,
                      movie_custom.type ? movie_custom.type : ''
                    )
                    .replace(
                      /\[title]/,
                      movie_custom.title
                        ? encodeURIComponent(movie_custom.title)
                        : ''
                    );
                  players.push(p.url);
                }
              }
            }
            if (players.length) {
              current_movie = {};
              for (var i = 0; i < players.length; i++) {
                var reg_player = players[i].match(/^(.*?)(http.*|\/\/.*)$/i);
                if (!reg_player || !reg_player[2]) continue;
                var iframe = reg_player[2];
                var name = reg_player[1].trim()
                  ? reg_player[1].trim().replace('{N}', i)
                  : 'PLAYER ' + i;
                current_movie[name.toLowerCase()] = {
                  iframe: iframe,
                  translate: '',
                  quality: ''
                };
              }
            }
          } else {
            current_movie = {
              iframe:
                config.protocol +
                config.subdomain +
                config.domain +
                '/iframe/' +
                (query.id.replace('custom.', '') +
                  (query[query.id] ? query[query.id] : '')) +
                (movie && movie.type && movie.type.toString() === '1'
                  ? '?type=' + movie.type
                  : ''),
              translate: rt[0].translate,
              quality: rt[0].quality
            };
          }
          return callback('STOP');
        }
        return callback();
      });
    },
    function() {
      if (!current_movie) {
        return res.status(404).json({});
      }
      if (player) {
        return res.status(200).json(current_movie);
      }
      return res.status(200).json({
        results: [current_movie]
      });
    }
  );
});

function getIp(req) {
  var ips = req.ips || [];
  var ip = '';
  if (req.header('x-forwarded-for')) {
    req
      .header('x-forwarded-for')
      .split(',')
      .forEach(function(one_ip) {
        if (ips.indexOf(one_ip.trim()) === -1) {
          ips.push(one_ip.trim());
        }
      });
  }
  if (req.header('x-real-ip')) {
    req
      .header('x-real-ip')
      .split(',')
      .forEach(function(one_ip) {
        if (ips.indexOf(one_ip.trim()) === -1) {
          ips.push(one_ip.trim());
        }
      });
  }
  if (req.connection.remoteAddress) {
    req.connection.remoteAddress.split(',').forEach(function(one_ip) {
      if (ips.indexOf(one_ip.trim()) === -1) {
        ips.push(one_ip.trim());
      }
    });
  }
  ips.forEach(function(one_ip) {
    if (ip) return;
    one_ip = one_ip.replace('::ffff:', '');
    if (
      one_ip !== '127.0.0.1' &&
      /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/.test(
        one_ip
      )
    ) {
      ip = one_ip;
    }
  });
  return ip;
}

module.exports = router;
