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
	var daypayment = "";
	var ReqSeqNo = "";
	var accountName = "";
	var orderFlowNo = "";
	var amountRealCharged = "";
	var accountNo = "";
	
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
		daypayment = self.daypayment;
		ReqSeqNo = self.ReqSeqNo;
		accountName = self.accountName;
		orderFlowNo = self.orderFlowNo;
		amountRealCharged = self.amountRealCharged;
		accountNo = self.accountNo;
		commonSecurityUtil.initSecurityData('003030',self);
		document.getElementById("chargeType").innerText = jQuery.param.getDisplay("CHARGE_TYPE",chargeType);
		document.getElementById("areaCode").innerText = jQuery.param.getDisplay("CHARGEAREA_TYPE",areaId);
		document.getElementById("chargeNo").innerText = chargeNo;
		document.getElementById("userName").innerText = "*"+userName.substring(1);
		document.getElementById("FeeNum").innerText = FeeNum + "笔";
		document.getElementById("amountShouldBeCharged").innerText = format.formatMoney(amountShouldBeCharged)+"元";
		document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
		document.getElementById("amountRealCharged").innerText = format.formatMoney(amountRealCharged)+"元";
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			urlVar = mbank.getApiURL()+'003003_waterCharge.do';
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
			commonSecurityUtil.apiSend("post",urlVar,params,waterChargeSucFunc,waterChargeFailFunc,true);
			function waterChargeSucFunc(data){
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
			function waterChargeFailFunc(e){
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