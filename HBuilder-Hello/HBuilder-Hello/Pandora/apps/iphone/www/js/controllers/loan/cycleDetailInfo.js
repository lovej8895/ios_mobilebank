define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var iAccountInfoList = [];
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var loanAccount = self.loanAccount;				//贷款账号
		var repaymentPattern = self.repaymentPattern;		//还款方式
		var loanVariety = self.loanVariety;					//借据品种
		var contractAmt = self.contractAmt;				//合同金额
		var currencyType = self.currencyType;				//币种
		var loanBalance = self.loanBalance;				//贷款余额
		var loanRate = self.loanRate;						//贷款利率
		var returnPrincipal = self.returnPrincipal;		//已还本金
		var loanDeliverDate = self.loanDeliverDate;		//贷款开始日
		var loanExpireDate = self.loanExpireDate;			//贷款到期日
		var customerMaster = self.customerMaster;			//客户经理
		var managOrganization = self.managOrganization;	//经办机构
		var repaymentAccountNo = self.repaymentAccountNo;	//还款账号
		var isCalculated = self.isCalculated;				//是否结清
		
		document.getElementById("loanAccount").innerHTML = loanAccount;
		document.getElementById("repaymentAccountNo").innerHTML = repaymentAccountNo;
		document.getElementById("loanVariety").innerHTML = loanVariety;
		document.getElementById("repaymentPattern").innerHTML = repaymentPattern;
		document.getElementById("currencyType").innerHTML = currencyType;
		document.getElementById("managOrganization").innerHTML = managOrganization;
		document.getElementById("customerMaster").innerHTML = customerMaster;
		document.getElementById("contractAmt").innerHTML = format.formatMoney(contractAmt, 2) + "元";
		document.getElementById("loanBalance").innerHTML = format.formatMoney(loanBalance, 2) + "元";
		document.getElementById("returnPrincipal").innerHTML = format.formatMoney(returnPrincipal, 2) + "元";
		document.getElementById("loanRate").innerHTML = format.formatMoney(loanRate, 2) + "%";
		document.getElementById("loanDeliverDate").innerHTML = format.formatDate(format.parseDate(loanDeliverDate, "yyyy/mm/dd"));
		document.getElementById("loanExpireDate").innerHTML = format.formatDate(format.parseDate(loanExpireDate, "yyyy/mm/dd"));
		
		var curDate = new Date();
		var endDate = format.parseDate(loanExpireDate, "yyyy/mm/dd");
		if (isCalculated == '否' && curDate <= endDate) {
			var html = '<div class="btn_bg_f2">';
			html += '<button class="but_315px but_red" id="repay_before">';
			html += '提前还款</button></div>';
			$("#buttonArea").html(html);
			queryDefaultAcct();
			$("#repay_before").click(function(){
				var a = '0';
				for (var i = 0; i < iAccountInfoList.length; i++) {
					var accountNo = iAccountInfoList[i].accountNo;
					if (accountNo == repaymentAccountNo) {
						a = '1';
					}  
				}
				if (a == '0') {
					mui.alert("请将还款账户下挂到网银/手机银行中再操作！");
					return false;
				}
				var dateTime = new Date();
				var timeStr = dateTime.format("hhmiss");
				if (timeStr > '210000' || timeStr < '090000'){
					mui.alert("请在9:00——21:00时间段内操作！");
					return false;
				}
				var params = {
					loanAccount : loanAccount,
					repaymentAccountNo : repaymentAccountNo,
					loanBalance : loanBalance,
					noCheck : false
				};
				mbank.openWindowByLoad('loanBackInput.html','loanBackInput','slide-in-right',params);
		    });
		}
		
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack);
			function allAccCallBack(data) {
				iAccountInfoList = data;
			}
		}
	});
});