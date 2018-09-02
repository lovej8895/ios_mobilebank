define(function(require, exports, module) {
	var doc = document;
	var m= mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var passwordUtil = require('../../core/passwordUtil');
	
	m.init();
	m.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		plus.webview.currentWebview().setStyle({
			scrollIndicator:'none'
		})
		plus.webview.close(plus.webview.getWebviewById("updatePassword"));
		plus.webview.close(plus.webview.getWebviewById("loginPwdUpdateInput"));
		var state = app.getState();
		
		
		
		var loginButton = doc.getElementById('login');
		var accountBox = doc.getElementById('account');
		var passwordBox = doc.getElementById('password');
		var regButton = doc.getElementById('reg');
		var close = doc.querySelector(".login_off2");
		var user_rem = doc.getElementById("user_rem");
		var tap_target = doc.querySelector(".login_touch");
		var passwordEncrypted="";
		var passwordKey="";
		//缓存中的手机号码
		var loginMobile = userInfo.getItem("logonId")||"";
		var remStatus   = userInfo.getItem('user_rem');
		var keyContainer = {};
		/**
		 * 页面需要两个input:password和_password
		 */
		if($.param.SOFTPWD_SWITCH) {
			var pwd=doc.getElementById('password');
			pwd.readOnly="readOnly";
			pwd.addEventListener('click', function() {
				//开启密码键盘
				passwordUtil.openRsaAesKeyboard('password',successCallback,null);
				
			},false);
			
			function successCallback(retObj){
					if(doc.getElementById('password')){
						doc.getElementById('password').value = retObj.inputText;
					}
					if(doc.getElementById('_password')){
						doc.getElementById('_password').value = retObj.cipherText;
					}
			}
		}
		
		mbank.resizePage('.link-area');
		
		//给登录按钮添加tap事件
		loginButton.addEventListener('tap', function(event) {
			//获取登录用户和密码
			var logonId = accountBox.value||'';
			
			passwordEncrypted = doc.getElementById('_password').value||'';
			
			//登录校验
			if (!checkLoginInfo()) {
				return false;
			}
			var loginInfo = {
				"logonType": "1",
				"logonLanguage": "",
				"logonId": logonId,
				"passwordEncrypted": passwordEncrypted,
				"randomSum":passwordUtil.getRandomNumber(),
				"passwordType":"01",
				"liana_notCheckUrl":false,
				waitTitle: '正在登录..'
			};
			var url = mbank.getApiURL() + 'msignIn.do'; 
			mbank.apiSend('post', url, loginInfo, loginfun, loginerrorFun, true,false);

		}, false); //false 表示冒泡阶段调用事件处理程序，true表示捕获阶段调用事件处理程序
		/**
		 * 校验登录用户信息
		 */
		function checkLoginInfo() {
			//获取登录用户和密码
			var logonId = (accountBox.value || '').trim();
			if($.param.SOFTPWD_SWITCH){
				passwordEncrypted=document.getElementById("_password").value;
//				if(!passwordUtil.checkMatch('password')){
//					plus.nativeUI.toast('请输入6~12位字母数字组合密码');
//					return false;
//				}
			}else{
//				passwordEncrypted=passwordBox.value || '';
				//测试密码密文，对应网银登陆密码为111111a的用户
				passwordEncrypted='AE5A578E0EF02E2532A588788E39E8BDF9903A65836B7971';
			}
			//校验登录用户名
			if (logonId.IsEmpty()) {
				plus.nativeUI.toast('用户名不能为空');
				return false;
			}
			//密码非空校验
			if (passwordEncrypted.IsEmpty()) {
				plus.nativeUI.toast('登录密码不能为空');
				return false;
			}
			//用户名格式校验，必须是手机号
			if (logonId.length!=11) {
				plus.nativeUI.toast('请输入11位手机号码');
				return false;
			}

			//密码长度校验6-20
			/*if (passwordEncrypted.length > 20 || passwordEncrypted.length < 6) {
				plus.nativeUI.toast('登录密码必须为6到20位');
				return false;
			}*/
			return true;
		}

		//登录成功回调函数
		function loginfun(result) {		
			plus.webview.close(plus.webview.getWebviewById("unlock"));
			plus.webview.close(plus.webview.getWebviewById("loginByFinger"));
			
			
			var logonId = accountBox.value;

			//判断手势
			var customerId = result.session_customerId;
			var params = userInfo.getItem("session_keys") || "{}";
			//TODO暂时不支持多用户手势密码登录，新用户登录时清空原有用户手势密码。{后续待手势密码唯一标识确定后，可考虑用数组存放多用户数据}
			if (params != "{}") {
				params = JSON.parse(params);
				if (params[customerId] != undefined) {
					//无锁定，5次失败关闭手势登录
				} else { //新用户清空原有手势密码
					userInfo.removeItem("session_keys");
				}
			}
			var finger_keys = userInfo.getItem("finger_keys") || "{}";
			if (finger_keys != "{}") {
				finger_keys = JSON.parse(finger_keys);
				if (finger_keys[customerId] != undefined) {
					finger_keys.islock = '0';
					userInfo.setItem("finger_keys", JSON.stringify(finger_keys));
				} else {
					userInfo.removeItem("finger_keys");
				}
			}
			//超时机制时间戳 
			localStorage.setItem("Sys_lastOpentionTime", new Date().getTime());
			userInfo.putJson(result);
			userInfo.setItem('logonId', accountBox.value);
			if($("#user_rem").hasClass('remember_on')){
				userInfo.setItem('user_rem', 'on');
			}else{
				userInfo.setItem('user_rem', '');
			}
			
			var sessionTimeOut = plus.webview.currentWebview().sessionTimeOut;
			console.log('登录会话超时：'+sessionTimeOut);
			
			if( !mbank.checkLoginPwdStatus(result,sessionTimeOut) ){
				return;
			}
			
			function logonCallback(){
				mbank.queryDeviceInfo(undefined,sessionTimeOut);
			}
			mbank.successLogonTriggerEvent(logonCallback);
		
		};
		//登录失败回调函数
		function loginerrorFun(result) {
			mui.alert(result.em, '温馨提示');
		}
		

		regButton.addEventListener('tap', function(event) {
			mbank.openWindowByLoad("../register/register_input.html","register_input","slide-in-right");
		}, false);
		
		tap_target.addEventListener('tap', function(event) {
			jQuery('#user_rem').toggleClass('remember_on');
		}, false);
		
		//同左上角事件一致
//		var backButtonPress = 0;
//		m.back = function(event) {
//			/*backButtonPress++;
//			if (backButtonPress > 1) {
//				userInfo.removeItem("sessionId");
//				plus.runtime.quit();
//			} else {
//				plus.nativeUI.toast('再按一次退出应用');
//			}
//			setTimeout(function() {
//				backButtonPress = 0;
//			}, 1000);
//			return false;*/
//			goOut();
//		};
		
		plus.key.addEventListener('backbutton',function(){
			goOut();
//			var sessiontimeout = localStorage.getItem('sessiontimeout');
//			if(sessiontimeout){
//				mbank.backToIndex(true);
//				return false;
//			}
//			m.back();
		},true);

		//左上角的退出
		close.addEventListener("tap", function(event) {
			goOut();
//			var sessiontimeout = localStorage.getItem('sessiontimeout');
//			if(sessiontimeout){
//				mbank.backToIndex(true);
//				return false;
//			}
//			m.back();
		}, false);
		
		
		//暂时不用此方法，直接调用mui.back
		function goOut(){
			var sessiontimeout = localStorage.getItem('sessiontimeout');
			if(sessiontimeout){
				mbank.backToIndex(true);
				return false;
			}
			
			var retPage = plus.webview.currentWebview().opener();
			if(retPage !=null && retPage.id =="unlock"){
//				plus.webview.close(plus.webview.getWebviewById("unlock"));
				var sessionKeys = userInfo.getItem('session_keys') || "{}";
				if(sessionKeys != null && sessionKeys != "" && sessionKeys != "{}" && sessionKeys != undefined){
					if(JSON.parse(sessionKeys).state =="0" && JSON.parse(sessionKeys).islock =="0"){
//						mbank.openWindowByLoad("../login/unlock.html","unlock",{nocheck:true},"slide-in-right");
						plus.webview.getWebviewById("unlock").reload(true);
					}else{
						plus.webview.close(plus.webview.getWebviewById("unlock"));
						plus.webview.currentWebview().close();
					}
				}else{
					plus.webview.close(plus.webview.getWebviewById("unlock"));
					plus.webview.currentWebview().close();
				}
			}else if(retPage !=null && retPage.id =="loginByFinger"){
//				plus.webview.close(plus.webview.getWebviewById("loginByFinger"));
				var fingerKeys = userInfo.getItem("finger_keys") || "{}";
				if (fingerKeys != null && fingerKeys != "" && fingerKeys != "{}" && fingerKeys != undefined) {
					if(JSON.parse(fingerKeys).state =="0" && JSON.parse(fingerKeys).islock =="0"){
//						mbank.openWindowByLoad("../login/loginByFinger.html","loginByFinger",{nocheck:true},"slide-in-right");
						plus.webview.getWebviewById("loginByFinger").reload(true);
					}else{
						plus.webview.close(plus.webview.getWebviewById("loginByFinger"));
						plus.webview.currentWebview().close();
					}
				}else{
					plus.webview.close(plus.webview.getWebviewById("loginByFinger"));
					plus.webview.currentWebview().close();
				}
			}else{
				plus.webview.currentWebview().close();
			}
		}
	});
});

