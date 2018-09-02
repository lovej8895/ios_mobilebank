define(function(require, exports, module) {
	var doc = document;
	var m= mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	m.init();
	m.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var state = app.getState();
		
		$("#functionDiv>li").on("tap",function(){
			var id =$(this).attr("id");
		    var path=$(this).attr("path");
		    var noCheck=$(this).attr("noCheck");
		    mbank.openWindowByLoad(path,id, "slide-in-right",{noCheck:noCheck});
		});

	});
	
		
		
		
});