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
		var repaymentAccountNo = self.repaymentAccountNo;	//还款账号
		var loanVariety = self.loanVariety;				//借据品种
		var currencyType = self.currencyType;				//币种
		var loanRate = self.loanRate;						//贷款利率
		var loanPeriod = self.loanPeriod;					//还款周期
		var repaymentPattern = self.repaymentPattern;		//还款方式
		var customerMaster = self.customerMaster;			//客户经理
		var managOrganization = self.managOrganization;	//经办机构
		var shouldRealAmt = self.shouldRealAmt;			//应还未还金额
		var contractAmt = self.contractAmt;				//合同金额
		var loanBalance = self.loanBalance;				//贷款余额
		var returnPrincipal = self.returnPrincipal;		//已还本金
		var returnInterest = self.returnInterest;			//已还利息
		var loanDeliverDate = self.loanDeliverDate;		//贷款开始日
		var loanExpireDate = self.loanExpireDate;			//贷款到期日
		var repaymentDate = self.repaymentDate;			//下次还款日
		var debtIntAmt = self.debtIntAmt;					//欠息金额
		var isCalculated = self.isCalculated;				//是否结清
		
		document.getElementById("loanAccount").innerHTML = loanAccount;
		document.getElementById("repaymentAccountNo").innerHTML = repaymentAccountNo;
		document.getElementById("loanVariety").innerHTML = loanVariety;
		document.getElementById("currencyType").innerHTML = currencyType;
		document.getElementById("loanRate").innerHTML = loanRate + "%";
		document.getElementById("repaymentPattern").innerHTML = repaymentPattern;
		document.getElementById("customerMaster").innerHTML = customerMaster;
		document.getElementById("managOrganization").innerHTML = managOrganization;
		document.getElementById("contractAmt").innerHTML = format.formatMoney(contractAmt, 2) + "元";
		document.getElementById("loanBalance").innerHTML = format.formatMoney(loanBalance, 2) + "元";
		document.getElementById("returnPrincipal").innerHTML = format.formatMoney(returnPrincipal, 2) + "元";
		document.getElementById("returnInterest").innerHTML = format.formatMoney(returnInterest, 2) + "元";
		document.getElementById("loanDeliverDate").innerHTML = format.formatDate(format.parseDate(loanDeliverDate, "yyyy/mm/dd"));
		document.getElementById("loanExpireDate").innerHTML = format.formatDate(format.parseDate(loanExpireDate, "yyyy/mm/dd"));
		document.getElementById("repaymentDate").innerHTML = repaymentDate==""?repaymentDate:(repaymentDate + "日");
		
		var today = new Date().format("yyyyMMdd");
		var endDate = loanExpireDate.replace(/\//ig,'');
		var lixi = debtIntAmt;
		var a = '0';
		if(repaymentPattern=='一次性还本付息条款' || repaymentPattern=='等额本息条款' || repaymentPattern=='等额本金条款' || repaymentPattern=='净息还款条款'){
			a ='1';
		}
		var html = '';
		if(today<endDate && isCalculated=='否' && a=='1' && (lixi=='0' || lixi=='')){
			if((repaymentPattern=='等额本金条款' || repaymentPattern=='等额本息条款')){
				html += '<div class="ove_hid" style="width: 85.5%; margin: 20px auto 10px auto;">';
				html += '<button class="btn_105px but_w" id="back_plan" style="float: left; width: 31.5%; margin-right: 2.6%;">';
				html += '还款计划</button>';
				html += '<button class="btn_105px but_red" id="repay_count" style="float: left; width: 31.5%;">';
				html += '提前还款试算</button>';
				html += '<button class="btn_105px but_red fz_min" id="repay_before" style="float: right; width: 31.5%;">';
				html += '提前还款</button></div>';
				html += '<div class="ove_hid" style="width: 85.5%; margin: 0 auto 20px auto;">';
				html += '<button class="btn_105px but_w" id="repay_change" style=" width: 31.5%;">';
				html += '还款方式变更</button></div>';
			}else{
				html += '<div class="but_m20px btn_height56px">';
				html += '<button class="btn_105px but_w" id="back_plan">';
				html += '还款计划</button>&nbsp;&nbsp;';
				html += '<button class="btn_105px but_red" id="repay_count">';
				html += '提前还款试算</button>&nbsp;&nbsp;';
				html += '<button class="btn_105px but_red fz_min" id="repay_before">';
				html += '提前还款</button></div>';
			}
		}else{
			html += '<div class="but_m20px btn_height56px">';
			html += '<button class="btn_105px but_w" id="back_plan">';
			html += '还款计划</button>&nbsp;&nbsp;';
       	    html += '<button class="btn_105px but_red" id="repay_count">';
       	    html += '提前还款试算</button></div>';
		}
		$("#buttonArea").html(html);
		
		$("#back_plan").click(function(){
			var params = {
				loanAccount : loanAccount,
				noCheck : false
			};
			mbank.openWindowByLoad('repaymentPlanQuery.html','repaymentPlanQuery','slide-in-right',params);
	    });
		
	    $("#repay_count").click(function(){
			var params = {
				loanAccount : loanAccount,
				loanBalance : loanBalance,
				noCheck : false
			};
			mbank.openWindowByLoad('prepaymentTrial.html','prepaymentTrial','slide-in-right',params);
	    });
	    
	    queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack);
			function allAccCallBack(data) {
				iAccountInfoList = data;
			}
		}
		
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
	    
	    $("#repay_change").click(function(){
			var dateTime = new Date();
			var timeStr = dateTime.format("hhmiss");
			if (timeStr > '210000' || timeStr < '090000'){
				mui.alert("请在9:00——21:00时间段内操作！");
				return false;
			}
			var params = {
				loanAccount : loanAccount,
				payAccount : repaymentAccountNo,
				oldLoanType : repaymentPattern,
				noCheck : false
			};
			mbank.openWindowByLoad('loanChangeInput.html','loanChangeInput','slide-in-right',params);
	    });
		
	});
});