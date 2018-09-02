define(function(require, exports, module) {
    var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var openner=plus.webview.currentWebview().opener();
		var title=self.title;
		if( title ){
			$(".mui-title").html(title);
		}

		$("#confirmButton").on("tap",function(){
			mui.back();			
		});
		
		//重写返回方法
		mui.back=function(){
			if( openner.id=="intelSignAgreement" || openner.id=="intelligentNotifyDeposit" ){
				plus.webview.close("intelSignAgreement");
				mui.fire(plus.webview.getWebviewById("intelligentNotifyDeposit"),"reload",{});
			}

			if( openner.id=="cancelReserve" ){
				mui.fire(plus.webview.getWebviewById("notifyDeposit"),"reload",{});
				plus.webview.close("cancelReserve");
			}	
			
			plus.webview.close(self);
		} 		
		
	});

});