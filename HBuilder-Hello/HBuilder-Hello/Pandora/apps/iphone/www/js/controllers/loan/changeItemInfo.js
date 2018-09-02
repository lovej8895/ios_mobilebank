define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var tranflowno = self.tranflowno;					//实还金额
		var loanTranType = self.loanTranType;				//实还本金
		var effectDate = self.effectDate;					//实还利息
		var effectDateShow = format.formatDate(format.parseDate(effectDate, "yyyy/mm/dd"));
		var channel = self.channel;						//实还罚息
		var channelShow = parseChannel(channel);
		
		document.getElementById("tranflowno").innerHTML = tranflowno;
		document.getElementById("loanTranType").innerHTML = loanTranType;
		document.getElementById("effectDate").innerHTML = effectDateShow;
		document.getElementById("channel").innerHTML = channelShow;
		
		function parseChannel(channel) {
			switch (channel) {
				case "I" : return "网银";
				case "J" : return "手机";
				default : return "信贷";
			}
		}
	});
});