define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var param = require('../../core/param');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		mbank.initAccountInfo();//刷新缓存
		var self = plus.webview.currentWebview();
		var data = self.params;
		$('#title').html(data.title);
		$("#value").html(data.value);
		$("#accountNo").html(data.accountNo);
		$("#accountName").html(userInfo.get("session_customerNameCN"));
		$("#certType").html($.param.getDisplay('CERT_TYPE',data.certType));
		$("#certNo").html(data.certNo);
//		plus.webview.close("clientHome");
		$("#confirm").on("tap",function(){
			plus.webview.close("addAccount");
			
			var destView = plus.webview.getWebviewById("clientHome_sub");
			if(destView){
				plus.webview.hide(destView.id,'none');
        		plus.webview.show(destView.id,'slide-in-right');
        		mui.fire(plus.webview.getWebviewById("clientHome_sub"),"reload",{});
        		mui.closeOpened(destView);
			}
			
			setTimeout(function(){
				plus.webview.hide(self.id,'none');
				mui.closeAll(self);
			},400);
			
//			mbank.openWindowByLoad("../myOwn/clientHome.html","clientHome",'slide-in-righ');
//			mui.fire(plus.webview.getWebviewById("clientHome_sub"),"reload",{});
//			plus.webview.close(self.id);
		});
		mui.back=function(){
			plus.webview.close("addAccount");
			plus.webview.close("clientHome");
			plus.webview.close(self.id);
		}
	});
});