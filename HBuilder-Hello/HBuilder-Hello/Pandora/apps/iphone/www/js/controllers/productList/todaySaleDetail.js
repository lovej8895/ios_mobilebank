define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var accountCardNo = self.accountCardNo;
		var transferFlowNo = self.transferFlowNo;		//交易流水号
		var productNo = self.productNo;					//产品编号
		var productName = self.productName;				//产品名称
		var interestBeginDate = self.interestBeginDate;	//起息日
		var interestEndDate = self.interestEndDate;		//到期日
		var transAmt = self.transAmt;						//购买金额
		var transVol=self.transVol;                     //申请份额
		var transAmtShow = format.formatMoney(transAmt, 2);
		var transVolShow = format.formatMoney(transVol, 2);
		var transType = self.transType;					//交易类型
		var transTypeShow = parseTransType(transType);
		var channelType = self.channelType;				//交易渠道
		var channelTypeShow = parseChannelType(channelType);
		var currencyType = self.currencyType;				//币种
		var interestBeginDateShow = format.formatDate(format.parseDate(interestBeginDate, "yyyymmdd"));
		var interestEndDateShow = format.formatDate(format.parseDate(interestEndDate, "yyyymmdd"));
		var orderFlowNo = "";
		
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
		
		document.getElementById("transferFlowNo").innerHTML = transferFlowNo;
		document.getElementById("accountCardNo").innerHTML = accountCardNo;
		document.getElementById("productNo").innerHTML = productNo;
		document.getElementById("productName").innerHTML = productName;
		document.getElementById("interestBeginDate").innerHTML = interestBeginDateShow;
		document.getElementById("interestEndDate").innerHTML = interestEndDateShow;
		//赎回交易
		if(transType =='124'){
			document.getElementById("transVol").innerHTML = transVolShow + "元";
			document.getElementById("transVolLi").style.display='block';
			document.getElementById("transAmtLi").style.display='none';
		}else{
			document.getElementById("transAmt").innerHTML = transAmtShow + "元";
			document.getElementById("transAmtLi").style.display='block';
			document.getElementById("transVolLi").style.display='none';
		}
		document.getElementById("transAmt").innerHTML = transAmtShow + "元";
		document.getElementById("transType").innerHTML = transTypeShow;
		document.getElementById("channelType").innerHTML = channelTypeShow;
		document.getElementById("currencyType").innerHTML = "人民币";
		
		function parseTransType(transType) {
			switch (transType) {
				case  "121" : return "预约认购";
				case  "130" : return "产品认购";
				case  "122" : return "产品申购";
				case  "124" : return "产品赎回";
				case  "125" : return "预约赎回";
				case  "126" : return "预约赎回变更";
				case  "127" : return "预约申购变更";
				case  "128" : return "预约申购";
				case  "152" : return "交易撤单";
				case  "144" : return "收益下发";
				case  "150" : return "产品终止";
				default : return "";
			}
		}
		
		function parseChannelType(channelType) {
			switch (channelType) {
				case  "1" : return "银行柜台";
				case  "2" : return "网银";
				case  "3" : return "手机银行";
				default : return "";
			}
		}
		
		$("#nextButton").click(function(){
			mui.confirm("您确认要撤单吗？","提示",["确定", "取消"],function(e) {
				if (e.index == 0) {
					var dataNumber = {
						accountCardNo : accountCardNo,
						productNo : productNo,
						productName : productName,
						currencyType : currencyType,
						interestBeginDate : interestBeginDate,
						interestEndDate : interestEndDate,
						transAmt : transAmt,
						transferFlowNo : transferFlowNo,
						orderFlowNo : orderFlowNo
					};
				    var url = mbank.getApiURL()+'009007_dropsale_submit.do';
				    mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
				    function successCallback(data){
				    	var params = {
				    		noCheck:false
				    	};
						mbank.openWindowByLoad('todaySaleResult.html','todaySaleResult','slide-in-right',params);
				    }
				    function errorCallback(e){
				    	mui.alert(e.em);
				    }
				}
			});
	    });
		
	});
});