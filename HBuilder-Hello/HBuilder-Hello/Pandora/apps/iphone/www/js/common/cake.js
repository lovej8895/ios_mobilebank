(function($,undefined){
	
	$.fn.fallCake = function(options){
		var options = $.extend({}, $.fn.fallCake.defaultsOptions, options);
				var screenH = $(document).height();
				var screenW = $(document).width();
				var container = $(options.container);
				var cake = $(this);
				
				
				var cakeH = cake.outerHeight();
				var cakeW = cake.outerWidth();
				for(var i=0;i<Number(options.counts);i++){
					var newcake = cake.clone();
					cake.parent().append(newcake)
					initPosition(newcake);
					dropCake(newcake,random(-3,3),80);
				}
				
				
				function initPosition(cake){
					var x = (screenW-cakeW)*Math.random();
					var y = (screenH-cakeH)*Math.random()/random(1,1.6)-200;
					cake.css({
						display:'block',
						position:'absolute',
						top:y+'px',
						left:x+'px',
						zIndex:999
					});
					var pNum = (Math.floor(Math.random()*10)%3)+1;
					cake.attr('src','../../img/cake'+pNum+'.png')
				}
				
				function dropCake(newcake,dir,angel,show){
					var startY = newcake.offset().top;
					var startX = newcake.offset().left;
					var n=0;
					var x=0,y=0;
					var cakeInterval=setInterval(function(){
						
						
						x+=(dir)*Math.cos((n++)/angel);
						y+=Number(options.fallSpeed);
						newcake.css({
							top:y+startY+'px',
							left:x+startX+'px'
						});
						
						if(isOutofWindow(newcake)){
							clearInterval(cakeInterval);
							newcake.remove();
						}
						
						if(show){
							createTracks(startX,startY);
						}
					},40);
					
				}
				
				function random(min, max) { 
					return Math.round(min + Math.random() * (max - min)); 
				};
				
				function createTracks(x,y){
				    var ele = document.createElement('div');
				    ele.className = 'track';
				    ele.style.left = x + 'px';
				    ele.style.top = y + 'px';
				    document.getElementById('main_sub_container').appendChild(ele);
				}
				
				function isOutofWindow(cake){
					var cakeH = cake.outerHeight();
					var windH = $(document).height();
					var top =cake.offset().top;
					if(top>windH){
						return true;
					}else{
						return false;
					}
				}
	}
	
	$.fn.fallCake.defaultsOptions ={
		counts:15,
		fallSpeed:2.8,
		container:'#main_sub_container',
		showTrack:false
	}
	
})(jQuery)


