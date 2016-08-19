(function() {
	function seekBar() {
		/*
		* @func calculatePercent
		* @desc calculate the seekbar's value
		* &param seekBar, event
		*/
		var calculatePercent= function (seekBar, event){
			var offsetX=event.pageX -seekBar.offset().left;
			var seekBarWidth = seekBar.width();
			var offsetXPercent = offsetX / seekBarWidth;
			//make sure the offsetXPercent is in between 0 and 1
			offsetXPercent = Math.max(0,offsetXPercent);
			
			offsetXPercent= Math.min(1,offsetXPercent);
		}
		
		
		
		
		return {
			
			templateUrl: '/templates/directives/seek_bar.html',
			replace: true,
			//If true, the template replaces the directive's element
			//If false, the template replaces the contents of the directive's element 
			//Eample: <seek-bar>..contents..</seek-bar>
			restrict: 'E',
			//element is E, attribute is A, class is C, and comment is M
			//Can have multiple, Ex: AE or AEC
			
			//for external and internal use
			scope: { },
			
			
			link: function(scope, element, attributes){
			// determine the position of the thumb as well as the width of the seek bar playback 
				scope.value=0;
				scope.max =100;
				
				
				
				//local use
				var percentString =function () {
					//value hold currently playing song time or the current volume
					var value = scope.value;
					//max holds max value of seekbar
					var max = scope.max;
					//percent holds percent of current value over max value
					var percent = value / max *100;
					return percent + "%";

				};
				
				//scope is like a global link that allows DOM to link to scope's property or method...No need to call it using scope.fillSyle, just use fillStyle() in any elment in DOM.
				scope.fillStyle = function () {
					//Returns back the width of the seek bar fill element based on the calculated percent.
					return {width: percentString()};
				};
				
				// seekBar variable holds the element that matches the directive <seek-bar> in DOM
				
				var seekBar = $(element);
				/
				/*
				* @func onClickSeekBar
				* @desc we call this function using: <div class="seek-bar" ng-click="onClickSeekBar($event)">
				* $param event to trigger even as mouse move
				*/
				
				scope.onclickSeekBar = function(event){
					//we pass event to calculatePercent
					//in order to find mouse position relative to the left edge of the seek-bar class div
					var percent = calculatePercent(seekBar,event);
					scope.value =pecent
				}
				
				
			
			}
		};
		
	}
	
	angular
		.module('blocJams')
		.directive('seekBar', seekBar);
		// Angular will look for seek-bar in the HTML and call this directive when it finds that markup (seek-bar)
});