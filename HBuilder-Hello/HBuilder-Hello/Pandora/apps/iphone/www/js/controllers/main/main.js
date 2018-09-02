define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		}
		,subpages:[{
				url:'main_sub.html',
				id:'main_sub',
				styles: {
				top: '0px',
				bottom: '0px'
			}
		}]
	});
	
	
	$.plusReady(function() {
//		plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackOpaque"); 
//		plus.navigator.setStatusBarBackground("#FFFFF");
		plus.screen.lockOrientation("portrait-primary");
		//手势设置时使用
		localStorage.setItem("screenWidth",plus.screen.resolutionWidth);
		var state = app.getState();
		
//		scann.addEventListener('click',function(){
//			if(mbank.checkLogon()){
//		  	 mbank.openWindowByLoad("../plus/barcode_scan.html","barcode_scan", "slide-in-right");
//		  }
//		},false);
		//禁止页面滑动
/*		var jinzhi=0;
			document.addEventListener("touchmove",function(e){
			if(jinzhi==1){
					e.preventDefault();
					e.stopPropagation();
					}
			},false);*/
		
	});
});