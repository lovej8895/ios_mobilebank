define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var myAcctInfo = require('../../core/myAcctInfo');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        
        $("#accountNo").html(self.accountNo);
        myAcctInfo.getAccAmt(self.accountNo,"balance",true);  
  
 		$("#amount").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#amount").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});  
  
        $("#confirmButton").on("tap",function(){
        	var amount=$("#amount").val();
        	var balanceAvailable=format.ignoreChar($("#balance").html(),",");
        	if( ""==amount ){
        		mui.alert("请输入存款金额！");
        		return false;
        	}else{
        		amount=format.ignoreChar(amount,',');
        		if( parseFloat(amount)<50000 ){
        			mui.alert("个人通知存款最低起存金额为五万元!");
        			return false;
        		}
        		if( parseFloat(amount)>parseFloat(balanceAvailable) ){
        			mui.alert("输入的存款金额超过可用余额，请重新输入!");
        			return false;
        		}
        	}
         	var params={
         		accountNo:self.accountNo,
         		balanceAvailable:balanceAvailable,
         		amount:amount,
         		currencyType:"01",
         		savingPeriod:$("input[name='savingPeriod']:checked").val()
         	};
        	var url = mbank.getApiURL()+'002005_notifyDepositOpenConfirm.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../savings/demand2NotifyConfirm.html','demand2NotifyConfirm','slide-in-right',data);
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
