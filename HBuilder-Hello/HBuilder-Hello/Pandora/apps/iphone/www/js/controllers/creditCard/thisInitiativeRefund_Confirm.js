define(function(require, exports, module) {
	
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	
	var searchkeyTemp;//搜索关键字
	var publickeyTemp;//密码公钥
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式		
		var contextData = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('007051',contextData);
		
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
//			var password=$("#tranPassword").val();
//			if( password=="" ){
//				mui.alert("请输入卡取款密码！");
//				return false;
//			}
//		    var identifyCode=$("#identifyCode").val();
//		    if( identifyCode=="" ){
//		    	mui.alert("请输入短信验证码！");
//		    	return false;
//		    }
		    var params={
		    	recAccount:contextData.recAccount,
		    	payAccount:contextData.payAccount,
		    	payAmountType:contextData.payamttypestr,
		    	payAmount:contextData.payAmount,
		    	cardpublicflag:"2"
		    };
		    var url = mbank.getApiURL()+'showSubmit.do';
		    commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../creditCard/creditCardPublic_Result.html','creditCardPublic_Result','slide-in-right',params);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	mui.alert(errorMsg);
				//var errorCode = "8";
			    //mbank.openWindowByLoad('../creditCard/creditAction_fail.html','creditAction_fail','slide-in-right',{errorCode:errorCode,errorMsg:errorMsg});
		    }
		});
		mbank.resizePage(".btn_bg_f2");
	});
});