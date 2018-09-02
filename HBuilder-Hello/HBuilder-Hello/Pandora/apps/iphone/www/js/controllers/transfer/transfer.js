define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	// 引入依赖
    var top='64px';
    if( mui.os.android ){
    	top='44px';
    }

	m.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
				url:'transfer_sub.html',
				id:'transfer_sub',
				styles: {
				top: top,
				bottom: '0px'
			}
		}]
	});
    
	m.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
	});
});