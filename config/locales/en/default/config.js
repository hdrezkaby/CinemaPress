module.exports = {
    "database": {
        "host": "localhost",
        "port": 3306,
        "all_movies": "example.com",
        "key": "FREE",
        "date": ""
    },
    "protocol": "http://",
    "subdomain": "",
    "botdomain": "",
    "botdomains": "",
    "domain": "example.com",
    "bomain": "",
    "alt": {
        "botdomain": "",
        "bomain": ""
    },
    "ru": {
        "domain": "",
        "subdomain": "",
        "bomain": "",
        "botdomain": "",
        "random": 0
    },
    "mirrors": [],
    "rotate": {
        "list": [],
        "area": ["domain.for.bots", "domain2.for.bots", "domain.for.ru.bots"]
    },
    "dns": {
        "cloudflare": {
            "email": "",
            "key": "",
            "proxied": "true"
        }
    },
    "realtime": {
        "only_realtime": 0
    },
    "bots": [
        "google ~ googlebot.com,google.com ~ ~ Fake Google Bot!",
        "yandex ~ yandex.ru,yandex.net,yandex.com ~ ~ Fake Yandex Bot!",
        "bing ~ search.msn.com ~ ~ Fake Bing Bot!",
        "yahoo ~ crawl.yahoo.net ~ ~ Fake Yahoo Bot!",
        "baidu ~ baidu.com,baidu.jp ~ ~ Fake Baidu Bot!",
        "duckduckgo ~ ~ 20.191.45.212,23.21.227.69,40.88.21.235,50.16.241.113,50.16.241.114,50.16.241.117,50.16.247.234,52.204.97.54,52.5.190.19,54.197.234.188,54.208.100.253,54.208.102.37,107.21.1.8 ~ Fake DuckDuckGo Bot!",
        "mail.ru ~ mail.ru ~ ~ Fake Mail Bot!"
    ],
    "user_bot": 0,
    "defense": {
        "domain": 2,
        "domain_key": 2,
        "domain_ex": ["domain.for.people", "domain.for.ru.people", "domain.for.mobile", "domain.for.tv", "domain.for.app", "domain.for.ftp", "domain.for.www"],
        "agent": 0,
        "message": "We've noticed suspicious activity, please check."
    },
    "blacklist": 0,
    "email": "support@example.com",
    "theme": "default",
    "country": "US",
    "language": "en",
    "random": 0,
    "homepage": "example.com",
    "redirect": {
        "from": [],
        "to": []
    },
    "geolite2": {
        "countries": ["Netherlands"],
        "ips": []
    },
    "image": {
        "save": 1
    },
    "cache": {
        "time": 3600,
        "ver": 0
    },
    "pagespeed": 0,
    "loadavg": {
        "one": 2400,
        "five": 1800,
        "fifteen": 1200,
        "message": "The server is overloaded by [percent] please come back later."
    },
    "publish": {
        "start": 298,
        "stop": 10000000,
        "every": {
            "hours": 0,
            "movies": 0
        },
        "text": 0,
        "required": [
            "poster"
        ],
        "thematic": {
            "type": "",
            "year": "",
            "genre": "",
            "country": "",
            "actor": "",
            "director": "",
            "query_id": "",
            "search": "",
            "kp_vote": 0,
            "imdb_vote": 0
        },
        "indexing": {
            "condition": ""
        }
    },
    "default": {
        "count": 15,
        "sorting": "imdb-vote-up",
        "sorting_search": "",
        "pages": 4,
        "lastpage": 0,
        "days": 0,
        "image": "/themes/default/public/desktop/img/player.png",
        "votes": {
            "kp": 5000,
            "imdb": 5000
        },
        "people_image": 0,
        "people_image_domain": "",
        "donotuse": ["actor", "director", "search"],
        "categories": {
            "countries": ["USA", "France", "Japan", "United Kingdom", "Spain", "Italy", "Canada", "India", "Germany", "Turkey"],
            "genres": ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Sci-Fi", "Thriller", "TV Movie", "War", "Western"],
            "years": ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000"]
        },
        "types": {
            "movie": "!Animation !Documentary !Music",
            "serial": "!Animation",
            "mult": "Animation",
            "multserial": "Animation",
            "anime": "Animation",
            "anime_country": "Japan",
            "tv": "TV | Documentary | Music"
        },
        "moment": "DD MMM YYYY",
        "loc": 2000,
        "tag": 2000,
        "tags": {
            "list": ["year", "genre"],
            "format": "[Type] [year] [genre] [country]"
        }
    },
    "movies": {
        "cron": [
            "1 ~ https://api.themoviedb.org/3/movie/popular?api_key=af6887753365e14160254ac7f4345dd2 ~ results.0.id ~ https://api.themoviedb.org/3/movie/[id]?language=en-US&append_to_response=credits,external_ids&api_key=af6887753365e14160254ac7f4345dd2 ~ external_ids.imdb_id <> custom.imdb_id ~ \"movie\" <> type ~ backdrop_path <> pictures ~ poster_path <> poster! ~ release_date <> premiere! ~ title <> title_en ~ overview <> description ~ genres.0.name <> genre ~ credits.cast.0.name <> actor <> 5 ~ credits.crew.0.name <> director <> 5 <> job == Director ~ production_countries.0.iso_3166_1 <> country",
            "1 ~ https://api.themoviedb.org/3/tv/popular?api_key=af6887753365e14160254ac7f4345dd2 ~ results.0.id ~ https://api.themoviedb.org/3/tv/[id]?language=en-US&append_to_response=credits,external_ids&api_key=af6887753365e14160254ac7f4345dd2 ~ external_ids.imdb_id <> custom.imdb_id ~ \"tv\" <> type ~ backdrop_path <> pictures ~ poster_path <> poster! ~ first_air_date <> premiere! ~ name <> title_en ~ overview <> description ~ genres.0.name <> genre ~ credits.cast.0.name <> actor <> 5 ~ credits.crew.0.name <> director <> 5 <> job == Director ~ origin_country.0 <> country",
            "1 ~ https://api.themoviedb.org/3/movie/upcoming?api_key=af6887753365e14160254ac7f4345dd2 ~ results.0.id ~ https://api.themoviedb.org/3/movie/[id]?language=en-US&append_to_response=credits,external_ids&api_key=af6887753365e14160254ac7f4345dd2 ~ external_ids.imdb_id <> custom.imdb_id ~ \"movie\" <> type ~ backdrop_path <> pictures ~ poster_path <> poster! ~ release_date <> premiere! ~ title <> title_en ~ overview <> description ~ genres.0.name <> genre ~ credits.cast.0.name <> actor <> 5 ~ credits.crew.0.name <> director <> 5 <> job == Director ~ production_countries.0.iso_3166_1 <> country",
            "1 ~ https://api.tvmaze.com/schedule/web ~ ~ ~ _embedded.show.externals.imdb <> custom.imdb_id ~ _embedded.show.name <> title_en ~ _embedded.show.image.original <> poster! ~ _embedded.show.premiered <> premiere ~ \"tv\" <> type ~ _embedded.show.network.country.code <> country ~ _embedded.show.summary <> description ~ _embedded.show.genres <> genre",
            "1 ~ https://api.tvmaze.com/schedule ~ ~ ~ show.externals.imdb <> custom.imdb_id ~ show.name <> title_en ~ show.image.original <> poster! ~ show.premiered <> premiere ~ \"tv\" <> type ~ show.network.country.code <> country ~ show.summary <> description ~ show.genres <> genre",
            "1 ~ lastmod_movie ~ custom.imdb_id ~ https://api.themoviedb.org/3/find/tt[imdb_id]?external_source=imdb_id&api_key=af6887753365e14160254ac7f4345dd2 ~ movie_results.0.id <> custom.tmdb_id <> 1",
            "1 ~ lastmod_tv ~ custom.imdb_id ~ https://api.themoviedb.org/3/find/tt[imdb_id]?external_source=imdb_id&api_key=af6887753365e14160254ac7f4345dd2 ~ tv_results.0.id <> custom.tmdb_id <> 1",
            "1 ~ lastmod_tv ~ custom.imdb_id ~ https://api.tvmaze.com/lookup/shows?imdb=tt[imdb_id] ~ id <> custom.tvmaze_id",
            "1 ~ lastmod_tv ~ custom.tmdb_id ~ https://api.themoviedb.org/3/tv/[id]?language=en-US&append_to_response=credits,external_ids&api_key=af6887753365e14160254ac7f4345dd2 ~ external_ids.imdb_id <> custom.imdb_id ~ \"tv\" <> type ~ backdrop_path <> pictures ~ poster_path <> poster! ~ first_air_date <> premiere ~ name <> title_en ~ overview <> description ~ genres.0.name <> genre ~ credits.cast.0.name <> actor <> 5 ~ credits.crew.0.name <> director <> 5 <> job == Director ~ origin_country.0 <> country",
            "1 ~ lastmod_movie ~ custom.tmdb_id ~ https://api.themoviedb.org/3/movie/[id]?language=en-US&append_to_response=credits,external_ids&api_key=af6887753365e14160254ac7f4345dd2 ~ external_ids.imdb_id <> custom.imdb_id ~ \"movie\" <> type ~ backdrop_path <> pictures ~ poster_path <> poster! ~ release_date <> premiere ~ title <> title_en ~ overview <> description ~ genres.0.name <> genre ~ credits.cast.0.name <> actor <> 5 ~ credits.crew.0.name <> director <> 5 <> job == Director ~ production_countries.0.iso_3166_1 <> country",
            "0 ~ https://api.themoviedb.org/3/movie/popular?api_key=af6887753365e14160254ac7f4345dd2&page=[page][27] ~ results.0.id ~ https://api.themoviedb.org/3/movie/[id]?language=en-US&append_to_response=credits,external_ids&api_key=af6887753365e14160254ac7f4345dd2 ~ external_ids.imdb_id <> custom.imdb_id ~ \"movie\" <> type ~ backdrop_path <> pictures ~ poster_path <> poster! ~ release_date <> premiere! ~ title <> title_en ~ overview <> description ~ genres.0.name <> genre ~ credits.cast.0.name <> actor <> 5 ~ credits.crew.0.name <> director <> 5 <> job == Director ~ production_countries.0.iso_3166_1 <> country ~ vote_average <> rating ~ vote_count <> vote",
            "0 ~ https://api.themoviedb.org/3/tv/popular?api_key=af6887753365e14160254ac7f4345dd2&page=[page][27] ~ results.0.id ~ https://api.themoviedb.org/3/tv/[id]?language=en-US&append_to_response=credits,external_ids&api_key=af6887753365e14160254ac7f4345dd2 ~ external_ids.imdb_id <> custom.imdb_id ~ \"tv\" <> type ~ backdrop_path <> pictures ~ poster_path <> poster! ~ first_air_date <> premiere! ~ name <> title_en ~ overview <> description ~ genres.0.name <> genre ~ credits.cast.0.name <> actor <> 5 ~ credits.crew.0.name <> director <> 5 <> job == Director ~ origin_country.0 <> country ~ vote_average <> rating ~ vote_count <> vote",
            "0 ~ lastmod_movie ~ custom.imdb_id ~ https://api.themoviedb.org/3/find/tt[imdb_id]?external_source=imdb_id&api_key=af6887753365e14160254ac7f4345dd2 ~ movie_results.0.id <> custom.tmdb_id <> 1",
            "0 ~ lastmod_tv ~ custom.imdb_id ~ https://api.themoviedb.org/3/find/tt[imdb_id]?external_source=imdb_id&api_key=af6887753365e14160254ac7f4345dd2 ~ tv_results.0.id <> custom.tmdb_id <> 1",
            "0 ~ lastmod_tv ~ custom.imdb_id ~ https://api.tvmaze.com/lookup/shows?imdb=tt[imdb_id] ~ id <> custom.tvmaze_id",
            "0 ~ https://datasets.imdbws.com/title.ratings.tsv.gz ~ ~ ~ tconst <> custom.imdb_id ~ averageRating <> imdb_rating ~ numVotes <> imdb_vote",
            "720 ~ https://datasets.imdbws.com/title.ratings.tsv.gz ~ ~ ~ tconst <> custom.imdb_id ~ averageRating <> imdb_rating ~ numVotes <> imdb_vote"
        ],
        "proxy": [],
        "cookies": "",
        "skip": [],
        "id": ""
    },
    "codes": {
        "head": "",
        "footer": "<script>window.lazyLoadOptions = {};</script>\n<script async src='https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.3.0/dist/lazyload.min.js'></script>",
        "robots": "User-agent: *\nDisallow: /\nDisallow: /type/*/*\nDisallow: /type-*/*\nDisallow: /movie/*/*\nDisallow: /movie-*/*\nDisallow: /year/*/*\nDisallow: /year-*/*\nDisallow: /genre/*/*\nDisallow: /genre-*/*\nDisallow: /country/*/*\nDisallow: /country-*/*\nDisallow: /director/*/*\nDisallow: /director-*/*\nDisallow: /actor/*/*\nDisallow: /actor-*/*\nDisallow: /search\nDisallow: /*?sorting*\nDisallow: /*?tag*\nDisallow: /*?q*\nDisallow: /*?random*\nDisallow: /*?PageSpeed*\nDisallow: /*?desktop*\nDisallow: /*?year*\nDisallow: /*?genre*\nDisallow: /*?country*\nDisallow: /iframe\nDisallow: /noindex\nDisallow: /mobile-version/type/*/*\nDisallow: /mobile-version/type-*/*\nDisallow: /mobile-version/movie/*/*\nDisallow: /mobile-version/movie-*/*\nDisallow: /mobile-version/year/*/*\nDisallow: /mobile-version/year-*/*\nDisallow: /mobile-version/genre/*/*\nDisallow: /mobile-version/genre-*/*\nDisallow: /mobile-version/country/*/*\nDisallow: /mobile-version/country-*/*\nDisallow: /mobile-version/director/*/*\nDisallow: /mobile-version/director-*/*\nDisallow: /mobile-version/actor/*/*\nDisallow: /mobile-version/actor-*/*\nDisallow: /mobile-version/search\nDisallow: /mobile-version/*?sorting*\nDisallow: /mobile-version/*?tag*\nDisallow: /mobile-version/*?q*\nDisallow: /mobile-version/*?random*\nDisallow: /mobile-version/*?PageSpeed*\nDisallow: /mobile-version/*?desktop*\nDisallow: /mobile-version/*?year*\nDisallow: /mobile-version/*?genre*\nDisallow: /mobile-version/*?country*\nDisallow: /mobile-version/iframe\nDisallow: /mobile-version/noindex\nDisallow: /tv-version\nDisallow: /admin*"
    },
    "index": {
        "type": {
            "name": "Top [type]",
            "keys": "",
            "sorting": "imdb-rating-up",
            "count": 15,
            "order": 2
        },
        "year": {
            "name": "Top movies from [year]",
            "keys": "2021",
            "sorting": "premiere-up",
            "count": 15,
            "order": 3
        },
        "genre": {
            "name": "Top movies from [genre]",
            "keys": "",
            "sorting": "imdb-vote-up",
            "count": 10,
            "order": 4
        },
        "country": {
            "name": "Top movies from [country]",
            "keys": "",
            "sorting": "imdb-rating-up",
            "count": 10,
            "order": 5
        },
        "actor": {
            "name": "Top movies with [actor]",
            "keys": "",
            "sorting": "imdb-vote-up",
            "count": 10,
            "order": 6
        },
        "director": {
            "name": "Top movies with [director]",
            "keys": "",
            "sorting": "imdb-vote-up",
            "count": 10,
            "order": 7
        },
        "ids": {
            "name": "New movies",
            "keys": "",
            "count": 10,
            "order": 1
        },
        "count": {
            "type": "year",
            "key": "2021",
            "sorting": "premiere-up"
        },
        "link": 0
    },
    "titles": {
        "index": "Information catalog of movies",
        "year": "[year] Movies [sorting] [page]",
        "years": "Movies by year",
        "genre": "[genre] Movies [sorting] [page]",
        "genres": "Movies by genre",
        "country": "[country] Movies [sorting] [page]",
        "countries": "Films by country",
        "actor": "[actor] Movies [sorting] [page]",
        "actors": "Most popular actors",
        "director": "[director] Directed Movies [sorting] [page]",
        "directors": "Most popular directors",
        "type": "[Type] [year] [genre] [country] [sorting] [page]",
        "search": "(X) { [Type] +? [year] +? [Genre] +? [Country] +? [sorting] [page] }\n(default) { Search «[search]» [sorting] [page] }",
        "num": "on page [num]",
        "movie": {
            "movie": "(movies) { Movie «[title]» }\n(series) { TV-Series «[title]» }\n(cartoons) { Cartoon «[title]» }\n(animated) { Animated «[title]» }\n(anime) { Anime «[title]» }\n(tv) { TV-show «[title]» }\n(default) { «[title]» }",
            "online": "[title] online",
            "download": "[title] download",
            "trailer": "[title] trailer",
            "picture": "[title] picture"
        },
        "sorting": {
            "kinopoisk-rating-up": "sorted by rating KP",
            "kinopoisk-rating-down": "sorted by rating KP",
            "imdb-rating-up": "sorted by rating IMDb",
            "imdb-rating-down": "sorted by rating IMDb",
            "kinopoisk-vote-up": "sorted by popularity on KP",
            "kinopoisk-vote-down": "sorted by popularity on KP",
            "imdb-vote-up": "sorted by popularity on IMDb",
            "imdb-vote-down": "sorted by popularity on IMDb",
            "year-up": "sorted by year",
            "year-down": "sorted by year",
            "premiere-up": "sorted by premiere",
            "premiere-down": "sorted by premiere"
        }
    },
    "h1": {
        "index": "All movies in the world",
        "year": "[year] Movies [sorting] [page]",
        "years": "Movies by year",
        "genre": "[genre] Movies [sorting] [page]",
        "genres": "Movies by genre",
        "country": "[country] Movies [sorting] [page]",
        "countries": "Films by country",
        "actor": "[actor] Movies [sorting] [page]",
        "actors": "Most popular actors",
        "director": "[director] Directed Movies [sorting] [page]",
        "directors": "Most popular directors",
        "type": "[Type] [year] [genre] [country] [sorting] [page]",
        "search": "(X) { [Type] +? [year] +? [Genre] +? [Country] +? [sorting] [page] }\n(default) { Search «[search]» [sorting] [page] }",
        "num": "on page [num]",
        "movie": {
            "movie": "[title] [year]",
            "online": "[title] [year] online",
            "download": "[title] [year] download",
            "trailer": "[title] [year] trailer",
            "picture": "[title] [year] picture"
        },
        "sorting": {
            "kinopoisk-rating-up": "sorted by rating KP",
            "kinopoisk-rating-down": "sorted by rating KP",
            "imdb-rating-up": "sorted by rating IMDb",
            "imdb-rating-down": "sorted by rating IMDb",
            "kinopoisk-vote-up": "sorted by popularity on KP",
            "kinopoisk-vote-down": "sorted by popularity on KP",
            "imdb-vote-up": "sorted by popularity on IMDb",
            "imdb-vote-down": "sorted by popularity on IMDb",
            "year-up": "sorted by year",
            "year-down": "sorted by year",
            "premiere-up": "sorted by premiere",
            "premiere-down": "sorted by premiere"
        }
    },
    "descriptions": {
        "index": "How many films have you seen at the moment? Most likely, quite a few, several hundred, and maybe thousands, if you are an avid moviegoer and do not imagine an evening, without viewing one or several films. Either you probably very much like serials and spend the evenings watching several series of an entertaining series. Whatever it was, We are very pleased that you have chosen our site as a platform for discussion and discussion with the same film enthusiasts as you. Sit back comfortably, make tea and start <span style='text-decoration:line-through'>screaming</span> criticism :)",
        "year": "[year] Movies",
        "years": "Movies by year",
        "genre": "[genre] Movies",
        "genres": "Movies by genre",
        "country": "[country] Movies",
        "countries": "Films by country",
        "actor": "[actor] Movies",
        "actors": "Most popular actors",
        "director": "[director] Directed Movies",
        "directors": "Most popular directors",
        "type": "[Type] [year] [genre] [country]",
        "search": "(X) { [Type] +? [year] +? [Genre] +? [Country] }\n(default) { Search «[search]» }",
        "movie": {
            "movie": "The picture «[title]» was released in [year] year and immediately won the attention of viewers in different parts of the earth. Film genre [genre] has always been very popular, moreover, when they are shot by such eminent directors as [director]. The country that put a hand to this film is considered [country], because viewers can already approximately imagine the level of [color|logic|art|pictures] for similar creations.",
            "online": "[title] online",
            "download": "[title] download",
            "trailer": "[title] trailer",
            "picture": "[title] picture"
        }
    },
    "sorting": {
        "kinopoisk-rating-up": "",
        "kinopoisk-rating-down": "",
        "imdb-rating-up": "Rated IMDb ⬆",
        "imdb-rating-down": "Rated IMDb ⬇",
        "kinopoisk-vote-up": "",
        "kinopoisk-vote-down": "",
        "imdb-vote-up": "Popularity IMDb ⬆",
        "imdb-vote-down": "Popularity IMDb ⬇",
        "year-up": "Year ⬆",
        "year-down": "Year ⬇",
        "premiere-up": "Premiere ⬆",
        "premiere-down": "Premiere ⬇"
    },
    "urls": {
        "prefix_id": "id",
        "unique_id": 0,
        "separator": "-",
        "translit": 0,
        "translit_from": "",
        "translit_to": "",
        "translit_lower_case": 0,
        "movie_url": "[prefix_id][separator][title]",
        "movie": "movie",
        "year": "year",
        "genre": "genre",
        "country": "country",
        "actor": "actor",
        "director": "director",
        "type": "type",
        "search": "search",
        "sitemap": "sitemap",
        "admin": "admin-secret",
        "types": {
            "serial": "series",
            "movie": "movies",
            "mult": "cartoons",
            "multserial": "animated",
            "tv": "tv",
            "anime": "anime"
        },
        "movies": {
            "online": "",
            "download": "",
            "trailer": "",
            "picture": ""
        },
        "noindex": "",
        "slash": "-"
    },
    "l": {
        "more": "More",
        "home": "Home",
        "information": "Information",
        "online": "Online",
        "download": "Download",
        "trailer": "Trailer",
        "picture": "Picture",
        "episode": "Episode",
        "movies": "Movies",
        "series": "Series",
        "cartoons": "Cartoons",
        "animated": "Animated",
        "tv": "TV",
        "anime": "Anime",
        "collection": "Collection",
        "collections": "Collections",
        "season": "Season",
        "year": "Year",
        "years": "Years",
        "genre": "Genre",
        "genres": "Genres",
        "actor": "Actor",
        "actors": "Actors",
        "director": "Director",
        "directors": "Directors",
        "country": "Country",
        "countries": "Countries",
        "quality": "Quality",
        "translate": "Translate",
        "premiere": "Premiere",
        "rating": "Rating",
        "kp": "KP",
        "imdb": "IMDb",
        "episodes": "episodes",
        "storyline": "Storyline",
        "later": "Watch later",
        "continue": "Continue",
        "saved": "Saved",
        "allCategories": "All categories",
        "allYears": "All years",
        "allGenres": "All genres",
        "allCountries": "All countries",
        "allActors": "All actors",
        "allDirectors": "All directors",
        "watched": "You recently watched",
        "search": "Search",
        "share": "Share",
        "subscribe": "Subscribe",
        "vk": "VK",
        "facebook": "facebook",
        "twitter": "Twitter",
        "google": "Google",
        "telegram": "Telegram",
        "youtube": "YouTube",
        "instagram": "Instagram",
        "up": "Up",
        "soon": "Coming soon",
        "contacts": "Contacts",
        "news": "News",
        "menu": "Menu",
        "comments": "Comments",
        "movieTitle": "Movie title",
        "votes": "votes",
        "hide": "Hide",
        "navigation": "Navigation",
        "and": "and",
        "overall": "Overall",
        "premieres": "Premieres",
        "popular": "Popular",
        "top": "Top",
        "sorting": "Sorting",
        "tags": "Tags",
        "mentions": "Mentions",
        "said": "said",
        "full": "Full version",
        "original": "Original",
        "submit": "Submit",
        "like": "Like",
        "dislike": "Dislike",
        "reply": "Reply",
        "bold": "bold",
        "italic": "italic",
        "spoiler": "spoiler",
        "username": "User name",
        "yes": "Yes",
        "not": "Not",
        "comment": "Comment...",
        "notFound": "This page is not on the site. Maybe you made a mistake in the URL or it is an internal site error, which the administrator already knows and is taking steps to fix it.",
        "notMobile": "Mobile version of the site is not activated. The site adapts to the screen and is equally beautifully displayed, both on large screens and on mobile devices running iOS, Android or WindowsPhone.",
        "notTv": "TV version of the site is not activated.",
        "lucky": "I'm Feeling Lucky",
        "random": "Random movie from category",
        "results": "All results",
        "moreEpisodes": "show more episodes",
        "downloading": "Download",
        "safety": "Safety",
        "instruction": "Instruction",
        "legal": "Images/videos may be subject to copyright. Learn More",
        "reset": "Reset",
        "filter": "Filter"
    }
};