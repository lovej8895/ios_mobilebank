define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var myAcctInfo = require('../../core/myAcctInfo');

	var currentAcct = ''; //账号
	var qrcode = ''; //CB2码
	var reqReserved = ''; //请求方自定义域
	var issCode = ''; //开卡机构
	var qrType = ''; //二维码请求类型
	var txnAmt = ''; //设置金额
	var payeeComments = ''; //收款方附言
	var cardAttr = ''; //卡属性
	var orderNo = ''; //订单号
	var prepareInterval = '';
	var iAccountInfoList = [];
	var accountList = [];
	var picWeight = 0.16; //图片占二维码比例
	var sign = true; //签约标识

	//通过mui.init方法中的gestureConfig参数，配置具体需要监听的手势事件
	mui.init({
		gestureConfig: {
			tap: true, //默认为true
			doubletap: true, //默认为false
			longtap: true, //默认为false//长按
			swipe: true, //默认为true
			drag: true, //默认为true
			hold: false, //默认为false，不监听
			release: false //默认为false，不监听
		}
	});

	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary"); //锁定屏幕为竖屏模式
		var screenHeight = plus.display.resolutionHeight;
		var screenWidth = plus.display.resolutionWidth;
		var lifeHome = plus.webview.getWebviewById("life");
		var self = plus.webview.currentWebview();
		var customerNameCN = localStorage.getItem("session_customerNameCN"); //客户中文名称

		//立即开启方法
		$("#open").click(function() {
			clearInterval(prepareInterval);
			mbank.openWindowByLoad("../qrcodePay/qrCodeSet.html", "qrCodeSet", "slide-in-right");
		});

		//查询签约信息
		searchSignInfo();

		function searchSignInfo() {
			var url = mbank.getApiURL() + 'searchSignInfo.do';
			mbank.apiSend('post', url, {
				appId: ""
				//appId: $.param.QRCODE_APPID  针对签约情况时，需上送
			}, searchSignSuccess, searchSignError, false);

			function searchSignSuccess(data) {
				accountList = data.paymentCardList;
				queryDefaultAcct();
				getQrC2Ccode();
				/*if(data.signStatus == '0') { //已签约
					sign = true;
				} else {
					$("#initShow").css("display", "block");
					sign = false;
				}*/
			}

			function searchSignError(data) {
				accountList = data.paymentCardList;
				queryDefaultAcct();
				getQrC2Ccode();
				/*$("#initShow").css("display", "block");
				sign = false;
				mui.alert(data.em);*/
			}
		}

		//生成订单号随机数
		function writeRandomNum(n) {
			var randomNum = '';
			for(var i = 0; i < n; i++) {
				randomNum += Math.floor(Math.random() * 10);
			}
			return randomNum;
		}

		//初始化收款账户列表
		function accountInit() {
			var accountPicker = new mui.SmartPicker({ title: "请选择收款账号", fireEvent: "accountChange" });
			accountPicker.setData(accountPickerList);
			$("#switch").on("tap", function() {
				document.activeElement.blur();
				accountPicker.show();
			});
		}

		//查询收款账户列表
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

		//切换收款账户监听事件
		window.addEventListener("accountChange", function(event) {
			var value = event.detail.value;
			currentAcct = iAccountInfoList[value].accountNo;
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
			//重新申请二维码
			getQrC2Ccode();
		});

		//查询二维码生产码，并生成二维码
		function getQrC2Ccode() {
			clearInterval(prepareInterval);
			$("#recResultDIV").html("");
			var url = mbank.getApiURL() + 'applyQrcodec2c.do';
			var param = {
				orderNo: writeRandomNum(10),
				orderTime: '',
				orderType: '31',
				merCatCode: '',
				id: '',
				name: customerNameCN, //收款方姓名
				termId: '',
				accNo: currentAcct,
				subId: '',
				subName: '',
				specFeeInfo: '',
				qrValidTime: "",
				limitCount: "",
				txnAmt: txnAmt,
				currencyCode: "156",
				invoiceSt: "",
				payeeComments: payeeComments //收款方备注
			}
			mbank.apiSend('post', url, param, getQrC2CcodeSuccess, getQrC2CcodeError, true);

			function getQrC2CcodeSuccess(data) {
				qrcode = data.qrCode;
				orderNo = data.orderNo;
				if(qrcode == '' || qrcode == null) {
					mui.alert("收款二维码生成失败");
				} else {
					reqReserved = data.reqReserved;
					var width = document.getElementById('qrcode').clientWidth;
					$("#qrcode").html('<div id="codeico" class="payicon1" style="display: none;"></div>');
					//生成收款码
					generateQRC2CCode("canvas", width, width, qrcode);
					sign = true;
					//获取实时收款通知
					prepareInterval = setInterval(function() {
						getRecNoticeList();
					}, 8000); //设置6秒自动 获取时实付款通知 直到页面关闭
					$("#showQrcode").css("visibility", "");
				}
			}

			function getQrC2CcodeError(data) {
				sign = false;
				mui.alert("二维码生成失败");
			}
		}

		//展示二维码
		function generateQRC2CCode(rendermethod, picwidth, picheight, url) {
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

		//点击保存收款码链接
		$("#saveRecQrcode").click(function() {
			saveQrC2Ccode();
		});

		//长按屏幕监听事件
		document.getElementById("qrcode").addEventListener("longtap", function(event) {
			plus.nativeUI.actionSheet({ cancel: "取消", buttons: [{ title: "保存收款码" }] },
				function(e) {
					switch(e.index) {
						case 1:
							//保存操作
							saveQrC2Ccode();
							break;
					}
				});
		});

		//保存收款码
		function saveQrC2Ccode() {
			//未签约
			if(!sign) {
				/*mui.alert("您尚未开通当面付款功能，请点击立即开启前往开通");*/
				mui.alert("您的收款码尚未生成，请先申请再点击保存收款码");
				return;
			}
			saveImageInfo();
		}

		//保存二维码图片信息
		function saveImageInfo() {
			//转换前将页面处理
			$("#qrsumSet").html("扫一扫二维码，向我付钱");
			$("#a_switch").hide();
			$("#recResultDIV").html("");
			$('#mycanvas').remove();

			//创建新的高清canvas画布 
			var _canvas = document.createElement("canvas");
			var w = $('#showQrcode').width();
			var h = $('#showQrcode').height();

			//画布显示区域位置调整
			_canvas.width = w * 2.27;
			_canvas.height = h * 2.85;
			_canvas.style.width = w + "px";
			_canvas.style.height = h + "px";

			//获取二维码图像对象
			var context = _canvas.getContext("2d");

			//将图像放大两倍画到画布上
			context.scale(2, 2);

			//将二维码图像中被覆盖个性图像调至第一层显示
			jQuery('#codeico').css('position', 'absolute');
			jQuery('#codeico').css('z-index', 11);

			//将div对象转换成canvas
			html2canvas($("#showQrcode"), {
				allowTaint: false,
				taintTest: true,
				canvas: _canvas,
				onrendered: function(canvas) {
					canvas.id = "mycanvas";

					//生成base64图片数据
					var image = new Image();

					//canvas对象转换成img base64编码
					image = canvas.toDataURL("png");

					//分割成数组
					var parts = image.split(';base64,');
					var base64Data = parts[1];

					//将base64图片数据转换成bitmap图片对象
					saveBitmap(base64Data);
				}
			});
			//转换后将页面还原
			if(payeeComments != "") {
				$("#qrsumSet").text("清除备注");
			} else if(txnAmt > 0) {
				$("#qrsumSet").text("清除金额");
			} else {
				$("#qrsumSet").html("设置金额");
			}
			$("#a_switch").show();
		}

		//保存图片
		function saveBitmap(base64Data) {
			var bitmap = new plus.nativeObj.Bitmap("test");
			// 加载Base64编码格式图片到Bitmap对象
			bitmap.loadBase64Data(base64Data, function() {
				//console.log("加载Base64图片数据成功");
			}, function() {
				//console.log('加载Base64图片数据失败：' + JSON.stringify(e));
			});

			var currentDate = new Date();
			//转成14位日期格式
			currentDate = currentDate.format("yyyymmddhhmmss");
			//定义文件名，保存图片到本地路径
			var fileName = "_doc/" + currentDate + '_qrcode.png';

			//进行保存操作
			bitmap.save(fileName, {}, function(i) {
				//console.log('保存图片成功：'+JSON.stringify(i));
				//获取图片路径
				var imgUrl = i.target;

				//保存图片到相册
				plus.gallery.save(imgUrl, function() {
					mui.alert('保存收款码成功');
				}, function() {
					mui.alert('保存收款码失败');
				});

				//回收Bitmap图片内存
				bitmap.recycle();
			}, function(e) {
				//console.log('保存图片失败：'+JSON.stringify(e));
				mui.toast('保存收款码失败');
			});
		}

		//设置或清除金额 备注
		$("#qrsumSet").click(function() {
			if(txnAmt > 0 || payeeComments != "") {
				txnAmt = "";
				payeeComments = "";
				$("#qrsumSet").text("设置金额");
				$("#showQrsum").css("display", "none");
				$("#txnAmt").text("");
				$("#p_txnAmt").hide();
				$("#p_payeeComments").hide();
				$("#payeeComments").text("");
				//重新申请二维码
				getQrC2Ccode();
			} else {
				clearInterval(prepareInterval);
				mbank.openWindowByLoad("../qrcodePay/qrsumSet.html", "qrsumSet", "slide-in-right", false);
			}
		});

		//设置金额后返回监听
		window.addEventListener("refreshScannedQRc2c", function(event) {
			//设置开启二维码支付功能 返回标识
			var qrCodesetBack = event.detail.qrCodesetBack;
			//未设置金额或查看收款记录 返回标识
			var noSetFlag = event.detail.noSetFlag;
			if(qrCodesetBack) {
				$("#showQrcode").css("visibility", "hidden");
				$("#initShow").css("display", "none");
				searchSignInfo(); //验证是否签约
			} else {
				if(noSetFlag) {
					//获取实时收款通知
					prepareInterval = setInterval(function() {
						getRecNoticeList();
					}, 8000); //设置6秒自动 获取时实付款通知 直到页面关闭
				} else {
					txnAmt = ((parseFloat(event.detail.txnAmt)) * 100).toFixed(0);
					var fmtTxnAmt = event.detail.txnAmt;
					payeeComments = event.detail.payeeComments;
					$("#showQrsum").css("display", "block");
					payeeComments = payeeComments.trim(); //去除空格
					if(payeeComments != "") {
						$("#p_payeeComments").show();
						$("#payeeComments").text(payeeComments);
						$("#qrsumSet").text("清除备注");
					}
					if(txnAmt > 0) {
						$("#qrsumSet").text("清除金额");
						$("#txnAmt").text(format.formatMoney(fmtTxnAmt, 2));
						$("#p_txnAmt").show();
					}
					//重新申请二维码
					getQrC2Ccode();
				}
			}
		});

		//轮询获取实时收款通知
		function getRecNoticeList() {
			//未签约
			if(!sign) {
				return;
			}
			var html = "";
			var mque = '<marquee direction="up" truespeed="truespeed" height="60px;" behavior="scroll" scrolldelay="220" id="recResultList"></marquee>';
			var url = mbank.getApiURL() + 'getQrcodeNotice.do';
			var param = {
				//订单号
				orderNo: orderNo,
				//手机唯一标识
				mbUUID: plus.device.uuid
			}
			mbank.apiSend('post', url, param, success, error, false);

			function success(data) {
				var getQrcodeNoticeList = data.getQrcodeNoticeList;
				if(getQrcodeNoticeList.length > 0) {
					for(var i = 0; i < getQrcodeNoticeList.length; i++) {
						var payName = getQrcodeNoticeList[i].payAccName;
						var payTxnAmt = getQrcodeNoticeList[i].transferAmt;
					    if (payName != null && payName != "") {
							html += '<div class="fkjg">' + payName + '已成功向您付款' + format.formatMoney(payTxnAmt) + '元</div>';
					    } else{
					    	html += '<div class="fkjg">您已成功收款一笔金额为:' + format.formatMoney(payTxnAmt) + '元</div>';
					    }
					}
					$("#recResultDIV").css('height', '60px;');
					$("#recResultDIV").empty().append(mque);
					$("#recResultList").html(html);
					if(lifeHome) {
						mui.fire(lifeHome, "refreshQRCodePay", {});
					}
					updateRecNoticeStt();
				} else {
					$("#recResultDIV").html("");
				}
			}

			function error(data) {
				$("#recResultDIV").html("");
			}
		}

		//将展示过收款结果更新为结果已展示状态
		function updateRecNoticeStt() {
			var url = mbank.getApiURL() + 'updateOrderNoStt.do';
			var params = {
				//订单号
				orderNo: orderNo
			}
			mbank.apiSend('post', url, params, updateSttSuccess, updateSttError, false);

			function updateSttSuccess(data) {
				console.log("===更新收款通知展示标示成功===");
			}

			function updateSttError(data) {
				console.log("===更新收款通知展示标示失败===");
			}
		}

		//点击收款记录链接
		$("#recRecord").click(function() {
			//未签约
			/*if(!sign) {
				mui.alert("您尚未开通当面付款功能，请点击立即开启前往开通");
				return;
			}*/
			clearInterval(prepareInterval);
			var recParams = { queryType: '1' };
			mbank.openWindowByLoad("../qrcodePay/consumingQuery.html", "consumingQuery", "slide-in-right", recParams);
		});

		//返回函数
		mui.back = function() {
			plus.webview.close(self);
		}

	});
});