(function() {
     function CollectionCtrl(Fixtures) {

	 this.albums = Fixtures.getAlbum();
  
    	 }
 
     angular
         .module('blocJams')
         .controller('CollectionCtrl',['Fixtures', CollectionCtrl]);
 })();