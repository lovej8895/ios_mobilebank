define(function(require, exports, module) {
    var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		$("#myProductQuery").on("tap",function(){
			plus.webview.close("todaySaleDetail");
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("myProductQuery"), 'reload', {});
		});
		
			var muiBack = mui.back;
		mui.back=function(){
			plus.webview.close("todaySaleDetail");
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("myProductQuery"), 'reload', {});
		}
	});

});