define(function(require, exports, module) {
    var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var openner = plus.webview.currentWebview().opener();
		var title=self.title;
		if( title ){
			$(".mui-title").html(title);
		}
		var em=self.em;
		if( em ){
			$("#em").html(em);
		}

		$("#confirmButton").on("tap",function(){
			var retPageId=self.retPageId;
			if( retPageId ){
				plus.webview.getWebviewById(retPageId).show();
			}else{
				openner.show();   
			}
		});
		
	});

});