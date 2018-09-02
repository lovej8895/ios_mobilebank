define(function(require, exports, module) {
	//引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
		var queryDetail = self.queryDetail;//成交明细
		var f_deposit_acct = self.f_deposit_acct;
		
		$("#fundName").html(queryDetail.f_prodname+"("+queryDetail.f_prodcode+")");
		$("#transAcc").html(format.dealAccountHideFour(f_deposit_acct));
		$("#applyDate").html(format.dataToDate(queryDetail.f_transactiondate));
		$("#confirmDate").html(format.dataToDate(queryDetail.f_transactioncfmdate));
        $("#applyMoney").html(format.formatMoney(queryDetail.f_applicationamount,2));
        $("#applyNum").html(format.formatMoney(queryDetail.f_applicationvol,2));
        $("#confirmMoney").html(format.formatMoney(queryDetail.f_confirmedamount,2));
        $("#confirmNum").html(format.formatMoney(queryDetail.f_confirmedvol,2));
        $("#successTransValue").html(format.formatMoney(queryDetail.f_confirmnav,4));
        $("#procedureMoney").html(format.formatMoney(queryDetail.f_charge,2));
        $("#moneyType").html($.param.getDisplay("FCURRENCY_TYPE",queryDetail.f_currencytype));
        $("#transState").html(jQuery.param.getDisplay('FUND_TRANS_STATUS',queryDetail.f_status));
        $("#transType").html(jQuery.param.getDisplay('BUSINESS_CODE', queryDetail.f_businesscode));
        $("#transMethod").html(jQuery.param.getDisplay('ACCEPT_METHOD',queryDetail.f_acceptmethod));
        
        document.getElementById("submit").addEventListener('tap',function(){
			plus.webview.close(plus.webview.getWebviewById("successTranQuery"));
			plus.webview.close(plus.webview.getWebviewById("successTranQueryResult"));
        	plus.webview.close(self);
		});
        
	});

});
