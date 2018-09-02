define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var dataBefore = plus.webview.currentWebview().params;
		var loanFlag = $.param.getUserType('LOAN_FLAG',dataBefore.loanFlag);
		$('#tranDate').html(format.dataToDate(dataBefore.tranDate));
		if(loanFlag=="-"&&parseFloat(dataBefore.tranAmt)>0){
			$('#pay').html(format.formatMoney(dataBefore.tranAmt,2)+"元");
			$('#incomeLi').hide();
		} else if(loanFlag=="+"||(loanFlag=="-"&&parseFloat(dataBefore.tranAmt)<0)){
			$('#income').html(format.formatMoney(format.ignoreChar(dataBefore.tranAmt,"-"),2)+"元");
			$('#payLi').hide();
		}
		$('#balance').html(format.formatMoney(dataBefore.balance,2)+"元");
		$('#tranBankName').html(dataBefore.tranBankName);
		$('#tranchannel').html($.param.getDisplay('TRAN_CHANNEL',dataBefore.tranchannel));
		$('#rem').html(dataBefore.fuyan);
		$('#recAccName').html(dataBefore.recAccName);
		$('#recAccount').html(dataBefore.recAccount);
		
	});
});