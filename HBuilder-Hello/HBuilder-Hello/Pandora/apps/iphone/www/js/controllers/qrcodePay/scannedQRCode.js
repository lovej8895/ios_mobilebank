define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	var myAcctInfo = require('../../core/myAcctInfo');
	var fingerInit = require('../../core/fingerInit');
	
	//免密金额
	var pinFree = 0;
	//刷新10秒标识
	var stt = true; 
	//账号
	var currentAcct = ''; 
	//CB2码
	var qrcode = ''; 
	//开卡机构
	var issCode = ''; 
	//余额
	var balance = ''; 
	//账号类型
	var accType = ''; 
	//请求方自定义域
	var reqReserved = ''; 
	//银联保留域
	var upReserved = ''; 
	//付款凭证号
	var voucherNum = ''; 
	//二维码请求类型
	var qrType = ''; 
	//抵消交易金额
	var offstAmt = ''; 
	//交易金额
	var txnAmt = ''; 
	//卡属性
	var cardAttr = ''; 
	//商户名称
	var merName = ''; 
	//项目类型
	var type = ''; 
	//项目简称
	var desc = ''; 
	//账户类型
	var acctClass = '1'; 
	//订单号
	var orderNo = ''; 
	//交易时间
	var transferTime = ''; 
	var origAmt = '';
	var prepareInterval = '';
	var freshFail = '';
	var iAccountInfoList = [];
	var accountList = [];
	//图片占二维码比例
	var picWeight = 0.16; 
	//签约标识
	var sign = true; 
	//状态
	var tdcStatus = ''; 
	var logonId = '';
	var deviceUUID = '';
	var uuidHash = '';

	mui.init(); //预加载
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary"); //锁定屏幕为竖屏模式
		var screenHeight = plus.display.resolutionHeight;
		var screenWidth = plus.display.resolutionWidth;
		var self = plus.webview.currentWebview();
		logonId = userInfo.getItem("logonId");
		deviceUUID = plus.device.uuid;
		uuidHash = "" + CryptoJS.HmacMD5(deviceUUID + "", logonId + "");
		
		$("#open").click(function() {
			clearInterval(prepareInterval);
			mbank.openWindowByLoad("../qrcodePay/qrCodeSet.html", "qrCodeSet", "slide-in-right");
		});
		//查询签约信息
		searchSignInfo();

		function searchSignInfo() {
			var url = mbank.getApiURL() + 'searchSignInfo.do';
			mbank.apiSend('post', url, {
				appId: $.param.QRCODE_APPID
			}, searchSignSuccess, searchSignError, false);

			function searchSignSuccess(data) {
				if(data.signStatus == '0') { //已签约
					sign = true;
					accountList = data.paymentCardList;
					queryDefaultAcct();
					pinFree = data.pinFree;
					if(pinFree == null || pinFree == "") {
						pinFree = 0;
					} else {
						pinFree = ((parseFloat(pinFree)) * 100).toFixed(0);
					}
					getQrcode();
				} else {
					$("#initShow").css("display", "block");
					sign = false;
				}
			}

			function searchSignError(data) {
				$("#initShow").css("display", "block");
				sign = false;
				//mui.alert(data.em);
			}
		}

		function writeRandomNum(n) {
			var randomNum = '';
			for(var i = 0; i < n; i++) {
				randomNum += Math.floor(Math.random() * 10);
			}
			return randomNum;
		}

		function accountInit() {
			var accountPicker = new mui.SmartPicker({ title: "请选择交易账号", fireEvent: "accountChange" });
			accountPicker.setData(accountPickerList);
			$("#switch").on("tap", function() {
				document.activeElement.blur();
				accountPicker.show();
			});
		}
		//查询付款账户列表
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack, '2');

			function allAccCallBack(data) {
				iAccountInfoList = data;
				var length = iAccountInfoList.length;

				if(length > 0) {
					accountPickerList = [];
					if(accountList.length != 0) {
						for(var i = 0; i < length; i++) {
							if(iAccountInfoList[i].accountNo == accountList[0].cardNo) {
								issCode = iAccountInfoList[i].accountOpenNode;
								var str = iAccountInfoList.splice(i, 1);
								iAccountInfoList.unshift(str[0]);
							}
						}
						for(var i = 0; i < length; i++) {
							var account = iAccountInfoList[i];
							var pickItem = {
								value: i,
								text: account.accountNo
							};
							accountPickerList.push(pickItem);
						}
					} else {
						for(var i = 0; i < length; i++) {
							var account = iAccountInfoList[i];
							var pickItem = {
								value: i,
								text: account.accountNo
							};
							accountPickerList.push(pickItem);
						}
					}
				}
				accountInit();
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					issCode = iAccountInfoList[0].accountOpenNode;
					qrType = '35';
					cardAttr = '01';
					if(currentAcct != "请选择") {
						$("#accountNo").html(format.dealAccountHideFour(currentAcct));
					}
				}
			}
		}

		window.addEventListener("accountChange", function(event) {
			var value = event.detail.value;
			currentAcct = iAccountInfoList[value].accountNo;
			accType = iAccountInfoList[value]['accountType'];
			qrType = '35';
			cardAttr = '01';
			issCode = iAccountInfoList[value].accountOpenNode;
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
			getQrcode();
		});
		//查询二维码生产码，并生成二维码
		function getQrcode() {
			clearInterval(prepareInterval);
			clearInterval(freshFail);
			var url = mbank.getApiURL() + 'applyQrcode.do';
			var param = {
				qrType: '35',
				accNo: currentAcct,
				currencyCode: '156',
				cardAttr: '01',
				deviceID: deviceUUID,
				accountIdHash: uuidHash,
				deviceType: '1',
				acctClass: acctClass,
				qrOrderNo: writeRandomNum(10),
				reqReserved: '',
				pinFree: pinFree
			}
			mbank.apiSend('post', url, param, getQrcodeSuccess, getQrcodeError, true);

			function getQrcodeSuccess(data) {
				qrcode = data.qrNo;
				if(qrcode == '' || qrcode == null) {
					stt = false;
					mui.alert("二维码生成失败，请手动刷新!");
				} else {
					reqReserved = data.reqReserved;
					var width = document.getElementById('qrcode').clientWidth;
					$("#qrcode").html('<a><img id="codeico" src="../../img/qr-logo.png" style="display: none;"/></a>');
					$('#barcode').JsBarcode(qrcode, { displayValue: false });
					$('#barcodeNo').html(qrcode.substring(0, 4) + " **** 查看数字");
					generateQRCode("canvas", width, width, qrcode);
					$("#bigQrCode").html('<a><img id="logo" src="../../img/qr-logo.png" style="display: none;"/></a>');
					getBigQRCode("canvas", plus.display.resolutionWidth * 0.85, plus.display.resolutionWidth * 0.85, qrcode);
					$('#bigBarcode').JsBarcode(qrcode, { displayValue: true });
		       		prepareInterval = setInterval(function(){
		       			$('#barcodeBox').css("display","none");
		       			$('#bigQrCode').css("display","none");
		       			jQuery('#backGD').css('background','#66a5ce');
		       			jQuery('#message').show();
		       			getQrcode();
		       		},60000);
					freshFail = setInterval(function() {
						stt = false;
					}, 10000);
					$("#showQrcode").css("visibility", "");
					queryBalance(currentAcct);
				}
			}

			function getQrcodeError(data) {
				stt = false;
				mui.alert("二维码生成失败，请手动刷新!");
			}
		}

		function generateQRCode(rendermethod, picwidth, picheight, url) {
			$("#qrcode").qrcode({
				render: rendermethod, // 渲染方式有table方式（IE兼容）和canvas方式
				width: picwidth, //宽度 
				height: picheight, //高度 
				text: utf16to8(url), //内容 
				typeNumber: -1, //计算模式
				correctLevel: 2, //二维码纠错级别
				background: "#ffffff", //背景颜色
				foreground: "#000000" //二维码颜色
			});
			jQuery('#codeico').css('position', 'absolute');
			jQuery('#codeico').css('z-index', '9999');
			jQuery('#codeico').css('width', picheight * picWeight);
			var margin = picheight * (1 - picWeight) / 2;
			$("#codeico").css("margin", margin);
			$("#codeico").css("display", "block");
		}
		//中文编码格式转换
		function utf16to8(str) {
			var out, i, len, c;
			out = "";
			len = str.length;
			for(i = 0; i < len; i++) {
				c = str.charCodeAt(i);
				if((c >= 0x0001) && (c <= 0x007F)) {
					out += str.charAt(i);
				} else if(c > 0x07FF) {
					out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
					out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
					out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
				} else {
					out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
					out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
				}
			}
			return out;
		}
		//查询二维码状态
		function queryQrcodeStatus() {
			var url = mbank.getApiURL() + 'queryQrcodeStatus.do';
			var param = {
				qrNo: qrcode,
				reqReserved: reqReserved,
				balance: balance,
				deviceID: deviceUUID,
				name: localStorage.getItem("session_customerNameCN"), //客户中文名称
				payerBankInfo: "湖北银行",
				accNo: currentAcct
			}
			mbank.apiSend('post', url, param, queryQrcodeStatusSuccess, queryQrcodeStatusError, false);

			function queryQrcodeStatusSuccess(data) {
				merName = data.merName;
				txnAmt = data.txnAmt;
				tdcStatus = data.tdcStatus;
				type = data.type;
				desc = data.desc;
				offstAmt = data.offstAmt;
				transferTime = data.sysDate;
				voucherNum = data.voucherNum;
				orderNo = data.orderNo;
				origAmt = data.origTxnAmt;
				upReserved = data.upReserved;

				if('1' == data.flag) {
					mui.alert("可用余额不足，请切换卡号");
					return;
				}
				if(tdcStatus == '01') {
					queryFingerPay();
				} else if(tdcStatus == '03' || tdcStatus == '04') {
					clearInterval(prepareInterval);
					var params = {
						"accountNo": currentAcct,
						"accType": accType,
						"toPayFlag": "2",
						"scannedPayFlag": "1",
						"merName": merName,
						"txnAmt": txnAmt,
						"tdcStatus": tdcStatus,
						"type": type,
						"desc": desc,
						"offstAmt": offstAmt,
						"transferTime": transferTime,
						"voucherNum": voucherNum,
						"orderNo": orderNo,
						"origTxnAmt": origAmt
					};
					mbank.openWindowByLoad("../qrcodePay/sumQRcode_end.html", "sumQRcode_end", "slide-in-right", params);
				}
			}

			function queryQrcodeStatusError(data) {
				mui.toast(data.em);
			}
		}
		//查询是否开启指纹支付
		function queryFingerPay() {
			var url = mbank.getApiURL() + 'queryFingerPay.do';
			mbank.apiSend('post', url, null, queryFingerPaySuccess, queryFingerPayError, false);

			function queryFingerPaySuccess(data) {
				if(data.flag == '1') {
					touchID();
				} else {
					pwdCheckPay();
				}
			}

			function queryFingerPayError(data) {
				mui.alert(data.em);
			}
		}

		// 卡密码验证
		function pwdCheckPay() {
			clearInterval(prepareInterval);
			var params = {
				"qrNo": qrcode,
				"reqReserved": reqReserved,
				"voucherNum": voucherNum,
				"upReserved": upReserved,
				"cardAttr": cardAttr,
				"accountNo": currentAcct,
				"acctClass": acctClass,
				"issCode": issCode,
				"accountIdHash": uuidHash,
				"balance": balance,
				"toPayFlag": "2",
				"scannedPayFlag": "0",
				"txnAmt": txnAmt,
				"offstAmt": offstAmt,
				"origTxnAmt": origAmt
			};
			mbank.openWindowByLoad("../qrcodePay/qr_password.html", "qr_password", "slide-in-right", params);
		}

		//指纹验证
		function touchID() {
			fingerInit.pluginFinger(successCallback, errorCallback, outTimesCallback);

			function successCallback(msg) {
				var url = mbank.getApiURL() + 'noPwdResultNotice.do';
				mbank.apiSend('post', url, {
					qrNo: qrcode,
					reqReserved: reqReserved,
					voucherNum: voucherNum,
					upReserved: upReserved,
					cardAttr: cardAttr,
					accNo: currentAcct,
					acctClass: acctClass,
					deviceID: deviceUUID, //设备标识
					deviceType: '1',
					accountIdHash: uuidHash, //应用提供方账户ID
					issCode: issCode
				}, addictResultNoticeSuccess, addictResultNoticeError, false);

				function addictResultNoticeSuccess(data) {
					if(data.ec == '000') {
						clearInterval(prepareInterval);
						var params = {
							"qrNo": qrcode,
							"reqReserved": reqReserved,
							"balance": balance,
							"accountNo": currentAcct,
							"toPayFlag": "2",
							"scannedPayFlag": "0"
						};
						mbank.openWindowByLoad("../qrcodePay/sumQRcode_end.html", "sumQRcode_end", "slide-in-right", params);
					} else {
						mui.alert(data.em);
						return;
					}
				}

				function addictResultNoticeError(data) {
					mui.alert(data.em);
					return;
				}
			}

			function errorCallback(msg) {
				mui.toast(msg);
				pwdCheckPay();
			}

			function outTimesCallback(state, msg) {
				if(mui.os.ios) {} else {
					if(state == "3" || state == "7") {
						mui.toast(msg);
					}
				}
				pwdCheckPay();
			}
		}

		//查询储蓄卡余额
		function queryBalance(currentAcc) {
			var params = {
				"accountNo": currentAcct
			};
			var url = mbank.getApiURL() + 'balanceQuery_ch.do';
			mbank.apiSend('post', url, params, function(data) {
				if(data.balanceAvailable != '' && data.balanceAvailable != null) {
					balance = data.balanceAvailable;
				} else {
					balance = '';
				}
				queryQrcodeStatus();
			}, function(e) {
				balance = '';
				queryQrcodeStatus(); //查询余额异常 流程也要继续走
			}, false);
		}
		
		//生成二维码后10秒才能刷新
		document.getElementById("fresh").addEventListener('tap', function() {
			if(!sign) {
				mui.alert("您尚未开通当面付款功能，请点击立即开启前往开通");
			} else if(stt) {
				mui.alert("付款码不能频繁刷新，请于10秒后再试");
			} else {
				stt = true;
				getQrcode();
			}
		});

		document.getElementById("barcScan").addEventListener('tap', function() {
			if(plus.webview.getWebviewById("barcode_scan")){
				plus.webview.close("barcode_scan");
			}
			clearInterval(prepareInterval);
			mbank.openWindowByLoad("../qrcodePay/barcode_scan.html", "barcode_scan", "slide-in-right", {});
		});

		//设置跳转
		var qrCodeSet = document.getElementById("qrCodeSet");
		qrCodeSet.addEventListener('tap', function() {
			clearInterval(prepareInterval);
			var id = this.getAttribute("id");
			var path = this.getAttribute("path");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right");
		});

		mui.back = function() {
			if(plus.webview.getWebviewById("barcode_scan")) {
				plus.webview.close(plus.webview.getWebviewById("barcode_scan"));
			}
			plus.webview.close(self);
		}

		document.getElementById("qrcode").addEventListener('tap', function() {
			jQuery('#bigQrCode').toggle();
			jQuery('#logo').toggle();
			jQuery('#backGD').css('background', '#FFFFFF');
			jQuery('#message').hide();
		});

		document.getElementById("bigQrCode").addEventListener('tap', function() {
			jQuery('#bigQrCode').toggle();
			jQuery('#logo').toggle();
			jQuery('#backGD').css('background', '#66a5ce');
			jQuery('#message').show();
		});

		function getBigQRCode(rendermethod, picwidth, picheight, url) {
			$("#bigQrCode").qrcode({
				render: rendermethod, // 渲染方式有table方式（IE兼容）和canvas方式
				width: picwidth, //宽度 
				height: picheight, //高度 
				text: utf16to8(url), //内容 
				typeNumber: -1, //计算模式
				correctLevel: 2, //二维码纠错级别
				background: "#ffffff", //背景颜色
				foreground: "#000000" //二维码颜色
			});
			jQuery("#bigQrCode").height(screenHeight);

			jQuery("#bigQrCode").width(screenWidth);
			var bigMargin = (jQuery("#bigQrCode").height() - screenHeight * 0.5) / 2;
			jQuery('#bigQrCode').css('padding', bigMargin);
			jQuery('#bigQrCode').css('padding-left', bigMargin / 6);
			jQuery('#logo').css('position', 'absolute');
			jQuery('#logo').css('z-index', '9999');
			jQuery('#logo').css('width', picheight * picWeight);
			var margin2 = picheight * (1 - picWeight) / 2;
			$("#logo").css("margin", margin2);
		}

		jQuery('#barcodeBox').height(screenHeight);
		jQuery('#barcodeBox').width(screenWidth);
		jQuery('#bigBarcode').css('transform', 'rotate(90deg)');
		jQuery('#bigBarcode').css('position', 'absolute');
		jQuery('#bigBarcode').css('width', screenHeight * 0.8);
		jQuery('#bigBarcode').css('height', screenWidth * 0.6);

		var barCodeWidth = jQuery('#bigBarcode').width();
		var barCodeHeight = jQuery('#bigBarcode').height();
		jQuery('#bigBarcode').css('margin-top', '55%');
		jQuery('#bigBarcode').css('margin-left', -(screenWidth - barCodeHeight) / 2);

		document.getElementById("barcode").addEventListener('tap', function() {
			jQuery('#barcodeBox').toggle();
			jQuery('#backGD').css('background', '#FFFFFF');
			jQuery('#message').hide();
		});
		document.getElementById("barcodeBox").addEventListener('tap', function() {
			jQuery('#barcodeBox').toggle();
			jQuery('#backGD').css('background', '#66a5ce');
			jQuery('#message').show();
		});

		window.addEventListener("refreshScannedQRCode", function(event) {
			$("#showQrcode").css("visibility", "hidden");
			$("#initShow").css("display", "none");
			searchSignInfo();
		});
	});
});