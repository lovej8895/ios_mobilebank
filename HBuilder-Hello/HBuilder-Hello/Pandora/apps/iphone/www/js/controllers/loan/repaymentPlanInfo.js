define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var customerNameCN = self.customerNameCN;							//客户姓名
		var TacitlyrepaymentAccountNo = self.TacitlyrepaymentAccountNo;	//默认还款账号
		var shouldBackAmount = self.shouldBackAmount;						//应还金额
		var realityBackAmount = self.realityBackAmount;					//实还金额
		var shouldBackPrincipal = self.shouldBackPrincipal;				//应还本金
		var realityBackPrincipal = self.realityBackPrincipal;				//实还本金
		var shouldBackInterest = self.shouldBackInterest;					//应还利息
		var realityBackInterest = self.realityBackInterest;				//实还利息
		var shouldBackFine = self.shouldBackFine;							//应还罚息
		var realityBackFine = self.realityBackFine;						//实还罚息
		var shouldBackFuLi = self.shouldBackFuLi;							//应还复利
		var realityBackFuLi = self.realityBackFuLi;						//实还复利
		var endInterestDate = self.endInterestDate;						//结息日期
		var loanBalance = self.loanBalance;								//贷款余额
		var closeDate = self.closeDate;									//结清日期
		var closeDateShow = "";
		
		document.getElementById("customerNameCN").innerHTML = customerNameCN;
		document.getElementById("TacitlyrepaymentAccountNo").innerHTML = TacitlyrepaymentAccountNo;
		document.getElementById("shouldBackAmount").innerHTML = format.formatMoney(shouldBackAmount, 2) + "元";
		document.getElementById("realityBackAmount").innerHTML = format.formatMoney(realityBackAmount, 2) + "元";
		document.getElementById("shouldBackPrincipal").innerHTML = format.formatMoney(shouldBackPrincipal, 2) + "元";
		document.getElementById("realityBackPrincipal").innerHTML = format.formatMoney(realityBackPrincipal, 2) + "元";
		document.getElementById("shouldBackInterest").innerHTML = format.formatMoney(shouldBackInterest, 2) + "元";
		document.getElementById("realityBackInterest").innerHTML = format.formatMoney(realityBackInterest, 2) + "元";
		document.getElementById("shouldBackFine").innerHTML = format.formatMoney(shouldBackFine, 2) + "元";		
		document.getElementById("realityBackFine").innerHTML = format.formatMoney(realityBackFine, 2) + "元";
		document.getElementById("shouldBackFuLi").innerHTML = format.formatMoney(shouldBackFuLi, 2) + "元";
		document.getElementById("realityBackFuLi").innerHTML = format.formatMoney(realityBackFuLi, 2) + "元";
		document.getElementById("endInterestDate").innerHTML = format.formatDate(format.parseDate(endInterestDate, "yyyy/mm/dd"));
	});
});