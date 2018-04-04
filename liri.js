// Declaring the Global Variables and Requiring the Packages
require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');
var moment = require('moment');
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);
var a = process.argv;

// This function will access the user by screen name in this case it will be 'bossbob401' then it will grab the last 20 tweets and console log the tweet and time it was posted
function myTweets(){
    twitter.get('statuses/user_timeline', { screen_name: 'bossbob401', count: 20}).then(function(tweets){
        tweets.forEach(function(tweet){
            console.log(tweet.created_at, tweet.text);
        })
    })
}

function spotifyInfo(songName){
    spotify.search({ type: 'track', query: songName, limit: 1}, function(err, data){
        if(err){
            return console.log(err);
        }
        var song = data.tracks.items[0];
        song.artists.forEach(function(artist){
            console.log(artist.name);
        })
        console.log(song.name);
        console.log(song.preview_url);
        console.log(song.album.name);
    });
}

function movieInfo(movieName){
    var url = 'http://www.omdbapi.com/?apikey=' + keys.omdb.key;
    url = url + '&t=' + movieName;
    request(url, function(error, response, body){
        if(error){
            return console.log(error);
        }
        var data = JSON.parse(body);
        console.log(data.Title);
        console.log(data.Year);
        console.log(data.imdbRating);
        data.Ratings.forEach(function(rating){
            if(rating.Source === 'Rotten Tomatoes'){
                console.log(rating.Value);
            }
        })
        console.log(data.Country);
        console.log(data.Language);
        console.log(data.Actors);
        console.log(data.Plot);
    })
}

function doWhatItSays(it, says){
    if(it === 'my-tweets'){
        myTweets();
    }else if(it === 'spotify-this-song' && says){
        spotifyInfo(says);
    }else if(it === 'spotify-this-song'){
        spotifyInfo('The Sign, Ace of Base');
    }else if(it === 'movie-this' && says){
        movieInfo(says);
    }else if(it === 'movie-this'){
        movieInfo('Mr. Nobody');
    }else if(a[2] === 'do-what-it-says'){
        fs.readFile('./random.txt', 'utf8', function(err, data){
            if(err){
                return console.log(err);
            }
            var dataArr = data.split(',');
            doWhatItSays(dataArr[0], dataArr[1]);
        })
    }
}

doWhatItSays(a[2], a[3]);