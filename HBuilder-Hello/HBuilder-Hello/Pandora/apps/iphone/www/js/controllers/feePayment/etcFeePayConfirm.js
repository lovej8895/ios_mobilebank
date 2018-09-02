define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	
	var COLORS={"0":"蓝色","1":"黄色","2":"黑色","3":"白色"};
	var CHARGE_TYPE={"0":"普通预存","1":"预存优惠","2":"年优惠票","3":"定额票"};
	
	var self = "";
	var chargeType = "";
    var carNo = "";
    var carColor = "";
    var lowestAmt = "";
    var balance = "";
    var haltAmt = "";
    var oweAmt = "";
    var amountRealCharged = "";
    var daypayment = "";
    var userName = "";
    var chargeNo = "";
    var userNo = "";
    var carType = "";
//  var couponStandard = "";
//  var signBankName = "";
//  var certType = "";
//  var certNo = "";
    var accountName = "";
    var orderFlowNo = "";
    var payType = "";
    var accountNo = "";
    
    var urlVar = "";
    var params;
    
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		chargeType = self.chargeType;
		carNo = self.carNo;
		carColor = self.carColor;
		lowestAmt = self.lowestAmt;
		balance = self.balance;
		haltAmt = self.haltAmt;
		oweAmt = self.oweAmt;
		amountRealCharged = self.amountRealCharged;
		daypayment = self.daypayment;
		userName = self.userName;
		chargeNo = self.chargeNo;
		userNo = self.userNo;
		carType = self.carType;
//		couponStandard = self.couponStandard;
		accountName = self.accountName;
		orderFlowNo = self.orderFlowNo;
		payType = self.payType;
		accountNo = self.accountNo;
		commonSecurityUtil.initSecurityData('003031',self);
		document.getElementById("carNo").innerText = carNo;
		document.getElementById("carColor").innerText = COLORS[carColor];
		document.getElementById("lowestAmt").innerText = format.formatMoney(lowestAmt)+"元";
		document.getElementById("etcBalance").innerText = format.formatMoney(balance)+"元";
		document.getElementById("haltAmt").innerText = format.formatMoney(haltAmt)+"元";
		document.getElementById("oweAmt").innerText = format.formatMoney(oweAmt)+"元";
		document.getElementById("payType").innerText = CHARGE_TYPE[payType];
		document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
		document.getElementById("amountRealCharged").innerText = format.formatMoney(amountRealCharged)+"元";
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			var urlVar = mbank.getApiURL()+'003003_etcCharge.do';
			params = {
				"chargeType" : chargeType,
				"carNo" : carNo,
				"carColor" : carColor,
//				"lowestAmt" : lowestAmt,
//				"balance" : balance,
//				"haltAmt" : haltAmt,
//				"oweAmt" : oweAmt,
				"payType" : payType,
				"accountNo" : accountNo,
				"amountRealCharged" : amountRealCharged,
				"daypayment" : daypayment,
				"userName" : userName,
				"chargeNo" : chargeNo,
				"userNo" : userNo,
				"carType" : carType,
//				"couponStandard" : couponStandard,
				"accountName" : accountName,
				"orderFlowNo" : orderFlowNo,
				"chargeKind" : "1",
				"chargeWay" : "0",
				"voucherType" : "01",
				"takeType" : "1",
				"channelFlag" : "6",
				"voucherCode" : "",
				"loanEvidNo" : "",
				"billNo" : "",
				"flag" : "1",
				"StartDt" : "",
				"EndDt" : ""
			};
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
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
	});
});			