define(function(require, exports, module) {
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: true,
			menubutton: true
		}
		,subpages:[{
				url:'bookAndRiskNote_sub.html',
				id:'bookAndRiskNote_sub',
				styles: {
				top: '65px',
				bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var returnurl = self.returnurl;
	});
});