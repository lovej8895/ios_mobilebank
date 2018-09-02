define(function(require, exports, module) {
    var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var backButton = document.getElementById("fundTradeQuery");		
		var self = plus.webview.currentWebview();
		/*$("#fundTradeQuery").on("tap",function(){
			plus.webview.close("fundAgentProductDetail");
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("fundAgentProductDetail"), 'reload', {});
		});*/
		
		
		mui.back = function(){
			plus.webview.close("fundAgentProductDetail");
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("myFundProductList"),"reload",{});			
			
		}
		
		var path = backButton.getAttribute("path");
		var id = backButton.getAttribute("id");
		var noCheck = backButton.getAttribute("noCheck");
		backButton.addEventListener('tap',function(){
			mui.back();
		});
		
		plus.key.addEventListener('backbutton',function(){
			mui.back();
		},false);					
	});

});