define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');

	//商户名称
	var merName = '';
	//交易金额
	var txnAmt = '';
	//交易状态--00申请,03交易成功，04交易失败
	var tdcStatus = '';
	//优惠类型
	var type = '';
	//优惠简称
	var desc = '';
	//优惠金额
	var offstAmt = '';
	//交易日期
	var transferTime = '';
	//交易号(即付款凭证号)
	var voucherNum = '';
	//订单号
	var orderNo = '';
	//交易流水号
	var txnNo = '';
	//返回实际支付金额
	var offsTxnAmt = '';
	//初始金额
	var origAmt = '';

	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var lifeHome = plus.webview.getWebviewById("life");

		var toPayFlag = self.toPayFlag; //扫码付款标识
		var scannedPayFlag = self.scannedPayFlag; //被扫结果标识
		if (scannedPayFlag != null && scannedPayFlag != "") {
			tdcStatus = self.tdcStatus;
		}

		if(toPayFlag == "1") {
			transactionNoticeQuery();
		} else if(scannedPayFlag == '1') {
			if(tdcStatus == "03") {
				merName = self.merName;
				txnAmt = self.txnAmt;//优惠后金额
				tdcStatus = self.tdcStatus;
				type = self.type;
				desc = self.desc;
				offstAmt = self.offstAmt;//优惠金额
				transferTime = self.transferTime;
				voucherNum = self.voucherNum;
				orderNo = self.orderNo;
				origAmt = self.origTxnAmt;//初始交易金额
				
				$("#showDetail").show();
				$("#txnAmt").html(format.formatMoney(txnAmt));
				$("#accountNo").html(format.dealAccountHideFour(self.accountNo));
				if(offstAmt > 0 && offstAmt != null && offstAmt != "") {
					$("#originAmt").html("原价" + format.formatMoney(origAmt) + "元"); //原金额
				}
				$("#merName").html("向" + self.merName + "商户支付成功");
				$("#accType").html("(借记卡)");
			} else {
				$("#noShowDetail").show();
				$("#msg").text("支付失败");
			}
			if(lifeHome) {
				mui.fire(lifeHome, "refreshQRCodePay", {});
			}
		} else {
			showQrcodeStatus();
		}

		//主扫轮询获取银联交易通知
		function transactionNoticeQuery() {
			plus.nativeUI.showWaiting("正在返回交易通知...");
			var url = mbank.getApiURL() + 'transactionNoticeQuery.do';
			mbank.apiSend('post', url, {
				//上送报文及插入数据准备
				//交易序列号
				txnNo: self.txnNo,

				//手机标识
				mbUUID: self.mbUUID,
				//操作类型(1 - 主扫、2 - 被扫、3 - 付款、4 - 收款)
				operationType: '1',
				//付款方账号
				payAccNo: self.payAccNo,
				//付款账户名称
				payAccName: self.payAccName,
				//付款账户银行信息
				payAccBankInfo: self.payAccBankInfo,
				//交易金额
				transferAmt: self.transferAmt,
				//币种
				currencyCode: self.currencyCode,
				//收款方账号
				recAccNo: self.recAccNo,
				//收款账户名称
				recAccName: self.recAccName,
				//收款账户银行信息
				recAccBankInfo: self.recAccBankInfo,
				//商户代码
				merID: self.merID,
				//商户类别
				merCatCode: self.merCatCode,
				//商户名称
				merName: self.merName,
				//订单号
				orderNo: self.orderNo,
				//订单时间
				orderTime: self.orderTime,
				//原订单金额
				originalOrderAmt: self.originalOrderAmt,
				//凭证号
				tranVoucherNo: self.tranVoucherNo,
				//优惠项目类型
				discountItemType: self.discountItemType,
				//优惠抵消交易金额
				discountOffsetAmt: self.discountOffsetAmt,
				//优惠项目编号
				discountItemNo: self.discountItemNo,
				//优惠项目简称
				discountItemName: self.discountItemName,
				//清算流水号
				settleKey: self.settleKey,
				//清算日期
				settleDate: self.settleDate,
				//付款方附言
				description: self.description

			}, successCallback, errorCallback, false);

			function successCallback(data) {
				plus.nativeUI.closeWaiting();
				//返回轮询次数
				console.log(data.executeTimes);
				//交易状态
				tdcStatus = data.tdcStatus;
				transferTime = data.sysDate;
				//返回实际支付金额
				offsTxnAmt = parseFloat(data.txnAmt) / 100;
				//优惠金额
				offstAmt = parseFloat(self.offstAmt) / 100; 
				//初始交易金额
				origAmt = parseFloat(self.origTxnAmt) / 100; 
				//付款凭证号
				voucherNum = data.voucherNum;
				//订单号
				orderNo = data.orderNo;
				
				if(tdcStatus == "03") {
					$("#showDetail").show();
					$("#txnAmt").html(format.formatMoney(offsTxnAmt));
					$("#accountNo").html(format.dealAccountHideFour(self.accNo));
					if(offstAmt > 0 && offstAmt != null && offstAmt != "") {
						$("#originAmt").html("原价" + format.formatMoney(origAmt) + "元"); //原金额
					}
					$("#merName").html("向" + self.merName + "商户支付成功");
					$("#accType").html("(借记卡)");
				} else if(tdcStatus == "04") {
					$("#noShowDetail").show();
					$("#msg").text("支付失败");
				} else {
					$("#noShowDetail").show();
					$("#msg").text("暂时无法获知支付结果");
					$("#tip").text("请稍候在消费记录中查看该笔交易");
				}
				if(lifeHome) {
					mui.fire(lifeHome, "refreshQRCodePay", {});
				}
			}

			function errorCallback(data) {
				plus.nativeUI.closeWaiting();
				$("#noShowDetail").show();
				$("#msg").text("支付失败");
			}
		}

		//被扫轮询查询二维码状态
		function showQrcodeStatus() {
			plus.nativeUI.showWaiting("正在返回支付结果...");
			var url = mbank.getApiURL() + 'queryQrcodeStatus.do';
			var param = {
				qrNo: self.qrNo,
				reqReserved: self.reqReserved,
				balance: self.balance,
				deviceID: plus.device.uuid,
				name: localStorage.getItem("session_customerNameCN"), //客户中文名称
				payerBankInfo: "湖北银行",
				accNo: self.accountNo
			}
			mbank.apiSend('post', url, param, queryQrcodeStatusSuccess, queryQrcodeStatusError, false);

			function queryQrcodeStatusSuccess(data) {
				plus.nativeUI.closeWaiting();
				merName = data.merName;
				txnAmt = data.txnAmt; //优惠后金额
				tdcStatus = data.tdcStatus;
				type = data.type;
				desc = data.desc;
				offstAmt = data.offstAmt;//优惠金额
				transferTime = data.sysDate;
				voucherNum = data.voucherNum;
				orderNo = data.orderNo;
				txnNo = data.orderFlowNo;
				origAmt = data.origTxnAmt; //初始交易金额
				
				if(tdcStatus == '03') {
					$("#showDetail").show();
					$("#txnAmt").html(format.formatMoney(txnAmt));
					$("#accountNo").html(format.dealAccountHideFour(self.accountNo));
					if(offstAmt > 0 && offstAmt != null && offstAmt != "") {
						$("#originAmt").html("原价" + format.formatMoney(origAmt) + "元"); //原金额
					}
					$("#merName").html("向" + merName + "商户支付成功");
					$("#accType").html("(借记卡)");
				} else if(tdcStatus == '04') {
					$("#noShowDetail").show();
					$("#msg").text("支付失败");
					return;
				} else {
					$("#noShowDetail").show();
					$("#msg").text("暂时无法获知支付结果");
					$("#tip").text("请稍候在消费记录中查看该笔交易");
				}
				if(lifeHome) {
					mui.fire(lifeHome, "refreshQRCodePay", {});
				}
			}

			function queryQrcodeStatusError(data) {
				plus.nativeUI.closeWaiting();
				$("#noShowDetail").show();
				$("#msg").text("支付失败");
			}
		}

		//查看详情
		$("#detailBtn").click(function() {
			var params;
			if(toPayFlag == "1") {
				params = {
					"ordFlag": '00',
					"payAccNo": '',
					"merName": self.merName,
					"txnAmt": offsTxnAmt,
					"transResult": tdcStatus,
					"commodityType": self.discountItemType,
					"commodityInformation": self.discountItemName,
					"preferentialAmt": offstAmt, //优惠金额
					"accNo": self.payAccNo,
					"transferTime": transferTime,
					"transferFlowNo": voucherNum,
					"merOrderNo": self.orderNo,
					"recPayComments": self.description,
					"lifeFlag": ""
				};
			} else {
				params = {
					"ordFlag": '01',
					"payAccNo": '',
					"merName": merName,
					"txnAmt": txnAmt,
					"transResult": tdcStatus,
					"commodityType": type,
					"commodityInformation": desc,
					"preferentialAmt": offstAmt, //优惠金额
					"accNo": self.accountNo,
					"transferTime": transferTime,
					"transferFlowNo": voucherNum,
					"merOrderNo": orderNo,
					"recPayComments": '',
					"lifeFlag": ""
				};
			}
			mbank.openWindowByLoad("../qrcodePay/consumingDetails.html", "consumingDetails", "slide-in-right", params);
		});

		//完成
		$("#backBtn").click(function() {
			mui.back();
		});

		mui.back = function() {

			if(plus.webview.getWebviewById("scannedQRCode")) {
				plus.webview.close(plus.webview.getWebviewById("scannedQRCode"));
			}
			if(plus.webview.getWebviewById("barcode_scan")) {
				plus.webview.close(plus.webview.getWebviewById("barcode_scan"));
			}
			if(plus.webview.getWebviewById("sumQRcode")) {
				plus.webview.close(plus.webview.getWebviewById("sumQRcode"));
			}
			if(plus.webview.getWebviewById("qr_password")) {
				plus.webview.close(plus.webview.getWebviewById("qr_password"));
			}
			plus.webview.close(self);
		}
	});
});