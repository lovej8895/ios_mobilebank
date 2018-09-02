define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
    var top = '64px';
    if (mui.os.android) {
    	top = '46px';
    	
    }
    
    mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
			url:'myFundProductList.html',
			id:'myFundProductList',
			styles: {
			    top: top,			    
			    bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		//关闭交易窗口
	});
});