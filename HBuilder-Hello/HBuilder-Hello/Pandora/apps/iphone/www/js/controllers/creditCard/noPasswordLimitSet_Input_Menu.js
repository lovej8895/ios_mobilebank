define(function(require, exports, module) {

	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
				url:'../creditCard/noPasswordLimitSet_Input.html',
				id:'noPasswordLimitSet_Input',
				styles: {
				    top: '66px',
				    bottom: '0px'
				}    
			}
		]
	});
    
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
	});
});