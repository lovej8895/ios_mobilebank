define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
    var commonSecurityUtil = require('../../core/commonSecurityUtil');
    var passwordUtil = require('../../core/passwordUtil');
    //手续费
    var trsFeeAmount;
    var orderFlowNo="";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
	    commonSecurityUtil.initSecurityData('002009',self);
	    
		$("#payAccount").html(format.dealAccountHideFour(self.payAccount));
		$("#recAccount").html(self.recAccount);
		$("#recAccountOpenBankName").html(self.recAccountOpenBankName);
		$("#recAccountName").html(self.recAccountName);
		$("#payAmount").html(format.formatMoney(self.payAmount,2));
		$("#transferType").html($.param.getDisplay("TRANSFER_TYPE",self.transferType));
	
	    var url = mbank.getApiURL()+'GetOrderFlowNo.do';
	    mbank.apiSend("post",url,{},function(data){
	    	orderFlowNo=data.orderFlowNo;
	    },function(e){
	    	mui.alert("获取防重复提交流水号失败！");
	    },true);

	
		//手续费试算
	    url = mbank.getApiURL()+'feeCount.do';
	    var feeParam={
	    	accountNo:self.payAccount,
	    	payAmount:self.payAmount,
	    	transferType:self.transferType,
	    	recBankNo:self.recAccountOpenBank
	    	
	    };
	    mbank.apiSend("post",url,feeParam,successCallback,errorCallback,true);
    	function successCallback(data){
    		trsFeeAmount=data.trsFeeAmount;
	        $("#trsFeeAmount").html(format.formatMoney(trsFeeAmount,2)+"元");
	    }
    	function errorCallback(data){
	    	 $("#trsFeeAmount").html("查询失败");
	    }
		
		$("#getIdentifyCode").on("tap",function(){
			var recAccount=self.recAccount;
			var smsContent="跨行转账汇款交易：收款人"+self.recAccountName+"(尾号"
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
             	transferChannel:"2",
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
		    
		    function transfer(){
			    var params={
			    	recAccountOpenBank:self.recAccountOpenBank,
			    	recAccountOpenBankName:self.recAccountOpenBankName,
			    	payAccount:self.payAccount,
			    	recAccount:self.recAccount,
			    	recAccountName:self.recAccountName,
			    	transferChannel:"2",
			    	payAmount:self.payAmount,
			    	specifyType:"0", //跨行转账只做一次性预约
			    	scheduleFlag:self.scheduleFlag,
			    	transferType:self.transferType,
			    	specifyDate:self.specifyDate,
			    	startDate:self.specifyDate,
			    	specifyDateTime:self.specifyDateTime,
			    	addPayBook:"1",//1-保存收款人
			    	payBookChannel:"2",
			    	notePhone:self.notePhone,
			    	accountPassword:$("#tranPassword").val(),
			    	payRem:self.payRem,
			    	orderFlowNo:orderFlowNo,
			    	doubtAccFlowNo:self.doubtAccFlowNo,
			    	currencyType:"CNY",
			    	newPayUse:"跨行转账"
			    };
			    
			    if(!mbank.checkMustData(params,'orderFlowNo')){
			    	return false;
			    };
			    
			    var url = mbank.getApiURL()+'submitExternalTransfer.do';
			    commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);
			    function successCallback(data){
			    	data.title="跨行转账";
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