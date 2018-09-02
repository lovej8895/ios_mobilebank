define(function(require, exports, module) {
    var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var openner = plus.webview.currentWebview().opener();
		
		var title=self.params.title;
		var value = self.params.value;
		$('#title').html(title);
		$('#value').html(value);
		
		$("#confirm").on("tap",function(){
			plus.webview.close("addReceiver");
			mui.fire(plus.webview.getWebviewById("receiverPro"),"reload",{});
			plus.webview.close("addReceiverResult");
		});
		
		//重写返回方法
		mui.back=function(){
			plus.webview.close("addReceiver");
			plus.webview.close("receiverPro");
			plus.webview.close(self.id);
		}
	});

});