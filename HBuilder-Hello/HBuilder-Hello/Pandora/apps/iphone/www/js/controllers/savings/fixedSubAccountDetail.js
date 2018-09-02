define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        
        $("#subAccountNo").html(self.subAccountNo);
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
//      $("#accountStatus").html($.param.getDisplay("ACCOUNTNO_STATEBANK_TYPE",self.accountStat));
        $("#depositType").html($.param.getDisplay("DESPOSIT_TYPE_NEW",self.depositType)+$.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
//      $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
        $("#interestRate").html(self.interestRate+"%");
        $("#interestBeginDate").html(format.dataToDate(self.interestBeginDate));
        $("#interestEndDate").html(format.dataToDate(self.interestEndDate));
        $("#balance").html(format.formatMoney(self.balance,2));
        $("#transferSaveType").html($.param.getDisplay("TRANSFER_SAVE_TYPE",self.transferSaveType));
        if( "0"==self.transferSaveType ){
        	$("#transferSaveType").html("不转存");
        	
        } else {
        	if(self.transferSaveDays!=null&&self.transferSaveDays!=''){
				$("#transferSaveType").html("自动转存  "+$.param.getDisplay('SAVING_PERIOD_TYPE2',self.transferSaveDays));
			}
        }
        
        $("#backButton").on("tap",function(){
        	self.close();
        });
        
	});

});
