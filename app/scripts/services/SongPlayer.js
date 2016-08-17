(function () {
	function SongPlayer() {

		var SongPlayer = {};
		
		/**
		 * @desc Buzz object audio file
		 * @type {Object}
		 */
		var currentSong = null;
		var currentBuzzObject = null;
		
		//update currentSong to the song we want to play
		 /**
		 * @function setSong
		 * @desc Stops currently playing song and loads new audio file as currentBuzzObject
		 * @param {Object} song
		 */
		var setSong = function(song) {
			if (currentBuzzObject) {
				currentBuzzObject.stop();
				currentSong.playing = null;
			}

			currentBuzzObject = new buzz.sound(song.audioUrl, {
				formats: ['mp3'],
				preload: true
			});

			currentSong = song;
 		};
		
		//play
		SongPlayer.play = function (song) {

			//If the currently playing song is not the same as the song the user clicks on

			if (currentSong !== song) {
				
				setSong(song);
				currentBuzzObject.play(); // Buzz's own play method 
				song.playing=true;

			} else if (currentSong == song) {

				if (currentBuzzObject.isPaused()) {
					currentBuzzObject.play();
					song.playing=true;
					

				}

			}
		};
		
		//Pause
		
		SongPlayer.pause =function(song){
			currentBuzzObject.pause();
			song.playing =false;
		};
		


		return SongPlayer;
	}

	angular
		.module('blocJams')
		.factory('SongPlayer', SongPlayer);



})();
