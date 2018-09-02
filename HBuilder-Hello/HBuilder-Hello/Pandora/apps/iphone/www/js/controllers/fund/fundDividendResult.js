define(function(require, exports, module) {
    var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		//分红方式变更需要上基金公司不是立刻生效
//		mui.fire(plus.webview.getWebviewById("myHoldFundDetail"), 'refreshMyHoldFundDetail', {});
//		mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshTotalFund', {});
		$("#fundShareChange").on("tap",function(){
			plus.webview.close("fundShareChange");
			plus.webview.close(self);			
		});
		
		mui.back = function(){
	    	plus.webview.close("fundShareChange");
			plus.webview.close(self);			
		}		
	});

});