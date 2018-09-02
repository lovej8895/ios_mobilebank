define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var currentItem = "backNow";
    
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
			url: 'changeRecordList.html',
			id: 'changeRecordList',
			styles: {
			    top: top,
			    bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var loanAccount = self.loanAccount;
	    
	    $("#menuDiv a").on("tap",function(){
			var id = $(this).attr("id");
			if (currentItem == id) {
				return;
			}
			currentItem = id;
			var child = plus.webview.getWebviewById("changeRecordList");
			mui.fire(child, 'itemId', {currentItem: currentItem});
		});
		
		//切换选项卡
		window.addEventListener("changeWebview",function(event){
        	var currentItem = event.detail.currentItem;
        	if (currentItem) {
	        	$("#menuDiv a").removeClass("mui-active");
				$("#" + currentItem).addClass("mui-active");
        	}
        });
		
	});
});