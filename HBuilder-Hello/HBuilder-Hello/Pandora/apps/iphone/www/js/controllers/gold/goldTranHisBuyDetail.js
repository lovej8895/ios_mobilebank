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
		var orderNo = self.orderNo;
		var orderSubmitTime = self.orderSubmitTime;
		var tranAmt = self.tranAmt;
		var goldDealTime = self.goldDealTime;
		var orderState = self.orderState;
		var goldBuyType = self.goldBuyType;
		var goldDealAmount = self.goldDealAmount;
		var price = self.price;
		var goldDealWeight = self.goldDealWeight;
		var goldAipNo = self.goldAipNo;
		var planNo = self.planNo;
		var remark = self.remark;
		document.getElementById("goldBuyType").innerText = jQuery.param.getDisplay("GOLD_BUY_TYPE",goldBuyType);
		document.getElementById("orderState").innerText = jQuery.param.getDisplay("GOLD_BUY_STATE",orderState);
		document.getElementById("goldAipNo").innerText = goldAipNo;
		if(goldBuyType =='01' && planNo){
			document.getElementById("planNo").innerText = planNo;
			document.getElementById('planNoDiv').style.display = 'block';
		}
		document.getElementById("orderNo").innerText = orderNo;
		document.getElementById("orderSubmitTime").innerText = format.formatDateTime(orderSubmitTime);
		if(goldDealTime){
			document.getElementById("goldDealTime").innerText = format.dataToDate(goldDealTime);
			document.getElementById('goldDealTimeDiv').style.display = 'block';
		}
		document.getElementById("tranAmt").innerText = format.formatMoney(tranAmt) +'元';
		if(price){
			document.getElementById("price").innerText = format.formatMoney(price) +'元/克';
			document.getElementById('priceDiv').style.display = 'block';
		}
		if(goldDealWeight){
			document.getElementById("goldDealWeight").innerText = goldDealWeight +'克';
			document.getElementById('goldDealWeightDiv').style.display = 'block';
		}
		if(remark){
			document.getElementById("remark").innerText = remark;
			document.getElementById('remarkDiv').style.display = 'block';
		}
		
		
	});
});