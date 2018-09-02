define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var usbKeyUtil = require('../../core/usbKeyUtil');
	var pinReg = new RegExp(/^[a-z0-9]{6,16}$/);
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var self = plus.webview.currentWebview();
		
		document.getElementById("submitButton").addEventListener("tap",function(){
			
			var oldPwd = document.getElementById("oldPwd").value||'';
			var newPwd = document.getElementById("newPwd").value||'';
			var confirmNewPwd = document.getElementById("confirmNewPwd").value||'';
			if(jQuery.param.SIGNAUTH_SWITCH){
				if(!pinReg.test(oldPwd)){
					mui.alert('请输入6~16位字母数字组合的原PIN码',"温馨提示");
					return false;
				}
				if(!pinReg.test(newPwd)){
					mui.alert('请输入6~16位字母数字组合的新PIN码',"温馨提示");
					return false;
				}
				if(!pinReg.test(confirmNewPwd)){
					mui.alert('请输入6~16位字母数字组合的确认新PIN码',"温馨提示");
					return false;
				}
				if(newPwd!=confirmNewPwd){
					mui.alert("新PIN码两次输入不一致，请重新输入","温馨提示");
					return;
				}
				if(newPwd==oldPwd){
					mui.alert("新PIN码不能和旧PIN码一致，请重新输入","温馨提示");
					return;
				}
				
				usbKeyUtil.changeUsbkeyPin(oldPwd,newPwd,function(){
					mui.alert("PIN码修改成功","温馨提示");
//					mui.back();//使用此方法页面卡死，暂时未找到原因
					document.getElementById("oldPwd").value = '';
					document.getElementById("newPwd").value = '';
					document.getElementById("confirmNewPwd").value = '';
				},function(e){
					if(e.indexOf("密码") !=-1){
						mui.alert(e.replace(/密码/g,"Ukey密码"));
					}else{
						mui.alert(e);
					}
				});
				
				
			}
			
		},false);
		
		plus.key.addEventListener('backbutton', function(){
			mui.back();
		});
		
		mbank.resizePage(".but_bottom20px");
		
	});
});