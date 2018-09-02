define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var nativeUI = require('../../core/nativeUI');
	//返回交易状态--00申请,03交易成功，04交易失败
	var tdcStatus = "";
	//返回交易时间
	var transferTime = "";
	//返回实际交易金额
	var actualTxnAmt = "";
	//返回交易凭证号
	var voucherNum = "";
	//返回订单号
	var orderNo = "";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var lifeHome = plus.webview.getWebviewById("life");

		transactionNoticeQuery();

		//查询银联交易通知
		function transactionNoticeQuery() {
			plus.nativeUI.showWaiting("正在返回转账通知...");
			var url = mbank.getApiURL() + 'transactionNoticeQuery.do';
			mbank.apiSend('post', url, {
				//上送报文及插入数据准备
				//交易序列号
				txnNo: self.txnNo,

				//手机标识
				mbUUID: self.mbUUID,
				//操作类型(1 - 主扫、2 - 被扫、3 - 付款、4 - 收款)
				operationType: '3',
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
				//返回交易状态--00申请,03交易成功，04交易失败
				tdcStatus = data.tdcStatus;
				//返回交易时间
				transferTime = data.sysDate;
				//返回实际交易金额
				actualTxnAmt = parseFloat(data.txnAmt) / 100;
				//返回交易凭证号
				voucherNum = data.voucherNum;
				//返回订单号
				orderNo = data.orderNo;

				var accFourNo = self.accNo;
				if(accFourNo != "" && accFourNo != null && accFourNo.length > 4) {
					accFourNo = accFourNo.substring(accFourNo.length - 4, accFourNo.length);
				}

				if(tdcStatus == "03") {
					$("#showDetail").show();
					var strResult = "已成功使用湖北银行借记卡(" + accFourNo + ")付款" + '<span class="fz_22 color_red">¥' + format.formatMoney(actualTxnAmt) + '</span>';
					$("#payResult").html(strResult);
				} else if(tdcStatus == "04") {
					$("#noShowDetail").show();
					$("#msg").text("付款失败");
				} else {
					$("#noShowDetail").show();
					$("#msg").text("暂时无法获知付款结果");
					$("#tip").text("请稍候在消费记录中查看该笔交易");
				}
				if(lifeHome) {
					mui.fire(lifeHome, "refreshQRCodePay", {});
				}
			}

			function errorCallback(data) {
				plus.nativeUI.closeWaiting();
				$("#noShowDetail").show();
				$("#msg").text("付款失败");
			}
		}

		//查看详情
		$("#queryDetail").click(function() {
			var params = {
				"ordFlag": '02',
				"payAccNo": self.payAccNo,
				"merName": self.recAccName,
				"txnAmt": actualTxnAmt,
				"transResult": tdcStatus,
				"commodityType": self.discountItemType,
				"commodityInformation": self.discountItemName,
				"preferentialAmt": self.discountOffsetAmt,
				"accNo": self.recAccNo,
				"transferTime": transferTime,
				"transferFlowNo": voucherNum,
				"merOrderNo": self.orderNo,
				"recPayComments": self.description,
				"lifeFlag": ""
			};
			mbank.openWindowByLoad("../qrcodePay/consumingDetails.html", "consumingDetails", "slide-in-right", params);
		});

		//完成
		$("#backBtn").click(function() {
			mui.back();
		});

		mui.back = function() {
			if(plus.webview.getWebviewById("scannedQRc2c")) {
				plus.webview.close(plus.webview.getWebviewById("scannedQRc2c"));
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