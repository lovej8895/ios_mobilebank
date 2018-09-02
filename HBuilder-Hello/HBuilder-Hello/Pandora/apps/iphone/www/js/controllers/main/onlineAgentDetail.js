define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	
	mui.init({
	});
	
	$.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var mbUUID = plus.device.uuid;
		var ot = 3000;//延迟   1000 1秒   需要修改
		var netMark = false;//加载在线客服成功标识 true为成功 false为失败
		
		var visitFlag = "5";//5-手机访问在线客服标识
		var password= visitFlag + mbUUID + "HuBeiBank";
		//得到md5加密
  		var bankCode = hex_md5(password);
		
		//在线客服访问地址 jQuery.param.getOnlineAgentUrl
		var url = jQuery.param.getOnlineAgentUrl("ONLINEAGENT_URL_ADDR")+"chat/gotoPage.do?visitFlag="+visitFlag+"&custFlag="+mbUUID+"&bankCode="+bankCode;
		console.log(url);
		
		if (jQuery.param.getOnlineAgentUrl("ONLINEAGENT_URL_ADDR") == null || jQuery.param.getOnlineAgentUrl("ONLINEAGENT_URL_ADDR") == "") {
			document.getElementById("waiting").innerHTML = "敬请期待！" ;
		} else {
			var network = plus.networkinfo.getCurrentType();
			if(network < 2) {
				plus.nativeUI.toast('您的网络未连接,建议在wifi情况下浏览。', undefined, exports.getAppName);
				document.getElementById("waiting").innerHTML = "网络连接错误！" ;
			} else {
				//处理location.href = url打开服务异常或超时
				plus.nativeUI.showWaiting("加载中...");
				jQuery.post({
//					type: 'post',
//					dataType: "json",
					url: url,
//					data: '',
					beforeSend: function(XMLHttpRequest){
//						console.log("asfd");
					},
					success: function(data){
						plus.nativeUI.closeWaiting();
						location.href = url;//打开在线客服服务
						netMark = true;
					},
					error: function(e){
						plus.nativeUI.closeWaiting();
						document.getElementById("waiting").innerHTML = "网络连接错误！" ;
					}
				});
			}
			
			setTimeout(function() {
			if(!netMark){
				plus.nativeUI.closeWaiting();
				document.getElementById("waiting").innerHTML = "网络连接错误！" ;
				return;
			}
		}, ot);//延迟1000 1秒执行 需要修改
		}
	});
});