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
				url:'../fund/allPickFund.html',
				id:'allPickFund',
				styles: {
				    top: top,
				    bottom: '0px'
				}    
			},{
				url:'../fund/transIntoFund.html',
				id:'transIntoFund',
				styles: {
				    top: top,
				    bottom: '0px'
				}    
			},{
				url:'../fund/transOutFund.html',
				id:'transOutFund',
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
			if( "allPickFund"!=pageId ){
				plus.webview.getWebviewById("allPickFund").hide();
			}
			if( "transIntoFund"!=pageId ){
				plus.webview.getWebviewById("transIntoFund").hide();
			}
			if( "transOutFund"!=pageId ){
				plus.webview.getWebviewById("transOutFund").hide();
			}
		}else{
			plus.webview.getWebviewById("allPickFund").show();
			plus.webview.getWebviewById("transIntoFund").hide();
			plus.webview.getWebviewById("transOutFund").hide();
		}

		$("#menuDiv a").on("tap",function(){
			var id=$(this).attr("id");
			if(self.id==id){
				return false;
			}		
			plus.webview.getWebviewById(id).show();
			if( "allPickFund"!=id ){
				plus.webview.getWebviewById("allPickFund").hide();
			}
			if( "transIntoFund"!=id ){
				plus.webview.getWebviewById("transIntoFund").hide();
			}
			if( "transOutFund"!=id ){
				plus.webview.getWebviewById("transOutFund").hide();
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