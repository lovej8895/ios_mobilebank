define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	
	var moneyReg = new RegExp("^[0-9]{1,15}(\.[0-9]{0,2})?$", "i");
	var payTypeArys = {"W":"水费","E":"电费","M":"电话充值"};
	
	var self = "";
	
	var chargeType = "";
	var custType = "";
	var userNo = "";
	var areaId = "";
	var areaIdVar = "";
	var summaryNo = "";
	var accountNo = "";
	var amountShouldBeCharged = "";
	var amountRealCharged = "";
	var reckType = "";
	
    var urlVar = "";
    var params = "";
    
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		chargeType = self.chargeType;
		custType = self.custType;
		userNo = self.userNo;
		areaId = self.areaId;
		areaIdVar = self.areaIdVar;
		summaryNo = self.summaryNo;
		accountNo = self.accountNo;
		amountShouldBeCharged = self.amountShouldBeCharged;
		amountRealCharged = self.amountRealCharged;
		reckType = self.reckType;
		commonSecurityUtil.initSecurityData('003032',self);
		document.getElementById("titleSpan").innerText = payTypeArys[reckType];
		document.getElementById("tipSpan").innerText = payTypeArys[reckType] + "缴费信息";
		document.getElementById("areaCode").innerText = jQuery.param.getDisplay('AREA_CODE',areaIdVar);
		document.getElementById("chargeType").innerText = jQuery.param.getDisplay('PAY_TYPE',custType);
		document.getElementById("userNo").innerText = userNo;
		document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
		document.getElementById("amountShouldBeCharged").innerText = format.formatMoney(amountShouldBeCharged)+"元";
		document.getElementById("amountRealCharged").innerText = format.formatMoney(amountRealCharged)+"元";
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			urlVar = mbank.getApiURL()+'003006_UnionPaySubmit.do';
			params = {
				"userNo" : userNo,
				"areaId" : areaId,
				"summaryNo" : summaryNo,
				"custType" : custType,
				"accountNo" : accountNo,
				"chargeType" : chargeType,
				"amountRealCharged" : amountRealCharged,
				"amountShouldBeCharged" : amountShouldBeCharged,
				"reckType" : reckType
			};
			commonSecurityUtil.apiSend("post",urlVar,params,unionPaySubmitSucFunc,unionPaySubmitFailFunc,true);
			function unionPaySubmitSucFunc(data){
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
			function unionPaySubmitFailFunc(e){
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