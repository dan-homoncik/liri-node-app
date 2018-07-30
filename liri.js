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
    
    // some instructions to help
    default: console.log("\r\n" +"Try typing one of the following commands after 'node liri.js' : " +"\r\n"+
        "1. spotify-this-song 'Song name' "+"\r\n"+
        "2. movie-this 'Movie Name' "+"\r\n"+
        "3. do-what-it-says"+"\r\n"+
        "If the song name is more than one word, please place it in quotations");
};

function spotify(userQuery) {

	var spotify = new Spotify(keys.spotify);
		if (!userQuery){
        	userQuery = "The Veldt";
    	}
		spotify.search({ type: "track", query: userQuery }, function(err, data) {
			if (err){
	            console.log("Error occurred: " + err);
	            return;
	        }

            var songInfo = data.tracks.items;
            songResults = "**********************************" +
            "\nArtist(s): " + songInfo[0].artists[0].name + "\nSong Name: " + songInfo[0].name +
            "\nPreview Link: " + songInfo[0].preview_url + "\nAlbum: " + songInfo[0].album.name +
            "\n**********************************";

            console.log(songResults);
            log(songResults);
	});
}

function movie(userQuery) {

	var queryUrl = "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=96a1c871";

	request(queryUrl, function(error, response, body) {
		if (!userQuery){
        	userQuery = "Logan";
    	}
		if (!error && response.statusCode === 200) {

            var movieResults = "**********************************" + 
            "\nTitle: " + JSON.parse(body).Title + "\nRelease Year: " + JSON.parse(body).Year +
            "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value +
            "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + 
            "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors + 
            "\n**********************************";

            console.log(movieResults);
            log(movieResults);
		} else {
            console.log("Error: " + error);
            return;
        }
	});
};

function justDoIt() {
	fs.readFile("random.txt", "utf8", function(error, data){

		if (error) {
    		return console.log("Error occured: " + error);
  		}

		var dataArr = data.split(",");
 
		if (dataArr[0] === "spotify-this-song") {
			var songName = dataArr[1].slice(1, -1);
			spotify(songName);
		} 
		
  	});

};

function log(logResults) {
    fs.appendFile("log.txt", logResults, (error) => {
      if(error) {
        throw error;
      }
    });
  }