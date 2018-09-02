define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var top = "64px";
	if(mui.os.android ){
		top = '46px';				
	}
    
//	var top = "110px";
//	if(mui.os.android ){
//		top = '90px';				
//	}
    
    mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
			url:'../fund/myInvestmentList.html',
			id:'myInvestmentList',
			styles: {
			    top: top,
			    bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		//重新加载
		window.addEventListener("reload", function(event) {
			var child = plus.webview.getWebviewById("myInvestmentList");
			mui.fire(child, 'itemId', {currentItem: "myInvestmentList"});
		});
		
		//获取子页面参数
		window.addEventListener("getParam", function(event) {
			var pageBranchesList = event.detail.pageBranchesList;
		});
		
	});
});