define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var reserveDate=undefined;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        
        $("#subAccountNo").html(self.subAccountNo);
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
        $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
        $("#openDate").html(format.dataToDate(self.openDate));
        $("#balance").html(format.formatMoney(self.balance,2));
        
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
        $("input[name='drawType']").on("change",function(){
            var drawType=$("input[name='drawType']:checked").val();
            if( drawType=="2" ){
            	$("#pickDate").show();
            }else{
                $("#pickDate").hide();        	
            }
        });	
        
         $("input[name='drawFlag']").on("change",function(){
            var drawFlag=$("input[name='drawFlag']:checked").val();
            if( drawFlag=="1" ){
            	$("#drawAmountLi").show();
            }else{
                $("#drawAmountLi").hide();        	
            }
        });	       
        
        $("#pickDate").on("tap",function(){
			plus.nativeUI.pickDate( function(e){
				reserveDate=e.date;
                $("#reserveDate").html(format.formatDate(reserveDate));
		    },function(e){
			    
			});	
        });        
        
        
        
        $("#confirmButton").on("tap",function(){
        	var drawType=$("input[name='drawType']:checked").val();
        	if( drawType=="2" ){
                 if( reserveDate==undefined ){
                 	mui.alert("请选择预约支取日期！");
                 	return false;
                 }else{
                 	var savingPeriod=self.savingPeriod;
                 	var days=savingPeriod - 1;
                 	var sysDate=format.dataToDate(self.sysDate);
                 	var d=format.addDay(reserveDate,-days);
                 	if( format.formatDate(d)<=sysDate ){
	                 	if( savingPeriod=="1" ){
	                 		mui.alert("预约支取日期必须在今天之后！");
	                 	}else{
	                 		mui.alert("预约支取日期必须在七天之后！");
	                 	}
	                 	return false;
                 	}

                 }
                 
        	}
        	var drawFlag=$("input[name='drawFlag']:checked").val();
        	var drawAmount=$("#drawAmount").val();
        	if( drawFlag=="1" ){   
	    	 	if( ""==drawAmount ){
	    	 		mui.alert("请输入支取金额！");
	    	 		return false;
	    	 	}else{
	    	 		var balance=self.balance;
	    	 		drawAmount=format.ignoreChar(drawAmount,',');
	    	 		if( parseFloat(drawAmount)<=0 ){
	    	 			mui.alert("支取金额必须大于0");
	    	 			return false;
	    	 		}
	    	 		if( parseFloat(drawAmount)>parseFloat(balance) ){
	    	 			mui.alert("您输入的支取金额超过账户余额，请重新输入！");
	    	 			return false;
	    	 		}
	    	 		if( parseFloat(drawAmount)<50000 ){
	    	 			mui.alert("预约支取金额不能小于五万元，请重新输入！");
	    	 			return false;
	    	 		}	    	 		
	    	 		if( parseFloat(balance)-parseFloat(drawAmount)<50 ){
	    	 			mui.alert("部分支取时账户的最低留存余额为五万元!");
	    	 			return false;
	    	 		}
	    	 	} 
        	}else{
        		drawAmount=self.balance;
        	}
        	 
        	var params={
        		accountNo:self.accountNo,
        		subAccountNo:self.subAccountNo,
        		currencyType:self.currencyType,
        		depositType:self.depositType,
        		openDate:self.openDate,
        		drawType:drawType,
        		drawAmount:drawAmount,
        		balance:self.balance,
        		savingPeriod:self.savingPeriod,
        		drawFlag:drawFlag,
        		subAccountSerNo:self.subAccountSerNo
        	};
        	if( drawType=="2" ){
        		params.reserveDate=format.formatDate(reserveDate);
        	}
        	var url = mbank.getApiURL()+'002005_notifyDepositDrawConfirm.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../savings/notify2DemandConfirm.html','notify2DemandConfirm','slide-in-right',data);
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
