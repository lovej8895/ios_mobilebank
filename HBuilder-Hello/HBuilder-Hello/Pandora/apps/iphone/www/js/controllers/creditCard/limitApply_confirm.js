/*
 * 额度管理-额度申请js
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
		var cardNo = self.cardNo;
		var limitType = self.limitType;
		var reason = self.reason;
		var expectedLimit = self.creditLimit;
		var expectedLimitShow = format.formatMoney(expectedLimit);
		//mui.alert(cardNo+" "+limitType+" "+reason+" "+expectedLimit);
		doc.getElementById("accountNo").innerText = cardNo;
		doc.getElementById("limitType").innerText = limitType;
		doc.getElementById("expectedLimit").innerText = expectedLimitShow;
		
		/*var back = doc.getElementById("limitApply_confirmBack");
		back.addEventListener('tap',function(){
			mui.back();
		});*/
		
		var next = doc.getElementById("creditAction_success");
		next.addEventListener('tap',function(){
			limitConfirm();
		});
		
		function limitConfirm(){
			var params = {
				cardNo : cardNo,
				creditLimit : expectedLimit,
				reason : reason,
				limitType : "02"
			};
			var url = mbank.getApiURL() + 'limitConfirm.do';
			mbank.apiSend('post', url, params, confirmSuccess, confirmError,false);
			
			function confirmSuccess(data){
				var path = next.getAttribute("path");
				var id = next.getAttribute("id");
				var noCheck = next.getAttribute("noCheck");
				var successType = "2";
				mbank.openWindowByLoad(path, id, "slide-in-right",{successType:successType, noCheck:noCheck});
				//mui.alert(111);
			}
	
			function confirmError(data){
				/*var errorCode = "7";
				var errorMsg = data.em;
				mbank.openWindowByLoad("creditAction_fail.html", "creditAction_fail","slide-in-right",{errorCode:errorCode,errorMsg:data.em});*/
				plus.nativeUI.toast(data.em);
				mui.back();
			}
		}
	});
});