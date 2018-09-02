define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
	var self = "";
	var params;
	var urlVar;
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var planNo = self.planNo;
		var orderSubmitTime = self.orderSubmitTime;
		var investPeriod = self.investPeriod;
		var tranAmt = self.tranAmt;
		var investDate = self.investDate;
		var orderState = self.orderState;
		var goldAipNo = self.goldAipNo;
		var remark = self.remark;
		var goldDealTime = self.goldDealTime;
		
		document.getElementById("planNo").innerText = planNo;
		document.getElementById("orderSubmitTime").innerText = format.formatDateTime(orderSubmitTime);
		var investDateDesc;
		if(investPeriod =="1"){
			if(investDate.length ==1){
				investDate = '0'+investDate;
			}
			investDateDesc = jQuery.param.getDisplay('GOLD_INVESTDAY_MONTH', investDate);
		}else if(investPeriod == "4"){
			investDateDesc = "每周" + jQuery.param.getDisplay('GOLD_INVEST_WEEK', investDate);
		}else{
			investDateDesc = "每天";
		}
		document.getElementById("investPeriod").innerText = investDateDesc;
		document.getElementById("tranAmt").innerText = format.formatMoney(tranAmt);
		document.getElementById("orderState").innerText = jQuery.param.getDisplay('GOLD_PLAN_STATE',orderState);
		document.getElementById("goldAipNo").innerText = goldAipNo;
		document.getElementById("goldDealTime").innerText = format.formatDateTime(goldDealTime);
		if(remark){
			document.getElementById("remark").innerText = remark;
			document.getElementById("remarkDiv").style.display = 'block';
		}
		
		if(orderState == '2'){
			document.getElementById('nextBtn').removeAttribute("disabled");
		}
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			mui.confirm("终止计划后将不再继续定时扣款且该计划将不可恢复","温馨提示",["确定", "取消"], function(event) {	
				if(event.index == 0){
					params = {
						"goldAipNo" : goldAipNo,
						"planNo" : planNo
					};
					var urlVar = mbank.getApiURL()+'goldPlanStop.do';
					mbank.apiSend("post",urlVar,params,confirmSuc,confirmFail,true);
					function confirmSuc(data){
						if(data.ec =='000'){
							mui.fire(plus.webview.getWebviewById('goldBuyPlanListSub'),"reload",{});
							mui.alert("定投计划终止成功","温馨提示","确认",function(){
								plus.webview.currentWebview().close();
							});
						}else{
							mui.alert(data.em);
						}
					}
					function confirmFail(e){
						mui.alert(e.em);
					}
				}else{
					return false;
				}
			});
		},false);
		
//		mbank.resizePage(".btn_bg_f2");
	});
});