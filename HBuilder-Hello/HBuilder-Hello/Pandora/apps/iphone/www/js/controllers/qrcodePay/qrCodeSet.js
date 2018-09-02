define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var fingerInit = require('../../core/fingerInit');

	mui.init();
	mui.plusReady(function() {
		commonSecurityUtil.initSecurityData('028001', plus.webview.currentWebview());
		$('#smsType').find('span').hide();
		$('#smsType').find('button').remove("but_rh28px");
		$('#smsType').find('button').addClass("but_rh28px_pr");
		plus.screen.lockOrientation("portrait-primary");

		var qrSwitch = document.getElementById("qrSwitch");
		var fingerSwitch = document.getElementById("fingerSwitch");
		var appId = $.param.QRCODE_APPID

		//支付管理界面信息初始化
		queryInitInfo();
		var signStatus = "";
		var fingerStatus = "";

		function queryInitInfo() {
			var url = mbank.getApiURL() + 'queryInitInfo.do';
			mbank.apiSend('post', url, {}, queryInitSuccess, queryInitError, false);

			function queryInitSuccess(data) {
				signStatus = data.signStatus;
				fingerStatus = data.fingerStatus;
				var freepayStatus = data.freepayStatus;
				var freepayMoney = data.freepayMoney;

				//当面付款状态初始化
				if(signStatus && signStatus != 1) {
					qrSwitch.classList.add('mui-active');
					jQuery("#qrHandle").css({
						"transition-duration": "0.2s",
						"transform": "translate(16px,0px)"
					});
				} else {
					qrSwitch.classList.remove('mui-active');
					jQuery("#qrHandle").css({
						"transition-duration": "0.2s",
						"transform": "translate(0px,0px)"
					});
				}

				//指纹支付状态初始化
				if(fingerStatus && fingerStatus != 0) {
					fingerSwitch.classList.add('mui-active');
					jQuery("#fingerHandle").css({
						"transition-duration": "0.2s",
						"transform": "translate(16px,0px)"
					});
				} else {
					fingerSwitch.classList.remove('mui-active');
					jQuery("#fingerHandle").css({
						"transition-duration": "0.2s",
						"transform": "translate(0px,0px)"
					});
				}

				//小额免密信息初始化
				if(freepayStatus == "1") {
					$("#freepayStatus").html(freepayMoney + '元/笔');
				} else {
					$("#freepayStatus").html("关闭");
				}
			}

			function queryInitError(data) {
				mui.toast("支付管理信息显示失败");
			}
		}

		//增加子功能返回监听事件
		window.addEventListener("queryInitInfo", function(event) {
			queryInitInfo();
		});

		//增加指纹开通失败时返回监听事件
		window.addEventListener("fingerOpenEvent", function(event) {
			fingerSwitch.classList.remove('mui-active');
			jQuery("#fingerHandle").css({
				"transition-duration": "0.2s",
				"transform": "translate(0px,0px)"
			});
		});

		//短信验证确定按钮监听事件
		document.getElementById("qrSignBt").addEventListener('tap', function() {
			var smsPWord = $("#smsPassword").val();
			if(!smsPWord || smsPWord.length != 6) {
				mui.alert('请输入6位短信验证码');
				return false;
			} else {
				qrSignQuery();
			}
		});

		//短信验证关闭监听事件
		document.getElementById("msgClose").addEventListener('tap', function() {
			$("#smsPassword").val("");
			$("#msgBox").hide();
			qrSwitch.classList.remove('mui-active');
			jQuery("#qrHandle").css({
				"transition-duration": "0.2s",
				"transform": "translate(0px,0px)"
			});
		});

		//当面付款功能开关操作
		qrSwitch.addEventListener('toggle', function() {
			if(event.detail.isActive) {
				if("1" == signStatus || signStatus == null || signStatus == "") {
					$("#msgBox").show();
				}
			} else {
				mui.confirm("关闭后您将不能继续使用当面付款功能进行交易，仍要关闭此功能吗？", "温馨提示", ["确定", "取消"], function(event) {
					if(event.index == 0 && "0" == signStatus) {
						closeSign();
					} else {
						if("0" == signStatus) {
							qrSwitch.classList.add('mui-active');
							jQuery("#qrHandle").css({
								"transition-duration": "0.2s",
								"transform": "translate(16px,0px)"
							});
						}
					}
				});
			}
		});

		//查询客户是否签解约
		function qrSignQuery() {
			var params = { "appId": appId };
			var url = mbank.getApiURL() + 'qrSignQuery.do';
			mbank.apiSend('post', url, params, qrSignBreakSucc, qrSignBreakError, false);

			function qrSignBreakSucc(data) {
				var search_status = data.signStatus;
				//signStatus 为0表示已签约 为1表示解约
				if(search_status == 1) {
					openSign();
				}else{
					mui.alert("您已开通当面付功能","温馨提示","确认",function(){
						 document.getElementById('msgBox').style.display='none';
					     mui.back();
						});
					return false;
				}
			}

			function qrSignBreakError(data) {
				openSign();
			}
		}

		//通过短信验证码，开通当面付款功能
		function openSign() {
			var params = { "appId": appId };
			var url = mbank.getApiURL() + 'qrCodeOpen.do';
			commonSecurityUtil.apiSend('post', url, params, signSuccess, signError, false);

			function signSuccess(data) {
				mui.toast("当面付款功能开通成功");
				$("#smsPassword").val("");
				$("#msgBox").hide();
				queryInitInfo();
			}

			function signError(data) {
				if(data.ec == "EBLN001055" || data.ec == "EBLN001056") {
					mui.toast("手机短信验证码验证失败");
					$("#smsPassword").val("");
				} else {
					mui.toast("当面付款功能开通失败");
					$("#smsPassword").val("");
					$("#msgBox").hide();
					qrSwitch.classList.remove('mui-active');
					jQuery("#qrHandle").css({
						"transition-duration": "0.2s",
						"transform": "translate(0px,0px)"
					});
				}
			}
		}

		//关闭当面付款功能
		function closeSign() {
			var params = { "appId": appId };
			var url = mbank.getApiURL() + 'qrCodeClose.do';
			mbank.apiSend('post', url, params, closeSignSuccess, closeSignError, false);

			function closeSignSuccess(data) {
				mui.toast("当面付款功能关闭成功");
				queryInitInfo();
			}

			function closeSignError(data) {
				mui.toast("当面付款功能关闭失败");
				qrSwitch.classList.add('mui-active');
				jQuery("#qrHandle").css({
					"transition-duration": "0.2s",
					"transform": "translate(16px,0px)"
				});
			}
		}

		//指纹支付开关操作
		fingerSwitch.addEventListener('toggle', function() {
			if(event.detail.isActive) {
				//打开指纹支付设置须先设置指纹
				if("0" == fingerStatus || fingerStatus == null || fingerStatus == "") {
					touchID();
				}
			} else {
				mui.confirm("关闭后您将不能继续使用指纹支付进行交易，仍要关闭此功能吗？", "温馨提示", ["确定", "取消"], function(event) {
					if(event.index == 0 && "1" == fingerStatus) {
						fingerCloseAction(0);
					} else {
						if("1" == fingerStatus) {
							fingerSwitch.classList.add('mui-active');
							jQuery("#fingerHandle").css({
								"transition-duration": "0.2s",
								"transform": "translate(16px,0px)"
							});
						}
					}
				});
			}
		});

		//指纹验证
		function touchID() {
			fingerInit.pluginFinger(successFingerCallback, errorFingerCallback, outTimesFingerCallback);

			function successFingerCallback() {
				fingerOpenAction(1);
			}

			function errorFingerCallback(msg) {
				mui.toast(msg);
				queryInitInfo();
			}

			function outTimesFingerCallback(state, msg) {
				if(mui.os.android) {
					if("3" == state || "7" == state) {
						mui.toast(msg);
					}
				}
				queryInitInfo();
			}
		}

		//开通指纹支付
		function fingerOpenAction(flag) {
			var params = { "flag": flag };
			var url = mbank.getApiURL() + 'fingerAction.do';
			mbank.apiSend('post', url, params, actionSuccess, actionError, false);

			function actionSuccess(data) {
				mui.toast("指纹支付开通成功");
				queryInitInfo();
			}

			function actionError() {
				mui.toast("指纹支付开通失败");
				fingerSwitch.classList.remove('mui-active');
				jQuery("#fingerHandle").css({
					"transition-duration": "0.2s",
					"transform": "translate(0px,0px)"
				});
			}
		}

		//关闭指纹支付
		function fingerCloseAction(flag) {
			var params = { "flag": flag };
			var url = mbank.getApiURL() + 'fingerAction.do';
			mbank.apiSend('post', url, params, actionSuccess, actionError, false);

			function actionSuccess(data) {
				mui.toast("指纹支付关闭成功");
				queryInitInfo();
			}

			function actionError() {
				mui.toast("指纹支付关闭失败");
				fingerSwitch.classList.add('mui-active');
				jQuery("#fingerHandle").css({
					"transition-duration": "0.2s",
					"transform": "translate(16px,0px)"
				});
			}
		}

		//支付管理界面功能公共跳转函数方法
		mui('body').on('tap', '#payManagerDiv li', function(event) {
			var id = this.getAttribute("id");
			var path = this.getAttribute("path");
			var noCheck = this.getAttribute("noCheck");
			//console.log("====id====：" + id);
			if(id == "") {
				mui.alert("功能正在研发中···");
				return;
			}
			if (id == "consumingQuery") {
				var recParams = {queryType: '0'};
				mbank.openWindowByLoad("../qrcodePay/consumingQuery.html", "consumingQuery", "slide-in-right", recParams);
			} else{
				mbank.openWindowByLoad(path, id, "slide-in-right", { noCheck: noCheck });
			}
		});
		
		//返回函数
		var isBcak = false;//是否已返回 标识 防止mui.back重复执行两次
		mui.back = function() {
			if (!isBcak) {
				isBcak = true;//已返回
				if(plus.webview.getWebviewById("barcode_scan")) {
					plus.webview.close(plus.webview.getWebviewById("barcode_scan"));
				}
				if(plus.webview.getWebviewById("scannedQRCode")) {
					mui.fire(plus.webview.getWebviewById("scannedQRCode"), 'refreshScannedQRCode', {});
				}
				if(plus.webview.getWebviewById("scannedQRc2c")) {
					mui.fire(plus.webview.getWebviewById("scannedQRc2c"), 'refreshScannedQRc2c', {qrCodesetBack: true});
				}
				plus.webview.close(plus.webview.getWebviewById("qrCodeSet"));
			}
		}
	});
});