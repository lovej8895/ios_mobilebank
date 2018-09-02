define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
        $("#accountNo").html(format.dealAccountHideFour(self.accountNo));
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
        $("#depositType").html($.param.getDisplay("TRANSFER_DEPOSIT_TYPE",self.depositType));
        $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD",self.savingPeriod));
        $("#interestRate").html(self.interestRate+"%");
        $("#amount").html(format.formatMoney(self.amount,2));
        var transferSaveType=self.transferSaveType;
        if( "1"==transferSaveType ){
        	$("#transferSaveType").html("是");
        	$("#transferSaveDays").html($.param.getDisplay("SAVING_PERIOD",self.transferSaveDays));
            $("#transferSaveDaysLi").show();
        }else{
        	$("#transferSaveType").html("否");
        	$("#transferSaveDaysLi").hide();
        }

		$("#confirmButton").on("tap",function(){
            mui.back();
		});
		
		//重写返回方法
		mui.back=function(){
			plus.webview.close("demand2FixedInput");
			plus.webview.close("demand2FixedConfirm");
			mui.fire(plus.webview.getWebviewById("demandFixed"),"reload",{});						
			plus.webview.close(self);	
		} 		
		
	});

});