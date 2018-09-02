define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
    var commonSecurityUtil = require('../../core/commonSecurityUtil');
    var passwordUtil = require('../../core/passwordUtil');
    var orderFlowNo="";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('002019',self);
		
		$("#payAccount").html(format.dealAccountHideFour(self.payAccount));
		$("#recAccount").html(self.recAccount);
		$("#recAccountName").html(self.recAccountName);
		$("#payAmount").html(self.payAmount);
		
		var url = mbank.getApiURL()+'GetOrderFlowNo.do';
	    mbank.apiSend("post",url,{},function(data){
	    	orderFlowNo=data.orderFlowNo;
	    },function(e){
	    	mui.alert("获取防重复提交流水号失败！");
	    },true);
		
		$("#getIdentifyCode").on("tap",function(){
			var recAccount=self.recAccount;
			var smsContent="注册账户互转交易：收款人"+self.recAccountName+"(尾号"
			              +recAccount.substring(recAccount.length-4,recAccount.length)+"),金额"+self.payAmount+"元，";
			var param={
				payAmount:self.payAmount,
				smsContent:smsContent,
				recAccount:self.recAccount,
	 			id:$(this).attr("id")
	 	   }
	 	    mbank.getSmsCode(param);
		});
		
		$("#confirmButton").on("tap",function(){			
		    //大额提醒
	    	var url=mbank.getApiURL()+'exceedLimitRemind.do';
	    	var param={
             	payAmount:self.payAmount,
             	scheduleFlag:self.scheduleFlag,
             	payAccount:self.payAccount,
             	transferChannel:"1",
             	recAccount:self.recAccount		    		
	    	};
	    	mbank.apiSend("post",url,param,function(data){
             	if( data.limitFlag=="1" ){
             		var limitMessage=data.limitMessage+"？";
                 	mui.confirm(limitMessage,"提示",["确认","取消"], function(e) {
					if (e.index == 0) {
						transfer();
					} });
             	}else{
             		transfer(); 
             	}		    		
	    	},function(data){
	    		dealFail(data);
	    	},true);

            //转账交易
            function transfer(){
	 		    var params={
			    	payAccount:self.payAccount,
			    	recAccount:self.recAccount,
			    	recAccountName:self.recAccountName,
			    	transferChannel:"1",
			    	payAmount:self.payAmount,
			    	specifyType:self.specifyType,
			    	scheduleFlag:self.scheduleFlag,
			    	transPeriod:self.transPeriod,
			    	transweekDay:self.transweekDay,
			    	transMonthDay:self.transMonthDay,
			    	transferType:"0",
			    	transTimes:self.transTimes,
			    	specifyDate:format.ignoreChar(self.specifyDate,"-"),
			    	startDate:format.ignoreChar(self.specifyDate,"-"),
			    	specifyCycleTime:self.specifyCycleTime,
			    	specifyDateTime:self.specifyDateTime,
			    	notePhone:self.notePhone,
			    	accountPassword:$("#tranPassword").val(),
			    	payRem:self.payRem,
			    	orderFlowNo:orderFlowNo,
			    	currencyType:"CNY",
			    	newPayUse:"注册账户互转",
			    	businessCode:"002019"
			    };
			    
			    if(!mbank.checkMustData(params,'orderFlowNo')){
			    	return false;
			    };
			    var url = mbank.getApiURL()+'innerTransfer_submit.do';
			    commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);
			    function successCallback(data){
			    	data.title="注册账户互转";
			        mbank.openWindowByLoad('../transfer/transferResult.html','transferResult','slide-in-right',data);
			    }
			    function errorCallback(data){
			    	//刷新最近转账人记录
		            mui.fire(plus.webview.getWebviewById("transfer_sub"),"queryLatestRecAccount",{});
		            mui.fire(plus.webview.getWebviewById("main_sub"),"queryLatestRecAccount",{});			    	
			    	dealFail(data);
			    }           	
            }
		});
		
        function dealFail(data){
            mui.alert(data.em,"","",function(){
            	self.close();
            });
        } 		
		
		mbank.resizePage(".btn_bg_f2");
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
	});

});