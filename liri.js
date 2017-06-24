var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keyFile = require("./keys.js");
var colors = require("colors");
var fs = require("fs");
var request = require("request");
var action = process.argv[2];
var nodArg = process.argv;
var userinput = "";
for (i = 3; i < nodArg.length; i++) {
	userinput = userinput + " " + nodArg[i];
}

function instructions() {
	console.log("Liri is a command prompt application that was implemented in node.js it takes user-commands and give them responses".blue);
	console.log("How to use Liri ".inverse);
	console.log("1- type the command (my-tweets) followed by any word or username Liri will give you the latest 20 tweets".green);
	console.log("2- type the command (spotify-this-song) followed by the name of the song  liri will give you back Details about it ".green);
	console.log("3- type the command (movie-this) followed by any Movie name Liri will give you back details about it".green);
	console.log("4- type the command (tweet to update a status in twitter".green);
	console.log("5- type the command (do-what-it-says) liri will choose a random function to run ".green);
}
switch (action) {
	case "my-tweets":
		twitter();
		break;
	case "update-twitter-status":
		tweet();
		break;
	case "spotify-this-song":
		spotify();
		break;
	case "movie-this":
		omdb();
		break;
	case "do-what-it-says":
		random();
		break;
	case "instructions":
		instructions();
		break;
}

function instructions() {
	console.log("Liri is a command prompt application that was implemented in node.js it takes user-commands and give them responses".blue);
	console.log("How to use Liri ".inverse);
	console.log("1- type the command (my-tweets) followed by any word or username Liri will give you the latest 20 tweets".green);
	console.log("2- type the command (spotify-this-song) followed by the name of the song  liri will give you back Details about it ".green);
	console.log("3- type the command (movie-this) followed by any Movie name Liri will give you back details about it".green);
	console.log("4- type the command (tweet to update a status in twitter".green);
	console.log("5- type the command (do-what-it-says) liri will choose a random function to run ".green);
}

function twitter() {
	var client = new Twitter({
		consumer_key: keyFile.twitterKeys.consumer_key,
		consumer_secret: keyFile.twitterKeys.consumer_secret,
		access_token_key: keyFile.twitterKeys.access_token_key,
		access_token_secret: keyFile.twitterKeys.access_token_secret
	});
	var params = {
		screen_name: userinput,
		count: 5
	};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		var tweetsArr = [];
		if (!error) {
			//console.log(tweets);
			for (var i = 0; i < params.count; i++) {
				console.log("\r\n" + "#Ta's ".green + tweets[i].text.green);
				tweetsArr.push("Message "+tweets[i].text);
				console.log("----------------------------------------------------------");
				console.log("This tweet was created at ".red + tweets[i].created_at.red);
				tweetsArr.push("Date "+tweets[i].created_at);
				console.log("======================================================");
			}
			for (var i = 0; i < tweetsArr.length; i++) {
				fs.appendFile("log.txt", "\r\n" + tweetsArr[i], function(err) {
					if (err) {
						return console.log(err);
					}
				});
			}
		}
	});
};

function tweet() {
	var client = new Twitter({
		consumer_key: keyFile.twitterKeys.consumer_key,
		consumer_secret: keyFile.twitterKeys.consumer_secret,
		access_token_key: keyFile.twitterKeys.access_token_key,
		access_token_secret: keyFile.twitterKeys.access_token_secret
	});
	client.post('statuses/update', {
		status: userinput
	}, function(error, tweet, response) {
		if (!error) {
			console.log("Twitter status updated successfully");
		}
	});
};


function spotify(songs) {
	var spotify = new Spotify({
		id: keyFile.spotifyKeys.id,
		secret: keyFile.spotifyKeys.secret,
	});
	var songDetails = [];
	if (userinput == "") {
		userinput = "ace of base";
	}

	spotify.search({
			type: 'track',
			query: userinput,
			limit: 1
		},
		function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}
				 
				songDetails.push("--------------------------------------");
				console.log(JSON.stringify("Artist: " + data.tracks.items[0].album.artists[0].name, null, 2));
				 songDetails.push("Artist: "+data.tracks.items[0].album.artists[0].name);
				console.log(JSON.stringify("Song Title: " + data.tracks.items[0].name, null, 2));
				 songDetails.push("Song Title: "+data.tracks.items[0].name);
				console.log(JSON.stringify("Spotify link: " + data.tracks.items[0].external_urls.spotify, null, 2));
				 songDetails.push("Spotify link: " +data.tracks.items[0].external_urls.spotify);
				console.log(JSON.stringify("Album: " + data.tracks.items[0].album.name, null, 2));
				 songDetails.push("Album: " +data.tracks.items[0].album.name);
				console.log("======================================================");

				 for(var i=0 ; i < songDetails.length ; i++)
				 {
				 	fs.appendFile("log.txt", "\r\n" + songDetails[i], function(err) {
					if (err) {
						return console.log(err);
					}
				});
				 }
			
		})
}

function omdb() {
	var movieArray=[];
	if (userinput === "") {
		userinput = "MR.Nobody";
	}
	request("http://www.omdbapi.com/?t=" + userinput + "&apikey=40e9cece&tomatoes=true", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var moviesData = JSON.parse(body);
			movieArray.push("--------------------------------------");
			console.log("\r\n" + "Movie Title: " + moviesData.Title);
			movieArray.push("Movie Title: " +moviesData.Title);
			console.log("\r\n" + "Year: " + moviesData.Year);
			movieArray.push("Year: " +moviesData.Year);
			console.log("\r\n" + "Rating: " + moviesData.imdbRating);
			movieArray.push("Rating: " +moviesData.imdbRating);
			console.log("\r\n" + "Plot: " + moviesData.Plot);
			movieArray.push("Plot: " +moviesData.Plot);
			console.log("\r\n" + "Language: " + moviesData.Language);
			movieArray.push("Language: " + moviesData.Language);
			console.log("\r\n" + "Actors: " + moviesData.Actors);
			movieArray.push("Actors: " +moviesData.Actors);
			console.log("\r\n" + "Tomato URL: " + moviesData.tomatoURL);
			movieArray.push("Tomato URL: " +moviesData.tomatoURL);
			console.log("======================================================");
			
		}
		for(var i=0;i<movieArray.length;i++)
		{
			fs.appendFile("log.txt", "\r\n" + movieArray[i], function(err) {
					if (err) {
						return console.log(err);
					}
				});
		}
	});
}

function random() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		var inputArr = data.split(",");
		spotify(inputArr[1]);
	})
}