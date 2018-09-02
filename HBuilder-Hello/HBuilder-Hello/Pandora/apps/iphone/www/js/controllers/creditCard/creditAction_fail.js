/*
 * 实现错误信息展示页面以及返回
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
		var errorCode = self.errorCode;
		var errorMsg = self.errorMsg;
		//mui.alert(successType);
		
		var title = document.getElementById("title");
		var context = document.getElementById("context");
		var creditAction_failBack = document.getElementById("creditAction_failBack");
		var frontId = "";//前一页面id
		
		switch(errorCode){
			case "1": {
						title.innerText = "卡片激活";
						context.innerText = errorMsg;
						frontId = "creditCardActivation_Confirm";
						break;
			}
			case "2":{
						title.innerText = "办卡进度查询";
						context.innerText = errorMsg;
						frontId = "cardRateList";
						break;
			}
			case "3":{
						title.innerText = "已出账单查询";
						context.innerText = errorMsg;
						frontId = "limitList";
						break;
			}
			case "4":{
						title.innerText = "未出账单查询";
						context.innerText = errorMsg;
						break;
			}
			case "5":{
						title.innerText = "账单维护";
						context.innerText = errorMsg;
						frontId = "accountConfirm";
						break;
			}
			case "6":{
						title.innerText = "额度查询";
						context.innerText = errorMsg;
						break;
					}
			case "7":{
						title.innerText = "额度申请";
						context.innerText = errorMsg;
						frontId = "thisInitiativeRefund_Input";
						break;
					}
			case "8":{
						title.innerText = "本行主动还款";
						context.innerText = errorMsg;
						frontId = "thisInitiativeRefund_Confirm";
						break;
					}
			case "9":{
						title.innerText = "本行约定还款";
						context.innerText = errorMsg;
						frontId = "thisAppointRefund_Confirm";
						break;
					}
			case "10":{
						title.innerText = "跨行主动还款";
						context.innerText = errorMsg;
						frontId = "otherInitiativeRefund_Confirm";
						break;
					}
			case "11":{
						title.innerText = "跨行约定还款";
						context.innerText = errorMsg;
						frontId = "otherAppointRefund_Confirm";
						break;
					}
			case "12":{
						title.innerText = "账单分期";
						context.innerText = errorMsg;
						frontId = "billInstalment_Confirm";
						break;
					}
			case "13":{
						title.innerText = "消费分期";
						context.innerText = errorMsg;
						frontId = "dealInstalment_Confirm";
						break;
					}
			case "14":{
						title.innerText = "分期查询";
						context.innerText = errorMsg;
						frontId = "instalmentQuery_Confirm";
						break;
					}
			case "15":{
						title.innerText = "预借现金";
						context.innerText = errorMsg;
						frontId = "drawTransfer_Confirm";
						break;
					}
			case "16":{
						title.innerText = "网上支付设置";
						context.innerText = errorMsg;
						frontId = "creditAction_fail";
						break;
					}
			case "17":{
						title.innerText = "银联无密闪付";
						context.innerText = errorMsg;
						frontId = "creditAction_fail";
						break;
					}
			case "19":{
						title.innerText = "积分管理";
						context.innerText = errorMsg;
						frontId = "pointQuery";
						break;
					}
		}
		
		creditAction_failBack.addEventListener('tap',function(){
			mui.back();
		});
		//重写back返回确认页面上一页面
		mui.back = function(){
			plus.webview.close(self);
			if(""==frontId || null==frontId){
				
			}else{		
				plus.webview.close(plus.webview.getWebviewById(frontId));
			}
		}
		
	});
});