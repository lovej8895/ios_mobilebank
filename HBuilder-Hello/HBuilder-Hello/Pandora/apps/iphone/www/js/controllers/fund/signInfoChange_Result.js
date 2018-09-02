define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

	mui.init();//预加载
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();
		
		//下一步
		$("#backBtn").click(function(){
			mui.back();
		});
		mui.back=function(){
			plus.webview.close(plus.webview.getWebviewById("signInfoChange_List"));
			plus.webview.close(plus.webview.getWebviewById("signInfoChange_Input"));
			plus.webview.close(plus.webview.getWebviewById("signInfoChange_Confirm"));			
			plus.webview.close(self);
		}
		//下一步按钮控制不往上顶
		mbank.resizePage(".btn_bg_f2");
	});
});