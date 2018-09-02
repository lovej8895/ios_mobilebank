define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var accountNo = self.accountNo;
		var productNo = self.productNo;					//产品编号
		var productName = self.productName;				//产品名称
		var currencyType = self.currencyType;				//币种
		var transferSum = self.transferSum;				//持有金额
		var finanTransferVol = self.finanTransferVol;		//持有份额
		var interestBeginDate = self.interestBeginDate;	//起息日
		var interestEndDate = self.interestEndDate;		//到期日
		var yieldRate = self.yieldRate;					//预期收益率
		var interestBeginDateShow = format.formatDate(format.parseDate(interestBeginDate, "yyyymmdd"));
		var interestEndDateShow = format.formatDate(format.parseDate(interestEndDate, "yyyymmdd"));
		var status = self.status;							//交易状态
		var flag = self.flag;								//标志
		//赎回接口暂时禁用
//		var html='<button class="but_150px but_red but_d10px" id="">追&nbsp;&nbsp;加</button>&nbsp;&nbsp';
//		if (flag == '1') {
//			html+='<button class="but_150px but_red but_d10px" id="redem">赎&nbsp;&nbsp;回</button>&nbsp;&nbsp';
//		}
//		$("#buttonArea").html(html);
		document.getElementById("productNo").innerHTML = productNo;
		document.getElementById("productName").innerHTML = productName;
		document.getElementById("interestBeginDate").innerHTML = interestBeginDateShow;
		document.getElementById("interestEndDate").innerHTML = interestEndDateShow;
		document.getElementById("finanTransferVol").innerHTML = format.formatMoney(finanTransferVol, 2) + "份";
		document.getElementById("transferSum").innerHTML = format.formatMoney(transferSum, 2) + "元";
		document.getElementById("yieldRate").innerHTML = yieldRate + "%";
		document.getElementById("currencyType").innerHTML = "人民币";
		
		$("#redem").click(function(){
			var params = {
				accountNo : accountNo,
				productNo : productNo,
				productName : productName,
				finanTransferVol : finanTransferVol,
				noCheck : false,
				flag:'0'
			};
			mbank.openWindowByLoad('productRedemInput.html','productRedemInput','slide-in-right',params);
	    });
	    	$("#productInfo").click(function(){
			var params = {
				productNo : productNo,
			};
			mbank.openWindowByLoad('productInfo.html','productInfo','slide-in-right',params);
	    });
		
	});
});