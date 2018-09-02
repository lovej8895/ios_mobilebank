define(function(require, exports, module) {
    var mbank = require('../../core/bank');   
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var f_deposit_acct = self.f_deposit_acct;
		var f_prodname = self.f_prodname;
		var f_applicationvol = self.f_applicationvol;
		var f_allot_date = self.f_allot_date;
		var f_redeem_flag = self.f_redeem_flag;
		
		//alert(f_redeem_flag);
		document.getElementById("fundOut").innerHTML = f_applicationvol + '元的' + f_prodname;
		if(f_redeem_flag == "0"){
			$("#allot_date_div").hide();
		}else if(f_redeem_flag=="1"){
			$("#allot_date_div").show();
			if(f_allot_date){
				$("#allot_date").html(format.dataToDate(f_allot_date));//格式化日期，把YYYYMMDD转换YYYY-MM-DD
			}
		}
		
		//mui.fire(plus.webview.getWebviewById("cashFundDetail"), 'refreshCashFundDetail', {});
		//mui.fire(plus.webview.getWebviewById("myFundList"), 'refreshMyFundList', {});
		
		$("#fundReturn").on("tap",function(){
			mui.fire(plus.webview.getWebviewById("cashFundDetail"), 'refreshCashFundDetail', {});
			mui.fire(plus.webview.getWebviewById("myFundList"), 'refreshMyFundList', {});
			closeHtml();
			mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshTotalFund', {});
		});
		
		$("#fundTradeQuery").on("tap",function(){
			var params = {
					f_deposit_acct : f_deposit_acct,
					f_cust_type : '1',					
				    noCheck:false
				};
				mbank.openWindowByLoad('../fund/fundTradeQuery.html','fundTradeQuery','slide-in-right',params);
				//closeHtml();
		});
		
		mui.back = function(){
			mui.fire(plus.webview.getWebviewById("cashFundDetail"), 'refreshCashFundDetail', {});
			mui.fire(plus.webview.getWebviewById("myFundList"), 'refreshMyFundList', {});
			closeHtml();
			mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshTotalFund', {});			
		}
		
		function closeHtml(){
			
			plus.webview.close("fundTreasureOut");
	    	plus.webview.close("fundTreasureOutNext");
			plus.webview.close(self);
			
		}
		
		
	});

});