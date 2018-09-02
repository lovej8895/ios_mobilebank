define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

	mui.init();//预加载
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();
		var f_deposit_acct = self.f_deposit_acct;
		var successFlag = self.successFlag;
		if(!successFlag){
			$("#failDiv").show();
			$("#backBtn").show();
//			$("#continueBtn").show();
			var errorMsg = self.errorMsg;
			$("#msg").html("基金账户签约失败：" + errorMsg);
			//mui.alert(errorMsg);
		}else{
			$("#successDiv").show();
			$("#continueBtn").show();
		}
		//继续购买
		$("#continueBtn").click(function(){
			//关闭签约页面
			mui.back();
		});
		//返回基金首页
		$("#backBtn").click(function(){
			if(!successFlag){//签约失败--返回基金首页
				if(plus.webview.getWebviewById("fundmarket")){//基金超市页
					plus.webview.close(plus.webview.getWebviewById("fundmarket"));
				}
				if(plus.webview.getWebviewById("cashFundDetail")){//宝类详情页
					plus.webview.close(plus.webview.getWebviewById("cashFundDetail"));
				}
			}
			mui.back();
		});
		
		mui.back=function(){
			plus.webview.close(plus.webview.getWebviewById("treasureClassSign_Input"));
			plus.webview.close(plus.webview.getWebviewById("treasureClassSign_Confirm"));		
			plus.webview.close(self);
		}
		
	});
});