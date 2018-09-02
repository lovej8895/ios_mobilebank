define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var returnBtnElem = document.getElementById("returnBtn");
	var timeoutElem = document.getElementById("timeoutId");
	var initTime=5;
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		}
	});
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		returnBtnElem.addEventListener('click', function() {
			closeApp();
		}, false);
		
		
		function closeApp(){
			plus.runtime.quit();
		}
		
		var myinterval = setInterval(function(){
			timeoutElem.innerHTML = initTime;
			if(initTime--<=0){
				clearInterval(myinterval);
				closeApp();
			}
		},1000);
		
		plus.key.addEventListener('backbutton',function(){
			return false;
		},false);
	});
});