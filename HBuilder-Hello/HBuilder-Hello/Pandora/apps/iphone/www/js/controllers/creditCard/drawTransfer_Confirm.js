define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	var passwordUtil = require('../../core/passwordUtil');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var contextData = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('007078',contextData);
		
		$("#payAccount").text(contextData.payAccount);
		$("#payAmount").text(format.formatMoney(contextData.payAmount));
		$("#recAccount").text(contextData.recAccount);
		
		//确定
		$("#confirmButton").on("tap",function(){			
			var randomSum = passwordUtil.getRandomNumber();
			
			var params={
		    	payAccount:contextData.payAccount,
				payAmount:contextData.payAmount,
				recAccount:contextData.recAccount,
				randomSum:randomSum,
		    	cardpublicflag:"15"
		    };
		    var url = mbank.getApiURL()+'showSubmitOver.do';
		    commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../creditCard/creditCardPublic_Result.html','creditCardPublic_Result','slide-in-right',params);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
				mui.alert(errorMsg);
				//var errorCode = "15";
				//mbank.openWindowByLoad('../creditCard/creditAction_fail.html','creditAction_fail','slide-in-right',{errorCode:errorCode,errorMsg:errorMsg});
		    }
		});
		mbank.resizePage(".btn_bg_f2");
	});
});