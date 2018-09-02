/*
 * 实现账号维护成功页面的后续操作：
 * 	返回
 */
define(function(require, exports, module) {
	
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	
//	document.getElementById("ad_ifrm").src=mbank.getApiURL()+"APP/views/main/main.html?x="+(new Date()-0); 
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var state = app.getState();
		var self = plus.webview.currentWebview();
		var successType = self.successType;
		//mui.alert(successType);
		
		var title = document.getElementById("title");
		var context = document.getElementById("context");
		
		var noCheck;
		var path;
		var id;
		var frontView;
		var beginView;
		var firstView;
		if(successType=="1"){
			title.innerText = "账单维护";
			context.innerText = "您的账单维护已成功！";
			frontView = plus.webview.getWebviewById("accountConfirm");
			beginView = plus.webview.getWebviewById("accountMaintain");
			firstView = plus.webview.getWebviewById("billManager");
		}else if(successType == "2"){
			title.innerText = "额度申请";
			context.innerText = "您的信用卡额度已申请成功！";
			beginView = plus.webview.getWebviewById("limitApply");
			frontView = plus.webview.getWebviewById("limitApply_confirm");
		}
		
		//修改账单信息完成后，通过关闭这一个页面以及上一个页面来回到页签面，避免了
		//页面之间的循环
		 
		mui.back = function(){
			if(beginView || firstView){
				plus.webview.close(beginView);
				plus.webview.close(firstView);
			}
			
			plus.webview.close(frontView);
			plus.webview.close(self);			
		}
		
		
	});
});