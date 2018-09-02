define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
    
    mui.init();
	
	mui.plusReady(function() {
		
		if(plus.os.name == "Android"){
			
		}else{
			document.getElementById("userGuide").style.top = "20px";
		}
		
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		$("#guideBtn").on('tap', function(){
			plus.webview.close(self.id);
		});
	});
});