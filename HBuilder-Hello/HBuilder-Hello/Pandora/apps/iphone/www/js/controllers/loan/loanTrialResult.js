define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var trialType = self.trialType;
		var Repayconts = self.Repayconts;
		Repayconts = parseFloat(Repayconts);
		var loanInterestRate1 = self.loanInterestRate1;
		loanInterestRate1 = parseFloat(loanInterestRate1);
		var loanAmtBalance = self.loanAmtBalance;
		loanAmtBalance = parseFloat(loanAmtBalance);
		var html = '';
		//按期等额本息试算
		if (trialType == "1") {
			//计算每期还款额RepayAmt
			var RepayAmt=loanAmtBalance* (loanInterestRate1 * Math.pow((1 + loanInterestRate1), Repayconts)) / (Math.pow((1 + loanInterestRate1), Repayconts) - 1);
			html += '<ul class="p_lr30px"><li><span class="detail_left">每期还款额</span>';
			html += '<span class="detail_right">' + format.formatMoney(Math.round(RepayAmt*100)/100) + '元</span></li>';
			//还款期数
			html += '<li><span class="detail_left">还款期数</span>';
			html += '<span class="detail_right">' + Repayconts + '期</span></li>';
			//计算总利息额RepayRateTotal
			var RepayRateTotal=loanAmtBalance*((Repayconts*loanInterestRate1-1)*Math.pow(1 + loanInterestRate1,Repayconts)+1)/(Math.pow((1 + loanInterestRate1), Repayconts) - 1);
			html += '<li><span class="detail_left">总利息额</span>';
			html += '<span class="detail_right">' + format.formatMoney(Math.round(RepayRateTotal*100)/100) + '元</span></li>';
			//计算本息和priceAndRate
			var priceAndRate = parseFloat(loanAmtBalance)+parseFloat(RepayRateTotal);
			html += '<li><span class="detail_left">本息和</span>';
			html += '<span class="detail_right">' + format.formatMoney(Math.round(priceAndRate*100)/100) + '元</span></li></ul>';
			$('#trialResultInfo').html(html);
			$('#buttonArea').hide();
		}
		//按期等额本金
		if (trialType == "2") {
			//首期还款额FirstRepayAmt
			var FirstRepayAmt = loanAmtBalance/Repayconts+loanAmtBalance*loanInterestRate1;
			html += '<ul class="p_lr30px"><li><span class="detail_left">首期还款额</span>';
			html += '<span class="detail_right">' + format.formatMoney(Math.round(FirstRepayAmt*100)/100) + '元</span></li>';
			//还款期数
			html += '<li><span class="detail_left">还款期数</span>';
			html += '<span class="detail_right">' + Repayconts + '期</span></li>';
			//总利息RepayRateTotal
			var RepayRateTotal=loanAmtBalance*loanInterestRate1*(Repayconts+1)/2.0;	
			html += '<li><span class="detail_left">总利息</span>';
			html += '<span class="detail_right">' + format.formatMoney(Math.round(RepayRateTotal*100)/100) + '元</span></li>';
			//本息和priceAndRate
			var priceAndRate = parseFloat(loanAmtBalance)+parseFloat(RepayRateTotal);
			html += '<li><span class="detail_left">本息和</span>';
			html += '<span class="detail_right">' + format.formatMoney(Math.round(priceAndRate*100)/100) + '元</span></li></ul>';
			$('#trialResultInfo').html(html);
			$('#buttonArea').show();
		}
		//到期一次性还本付息 
		if (trialType == "3") {
			//到期还款额RepayAmt
			var RepayAmt=parseFloat(loanAmtBalance+loanAmtBalance*loanInterestRate1*Repayconts);
			html += '<ul class="p_lr30px"><li><span class="detail_left">到期还款额</span>';
			html += '<span class="detail_right">' + format.formatMoney(Math.round(RepayAmt*100)/100) + '元</span></li>';
			//总利息RepayRateTotal
			var RepayRateTotal = parseFloat(loanAmtBalance*loanInterestRate1*Repayconts);
			html += '<li><span class="detail_left">总利息</span>';
			html += '<span class="detail_right">' + format.formatMoney(Math.round(RepayRateTotal*100)/100) + '元</span></li></ul>';
			$('#trialResultInfo').html(html);
			$('#buttonArea').hide();
		}
		//按月付息到期一次性还本
		if (trialType == "4") {
			//每月支付的利息PayRateEveryMonth
			var RepayRateTotal=loanAmtBalance*loanInterestRate1*Repayconts;
			var PayRateEveryMonth=RepayRateTotal/Repayconts;
			html += '<ul class="p_lr30px"><li><span class="detail_left">每月支付的利息</span>';
			html += '<span class="detail_right">' + format.formatMoney(Math.round(PayRateEveryMonth*100)/100) + '元</span></li>';
			//本息和RepayAmt
			var RepayAmt=parseFloat(loanAmtBalance)+parseFloat(RepayRateTotal);
			html += '<li><span class="detail_left">本息和</span>';
			html += '<span class="detail_right">' + format.formatMoney(Math.round(RepayAmt*100)/100) + '元</span></li></ul>';
			$('#trialResultInfo').html(html);
			$('#buttonArea').hide();
		}
		
		$("#searchButton").click(function(){
			var params = {
	    		loanAmtBalance : loanAmtBalance,
	    		Repayconts : Repayconts,
	    		loanInterestRate1 : loanInterestRate1,
	    		noCheck : false
	    	};
			mbank.openWindowByLoad('everyRepayAmt.html','everyRepayAmt','slide-in-right',params);
		});
		
	});
});