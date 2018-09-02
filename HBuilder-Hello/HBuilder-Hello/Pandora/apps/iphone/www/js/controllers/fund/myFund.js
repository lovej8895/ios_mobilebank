define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
    var top = '65px';
    if (mui.os.android) {
    	top = '45px';
    }
    
    mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
			url:'myFundList.html',
			id:'myFundList',
			styles: {
			    top: top,
			    bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
	});
});