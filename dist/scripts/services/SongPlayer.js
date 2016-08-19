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
		
		/** @function SongPlayer.play(song)
		 * @desc If the currently playing song is not the same as the user click==> setSong 	and play, and change playing boolean status to true;
		 * @param {Object} song
		 */
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
		/**
		 * @function SongPlayer.pause(song)
		 * @desc Stops currently playing song and set the playing boolean to false 
		*/
		SongPlayer.pause =function(song){
			currentBuzzObject.pause();
			song.playing =false;
		};
		
		/**
		 * @function SongPlayer.playSong(song)
		 * @desc play currently playing song and set the playing boolean to true; 
		*/
		
		SongPlayer.playSong = function(song){
			
			currentBuzzObject.play();
			song.playing =true;
			
		};


		return SongPlayer;
	}

	angular
		.module('blocJams')
		.factory('SongPlayer', SongPlayer);



})();
