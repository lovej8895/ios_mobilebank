define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var loanAccount = self.loanAccount;
		var payAccount = self.payAccount;
		var payBenJin = self.payBenJin;
		var payBenJinShow = format.formatMoney(payBenJin, 2);
		var payRate = self.payRate;
		var payRateShow = format.formatMoney(payRate, 2);
		var payAmount = self.payAmount;
		var payAmountShow = format.formatMoney(payAmount, 2);
		var chineseAmt = self.chineseAmt;
		
		document.getElementById("payAccount").innerHTML = payAccount;
		document.getElementById("payBenJin").innerHTML = payBenJinShow +'元';
		document.getElementById("chineseAmt").innerHTML = chineseAmt;
		document.getElementById("payRate").innerHTML = payRateShow +'元';
		document.getElementById("payAmount").innerHTML = payAmountShow +'元';
		
		$("#backButton").on("tap",function(){
			mui.back();
		});
		mui.back=function(){
			if(plus.webview.getWebviewById("cycleDetailInfo")){//循环贷款详情入口
				plus.webview.close("cycleDetailInfo");
				mui.fire(plus.webview.getWebviewById("cycleDetailList"),"reload",{});//刷新循环贷款明细列表
			}
			if(plus.webview.getWebviewById("personalLoanInfo")){//我的贷款详情入口
				plus.webview.close("personalLoanInfo");
			}
			plus.webview.close("loanBackInput");
			if(plus.webview.getWebviewById("loanBackCheck")){
				plus.webview.close("loanBackCheck");
			}
			plus.webview.close("loanBackConfirm");
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("personalLoanList"), 'reload', {});
		}
	});
});