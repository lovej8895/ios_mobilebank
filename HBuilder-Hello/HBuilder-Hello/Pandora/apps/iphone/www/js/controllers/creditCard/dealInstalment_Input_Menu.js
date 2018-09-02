define(function(require, exports, module) {

	var top='64px';
    if( mui.os.android ){
    	top='44px';
    }
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
				url:'../creditCard/dealInstalment_Input.html',
				id:'dealInstalment_Input',
				styles: {
				    top: top,
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