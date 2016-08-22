(function () {
	
	//Every Angular application has just one $rootScope, from which all other scopes inherit. So, any Angular component can access $rootScope variables, events, and functions.
	//Because $rootScope is a service, we must inject it as a dependency before we can use it:
	function SongPlayer($rootScope,Fixtures) {
		//Access songs from the Current Album locally
		//we cannot call it to use outside of this function 
		//if we want to use global we create:
		//SongPlayer.currentAlbum = Fixtures.getAlbum();
		var currentAlbum = Fixtures.getAlbum();
		
		//Then, we can get the index of a song arrays
		/**
        * @function getSongIndex
        * @desc Get index of songs array
        * @param {Object} song
        * @returns {Number}
        */
		
		var getSongIndex = function(song) {
     		return currentAlbum.songs.indexOf(song);
 		};
		
		//We use SongPlayer as an array to store all functions such as SongPlayer.play()
		//SongPlayer.pause(), and so on.
		var SongPlayer = {};
		
		/**
		 * @desc Buzz object audio file
		 * @type {Object}
		 */
		
		var currentBuzzObject = null;
		
		//update SongPlayer.currentSong to the song we want to play
		 /**
		 * @function setSong
		 * @desc Stops currently playing song and loads new audio file as currentBuzzObject
		 * @param {Object} song
		 */
		var setSong = function(song) {
			if (currentBuzzObject) {
				currentBuzzObject.stop();
				SongPlayer.currentSong.playing = null;
			}

			currentBuzzObject = new buzz.sound(song.audioUrl, {
				formats: ['mp3'],
				preload: true
			});
			
			/*timeupdate is our first custom event
			Add the $apply to the SongPlayer.setSong method so that it starts "applying" the time update once we know which song to play
			
			The bind() method adds an event listener to the Buzz sound object 
			*/
			currentBuzzObject.bind('timeupdate', function(){
				$rootScope.$apply(function(){
					SongPlayer.currentTime = currentBuzzObject.getTime();
				});
			});
			//important where we assign song for use currently
			SongPlayer.currentSong = song;
 		};
		
	
		SongPlayer.currentSong = null;
		
		/**
		* @desc Current Playerback time (in seconds) of currently playing song
		* @type {number}
		
		*/
		SongPlayer.currentTime =null;
		
		SongPlayer.volume = 80;
		
		/** @function SongPlayer.play(song)
		 * @desc If the currently playing song is not the same as the user click==> setSong 	and play, and change playing boolean status to true;
		 * @param {Object} song
		 */
		SongPlayer.play = function (song) {
//			The first condition occurs when we call the methods from the Album view's song rows, and the second condition occurs when we call the methods from the player bar
			song = song ||SongPlayer.currentSong;
			//If the currently playing song is not the same as the song the user clicks on
			
			if (SongPlayer.currentSong !== song) {
				
				setSong(song);
				currentBuzzObject.play(); // Buzz's own play method 
				song.playing=true;

			} else if (SongPlayer.currentSong == song) {

				if (currentBuzzObject.isPaused()) {
					currentBuzzObject.play();
					song.playing=true;
					

				}

			}
		};
		
		//Pause
		/**
		 * @function SongPlayer.pause(song)
		 * @desc pause currently playing song and set the playing boolean to false 
		 * @param {object} song
		*/
		SongPlayer.pause =function(song){
			
			song = song || SongPlayer.currentSong;
			currentBuzzObject.pause();
			song.playing =false;
		};
		
		/**
		 * @function SongPlayer.playSong(song)
		 * @desc play currently playing song and set the playing boolean to true; 
		*/
		
		var playSong = function(song){
			
			currentBuzzObject.play();
			song.playing = true;
			
		};
		
		/**
		 * @function SongPlayer.previous()
		 * @desc play previous song and set the current index one behind the current song. If user click again, the indexed song will load into getSongIndex for playing and move one index behind. 
		*/
		SongPlayer.previous = function() {
			var currentSongIndex= getSongIndex(SongPlayer.currentSong);
			currentSongIndex--;
			
			if(currentSongIndex < 0){
				currentSongIndex.stop();
				SongPlayer.currentSong.playing=null;
			}else {
         		var song = currentAlbum.songs[currentSongIndex];
         		setSong(song);
         		playSong(song);
     		}
			
			
		};
		
		SongPlayer.next = function() {
			var currentSongIndex= getSongIndex(SongPlayer.currentSong);
			currentSongIndex++;
			var lastSongIndex = currentAlbum.songs.length -1;
			
			if(currentSongIndex > lastSongIndex ){
			stopSong(SongPlayer.currentSong);
			
			
			} 
				
         	var song = currentAlbum.songs[currentSongIndex];
         	setSong(song);
         	playSong(song);
			
     		
		};
		
		var stopSong = function () {
			currentBuzzObject.stop();
			song.playing = null;
			
		};
		
		/**
			 * @function setCurrentTime
			 * @desc Set current time (in seconds) of currently playing song
			 * @param {Number} time
		*/
		SongPlayer.setCurrentTime = function(time) {
			 if (currentBuzzObject) {
				 currentBuzzObject.setTime(time);
			 }
		};
		
		SongPlayer.setVolume = function(volume){
			if(currentBuzzObject){
				currentBuzzObject.setVolume(volume);
			}
			SongPlayer.volume=volume;
		}


		return SongPlayer;
	}

	angular
		.module('blocJams')
		.factory('SongPlayer',['$rootScope','Fixtures', SongPlayer]);



})();
