define(function(require, exports, module) {
    var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format=require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	mui.init({
		swipeBack:false,
		keyEventBind: {
			menubutton: false
		}
	});
    
	mui.plusReady(function(){
		$("#transferMenu>li").on("tap",function(){
			var id =$(this).attr("id");
		    var path=$(this).attr("path");
		    var noCheck=$(this).attr("noCheck");
		    mbank.openWindowByLoad(path,id, "slide-in-right",{noCheck:noCheck});
		});
	});
});