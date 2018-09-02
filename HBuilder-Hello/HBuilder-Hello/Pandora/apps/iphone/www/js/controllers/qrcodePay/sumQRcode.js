define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	var fingerInit = require('../../core/fingerInit');

	mui.init();

	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		//设备标识
		var logonId = userInfo.getItem("logonId");
		var mbUUID = plus.device.uuid;
		var uuidHash = "" + CryptoJS.HmacMD5(mbUUID + "", logonId + "");
		//客户中文名称
		var customerNameCN = localStorage.getItem("session_customerNameCN");
		//证件类型
		var sessioncertType = localStorage.getItem("session_certType");
		//证件号码
		var sessioncertNo = localStorage.getItem("session_certNo");
		var tempCertNo = "";
		var delCertNo = "";
		if(sessioncertNo != null && sessioncertNo != "" && sessioncertNo.length > 6) {
			tempCertNo = sessioncertNo.substring(sessioncertNo.length - 6, sessioncertNo.length);
			if(sessioncertNo.length == 18) {
				delCertNo = "000000000000".concat(tempCertNo);
			} else {
				delCertNo = "000000000".concat(tempCertNo);
			}
		}
		//手机号码
		var session_mobileNo = localStorage.getItem("session_mobileNo");
		//付款账户列表
		var iAccountInfoList = [];
		//付款账户
		var accountPicker;
		//账户可用余额
		var balanceAvailable = 0.00;

		//付款方信息
		var payerInfo = [];
		//付款账号
		var currentAcct = "";
		//账户类型
		var accountType = "";
		//开户行网号
		var accountOpenNode = "";
		//付款银行信息
		var payerBankInfo = "";
		//卡有效日期
		var expired = "";
		//CVN2
		var CVN2 = "";

		//订单信息
		//交易序列号
		var txnNo = "";
		//订单类型
		var ordType = "";
		//支付有效时间
		var paymentValidTime = "";
		//受理机构代码
		var acqCode = "";
		//金额
		var txnAmt = "";
		//币种
		var currencyCode = "";
		//收款方附言
		var payeeComments = "";
		//是否发票
		var invoiceSt = "";
		//是否有营销信息(1-有营销 0-无)
		var isHaveCouponInfo = "";
		//订单号
		var orderNo = "";

		//收款方信息
		var payeeInfo = [];
		//商户类别
		var merCatCode = "";
		//标识子域
		var merID = "";
		//商户名称
		var merName = "";
		//终端号
		var termId = "";
		//卡号
		var payeeAccNo = "";
		//二级代码子域
		var subId = "";
		//二级名称子域
		var subName = "";

		//优惠信息
		var couponInfo = [];
		//项目类型
		var type = "";
		//出资方
		var spnsrId = "";
		//抵消交易金额
		var offstAmt = "";
		//项目编码
		var itemId = "";
		//项目简称子域
		var desc = "";
		//附加信息
		var addnInfo = "";

		//手动输入支付金额
		var payTxnAmt = "";
		//手动输入支付备注
		var description = "";
		//初始交易金额
		var origTxnAmt = "";
		//优惠后金额
		var discountAmt = "";

		//二维码数据 特定格式的URL
		var qrCode = self.qrCode;
		//顺序账号
		var accountList = self.accountList;
		//免密限额
		var pinFree = self.pinFree;

		//指纹验证错误标识
		var errorTimes = false;
		//支付上送参数
		var payParams = "";
		//换算后金额
		var scalerAmt = "";

		queryDefaultAcct();

		//查询付款账户列表函数
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack, '');

			function allAccCallBack(data) {
				iAccountInfoList = data;
				var length = iAccountInfoList.length;
				var currentAccount;
				if(length > 0) {
					accountPickerList = [];
					if(accountList.length != 0) {
						for(var i = 0; i < length; i++) {
							if(iAccountInfoList[i].accountNo == accountList[0].cardNo) {
								currentAccount = iAccountInfoList[i];
								var str = iAccountInfoList.splice(i, 1);
								iAccountInfoList.unshift(str[0]);
							}
						}
						for(var i = 0; i < length; i++) {
							var account = iAccountInfoList[i];
							var pickItem = {
								value: i,
								text: format.dealAccountHideFour(account.accountNo)
							};
							accountPickerList.push(pickItem);
						}
					} else {
						for(var i = 0; i < length; i++) {
							var account = iAccountInfoList[i];
							var pickItem = {
								value: i,
								text: format.dealAccountHideFour(account.accountNo)
							};
							accountPickerList.push(pickItem);
						}
						currentAccount = iAccountInfoList[0];
					}
				}
				accountInit();
				//当前账户信息
				currentAcct = currentAccount.accountNo;
				accountType = currentAccount.accountType;
				accountOpenNode = currentAccount.accountOpenNode;

				if(currentAcct != "请选择") {
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
				}
				//查询二维码订单函数
				qrOrderQuery();
			}
		}

		//初始化账户列表信息函数
		function accountInit() {
			accountPicker = new mui.SmartPicker({ title: "请选择交易账号", fireEvent: "accountChange" });
			accountPicker.setData(accountPickerList);
		}

		//切换付款账户函数
		$("#switch").on("tap", function() {
			document.activeElement.blur();
			accountPicker.show();
		});

		//选择付款账户监听函数
		window.addEventListener("accountChange", function(event) {
			var value = event.detail.value;
			//当前账户信息
			currentAcct = iAccountInfoList[value].accountNo;
			accountType = iAccountInfoList[value].accountType;
			accountOpenNode = iAccountInfoList[value].accountOpenNode;

			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
		});

		//解析并查询二维码订单信息函数
		function qrOrderQuery() {
			var params = {
				//发卡机构代码
				issCode: accountOpenNode,
				//二维码
				qrCode: qrCode,

				//上送付款方信息payerInfo
				//付款账号(子域)
				accNo: currentAcct,
				//付款方名称（子域）
				name: customerNameCN,
				//付款银行信息
				payerBankInfo: payerBankInfo,
				//账户类型 个人账户必选，取值 1、2、3 分别代表 I 类、II类和 III 类账户
				acctClass: accountType,
				//证件类型
				certifTp: '01',
				//证件号码
				certifId: delCertNo,
				//CVN2
				CVN2: "",
				//卡有效日期
				expired: "",
				//卡类型 必选，取值 01 – 借记卡 02 – 贷记卡（含准贷记卡）
				cardAttr: "01",
				//手机号
				mobile: session_mobileNo,

				//上送风控信息riskInfo
				//设备标识
				deviceID: mbUUID,
				//设备类型 1:手机， 2:平板， 3:手表， 4:PC
				deviceType: "1",
				//应用提供方账户ID
				accountIdHash: uuidHash,
				//IP
				sourceIP: "",
				//设备 GPS 位置
				DeviceLocation: "",
				//设备 SIM 卡号码
				fullDeviceNumber: session_mobileNo,
				//绑卡方式
				captureMethod: ""
			}
			var url = mbank.getApiURL() + 'qrCodeOrderQuery.do';
			mbank.apiSend('post', url, params, successCallback, errorCallback, true);

			function successCallback(data) {
				//订单信息
				txnNo = data.txnNo;
				//一般消费（组合取值10）、限定非贷记帐户支付的消费(11)、小微商户收款(12)、人到人转账(31)
				ordType = data.orderType;
				//支付有效时间
				paymentValidTime = data.paymentValidTime;
				//受理机构代码
				acqCode = data.acqCode;
				//金额
				txnAmt = data.txnAmt;
				//币种
				currencyCode = data.currencyCode;
				//收款方附言，用于给付款方展示
				payeeComments = data.payeeComments;
				//支持发票
				invoiceSt = data.invoiceSt;
				//是否有营销信息(1-有营销 0-无)
				isHaveCouponInfo = data.isHaveCouponInfo;
				//订单号
				orderNo = data.orderNo;

				//收款方信息--length为2 取第一条的值
				payeeInfo = data.payeeInfo;
				//商户类别
				merCatCode = ((payeeInfo[0].merCatCode) == null) ? "" : (payeeInfo[0].merCatCode);
				//标识子域
				merID = ((payeeInfo[0].merID) == null) ? "" : (payeeInfo[0].merID);
				//商户名称-收款账户名称
				merName = ((payeeInfo[0].name) == null) ? "" : (payeeInfo[0].name);
				//终端号
				termId = ((payeeInfo[0].termId) == null) ? "" : (payeeInfo[0].termId);
				//收款账号
				payeeAccNo = ((payeeInfo[0].accNo) == null) ? "" : (payeeInfo[0].accNo);
				//二级代码子域
				subId = ((payeeInfo[0].subId) == null) ? "" : (payeeInfo[0].subId);
				//二级名称子域
				subName = ((payeeInfo[0].subName) == null) ? "" : (payeeInfo[0].subName);

				//金额除空
				txnAmt = txnAmt.trim();
				var delTxnAmt = parseFloat(txnAmt) / 100;

				//根据订单类型判断该笔订单是消费订单，还是转账订单
				$("#showDetail").show();
				if("31" == ordType) {
					var recAccNo = "";
					if(payeeAccNo != "" && payeeAccNo != null && payeeAccNo.length > 4) {
						recAccNo = payeeAccNo.substring(payeeAccNo.length - 4, payeeAccNo.length);
					}
					var tranInfo = "向" + merName + "的" + subName + "借记卡(" + recAccNo + ")转账";
					$("#transferInfo").show();
					$("#transferInfo").html(tranInfo);
					if(txnAmt != "" && txnAmt != null && txnAmt != "0.00" && txnAmt != "0") {
						var fmtAmt = format.formatMoney(delTxnAmt);
						var strAmt = "¥&nbsp;" + fmtAmt;
						$("#transferAmt").show();
						$("#transferAmt").html(strAmt);
					} else {
						$("#amtName").text("转账金额(元)");
						$("#qr_sum1_div").hide();
						$("#qr_sum3_div").show();
					}
					if(payeeComments != "" && payeeComments != null) {
						var strRecComments = "对方备注：" + payeeComments;
						$("#recRemark").show();
						$("#recRemark").html(strRecComments);
					}
					$("#description").attr("placeholder", "附言选填(不超过20个字符)");
					$("#toPay").text("转    账");
				} else {
					$("#qr_paylogo").show();
					$("#merName").show();
					$("#merName").html(merName);
					$("#amtName").text("订单金额(元)");
					if(txnAmt != "" && txnAmt != null && txnAmt != "0.00" && txnAmt != "0") {
						$("#qr_sum1_div").show();
						$("#qr_sum3_div").hide();
						$("#qr_sum1").html(format.formatMoney(delTxnAmt));
					} else {
						$("#qr_sum1_div").hide();
						$("#qr_sum3_div").show();
					}
					if(payeeComments != "" && payeeComments != null) {
						var strRecComments = "对方附言：" + payeeComments;
						$("#recRemark").show();
						$("#recRemark").html(strRecComments);
					}
					$("#description").attr("placeholder", "备注选填(不超过20个字符)");
					$("#toPay").text("支    付");
				}
			}

			function errorCallback(data) {
				$("#noShowDetail").show();
				$("#msg").text("扫码失败");
			}
		}

		//输入金额时格式化函数
		$("#qr_sum3").on("focus", function() {
			if($(this).val()) {
				$(this).val(format.ignoreChar($(this).val(), ','));
			}
			$(this).attr('type', 'number');
		});
		$("#qr_sum3").on("blur", function() {
			$(this).attr('type', 'text');
			if($(this).val()) {
				$(this).val(format.formatMoney($(this).val(), 2));
			}
		});

		//点击去支付-转账
		$("#toPay").on("tap", function() {
			if(txnAmt != "" && txnAmt != null && txnAmt != "0.00" && txnAmt != "0") {
				origTxnAmt = txnAmt;
				payTxnAmt = txnAmt;
				scalerAmt = parseFloat(txnAmt) / 100;
			} else {
				origTxnAmt = format.ignoreChar($("#qr_sum3").val(), ',');
				var tmpOgAmt = origTxnAmt.trim();
				tmpOgAmt = ((parseFloat(tmpOgAmt)) * 100).toFixed(0);
				origTxnAmt = tmpOgAmt;
				payTxnAmt = format.ignoreChar($("#qr_sum3").val(), ',');
				var tmpPyAmt = payTxnAmt.trim();
				scalerAmt = tmpPyAmt;
				if(tmpPyAmt == '' || tmpPyAmt == null) {
					mui.alert("金额不能为空");
					return;
				}
				if(!isMoney(tmpPyAmt) || parseFloat(tmpPyAmt) <= 0) {
					mui.alert("请输入正确的金额");
					return;
				}
			}

			//获取备注信息
			description = $("#description").val();
			
			//查询储蓄卡余额
			var params = {
				"accountNo": currentAcct
			};
			var url = mbank.getApiURL() + 'balanceQuery_ch.do';
			mbank.apiSend('post', url, params, function(data) {
				if(data.balanceAvailable != '' && data.balanceAvailable != null) {
					balanceAvailable = data.balanceAvailable;
					if(parseFloat(scalerAmt) > parseFloat(balanceAvailable)) {
						mui.alert("余额不足，请尝试其他付款账户");
						return;
					}
				}
				if("31" == ordType) {
					//付款
					toPayOrder();
				} else {
					//查询余额异常 流程也要继续走
					salesQrOrderQuery();
				}
			}, function(e) {
				if("31" == ordType) {
					//付款
					toPayOrder();
				} else {
					//查询余额异常 流程也要继续走
					salesQrOrderQuery();
				}
			}, false);
		});

		//查询银联营销活动
		function salesQrOrderQuery() {
			var params = {
				//交易序列号
				txnNo: txnNo,
				//付款金额
				txnAmt: origTxnAmt,
				//币种
				currencyCode: currencyCode,

				//上送付款方信息payerInfo
				//付款账号(子域)
				accNo: currentAcct,
				//付款方名称（子域）
				name: customerNameCN,
				//付款银行信息
				payerBankInfo: payerBankInfo,
				//发卡机构代码
				issCode: accountOpenNode,
				//账户类型 个人账户必选，取值 1、2、3 分别代表 I 类、II类和 III 类账户
				acctClass: accountType,
				//证件类型
				certifTp: "01",
				//证件号码
				certifId: delCertNo,
				//CVN2
				CVN2: "",
				//卡类型 必选，取值 01 – 借记卡 02 – 贷记卡（含准贷记卡）
				cardAttr: "01",
				//卡有效日期
				expired: "",
				//手机号
				mobile: session_mobileNo,

				//上送收款方信息payeeInfo
				//商户类别
				merCatCode: merCatCode,
				//标识子域
				merID: merID,
				//付款账户名称
				payeeName: merName,
				//终端号
				termId: termId,
				//付款账户
				payeeAccNo: payeeAccNo,
				//二级代码子域
				subId: subId,
				//二级名称子域
				subName: subName,

				//上送风控信息riskInfo
				//设备标识
				deviceID: mbUUID,
				//设备类型 1:手机， 2:平板， 3:手表， 4:PC
				deviceType: "1",
				//应用提供方账户ID
				accountIdHash: uuidHash,
				//IP
				sourceIP: "",
				//设备 GPS 位置
				DeviceLocation: "",
				//设备 SIM 卡号码
				fullDeviceNumber: session_mobileNo,
				//绑卡方式
				captureMethod: ""
			}
			var url = mbank.getApiURL() + 'salesQrCodeOrderQuery.do';
			mbank.apiSend('post', url, params, successCallback, errorCallback, true);

			function successCallback(data) {
				txnNo = data.txnNo;
				//accountOpenNode = data.issCode;
				//优惠信息--length为2 取第一条的值
				couponInfo = data.couponInfo;
				//项目类型
				type = ((couponInfo[0].type) == null) ? "" : (couponInfo[0].type);
				//出资方
				spnsrId = ((couponInfo[0].spnsrId) == null) ? "" : (couponInfo[0].spnsrId);
				//抵消交易金额
				offstAmt = ((couponInfo[0].offstAmt) == null) ? "" : (couponInfo[0].offstAmt);
				//项目编码
				itemId = ((couponInfo[0].itemId) == null) ? "" : (couponInfo[0].itemId);
				//项目简称子域
				desc = ((couponInfo[0].desc) == null) ? "" : (couponInfo[0].desc);
				//附加信息
				addnInfo = ((couponInfo[0].addnInfo) == null) ? "" : (couponInfo[0].addnInfo);

				if(offstAmt > 0 && offstAmt != null && offstAmt != "") {
					//交易金额减去抵消交易金额
					discountAmt = (origTxnAmt - offstAmt);
				} else {
					discountAmt = origTxnAmt;
				}
				//付款
				toPayOrder();
			}

			function errorCallback(data) {
				//85状态为没有优惠信息
				if (data.ec == "000085") {
					if(offstAmt > 0 && offstAmt != null && offstAmt != "") {
						//交易金额减去抵消交易金额
						discountAmt = (origTxnAmt - offstAmt);
					} else {
						discountAmt = origTxnAmt;
					}
					//付款
					toPayOrder();
				} else{
					mui.alert("查询优惠信息失败");
				}
			}
		}

		//支付-转账
		function toPayOrder() {
			var tempTxnAmt;
			var tempOrigTxnAmt;
			var tempTransferAmt;
			var scalerOrigTxnAmt;
			var scalerOffstAmt;
			var tempAccName = "";
			var tempAccBankInfo = "";
			var tempMerName = "";
			if("31" == ordType) {
				//转账金额-即为实际订单金额
				tempTxnAmt = origTxnAmt;
				//初始交易金额-即为订单金额
				tempOrigTxnAmt = origTxnAmt;
				
				tempTransferAmt = origTxnAmt;
				scalerOrigTxnAmt = origTxnAmt;
				scalerOffstAmt = "";
				//收款账户名称
				tempAccName = merName;
				//收款账户银行信息
				//商户名称
				tempMerName = "";
			} else {
				//消费金额-即为优惠后金额
				tempTxnAmt = discountAmt;
				//初始交易金额-即为订单金额
				tempOrigTxnAmt = origTxnAmt;
				
				tempTransferAmt = discountAmt;
				scalerOrigTxnAmt = origTxnAmt;
				if(offstAmt > 0 && offstAmt != null && offstAmt != "") {
					scalerOffstAmt = offstAmt;
				}else{
					scalerOffstAmt = "";
				}
				//收款账户名称
				tempAccName = "";
				//收款账户银行信息
				//商户名称
				tempMerName = merName;
			}

			payParams = {
				//上送报文数据准备
				//订单类型
				orderType: ordType,
				//交易类型
				reqType: "",
				//发卡机构代码
				issCode: accountOpenNode,
				//交易序列号
				txnNo: txnNo,
				//消费金额-转账金额
				txnAmt: tempTxnAmt,
				//币种
				currencyCode: currencyCode,
				//初始交易金额-即为订单金额
				origTxnAmt: tempOrigTxnAmt,
				//付款方附言
				payeeComments: description,
				//是否发票
				invoiceSt: invoiceSt,

				//上送付款方信息payerInfo
				//付款账号(子域)
				accNo: currentAcct,
				//付款方名称
				name: customerNameCN,
				//付款银行信息
				payerBankInfo: payerBankInfo,
				//账户类型 个人账户必选，取值 1、2、3 分别代表 I 类、II类和 III 类账户
				acctClass: accountType,
				//证件类型
				certifTp: "01",
				//证件号码
				certifId: delCertNo,
				//卡有效日期
				expired: "",
				//卡类型 必选，取值 01 – 借记卡 02 – 贷记卡（含准贷记卡）
				cardAttr: "01",
				//手机号
				mobile: session_mobileNo,

				//上送风控信息riskInfo
				//设备标识
				deviceID: mbUUID,
				//设备类型 1:手机， 2:平板， 3:手表， 4:PC
				deviceType: "1",
				//应用提供方账户ID
				accountIdHash: uuidHash,
				//IP
				sourceIP: "",
				//设备 GPS 位置
				DeviceLocation: "",
				//设备 SIM 卡号码
				fullDeviceNumber: session_mobileNo,
				//绑卡方式
				captureMethod: "",

				//上送优惠信息couponInfo
				//项目类型
				type: type,
				//出资方
				spnsrId: spnsrId,
				//抵消交易金额
				offstAmt: offstAmt,
				//项目编码
				itemId: itemId,
				//项目简称
				desc: desc,

				//保存流水数据准备
				//手机标识
				mbUUID: mbUUID,
				//付款方账号
				payAccNo: currentAcct,
				//付款账户名称
				payAccName: customerNameCN,
				//付款账户银行信息
				payAccBankInfo: "湖北银行",
				//交易金额
				transferAmt: tempTransferAmt,
				//收款方账号
				recAccNo: payeeAccNo,
				//收款账户名称
				recAccName: tempAccName,
				//收款账户银行信息
				recAccBankInfo: tempAccBankInfo,
				//商户代码
				merID: merID,
				//商户类别
				merCatCode: merCatCode,
				//商户名称
				merName: tempMerName,
				//订单号
				orderNo: orderNo,
				//订单时间
				orderTime: "",
				//原订单金额
				originalOrderAmt: scalerOrigTxnAmt,
				//优惠项目类型
				discountItemType: type,
				//优惠抵消交易金额
				discountOffsetAmt: scalerOffstAmt,
				//优惠项目编号
				discountItemNo: itemId,
				//优惠项目简称
				discountItemName: desc,
				//备注信息
				description: description,

				//二维码
				qrNo: qrCode,
				//扫码付款标识
				toPayFlag: "1",
				scannedPayFlag: ""
			}
			if(pinFree != "" && pinFree != null) { //免密支付
				pinFree = pinFree.trim();
				if (parseFloat(pinFree) >= parseFloat(scalerAmt)) {
					comfirmPay(payParams);
				} else {
					queryFingerPay(payParams); //查询是否开启指纹支付
				}
			} else {
				queryFingerPay(payParams); //查询是否开启指纹支付
			}
		}

		//直接支付
		function comfirmPay(payParams) {
			var url = mbank.getApiURL() + 'toPay.do';
			mbank.apiSend('post', url, payParams, successCallback, errorCallback, true);

			function successCallback(data) {
				txnNo = data.txnNo;
				var tranVoucherNo = data.voucherNum;
				var settleKey = data.settleKey;
				var settleDate = data.settleDate;

				payParams.tranVoucherNo = tranVoucherNo;
				payParams.settleKey = settleKey;
				payParams.settleDate = settleDate;

				if("31" == ordType) {
					mbank.openWindowByLoad('../qrcodePay/sumQRcode_c2c_end.html', 'sumQRcode_c2c_end', 'slide-in-right', payParams);
				} else {
					mbank.openWindowByLoad('../qrcodePay/sumQRcode_end.html', 'sumQRcode_end', 'slide-in-right', payParams);
				}
			}
             
			function errorCallback(data) {
				var errCode = data.ec;
				if("31" == ordType) {
					if (errCode.indexOf("EBPB") != -1) {
						mui.alert(data.em,"温馨提示","确认",function(){
//							    mbank.openWindowByLoad('../views/life/lifeHome.html', 'life', 'slide-in-right');
//								return;
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

		//查询是否开启指纹支付
		function queryFingerPay(payParams) {
			var url = mbank.getApiURL() + 'queryFingerPay.do';
			mbank.apiSend('post', url, null, queryFingerPaySuccess, queryFingerPayError, false);

			function queryFingerPaySuccess(data) {
				if(data.flag == '1') {
					touchID(payParams);
				} else {
					mbank.openWindowByLoad("../qrcodePay/qr_password.html", "qr_password", "slide-in-right", payParams);
				}
			}

			function queryFingerPayError(data) {
				mui.alert(data.em);
			}
		}

		//指纹验证
		function touchID(payParams) {
			fingerInit.pluginFinger(successCallback, errorCallback, outTimesCallback);

			function successCallback(msg) {
				comfirmPay(payParams);
			}

			function errorCallback(msg) {
				mui.toast(msg);
				mbank.openWindowByLoad("../qrcodePay/qr_password.html", "qr_password", "slide-in-right", payParams);
			}

			//错误或取消 返回
			function outTimesCallback(state, msg) {
				if(mui.os.ios) {} else {
					if(state == "3" || state == "7") {
						mui.toast(msg);
					}
				}
				mbank.openWindowByLoad("../qrcodePay/qr_password.html", "qr_password", "slide-in-right", payParams);
			}
		}

		//返回
		mui.back = function() {
			plus.webview.close(plus.webview.getWebviewById("barcode_scan"));
			plus.webview.close(self);
		}

		mbank.resizePage(".toPay");
	});
});