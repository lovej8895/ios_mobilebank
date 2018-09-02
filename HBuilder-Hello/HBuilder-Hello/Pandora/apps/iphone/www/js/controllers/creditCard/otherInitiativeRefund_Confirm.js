define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var contextData = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('007053',contextData);
		
		
		$("#recAccount").text(contextData.recAccount);
		$("#payAccount").text(contextData.payAccount);
		$("#payAmount").text(format.formatMoney(contextData.payAmount));
		
		var payamttypestrshow ="";
		var payamttypestr = contextData.payAmountType;
		if (payamttypestr == "00") {
			payamttypestrshow = "本期全额还款";
		}else if(payamttypestr == "01"){
			payamttypestrshow = "本期最低还款额还款";
		}else if(payamttypestr == "02"){
			payamttypestrshow = "自定义";
		}
		$("#payAmountType").text(payamttypestrshow);
		
		//确定
		$("#confirmButton").on("tap",function(){
			
		    var params={
		    	recAccount:contextData.recAccount,
		    	payAccount:contextData.payAccount,
		    	payAmountType:contextData.payAmountType,
		    	payAmount:contextData.payAmount,
		    	cardpublicflag:"6"
		    };
		    var url = mbank.getApiURL()+'showSubmitOther.do';
		    commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../creditCard/creditCardPublic_Result.html','creditCardPublic_Result','slide-in-right',params);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	mui.alert(errorMsg);
				//var errorCode = "10";
				//mbank.openWindowByLoad('../creditCard/creditAction_fail.html','creditAction_fail','slide-in-right',{errorCode:errorCode,errorMsg:errorMsg});
		    }
		});
		mbank.resizePage(".btn_bg_f2");
	});
});