define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
    
    mui.init();
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		$("#guideBtn").on('tap', function(){
			plus.webview.close(self.id);
		});
	});
});