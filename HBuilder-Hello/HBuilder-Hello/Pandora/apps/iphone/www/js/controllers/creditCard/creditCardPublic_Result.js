define(function(require, exports, module) {
	/**
	 * 信用卡业务处理返回成功结果页面统一使用公共页面展示
	 */
    var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var contextData = plus.webview.currentWebview();
		var self = plus.webview.currentWebview();
		var cardpublicflagvalue = contextData.cardpublicflag;
		
		if (cardpublicflagvalue == "1") {
			$("#cardpublicflag1").show();
		}else if (cardpublicflagvalue == "2") {
			$("#cardpublicflag2").show();
		}else if (cardpublicflagvalue == "3") {
			$("#cardpublicflag3").show();
		}else if (cardpublicflagvalue == "4") {
			$("#cardpublicflag4").show();
		}else if (cardpublicflagvalue == "5") {
			$("#cardpublicflag5").show();
		}else if (cardpublicflagvalue == "6") {
			$("#cardpublicflag6").show();
		}else if (cardpublicflagvalue == "7") {
			$("#cardpublicflag7").show();
		}else if (cardpublicflagvalue == "8") {
			$("#cardpublicflag8").show();
		}else if (cardpublicflagvalue == "9") {
			$("#cardpublicflag9").show();
		}else if (cardpublicflagvalue == "10") {
			$("#cardpublicflag10").show();
		}else if (cardpublicflagvalue == "11") {
			$("#cardpublicflag11").show();
		}else if (cardpublicflagvalue == "12") {
			$("#cardpublicflag12").show();
		}else if (cardpublicflagvalue == "13") {
			$("#cardpublicflag13").show();
			if (contextData.contract_flag == "1") {
				$("#resultFlag1").show();
			}
			if (contextData.contract_flag == "2") {
				$("#resultFlag2").show();
			}
			if (contextData.contract_flag == "3") {
				$("#resultFlag3").show();
			}
		}else if (cardpublicflagvalue == "14") {
			$("#cardpublicflag14").show();
			if (contextData.contract_flag == "1") {
				$("#contract_flag1").show();
			}
			if (contextData.contract_flag == "2") {
				$("#contract_flag2").show();
			}
			$("#contract_flagBtn").show();
		}else if (cardpublicflagvalue == "15") {
			$("#cardpublicflag15").show();
		}
		//卡片激活
		$("#backBtn1").on("tap",function(){
			plus.webview.close("applicationAndActivation");
			plus.webview.close("creditCardActivation_Input");
			plus.webview.close("creditCardActivation_Confirm");
			plus.webview.close(self.id);
		});
		//本行主动还款
		$("#backBtn2").on("tap",function(){
			plus.webview.close("thisInitiativeRefundMenuInfo");
			plus.webview.close("thisInitiativeRefundMenuInfo_sub");
			plus.webview.close("thisInitiativeRefund_Input");
			plus.webview.close("thisInitiativeRefund_Confirm");
			plus.webview.close(self.id);
		});
		//本行约定还款-约定账户修改
		$("#backBtn3").on("tap",function(){
			plus.webview.close("thisInitiativeRefundMenuInfo");
			plus.webview.close("thisInitiativeRefundMenuInfo_sub");
			plus.webview.close("thisAppointRefund_Input");
			plus.webview.close("thisAppointRefund_Signing_Input");
			plus.webview.close("thisAppointRefund_Confirm");
			plus.webview.close(self.id);
		});
		//本行约定还款-约定账户签约
		$("#backBtn4").on("tap",function(){
			plus.webview.close("thisInitiativeRefundMenuInfo");
			plus.webview.close("thisInitiativeRefundMenuInfo_sub");
			plus.webview.close("thisAppointRefund_Input");
			plus.webview.close("thisAppointRefund_Signing_Input");
			plus.webview.close("thisAppointRefund_Confirm");
			plus.webview.close(self.id);
		});
		//本行约定还款-约定账户解约
		$("#backBtn5").on("tap",function(){
			plus.webview.close("thisInitiativeRefundMenuInfo");
			plus.webview.close("thisInitiativeRefundMenuInfo_sub");
			plus.webview.close("thisAppointRefund_Input");
			plus.webview.close(self.id);
		});
		//跨行主动还款
		$("#backBtn6").on("tap",function(){
			plus.webview.close("thisInitiativeRefundMenuInfo");
			plus.webview.close("thisInitiativeRefundMenuInfo_sub");
			plus.webview.close("otherInitiativeRefund_Input");
			plus.webview.close("otherInitiativeRefund_Confirm");
			plus.webview.close(self.id);
		});
		//跨行主动还款-跨行约定还款
		$("#backBtn7").on("tap",function(){
			plus.webview.close("thisInitiativeRefundMenuInfo");
			plus.webview.close("thisInitiativeRefundMenuInfo_sub");
			plus.webview.close("otherAppointRefund_Input");
			plus.webview.close("otherAppointRefund_Signing_Input");
			plus.webview.close("otherAppointRefund_Confirm");
			plus.webview.close(self.id);
		});
		//跨行主动还款-约定账户修改
		$("#backBtn8").on("tap",function(){
			plus.webview.close("thisInitiativeRefundMenuInfo");
			plus.webview.close("thisInitiativeRefundMenuInfo_sub");
			plus.webview.close("otherAppointRefund_Input");
			plus.webview.close("otherAppointRefund_Signing_Input");
			plus.webview.close("otherAppointRefund_Confirm");
			plus.webview.close(self.id);
		});
		//跨行主动还款-约定账户解约
		$("#backBtn9").on("tap",function(){
			plus.webview.close("thisInitiativeRefundMenuInfo");
			plus.webview.close("thisInitiativeRefundMenuInfo_sub");
			plus.webview.close("otherAppointRefund_Input");
			plus.webview.close(self.id);
		});
		//账单分期
		$("#backBtn10").on("tap",function(){
			plus.webview.close("installmentCreditMenuInfo");
			plus.webview.close("installmentCreditMenuInfo_sub");
			plus.webview.close("billInstalment_Input");
			plus.webview.close("billInstalment_Confirm");			
			plus.webview.close(self.id);
		});
		//消费分期
		$("#backBtn11").on("tap",function(){
			plus.webview.close("installmentCreditMenuInfo");
			plus.webview.close("installmentCreditMenuInfo_sub");
			plus.webview.close("dealInstalment_Input_Menu");
			plus.webview.close("dealInstalment_Input");
			plus.webview.close("dealInstalment_Confirm");
			plus.webview.close("dealInstalment_Submit");
			plus.webview.close(self.id);
		});
		//分期查询-提前结清
		$("#backBtn12").on("tap",function(){
			
			var menuView = plus.webview.getWebviewById("installmentCreditMenuInfo");
			menuView.show('slide-in-right',100)
//			plus.webview.close("installmentCreditMenuInfo");
//			plus.webview.close("installmentCreditMenuInfo_sub");
//			plus.webview.close("instalmentQuery_Input");
//			plus.webview.close("instalmentQuery_Confirm");
			plus.webview.hide(self.id);
			plus.webview.close(self.id);
		});
		//网上支付设置-开通
		$("#backBtn13").on("tap",function(){
			plus.webview.close("thirdPayMenuInfo");
			plus.webview.close("thirdPayMenuInfo_sub");
			plus.webview.close("thirdPay_Input");
			plus.webview.close(self.id);
		});
		//银联无密闪付
		$("#backBtn14").on("tap",function(){
			plus.webview.close("thirdPayMenuInfo");
			plus.webview.close("thirdPayMenuInfo_sub");
//			plus.webview.close("noPasswordLimitSet_Input_Menu");
			plus.webview.close("noPasswordLimitSet_Input");
			plus.webview.close(self.id);	
		});
		//预借现金
		$("#backBtn15").on("tap",function(){
			plus.webview.close("installmentCreditMenuInfo");
			plus.webview.close("installmentCreditMenuInfo_sub");
			plus.webview.close("drawTransfer_Input");
			plus.webview.close("drawTransfer_Confirm");
			plus.webview.close(self.id);
		});
	});
});