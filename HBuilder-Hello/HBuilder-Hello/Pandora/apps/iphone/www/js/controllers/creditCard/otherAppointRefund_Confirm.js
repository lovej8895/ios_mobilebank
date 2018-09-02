define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	
	var transferType ="";
	//还款类型
	var payAmountType ="";
	var payAmountTypeCN ="";
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		var contextData = plus.webview.currentWebview();
		$("#recAccount").text(contextData.recAccount);
		$("#payAccount").text(contextData.payAccount);
		$("#bankSelectText").text(contextData.bankSelectText);
		//约定还款类型
		transferType = contextData.transferType;
		if(transferType == '1'){
			transferTypeCN = "本行约定还款";
		}else if(transferType == '2'){
			transferTypeCN = "跨行约定还款";
		}
		$("#transferType").text(transferTypeCN);
		//还款金额类型
		payAmountType = contextData.payAmountType;		
		if(payAmountType == 'F'){
			payAmountTypeCN ="本期全额还款";
		}else if(payAmountType == 'M'){
			payAmountTypeCN ="本期最低还款额还款";
		}
		$("#payAmountType").text(payAmountTypeCN);
		
		//确定
		$("#confirmButton").on("tap",function(){
			
		    var params={
		    	recAccount:contextData.recAccount,
		    	signPayType:transferType,
		    	payAccount:contextData.payAccount,
		    	bankSelect:contextData.bankSelect,
		    	payAmountType:payAmountType,
		    	cardpublicflag:contextData.cardpublicflag
		    };
		    var url = mbank.getApiURL()+'showSubmitArrangeOther.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../creditCard/creditCardPublic_Result.html','creditCardPublic_Result','slide-in-right',params);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	mui.alert(errorMsg);
				//var errorCode = "11";
				//mbank.openWindowByLoad('../creditCard/creditAction_fail.html','creditAction_fail','slide-in-right',{errorCode:errorCode,errorMsg:errorMsg});
		    }
		});
	});
});