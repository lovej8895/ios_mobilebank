define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	var self = "";
	
	var areaId = "";
	var chargeType = "";
	var chargeNo = "";
	var userName = "";
	var balance = "";
	var amountShouldBeCharged = "";
	var accountName = "";
	var daypayment = "";
	var orderFlowNo = "";
	var accountNo = "";
	var amountRealCharged = "";
	
	var params;
	var urlVar;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		areaId = self.areaId;
		chargeType = self.chargeType;
		chargeNo = self.chargeNo;
		userName = self.userName;
		balance = self.balance;
		amountShouldBeCharged = self.amountShouldBeCharged;
		accountName = self.accountName;
		daypayment = self.daypayment;
		orderFlowNo = self.orderFlowNo;
		accountNo = self.accountNo;
		amountRealCharged = self.amountRealCharged;
		commonSecurityUtil.initSecurityData('003030',self);
		document.getElementById("chargeType").innerText = jQuery.param.getDisplay("CHARGE_TYPE",chargeType);
		document.getElementById("areaCode").innerText = jQuery.param.getDisplay("CHARGEAREA_TYPE",areaId);
		document.getElementById("chargeNo").innerText = chargeNo;
		document.getElementById("userName").innerText = "*"+userName.substring(1);
		document.getElementById("amountShouldBeCharged").innerText = format.formatMoney(amountShouldBeCharged)+"元";
		document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
		document.getElementById("amountRealCharged").innerText = format.formatMoney(amountRealCharged)+"元";
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			urlVar = mbank.getApiURL()+'003003_electricityCharge.do';
			params = {
				"areaId" : areaId,
				"chargeType" : chargeType,
				"chargeNo" : chargeNo,
				"userName" : userName,
				"amountShouldBeCharged" : amountShouldBeCharged,
				"accountNo" : accountNo,
				"amountRealCharged" : amountRealCharged,
				"daypayment" : daypayment,
				"balance" : balance,
				"accountName" : accountName,
				"orderFlowNo" : orderFlowNo,
				"billNo" : "",
				"loanEvidNo" : "",
				"CshTrsfFlg" : "0",
				"cardBookFlag" : "1",
				"chargeWay" : "1"
			};
			commonSecurityUtil.apiSend("post",urlVar,params,electricityChargeSucFunc,electricityChargeFailFunc,true);
			function electricityChargeSucFunc(data){
				if(data.ec == "000"){
					params = {
						"chargeType" : chargeType,
						"orderState" : data.orderState,
						"resultMsg" : data.em
					};
					mbank.openWindowByLoad('../feePayment/feePaymentChargeResult.html','feePaymentChargeResult','slide-in-right',params);
				}else{
					mui.alert(data.em,"温馨提示");
				}
			}
			function electricityChargeFailFunc(e){
				mui.alert(e.em,"温馨提示");
				return;
			}
		},false);
		
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
	});
});