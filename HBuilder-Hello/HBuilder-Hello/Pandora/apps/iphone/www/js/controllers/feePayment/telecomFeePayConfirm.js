define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	var self = "";
	
	var areaId = "";
	var chargeType = "";
	var chargeNo = "";
	var payNo = "";
	var chargeFee = "";
	var ChagAmt = "";
	var payName = "";
	var amountShouldBeCharged = "";
	var LastOdd = "";
	var CurrOdd = "";
	var serv_Id = "";
	var payIdNo = "";
	var accountName = "";
	var daypayment = "";
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
		payNo = self.payNo;
		chargeFee = self.chargeFee;
		ChagAmt = self.ChagAmt;
		payName = self.payName;
		amountShouldBeCharged = self.amountShouldBeCharged;
		LastOdd = self.LastOdd;
		CurrOdd = self.CurrOdd;
		serv_Id = self.serv_Id;
		payIdNo = self.payIdNo;
		accountName = self.accountName;
		daypayment = self.daypayment;
		orderFlowNo = self.orderFlowNo;
		amountRealCharged = self.amountRealCharged;
		accountNo = self.accountNo;
		commonSecurityUtil.initSecurityData('003030',self);
		document.getElementById("chargeType").innerText = jQuery.param.getDisplay("CHARGE_TYPE",chargeType);
		document.getElementById("areaCode").innerText = jQuery.param.getDisplay("CHARGEAREA_TYPE",areaId);
		document.getElementById("chargeNo").innerText = chargeNo;
		document.getElementById("payNo").innerText = payNo;
		document.getElementById("payName").innerText =	"*"+payName.substring(1);
		document.getElementById("amountShouldBeCharged").innerText = format.formatMoney(amountShouldBeCharged)+"元";
		document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
		document.getElementById("amountRealCharged").innerText = format.formatMoney(amountRealCharged)+"元";
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			urlVar = mbank.getApiURL()+'003003_telecomCharge.do';
			params={
				"chargeType" : chargeType,
				"areaId" : areaId,
				"chargeNo" : chargeNo,
				"payNo" : payNo,
				"chargeFee" : chargeFee,
				"ChagAmt" : ChagAmt,
				"payName" : payName,
				"amountShouldBeCharged" : amountShouldBeCharged,
				"LastOdd" : LastOdd,
				"CurrOdd" : CurrOdd,
				"accountNo" : accountNo,
				"amountRealCharged" : amountRealCharged,
				"daypayment" : daypayment,
				"serv_Id" : serv_Id,
				"payIdNo" : payIdNo,
				"accountName" : accountName,
				"orderFlowNo" : orderFlowNo,
				"summaryNo" : "",
				"evidSerialNo" : "",
				"evidType" : "",
				"CshTrsfFlg" : "0",
				"chargeWay" : "1"
			}
			commonSecurityUtil.apiSend("post",urlVar,params,telecomChargeSucFunc,telecomChargeFailFunc,true);
			function telecomChargeSucFunc(data){
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
			function telecomChargeFailFunc(e){
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