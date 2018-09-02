define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var Repayconts = self.Repayconts;
		Repayconts = parseFloat(Repayconts);
		var Repayconts1=Repayconts;
		var loanInterestRate1 = self.loanInterestRate1;
		loanInterestRate1 = parseFloat(loanInterestRate1);
		var loanAmtBalance = self.loanAmtBalance;
		loanAmtBalance = parseFloat(loanAmtBalance);
		var html = '';
		for (var i = 1; i <= Repayconts1; i++) {
			huankuan=loanAmtBalance/Repayconts+(loanAmtBalance-(i-1)*loanAmtBalance/Repayconts)*loanInterestRate1;
			huankuan=format.formatMoney(huankuan);
	      	html+='<li><p class="color_6">期次</p>';
	    	html+='<p class="fz_15">' + i + '</p>';
	    	html+='<div class="content_rbox">';
	    	html+='<p class="color_6">' + huankuan + '元</p>';
	    	html+='<p class="fz_12 color_9">还本付息金额</p>';
	  		html+='</div></li>';
		}
		$("#everyRepayAmt").html(html);
	});
});