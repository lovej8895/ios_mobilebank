define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var dataBefore = plus.webview.currentWebview().params;
		$('#recAccount').html(dataBefore.recAccount);
		$('#recAccountName').html(dataBefore.recAccountName);
		$('#payAmount').html(format.formatMoney(dataBefore.payAmount,2) );
		$('#sendHostTime').html(format.formatDateTime(dataBefore.sendHostTime));
		$('#orderState').html($.param.getUserType('TRANS_RESULT',dataBefore.orderState));
		if(dataBefore.orderState!=90){
			$('#hostErrorMessage').html(dataBefore.hostErrorMessage);
		} else {
			$('#errorMessage').hide();
		}
		
		
	});
});