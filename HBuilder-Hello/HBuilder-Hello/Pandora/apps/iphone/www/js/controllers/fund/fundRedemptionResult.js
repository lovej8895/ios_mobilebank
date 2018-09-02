define(function(require, exports, module) {
    var mbank = require('../../core/bank');   
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		var f_prodname = self.f_prodname;
		var f_prodcode = self.f_prodcode;
		var f_ta_ack_date = self.f_ta_ack_date;
		var f_deposit_acct = self.f_deposit_acct;
		var f_applicationvol = self.f_applicationvol;
		var f_closeTip = self.f_closeTip;
		f_ta_ack_date = f_navdate = format.formatDate(format.parseDate(f_ta_ack_date, "yyyymmdd"));
		
		document.getElementById("productName").innerHTML = f_prodname;
		document.getElementById("accountNo").innerHTML = f_deposit_acct;
		document.getElementById("applicationvol").innerHTML = f_applicationvol;
		document.getElementById("ta_ack_date").innerHTML = f_ta_ack_date;
		if(f_closeTip=='0'){
			$("#resultDes").html("您的赎回委托申请已接受！该笔交易成功与否以基金公司确认结果为准，请您及时查询。");
		}else{
			$("#resultDes").html("现在为非交易时间，您的赎回委托申请将于下一基金交易日处理。该交易成功与否以基金公司确认结果为准，请您及时查询。");
		}
		mui.fire(plus.webview.getWebviewById("myHoldFundDetail"), 'refreshMyHoldFundDetail', {});
		mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshTotalFund', {});
		mui.fire(plus.webview.getWebviewById("myFundList"), 'refreshMyFundList', {});
		$("#fundReturn").on("tap",function(){
			plus.webview.close("fundRedemptionNext");
			plus.webview.close("fundRedemption");
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("fundRedemptionNext"), 'reload', {});
			/*mui.fire(plus.webview.getWebviewById("myHoldFundDetail"), 'refreshMyHoldFundDetail', {});
			mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshTotalFund', {});*/
		});
		$("#fundTradeQuery").on("tap",function(){
			var params = {
					f_deposit_acct : f_deposit_acct,
					f_cust_type : '1',					
				    noCheck:false
				};
				mbank.openWindowByLoad('../fund/fundTradeQuery.html','fundTradeQuery','slide-in-right',params);
			
		});
		
		mui.back = function(){
	    	plus.webview.close("fundRedemptionNext");
	    	plus.webview.close("fundRedemption");
			plus.webview.close(self);
			
			mui.fire(plus.webview.getWebviewById("fundRedemptionNext"), 'reload', {});
			
		}
	
	});

});