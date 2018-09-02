define(function(require, exports, module) {
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
   
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
				url:'scheduleListBody.html',
				id:'scheduleListBody',
				styles:{
					top: '65px',
					bottom: '0px'
				}
			}
		]
	});
	
	
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
	});

});