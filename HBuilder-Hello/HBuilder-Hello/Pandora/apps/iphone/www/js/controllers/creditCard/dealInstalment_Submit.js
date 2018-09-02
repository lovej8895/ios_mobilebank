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
		$("#cardNoShow").text(contextData.cardNo);
		$("#tranAmtShow").text(format.formatMoney(contextData.tranAmt));
		$("#FeeNumShow").text(contextData.FeeNum);
		$("#instalmentTimesShow").text(contextData.instalmentTimes);
		$("#instalmentFeeRateShow").text(contextData.instalmentFeeRate);
		$("#totalRepayPrincipalShow").text(format.formatMoney(contextData.totalRepayPrincipal));
		$("#totalChargeFeeShow").text(format.formatMoney(contextData.totalChargeFee));
		$("#totalFeeShow").text(format.formatMoney(contextData.totalFee));
		
		//确定
		$("#confirmButton").on("tap",function(){
			
			//选择的分期记录
			var array_flowno = [],array_creditCardNo = [],array_TrxnDate = [],array_TrxnDesc = [],array_BillCurrency = [],array_TrxnAmt = [];
			for (var i = 0; i < contextData.flowno.length; i++) {
				array_flowno.push(contextData.flowno[i]);
				array_creditCardNo.push(contextData.creditCardNo[i]);
				array_TrxnDate.push(contextData.TrxnDate[i]);
				array_TrxnDesc.push(contextData.TrxnDesc[i]);
				array_BillCurrency.push(contextData.BillCurrency[i]);
				array_TrxnAmt.push(contextData.TrxnAmt[i]);
			}
			//请求参数
			var params={
		    	'cardNo':contextData.cardNo,
		    	'tranAmt':contextData.tranAmt,
		    	'FeeNum':contextData.FeeNum,
		    	'instalmentTimes':contextData.instalmentTimes,
		    	'instalmentFeeRate':contextData.instalmentFeeRate,
		    	'totalRepayPrincipal':contextData.totalRepayPrincipal,
		    	'totalChargeFee':contextData.totalChargeFee,
		    	'dealInstalmentList.flowno':array_flowno,
		    	'dealInstalmentList.creditCardNo':array_creditCardNo,
		    	'dealInstalmentList.TrxnDate':array_TrxnDate,
		    	'dealInstalmentList.TrxnDesc':array_TrxnDesc,
		    	'dealInstalmentList.BillCurrency':array_BillCurrency,
		    	'dealInstalmentList.TrxnAmt':array_TrxnAmt,
		    	'flownoList':'|',
		    	cardpublicflag:"11"
		   };
		   
		    //发送后台处理
		    var url = mbank.getApiURL()+'dealInstalmentSubmit.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../creditCard/creditCardPublic_Result.html','creditCardPublic_Result','slide-in-right',params);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	mui.alert(errorMsg);
				//var errorCode = "13";
				//mbank.openWindowByLoad('../creditCard/creditAction_fail.html','creditAction_fail','slide-in-right',{errorCode:errorCode,errorMsg:errorMsg});
		    }
		});
		
		
	});
});