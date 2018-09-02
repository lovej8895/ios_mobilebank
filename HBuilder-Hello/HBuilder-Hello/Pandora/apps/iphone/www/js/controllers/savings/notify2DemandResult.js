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
        $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
        $("#openDate").html(format.dataToDate(self.openDate));
        $("#drawType").html($.param.getDisplay("DRAW_TYPE",self.drawType));
        $("#drawFlag").html($.param.getDisplay("DRAW_FLAG",self.drawFlag));
        $("#drawAmount").html(format.formatMoney(self.drawAmount,2));
        $("#interest").html(format.formatMoney(self.interest,2));
        $("#principalAndInterest").html(format.formatMoney(self.principalAndInterest,2));
        
        if( self.drawType=="1" ){
        	$(".backbox_fo").show();
        }else{
        	$(".backbox_fo").hide();
        }
        
		$("#confirmButton").on("tap",function(){
            mui.back();			
		});
		
		//重写返回方法
		mui.back=function(){
			plus.webview.close("notify2DemandInput");
			plus.webview.close("notify2DemandConfirm");  
			mui.fire(plus.webview.getWebviewById("notifyDeposit"),"reload",{});
			plus.webview.close(self);
		} 		
		
	});

});