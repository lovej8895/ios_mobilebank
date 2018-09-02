define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('005012',self);
		var loanAccount = self.loanAccount;
		var payAccount =  self.payAccount;
		var oldType = self.oldType;
		var newType = self.newType;
		var effectDate = self.effectDate;
		var effectDateShow = format.formatDate(format.parseDate(effectDate));
		
		$("#oldType").html(oldType);
		$("#newType").html(newType);
		$("#effectDate").html(effectDateShow);
		
		$("#confirmButton").click(function(){
			var dataNumber = {
				loanAccount : loanAccount,
				oldType : oldType,
				newType : newType,
				endDate : effectDate,
				payAccount : payAccount
			};
		    var url = mbank.getApiURL() + '005012_backChangeSubmit.do';
		    commonSecurityUtil.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
		    function successCallback(data){
		    	var params = {
		    		loanAccount : data.loanAccount,
		    		oldType : data.oldType,
		    		newType : data.newType,
		    		effectDate : data.endDate,
		    		noCheck : false
		    	};
				mbank.openWindowByLoad('loanChangeResult.html','loanChangeResult','slide-in-right',params);
		    }
		    function errorCallback(e){
		    	mui.alert(e.em);
		    }
		});
		mbank.resizePage(".but_bottom20px");
		
	});	
	
});