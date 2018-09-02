define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	//绑定账号列表
	var iAccountInfoList = [];
	var accountPickerList=[];
    var accountPicker;
	//当前选定账号
	var currentAcct = "";
	var payRate = "";
	var payAmount = "";
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();
		var loanAccount = self.loanAccount;
//		var loanAccount = "P2043062302276145";
		var repaymentAccountNo = self.repaymentAccountNo;
		$("#accountNo").html(repaymentAccountNo);
		myAcctInfo.getAccAmt(repaymentAccountNo,"balance",true);
		var loanBalance = self.loanBalance;
		$("#loanBalance").html(format.formatMoney(loanBalance));
		
		mbank.resizePage(".but_bottom20px");
		
//		queryDefaultAcct();
//		function queryDefaultAcct() {
//			mbank.getAllAccountInfo(allAccCallBack);
//			function allAccCallBack(data) {
//				iAccountInfoList = data;
//				getPickerList(iAccountInfoList);
//				var length = iAccountInfoList.length;
//				if(length > 0) {
//					var accountStat = iAccountInfoList[0].accountStat;
//					if (accountStat != '0' && accountStat != '2') {
//						mui.alert("所选账户状态异常");
//						return false;
//					}
//					currentAcct = iAccountInfoList[0].accountNo;
//					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
//					myAcctInfo.getAccAmt(currentAcct,"balance",true);
//				}
//			}
//		}
		
//		function getPickerList(iAccountInfoList){
//			if( iAccountInfoList.length>0 ){
//				accountPickerList=[];
//				for( var i=0;i<iAccountInfoList.length;i++ ){
//					var account=iAccountInfoList[i];
//					var pickItem={
//						value:i,
//						text:account.accountNo
//					};
//					accountPickerList.push(pickItem);
//				}
//				accountPicker = new mui.PopPicker();
//			    accountPicker.setData(accountPickerList);	
//			}
//		}
		
//		$("#changeAccount").on("tap",function(){
//			accountPicker.show(function(items) {
//				var pickItem = items[0];
//				var accountStat = iAccountInfoList[pickItem.value].accountStat;
//				if (accountStat != '0' && accountStat != '2') {
//					mui.alert("所选账户状态异常");
//					return false;
//				}
//				currentAcct = iAccountInfoList[pickItem.value].accountNo;
//				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
//				myAcctInfo.getAccAmt(currentAcct,"balance",true);
//			});		
//		});
		
		$("#principal").keyup(function() {
			var amount = $("#principal").val();
			if (amount.length > 12) {
				amount = amount.substr(0, 12);
				$("#principal").val(amount);
			}
//			$("#chineseAmt").html(DX(amount));
		});
		
		$("#principal").blur(function() {
			
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
		
		$("#nextButton").click(function(){
//			if (currentAcct == "") {
//				mui.alert("请选择还款账户！");
//	    		return false;
//			}
			var loanApplyAmt = $("#principal").val();
	    	if (loanApplyAmt == "") {
	    		mui.alert("请输入提前还款本金！");
	    		$("#principal").focus();
	    		return false;
	    	}
	    	if (parseFloat(loanBalance) < parseFloat(loanApplyAmt)) {
	    		mui.alert("提前还款金额应该小于等于贷款正常本金！");
	    		$("#principal").focus();
	    		return false;
	    	}
	    	var balance = $('#balance').html();
//	    	var balance = format.removeComma($('#balance').html());//去掉逗号
////	    	var payAmount = format.removeComma($('#payAmount').html());
//	    	if (parseFloat(balance) < parseFloat(payAmount)) {//bug payAmount未赋值
//	    		mui.alert("应还本息应该小于等于可用余额！");
//	    		return false;
//	    	}
//	    	var payRate = format.removeComma($('#payRate').html());
	    	var chineseAmt = DX(loanApplyAmt);
			var today = new Date().format("yyyyMMdd");
			var dataNumber = {
		    	loanAccount : loanAccount,
		    	loanApplyAmt : loanApplyAmt,
		    	repaymentDate : today
		    };
		    var url = mbank.getApiURL() + '005006_loanTiQianHuanKuanCal.do';
		    mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
		    function successCallback(data){
		    	var rcvAmt = data.RcvAmt;							//本息
		    	var shouldBackFuLi = data.shouldBackFuLi;			//利息
		    	payRate = format.formatMoney(shouldBackFuLi, 2);
		    	payAmount = format.formatMoney(rcvAmt, 2);
		    	var params = {
			    	loanAccount : loanAccount,
			    	payAccount : repaymentAccountNo,
			    	payBenJin : loanApplyAmt,
			    	payRate : payRate,
			    	payAmount : payAmount,
			    	chineseAmt : chineseAmt,
			    	balance: balance,//可用余额
			    	noCheck : false
			    };
			    mbank.openWindowByLoad('loanBackCheck.html','loanBackCheck','slide-in-right',params);
			    //		    	var balance = format.removeComma($('#balance').html());
//		    	if (parseFloat(balance) < parseFloat(rcvAmt)) {
//		    		mui.alert("应还本息应该小于等于可用余额！");//增加一个页面 下一步再校验提示
//		    		return false;
//		    	}
//			    mbank.openWindowByLoad('loanBackConfirm.html','loanBackConfirm','slide-in-right',params);
//		    	$('#payRate').html(format.formatMoney(shouldBackFuLi, 2));
//				$('#payAmount').html(format.formatMoney(rcvAmt, 2));
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
//			if($(this).val()){
//				var value = format.formatMoney($(this).val(),2);
//				value = format.ignoreChar(value,',');
//				$(this).val(value);
//			}
		});
		
		$("#resetButton").click(function(){
//			queryDefaultAcct();
			$("#principal").val("");
//			$("#chineseAmt").html("");
//			$("#payRate").html("");
//			$("#payAmount").html("");
		});
		
	});	
	
});