define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	var top = '172px';
	if (mui.os.android) {
		top = '162px';
	}
	
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
			url:'productBuyList.html',
			id:'productBuyList',
			styles: {
			    top: top,
			    bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		$(".mui-slider-item li").on("tap",function(){
			var id=$(this).attr("id");
			var path=$(this).attr("path");
			var noCheck=$(this).attr("noCheck");
            mbank.openWindowByLoad(path,id,'slide-in-right',{noCheck:noCheck}); 
		});
		
		//重新加载
		window.addEventListener("reload", function(event) {
			location.reload();
		});
	});
});