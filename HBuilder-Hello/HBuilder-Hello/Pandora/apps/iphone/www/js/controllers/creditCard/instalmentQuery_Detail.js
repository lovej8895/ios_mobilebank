define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		var contextData = plus.webview.currentWebview();
		$("#instTrxnSeqShow").text(contextData.instTrxnSeq);
		$("#instalmentDateShow").text(contextData.instalmentDate);
		$("#instalmentAmtShow").text(format.formatMoney(contextData.instalmentAmt));
		$("#instalmentTimesShow").text(contextData.instalmentTimes);
		$("#chargeFeeShow").text(contextData.chargeFee);
		$("#interestShow").text(contextData.interest);
		$("#amountRealChargedShow").text(format.formatMoney(contextData.amountRealCharged));
		$("#unReturnTimesShow").text(contextData.unReturnTimes);
		$("#trxn_settl_statusShow").text(contextData.trxn_settl_status);
		
		$("#backBtn").on("tap",function(){
			plus.webview.close(contextData);
			//mbank.openWindowByLoad('../creditCard/instalmentQuery_Input_Menu.html','instalmentQuery_Input_Menu','slide-in-right');
		});
	});
});