define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();
		var loanAccount = self.loanAccount;
		var payAccount = self.payAccount;
		var oldLoanType = self.oldLoanType;
		$("#oldType").html(oldLoanType);
		if (oldLoanType == '等额本金条款') {
			$("#newType").html('等额本息条款');
		} else {
			$("#newType").html('等额本金条款');
		}
		var currentDate = new Date();
		var effectDate = format.formatDate(currentDate);
		$("#effectDate").html(effectDate);
		
		var changeEffectDate = document.getElementById('changeEffectDate');
		changeEffectDate.addEventListener('tap', function(event) {
			plus.nativeUI.pickDate( function(e){
				var dStr = format.formatDate(e.date);
				$("#effectDate").html(dStr);
			});
		}, false);
		
		$("#nextButton").click(function(){
	    	var ectDate = $("#effectDate").html().replaceAll("-", "");
	    	var curDate = new Date().format("yyyyMMdd");
	    	if (ectDate < curDate) {
	    		mui.alert("生效日期不能早于当前日期！");
	    		return false;
	    	}
		    var params = {
	    		loanAccount : loanAccount,
	    		payAccount : payAccount,
	    		oldType : oldLoanType,
	    		newType : $("#newType").html(),
	    		effectDate : ectDate,
	    		noCheck : false
	    	};
			mbank.openWindowByLoad('loanChangeConfirm.html','loanChangeConfirm','slide-in-right',params);
		});
		
	});	
	
});