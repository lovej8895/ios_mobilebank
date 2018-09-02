define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('005011', self);
		var loanAccount = self.loanAccount;
		var payAccount = self.payAccount;
		var payBenJin = self.payBenJin;
		var payBenJinShow = format.formatMoney(payBenJin, 2);
		var payRate = self.payRate;
		var payRateShow = format.formatMoney(payRate, 2);
		var payAmount = self.payAmount;
		var payAmountShow = format.formatMoney(payAmount, 2);
		var chineseAmt = self.chineseAmt;
		
		document.getElementById("payAccount").innerHTML = payAccount;
		document.getElementById("payBenJin").innerHTML = payBenJinShow +'元';
		document.getElementById("chineseAmt").innerHTML = chineseAmt;
		document.getElementById("payRate").innerHTML = payRateShow +'元';
		document.getElementById("payAmount").innerHTML = payAmountShow +'元';
		
		getOrderFlowNo();
		function getOrderFlowNo(){
			var dataNumber = {};
			var url = mbank.getApiURL() + 'GetOrderFlowNo.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				var orderFlowNo = data.orderFlowNo;
				console.log("orderFlowNo=="+orderFlowNo)
				$("#orderFlowNo").val(orderFlowNo);
			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
		
		$("#confirmButton").click(function(){
			var dataNumber = {
				payAccount : payAccount,
				payAmount : payAmount,
				payBenXi : payAmount,
				payBenJin : payBenJin,
				payRate : payRate,
				chineseAmt : chineseAmt,
				orderFlowNo : $("#orderFlowNo").val(),
				loanAccount : loanAccount
			};
		    var url = mbank.getApiURL() + '005011_backInfoSubmit.do';
		    commonSecurityUtil.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
		    function successCallback(data){
		    	var params = {
		    		loanAccount : data.loanAccount,
			    	payAccount : data.payAccount,
			    	payBenJin : data.payBenJin,
			    	payRate : data.payRate,
			    	payAmount : data.payAmount,
			    	chineseAmt : data.chineseAmt,
			    	noCheck : false
		    	};
				mbank.openWindowByLoad('loanBackResult.html','loanBackResult','slide-in-right',params);
		    }
		    function errorCallback(e){
		    	mui.alert(e.em);
		    }
	    });
		mbank.resizePage(".btn_bg_f2");
	});
});