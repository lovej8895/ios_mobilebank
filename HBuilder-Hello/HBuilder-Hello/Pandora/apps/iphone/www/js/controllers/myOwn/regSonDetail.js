define(function(require, exports, module){
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var data = plus.webview.currentWebview().params;
		$("#accountNo").html(data.subAccountNo);
		if(data.currencyType=="01"){
			$("#currencyType").html("人民币");
		} else {
			$("#currencyType").html("未知");
		}
		
		$("#depositType").html($.param.getDisplay('DESPOSIT_TYPE_NEW',data.depositType)+$.param.getDisplay('SAVING_PERIOD_TYPE',data.savingPeriod));//储种
		$("#interestRate").html(data.interestRate+"%");
		var openDate=format.dataToDate(data.openDate);
		$("#openDate").html(openDate);
		var interestEndDate=format.dataToDate(data.interestEndDate);
		$("#interestEndDate").html(interestEndDate);
		if(data.transferSaveType=="0"){
			$("#transferSaveDays").html("不转存");
		} else {
			if(data.transferSaveDays!=null&&data.transferSaveDays!=''){
				$("#transferSaveDays").html("自动转存  "+$.param.getDisplay('SAVING_PERIOD_TYPE2',data.transferSaveDays));
			}
		}
		var balance = format.formatMoney(data.balance,2);
		$("#balance").html(balance+"元");
	});
});
