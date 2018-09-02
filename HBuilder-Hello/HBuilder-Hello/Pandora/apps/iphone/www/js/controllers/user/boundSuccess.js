define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
//	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	
	
	mui.init();//预加载
	mui.plusReady(function(){//页面初始化
		var self = plus.webview.currentWebview();
		var sessionTimeOut=self.sessionTimeOut;
		var deviceType = self.deviceType;
		var mpOS = self.mpOS;
		var mbUUID = self.mbUUID;
		
		var date = new Date();
		var screenResolution = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
		var lockerFlag = false;
		var sessionKeys = userInfo.getItem("session_keys") || "{}";
		var customerId = localStorage.getItem("session_customerId");
		if(sessionKeys == null || sessionKeys == "{}" || sessionKeys == "" || sessionKeys == undefined){
			lockerFlag = true;
		}else{
			sessionKeys = JSON.parse(sessionKeys);
			if (sessionKeys[customerId] == undefined) {
				lockerFlag = true;
			}
		}
		document.getElementById("deviceType").innerText = deviceType;
		document.getElementById("mpOS").innerText = mpOS;
		document.getElementById("screenResolution").innerText = screenResolution;
		
//		var beginView = plus.webview.getWebviewById('infoVerification');
//		plus.webview.close(beginView);
//		var frontView = plus.webview.getWebviewById('infoConfirm');
//		plus.webview.close(frontView);
		/*if(frontView || beginView || loginView || fingerView || unlockView){
			plus.webview.close(beginView);
			plus.webview.close(frontView);
			plus.webview.close(loginView);
			plus.webview.close(fingerView);
			plus.webview.close(unlockView);
		}
		
		plus.key.addEventListener('backbutton',function(){
			mui.back();
		},false);
		
		mui.back = function(){
			if(frontView || beginView || loginView || fingerView || unlockView){
				
				plus.webview.close(frontView);
				plus.webview.close(beginView);
				plus.webview.close(loginView);
				plus.webview.close(fingerView);
				plus.webview.close(unlockView);
			}
			plus.webview.close(self);
		}*/
		
		
		document.getElementById("setLocker").addEventListener("tap",function(){
			plus.webview.close(plus.webview.getWebviewById('infoVerification'));
			plus.webview.close(plus.webview.getWebviewById('infoConfirm'));
			if(lockerFlag){
				mbank.checkAndSetLockerFirst(undefined,sessionTimeOut);
			}else{	
				if( !mbank.checkDestinationPage() ){
				    plus.webview.close(plus.webview.getWebviewById("loginByFinger"));
					plus.webview.close(plus.webview.getWebviewById("unlock"));	
					plus.webview.close(self);
				}					
			}
		},false);
		mui.back = function(){
			plus.webview.close(plus.webview.getWebviewById('infoVerification'));
			plus.webview.close(plus.webview.getWebviewById('infoConfirm'));
			if(lockerFlag){
				mbank.checkAndSetLockerFirst(undefined,sessionTimeOut);
			}else{
				if( sessionTimeOut ){
					mbank.backToIndex();
				}else{
					if( !mbank.checkDestinationPage() ){
					    plus.webview.close(plus.webview.getWebviewById("loginByFinger"));
						plus.webview.close(plus.webview.getWebviewById("unlock"));	
						plus.webview.close(self);
					}					
				}
	
			}
		}
	});
});