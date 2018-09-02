/**
 * 
 */
define(function(require, exports, module) {
	var userInfo = require('./userInfo');
	var nativeUI = require('./nativeUI');
	var isDemo = false; //为true时，从./virtualHost文件下读取报文
	var productMode = true; //产品工厂为true时，从./virtualHost文件下读取报文
	var virtualHostPath = '_www/virtualHost/';
	/**
	 * 当前银行/TODO上线时切忌修改
	 * liana_bankName 银行名称
	 * liana_bankUnicode 银行清算行号
	 * serverPath 手机网银后台地址  
	 * productFactory 产品工厂地址 (根据业务需求)
	 */
	var hubei = {
		liana_bankName: '湖北银行',
		//清算行号根据个人网银现有进行配置
		liana_bankUnicode: '313662000015',
		liana_serverPath: 'https://ebank.hubeibank.cn:446/perbank/',
		liana_productFactory: 'https://ebank.hubeibank.cn:446/perbank/',//生产
		liana_headerLogo: 'header_logo.png',
		liana_mainURL: '../views/main/main.html',
		liana_appName: "湖北银行",
		liana_hotlinePhone:"96599",
		liana_domain:"www.hubeibank.cn",
		liana_remoteUrl:"https://ebank.hubeibank.cn:446/perbank/mbank/img/",
		liana_versionUpdateUrl:"https://itunes.apple.com/us/app/%E6%B9%96%E5%8C%97%E9%93%B6%E8%A1%8C%E4%B8%AA%E4%BA%BA%E6%89%8B%E6%9C%BA%E9%93%B6%E8%A1%8C%E5%AE%A2%E6%88%B7%E7%AB%AF/id718080432?mt=8"
	};
	var shenma = {
		liana_bankName: '湖北银行',
		//清算行号根据个人网银现有进行配置
		liana_bankUnicode: '313662000015',
		liana_serverPath: 'http://192.168.102.215:8082/perbank/',
		liana_productFactory: 'http://192.168.10.162:8081/perbank/',//生产
		liana_headerLogo: 'header_logo.png',
		liana_mainURL: '../views/main/main.html',
		liana_appName: "湖北银行",
		liana_hotlinePhone:"96599",
		liana_domain:"www.hubeibank.cn",
		liana_remoteUrl:"http://192.168.10.162:8090/perbank/mbank/img/",
		liana_versionUpdateUrl:"https://ebank.hubeibank.cn/perbank/mobileupload/down.html"
	};
	
	var bankId = shenma;
	if(productMode){
		bankId = hubei;
	}
	
//	var Vue = require('../common/vue.min');
//	exports.vm = new Vue({
//	    el: 'body',
//	    data: bankId
//	  })
	/**
	 * 当前银行/TODO上线时切忌修改
	 * liana_bankName 银行名称
	 * liana_bankUnicode 银行清算行号
	 * serverPath 手机网银后台地址 
	 * productFactory 产品工厂地址 (根据业务需求)
	 */

	var sysSessionTimeout = 600000;
	var timecontroller = false;
	exports.getBankName = function() {
		return bankId.liana_bankName;
	}
	exports.getAppName = function() {
		return bankId.liana_appName;
	}
	exports.getBankUnicode = function() {
		return bankId.liana_bankUnicode;
	}
	exports.getApiURL = function() {
		if(isDemo) {
			return virtualHostPath;
		} else {
			return bankId.liana_serverPath;
		}
	};
	exports.getPFURL = function() {
		if(productMode) {
			return virtualHostPath;
		} else {
			return bankId.liana_productFactory;
		}
	};
	exports.isDemo = function(){
		return isDemo;
	}
	
	exports.productMode = function(){
		return productMode;
	}
	
	exports.getRemoteUrl = function(){
		return bankId.liana_remoteUrl;
	}
	exports.getVersionUpdateUrl = function(){
		return bankId.liana_versionUpdateUrl;
	}
	
	/*
	 * 新增openWindow方法
	 * package ：webview文件路径
	 * pageId： webview唯一id标识
	 * aniShow ：webview展示动画
	 * param ： 传参值json串
	 * styleJson： webview 样式参数
	 * COMMON_USER:客户类型控制
	 */
	exports.openWindowByLoad = function(package, pageId, aniShow, param, styleJson) {
		param = param || {};
		var nocheck = param.noCheck||param.nocheck;
		var nocheckLogon = true;
		if(!nocheck){//false null undefine '' 0
			nocheckLogon = true;
		}else if(typeof nocheck=='string'){
			nocheckLogon = nocheck=='true'?true:false;
		}
		if(nocheckLogon||exports.checkLogon('_www/views/')){
			var userType = localStorage.getItem('customerType');
			var COMMON_USER = jQuery.param&&jQuery.param.COMMON_USER||[];
			if(userType=='00'&&COMMON_USER.indexOf(pageId)!=-1){
				package = '../public/upgrate_warn.html';
				pageId = 'upgrate_warn';
			}
			//防止重复打开同一页面
			if(localStorage.getItem("resubmit_page_id")!=pageId){
				var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框
				//先关闭再打开新的
				plus.webview.hide(pageId);
				plus.webview.close(pageId);
				styleJson = styleJson || {};
				var webviewShow = plus.webview.create(package, pageId, styleJson, param);
				//禁用IOS原生手势关闭
				webviewShow.setStyle({popGesture:"none"});
				localStorage.setItem("resubmit_page_id",pageId);
				webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件
					nwaiting.close(); //新webview的载入完毕后关闭等待框
					localStorage.removeItem("resubmit_page_id");
					webviewShow.show(aniShow, 150,function(){
						if( webviewShow.id!="login" && webviewShow.id!="loginByFinger" && webviewShow.id!="unlock" 
						    && webviewShow.id!="boundSuccess" && webviewShow.id!="userLockerFirst" ){
						    if( !param.noClearDestination ){//需要清空登录后要进入的菜单信息
						    	 exports.clearDestinationPage();	
						    } 
							plus.webview.close(plus.webview.getWebviewById("login"));
							plus.webview.close(plus.webview.getWebviewById("loginByFinger"));
							plus.webview.close(plus.webview.getWebviewById("unlock"));	
							plus.webview.close(plus.webview.getWebviewById("boundSuccess"));
							plus.webview.close(plus.webview.getWebviewById("userLockerFirst"));
						}							
					});
				}, false);
			}
		
		}else{
			var destinationPage={
				package:package, 
				pageId:pageId, 
				aniShow:aniShow, 
				param:param, 
				styleJson:styleJson
			};
			exports.setDestinationPage(destinationPage);
		}
	};





	/**
	 * 六格密码框
	 * @param {Object} param        密码框div的各个元素
	 * @param {Function} funCheck	执行验密操作的校验函数
	 * @param {Function} funRequest	输入6位密码后的操作，函数的参数为密码
	 */
	exports.openPswDiv = function(param, funCheck, funRequest) {

		param.btn.click(function() {
			if(typeof(funCheck) == "function" && funCheck()) {
				param.body.css("overflow-y", "hidden");
				param.bgBland.css({
					"height": param.window.height() + param.window.scrollTop(),
					"width": param.window.width()
				});
				param.pop.fadeIn(300);
				param.keyboard.fadeIn(300);
				param.bgBland.fadeIn(300);
				setTimeout(openSoftKeyboard, 200);
			}
		});

		function hidePop() {
			param.pop.fadeOut(300, function() {
				param.body.css("overflow-y", "auto");
			});
			param.keyboard.fadeOut(300);
			param.bgBland.fadeOut(300);
			param.input.val("");
			keys = [];
		}
		param.bgBland.click(function() {
			hidePop();
		});
		param.close.click(function() {
			hidePop();
		});

		var openSoftKeyboard = function() {
			if($.param.SOFTPWD_SWITCH == false) { // 软键盘开关
				if(mui.os.ios) {
					var webView = plus.webview.currentWebview()
						.nativeInstanceObject();
					webView.plusCallMethod({
						"setKeyboardDisplayRequiresUserAction": false
					});
				} else {
					var webview = plus.android.currentWebview();
					plus.android.importClass(webview);
					webview.requestFocus();
					var Context = plus.android
						.importClass("android.content.Context");
					var InputMethodManager = plus.android
						.importClass("android.view.inputmethod.InputMethodManager");
					var main = plus.android.runtimeMainActivity();
					var imm = main
						.getSystemService(Context.INPUT_METHOD_SERVICE);
					imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
				}
				var keys = []; // 记录输入的数组
				document.onkeydown = function(e) {
					if(param.pop.css('display') == "none") {
						return;
					}
					e = e || window.event
					var len = keys.length;

					if(e.keyCode == "8") { // 8为 回退
						if(len != 0) {
							keys.pop();
							--len;
							for(var index = 1; index <= 6; index++) {
								if(len < index) {
									param.input.eq(index - 1).val("");
								}
							}
						}
					} else {
						keys.push(String.fromCharCode(e.keyCode));
						param.input.eq(keys.length - 1).val("1");
						++len;
						if(len == 6) {
							var psw = "";
							for(var index = 0; index < 6; index++) {
								psw += keys[index];
							}
							hidePop();
							if(funRequest != null &&
								typeof(funRequest) == "function") {
								funRequest(psw);
							}
						}
					}
				};
			} else {
				openNumKeyBoard();
			}

		};

		function closeKeyBoard() {
			plus.pluginNumKeyBoard.closeNumKeyboard(function(result) {}, function(result) {});
		};

		function openNumKeyBoard() {
			for(var index = 0; index < 6; index++) {
				param.input.eq(index).val("");
			}
			plus.pluginNumKeyBoard
				.openNumKeyboard(
					"3des",
					function(result) {
						if(result) {
							if(result.status) {
								var json = result.payload;
								var obj = $.parseJSON(json);
								document.getElementById(param.hiddenPswInput).value = obj.cipherText;
								var len = obj.text.length;
								for(var index = 0; index < len; index++) {
									param.input.eq(index).val("1");
								}
								for(var index = len; index < 6; index++) {
									param.input.eq(index).val("");
								}
								if(len == 6) {
									funRequest(obj.cipherText);
									closeKeyBoard();
								}
							} else {
								mui.alert(result.message);
							}
						} else {
							mui.alert("调用插件时发生异常。");
						}
					},
					function(result) {
						mui.alert(result);
					});
		}
	};

	/**
	 * 六格密码框:页面校验后调用该方法
	 * @param {Object} param        密码框div的各个元素
	 * @param {Function} funRequest	输入6位密码后的操作，函数的参数为密码  
	 */
	exports.showViewAndCheckPwd = function(param, funRequest) {
		param.body.css("overflow-y", "hidden");
		param.bgBland.css({
			"height": param.window.height() + param.window.scrollTop(),
			"width": param.window.width()
		});
		param.pop.fadeIn(300);
		param.keyboard.fadeIn(300);
		param.bgBland.fadeIn(300);
		setTimeout(openSoftKeyboard, 200);
		param.btn.click(function() {

			param.body.css("overflow-y", "hidden");
			param.bgBland.css({
				"height": param.window.height() + param.window.scrollTop(),
				"width": param.window.width()
			});
			param.pop.fadeIn(300);
			param.keyboard.fadeIn(300);
			param.bgBland.fadeIn(300);
			setTimeout(openSoftKeyboard, 200);

		});

		function hidePop() {
			param.pop.fadeOut(300, function() {
				param.body.css("overflow-y", "auto");
			});
			param.keyboard.fadeOut(300);
			param.bgBland.fadeOut(300);
			param.input.val("");
			keys = [];
		}
		/*param.bgBland.click(function() {
			hidePop();
		});*/
		param.close.click(function() {
			hidePop();
		});

		var openSoftKeyboard = function() {
			if($.param.SOFTPWD_SWITCH == false) { // 软键盘开关
				if(mui.os.ios) {
					setTimeout(function() {
						var webView = plus.webview.currentWebview()
							.nativeInstanceObject();
						webView.plusCallMethod({
							"setKeyboardDisplayRequiresUserAction": false
						});
					}, 330)

				} else {
					setTimeout(function() {
						var webview = plus.android.currentWebview();
						plus.android.importClass(webview);
						webview.requestFocus();
						var Context = plus.android
							.importClass("android.content.Context");
						var InputMethodManager = plus.android
							.importClass("android.view.inputmethod.InputMethodManager");
						var main = plus.android.runtimeMainActivity();
						var imm = main
							.getSystemService(Context.INPUT_METHOD_SERVICE);
						imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
					}, 330);

				}
				var keys = []; // 记录输入的数组
				document.onkeydown = function(e) {
					if(param.pop.css('display') == "none") {
						return;
					}
					e = e || window.event
					var len = keys.length;

					if(e.keyCode == "8") { // 8为 回退
						if(len != 0) {
							keys.pop();
							--len;
							for(var index = 1; index <= 6; index++) {
								if(len < index) {
									param.input.eq(index - 1).val("");
								}
							}
						}
					} else {
						keys.push(String.fromCharCode(e.keyCode));
						param.input.eq(keys.length - 1).val("1");
						++len;
						if(len == 6) {
							var psw = "";
							for(var index = 0; index < 6; index++) {
								psw += keys[index];
							}
							hidePop();
							if(funRequest != null &&
								typeof(funRequest) == "function") {
								funRequest(psw);
							}
						}
					}
				};
			} else {
				openNumKeyBoard();
			}

		};

		function closeKeyBoard() {
			plus.pluginNumKeyBoard.closeNumKeyboard(function(result) {}, function(result) {});
		};

		function openNumKeyBoard() {
			for(var index = 0; index < 6; index++) {
				param.input.eq(index).val("");
			}
			plus.pluginNumKeyBoard
				.openNumKeyboard(
					"3des",
					function(result) {
						if(result) {
							if(result.status) {
								var json = result.payload;
								var obj = $.parseJSON(json);
								document.getElementById(param.hiddenPswInput).value = obj.cipherText;
								var len = obj.text.length;
								for(var index = 0; index < len; index++) {
									param.input.eq(index).val("1");
								}
								for(var index = len; index < 6; index++) {
									param.input.eq(index).val("");
								}
								if(len == 6) {
									funRequest(obj.cipherText);
									closeKeyBoard();
								}
							} else {
								mui.alert(result.message);
							}
						} else {
							mui.alert("调用插件时发生异常。");
						}
					},
					function(result) {
						mui.alert(result);
					});
		}
	};

	exports.openUrl = function(url, id, params) {
		mui.openWindow(url, id, {
			show: {
				duration: 200
			},
			extras: params || {},
			waiting: {
				autoShow: false,
				padlock: true
			}
		});
	};

	exports.apiSend = function(method, url, params, successCallback, errorCallback, wait) {
		if(isDemo) {
			//读取本地虚拟报文
			nativeUI.readLocalFile(url,successCallback);
		} else {
			var network = plus.networkinfo.getCurrentType();
			if(network < 2) {
				plus.nativeUI.toast('您的网络未连接,建议在wifi情况下浏览。', undefined, exports.getAppName);
			} else {
					this._apiSend(method, url, params, successCallback, errorCallback, wait);
			}
		}
	};

	exports._apiSend = function(method, url, params, successCallback, errorCallback, wait) {
		//避免超时重复发送接口
		if(timecontroller){
			return;
		}
		
		if(wait === undefined) {
			wait = true;
		}
		params=params||{};
		var liana_notCheckUrl=true;
		if(params&&params.liana_notCheckUrl==false){
			liana_notCheckUrl=false;
		}
		//超时校验
		var lastOptionTime = localStorage.getItem("Sys_lastOpentionTime");
		
			if("" == lastOptionTime || null == lastOptionTime || "null" == lastOptionTime) {
			lastOptionTime = new Date().getTime();
			localStorage.setItem("Sys_lastOpentionTime", lastOptionTime);
			} else {
				localStorage.removeItem('sessiontimeout');
				if(new Date().getTime() - lastOptionTime >= sysSessionTimeout) {
					if(liana_notCheckUrl){
						localStorage.removeItem('sessionId');
					    localStorage.removeItem('Sys_lastOpentionTime');
						plus.nativeUI.toast('会话已超时请重新登录', undefined, exports.getAppName);
						localStorage.setItem('sessiontimeout','true');
						timecontroller = true;
						//延时登陆，避免页面切换后登陆页面无法调起
						setTimeout(function(){
							exports.checkLogon(undefined,true);
						},500);
						return;
					}
					
				} else {
					localStorage.setItem("Sys_lastOpentionTime", new Date().getTime());
				}
			}
		
		if(wait == true) {
			var waitTitle = '加载中...';
			if('waitTitle' in params) {
				waitTitle = params.waitTitle;
				delete params.waitTitle;
			}
			plus.nativeUI.showWaiting(waitTitle, {
				padlock: false
			});
		}
		var self = this;
		params = params || {};

		var param = {
			"EMP_SID": userInfo.get("sessionId"),
			"mac": localStorage.getItem("userMac"),
			"channel": "02",
			"responseFormat": "JSON"
		};
		params = this.extend(params, param);
		console.log('请求:'+url+'参数' + JSON.stringify(params));
//		console.log('请求连接' + url);
		//console.log(JSON.stringify(param));
		//		params.ajax = 1;
		var timeout = 30000;
		if(url.indexOf('queryQrcodeStatus.do')!=-1){
			timeout = 60000;
		}
		if(wait === 'ignore'){
			timeout = 5000;
		}
		mui.ajax(url, {
			headers: {
				'APP_UUID': plus ? plus.device.uuid : '',
				'PLATFORM': plus ? plus.os.name : '',
				"JSESSION_SID": userInfo.get("sessionId")
			},
			data: params,
			dataType: 'json', //服务器返回json格式数据
			type: method, //HTTP请求类型
			traditional:true,
			timeout: timeout, //超时时间设置为20秒；
			success: function(data) {
				//服务器返回响应，根据响应结果，分析是否登录成功；
				console.log('返回:'+url+',信息:' + JSON.stringify(data));
				localStorage.removeItem('sessiontimeout');
				if(wait) {
					plus.nativeUI.closeWaiting();
				}
				if(0 === parseInt(data.ec)) {

					if(typeof successCallback == 'function') {
						successCallback(data);
					} else {
						plus.nativeUI.toast('缺少回调函数', undefined, exports.getAppName);
					}

				} else {
					if(data.ec == '20000' || data.ec =='EBLN1001')  {
						userInfo.removeItem("sessionId");
//						plus.nativeUI.toast(data.em);
						localStorage.setItem('sessiontimeout','true');
						timecontroller = true;
						//延时登陆，避免页面切换后登陆页面无法调起
						setTimeout(function(){
							exports.checkLogon(undefined,true);
						},500);
						return;
					} else if(data.ec == 'EFNT'){
						mui.alert('交易数据量过大');
						return;
					}
					if(typeof errorCallback == 'function') {
						errorCallback(data);
					} else {
//						mui.alert(data.em);--非原生弹出框 点击有遮罩--暂未可用
						mui.toast(data.em);
						return;
						/*function goLogin(){
							mui.openWindow({
							url: '../login/login.html',
							id: 'login',
							show: {
								aniShow: 'pop-in'
							},
							styles: {
								popGesture: 'hide'
							},
							waiting: {
								autoShow: false
							}
						});
						}*/

					}
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type + '_' + method + '_' + url);
				if(wait) {
					plus.nativeUI.closeWaiting();
				}
				if(errorCallback && errorCallback['error'] && typeof errorCallback['error'] == 'function') {
					console.log('callback');
					errorCallback['error']();
				} else {
					//mui.alert('网络请求超时,请稍后再试')
					if(typeof errorCallback == 'function') {
						if(url.indexOf('queryQrcodeStatus.do') != -1){
							return;
						}else{
							xhr.em="网络请求超时,请稍后再试";
							errorCallback(xhr);
						}
					} else{
						if(url.indexOf('queryQrcodeStatus.do') != -1){
							return;
						}else{
							plus.nativeUI.toast('网络请求超时,请稍后再试');
					  		return;
						}
					  
					}
					
				}
				//				mui.back();
			}
		});
	};
	exports.quitApp = function(callback) {
		document.addEventListener("netchange", function() {
			var network = plus.networkinfo.getCurrentType();
			if(network < 2) {
				if(this.network > 1) {
					plus.nativeUI.toast('您的网络已断开', undefined, exports.getAppName);
				}
			}

			if(this.network == 3 && network > 3) {
				plus.nativeUI.toast('您网络已从wifi切换到蜂窝网络，浏览会产生流量', undefined, exports.getAppName, '我知道了');
			}

			this.network = network;
		});
		var first = null;
		plus.key.addEventListener('backbutton', function() {
			if(callback) {
				callback();
			} else {
				//首次按键，提示‘再按一次退出应用’
				var cowv = plus.webview.getWebviewById('checkorder');
				if(cowv) {
					cowv.close();
					return false;
				}
				if(!first) {
					var flag = 0;
					var webview =
						webview = plus.webview.getWebviewById('show-url');
					if(webview) {
						flag = 1;
						webview.canBack(function(e) {
							console.log("canback:" + e.canBack);
							if(!e.canBack) {
								webview.close();
							} else {
								webview.back();
							}
						});
					}

					if(flag) {
						return;
					}
					first = new Date().getTime();
					mui.toast('再按一次退出应用');
					setTimeout(function() {
						first = null;
					}, 1000);
				} else {
					if(new Date().getTime() - first < 1000) {
						plus.runtime.quit();
					}
				}
			}
		}, false);
	};
	exports.pushMessage = function() {
		plus.push.createMessage('我是一个消息', '我是一个消息扩展', {
			title: '免息来拿',
			cover: false
		});
		plus.push.addEventListener("click", function(msg) {
			// 分析msg.payload处理业务逻辑 
			mui.alert("You clicked: " + msg.content);
		}, false);
	};
	exports.extend = function() {

		var _result = {},
			arr = arguments;
		//遍历属性，至后向前
		if(!arr.length) return {};
		for(var i = arr.length - 1; i >= 0; i--) {
			this._extend(arr[i], _result);
		}
		arr[0] = _result;
		return _result;
	};
	exports._extend = function me(dest, source) {
		for(var name in dest) {
			if(dest.hasOwnProperty(name)) {
				//当前属性是否为对象,如果为对象，则进行递归
				if((dest[name] instanceof Object) && (source[name] instanceof Object)) {
					me(dest[name], source[name]);
				}
				//检测该属性是否存在
				if(source.hasOwnProperty(name)) {
					continue;
				} else {
					source[name] = dest[name];
				}
			}
		}
	}
	exports.setBankGroup = function(valueList, objId, recType, currentElement) {
		var optionObj = "";
		var arrayList0 = new Array(); //本行
		var arrayList1 = new Array(); //国有商业银行1开头还有交通银行301
		var arrayList2 = new Array(); //股份制银行
		var arrayList3 = new Array(); //城市商业银行313
		var arrayList4 = new Array(); //农村商业银行314
		var arrayList5 = new Array(); //农村信用社402
		var arrayList6 = new Array(); //外资5,6,7,8,9开头
		var arrayList7 = new Array(); //政策性银行2开头
        var arrayList8 = new Array(); //村镇银行320开头
		for(var i = 0; i < valueList.length; i++) {
			var unionNo = valueList[i]['unionBankNo'];
			var bankName =valueList[i]['bankName'];
			if(unionNo == bankId.liana_bankUnicode||bankName==bankId.liana_bankName) { //本行
				
				arrayList0.push({unionBankNo:bankId.liana_bankUnicode,bankName:bankId.liana_bankName});
			} else { //他行
				if(unionNo.substring(0, 1) == "1" || unionNo.substring(0, 3) == "301") {
					arrayList1.push(valueList[i]);
				} else if(unionNo.substring(0, 3) == "313") {
					arrayList3.push(valueList[i]);
				} else if(unionNo.substring(0, 3) == "314") {
					arrayList4.push(valueList[i]);
				} else if(unionNo.substring(0, 3) == "402") {
					arrayList5.push(valueList[i]);
				}else if(unionNo.substring(0, 3) == "320") {
					arrayList8.push(valueList[i]);
				} else if(unionNo.substring(0, 1) == "5" || unionNo.substring(0, 1) == "6" || unionNo.substring(0, 1) == "7" || unionNo.substring(0, 1) == "8" || unionNo.substring(0, 1) == "9") {
					arrayList6.push(valueList[i]);
				} else if(unionNo.substring(0, 1) == "2") {
					arrayList7.push(valueList[i]);
				} else {
					arrayList2.push(valueList[i]);
				}
			}

		}
		arrayList1 = this.sortBank(arrayList1);
		arrayList2 = this.sortBank(arrayList2);
		arrayList3 = this.sortBank(arrayList3);
		arrayList4 = this.sortBank(arrayList4);
		arrayList5 = this.sortBank(arrayList5);
		arrayList6 = this.sortBank(arrayList6);
		arrayList7 = this.sortBank(arrayList7);
		arrayList8 = this.sortBank(arrayList8);

		optionObj += "<option value='0'>请选择</option>";
		optionObj += this.formateBankGroup("本行", arrayList0, recType);
		optionObj += this.formateBankGroup("国有商业银行", arrayList1, recType);
		optionObj += this.formateBankGroup("股份制商业银行", arrayList2, recType);
		optionObj += this.formateBankGroup("政策性银行", arrayList7, recType);
		optionObj += this.formateBankGroup("城市商业银行", arrayList3, recType);
		optionObj += this.formateBankGroup("农村商业银行", arrayList4, recType);
		optionObj += this.formateBankGroup("农村信用社", arrayList5, recType);
		optionObj += this.formateBankGroup("村镇银行", arrayList8, recType);
		optionObj += this.formateBankGroup("外资银行及其他", arrayList6, recType);
		$("#" + objId + " #" + currentElement).append(optionObj);
	};

	exports.setBankData = function(valueList) {
		var arrayList1 = new Array(); //国有商业银行1开头还有交通银行301
		var arrayList2 = new Array(); //股份制银行
		var arrayList3 = new Array(); //城市商业银行313
		var arrayList4 = new Array(); //农村商业银行314
		var arrayList5 = new Array(); //农村信用社402
		var arrayList6 = new Array(); //外资5,6,7,8,9开头
		var arrayList7 = new Array(); //政策性银行2开头

		for(var i = 0; i < valueList.length; i++) {
			var unionNo = valueList[i]['unionBankNo'];
			if(unionNo.substring(0, 1) == "1" || unionNo.substring(0, 3) == "301") {
				arrayList1.push(valueList[i]);
			} else if(unionNo.substring(0, 3) == "313") {
				arrayList3.push(valueList[i]);
			} else if(unionNo.substring(0, 3) == "314") {
				arrayList4.push(valueList[i]);
			} else if(unionNo.substring(0, 3) == "402") {
				arrayList5.push(valueList[i]);
			} else if(unionNo.substring(0, 1) == "5" || unionNo.substring(0, 1) == "6" || unionNo.substring(0, 1) == "7" || unionNo.substring(0, 1) == "8" || unionNo.substring(0, 1) == "9") {
				arrayList6.push(valueList[i]);
			} else if(unionNo.substring(0, 1) == "2") {
				arrayList7.push(valueList[i]);
			} else {
				arrayList2.push(valueList[i]);
			}
		}
		arrayList1 = this.sortBank(arrayList1);
		arrayList2 = this.sortBank(arrayList2);
		arrayList3 = this.sortBank(arrayList3);
		arrayList4 = this.sortBank(arrayList4);
		arrayList5 = this.sortBank(arrayList5);
		arrayList6 = this.sortBank(arrayList6);
		arrayList7 = this.sortBank(arrayList7);

		var bankData = [];
		bankData.push(this.pushBank("110000", "国有商业银行", arrayList1));
		bankData.push(this.pushBank("120000", "股份制银行", arrayList2));
		bankData.push(this.pushBank("130000", "城市商业银行", arrayList3));
		bankData.push(this.pushBank("140000", "农村商业银行", arrayList4));
		bankData.push(this.pushBank("150000", "农村信用社", arrayList5));
		bankData.push(this.pushBank("160000", "外资", arrayList6));
		bankData.push(this.pushBank("170000", "政策性银行", arrayList7));
		return bankData;
	};
	exports.pushBank = function(val, tex, arr) {
		var obj = {};
		obj.value = val;
		obj.text = tex;
		obj.children = [];
		for(var i = 0; i < arr.length; i++) {
			obj.children.push({
				value: val + i + 1,
				text: arr[i]['bankName']
			});
		}
		return obj;
	};

	exports.formateBankGroup = function(labelName, arrayList, recType) {
		var optionObj = "";
		if(arrayList.length > 0)
			optionObj += "<optgroup label='" + labelName + "'>";
		for(var i = 0; i < arrayList.length; i++) {

			optionObj += "<option value='" + arrayList[i]['unionBankNo'] + "' areaName='" + arrayList[i]['bankName'] + "'>" + arrayList[i]['bankName'] + "</option>";

			//optionObj += "<option value='" + arrayList[i]['unionBankNo'] + "' areaName='" + arrayList[i]['bankName'] + "'>" + arrayList[i]['bankName'] + "</option>";

		}
		if(arrayList.length > 0)
			optionObj += "</optgroup>";
		return optionObj;
	};
	exports.sortBank = function(arrayList) {
		var i = 0;
		var arrayList0 = new Array();
		for(var i = 0; i < arrayList.length; i++) {
			arrayList0.push(arrayList[i]['bankName']);
		}
		arrayList0.sort(function(a, b) {
			return a.localeCompare(b);
		});
		var arrayListNew = new Array();
		for(var i = 0; i < arrayList0.length; i++) {
			for(var j = 0; j < arrayList.length; j++) {
				if(arrayList[j]['bankName'] == arrayList0[i]) {
					arrayListNew.push(arrayList[j]);
				}
			}
		}
		return arrayListNew;
	};
	exports.getBankList = function(appName) { //mbank.param.js的银行列表转化成list
		var map = null;
		map = $.param[appName];
		var valueList = new Array();
		for(var key in map) {
			var value = map[key];
			valueList.push({
				"unionBankNo": key,
				"bankName": value
			});
		}
		return valueList;
	}
	exports.getModeId = function() {
		//var map = null;
		//map = $.param['MODEID_TYPE'];
		//console.log(JSON.stringify(map))
		//return map['mobileMode'];
		return $.param['MODEID_TYPE'];
	}
	exports.getServerUrl = function() {
			return serverPath;
		}
	//验证是否登录
	/**
	 * 
	 * @param {Object} prePath
	 * @param {Object} sessionTimeOut  是否会话超时登陆
	 * @param {Object} destinationPage 登录成功后要进入的页
	 */
	exports.checkLogon = function(prePath,sessionTimeOut,destinationPage) {
			var sessionid = localStorage.getItem('sessionId');
			var path = prePath || '_www/views/';
			var sessionTimeOut = sessionTimeOut||false;
			console.log("sessionId:"+sessionid+",isTimeout:"+sessionTimeOut+",destination:"+destinationPage)
			if(sessionid == '' || sessionid == null || sessionid == undefined) {
				exports.clearDestinationPage();
				if( destinationPage ){
					exports.setDestinationPage(destinationPage);
				}
				var params = userInfo.getItem('session_keys') || null;
				var logonId = userInfo.getItem("logonId")||"";
//				 if(mui.os.ios){
				 	var fingerKeys = userInfo.getItem("finger_keys") || null;
					if(fingerKeys != null && JSON.parse(fingerKeys).state == '0' && JSON.parse(fingerKeys).islock == '0' && logonId !=""){
						this.openWindowByLoad(path + 'login/loginByFinger.html', 'loginByFinger','pop-in', {nocheck:true,sessionTimeOut:sessionTimeOut});
					}else if(params != null && JSON.parse(params).state == '0' && JSON.parse(params).islock == '0' && logonId !="") { //state{0:开通；1：关闭；}  islock{0:正常；1：锁定}
						this.openWindowByLoad(path + 'login/unlock.html', 'unlock','pop-in', {nocheck:true,sessionTimeOut:sessionTimeOut});
					}else{
						this.openWindowByLoad(path + 'login/login.html', 'login','pop-in', {nocheck:true,sessionTimeOut:sessionTimeOut});
					}
				/*}else{
					if(params != null && JSON.parse(params).state == '0' && JSON.parse(params).islock == '0' && logonId !="") { //state{0:开通；1：关闭；}  islock{0:正常；1：锁定}
						this.openWindowByLoad(path + 'login/unlock.html', 'unlock','slide-in-right', {nocheck:true,sessionTimeOut:sessionTimeOut});
					} else {
						this.openWindowByLoad(path + 'login/login.html', 'login','slide-in-right', {nocheck:true,sessionTimeOut:sessionTimeOut});
					}
				}*/
				plus.nativeUI.closeWaiting();
				return false;
			}
			return true;
		}
	
	/**
	 * 非登陆条件下获取密码控件加密公钥与私钥
	 * @param keyContainer 
	 * publicKey
	 * key
	 */
	exports.getPasswordKey = function(keyContainer,successCallback){
		keyContainer = keyContainer||{};
		var url = this.getApiURL() + 'getPasswordKey.do';
		var params = {/*'async':false*/};
		exports.apiSend('post', url, params, okCallback, null, false);
		
		function okCallback(data){
			keyContainer['publicKey'] = data['publicKey'];
			keyContainer['key'] = data['searchKey'];
			if(successCallback && typeof successCallback =='function'){
				successCallback(keyContainer);
			}
		}
	}
	/**
	 * 登陆条件下获取密码控件加密公钥与私钥
	 * @param keyContainer 
	 * publicKey
	 * key
	 */
	exports.getPhoneKey = function(keyContainer,successCallback){
		keyContainer = keyContainer||{};
		var url = this.getApiURL() + 'getPhoneKey.do';
		var params = {/*'async':false*/};
		exports.apiSend('post', url, params, okCallback, null, false);
		
		function okCallback(data){
			keyContainer['publicKey'] = data['publicKey'];
			keyContainer['key'] = data['searchKey'];
			if(successCallback && typeof successCallback =='function'){
				successCallback(keyContainer);
			}
		}
	}
		//获取全部账号
		/**
		 * 
		 * @param {Object} callbackFun  回调函数
		 * @param {Object} accType  查询账户类型  2为借记卡类型  6为贷记卡类型  为空为全部
		 */
		exports.getAllAccountInfo = function(callbackFun,accType,isShow){
			var accContent;
			if (accType == '6') {
				accContent ="您还未绑定信用卡，是否现在绑定？";
			} else{
				accContent ="您还未绑卡是否现在就去绑定银行卡？";
			}
			var localAcctInfo = userInfo.get('iAccountInfo');
			var iAccountInfo ={};
			if(localAcctInfo){
				try{
					iAccountInfo = JSON.parse(localAcctInfo);
				}catch(e){
//					plus.nativeUI.toast('加载账户列表失败，请重新尝试', undefined, exports.getAppName);
					iAccountInfo = eval('('+localAcctInfo+')');
				}
			}
			
			var iAccountInfoTemp = [];
			if(!accType){
				iAccountInfoTemp = iAccountInfo;
			}else{
				for (var i=0; i<iAccountInfo.length;i++) {
				var accountinfo = iAccountInfo[i]['accountType'];
				if(accType&&accountinfo==accType){
					iAccountInfoTemp.push(iAccountInfo[i]);
					continue;
					}
				}
			}
			
			
			if(iAccountInfoTemp.length>0){
				if(typeof callbackFun == 'function') {
					callbackFun(iAccountInfoTemp);
				} else {
					plus.nativeUI.toast('网络请求超时,请稍后再试', undefined, exports.getAppName);
				}
			}else{
				callbackFun(iAccountInfoTemp);
				
				if(isShow){
					return false;
				}
				
				if(plus.os.name=='Android'){
					
//					plus.nativeUI.confirm(accContent, function(e) {
					mui.confirm(accContent, "提示", ["确认","取消"], function(e) {
						if(e.index == 0) {
							mui.openWindow({
								url: '_www/views/myOwn/addAccount.html',
								id: 'addAccount',
								show: {
									aniShow: 'pop-in'
								},
								styles: {
									top: '0px',
									bottom: '0px'
								},
								waiting: {
									autoShow: false
								},
								extras: {
									showAccType: accType
								}
							});
							//未绑定卡号时关闭提示框所在页面
//							plus.webview.close(self);//关闭不起作用
							plus.webview.currentWebview().hide();//先隐藏
							setTimeout(function(){
								plus.webview.currentWebview().close();
							},2000);//设置延时关闭 处理手机打开新页面卡顿问题
							plus.nativeUI.closeWaiting();
						} else {
//							mui.back();
							plus.webview.currentWebview().close();
							plus.nativeUI.closeWaiting();
						}
//					}, "提示", "nativeUI", ["确认", "取消"])
					})
				
				}else{
					mui.confirm(accContent, "提示", ["确认", "取消"], function(e) {
						if(e.index == 0) {
							mui.openWindow({
								url: '_www/views/myOwn/addAccount.html',
								id: 'addAccount',
								show: {
									aniShow: 'pop-in'
								},
								styles: {
									top: '0px',
									bottom: '0px'
								},
								waiting: {
									autoShow: false
								},
								extras: {
									showAccType: accType
								}
							});
							//未绑定卡号时关闭提示框所在页面
							plus.webview.currentWebview().hide();//先隐藏
							setTimeout(function(){
								plus.webview.currentWebview().close();
							},2000);//设置延时关闭 处理手机打开新页面卡顿问题
							plus.nativeUI.closeWaiting();
						} else {
							plus.webview.currentWebview().close();
							plus.nativeUI.closeWaiting();
						}
					} /*,"提示", "nativeUI", ["确认", "取消"]*/ )
				
				}
			}
		}
	exports.sendMsg2Cst = function(params) {
		$("#"+params.id).attr("disabled","disabled").addClass("disabled");
		var url = this.getApiURL() + 'sendMsgToCst.do';
		this.apiSend('post', url, {
			mobileNo: params.mobile,
			flag: "0",
			"liana_notCheckUrl":false,
			currentBusinessCode: "02000015"
		}, queryLogBack, null, false);

		function queryLogBack(d) {
			sendMessage(params.id, 60);
		}
		sendMessage = function(id, second) {

			if(second >= 0) {
				$("#" + id).html("重新获取(" + second + ")");
				second--;
				setTimeout(function() {
					sendMessage(id, second);
				}, 1000);
			} else {
				$("#" + id).html("获取验证码");
				$("#" + id).removeAttr("disabled").removeClass("disabled");
			}
		};
	}
    exports.sendPlatMsg2Cst =function(params){
			$("#"+params.id).attr("disabled","disabled").addClass("disabled");
			
		    var url = this.getApiURL() + 'sendMobilePassword.do';
		    var prefixSMSResult="您本次交易的手机动态密码：";
		    var suffixSMSResult="，请保密并确认本人操作";
			this.apiSend('post', url, {currentBusinessCode: "02000015",prefixSMSResult:prefixSMSResult,suffixSMSResult:suffixSMSResult}, queryLogBack, null, false);
			function queryLogBack(d) {
				sendMessage(params.id,60);
			}
			sendMessage=function(id,second){
			
			if(second>=0){
				$("#"+id).html("重新获取("+second +")");
				second--;
				setTimeout(function(){sendMessage(id,second);},1000);
			
			}else{
				$("#"+id).html("获取验证码");
				$("#" + id).removeAttr("disabled").removeClass("disabled");
			}
		};
       }
	exports.checkMobileMsg = function(code,mobileNo, actionfun) {
		var url = this.getApiURL() + 'sendMsgToCst.do';

		this.apiSend('post', url, {
			mobileVerifyCode: code,
			flag: "1",
			mobileNo:mobileNo,
			currentBusinessCode: "02000015"
		}, queryLogBack, null, false);

		function queryLogBack(d) {
			if(typeof(actionfun) == "function") {
				actionfun();
			}
		}

	}
	/**
	 * 湖北银行获取手机验证码
	 * @param {Object} params
	 */
    exports.getSmsCode =function(params){
	    $("#"+params.id).attr("disabled","disabled").addClass("disabled");
	    var requestParam = {};
	    var smsContent="";
	    if( "smsContent" in params ){
	    	smsContent=params.smsContent;
	    	requestParam['smsContent'] = smsContent;
	    }
	    var challengeNo="";
	    if( "challengeNo" in params ){
	    	challengeNo=params.challengeNo;
	    	requestParam['challengeNo'] = challengeNo;
	    }	    
	    var recAccount="";
	    if( "recAccount" in params ){
	    	recAccount=params.recAccount;
	    	requestParam['recAccount'] = recAccount;
	    }	
	    var payAmount="";
	    if( "payAmount" in params ){
	    	payAmount=params.payAmount;
	    	requestParam['payAmount'] = payAmount;
	    }		    
	    var url = this.getApiURL() + 'getSmsCode.do';
		this.apiSend('post', url, requestParam, queryLogBack, null, false);
		function queryLogBack(d) {
			sendMessage(params.id,99);
		}
		sendMessage=function(id,second){
		
			if(second>=0){
				$("#"+id).html("重新获取("+second +")");
				second--;
				setTimeout(function(){sendMessage(id,second);},1000);
			
			}else{
				$("#"+id).html("获取验证码");
				$("#" + id).removeAttr("disabled").removeClass("disabled");
			}
	    };
    }	
    
    
    
    /**
	 * 湖北银行非登陆注册获取手机验证码
	 * @param {Object} params
	 */
    exports.getMobileCode =function(btnId,params,callBack){
	    $("#"+btnId).attr("disabled","disabled").addClass("disabled");	
	    var url = this.getApiURL() + 'getMobileCode.do';
		this.apiSend('post', url, params, queryLogBack, errorCallBack, false);
		function queryLogBack(data) {
			sendMessage(btnId,99);
			if(typeof callBack=='function'){
				callBack(data);
			}
		}
		
		function errorCallBack(xhr){
			$("#"+btnId).removeAttr("disabled").removeClass("disabled");
			mui.alert(xhr.em);
			return;
		}
		
		sendMessage=function(id,second){
		
			if(second>=0){
				$("#"+id).html("重新获取("+second +")");
				second--;
				setTimeout(function(){sendMessage(id,second);},1000);
			
			}else{
				$("#"+id).html("获取验证码");
				$("#" + id).removeAttr("disabled").removeClass("disabled");
			}
	    };
    }	
	
	
	
	
	exports.isOpenView = function(id) {
			var wbv = plus.webview.getWebviewById(id);
			if(wbv) {
				return true;
			}
			return false;
		}
		/*
		 * ids  webview id集合 形如：['a','b']
		 */
	exports.closeviews = function(ids) {
		for(var i = 0; i < ids.length; i++) {
			plus.webview.hide(ids[i]);
			plus.webview.close(ids[i]);
		}
	}
	/**
	 * 
	 * @param {Object} currVer  当前版本号
	 * @param {Object} promoteVer  服务器端版本号
	 */
    exports.VersionCompare = function (currVer, promoteVer) {
	    currVer = currVer || "0.0.0";
	    promoteVer = promoteVer || "0.0.0";
	    if (currVer == promoteVer) return false;
	    var currVerArr = currVer.split(".");
	    var promoteVerArr = promoteVer.split(".");
	    var len = Math.max(currVerArr.length, promoteVerArr.length);
	    for (var i = 0; i < len; i++) {
	        var proVal = ~~promoteVerArr[i],
	            curVal = ~~currVerArr[i];
	        if (proVal < curVal) {
	            return false;
	        } else if (proVal > curVal) {
	            return true;
	        }
	    }
	    return false;
	};
	
	
	/**
	 * 回到首页
	 * @param {Object} refresh  是否刷新应用 ,即清除会话信息
	 * 处理一些超时退出的操作，比如关闭遮罩、删除登陆信息等
	 */
	exports.backToIndex = function(refresh){
		//回到首页后，清理超时标识
		localStorage.removeItem('sessiontimeout');
		localStorage.removeItem("resubmit_page_id");
		//获取主webview
		var indexView = plus.webview.getLaunchWebview();
		if(mui.os.ios){
			plus.webview.hide(indexView.id);
		}
		indexView.show("fade-in",150);
		mui.fire(indexView,'footer',{fid:'main'});
		
		//登出
		if(refresh){
			exports.logonOutTriggerEvent();
		}
	}
	
	/**
	 * 从子孙页面，回到业务首页
	 * @param {Object} destId   目标首页id
	 * @param {Object} originObj   mui.back
	 */
	exports.back = function(destId,originObj){
		var originObj = originObj||mui.noop;
		if(window.plus){
			var openner = plus.webview.currentWebview().opener();
        	if(openner && openner.id == destId){
        		console.log('是否预加载：'+plus.webview.currentWebview().preload)
        		originObj();
        	}else{
        		var destView = plus.webview.getWebviewById(destId);
        		var currView = plus.webview.currentWebview();
        		if(destView){
        			plus.webview.hide(destView.id,'none');
        			plus.webview.show(destView.id,'slide-in-right',150);
//      			mui.closeOpened(destView);//关闭目标页面打开的页面
        			exports.myCloseOpened(destView,currView);
        		}
        		//延时关闭当前页面
				setTimeout(function(){
					plus.webview.hide(currView.id,'none');
					mui.closeAll(currView);
				},400);
        	}
		}
		
	}
	
	/**
	 * 在叶子页面关闭根节点打开所有的叶子结点页面
	 * @param {Object} destView   根节点页面
	 * @param {Object} currtView  当前页面
	 * 之所以重新mui.closeOpened方法，是因为递归调用
	 * 依次从叶子最后结点开始关闭，因为当前方法是在当前页面触发
	 * 若当前页面关闭，则导致当前叶子结点页面的父节点页面删除失败
	 */
	exports.myCloseOpened = function(destView,currtView){
		var opened = destView.opened();
		if(opened) {
			for(var i = 0, len = opened.length; i < len; i++) {
				var openedWebview = opened[i];
				if(openedWebview.id == currtView.id){
					continue;
				}
				var open_open = openedWebview.opened();
				if(open_open && open_open.length > 0) {
					//关闭打开的webview
					exports.myCloseOpened(openedWebview,currtView);
					//关闭自己
					openedWebview.hide("none");
					openedWebview.close("none");
				} else {
					//如果直接孩子节点，就不用关闭了，因为父关闭的时候，会自动关闭子；
					if(openedWebview.parent() !== destView) {
						openedWebview.hide("none"); 
						openedWebview.close('none'); 
					}
				}
			}
		}
	}
	
	/**
	 * 显示等待加载框
	 * @param {Object} title  等待的标题
	 * @param {Object} options  等待框样式
	 */
	exports.showWaiting = function(title,options){
		plus.nativeUI.showWaiting(title,options);
	}
	
	/**
	 * 隐藏等待加载框
	 */
	exports.closeWaiting = function(){
		plus.nativeUI.closeWaiting();
	}
	
	/**
	 * 读取本地指定路径的JSON文件
	 * @param {Object} url  json文件路径
	 * @param {Object} callback  回调函数
	 */
	exports.readLocalJsonFile = function(url,callback){
		nativeUI.readLocalFile(url,callback);
	}
	
	/**
	 * 通过调研此方法，绑定tab事件到每个菜单,DOM上需设置path pageId
	 * 获取path属性进入到对应页面
	 * 获取nocheck属性验证是否需要验证登陆
	 * context 为选择区域的上下文
	 */
	exports.bindTagToMenuPath = function(context){
		var eventName = mui.os.android?'click':'tap';
		var targetObjs = context?document.querySelectorAll(context+" a"):document.querySelectorAll('a');
		for (var i=0;i<targetObjs.length;i++) {
			var oEle = targetObjs[i];
			if(oEle.getAttribute('path')){
				var url = oEle.getAttribute('path');
				var nocheck = oEle.getAttribute('noCheck');
				var pageId = oEle.getAttribute('id');
				oEle.addEventListener(eventName,function(){
					exports.openWindowByLoad(url,pageId,"slide-in-right",{noCheck:nocheck});
				},false);
				
			}
		}
	}
	/**
	 * 
	 * 查询信用卡账户列表
	 * accountType：2(账户类型信用卡)
	 */
	exports.getCreditCardAcc = function(accbackfun){
		var url = this.getApiURL() + 'getCreditCardList.do';
		this.apiSend('post', url, {
			accountType: "2"
		}, callBack, null, false);
		
		function callBack(data){
			var creditCardList = data.iAccountInfoTmp;
			var length = creditCardList.length;
			if (length > 0) {
				if(typeof accbackfun == 'function') {
					accbackfun(creditCardList);
				} else {
					plus.nativeUI.toast('网络请求超时,请稍后再试', undefined, exports.getAppName);
				}
			} else{
				accbackfun(creditCardList);
				if(plus.os.name == 'Android') {
//					plus.nativeUI.confirm("您还未绑卡是否现在就去绑定信用卡？", function(e) {
					mui.confirm("您还未绑卡是否现在就去绑定信用卡？", "提示", ["确认", "取消"], function(e) {	
						if(e.index == 0) {
							mui.openWindow({
								url: '_www/views/myOwn/addAccount.html',
								id: 'addAccount',
								show: {
									aniShow: 'pop-in'
								},
								styles: {
									top: '0px',
									bottom: '0px'
								},
								waiting: {
									autoShow: false
								}
							});
							//未绑定卡号时关闭提示框所在页面
							plus.webview.currentWebview().hide();//先隐藏
							setTimeout(function(){
								plus.webview.currentWebview().close();
							},2000);//设置延时关闭 处理手机打开新页面卡顿问题
							plus.nativeUI.closeWaiting();
						} else {
							plus.webview.currentWebview().close();
							plus.nativeUI.closeWaiting();
						}
					})
//					}, "提示", "nativeUI", ["确认", "取消"])
				} else {
					accbackfun(creditCardList);
					mui.confirm("您还未绑卡是否现在就去绑定信用卡？", "提示", ["确认", "取消"], function(e) {
						if(e.index == 0) {
							mui.openWindow({
								url: '_www/views/myOwn/addAccount.html',
								id: 'addAccount',
								show: {
									aniShow: 'pop-in'
								},
								styles: {
									top: '0px',
									bottom: '0px'
								},
								waiting: {
									autoShow: false
								}
							});
							//未绑定卡号时关闭提示框所在页面
							plus.webview.currentWebview().hide();//先隐藏
							setTimeout(function(){
								plus.webview.currentWebview().close();
							},2000);//设置延时关闭 处理手机打开新页面卡顿问题
							plus.nativeUI.closeWaiting();
						} else {
							plus.webview.currentWebview().close();
							plus.nativeUI.closeWaiting();
						}
					} /*,"提示", "nativeUI", ["确认", "取消"]*/ )
				}	
			}
		}
	};
	
	/**
	 * 从后台初始化账户信息与session信息数据到本地缓存中
	 */
	exports.initAccountInfo = function(callback){
		//iAccountInfo
		var url = exports.getApiURL()+'refreshSession.do';
		var customerId = userInfo.get('session_customerId');
		var params = {customerId:customerId};
		exports.apiSend('post',url,params,mycallBack,myErrorBack,true);
		function mycallBack(data){
			exports.clearAccountInfo();
			if(data){
				userInfo.putJson(data);
				if(callback&&typeof callback=='function'){
					callback();
				}
			}else{
				plus.nativeUI.toast("网络不佳，请重试");
				exports.backToIndex(true);
				return false;
			}
			
		}
		
		function myErrorBack(){
			plus.nativeUI.toast("网络不佳，请重试");
			exports.backToIndex(true);
			return false;
		}
	}
	
	/**
	 * 清空本地缓存的账户信息
	 */
	exports.clearAccountInfo = function(){
		var key = 'iAccountInfo';
		var iAccountInfo = userInfo.get(key);
		if(iAccountInfo){
			userInfo.removeItem(key);
		}
		
		
	}
	
	/**
	 * 退出登录时，清理所有登录时安装的session数据
	 */
	exports.clearUserSessionInfo = function(){
		var sessionDt  =   userInfo.getSessionData(null);
		if(sessionDt){
			for(var setion in sessionDt){
				if(sessionDt.hasOwnProperty(setion)){
					userInfo.removeItem(setion);
				}
			}
		}
	}
	
	/**
	 * 拖动时，改变头部的透明度  兼容IOS与Android
	 * @param {Object} headerHeight  头部固定位置的高度
	 */
	exports.changeOpacityWithScroll = function(headerHeight){
		if(window.plus){
			headerHeight = headerHeight||64;//默认64px
			if(mui.os.android){
			window.addEventListener('scroll',function(e){
				var top = window.scrollY;
				var addElem = document.querySelector('#frameBlock');
				var addHeight = document.defaultView.getComputedStyle(addElem).getPropertyValue('height');
				var addH = addHeight==""?0:parseFloat(addHeight.substring(0,addHeight.indexOf('px')));
				var header = document.querySelector('.mui-bar-nav');
				var temp = addH-headerHeight;
				if(top>=temp){
					header.style.background = 'rgba(255,255,255,1)';
				}else{
					header.style.background = 'rgba(255,255,255,'+top/temp+')';
				}
			},true)
		}else{
			window.addEventListener('touchmove',function(e){
				var top = window.scrollY;
				var addElem = document.querySelector('#frameBlock');
				var addHeight = document.defaultView.getComputedStyle(addElem).getPropertyValue('height');
				var addH = addHeight==""?0:parseFloat(addHeight.substring(0,addHeight.indexOf('px')));
				var header = document.querySelector('.mui-bar-nav');
				var temp = addH-headerHeight;
				if(top>=temp){
					header.style.background = 'rgba(255,255,255,1)';
				}else{
					header.style.background = 'rgba(255,255,255,'+top/temp+')';
				}
			})
		}
		}
	}
	
	/**
	 * 页面上存在下拉上拉刷新时，mui重写事件后，无法获取原始事件
	 * @param {Object} headerHeight
	 * @param {Object} isShowRefresh  是否显示刷新的动画部分
	 */
	exports.changeOpacityByPullRefresh = function(headerHeight,isShowRefresh){
			
			headerHeight = headerHeight||64;//默认64px
			isShowRefresh = isShowRefresh||false;
			window.addEventListener('scroll',function(e){
				if(!mui.isScrolling||!(e instanceof CustomEvent)){
					return;
				}
				
				if(!isShowRefresh){
					document.querySelector('.mui-pull').style.display ='none';
				}
				var bottom =0;
				if(mui.os.android){
					bottom = window.scrollY;
				}else{
					bottom = ~e.detail.lastY;//取反，下拉为负值，上拉为正
				}
				var addElem = document.querySelector('#frameBlock');
				var addHeight = document.defaultView.getComputedStyle(addElem).getPropertyValue('height');
				var addH = addHeight==""?0:parseFloat(addHeight.substring(0,addHeight.indexOf('px')));
				var header = document.querySelector('.mui-bar-nav');
				var temp = addH-headerHeight;
				if(bottom>=temp){
					header.style.background = 'rgba(255,255,255,1)';
				}else if(bottom>=0 && bottom<temp){
					header.style.background = 'rgba(255,255,255,'+bottom/temp+')';
				}else{
					//拉到顶部刷新位置，头部显示背景色设置
					header.style.background = 'rgba(192,192,192,'+(~bottom)/temp+')';
				}
			},true)
	}
	
	/**
	 * 登陆成功后，查询设备是否绑定
	 * 1.若未绑定则进行强制绑定后登陆进入
	 * 2.若已绑定则判断是否设置指纹，可以选择跳过
	 * 3.若已绑定设备与设置手势，则登陆成功关闭登陆相关页面
	 * 3.若是会话超时导致重新登录，则进入到首页，并刷新session信息等
	 * @param {Object} prePath   页面路径
	 * @param {Object} sessionTimeOut   是否会话超时
	 */
	exports.queryDeviceInfo = function(prePath,sessionTimeOut){
		var url = exports.getApiURL()+'deviceBoundQuery.do';
		var mbUUID = plus.device.uuid;
		var customerId = localStorage.getItem("session_customerId");
		var deviceList = [];
		var params = {
			session_customerId:customerId
		};
		var path = prePath || '_www/views/';
		var sessionTimeOut = sessionTimeOut||false;
		exports.apiSend('post',url,params,querySuccess,queryError,null);
		function querySuccess(data){
			deviceList = data.deviceList;
			var count = 0;
			if(data.ec =="000"){
				if( null != deviceList ){
					for(var i=0;i<deviceList.length;i++){
						if(mbUUID==deviceList[i].mbUUID){
							count++;
						}
					}
					
				}
				if(count==0){
					var customerType = localStorage.getItem("customerType");
					if(customerType=="01"){
						mui.toast('请先绑定设备再进行操作');
						exports.openWindowByLoad(path+"user/infoVerification.html", "infoVerification", "slide-in-right", {noCheck:"false",noClearDestination:true,sessionTimeOut:sessionTimeOut});
					}else{
						exports.checkAndSetLockerFirst(undefined,sessionTimeOut);
					}
					return;
				}else{
					exports.checkAndSetLockerFirst(undefined,sessionTimeOut);

				}
			}else{
				userInfo.removeItem("sessionId");
				exports.clearUserSessionInfo();
				mui.alert(data.em+"，请重新登录","温馨提示");
			}
		}
		function queryError(e){
			userInfo.removeItem("sessionId");
			exports.clearUserSessionInfo();
			mui.alert(e.em+"，请重新登录","温馨提示");
		}
	}
	//登陆成功后刷新有关页面
	exports.successLogonTriggerEvent = function(callback){
		var session_customerId = userInfo.get('session_customerId');
		var main_sub = plus.webview.getWebviewById('main_sub');
		mui.fire(main_sub,"reload",{session_customerId:session_customerId});
		var user = plus.webview.getWebviewById("myOwn");
		mui.fire(user,"reload",{session_customerId:session_customerId});
		mui.fire(user,"hideRight",{});
		var myRight = plus.webview.getWebviewById("myRight");
		if(myRight){
			plus.webview.hide(myRight);
			plus.webview.close(myRight);
		}
		var fundHome = plus.webview.getWebviewById("fundHome");
		if(fundHome){
			mui.fire(fundHome,"refreshTotalFund",{});
		}
		var lifeHome = plus.webview.getWebviewById("life");
		if(lifeHome){
			mui.fire(lifeHome,"refreshQRCodePay",{});
		}
		exports.initAccountInfo(callback);
		exports.pushCidRecord();
	}
	
	/**
	 * 1.清理一些登陆会话信息
	 * 2.后台退出session
	 * 3.清理一些其他信息-各自按照业务进行增加
	 */
	exports.logonOutTriggerEvent = function(){
		//TO-DO
		
		localStorage.removeItem('sessionId');
		localStorage.removeItem("resubmit_page_id");
		exports.clearAccountInfo();
		exports.clearUserSessionInfo();
		//触发首页退出登录
		var main_sub = plus.webview.getWebviewById('main_sub');
		if(main_sub){
			mui.fire(main_sub,'logOut',{});
		}
		//触发个人中心退出登录
		
		var myOwn = plus.webview.getWebviewById('myOwn');
		if(myOwn){
			mui.fire(myOwn,'reload',{session_customerId:null});
			mui.fire(myOwn,'hideRight',{});
		}
		var fundHome = plus.webview.getWebviewById("fundHome");
		if(fundHome){
			mui.fire(fundHome,"refreshTotalFund",{});
		}
		var lifeHome = plus.webview.getWebviewById("life");
		if(lifeHome){
			mui.fire(lifeHome,"refreshQRCodePay",{});
		}
	}
	
	
	/**
	 * 改变指定id区域的页面绝对定位
	 * 原因：密码键盘弹出，导致页面的窗口出现变化，常见于android机器
	 * @param {Object} id
	 */
	exports.resizePage = function(id){
		var originH = window.innerHeight;
		var link = document.querySelector(id);
		if(!link){
			alert('获取目标页面id错误');
			return false;
		}
		var linkBottom = window.getComputedStyle(link,null).getPropertyValue('bottom');
		var originBotom = 0;
		if(linkBottom){
			var pxStr = linkBottom.substring(0,linkBottom.indexOf('px'));
			originBotom = parseFloat(pxStr);
		}
		window.addEventListener('resize',function(){
				var resizeH = window.innerHeight;
				var x = Number(originH - resizeH);
				link.style.bottom = (-x+originBotom)+'px';
		},true)
	}
	
	exports.checkAndSetLockerFirst = function(prePath,sessionTimeOut){
		var sessionKeys = userInfo.getItem("session_keys") || "{}";
		var customerId = localStorage.getItem("session_customerId");
		var path = prePath || '_www/views/';
		if(sessionKeys == null || sessionKeys == "{}" || sessionKeys == ""){
			exports.openWindowByLoad(path+"safeCenter/userLockerFirst.html", "userLockerFirst", "slide-in-right", {noCheck:"false",sessionTimeOut:sessionTimeOut});
		}else{
			sessionKeys = JSON.parse(sessionKeys);
			if (sessionKeys[customerId] == undefined) {
				exports.openWindowByLoad(path+"safeCenter/userLockerFirst.html", "userLockerFirst", "slide-in-right", {noCheck:"false",sessionTimeOut:sessionTimeOut});
			}else{
//				plus.webview.close(plus.webview.getWebviewById("login"));
				if(sessionTimeOut){
					//超时登陆成功返回到首页
					exports.backToIndex();
				}else{
                    if( !exports.checkDestinationPage() ){
                    	plus.webview.close(plus.webview.getWebviewById("loginByFinger"));
						plus.webview.close(plus.webview.getWebviewById("unlock"));	
						plus.webview.close(plus.webview.getWebviewById("login"));
                    }
					
				}
			}
		}
	}
	/**
	 * 校验登录密码状态，判断是否需要强制修改登录密码
	 * @param {Object} data
	 */
	exports.checkLoginPwdStatus = function(data,sessionTimeOut){
		//等测试时再放开
        var executeTimes=data.executeTimes;
		if( executeTimes=="0" || executeTimes=="6" ){
			exports.openWindowByLoad("../login/updatePassword.html", "updatePassword", "slide-in-right",{nocheck:false,sessionTimeOut:sessionTimeOut});
			return false;
		}
		return true;
	}
    /**
     * 设置登录之后要进入的菜单
     */
    exports.setDestinationPage=function(destinationPage){
    	destinationPage=destinationPage||{};
    	localStorage.setItem("destinationPage",JSON.stringify(destinationPage));
    }
    /**
     * 清空登录之后要进入的菜单
     */
    exports.clearDestinationPage=function(destinationPage){
    	localStorage.removeItem("destinationPage");
    }
        
	/**
	 * 判断登录之后是否要跳转至指定菜单
	 * @param {Object} data
	 */
	exports.checkDestinationPage = function(){
		var destinationPage=localStorage.getItem("destinationPage");
		if( destinationPage ){
			destinationPage=JSON.parse(destinationPage);
			exports.openWindowByLoad(destinationPage.package, destinationPage.pageId, destinationPage.aniShow, destinationPage.param, destinationPage.styleJson);
			return true;
		}
		return false;
	}
	
	
	/**
	 * iOS系统集成获取用户uuid插件方法
	 * 若未集成则返回html5+自带的
	 * 若自带的无法返回则为空
	 */
	exports.getCustomUUID = function(){
		if(mui.os.android){
			return window.plus?plus.device.uuid:"";
		}else{
			if(window.plus.pluginGetUDID){
				return plus.pluginGetUDID.getCustomUDID();
			}else{
				return window.plus?plus.device.uuid:"";
			}
		}
	}
	
	/**
	 * 检查提交的数据中某一指定变量不能为空，否则返回上一个页面
	 * @param {Object} param
	 * @param {Object} flowno
	 */
	exports.checkMustData = function(param,flowno){
		
		var hasFlowNo = param && param.hasOwnProperty(flowno);	
		
		if(hasFlowNo){
			var orderFlowNo = param[flowno];
			if(!orderFlowNo){
				mui.alert("网络连接失败，请重新尝试","","",function(){
            		setTimeout(function(){
            			mui.back();
            		},10);
				});
				return false;
			}
		}
		return true;
	}
	exports.pushCidRecord = function(){
		var deviceType = plus.device.vendor+" "+plus.device.model;
		var mpOS = (plus.os.name+" "+plus.os.version).toUpperCase();
		var uuidVar = exports.getCustomUUID();
		var mbIMSI = "";
		for ( var i=0; i<plus.device.imsi.length; i++ ) {
	        mbIMSI += plus.device.imsi[i];
	    }
		pushClientid = plus.push.getClientInfo().clientid;
		pushToken = plus.push.getClientInfo().token;
		if(uuidVar && pushClientid && pushToken ){
			var reqData = {
	        	"pushClientid" : pushClientid,
	        	"mbUUID" : uuidVar,
	        	"pushToken" : pushToken,
	        	"deviceType" : deviceType,
	        	"mbIMSI" : mbIMSI,
	        	"mpOS" : mpOS
	        };
	        var url = this.getApiURL()+'pushCidRecord.do';
	        this.apiSend("post",url,reqData,pushCidRecordSucFunc,pushCidRecordFailFunc,true);
	        function pushCidRecordSucFunc(data){
	        }
	        function pushCidRecordFailFunc(e){
	        }
		}
		
	}
	exports.isExceedCertValid = function(){
		var url =exports.getApiURL() + 'custCertRemind.do';
		var params = {};
		exports.apiSend('post',url,params,custCertRemindSuc,custCertRemindErr,null);
		function custCertRemindSuc(data){
			if(data.ec =='000'){
				if(data.flag =='1'){
					var certEdate = data.certEdate;
					if(certEdate.length == 8){
						mui.alert("尊敬的客户，您的证件有效期为："+certEdate.substring(0,4)+'年'+certEdate.substring(4,6)+'月'+certEdate.substring(6,8)+'日'+'，到期30天后您的账户将被冻结，请及时携带新身份证件前往我行柜台更新信息。');
					}
				}
//				alert("证件是否到期判断"+data.flag+','+data.certEdate+","+data.validDate);
			}
		}
		function custCertRemindErr(e){
//			alert(e.em);
		}
	}

});