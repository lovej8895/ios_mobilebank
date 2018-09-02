define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	// 引入依赖
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');

	m.init();
	m.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		
		$("#myAccountMenu>li").on("tap",function(){
			var id =$(this).attr("id");
		    var path=$(this).attr("path");
		    var noCheck=$(this).attr("noCheck");
		    mbank.openWindowByLoad(path,id, "slide-in-right",{noCheck:noCheck});
		});
		
		
		
	});
});