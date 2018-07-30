require("dotenv").config();

var keys = require("./keys.js");

var request = require('request');
var Spotify = require("node-spotify-api")
var fs = require('fs');

var userAction = process.argv[2];
var userQuery = process.argv[3];


switch (userAction) {

	case "spotify-this-song":
	spotify(userQuery);
	break;

	case "movie-this":
	movie(userQuery);
	break;

	case "do-what-it-says":
	justDoIt();
	break;
};

function spotify(userQuery) {

	var spotify = new Spotify(keys.spotify);
		if (!userQuery){
        	userQuery = 'The Sign';
    	}
		spotify.search({ type: 'track', query: userQuery }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }

	        var songInfo = data.tracks.items;
            console.log("Artist(s): " + songInfo[0].artists[0].name + "\nSong Name: " + songInfo[0].name +
            "\nPreview Link: " + songInfo[0].preview_url + "\nAlbum: " + songInfo[0].album.name);
	});
}

function movie(userQuery) {

	var queryUrl = "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=96a1c871";

	request(queryUrl, function(error, response, body) {
		if (!userQuery){
        	userQuery = 'Mr Nobody';
    	}
		if (!error && response.statusCode === 200) {

            console.log("Title: " + JSON.parse(body).Title + "\nRelease Year: " + JSON.parse(body).Year +
            "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value +
            "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + 
            "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors);
		}
	});
};

function justDoIt() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		var dataArr = data.split(",");
 
		if (dataArr[0] === "spotify-this-song") {
			var songName = dataArr[1].slice(1, -1);
			spotify(songName);
		}  else if(dataArr[0] === "movie-this") {
			var movieName = dataArr[1].slice(1, -1);
			movie(movieName);
		} 
		
  	});

};
