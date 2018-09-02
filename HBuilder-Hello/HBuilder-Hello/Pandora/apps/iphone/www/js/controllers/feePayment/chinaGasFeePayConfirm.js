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
	var FeeNum = "";
	var amountShouldBeCharged = "";
	var ReqSeqNo = "";
	var daypayment = "";
	var orderFlowNo = "";
	var accountName = "";
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
		FeeNum = self.FeeNum;
		amountShouldBeCharged = self.amountShouldBeCharged;
		ReqSeqNo = self.ReqSeqNo;
		daypayment = self.daypayment;
		orderFlowNo = self.orderFlowNo;
		accountName = self.accountName;
		accountNo = self.accountNo;
		amountRealCharged = self.amountRealCharged;
		commonSecurityUtil.initSecurityData('003030',self);
		document.getElementById("chargeType").innerText = jQuery.param.getDisplay("CHARGE_TYPE",chargeType);
		document.getElementById("areaCode").innerText = jQuery.param.getDisplay("CHARGEAREA_TYPE",areaId);
		document.getElementById("chargeNo").innerText = chargeNo;
		document.getElementById("userName").innerText = "*"+userName.substring(1);
		document.getElementById("FeeNum").innerText = FeeNum + "笔";
		document.getElementById("amountShouldBeCharged").innerText = format.formatMoney(amountShouldBeCharged)+"元";
		document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
		document.getElementById("amountRealCharged").innerText = format.formatMoney(amountRealCharged)+"元";
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			var urlVar = mbank.getApiURL()+'003003_chinaGasCharge.do';
			params={
				"chargeType" : chargeType,
				"areaId" : areaId,
				"chargeNo" : chargeNo,
				"userName" : userName,
				"FeeNum" : FeeNum,
				"amountShouldBeCharged" : amountShouldBeCharged,
				"accountNo" : accountNo,
				"amountRealCharged" : amountRealCharged,
				"daypayment" : daypayment,
				"ReqSeqNo" : ReqSeqNo,
				"orderFlowNo" : orderFlowNo,
				"accountName" : accountName,
				"CshTrsfFlg" : "0",
				"cardBookFlag" : "1",
				"chargeWay" : "1"
			};
			commonSecurityUtil.apiSend("post",urlVar,params,chinaGasChargeSucFunc,chinaGasChargeFailFunc,true);
			function chinaGasChargeSucFunc(data){
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
			function chinaGasChargeFailFunc(e){
				mui.alert(e.em,"温馨提示");
				return;
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