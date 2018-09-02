define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        
        $("#subAccountNo").html(self.subAccountNo);
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
        $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
        $("#openDate").html(format.dataToDate(self.openDate));
        $("#balance").html(format.formatMoney(self.balance,2));
        
        $("#backButton").on("tap",function(){
        	self.close();
        });
        
	});

});
