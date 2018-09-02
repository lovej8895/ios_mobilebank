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
		//currentCode: 当前交易码,参考并完善$.param.TRANS_NAME+AUTH_FORMAT  requestParam: 上个页面的请求数据
		commonSecurityUtil.initSecurityData('002008',self);
		
		$("#payAccount").html(format.dealAccountHideFour(self.payAccount));
		$("#recAccount").html(self.recAccount);
		$("#recAccountName").html(self.recAccountName);
		$("#payAmount").html(format.formatMoney(self.payAmount,2));
		
		var url = mbank.getApiURL()+'GetOrderFlowNo.do';
	    mbank.apiSend("post",url,{},function(data){
	    	orderFlowNo=data.orderFlowNo;
	    },function(e){
	    	mui.alert("获取防重复提交流水号失败！");
	    },true);
		
		$("#confirmButton").on("tap",function(){

            exceedLimitRemind();
			
			function exceedLimitRemind(){
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
			}
            //转账交易
            function transfer(){
             	var recAccount=self.recAccount;
            	var cardBin = recAccount.substring(0,6);
        		if(cardBin == "625850" || cardBin == "628340"){
                    creditTransfer();
        		}else{
        			debitTransfer();
        		}
            }

            //借记卡转借记卡交易
            function debitTransfer(){
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
			    	addPayBook:"1",//1-保存收款人
			    	payBookChannel:"1",
			    	notePhone:self.notePhone,
			    	payRem:self.payRem,
			    	orderFlowNo:orderFlowNo,
			    	doubtAccFlowNo:self.doubtAccFlowNo,
			    	currencyType:"CNY",
			    	newPayUse:"行内转账"
			    };
			    
			    if(!mbank.checkMustData(params,'orderFlowNo')){
			    	return false;
			    };
			    var url = mbank.getApiURL()+'innerTransfer_submit.do';
			    
			    commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);
			    function successCallback(data){
			    	data.title="行内转账";
			        mbank.openWindowByLoad('../transfer/transferResult.html','transferResult','slide-in-right',data);
			    }
			    function errorCallback(data){
			    	//刷新最近转账人记录
		            mui.fire(plus.webview.getWebviewById("transfer_sub"),"queryLatestRecAccount",{});
		            mui.fire(plus.webview.getWebviewById("main_sub"),"queryLatestRecAccount",{});
			    	dealFail(data);
			    }           	
            }
            
            //借记卡转信用卡
            function creditTransfer(){
	 		    var params={
			    	payAccount:self.payAccount,
			    	recAccount:self.recAccount,
			    	recAccountName:self.recAccountName,
			    	payAmount:self.payAmount,
			    	orderFlowNo:orderFlowNo,
			    	payAmountType:"02",
			    	payRem:self.payRem
			    };
			    
			    if(!mbank.checkMustData(params,'orderFlowNo')){
			    	return false;
			    };
			    var url = mbank.getApiURL()+'debitCard_Submit.do';
			    commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);
			    function successCallback(data){
			    	data.title="行内转账";
			        mbank.openWindowByLoad('../transfer/transferResult.html','transferResult','slide-in-right',data);
			    }
			    function errorCallback(data){
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