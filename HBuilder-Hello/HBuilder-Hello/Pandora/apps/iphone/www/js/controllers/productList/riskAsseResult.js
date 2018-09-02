define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var self = plus.webview.currentWebview();
		var cusriskLevel = self.cusriskLevel;
		var cusriskLevelShow = parseCusRiskLevel(cusriskLevel);
    	var riskendDate = self.riskendDate;
    	var riskendDateShow = format.formatDate(format.parseDate(riskendDate, "yyyymmdd"));
    	var riskResultDes = self.riskResultDes;
    	var cstName = self.cstName;
    	
    	document.getElementById("cusriskLevel").innerHTML = cusriskLevelShow;
    	document.getElementById("riskendDate").innerHTML = riskendDateShow;
    	document.getElementById("riskResultDes").innerHTML = riskResultDes;
    	document.getElementById("cstName").innerHTML = cstName;
		
		function parseCusRiskLevel(cusriskLevel) {
			switch (cusriskLevel) {
				case  "01" : return "激进型";
				case  "02" : return "进取型";
				case  "03" : return "平衡型";
				case  "04" : return "稳健型";
				default : return "谨慎型";
			}
		}
		
		$("#backButton").on("tap",function(){
			plus.webview.close("riskAssessment");
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("productMarket"), 'reload', {});
		});
	});

});