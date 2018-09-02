define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var orderFlowNo="";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        
        $("#accountNo").html(self.accountNo);
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
        $("#savingPeriod").html($.param.getDisplay("NOTIFY_DEPOSIT_TYPE",self.savingPeriod));
        $("#amount").html(format.formatMoney(self.amount,2));

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
	         		savingPeriod:self.savingPeriod,
	         		amount:self.amount,
	         		currencyType:self.currencyType,
	         		transferFlowNo:orderFlowNo
	         	};
	        	var url = mbank.getApiURL()+'002005_notifyDepositOpen.do';
			    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
			    function successCallback(data){
			    	data.title="开立通知存款";
			        mbank.openWindowByLoad('../savings/demand2NotifyResult.html','demand2NotifyResult','slide-in-right',data);
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
