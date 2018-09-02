define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var param = require('../../core/param');
    
    var self = "";
    var chargeType = "";
    var params;
    var AreaNo = "";
    var UnitNo = "";
    var BatNo = "";
    var payNo = "";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		chargeType = self.chargeType;
		document.getElementById("titleSpan").innerText = jQuery.param.getDisplay("CHARGE_TYPE",chargeType);
		
		AreaNo = self.AreaNo;
		UnitNo = self.UnitNo;
		BatNo = self.BatNo;
		payNo = self.payNo;
		
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
			
			plus.webview.close(plus.webview.getWebviewById("tuitionFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("tuitionFeePayInputNext"));
			plus.webview.close(plus.webview.getWebviewById("tuitionFeePayConfirm"));
			plus.webview.close(self);
		}
		document.getElementById("goBack").addEventListener("tap",function(){
			mui.back();
		},false);
		document.getElementById("goHistory").addEventListener("tap",function(){
			params = {
				"AreaNo" : AreaNo,
				"UnitNo" : UnitNo,
				"BatNo" : BatNo,
				"payNo" : payNo	
			};
			plus.webview.close(plus.webview.getWebviewById("tuitionFeePayQuery"));
			plus.webview.close(plus.webview.getWebviewById("tuitionFeePayInput"));
			plus.webview.close(plus.webview.getWebviewById("tuitionFeePayInputNext"));
			plus.webview.close(plus.webview.getWebviewById("tuitionFeePayConfirm"));
			
			mbank.openWindowByLoad('../feePayment/tuitionPayHistoryList.html','tuitionPayHistoryList','slide-in-right',params);
		},false);
		
	});
});