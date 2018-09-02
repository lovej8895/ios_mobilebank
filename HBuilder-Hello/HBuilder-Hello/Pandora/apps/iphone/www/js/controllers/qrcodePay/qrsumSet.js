define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var app = require('../../core/app');
	var nativeUI = require('../../core/nativeUI');

	//预加载
	mui.init(); 
	mui.plusReady(function() {
		//锁定屏幕为竖屏模式
		plus.screen.lockOrientation("portrait-primary"); 
		var self = plus.webview.currentWebview();
		var txnAmt = '';
		var payeeComments = '';
		//去支付
		$("#confirmBtn").on("tap", function() {
			//获取设置转账金额
			txnAmt = format.ignoreChar($("#txnAmt").val(), ',');
			//获取设置备注
			payeeComments = $("#payeeComments").val(); 
			
			//当备注非空时，转账金额必须要输入
			if (!(payeeComments == '' || payeeComments == null)) {
				payeeComments = payeeComments.trim();
				if (txnAmt == '' || txnAmt == null) {
					mui.alert("请输入金额");
					return;
				}
			}
			
			//转账金额格式验证
			if(!(txnAmt == '' || txnAmt == null)) {
				txnAmt = txnAmt.trim();
				if(!isMoney(txnAmt) || parseFloat(txnAmt) <= 0) {
					mui.alert("请输入正确的金额");
					return;
				}
			}

			var params;
			if((txnAmt != '' && txnAmt != null) || payeeComments != '') {
				params = {
					txnAmt: txnAmt,
					noSetFlag: false,
					qrCodesetBack: false,
					payeeComments: payeeComments
				};
			} else {
				params = {
					noSetFlag: true,
					qrCodesetBack: false
				};
			}

			mui.fire(plus.webview.getWebviewById("scannedQRc2c"), 'refreshScannedQRc2c', params);

			plus.webview.close("qrsumSet");
		});

		//返回函数
		mui.back = function() {
			var params = {
				noSetFlag: true,
				qrCodesetBack: false
			};
			mui.fire(plus.webview.getWebviewById("scannedQRc2c"), 'refreshScannedQRc2c', params);
			plus.webview.close("qrsumSet");
		}

		//格式化金额
		$("#txnAmt").on("focus", function() {
			if($(this).val()) {
				$(this).val(format.ignoreChar($(this).val(), ','));
			}
			$(this).attr('type', 'number');
		});
		
		$("#txnAmt").on("blur", function() {
			$(this).attr('type', 'text');
			if($(this).val()) {
				$(this).val(format.formatMoney($(this).val(), 2));
			}
		});
	});
});