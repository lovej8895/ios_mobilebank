
define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var balance="";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        
        $("#subAccountNo").html(self.subAccountNo);
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
        $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
        $("#openDate").html(format.dataToDate(self.openDate));
        
     	var params={
            accountNo:self.accountNo,
            subAccountNo:self.subAccountNo,
            subAccountSerNo:self.subAccountSerNo
     	};
    	var url = mbank.getApiURL()+'002005_queryNotifyDepInfos.do';
	    mbank.apiSend("post",url,params,function(data){
	    	var subAc = data.iSubAccountInfo[0];
	    	balance=subAc.balance;
	    	$("#reserveDate").html(subAc.reserveDate);
	    	$("#balance").html(format.formatMoney(subAc.balance,2));
	    },function(data){
	    	mui.alert(data.em);
	    },true);
        
        $("#backButton").on("tap",function(){
        	self.close();
        });
        
        $("#confirmButton").on("tap",function(){
    		var params={
         		accountNo:self.accountNo,
         	    subAccountNo:self.subAccountNo,
         	    openDate:self.openDate,
         		currencyType:self.currencyType,
         		subAccountSerNo:self.subAccountSerNo,
         		savingPeriod:self.savingPeriod,
         		balance:balance
         	};
        	var url = mbank.getApiURL()+'002005_cancelReserve.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		    	data.title="预约取消";
		        mbank.openWindowByLoad('../savings/savingsResult.html','savingsResult','slide-in-right',data);
		    }
		    function errorCallback(data){
		    	dealFail(data);
		    } 	
 
        });
 
 	    function dealFail(data){
        	data.title="预约取消";
		    mbank.openWindowByLoad('../savings/savingsFail.html','savingsFail','slide-in-right',data);
        } 
 
	});

});
