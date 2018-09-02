define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
    
    mui.init();
	
	mui.plusReady(function() {
		console.log('guide_main.....')
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		$("body").on('touchmove', function(e){
			e.preventDefault();
		});
		
		$("#guideBtn").on('tap', function(){
			plus.webview.close(self.id);
		});
	});
});