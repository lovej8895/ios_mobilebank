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
		var tranType = self.tranType;
		var tranAmt = self.tranAmt;
		var orderState = self.orderState;
		var orderSubmitTime = self.orderSubmitTime;
		var accountNo = self.accountNo;
		var accountName = self.accountName;
		var remark = self.remark;
		var goldAipNo = self.goldAipNo;
		var goldDealFeeAmount = self.goldDealFeeAmount;
		
		document.getElementById("tranType").innerText = jQuery.param.getDisplay("GOLD_ORDER_TYPE",tranType);
		document.getElementById("orderNo").innerText = orderNo;
		document.getElementById("orderSubmitTime").innerText = format.formatDateTime(orderSubmitTime);
		document.getElementById("orderState").innerText = jQuery.param.getDisplay("GOLD_CHARGE_STATE",orderState);
		document.getElementById("goldAipNo").innerText = goldAipNo;
		document.getElementById("accountNo").innerText = accountNo;
		if(accountName){
			document.getElementById("accountName").innerText = accountName;
			document.getElementById("accountNameDiv").style.display = 'block';
		}
		document.getElementById("tranAmt").innerText = format.formatMoney(tranAmt)+'元';
		document.getElementById("goldDealFeeAmount").innerText = format.formatMoney(goldDealFeeAmount)+'元';
		document.getElementById("remark").innerText = remark;
	});
});