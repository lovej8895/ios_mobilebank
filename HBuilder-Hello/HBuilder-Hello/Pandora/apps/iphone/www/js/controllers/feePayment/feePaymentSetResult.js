define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var self = "";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		var status = self.status;
		var flag = self.flag;
		var amount = format.formatMoney(self.amountLimit);
		var msg = "";
		if(status == "1"){
			if(flag == "1"){
				msg = "您的网上缴费每日缴费限额已修改为"+amount+"元";
			}else{
				msg = "您的网上缴费功能已开通，每日缴费限额为"+amount+"元";
			}
		}else{
			msg = "您的网上缴费功能已关闭";
		}
		document.getElementById("msgSpan").innerText = msg;
		
		mui.back=function(){
			plus.webview.close(plus.webview.getWebviewById("feePaymentSet"));
			plus.webview.close(plus.webview.getWebviewById("waterFeePayQuery"));
			plus.webview.close(plus.webview.getWebviewById("chinaGasFeePayQuery"));
			plus.webview.close(plus.webview.getWebviewById("electricityFeePayQuery"));
			plus.webview.close(plus.webview.getWebviewById("etcFeePayQuery"));
			plus.webview.close(plus.webview.getWebviewById("phoneFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("telecomFeePayQuery"));
			plus.webview.close(self);
		}
		document.getElementById("goBack").addEventListener("tap",function(){
			mui.back();
		},false);
	});
});