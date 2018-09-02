define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	
	var f_cust_type = '1';
	var f_bank_cust_code = localStorage.getItem("session_hostId");
	var f_methodflag = "";	
	
	mui.init();
	mui.plusReady(function() {

		plus.screen.lockOrientation("portrait-primary");		
		var self = plus.webview.currentWebview();
		var f_deposit_acct = self.f_deposit_acct;
		var f_cust_risk = self.f_cust_risk;
		var f_risk_end_date = self.f_risk_end_date;	
		f_risk_end_date = format.formatDate(format.parseDate(f_risk_end_date, "yyyymmdd"));
		$("#cusriskLevel").html($.param.getDisplay("RISK_LEVEL",f_cust_risk));
		document.getElementById("riskendDate").innerHTML = f_risk_end_date;						
				
		$("#nextButton").click(function(){			
			var params = {
				accountNo : f_deposit_acct,
				noCheck:false
			};
			mbank.openWindowByLoad('../fund/fundRiskAssessment.html','fundRiskAssessment','slide-in-right',params);			
	    });
	    	    
	    $("#continueBuy").click(function(){	
	    	var self = plus.webview.currentWebview();
	    	plus.webview.close(plus.webview.getWebviewById("fundRiskAssessment"));
			plus.webview.close(self);
			//mui.fire(plus.webview.getWebviewById("fundRiskAssessment"), 'reload', {});					
	    });
	    
	    mui.back = function(){
	    	var self = plus.webview.currentWebview();
			plus.webview.close(plus.webview.getWebviewById("fundRiskAssessment"));			
			plus.webview.close(self);
		}
	    
		
	});
});