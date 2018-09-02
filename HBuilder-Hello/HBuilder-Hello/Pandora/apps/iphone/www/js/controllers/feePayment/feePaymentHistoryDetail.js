define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var self = "";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		chargeTime = self.chargeTime;
		chargeType = self.chargeType;
		chargeNo = self.chargeNo;
		tranAmt = self.tranAmt;
		channelFlag = self.channelFlag;
		failMes = self.failMes;
		
		document.getElementById("chargeTime").innerText = chargeTime;
		document.getElementById("chargeType").innerText = chargeType;
		document.getElementById("chargeNo").innerText = chargeNo;
		document.getElementById("tranAmt").innerText = "¥"+tranAmt;
		document.getElementById("channelFlag").innerText = channelFlag;
		document.getElementById("failMes").innerText = failMes;
		
		document.getElementById("goBack").addEventListener("tap",function(){
			mui.back();
		},false);
		
		mbank.resizePage(".btn_bg_f2");
	});
})