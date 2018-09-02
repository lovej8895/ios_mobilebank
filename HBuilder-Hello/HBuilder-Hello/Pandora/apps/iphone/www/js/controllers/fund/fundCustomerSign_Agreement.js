define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

	mui.init();//预加载
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式	
		//var self = plus.webview.currentWebview();
		
		//链接到湖北银行官网
//		var sendHubeiWebsite = document.getElementById("sendHubeiWebsite");
//		sendHubeiWebsite.addEventListener('tap',function(){
//			plus.runtime.openURL('http://www.hubeibank.cn');
//		})
		//下一步
//		$("#confirmButton").click(function(){
//			var params = {
//				deposit_acct:self.deposit_acct,
//				mobile_telno:self.mobile_telno,
//				deliver_type:self.deliver_type,
//				deliver_way:self.deliver_way,
//				post_code:self.post_code,
//				address:self.address,
//				email:self.email,
//				sex:self.sex
//			};
//			mbank.openWindowByLoad('fundCustomerSign_Confirm.html','fundCustomerSign_Confirm','slide-in-right',params);
//		});
	});
});