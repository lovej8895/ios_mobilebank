define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	mui.init();

	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var qrCode = ""; //二维码数据 特定格式的URL
		var appId = $.param.QRCODE_APPID;
		
		//启动二维码扫描
		var scan;
		var styles = "";
		styles = { frameColor: '#007AFF', scanbarColor: '#007AFF' }; //边框属性，中间框属性，背景色
		//styles = {frameColor:'#007AFF',scanbarColor:'#007AFF',background:"#000000"};//边框属性，中间框属性，背景色
		scan = new plus.barcode.Barcode("bcid", [], styles);
		scan.onmarked = onmarked;
		scan.start({ conserve: true, filename: '_doc/barcode/' });

		//从相册中选择二维码图片 
		$("#scanPictureId").on("tap", function() {
			scanPicture();
		});

		function scanPicture() {
			plus.gallery.pick(function(path) {
				plus.barcode.scan(path, onmarked, function(error) {
					mui.toast('无法识别此二维码');
				});
			}, function(err) {
				//		        mui.toast("未选取二维码");
			});
		}

		//二维码扫描成功 返回数据
		function onmarked(type, result, file) {
			switch(type) {
				case plus.barcode.QR:
					type = 'QR';
					break;
				case plus.barcode.EAN13:
					type = 'EAN13';
					break;
				case plus.barcode.EAN8:
					type = 'EAN8';
					break;
				default:
					type = '其它' + type;
					break;
			}
			qrCode = result.replace(/\n/g, '');
			console.log("扫描二维码内容：(type==" + type + ",qrCode==" + qrCode + ",file==" + file + ");")
			//扫描成功判断是否正确二维码-- 二维码表示的数据，内容为特定格式的URL 
			//银联二维码订单格式分为TLV、 URL、 纯数字三种
			if(qrCode) {
				searchSignInfo(); //查询签约信息及顺序卡号信息
			} else {
				mui.toast('暂不支持此二维码');
				//延迟 设置再次start重新开始扫描
				setTimeout(function() {
					scan.start({ conserve: true, filename: '_doc/barcode/' });
				}, 3000);
			}
		}

		//查询是否签约开通二维码支付
		function searchSignInfo() {
			var url = mbank.getApiURL() + 'searchSignInfo.do';
			mbank.apiSend('post', url, {
				appId: appId
			}, searchSignSuccess, searchSignError, false);

			function searchSignSuccess(data) {
				scan.cancel();
				scan.close();
				if(data.signStatus == "0") { //已签约解析并查询二维码数据返回订单信息
					var accountList = data.paymentCardList; //顺序账号
					var pinFree = data.pinFree; //免密限额
					if(pinFree == null || pinFree == "") {
						pinFree = 0;
					}
					mbank.openWindowByLoad('../qrcodePay/sumQRcode.html', 'sumQRcode', 'slide-in-right', { qrCode: qrCode, accountList: accountList, pinFree: pinFree });
				} else { //已解约
					mbank.openWindowByLoad('../qrcodePay/scannedQRCode.html', 'scannedQRCode', 'slide-in-right', { scanCodeFlag: "1" });
				}
			}

			function searchSignError(data) {
				if(data.ec == "999999") { //未签约
					scan.cancel();
					scan.close();
					mbank.openWindowByLoad('../qrcodePay/scannedQRCode.html', 'scannedQRCode', 'slide-in-right', { scanCodeFlag: "1" });
				} else {
					mui.toast(data.em);
				}
			}
		}

		document.getElementById("scannedQRCode").addEventListener('tap', function() {
			scan.cancel();
			scan.close();
			if(plus.webview.getWebviewById("scannedQRCode")){
				mui.fire(plus.webview.getWebviewById("scannedQRCode"), 'refreshScannedQRCode', {});
				plus.webview.close(plus.webview.getWebviewById("barcode_scan"));
			}else {
				mbank.openWindowByLoad("../qrcodePay/scannedQRCode.html", "scannedQRCode", "slide-in-right", { scanCodeFlag: "2" });
			}
		});

		var openLightStatus = false; //手电筒开启状态  false为关闭
		$("#openLight").on("tap", function() {
			if(openLightStatus) {
				scan.setFlash(false); //关闭
				$("#light").css("background", "url(../../img/qr_icon4-2.png) no-repeat"); //手电筒图标置灰
			} else {
				scan.setFlash(true); //打开
				$("#light").css("background", "url(../../img/qr_icon4.png) no-repeat");
			}
			$("#light").css("background-size", "100%");
			openLightStatus = !openLightStatus;
		});

		//重写返回方法
		mui.back = function() {
			scan.cancel(); //结束二维码识别操作-可再次start重新开始扫描--解决有时闪退问题
			scan.close(); //释放控件占用资源，对象不再能使用
			if(plus.webview.getWebviewById("scannedQRCode")) {
				mui.fire(plus.webview.getWebviewById("scannedQRCode"), 'refreshScannedQRCode', {});
			}
			plus.webview.close(plus.webview.getWebviewById("barcode_scan"));
		}

		//延迟6分钟未扫描到二维码退出-防止闪退现象出现
		setTimeout(function() {
			mui.toast('扫描超时');
			mui.back();
		}, 360000);

	});
});