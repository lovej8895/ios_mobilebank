define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');

	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var params = plus.webview.currentWebview();
		
		//订单类型
		var ordFlag = params.ordFlag;
		
		if (ordFlag == '02') {
			$("#c2cPNG").show();
		} else{
			$("#merPNG").show();
		}
		
		//付款账号
		var payAccNo = params.payAccNo;
		if(payAccNo != null && payAccNo != "" && payAccNo.length > 4) {
			payAccNo = "湖北银行" + "&nbsp;&nbsp;储蓄卡&nbsp;&nbsp;(" + payAccNo.substring(payAccNo.length - 4, payAccNo.length) + ")";
		} else{
			payAccNo = "湖北银行&nbsp;&nbsp;储蓄卡";
		}

		//商户名称-收款人名称
		var merName = params.merName;

		//交易金额-转账金额
		var transAmt = params.txnAmt;
		if(transAmt != null && transAmt != "") {
			transAmt = "-" + format.formatMoney(transAmt);
		}

		//交易结果
		var transStt = params.transResult;
		transStt = ((transStt == "90") || (transStt == "03")) ? "交易成功" : "交易失败";

		//优惠类型
		var commodityType = params.commodityType;
		if(commodityType != null && commodityType != "") {
			commodityType = jQuery.param.getDisplay("COMMODITY_TYPE", commodityType);
		}

		//优惠活动简称
		var commodityInformation = params.commodityInformation;

		//优惠金额
		var offsAmt = params.preferentialAmt;

		//付款账号-收款账号
		var recPayAccNo = params.accNo;
		if(recPayAccNo != null && recPayAccNo != "" && recPayAccNo.length > 0) {
			if (ordFlag == '02') {
				recPayAccNo = format.dealAccountHideFour(recPayAccNo);
			} else{
				recPayAccNo = "湖北银行" + "(" + recPayAccNo.substring(recPayAccNo.length - 4, recPayAccNo.length) + ")";
			}
		}

		//交易时间
		var createTime = params.transferTime;
		if (createTime != null && createTime != "") {
			createTime = format.formatDateTime(createTime);
		}

		//交易号
		var transNo = params.transferFlowNo;

		//订单号
		var orderNo = params.merOrderNo;
		
		//收付款方附言
		var recPayComments = params.recPayComments;
		if (recPayComments == null || recPayComments == "") {
			recPayComments = "付款";
		}
		

		//信息反显
		$("#merNameID").html(merName);
		$("#transAmtID").html(transAmt);
		$("#transSttID").html(transStt);
		
		if(offsAmt != null && offsAmt != "" && offsAmt != 0 && commodityInformation != null && commodityInformation != "" && commodityType != null && commodityType != "") {
			commodityInformation = commodityInformation.concat("，").concat(commodityType);
			offsAmt = "-" + format.formatMoney(offsAmt);
			$("#offstAmtLI").show();
			$("#commodityNameID").html(commodityInformation);
			$("#offstAmtID").html(offsAmt);
		} else {
			$("#commodityNameID").empty();
			$("#offstAmtID").empty();
			$("#offstAmtLI").hide();
		}
		
		
		if (ordFlag == '02') {
			$("#payMethodID").html(payAccNo);
			$("#transExplainLI").show();
			$("#transExplainID").html(recPayComments);
			$("#opposingAccLI").show();
			$("#opposingAccID").html(recPayAccNo);
		} else{
			$("#payMethodID").html(recPayAccNo);
			$("#transExplainID").empty();
			$("#transExplainLI").hide();
			$("#opposingAccID").empty();
			$("#opposingAccLI").hide();
		}
		
		$("#creationTimeID").html(createTime);
		if(transNo != null && transNo != "") {
			$("#transNoLI").show();
			$("#transNoID").html(transNo);
		} else {
			$("#transNoID").empty();
			$("#transNoLI").hide();
		}
		$("#merOrderNoID").html(orderNo);

		//返回时派发事件至生活首页，重新查询最近消费-收款记录
		var lifeFlag = params.lifeFlag;
		if(lifeFlag != null && lifeFlag != "") {
			var lifeHome = plus.webview.getWebviewById("life");
			if(lifeHome) {
				mui.fire(lifeHome, "refreshQRCodePay", {});
			}
		}
	});
});