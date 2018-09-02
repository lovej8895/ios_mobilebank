define(function(require, exports, module) {
	var doc = document;
	var activeId = 'otherInitiativeRefund_Input';
	// 引入依赖
	var app = require('../core/app');
	var userInfo = require('../core/userInfo');
	var mbank = require('../core/bank');
	var nativeUI = require('../core/nativeUI');

	mui.init({
		subpages: [
		{
			id: 'otherInitiativeRefund_Input',
			url: '../creditCard/otherInitiativeRefund_Input.html',
			styles: {
				top: '110px',
				bottom: '0px'
			}
		},{
			id:'otherAppointRefund_Input',
			url:'../creditCard/otherAppointRefund_Input.html',
			styles: {
				top: '110px',
				bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
		var pageId=self.pageId;
		if( pageId ){
			$("#headMenu a").removeClass("mui-active");
			$("#"+pageId).addClass("mui-active");
			plus.webview.getWebviewById(pageId).show();
			if( "otherInitiativeRefund_Input"!=pageId ){
				plus.webview.getWebviewById("otherInitiativeRefund_Input").hide();
			}
			if( "otherAppointRefund_Input"!=pageId ){
				plus.webview.getWebviewById("otherAppointRefund_Input").hide();
			}
		}else{
			plus.webview.getWebviewById("otherInitiativeRefund_Input").show();
			plus.webview.getWebviewById("otherAppointRefund_Input").hide();
		}
		
		$("#headMenu a").on("tap",function(){
			var id=$(this).attr("id");
			if(self.id==id){
				return false;
			}		
			plus.webview.getWebviewById(id).show();
			if( "otherInitiativeRefund_Input"!=id ){
				plus.webview.getWebviewById("otherInitiativeRefund_Input").hide();
			}
			if( "otherAppointRefund_Input"!=id ){
				plus.webview.getWebviewById("otherAppointRefund_Input").hide();
			}		
		});
		
		window.addEventListener("changeMenu",function(event){
        	var pageId=event.detail.pageId;
        	if( pageId ){
	        	$("#headMenu a").removeClass("mui-active");
				$("#"+pageId).addClass("mui-active");
        	}
      	});
	});
});