define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	var activeId = 'thisInitiativeRefund_Input';
	// 引入依赖
	var app = require('../core/app');
	var userInfo = require('../core/userInfo');
	var mbank = require('../core/bank');
	var nativeUI = require('../core/nativeUI');

	
	$.init({
		subpages: [
		{
			id: 'thisAppointRefund_Input',
			url: '../creditCard/thisAppointRefund_Input.html',
			styles: {
				top: '110px',
				bottom: '0px'
			}
		},{
			id:'thisInitiativeRefund_Input',
			url:'../creditCard/thisInitiativeRefund_Input.html',
			styles: {
				top: '110px',
				bottom: '0px'
			}
		}]
	});
	var subpage_style = {
	top: '100px',
	bottom: '0px'
	};
	$.plusReady(function() {
		if(mui.os.ios){
			plus.navigator.setFullscreen(false);
		}
		
		
  		var items = jQuery("#headMenu>a");
     	for (var i = 0; i < items.length; i++) {
			items[i].addEventListener('tap', function() {
				var tid=this.getAttribute('id');
				var path=this.getAttribute('path');
                var noCheck=this.getAttribute('noCheck');
				var showView = plus.webview.getWebviewById(tid);
				var currView = plus.webview.getWebviewById(activeId);
				plus.webview.close();
				//mui.alert(tid);
				plus.webview.show(showView);
				activeId = tid;
			});
		}
		
		
		
		
	});

});