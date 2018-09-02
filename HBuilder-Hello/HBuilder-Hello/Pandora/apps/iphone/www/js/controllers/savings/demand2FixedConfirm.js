define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var orderFlowNo="";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        
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

        $("#preStep").on("tap",function(){
        	self.close();
        });
        
        $("#confirmButton").on("tap",function(){
            //获取防重复提交流水号
	        var url = mbank.getApiURL()+'GetOrderFlowNo.do';
		    mbank.apiSend("post",url,{},function(data){
		    	orderFlowNo=data.orderFlowNo;
		    	tranConfirm();		    	
		    },function(data){
		    	dealFail(data);
		    },true);
        	function tranConfirm(){
	         	var params={
	         		accountNo:self.accountNo,
	         		depositType:self.depositType,
	         		savingPeriod:self.savingPeriod,
	         		amount:self.amount,
	         		currencyType:self.currencyType,
	         		transferSaveType:self.transferSaveType,
	         		interestRate:self.interestRate,
	         		transferFlowNo:orderFlowNo,
	         		transferSaveDays:self.transferSaveDays
	         	};
	        	var url = mbank.getApiURL()+'002004_demandToTime.do';
			    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
			    function successCallback(data){
			    	data.title="存定期";
			        mbank.openWindowByLoad('../savings/demand2FixedResult.html','demand2FixedResult','slide-in-right',data);
			    }
			    function errorCallback(data){
			    	dealFail(data);
			    }       		
        	}
        	
        });
        
 	    function dealFail(data){
            mui.alert(data.em);
        }
 	    
	});

});
