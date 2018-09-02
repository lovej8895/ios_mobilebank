define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var realityBackAmount = self.realityBackAmount;					//实还金额
		var realityBackPrincipal = self.realityBackPrincipal;				//实还本金
		var realityBackInterest = self.realityBackInterest;				//实还利息
		var realityBackFine = self.realityBackFine;						//实还罚息
		var realityBackFuLi = self.realityBackFuLi;						//实还复利
		var closeDate = self.closeDate;									//结清日期
		
		document.getElementById("realityBackAmount").innerHTML = format.formatMoney(realityBackAmount, 2) + "元";
		document.getElementById("realityBackPrincipal").innerHTML = format.formatMoney(realityBackPrincipal, 2) + "元";
		document.getElementById("realityBackInterest").innerHTML = format.formatMoney(realityBackInterest, 2) + "元";
		document.getElementById("realityBackFine").innerHTML = format.formatMoney(realityBackFine, 2) + "元";
		document.getElementById("realityBackFuLi").innerHTML = format.formatMoney(realityBackFuLi, 2) + "元";
		document.getElementById("closeDate").innerHTML = format.formatDate(format.parseDate(closeDate, "yyyy/mm/dd"));
	});
});