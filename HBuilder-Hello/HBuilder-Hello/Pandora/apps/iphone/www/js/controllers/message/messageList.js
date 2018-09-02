define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	var top='64px';
    if( mui.os.android ){
    	top='44px';
    }
    
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
				url:'systemMessage.html',
				id:'systemMessage',
				styles:{
					top: top,
					bottom: '0px'
				}
			},{
				url:'pushMarket.html',
				id:'pushMarket',
				styles:{
					top: top,
					bottom: '0px'
				}
			}
		]
	});
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var pageId = self.pageId;
		if( pageId ){
			$("#menuDiv a").removeClass("mui-active");
			$("#" +pageId).addClass("mui-active");
			plus.webview.getWebviewById(pageId).show();
		}else{
			plus.webview.getWebviewById("systemMessage").show();
		}
		
		doc.getElementById("changeAllState").addEventListener('tap',function(){
			var url = mbank.getApiURL() + "210201_changeAllState.do";
			var mbUUID = plus.device.uuid;
			mbank.apiSend('post', url, {mbUUID:mbUUID,liana_notCheckUrl:false}, insertSuccess, insertError, false);
			function insertSuccess(data){
				var systemMessage = plus.webview.getWebviewById("systemMessage");
				mui.fire(systemMessage,'refreshNews');
				var mainsub = plus.webview.getWebviewById('main_sub');
				mui.fire(mainsub,'refreshNews');
				var productList = plus.webview.getWebviewById('productList');
				mui.fire(productList,'refreshNews');
				var life = plus.webview.getWebviewById('life');
				mui.fire(life,'refreshNews');
//				mui.alert(data.em);//父页面--非原生弹出框 点击有遮罩--暂未可用
			}
			function insertError(data){
//				mui.alert(data.em);//父页面--非原生弹出框 点击有遮罩--暂未可用
			}
		});
		
		$("#menuDiv a").on("tap",function(){
			var id = $(this).attr("id");
			if(self.id == id){
				return false;
			}
			plus.webview.getWebviewById(id).show();
		});
	});
		
});