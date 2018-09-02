define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        
        $("#subAccountNo").html(self.subAccountNo);
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
        $("#depositType").html($.param.getDisplay("TRANSFER_DEPOSIT_TYPE",self.depositType));
        $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
        $("#interestRate").html(self.interestRate+"%");
        $("#interestBeginDate").html(format.dataToDate(self.interestBeginDate));
        $("#interestEndDate").html(format.dataToDate(self.interestEndDate));
        $("#balance").html(format.formatMoney(self.balance,2));
        $("#transferSaveType").html($.param.getDisplay("TRANSFER_SAVE_TYPE",self.transferSaveType));
        if( "1"==self.transferSaveType ){
        	$("#transferSaveDays").html($.param.getDisplay("SAVING_PERIOD_TYPE2",self.transferSaveDays));
        	$("#transferSaveDaysLi").show();
        }
        
 		$("#drawAmount").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#drawAmount").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
        $('input[name="drawType"]').on("change",function(){
            var drawType=$("input[name='drawType']:checked").val();
            if( drawType=="0" ){
            	$("#drawAmountLi").hide();
            }else{
                $("#drawAmountLi").show();        	
            }
        });	
        
        $("#confirmButton").on("tap",function(){
        	 var drawType=$("input[name='drawType']:checked").val();
        	 var drawAmount=$("#drawAmount").val();
        	 if( drawType=="1" ){
        	 	if( ""==drawAmount ){
        	 		mui.alert("请输入支取金额！");
        	 		return false;
        	 	}else{
        	 		var balance=self.balance;
        	 		drawAmount=format.ignoreChar(drawAmount,',');
        	 		if( parseFloat(drawAmount)<=0 ){
        	 			mui.alert("支取金额必须大于0！");
        	 			return false;
        	 		}
        	 		if( parseFloat(drawAmount)>parseFloat(balance) ){
        	 			mui.alert("您输入的支取金额超过账户余额，请重新输入！");
        	 			return false;
        	 		}
        	 		if( parseFloat(balance)-parseFloat(drawAmount)<50 ){
        	 			mui.alert("部分支取时定期账户的最低留存余额为50元!");
        	 			return false;
        	 		}
        	 	}
        	 }else{
        	 	drawAmount=self.balance;
        	 }
        	var params={
        		accountNo:self.accountNo,
        		drawType:drawType,
        		subAccountNo:self.subAccountNo,
        		currencyType:self.currencyType,
        		depositType:self.depositType,
        		savingPeriod:self.savingPeriod,
        		balance:self.balance,
        		interestRate:self.interestRate,
        		transferSaveType:self.autoTransferFlag,
        		drawAmount:drawAmount,
        		accountStat:self.accountStat,
        		interestBeginDate:self.interestBeginDate,
        		interestEndDate:self.interestEndDate,
        		subAccountSerNo:self.subAccountSerNo,
        		transferSaveDays:self.transferSaveDays
        	};
        	var url = mbank.getApiURL()+'002004_timeToDemandConfirm.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../savings/fixed2DemandConfirm.html','fixed2DemandConfirm','slide-in-right',data);
		    }
		    function errorCallback(data){
		    	dealFail(data);
		    }	
        });
        
	    function dealFail(data){
            mui.alert(data.em);
        }        
        mbank.resizePage(".btn_bg_f2");
	});

});
