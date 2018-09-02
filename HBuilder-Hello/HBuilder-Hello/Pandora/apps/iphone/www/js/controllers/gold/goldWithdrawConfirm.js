define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	
	var self = "";
	var params;
	var urlVar;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		commonSecurityUtil.initSecurityData('011601',self);
		
		var accountNo = self.accountNo;
		var goldAipNo = self.goldAipNo;
		var goldAmtCanUseBal = self.goldAmtCanUseBal;
		var payAmount = self.payAmount;
		
		
		document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
		document.getElementById('payAmount').innerText = format.formatMoney(payAmount);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			params={
				"accountNo" : accountNo,
				"goldAipNo" : goldAipNo,
				"tranType" : "2",
				"payAmount" : payAmount
			};
			var urlVar = mbank.getApiURL()+'goldWithdrawConfirm.do';
			commonSecurityUtil.apiSend("post",urlVar,params,confirmSuc,confirmFail,true);
//			mbank.apiSend("post",urlVar,params,confirmSuc,confirmFail,true);
			function confirmSuc(data){
				if(data.ec =='000'){
					params = {
						"flowNo" : data.hostFlowNo,
						"orderState" : data.orderState,
						"resultMsg" : data.em,
						"accountNo" : accountNo,
						"goldAipNo" : goldAipNo,
						"payAmount" : payAmount,
						"noCheck" : "false"
					};
					mbank.openWindowByLoad("../gold/goldWithdrawResult.html","goldWithdrawResult", "slide-in-right",params);
				}else{
					mui.alert(data.em,"温馨提示","确认",function(){
						plus.webview.currentWebview().close();
						return;
					});
				}
			}
			function confirmFail(e){
				mui.alert(e.em,"温馨提示","确认",function(){
					plus.webview.currentWebview().close();
					return;
				});
			}
		},false);
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
	});
});