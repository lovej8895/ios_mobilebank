define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		var accountCardNo = self.accountCardNo;
		var f_applicationamount = self.f_applicationamount;
		var f_applicationvol = self.f_applicationvol;
		var f_prodname = self.f_prodname;
		var f_prodcode = self.f_prodcode;
		var f_prodtype = self.f_prodtype;	
		var f_transactiondate = self.f_transactiondate;	
		var f_transtatus = self.f_transtatus;	
		var f_app_sno = self.f_app_sno;
		var f_businesscode = self.f_businesscode;
		f_businesscode = $.param.getDisplay("BUSINESS_CODE",f_businesscode);				
		f_transactiondate = format.formatDate(format.parseDate(f_transactiondate, "yyyymmdd"));
		
		var orderFlowNo = "";
		var session_customerNameCN = "";
		
		//获取交易流水
		getOrderFlowNo();
		function getOrderFlowNo() {
			var dataNumber = {};
			var url = mbank.getApiURL() + 'GetOrderFlowNo.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				orderFlowNo = data.orderFlowNo;				
			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
		
		if(self.f_businesscode == '24' || self.f_businesscode == '25' || self.f_businesscode == '98' ){
			$("#show_applicationvol").show();
		    $("#show_applicationamount").hide();
			document.getElementById("f_applicationvol").innerHTML = format.formatMoney(f_applicationvol, 2) + "份";
		}else{
			$("#show_applicationamount").show();
		    $("#show_applicationvol").hide();
			document.getElementById("f_applicationamount").innerHTML = format.formatMoney(f_applicationamount, 2) + "元";
		}
		document.getElementById("accountCardNo").innerHTML = accountCardNo;
		document.getElementById("f_prodname").innerHTML = f_prodname;
		document.getElementById("f_prodtype").innerHTML = f_businesscode;
		document.getElementById("f_transactiondate").innerHTML = f_transactiondate;						
		if (f_transtatus != 01 ) {				
			$("#nextButton").attr({"disabled":"disabled"});
		}
				
		$("#nextButton").click(function(){
			mui.confirm("您确认要撤单吗？","温馨提示",["确定", "取消"],function(e) {
				if (e.index == 0) {
					var datas = {
						orderFlowNo : orderFlowNo,
						f_prodname : f_prodname,
						f_prodcode : f_prodcode,
						f_prodtype : f_prodtype,
						f_applicationamount : f_applicationamount,
						f_applicationvol : f_applicationvol,
						f_deposit_acct : accountCardNo,
						f_org_app_sno  : f_app_sno,
						f_originalbusinesscode : self.f_businesscode
					};
					var url = mbank.getApiURL() + 'fundDropSale.do';			
					mbank.apiSend("post",url,datas,successCallback,errorCallback,true);		
					function successCallback(data){
						var params = {
					    	noCheck:false
						};
						mbank.openWindowByLoad('fundDropSaleResult.html','fundDropSaleResult','slide-in-right',params);
					}
					function errorCallback(e){
					 	mui.alert(e.em);
					}
				}
			});
	    });
	});
});