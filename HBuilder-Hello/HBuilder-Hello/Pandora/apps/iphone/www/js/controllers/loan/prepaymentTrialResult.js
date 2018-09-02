define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var rcvAmt = self.rcvAmt;								//本期应付本息和
		var shouldBackFuLi = self.shouldBackFuLi;				//本期应付利息
		var shouldBackAmount = self.shouldBackAmount;			//下期应还本息和
		var shouldBackPrincipal = self.shouldBackPrincipal;		//下期应还本金
		var shouldBackInterest = self.shouldBackInterest;		//下期应还利息
		
		document.getElementById("rcvAmt").innerHTML = format.formatMoney(rcvAmt, 2) + "元";
		document.getElementById("shouldBackFuLi").innerHTML = format.formatMoney(shouldBackFuLi, 2) + "元";
		document.getElementById("shouldBackAmount").innerHTML = format.formatMoney(shouldBackAmount, 2) + "元";
		document.getElementById("shouldBackPrincipal").innerHTML = format.formatMoney(shouldBackPrincipal, 2) + "元";
		document.getElementById("shouldBackInterest").innerHTML = format.formatMoney(shouldBackInterest, 2) + "元";
	});
});