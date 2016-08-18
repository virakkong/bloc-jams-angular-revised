(function() {
	function PlayerBarCtrl(Fixtures,SongPlayer){ //inject services
		
		this.albumData = Fixtures.getAlbum();
		//call service
		this.songPlayer=SongPlayer;
	}
	angular
		.module('blocJams')
		.controller('PlayerBarCtrl',['Fixtures','SongPlayer', PlayerBarCtrl]);
})();