define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	var tryNumber = 5;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		plus.webview.close(plus.webview.getWebviewById("loginPwdUpdateInput"));	
		var sessionTimeOut = plus.webview.currentWebview().sessionTimeOut;
		
		var lockerShow = document.getElementById("holder");
		var uuid = plus.device.uuid;
		var params = userInfo.getItem("session_keys")||"{}";
		if(params!=null && params!="" && params!="{}" && params!=undefined){
			params=JSON.parse(params);
		}
		
		function clearStateAndToLogin(){
//			params["islock"] = "1";
			params["state"] = "1";
			userInfo.setItem("session_keys", JSON.stringify(params));
			mbank.openWindowByLoad("../login/login.html","login","slide-in-right",{nocheck:true,sessionTimeOut:sessionTimeOut});
		}
		
		lockerShow.addEventListener("done",function(e){
			checkLocker(e);
		});
		
		function checkLocker(event){
			var rs = event.detail;
			if (rs.points.length < 4) {
				mui.alert("手势太简单了，至少要连4个点哦！","温馨提示");
				rs.sender.clear();
				return;
			}
			var d=rs.points.join('');
	        var pwdDataNow = "" + CryptoJS.HmacMD5(uuid + "",d + "");
	        var reqData = {
	        	"logonId" : userInfo.getItem("logonId"),
	        	"mbUUID" : uuid,
	        	"PinType" : "2",
	        	"liana_notCheckUrl":false
	        };
	        var url = mbank.getApiURL()+'pwdQueryNoSession.do';
        	mbank.apiSend("post",url,reqData,pwdQuerySucFunc,pwdQueryFailFunc,true);
	        function pwdQuerySucFunc(data){
	        	if(data.ec =="000"){
	        		var pwdDataOld = data.PinData;
	        		if(pwdDataNow == pwdDataOld){
	        			rs.sender.clear();
	        			goLogin(pwdDataNow);
	        		}else{
	        			tryNumber--;
						rs.sender.clear();
						if (tryNumber > 0) {
							mui.toast('解锁手势错误，还能尝试 ' + tryNumber + ' 次。');
						} else {
							clearStateAndToLogin();
						}
	        		}
	        	}else{
	        		rs.sender.clear();
	        		mui.alert(data.em,"温馨提示");
	        	}
	        }
	        function pwdQueryFailFunc(e){
	        	rs.sender.clear();
	        	mui.alert(e.em,"温馨提示");
	        }
		}
		
		function goLogin(pwd){
			var loginInfo = {
				"logonId" : userInfo.getItem("logonId"),
				"PinType" : "2",
				"mbUUID" : uuid,
				"PinData" : pwd,
				"liana_notCheckUrl":false
			};
			var url = mbank.getApiURL() + 'mobileBankLoginNew.do'; 
			mbank.apiSend('post', url, loginInfo, loginSucfun, loginFailFun, true,false);
			function loginSucfun(result){
				plus.webview.close(plus.webview.getWebviewById("login"));
				plus.webview.close(plus.webview.getWebviewById("loginByFinger"));
				var customerId = result.session_customerId;
				var fingerKeys = userInfo.getItem("finger_keys") || "{}";
				if (fingerKeys != "{}" && fingerKeys != null && fingerKeys != "" && fingerKeys != undefined) {
					fingerKeys = JSON.parse(fingerKeys);
					if (fingerKeys[customerId] != undefined) {
						fingerKeys.islock = '0';
						userInfo.setItem("finger_keys", JSON.stringify(fingerKeys));
					} else {
						userInfo.removeItem("finger_keys");
					}
				}
//				mui.toast('登录成功');
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
		
		document.getElementById("goOff").addEventListener("tap", function() {
			goOut();
		}, false);
		
		function goOut(){
			plus.webview.close(plus.webview.getWebviewById("login"));
			plus.webview.close(plus.webview.getWebviewById("loginByFinger"));
			var sessiontimeout = localStorage.getItem('sessiontimeout');
			if(sessiontimeout){
				mbank.backToIndex(true);
				return false;
			}
			plus.webview.currentWebview().close();
		}
		
		document.getElementById("changeLoginType").addEventListener("tap",function(){
			
			if(mui.os.ios){
				var fingerLoginState = null;
	    		var fingerLoginLock = null
	    		var fingerKeys = userInfo.getItem("finger_keys") || "{}";
				if (fingerKeys != null && fingerKeys != "" && fingerKeys != "{}" && fingerKeys != undefined) {
					fingerKeys = JSON.parse(fingerKeys);
					fingerLoginState = fingerKeys.state;
					fingerLoginLock = fingerKeys.islock;
				}
	    		if(fingerLoginState =='0' && fingerLoginLock =='0'){
					var btnArray = [{title:"密码登录"},{title:"指纹登录"}];
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
								mbank.openWindowByLoad("../login/loginByFinger.html","loginByFinger","slide-in-right",{nocheck:true,sessionTimeOut:sessionTimeOut});
								break;
						}
					});
				}else{
					mbank.openWindowByLoad("../login/login.html","login","slide-in-right",{nocheck:true,sessionTimeOut:sessionTimeOut});
				}
			}else{
				mbank.openWindowByLoad("../login/login.html","login","slide-in-right",{nocheck:true,sessionTimeOut:sessionTimeOut});
			}
    	},false);
    	
    	//同页面顶部图标按钮事件一致
		mui.back = function(event) {
			goOut();
		};
		
	});
});