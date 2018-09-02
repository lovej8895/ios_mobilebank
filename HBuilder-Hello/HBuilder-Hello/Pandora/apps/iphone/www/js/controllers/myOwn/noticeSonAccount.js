define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var self = plus.webview.currentWebview();
		var data = self.params;
		var baseBank = self.baseBank;
//		var accountNo = format.dealMoney(data.subAccountNo);
		$("#accountNo").html(data.subAccountNo);
		if(data.currencyType=="01"){
			$("#currencyType").html("人民币");
		} else {
			$("#currencyType").html("未知");
		}
		$("#depositType").html($.param.getDisplay('SAVING_PERIOD_TYPE',data.savingPeriod)+$.param.getUserType('DESPOSIT_TYPE_NEW',data.depositType));
		var openDate=format.dataToDate(data.openDate);
		$("#openDate").html(openDate);
//		$("#openNode").html(baseBank);
		if(data.reserveDate==""){
			$('#dateReserve').hide();
		} else {
			var reserveDate=format.dataToDate(data.reserveDate);
			$("#reserveDate").html(reserveDate);
		}
		var balance = format.formatMoney(data.balance,2);
		$("#balance").html(balance+"元");
	
	});
});