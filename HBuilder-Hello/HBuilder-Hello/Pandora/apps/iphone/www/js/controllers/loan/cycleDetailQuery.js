define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var currentItem = "unsettled";
    
    var top='111px';
    if( mui.os.android ){
    	top='91px';
    }
    
    mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
			url: 'cycleDetailList.html',
			id: 'cycleDetailList',
			styles: {
			    top: top,
			    bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
	    $("#menuDiv a").on("tap",function(){
			var id = $(this).attr("id");
			if (currentItem == id) {
				return;
			}
			currentItem = id;
			var child = plus.webview.getWebviewById("cycleDetailList");
			mui.fire(child, 'itemId', {currentItem: currentItem});
		});
		
		//侧滑切换选项卡
		window.addEventListener("changeItem", function(event){
        	var currentItem = event.detail.currentItem;
        	if (currentItem) {
	        	$("#menuDiv a").removeClass("mui-active");
				$("#" + currentItem).addClass("mui-active");
        	}
        });
	});
});