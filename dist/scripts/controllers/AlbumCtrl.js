(function() {
     		
	  function AlbumCtrl(Fixtures, SongPlayer) {
	 	this.albumData = Fixtures.getAlbum();
		this.songPlayer = SongPlayer;
		  
		/*note: songPlayer will call play() in SongPlayer 			    using.....album.songPlayer.play(song).
		*/
     };
 
     angular
         .module('blocJams')
         .controller('AlbumCtrl', ['Fixtures', 'SongPlayer', AlbumCtrl]);
 })();