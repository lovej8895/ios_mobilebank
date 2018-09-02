define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var loanAccount = self.loanAccount;
		var payAccount = self.payAccount;
		var oldType = self.oldType;
		var newType = self.newType;
		var effectDate = self.effectDate;
		var effectDateShow = format.formatDate(format.parseDate(effectDate));
		
		document.getElementById("oldType").innerHTML = getTypeShow(oldType);
		document.getElementById("newType").innerHTML = getTypeShow(newType);
		document.getElementById("effectDate").innerHTML = effectDateShow;
		
		function getTypeShow(type) {
			switch(type) {
				case "RPT000020": return "等额本金";
				case "RPT000010": return "等额本息";
				default: return "";
			}
		}
		
		$("#backButton").on("tap",function(){
			mui.back();
		});
		
		mui.back = function(){
			plus.webview.close("personalLoanInfo");
			plus.webview.close("loanChangeInput");
			plus.webview.close("loanChangeConfirm");
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("personalLoanList"), 'reload', {});
		}
		
	});

});