define(function(require, exports, module) {
    var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var openner=plus.webview.currentWebview().opener();

		$("#confirmButton").on("tap",function(){			
            mui.back();		
		});
		
		//重写返回方法
		mui.back=function(){
			if( openner.id=="cancelScheduleConfirm"  ){
				plus.webview.close("cancelScheduleConfirm");
				mui.fire(plus.webview.getWebviewById("scheduleDetailQuery"),"reload",{});
			}			
			plus.webview.close(self);
		} 		
		
	});

});