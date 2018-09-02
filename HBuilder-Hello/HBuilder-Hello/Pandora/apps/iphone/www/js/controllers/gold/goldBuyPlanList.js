define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	
	var top='64px';
    if( mui.os.android ){
    	top='44px';
    }

	mui.init({
		swipeBack: false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},
		subpages: [{
			url: '../gold/goldBuyPlanListSub.html',
			id: 'goldBuyPlanListSub',
			styles: {
				top: top,
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var muiBack = mui.back;
		mui.back=function(){
			if(plus.webview.currentWebview().opener().id =='goldBuyPlanResult'){
				mbank.back('goldHome',muiBack);
			}else{
				mbank.back('myGold',muiBack);
			}
		}
	});
});