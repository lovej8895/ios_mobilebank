/*
 * 账户别名设置确认js
 */
define(function(require, exports, module) {
	
	var doc = document;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');

	mui.init();
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var state = app.getState();
		var self = plus.webview.currentWebview();
		var accNo = self.accountNo;
		var alias = self.accountAlias;
		//mui.alert(accNo+" "+alias);
		mbank.resizePage("#abc");
		$("#accountNo").html(accNo);
//		$("#alias").val(alias);
		doc.getElementById("alais").value =alias;
		
		//进入此页面先查询别名= =
		queryAccountAlias();//查询用户信用卡下挂账户列表
		function queryAccountAlias(){
			var url = mbank.getApiURL() + 'getUserInfo.do';
			mbank.apiSend('post', url, null, querySuccess, queryError,false);
			function querySuccess(data){
				var accountInfoList = data.iAccountInfo;
				for(var i=0;i<accountInfoList.length;i++){
					if(accNo==accountInfoList[i].accountNo){
						doc.getElementById("alais").value = accountInfoList[i].accountAlias;
					}
				}
			}
			function queryError(data){
				mui.alert(data.em);
			}
		}
		
		var confirm = doc.getElementById("aliasSetting_Success");
		confirm.addEventListener('tap',function(){
			var param = doc.getElementById("alais").value;
			if(checkAlias(param)){	
			   batchModifyAlias();
			}else{ 
			mui.alert("请输入10个长度以内的字符！");
			}
			
		});
		
		function batchModifyAlias(){
			var url = mbank.getApiURL() + 'batchModifyAlias.do';
			var alias=doc.getElementById("alais").value;
			mbank.apiSend('post', url, {accountNo:accNo,accountAlias:alias}, modifySuccess, modifyError,true);
			function modifySuccess(){
				var path = confirm.getAttribute("path");
				var id = confirm.getAttribute("id");
				var noCheck = confirm.getAttribute("noCheck");
				mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
			}
			function modifyError(){
				mui.alert("设置失败！");
			}
		}
		
	});
	
		function checkAlias(param){
			var errorReg = /[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]+/;
			var reg = /^[0-9a-zA-Z\u4E00-\u9FA5\(\)]{1,10}/;
			if(errorReg.test(param)){
				return false;
			}
			if(reg.test(param)){
				//mui.alert(reg.test(param));
				return true;
			}
			return false;
		}
});