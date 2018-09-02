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
		var goldDealTime = self.goldDealTime;
		var sellWeight = self.sellWeight;
		var orderState = self.orderState;
		var goldDealAmount = self.goldDealAmount;
		var price = self.price;
		var goldDealWeight = self.goldDealWeight;
		var goldAipNo = self.goldAipNo;
		var goldDealFeeAmount = self.goldDealFeeAmount;
		var sellGetMoney = self.sellGetMoney;
		var remark = self.remark;
		
		document.getElementById("orderState").innerText = jQuery.param.getDisplay("GOLD_BUY_STATE",orderState);
		document.getElementById("goldAipNo").innerText = goldAipNo;
		document.getElementById("orderNo").innerText = orderNo;
		document.getElementById("orderSubmitTime").innerText = format.formatDateTime(orderSubmitTime);
		if(goldDealTime){
			document.getElementById("goldDealTime").innerText = format.dataToDate(goldDealTime);
			document.getElementById('goldDealTimeDiv').style.display = 'block';
		}
		document.getElementById("sellWeight").innerText = sellWeight + '克';
		if(price){
			document.getElementById("price").innerText = format.formatMoney(price) +'元/克';
			document.getElementById('priceDiv').style.display = 'block';
		}
		if(goldDealWeight){
			document.getElementById("goldDealWeight").innerText = goldDealWeight + '克';
			document.getElementById('goldDealWeightDiv').style.display = 'block';
		}
		if(goldDealAmount){
			document.getElementById("goldDealAmount").innerText = format.formatMoney(goldDealAmount) +'元';
			document.getElementById('goldDealAmountDiv').style.display = 'block';
		}
		if(goldDealFeeAmount){
			document.getElementById("goldDealFeeAmount").innerText = format.formatMoney(goldDealFeeAmount) +'元';
			document.getElementById('goldDealFeeAmountDiv').style.display = 'block';
		}
		if(sellGetMoney){
			document.getElementById("sellGetMoney").innerText = format.formatMoney(sellGetMoney) +'元';
			document.getElementById('sellGetMoneyDiv').style.display = 'block';
		}
		if(remark){
			document.getElementById("remark").innerText = remark;
			document.getElementById('remarkDiv').style.display = 'block';
		}
		
		
	});
});