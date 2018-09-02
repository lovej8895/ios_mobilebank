define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
    var passwordUtil = require('../../core/passwordUtil');
	$.init();
	$.plusReady(function() {
		
		plus.screen.lockOrientation('portrait-primary')
		var selfview = plus.webview.currentWebview();
		var mobileNo = selfview.mobileNo;
		var userName = selfview.userName;
		var certNo   = selfview.certNo;
		var certType = selfview.certType;
		
		var accountElem = doc.getElementById("accountNo");
		var accPwdElem 	= doc.getElementById("accountPassword");
		var loginPwd 	= doc.getElementById("password");
		var confirmPwd  = doc.getElementById("confirmPassword");
		var custMessage = doc.getElementById("customerMessage");
		var next_Btn 	= doc.getElementById("next_Btn");
		var keyContainer = {};
		
		if(jQuery.param.SOFTPWD_SWITCH){
			accPwdElem.readOnly = "readOnly";
			loginPwd.readOnly = "readOnly";
			confirmPwd.readOnly = "readOnly";
			loginPwd.addEventListener('click', function() {
				passwordUtil.openRsaAesKeyboard('password',null,null);
			},true);
			confirmPwd.addEventListener('click', function() {
				passwordUtil.openRsaAesKeyboard('confirmPassword',null,null);
			},true);
			accPwdElem.addEventListener('click', function() {
				passwordUtil.openNumKeyboard('accountPassword',null,null);
			},true);
		}
	
		
		next_Btn.addEventListener('tap', function() {
			
			if(!checkFun()){
				return false;
			}

		    jQuery("#next_Btn").attr("disabled",true);
			setTimeout(function(){jQuery("#next_Btn").attr("disabled",false);},3000);
			//mbank.checkMobileMsg(checkNo.value,phoneNo.value,function(){
				var pwd=loginPwd.value;
				var pwd1=confirmPwd.value
				var accPwd=accPwdElem.value
				if(jQuery.param.SOFTPWD_SWITCH){
					pwd=jQuery("#_password").val();
					pwd1=jQuery("#_confirmPassword").val();
					accPwd=jQuery("#_accountPassword").val();
				}
				var param = {
					mobileNo: mobileNo,
					password: pwd,
					confirmPassword: pwd1,
					"liana_notCheckUrl":false,
					accountNo:accountElem.value,
					certNo:certNo,
					certType:certType,
					userName:userName,
					customerMessage:custMessage.value,
					accountPassword:accPwd,
					flag:'2',
					randomSum:passwordUtil.getRandomNumber()   //私密随机因子
				}
				var url = mbank.getApiURL() + 'regist.do';
				mbank.apiSend('post', url, param, complete, true);

				function complete(data) {
					//注册成功，直接登录
					var loginInfo = {
						"logonType": "1",
						"logonLanguage": "",
						"logonId": mobileNo,
						"passwordEncrypted": jQuery("#_password").val(),//登陆密码pwd
						"randomSum":passwordUtil.getRandomNumber(),
						"passwordType":"01",
						"liana_notCheckUrl":false,
						waitTitle: '正在登录..'
					};
					var url = mbank.getApiURL() + 'msignIn.do';
					mbank.apiSend('post', url, loginInfo, loginfun, false);
					//登录成功回调函数
					function loginfun(result) {
						plus.nativeUI.toast('登录成功');
						userInfo.putJson(result);
						userInfo.setItem('logonId', mobileNo);
						mbank.initAccountInfo();
						localStorage.setItem("Sys_lastOpentionTime", new Date().getTime());
						
						var retPage = plus.webview.getLaunchWebview();
						mui.fire(retPage, 'footer', {
										fid: "main"
									});	
						mbank.queryDeviceInfo(undefined,true);//注册成功后强制返回首页
						mbank.successLogonTriggerEvent();
					};
				}
		});
		
		
		function checkFun(){
			if(IsEmpty(accountElem.value)){
				plus.nativeUI.toast("账户不能为空");
				return false;
			}
			if(!passwordUtil.checkMatch('accountPassword')){
				plus.nativeUI.toast("请输入六位合法账户密码");
				return false;
			}
			if(!passwordUtil.checkMatch('password')){
				plus.nativeUI.toast("请输入6~12位合法登录密码");
				return false;
			}
			if(!passwordUtil.checkMatch('confirmPassword')){
				plus.nativeUI.toast("请输入6~12位合法登录确认密码");
				return false;
			}
			if(!passwordUtil.checkPwdIdentify('password','confirmPassword')){
				plus.nativeUI.toast("登录密码与登录确认密码不一致");
				return false;
			}
			
			return true;
		}
		
		
		mbank.resizePage('.btn_bg_f2');
		plus.key.addEventListener('backbutton',function(){
			mui.back();
		})
	});
})