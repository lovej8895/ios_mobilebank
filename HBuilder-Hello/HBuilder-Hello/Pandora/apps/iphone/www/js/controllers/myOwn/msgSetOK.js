define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var data = self.params;
		var openner = plus.webview.currentWebview().opener();
		$('#title').html(data.title);
		$("#value").html(data.value);
		if(data.value!=null&&data.value!=''){
			$("#value1").html(data.value1);
		}
		
		$('#confirm').on('tap',function(){
			if(openner.id=="clientHome"||openner.id=="myAccount"||openner.id=="clientHome_sub"){
				mui.fire(plus.webview.getWebviewById("clientHome_sub"),"reload",{});
			}
			
			if(openner.id=="limitSet"){
				plus.webview.close("limitSet");
				plus.webview.close("myRight");
			}
			if(openner.id=="preMessageSet"){
				plus.webview.close("preMessageSet");
				plus.webview.close("clientSet");
				plus.webview.close("addAccount");
			}
			plus.webview.close(self);
		});
		
		mui.back=function(){
			
			plus.webview.close("clientHome");
			plus.webview.close("limitSet");
//			plus.webview.close("myRight");
			
			plus.webview.close("preMessageSet");
			plus.webview.close("clientSet");
			plus.webview.close("addAccount");
			plus.webview.close(self.id);
		}
	});
});