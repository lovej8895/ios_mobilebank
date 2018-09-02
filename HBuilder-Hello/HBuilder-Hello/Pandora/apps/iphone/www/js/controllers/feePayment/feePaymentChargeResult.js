define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var param = require('../../core/param');
    
    var self = "";
    var chargeType = "";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		chargeType = self.chargeType;
		document.getElementById("titleSpan").innerText = jQuery.param.getDisplay("CHARGE_TYPE",chargeType);
		
		var orderState = self.orderState;
		var resultMsg = self.resultMsg;
		var msg = "交易成功";
		var className = "success_icon1 suc_top20";
		var msgClassName = "fz_18 text_m";
		if('99'==orderState){
			msg="交易失败";
			className = "fail_icon1 suc_top20";
			msgClassName = "fz_15 text_m";
			if(resultMsg != null && resultMsg != undefined && resultMsg != "" && resultMsg.length != 0){
				msg="交易失败，失败原因："+resultMsg;
			}
		}else if('50'==orderState){
			msg="状态可疑";
			className = "fail_icon1 suc_top20";
			msgClassName = "fz_15 text_m";
		}
		document.getElementById("resultImg").className = className;
		document.getElementById("resultMsg").className = msgClassName;
		document.getElementById("resultMsg").innerText = msg;
		
		mui.back=function(){
			plus.webview.close(plus.webview.getWebviewById("chinaGasFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("chinaGasFeePayConfirm"));
			plus.webview.close(plus.webview.getWebviewById("electricityFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("electricityFeePayConfirm"));
			plus.webview.close(plus.webview.getWebviewById("etcFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("etcFeePayConfirm"));
			plus.webview.close(plus.webview.getWebviewById("telecomFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("telecomFeePayConfirm"));
			plus.webview.close(plus.webview.getWebviewById("waterFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("waterFeePayConfirm"));
			plus.webview.close(plus.webview.getWebviewById("unionPayInput"));
			plus.webview.close(plus.webview.getWebviewById("unionPayConfirm"));
			plus.webview.close(plus.webview.getWebviewById("phoneFeePayConfirm"));
			plus.webview.close(self);
		}
		document.getElementById("goBack").addEventListener("tap",function(){
			mui.back();
		},false);
		document.getElementById("goHistory").addEventListener("tap",function(){
			plus.webview.close(plus.webview.getWebviewById("chinaGasFeePayQuery"));
			plus.webview.close(plus.webview.getWebviewById("chinaGasFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("chinaGasFeePayConfirm"));
			
			plus.webview.close(plus.webview.getWebviewById("electricityFeePayQuery"));
			plus.webview.close(plus.webview.getWebviewById("electricityFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("electricityFeePayConfirm"));
			
			plus.webview.close(plus.webview.getWebviewById("etcFeePayQuery"));
			plus.webview.close(plus.webview.getWebviewById("etcFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("etcFeePayConfirm"));
			
			plus.webview.close(plus.webview.getWebviewById("telecomFeePayQuery"));
			plus.webview.close(plus.webview.getWebviewById("telecomFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("telecomFeePayConfirm"));
			
			plus.webview.close(plus.webview.getWebviewById("waterFeePayQuery"));
			plus.webview.close(plus.webview.getWebviewById("waterFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("waterFeePayConfirm"));
			
			plus.webview.close(plus.webview.getWebviewById("unionPayInput"));
			plus.webview.close(plus.webview.getWebviewById("unionPayConfirm"));
			
			plus.webview.close(plus.webview.getWebviewById("phoneFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("phoneFeePayConfirm"));
			mbank.openWindowByLoad('../feePayment/feePaymentHistoryQuery.html','feePaymentHistoryQuery','slide-in-right',"");
		},false);
		
	});
});