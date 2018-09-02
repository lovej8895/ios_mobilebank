define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
        $("#accountNo").html(self.accountNo);
        $("#subAccountNo").html(self.subAccountNo);
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
        $("#depositType").html($.param.getDisplay("TRANSFER_DEPOSIT_TYPE",self.depositType));
        $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
        $("#interestBeginDate").html(format.dataToDate(self.interestBeginDate));
        $("#interestEndDate").html(format.dataToDate(self.interestEndDate));
	    $("#drawAmount").html(format.formatMoney(self.drawAmount,2));
        $("#interest").html(format.formatMoney(self.interest,2));
        $("#principalAndInterest").html(format.formatMoney(self.principalAndInterest,2));

		$("#confirmButton").on("tap",function(){
			mui.back();
		});
		
		//重写返回方法
		mui.back=function(){
			plus.webview.close("fixed2DemandInput");
			plus.webview.close("fixed2DemandConfirm");		
			mui.fire(plus.webview.getWebviewById("demandFixed"),"reload",{});
			plus.webview.close(self);
		} 		
		
	});

});