define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var finanChll = self.finanChll;					//交易渠道
		var finanCordNo = self.finanCordNo;				//银行卡号
		var finanBusiCode = self.finanBusiCode;			//交易类型
		var finanProdCode = self.finanProdCode;			//产品代码
		var finanProdName = self.finanProdName;			//产品名称  
		var finanTransferDate = self.finanTransferDate;	//交易日期
		var finanTransferAmt = self.finanTransferAmt;		//交易金额
		var transVol=self.transVol;		                    //申请份额
		var finanTransferAmtShow = format.formatMoney(finanTransferAmt, 2);
		var finanMsg = self.finanMsg;						//交易信息
		var finanTransferDateShow = format.formatDate(format.parseDate(finanTransferDate, "yyyymmdd"));
		var finanChllShow = parseFinanChll(finanChll);
		var finanBusiCodeShow = parseBusiCode(finanBusiCode);
		
		document.getElementById("finanChll").innerHTML = finanChllShow;
		document.getElementById("finanCordNo").innerHTML = finanCordNo;
		document.getElementById("finanBusiCode").innerHTML = finanBusiCodeShow;
		document.getElementById("finanProdCode").innerHTML = finanProdCode;
		document.getElementById("finanProdName").innerHTML = finanProdName;
		document.getElementById("finanTransferDate").innerHTML = finanTransferDateShow;
		if(finanBusiCode == '124' || finanBusiCode == '135'){
			document.getElementById("transVol").innerHTML = transVol;
			document.getElementById("transVolLi").style.display='block';
			document.getElementById("finanTransferAmtLi").style.display='block';
			document.getElementById("finanTransferAmt").innerHTML = finanTransferAmtShow + "元";
			document.getElementById("transVolTitle").innerHTML = "申请份额";
		}else if(finanBusiCode == '130' || finanBusiCode == '122') {
			document.getElementById("finanTransferAmt").innerHTML = finanTransferAmtShow + "元";
			document.getElementById("transVolLi").style.display='none';
			document.getElementById("finanTransferAmtLi").style.display='block';
		}else if(finanBusiCode == '152'){
			document.getElementById("transVolLi").style.display='block';
			document.getElementById("finanTransferAmtLi").style.display='none';
			if(parseFloat(finanTransferAmtShow) == 0){
				document.getElementById("transVol").innerHTML=format.formatMoney(transVol, 2) + "元";
			}else{
				document.getElementById("transVol").innerHTML = finanTransferAmtShow + "元";
			}
		}else{
			document.getElementById("transVolLi").style.display='none';
			document.getElementById("finanTransferAmtLi").style.display='block';
			document.getElementById("finanTransferAmt").innerHTML = finanTransferAmtShow + "元";
		}
		
		document.getElementById("finanMsg").innerHTML = finanMsg;
		
		function parseFinanChll(finanChll) {
			switch (finanChll) {
				case  "1" : return "银行柜台";
				case  "2" : return "网银";
				case  "3" : return "手机银行";
				default : return "-";
			}
		}
		
		function parseBusiCode(finanBusiCode) {
			switch (finanBusiCode) {
				case  "121" : return "预约认购";
				case  "130" : return "产品认购";
				case  "122" : return "产品申购";
				case  "124" : return "产品赎回";
				case  "125" : return "预约赎回";
				case  "128" : return "预约申购";
				case  "144" : return "红利下发";
				case  "150" : return "产品终止";
				case  "135" : return "快速赎回";
				case  "152" : return "交易撤单";
				default : return "";
			}
		}
		
	});
});