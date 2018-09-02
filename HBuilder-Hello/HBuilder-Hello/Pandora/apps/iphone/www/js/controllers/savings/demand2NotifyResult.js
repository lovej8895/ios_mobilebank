define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
        $("#accountNo").html(self.accountNo);
        $("#openDate").html(format.dataToDate(self.openDate));
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
        $("#savingPeriod").html($.param.getDisplay("NOTIFY_DEPOSIT_TYPE",self.savingPeriod));
        $("#amount").html(format.formatMoney(self.amount,2));
        
		$("#confirmButton").on("tap",function(){
            mui.back();			
		});
		
		//重写返回方法
		mui.back=function(){
			plus.webview.close("demand2NotifyInput");
			plus.webview.close("demand2NotifyConfirm");  
			mui.fire(plus.webview.getWebviewById("notifyDeposit"),"reload",{});
			plus.webview.close(self);
		} 		
		
	});

});