define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');

	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var params = plus.webview.currentWebview();
		
		//收款账号
		var recAccNo = params.recAccNo;
		if(recAccNo != null && recAccNo != "" && recAccNo.length > 4) {
			recAccNo = "湖北银行" + "&nbsp;&nbsp;储蓄卡&nbsp;&nbsp;(" + recAccNo.substring(recAccNo.length - 4, recAccNo.length) + ")";
		} else{
			recAccNo = "湖北银行&nbsp;&nbsp;储蓄卡";
		}
		
		//付款人名称
		var merName = params.merName;

		//转账金额
		var transAmt = params.txnAmt;
		if(transAmt != null && transAmt != "") {
			transAmt = "+" + format.formatMoney(transAmt);
		}

		//交易结果
		var transStt = params.transResult;
		transStt = ((transStt == "90") || (transStt == "03")) ? "交易成功" : "交易失败";

		//付款账号
		var payAccNo = params.payAccNo;
		if(payAccNo != null && payAccNo != "" && payAccNo.length > 0) {
			payAccNo = format.dealAccountHideFour(payAccNo);
		}

		//交易时间
		var createTime = params.transferTime;
		createTime = format.formatDateTime(createTime);

		//交易号
		var transNo = params.transferFlowNo;

		//订单号
		var orderNo = params.merOrderNo;
		
		//收付款方附言
		var remark = params.remark;
		

		//信息反显
		$("#merNameID").html(merName);
		$("#transAmtID").html(transAmt);
		$("#transSttID").html(transStt);
		$("#recMethodID").html(recAccNo);
		
		if (remark != null && remark != "") {
			$("#transExplainID").html(remark);
		} else{
			$("#transExplainID").html("收款");
		}
		
		$("#opposingAccID").html(payAccNo);
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