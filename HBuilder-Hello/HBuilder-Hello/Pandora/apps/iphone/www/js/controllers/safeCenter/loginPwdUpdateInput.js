define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var passwordUtil = require('../../core/passwordUtil');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	mui.init();
	var params;
	var urlVar;
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var self = plus.webview.currentWebview();
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
				if(!passwordUtil.checkMatch('oldPwd')){
//					document.getElementById("oldPwd").value = "";
					mui.alert('请输入6~12位字母数字组合的原密码',"温馨提示");
					return false;
				}
				if(!passwordUtil.checkMatch('newPwd')){
//					document.getElementById("newPwd").value = "";
					mui.alert('请输入6~12位字母数字组合的新密码',"温馨提示");
					return false;
				}
				if(!passwordUtil.checkMatch('confirmNewPwd')){
//					document.getElementById("confirmNewPwd").value = "";
					mui.alert('请输入6~12位字母数字组合的确认新密码',"温馨提示");
					return false;
				}
				if(!passwordUtil.checkPwdIdentify('newPwd','confirmNewPwd')){
//					document.getElementById("newPwd").value = "";
//					document.getElementById("confirmNewPwd").value = "";
					mui.alert("新密码两次输入不一致，请重新输入","温馨提示");
					return;
				}
				if(passwordUtil.checkPwdIdentify('oldPwd','newPwd')){
//					document.getElementById("oldPwd").value = "";
//					document.getElementById("newPwd").value = "";
//					document.getElementById("confirmNewPwd").value = "";
					mui.alert("新密码不能和旧密码一致，请重新设置","温馨提示");
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
					mui.alert("登录密码修改成功","温馨提示","确定",function(){
//						userInfo.removeItem("sessionId");
//						mbank.clearUserSessionInfo();
//						mbank.checkLogon();
						mbank.logonOutTriggerEvent();
						mbank.openWindowByLoad("../login/login.html","login",{nocheck:true},"slide-in-right");
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
		
		mbank.resizePage(".but_bottom20px");
		
	});
});