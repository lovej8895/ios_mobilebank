define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var top='110px';
    if( mui.os.android ){
    	top='90px';
    }

	mui.init({
		swipeBack: false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},
		subpages: [{
			url: '../gold/goldTranHisWithdraw.html',
			id: 'goldTranHisWithdraw',
			styles: {
				top: top,
				bottom: '0px'
			}
		},{
			url: '../gold/goldTranHisSell.html',
			id: 'goldTranHisSell',
			styles: {
				top: top,
				bottom: '0px'
			}
		},{
			url: '../gold/goldTranHisBuy.html',
			id: 'goldTranHisBuy',
			styles: {
				top: top,
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		plus.webview.getWebviewById('goldTranHisWithdraw').hide();
		plus.webview.getWebviewById('goldTranHisSell').hide();
		plus.webview.getWebviewById('goldTranHisBuy').hide();
		plus.webview.getWebviewById('goldTranHisBuy').show();
		var activeId = 'goldTranHisBuy';
		mui('#functionDiv').on('tap','a',function(event) {
			var id = this.getAttribute('id');
			if(id == activeId){
				return false;
			}
			goLoginPage(id);
		});
		
		function goLoginPage(id){
			plus.webview.getWebviewById('goldTranHisWithdraw').hide();
			plus.webview.getWebviewById('goldTranHisSell').hide();
			plus.webview.getWebviewById('goldTranHisBuy').hide();
			plus.webview.getWebviewById(id).show();
			document.getElementById(id).classList.add('active');
			document.getElementById(activeId).classList.remove('active');
			activeId = id;
		}
		
		var muiBack = mui.back;
		mui.back=function(){
			if(plus.webview.currentWebview().opener().id =='goldBuyNowResult'){
				mbank.back('goldHome',muiBack);
			}else if(plus.webview.currentWebview().opener().id =='goldSellResult'){
				mbank.back('goldHome',muiBack);
			}else{
				mbank.back('myGold',muiBack);
			}
		}
	});
});