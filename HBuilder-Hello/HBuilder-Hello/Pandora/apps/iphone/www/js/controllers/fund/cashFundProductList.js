define(function(require, exports, module) {
	var top='64px';
    if( mui.os.android ){
    	top='46px';
    }
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
				url:'cashFundProductListSub.html',
				id:'cashFundProductListSub',
				styles: {
				    top: top,
				    bottom: '0px'
				}    
			}
		]
	});
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
	});
});