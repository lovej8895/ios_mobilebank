define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
//	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
//		commonSecurityUtil.initSecurityData('005011', self);
		var loanAccount = self.loanAccount;
		var payAccount = self.payAccount;
		var balance = self.balance;
		var payBenJin = self.payBenJin;
		var payBenJinShow = format.formatMoney(payBenJin, 2);
		var payRate = self.payRate;
		var payRateShow = format.formatMoney(payRate, 2);
		var payAmount = self.payAmount;
		var payAmountShow = format.formatMoney(payAmount, 2);
		var chineseAmt = self.chineseAmt;
		
//		document.getElementById("payAccount").innerHTML = payAccount;
		document.getElementById("balance").innerHTML = balance +'元';
		document.getElementById("payBenJin").innerHTML = payBenJinShow +'元';
//		document.getElementById("chineseAmt").innerHTML = chineseAmt;
		document.getElementById("payRate").innerHTML = payRateShow + '元';
		document.getElementById("payAmount").innerHTML = payAmountShow + '元';
		
	    $("#nextButton").click(function(){
			var chekBalance = format.removeComma(balance);
			var checkPayAmount = format.removeComma(payAmountShow);
	    	if (parseFloat(chekBalance) < parseFloat(checkPayAmount)) {
	    		mui.alert("应还本息应该小于等于可用余额");
	    		return false;
	    	}
		    var params = {
			   	loanAccount : loanAccount,
			   	payAccount : payAccount,
			   	payBenJin : payBenJin,
			   	payRate : payRate,
			   	payAmount : payAmount,
			   	chineseAmt : chineseAmt,
			   	noCheck : false
			};
			mbank.openWindowByLoad('loanBackConfirm.html','loanBackConfirm','slide-in-right',params);
		});
		
	});
});