define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		var contextData = plus.webview.currentWebview();
		$("#accountNoShow").text(contextData.accountNo);
		$("#unReturnTimesShow").text(contextData.unReturnTimes);
		$("#amountRealChargedShow").text(format.formatMoney(contextData.amountRealCharged));
		$("#adv_fee_amtShow").text(format.formatMoney(contextData.adv_fee_amt));
		
		//确定
		$("#confirmButton").on("tap",function(){
			var params={
		    	accountNo:contextData.accountNo,
				instTrxnSeq:contextData.instTrxnSeq,
				amountRealCharged:contextData.amountRealCharged,
				instalmentDate:contextData.instalmentDate,
				instalmentTimes:contextData.instalmentTimes,
				instalmentAmt:contextData.instalmentAmt,
				chargeFee:contextData.chargeFee,
				interest:contextData.interest,
				restChargeFee:"",
				restInterest:"",
				unReturnTimes:contextData.unReturnTimes,
				adv_fee_amt:contextData.adv_fee_amt,
		    	cardpublicflag:"12"
		    };
		    
		    var url = mbank.getApiURL()+'instalmentRepaySubmit.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../creditCard/creditCardPublic_Result.html','creditCardPublic_Result','slide-in-right',params);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	mui.alert(errorMsg);
				//var errorCode = "14";
				//mbank.openWindowByLoad('../creditCard/creditAction_fail.html','creditAction_fail','slide-in-right',{errorCode:errorCode,errorMsg:errorMsg});
		    }
		});
	});
});