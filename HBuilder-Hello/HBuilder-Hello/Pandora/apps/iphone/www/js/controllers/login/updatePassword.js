define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var passwordUtil = require('../../core/passwordUtil');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	mui.init({
		keyEventBind: {
			backbutton: false,
			menubutton: false
		}		
	});
	var params;
	var urlVar;
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		var sessionTimeOut=self.sessionTimeOut;
		commonSecurityUtil.initSecurityData('027001',self);
		if(jQuery.param.SOFTPWD_SWITCH) {
			var oldPwd=document.getElementById('oldPwd');
			oldPwd.readOnly="readOnly";
			oldPwd.addEventListener('click', function() {
				passwordUtil.openRsaAesKeyboard('oldPwd',null,null);
			},false);
			
			var newPwd=document.getElementById('newPwd');
			newPwd.readOnly="readOnly";
			newPwd.addEventListener('click', function() {
				passwordUtil.openRsaAesKeyboard('newPwd',null,null);
			},false);
			
			var confirmNewPwd=document.getElementById('confirmNewPwd');
			confirmNewPwd.readOnly="readOnly";
			confirmNewPwd.addEventListener('click', function() {
				passwordUtil.openRsaAesKeyboard('confirmNewPwd',null,null);
			},false);
		}
		
		document.getElementById("submitButton").addEventListener("tap",function(){
			var oldPwdVal=document.getElementById("_oldPwd").value;
			var newPwdVal=document.getElementById("_newPwd").value;
			var confirmNewPwdVal=document.getElementById("_confirmNewPwd").value;
			if($.param.SOFTPWD_SWITCH){
				if( ""==oldPwdVal ){
					mui.alert('请输入原密码');
					return false;
				}
				if(!passwordUtil.checkMatch('newPwd')){
					mui.alert('请输入6~12位字母数字组合的新密码');
					return false;
				}
				if(!passwordUtil.checkMatch('confirmNewPwd')){
					mui.alert('请输入6~12位字母数字组合的确认新密码');
					return false;
				}
				if(!passwordUtil.checkPwdIdentify('newPwd','confirmNewPwd')){
					mui.alert("新密码两次输入不一致，请重新输入");
					return;
				}
				if(passwordUtil.checkPwdIdentify('oldPwd','newPwd')){
					mui.alert("新密码不能和旧密码一致，请重新设置");
					return;
				}
			}
			var randomSum = passwordUtil.getRandomNumber();
			params = {
				"oldPassword" : oldPwdVal,
				"newPassword" : newPwdVal,
				"confirmPassword" : confirmNewPwdVal,
				"randomSum" : randomSum
			}
			urlVar = mbank.getApiURL()+'updatePasswordDoModify.do';
			commonSecurityUtil.apiSend("post",urlVar,params,updateLoginPwdSucFunc,updateLoginPwdFailFunc,true);
			function updateLoginPwdSucFunc(data){
				if(data.ec =="000"){
					mui.alert("登录密码修改成功","提示","确定",function(){
//						userInfo.removeItem("sessionId");
//						mbank.clearUserSessionInfo();
//						mbank.checkLogon();
						mbank.logonOutTriggerEvent();
						mbank.openWindowByLoad("../login/login.html","login","slide-in-right",{nocheck:true,sessionTimeOut:sessionTimeOut});
					});
				}else{
					mui.alert(data.em,"温馨提示");
				}
			}
			function updateLoginPwdFailFunc(e){
				mui.alert(e.em,"温馨提示");
			}
			
		},false);
		
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("oldPwd");
			passwordUtil.hideKeyboard("newPwd");
			passwordUtil.hideKeyboard("confirmNewPwd");
			mui.back();
		});

		var backButtonPress = 0;
		mui.back = function(event) {
			backButtonPress++;
			if(backButtonPress > 1) {
				clearSession(); //清空存储数据
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};
		
		mbank.resizePage(".but_bottom20px");
		
	});
});