define(function(require, exports, module) {
	var passwordUtil = require('../../core/passwordUtil');
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var lengthp = 0;
	var passwordEncrypted1 = '';
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();

		var txnAmt = parseFloat(self.txnAmt) / 100;
		var offstAmt = self.offstAmt;
		var origTxAmt = parseFloat(self.origTxnAmt) / 100;
		
		//订单类型
		var orderType = self.orderType;
		if("31" == orderType) {
			$("#validTitle").text("转账");
			$("#validAmtName").text("转账金额(元)");
			$("#submitBtn").text("确认转账");
		} else {
			$("#validTitle").text("支付");
			$("#validAmtName").text("支付金额(元)");
			$("#submitBtn").text("确认付款");
		}

		var toPayFlag = self.toPayFlag; //扫码付款标识
		if(toPayFlag == "1") {
			$("#txnAmt").html(format.formatMoney(txnAmt)); //原金额
			$("#originAmt").hide();
		} else {
			$("#txnAmt").html(format.formatMoney(txnAmt));
			if(offstAmt > 0 && offstAmt != null && offstAmt != "") {
				$("#originAmt").html("原价" + format.formatMoney(origTxAmt) + "元");
			}
		}

		var pwd1 = document.getElementById('password_1');
		pwd1.readOnly = "readOnly";

		pwd1.addEventListener('click', function() {
			//开启纯数字密码键盘
			passwordUtil.openNumKeyboard('password_1', successCallback1, null);

		}, false);

		function successCallback1(retObj) {
			if(document.getElementById('password_1')) {
				document.getElementById('password_1').value = retObj.inputText;
			}
			if(document.getElementById('_password_1')) {
				document.getElementById('_password_1').value = retObj.cipherText;
			}
			var inputLength = retObj.inputText.length;
			if(lengthp < inputLength) {
				$("#pwd" + inputLength).html("<span></span>");
			} else if(lengthp > inputLength) {
				$("#pwd" + lengthp).html("");
			}
			lengthp = inputLength;
			if($("#pwd2").html() != '') {
				$("#pwd1").html("<span></span>");
			}
		}

		//点击确认付款按钮
		$("#submitBtn").click(function() {
			if(!passwordUtil.checkMatch('password_1')) {
				mui.alert('请输入合法账户密码');
				return false;
			}
			var accountPassword = jQuery('#password_1').val();
			if(!accountPassword) {
				mui.alert('账户密码不能为空');
				return false;
			}
			passwordEncrypted1 = document.getElementById("_password_1").value;
			if(passwordEncrypted1 == "" || passwordEncrypted1 == null) {
				mui.alert("请输入密码");
				return;
			}

			if(toPayFlag == "1") {
				checkedPayPassword(); //先验密码再支付
			} else {
				var url = mbank.getApiURL() + 'addictResultNotice.do';
				mbank.apiSend('post', url, {
					qrNo: self.qrNo,
					reqReserved: self.reqReserved,
					voucherNum: self.voucherNum,
					upReserved: self.upReserved,
					cardAttr: self.cardAttr,
					accNo: self.accountNo,
					acctClass: self.acctClass,
					issCode: self.issCode,
					deviceID: plus.device.uuid, //设备标识
					deviceType: '1',
					accountIdHash: self.accountIdHash, //应用提供方账户ID
					txnAmt: txnAmt,
					accountPassword: passwordEncrypted1
				}, addictResultNoticeSuccess, addictResultNoticeError, false);

				function addictResultNoticeSuccess(data) {
					if(data.ec == '000') {
						var params = {
							"qrNo": self.qrNo,
							"reqReserved": self.reqReserved,
							"balance": self.balance,
							"accountNo": self.accountNo,
							"toPayFlag": self.toPayFlag,
							"scannedPayFlag": self.scannedPayFlag
						};
						mbank.openWindowByLoad("../qrcodePay/sumQRcode_end.html", "sumQRcode_end", "slide-in-right", params);
					} else {
						mui.alert("交易失败："+data.em,"温馨提示","确认",function(){
							    var index = plus.webview.getLaunchWebview();
								var life = plus.webview.getWebviewById('life');
								plus.webview.hide(index.id);
								plus.webview.hide(life.id);
								plus.webview.show(index.id);
								plus.webview.show(life.id);
							});
					}
				}

				function addictResultNoticeError(data) {
					mui.alert(data.em,"温馨提示","确认",function(){
							    var index = plus.webview.getLaunchWebview();
								var life = plus.webview.getWebviewById('life');
								plus.webview.hide(index.id);
								plus.webview.hide(life.id);
								plus.webview.show(index.id);
								plus.webview.show(life.id);
					});
				}
			}

		});

		//校验卡交易密码
		function checkedPayPassword() {
			var params = {
				txnAmt: self.txnAmt, //
				accountPassword: passwordEncrypted1,
				accNo: self.accNo //付款账号(子域)
			}
			var url = mbank.getApiURL() + 'checkedPayPassword.do';
			mbank.apiSend('post', url, params, successCallback, errorCallback, true);

			function successCallback(data) {
				toPayOrder(); //支付
			}

			function errorCallback(data) {
				mui.alert(data.em,"温馨提示","确认",function(){
							    var index = plus.webview.getLaunchWebview();
								var life = plus.webview.getWebviewById('life');
								plus.webview.hide(index.id);
								plus.webview.hide(life.id);
								plus.webview.show(index.id);
								plus.webview.show(life.id);
							});
			}
		}

		//支付-转账
		function toPayOrder() {
			var payParams = {
				//上送报文数据准备
				//订单类型
				orderType: self.orderType,
				//交易类型
				reqType: self.reqType,
				//发卡机构代码
				issCode: self.issCode,
				//交易序列号
				txnNo: self.txnNo,
				//消费金额-转账金额
				txnAmt: self.txnAmt,
				//币种
				currencyCode: self.currencyCode,
				//初始交易金额-即为订单金额
				origTxnAmt: self.origTxnAmt,
				//付款方附言
				payeeComments: self.payeeComments,
				//是否发票
				invoiceSt: self.invoiceSt,

				//上送付款方信息payerInfo
				//付款账号(子域)
				accNo: self.accNo,
				//付款方名称
				name: self.name,
				//付款银行信息
				payerBankInfo: self.payerBankInfo,
				//账户类型 个人账户必选，取值 1、2、3 分别代表 I 类、II类和 III 类账户
				acctClass: self.acctClass,
				//证件类型
				certifTp: self.certifTp,
				//证件号码
				certifId: self.certifId,
				//卡有效日期
				expired: self.expired,
				//卡类型 必选，取值 01 – 借记卡 02 – 贷记卡（含准贷记卡）
				cardAttr: self.cardAttr,
				//手机号
				mobile: self.mobile,

				//上送风控信息riskInfo
				//设备标识
				deviceID: self.deviceID,
				//设备类型 1:手机， 2:平板， 3:手表， 4:PC
				deviceType: self.deviceType,
				//应用提供方账户ID
				accountIdHash: self.accountIdHash,
				//IP
				sourceIP: self.sourceIP,
				//设备 GPS 位置
				DeviceLocation: self.DeviceLocation,
				//设备 SIM 卡号码
				fullDeviceNumber: self.fullDeviceNumber,
				//绑卡方式
				captureMethod: self.captureMethod,

				//上送优惠信息couponInfo
				//项目类型
				type: self.type,
				//出资方
				spnsrId: self.spnsrId,
				//抵消交易金额
				offstAmt: self.offstAmt,
				//项目编码
				itemId: self.itemId,
				//项目简称
				desc: self.desc,

				//保存流水数据准备
				//手机标识
				mbUUID: self.mbUUID,
				//付款方账号
				payAccNo: self.payAccNo,
				//付款账户名称
				payAccName: self.payAccName,
				//付款账户银行信息
				payAccBankInfo: self.payAccBankInfo,
				//交易金额
				transferAmt: self.transferAmt,
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
				//优惠项目类型
				discountItemType: self.discountItemType,
				//优惠抵消交易金额
				discountOffsetAmt: self.discountOffsetAmt,
				//优惠项目编号
				discountItemNo: self.discountItemNo,
				//优惠项目简称
				discountItemName: self.discountItemName,
				//备注信息
				description: self.description,

				//二维码
				qrNo: self.qrNo,
				//请求方自定义域
				reqReserved: self.reqReserved,
				//扫码付款标识
				toPayFlag: "1",
				scannedPayFlag: ""
			}
			var url = mbank.getApiURL() + 'toPay.do';
			mbank.apiSend('post', url, payParams, successCallback, errorCallback, true);

			function successCallback(data) {
				var txnNo = data.txnNo;
				var tranVoucherNo = data.voucherNum;
				var settleKey = data.settleKey;
				var settleDate = data.settleDate;

				payParams.tranVoucherNo = tranVoucherNo;
				payParams.settleKey = settleKey;
				payParams.settleDate = settleDate;

				if("31" == orderType) {
					mbank.openWindowByLoad('../qrcodePay/sumQRcode_c2c_end.html', 'sumQRcode_c2c_end', 'slide-in-right', payParams);
				} else {
					mbank.openWindowByLoad("../qrcodePay/sumQRcode_end.html", "sumQRcode_end", "slide-in-right", payParams);
				}
			}

			function errorCallback(data) {
				var errCode = data.ec;
				if("31" == orderType) {
					if (errCode.indexOf("EBPB") != -1) {
						mui.alert(data.em,"温馨提示","确认",function(){
							    var index = plus.webview.getLaunchWebview();
								var life = plus.webview.getWebviewById('life');
								plus.webview.hide(index.id);
								plus.webview.hide(life.id);
								plus.webview.show(index.id);
								plus.webview.show(life.id);
							});
					} else{
						mui.alert("转账失败："+data.em,"温馨提示","确认",function(){
							   var index = plus.webview.getLaunchWebview();
								var life = plus.webview.getWebviewById('life');
								plus.webview.hide(index.id);
								plus.webview.hide(life.id);
								plus.webview.show(index.id);
								plus.webview.show(life.id);
							});

					}
				} else {
					mui.alert("支付失败："+data.em,"温馨提示","确认",function(){
						var index = plus.webview.getLaunchWebview();
						var life = plus.webview.getWebviewById('life');
						plus.webview.hide(index.id);
						plus.webview.hide(life.id);
						plus.webview.show(index.id);
						plus.webview.show(life.id);
					});
				}
			}
		}

		//返回
		mui.back = function() {
			if(plus.webview.getWebviewById("scannedQRCode")) {
				plus.webview.close(plus.webview.getWebviewById("scannedQRCode"));
			}
			plus.webview.close(self);
		}
	});
});