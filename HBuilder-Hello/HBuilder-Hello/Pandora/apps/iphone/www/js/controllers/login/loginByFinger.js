define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var fingerInit = require('../../core/fingerInit');
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		plus.webview.close(plus.webview.getWebviewById("loginPwdUpdateInput"));
		var sessionTimeOut = plus.webview.currentWebview().sessionTimeOut;
		
		var loginIdVar = userInfo.getItem("logonId");
		document.getElementById("loginId").innerText = loginIdVar.substring(0,3)+"****" +loginIdVar.substring(7,11);
		var fingerKeys = userInfo.getItem("finger_keys") || "{}";
		if (fingerKeys != null && fingerKeys != "" && fingerKeys != "{}" && fingerKeys != undefined) {
			fingerKeys = JSON.parse(fingerKeys);
		}
		var tryNumber = 5;
		
		
		
		if(mui.os.ios){
			setTimeout(function() {
				fingerInit.pluginFinger(successCallback,errorCallback,otherCallback);
			}, 200);
		}else{
			fingerInit.pluginFinger(successCallback,errorCallback,otherCallback);
		}
		
		function successCallback(msg){
        	goLogin();
        }
		function errorCallback(msg){
			mui.alert(msg);
		}
        function otherCallback(state,msg){
        	if(mui.os.ios){
        		tryNumber--;
	        	if (tryNumber < 0) {
					clearStateAndToLogin();
				}
			}else{
				if(state =='3'){
					mui.alert(msg,"温馨提示","确定",function(){
        				clearStateAndToLogin();
					});
				}else if(state =='7'){
					mui.alert(msg,"温馨提示","确定",function(){
        				clearStateAndToLogin();
					});
				}else{
					return;
				}
			}
        }
		/*function loginTouchID() {
			if(!window.plus.pluginLogin){
				mui.alert("加载指纹控件对象失败","温馨提示");
				return false;
			}
	        plus.pluginLogin.TouchIDLogin(
	            function( result ) {
	                if (result) {
	                	if (result.status) {
	                		var checked = result.payload;
	                		if(checked=="1"){
//	                			mui.toast("指纹识别成功");
	                			goLogin();
	                		}else{
	                			tryNumber--;
	                			if (tryNumber > 0) {
									return;
								} else {
									clearStateAndToLogin();
								}
	                        }
	                    }else {
	                        mui.alert(result.message,"温馨提示");
	                    }
	                }else {
	                    mui.alert("调用插件时发生异常","温馨提示");
	                }
	            },
	            function(e){
	                mui.alert(e,"温馨提示");
	            }
	        );
        }*/
        
		function clearStateAndToLogin(){
//			fingerKeys["state"] = "1";
			fingerKeys["islock"] = "1";
			userInfo.setItem("finger_keys", JSON.stringify(fingerKeys));
			mbank.openWindowByLoad("../login/login.html","login","slide-in-right",{nocheck:true,sessionTimeOut:sessionTimeOut});
		}
		
		document.getElementById("loginDiv").addEventListener("tap",function(){
//			loginTouchID();
			fingerInit.pluginFinger(successCallback,errorCallback,otherCallback);
		},false);
		
		function goLogin(){
			var uuid = plus.device.uuid;
			var logonId = userInfo.getItem("logonId");
			var pwd = "" + CryptoJS.HmacMD5(uuid + "",logonId + "");
			var loginInfo = {
				"logonId" : logonId,
				"PinType" : "3",
				"mbUUID" : uuid,
				"PinData" : pwd,
				"liana_notCheckUrl":false
			};
			var url = mbank.getApiURL() + 'mobileBankLoginNew.do'; 
			mbank.apiSend('post', url, loginInfo, loginSucfun, loginFailFun, true,false);
			function loginSucfun(result){
				plus.webview.close(plus.webview.getWebviewById("login"));
				plus.webview.close(plus.webview.getWebviewById("unlock"));
//				mui.toast("登录成功");
				localStorage.setItem("Sys_lastOpentionTime", new Date().getTime());
				userInfo.putJson(result);
				var sessionTimeOut = plus.webview.currentWebview().sessionTimeOut;
				if( !mbank.checkLoginPwdStatus(result) ){
					return;
				}				
				function logonCallback(){
					mbank.queryDeviceInfo(undefined,sessionTimeOut);
				}
				mbank.successLogonTriggerEvent(logonCallback);
			}
			function loginFailFun(e){
				mui.alert(e.em,"温馨提示");
			}
		}
		
		document.getElementById("loginOff").addEventListener("tap",function(){
			goOut();
		},false);
		
		function goOut(){
			plus.webview.close(plus.webview.getWebviewById("login"));
			plus.webview.close(plus.webview.getWebviewById("unlock"));
			var sessiontimeout = localStorage.getItem('sessiontimeout');
			if(sessiontimeout){
				mbank.backToIndex(true);
				return false;
			}
			plus.webview.currentWebview().close();
		}
		document.getElementById("changeLoginType").addEventListener("tap",function(){
    		var params = userInfo.getItem('session_keys') || "{}";
    		var state = null;
    		var islock = null;
	    	if(params != null && params!="" && params !="{}" && params !=undefined){
				params=JSON.parse(params);
				state = params.state;
				islock = params.islock;
			}
    		if(state == '0' && islock =='0'){
				var btnArray = [{title:"密码登录"},{title:"手势登录"}];
				plus.nativeUI.actionSheet( {
					title:"选择登录方式",
					cancel:"取消",
					buttons:btnArray
				}, function(e){
					var index = e.index;
					switch (index){
						case 0:
							break;
						case 1:
							mbank.openWindowByLoad("../login/login.html","login","slide-in-right",{nocheck:true,sessionTimeOut:sessionTimeOut});
							break;
						case 2:
							mbank.openWindowByLoad("../login/unlock.html","unlock","slide-in-right",{nocheck:true,sessionTimeOut:sessionTimeOut});
							break;
					}
				});
			}else{
				mbank.openWindowByLoad("../login/login.html","login","slide-in-right",{nocheck:true,sessionTimeOut:sessionTimeOut});
    		}
    	},false);
    	
    	//同页面顶部图标事件一致
		mui.back = function(event) {
			goOut();
		};
		
	});
});