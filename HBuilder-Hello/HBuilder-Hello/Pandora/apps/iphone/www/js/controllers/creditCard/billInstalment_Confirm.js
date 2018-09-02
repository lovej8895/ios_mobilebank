define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		var contextData = plus.webview.currentWebview();
		$("#cardNo").text(contextData.cardNo);
		$("#instalmentAmtShow").text(contextData.instalmentAmt);
		$("#instalmentTimes").text(contextData.instalmentTimes);
		$("#instalmentFeeRate").text(contextData.instalmentFeeRate);		
		$("#chargeFeeShow").text(contextData.chargeFee);
		$("#repayPrincipalShow").text(contextData.repayPrincipal);
		$("#totalAmtShow").text(contextData.totalAmt);
		
		//确定账单分期
		$("#confirmButton").on("tap",function(){
			
		    var params={
		    	cardNo:contextData.cardNo,
				instalmentAmt:contextData.instalmentAmt,
				instalmentTimes:contextData.instalmentTimes,
				CurrencyCode:contextData.CurrencyCode,
				queryTime:contextData.queryTime,
				billDate:contextData.billDate,
				billAmt:contextData.billAmt,
				unReturnAmount:contextData.unReturnAmount,
		    	cardpublicflag:"10"
		    };
		    var url = mbank.getApiURL()+'billInstalmentSubmit.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../creditCard/creditCardPublic_Result.html','creditCardPublic_Result','slide-in-right',params);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	mui.alert(errorMsg);
				//var errorCode = "12";
				//mbank.openWindowByLoad('../creditCard/creditAction_fail.html','creditAction_fail','slide-in-right',{errorCode:errorCode,errorMsg:errorMsg});
		    }
		});
	});
});