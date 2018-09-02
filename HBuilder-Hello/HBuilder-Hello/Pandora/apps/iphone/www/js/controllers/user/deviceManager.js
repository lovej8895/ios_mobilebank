define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	var activeId = 'deviceBound';
	// 引入依赖
	var app = require('../core/app');
	var userInfo = require('../core/userInfo');
	var mbank = require('../core/bank');
	var nativeUI = require('../core/nativeUI');
	// 引入依赖
    var top='110px';
    if( mui.os.android ){
    	top='90px';
    }
	
	$.init({
	    subpages:[{
	      	url:"../user/deviceBound.html",
            id:"deviceBound",
            styles:{
                top: top,
				bottom: '0px'
			}
	    },{
	      	url:"../user/otherDevice.html",
            id:"otherDevice",
            styles:{
                top: top,
				bottom: '0px'
			}
	    }]
	  });
	$.plusReady(function() {
		var customerType = localStorage.getItem("customerType");
		var deviceManager = plus.webview.getWebviewById("deviceManager");
		var frontView = plus.webview.getWebviewById('infoConfirm');
		var beginView = plus.webview.getWebviewById('infoVerification');
		var loginView = plus.webview.getWebviewById("login");
		var fingerView = plus.webview.getWebviewById("loginByFinger");
		var unlockView = plus.webview.getWebviewById("unlock");
		
		if(frontView || beginView || loginView || fingerView || unlockView){
			plus.webview.close(beginView);
			plus.webview.close(frontView);
			plus.webview.close(loginView);
			plus.webview.close(fingerView);
			plus.webview.close(unlockView);
		}
		
		var self = plus.webview.currentWebview();
		var cardNo = self.cardNo;
        var initView =  plus.webview.getWebviewById(activeId);
		plus.webview.show(initView);
		
		var showView;
		var currView;
  		var items = jQuery("#headMenu>a");
     	for (var i = 0; i < items.length; i++) {
     		if(i==0){
				items[i].addEventListener('tap', function() {
					jQuery("#deviceBound").addClass("mui-active");
					jQuery("#otherDevice").removeClass("mui-active");
					showView = plus.webview.getWebviewById("deviceBound");
					currView = plus.webview.getWebviewById("otherDevice");
					plus.webview.show(showView);
				});
     		}else if(i==1){
     			items[i].addEventListener('tap', function() {
     				jQuery("#otherDevice").addClass("mui-active");
					jQuery("#deviceBound").removeClass("mui-active");
					showView = plus.webview.getWebviewById("otherDevice");
					currView = plus.webview.getWebviewById("deviceBound");
					plus.webview.show(showView);
				});
     		}
     		//plus.webview.hide(currView);
     		//plus.webview.show(showView);
		}
     	
     	doc.getElementById("deviceBoundBack").addEventListener('tap',function(){
			plus.webview.close(showView);
			plus.webview.close(initView);
     		if(frontView || beginView || loginView || fingerView || unlockView){	
				plus.webview.close(frontView);
				plus.webview.close(beginView);
				plus.webview.close(loginView);
				plus.webview.close(fingerView);
				plus.webview.close(unlockView);
			}
			plus.webview.close(currView);
			plus.webview.close(deviceManager);
     	});
     	
		plus.key.addEventListener('backbutton',function(){
			mui.back();
		},false);
		
		mui.back = function(){
			plus.webview.close(showView);
			plus.webview.close(initView);
			if(frontView || beginView || loginView || fingerView || unlockView){
				
				plus.webview.close(frontView);
				plus.webview.close(beginView);
				plus.webview.close(loginView);
				plus.webview.close(fingerView);
				plus.webview.close(unlockView);
			}
			plus.webview.close(deviceManager);
			plus.webview.close(currView);
		}
		
		window.addEventListener("changeMenu",function(event){
        	var pageId=event.detail.pageId;
        	if( pageId ){
	        	jQuery("#headMenu a").removeClass("mui-active");
				jQuery("#"+pageId).addClass("mui-active");
        	}
        }); 
	});

});