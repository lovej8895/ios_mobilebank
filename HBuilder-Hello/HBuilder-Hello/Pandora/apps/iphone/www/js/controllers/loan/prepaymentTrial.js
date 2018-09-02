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
		var loanBalance = self.loanBalance;
		var currentDate = new Date();
		var planDate = format.formatDate(currentDate);
		$("#planDate").html(planDate);
		
		mbank.resizePage(".but_bottom20px");
		
		$("#principal").keyup(function() {
			var amount = $("#principal").val();
			if (amount.length > 12) {
				amount = amount.substr(0, 12);
				$("#principal").val(amount);
			}
			$("#chineseAmt").html(DX(amount));
		});
		
		//金额小写转大写
		DX = function(num) {
			var strOutput = "";
			var strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
			num += "00";
			var intPos = num.indexOf(".");
			if (intPos >= 0) {
				num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
			}
			strUnit = strUnit.substr(strUnit.length - num.length);
			for (var i = 0; i < num.length; i++) {
				strOutput += '零壹贰叁肆伍陆柒捌玖'.charAt(num.charAt(i)) + strUnit.charAt(i);
			}
			return strOutput.replace(/零(仟|佰|拾|角)/g, '零').
			replace(/(零)+/g, '零').
			replace(/零(万|亿|元)/g, '$1').
			replace(/(亿)万|壹(拾)/g, '$1$2').
			replace(/^元零?|零分/g, '').
			replace(/元$/g, '元整');
		}
		
		//选择计划还款日
//		var changePlanDate = document.getElementById('changePlanDate');
//		changePlanDate.addEventListener('tap', function(event) {
//			plus.nativeUI.pickDate( function(e){
//				var dStr = format.formatDate(e.date);
//				$("#planDate").html(dStr);
//			});
//		}, false);
		
		$("#trialButton").click(function(){
			var loanApplyAmt = $("#principal").val();
	    	if ( "" == loanApplyAmt ) {
	    		mui.alert("请输入提前还款本金！");
	    		$("#principal").focus();
	    		return false;
	    	}
	    	if (parseFloat(loanBalance) < parseFloat(loanApplyAmt)) {
	    		mui.alert("提前还款金额不能大于贷款正常本金！");
	    		$("#principal").focus();
	    		return false;
	    	}
	    	var repaymentDate = $("#planDate").html().replaceAll("-", "");
		    var dataNumber = {
		    	loanAccount : loanAccount,
		    	loanApplyAmt : loanApplyAmt,
		    	repaymentDate : repaymentDate
		    };
		    var url = mbank.getApiURL() + '005006_loanTiQianHuanKuanCal.do';
		    mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
		    function successCallback(data){
		    	var rcvAmt = data.RcvAmt;							//本期应付本息和
		    	var shouldBackFuLi = data.shouldBackFuLi;			//本期应付利息
		    	var shouldBackAmount = data.shouldBackAmount;		//下期应还本息和
		    	var shouldBackPrincipal = data.shouldBackPrincipal;	//下期应还本金
		    	var shouldBackInterest = data.shouldBackInterest;	//下期应还利息
		    	var params = {
		    		rcvAmt : rcvAmt,
		    		shouldBackFuLi : shouldBackFuLi,
		    		shouldBackAmount : shouldBackAmount,
		    		shouldBackPrincipal : shouldBackPrincipal,
		    		shouldBackInterest : shouldBackInterest,
		    		noCheck : false
		    	};
				mbank.openWindowByLoad('prepaymentTrialResult.html','prepaymentTrialResult','slide-in-right',params);
		    }
		    function errorCallback(e){
		    	mui.alert(e.em);
		    }
		});
		
		$("#principal").on("focus",function(){
		    $(this).attr('type', 'number');
		});
		
		$("#principal").on("blur",function(){
			$(this).attr('type', 'text');
		});
		
		$("#resetButton").click(function(){
			$("#principal").val("");
			$("#chineseAmt").html("");
			$("#planDate").html(planDate);
		});
		
	});	
	
});