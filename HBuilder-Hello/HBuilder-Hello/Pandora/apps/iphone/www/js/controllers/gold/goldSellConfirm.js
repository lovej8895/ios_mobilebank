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
		
		commonSecurityUtil.initSecurityData('011401',self);
		
		var accountNo = self.accountNo;
		var goldAipNo = self.goldAipNo;
		var goldTotalWeight = self.goldTotalWeight;
		var goldUnitPrice = self.goldUnitPrice;
		var sellWeight = self.sellWeight;
		var expectAmount = self.expectAmount;
		var expectCharge = self.expectCharge;
		
		document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
		document.getElementById('goldUnitPrice').innerText = format.formatMoney(goldUnitPrice) +'元/克';
		document.getElementById('goldTotalWeight').innerText = goldTotalWeight +'克';
		document.getElementById('sellWeight').innerText = sellWeight +'克';
		document.getElementById('expectAmount').innerText = format.formatMoney(expectAmount) +'元';
		document.getElementById('expectCharge').innerText = format.formatMoney(expectCharge) +'元';
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			params={
				"accountNo" : accountNo,
				"goldAipNo" : goldAipNo,
				"sellWeight" : sellWeight
			};
			var urlVar = mbank.getApiURL()+'goldSellConfirm.do';
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
						"sellWeight" : sellWeight,
						"noCheck" : "false"
					};
					mbank.openWindowByLoad("../gold/goldSellResult.html","goldSellResult", "slide-in-right",params);
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