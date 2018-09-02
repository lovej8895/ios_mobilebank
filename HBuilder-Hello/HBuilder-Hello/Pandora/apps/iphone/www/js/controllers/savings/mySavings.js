define(function(require, exports, module) {
    var top='110px';
    if( mui.os.android ){
    	top='90px';
    }
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
				url:'demandFixed.html',
				id:'demandFixed',
				styles: {
				    top: top,
				    bottom: '0px'
				}    
			},{
				url:'notifyDeposit.html',
				id:'notifyDeposit',
				styles: {
				    top: top,
				    bottom: '0px'
				}    
			},{
				url:'intelligentNotifyDeposit.html',
				id:'intelligentNotifyDeposit',
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
		var pageId=self.pageId;
		if( pageId ){
			$("#menuDiv a").removeClass("mui-active");
			$("#"+pageId).addClass("mui-active");
			plus.webview.getWebviewById(pageId).show();
			if( "demandFixed"!=pageId ){
				plus.webview.getWebviewById("demandFixed").hide();
			}
			if( "notifyDeposit"!=pageId ){
				plus.webview.getWebviewById("notifyDeposit").hide();
			}
			if( "intelligentNotifyDeposit"!=pageId ){
				plus.webview.getWebviewById("intelligentNotifyDeposit").hide();
			}
		}else{
			plus.webview.getWebviewById("demandFixed").show();
			plus.webview.getWebviewById("notifyDeposit").hide();
			plus.webview.getWebviewById("intelligentNotifyDeposit").hide();
		}

		$("#menuDiv a").on("tap",function(){
			var id=$(this).attr("id");
			if(self.id==id){
				return false;
			}		
			plus.webview.getWebviewById(id).show();
			if( "demandFixed"!=id ){
				plus.webview.getWebviewById("demandFixed").hide();
			}
			if( "notifyDeposit"!=id ){
				plus.webview.getWebviewById("notifyDeposit").hide();
			}
			if( "intelligentNotifyDeposit"!=id ){
				plus.webview.getWebviewById("intelligentNotifyDeposit").hide();
			}			
		});

        window.addEventListener("changeMenu",function(event){
        	var pageId=event.detail.pageId;
        	if( pageId ){
	        	$("#menuDiv a").removeClass("mui-active");
				$("#"+pageId).addClass("mui-active");
        	}
        });  

	});
});