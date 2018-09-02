/**
 * 
 */
define(function(require, exports, module) {

	var mbank = require('./bank');
	/**
	 * 六格密码框
	 * @param {Object} param        密码框div的各个元素
	 * @param {Function} funCheck	执行验密操作的校验函数
	 * @param {Function} funRequest	输入6位密码后的操作，函数的参数为密码
	 */
	exports.openPswDiv = function(param, funCheck, funRequest) {
		
		param.btn.click(function() {
			if (typeof(funCheck) == "function" && funCheck()) {
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
			if ($.param.SOFTPWD_SWITCH == false) {// 软键盘开关
				if (mui.os.ios) {
					var webView = plus.webview.currentWebview()
							.nativeInstanceObject();
					webView.plusCallMethod({
						"setKeyboardDisplayRequiresUserAction" : false
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
					if (param.pop.css('display') == "none") {
						return;
					}
					e = e || window.event
					var len = keys.length;

					if (e.keyCode == "8") { // 8为 回退
						if (len != 0) {
							keys.pop();
							--len;
							for (var index = 1; index <= 6; index++) {
								if (len < index) {
									param.input.eq(index - 1).val("");
								}
							}
						}
					} else {
						keys.push(String.fromCharCode(e.keyCode));
						param.input.eq(keys.length - 1).val("1");
						++len;
						if (len == 6) {
							var psw = "";
							for (var index = 0; index < 6; index++) {
								psw += keys[index];
							}
							hidePop();
							if (funRequest != null
									&& typeof (funRequest) == "function") {
								funRequest(psw);
							}
						}
					}
				};
			} else {
				openNumKeyBoard();
			}

		};
		function closeKeyBoard () {			
			plus.pluginNumKeyBoard.closeNumKeyboard(function(result) {
			}, function(result) {
			});
		};
		function openNumKeyBoard() {
			for (var index = 0; index < 6; index++) {
				param.input.eq(index).val("");
			}
			plus.pluginNumKeyBoard
					.openNumKeyboard(
							"3des",
							function(result) {
								if (result) {
									if (result.status) {
										var json = result.payload;
										var obj = $.parseJSON(json);
										//document.getElementById(param.hiddenPswInput).value = obj.cipherText;
										var len = obj.text.length;
										for (var index = 0; index < len; index++) {
											param.input.eq(index).val("1");
										}
										for (var index = len; index < 6; index++) {
											param.input.eq(index).val("");
										}
										if (len == 6) {
											funRequest(obj.cipherText);
											closeKeyBoard();
										}
									} else {
										mui.alert(result.message);
									}
								} else {
									mui.alert("调用插件时发生异常。");
								}
							}, function(result) {
								mui.alert(result);
							});
		}
	};
    
    /**
	 * 六格密码框:页面校验后调用该方法
	 * @param {Object} param        密码框div的各个元素
	 * @param {Function} funRequest	输入6位密码后的操作，函数的参数为密码  
	 */
	exports.showViewAndCheckPwd = function(param,  funRequest) {
        param.body.css("overflow-y", "hidden");
		
			
			setTimeout(function(){
				param.bgBland.css({
					"height":$(window).height() + $(window).scrollTop(),
					"display":"block"
				});
				param.pop.css({"display":"block"});
				param.keyboard.css({"display":"block"});
				openSoftKeyboard();
			},300);
			
			
			
		
		param.btn.click(function() {
                param.input.val("");
			    keys = [];
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
			if (!$.param.SOFTPWD_SWITCH) {// 软键盘开关
				if (mui.os.ios) {
					setTimeout(function(){
					var webView = plus.webview.currentWebview()
							.nativeInstanceObject();
					webView.plusCallMethod({
						"setKeyboardDisplayRequiresUserAction" : false
					});	
					},330)
					
				} else {
					setTimeout(function(){
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
					},330);
					
				}
				var keys = []; // 记录输入的数组
				document.onkeydown = function(e) {
					if (param.pop.css('display') == "none") {
						return;
					}
					e = e || window.event
					var len = keys.length;

					if (e.keyCode == "8") { // 8为 回退
						if (len != 0) {
							keys.pop();
							--len;
							for (var index = 1; index <= 6; index++) {
								if (len < index) {
									param.input.eq(index - 1).val("");
								}
							}
						}
					} else {
						keys.push(String.fromCharCode(e.keyCode));
						param.input.eq(keys.length - 1).val("1");
						++len;
						if (len == 6) {
							var psw = "";
							for (var index = 0; index < 6; index++) {
								psw += keys[index];
							}
							hidePop();
							if (funRequest != null
									&& typeof (funRequest) == "function") {
								funRequest(psw);
							}
						}
					}
				};
			} else {
				openNumKeyBoard();
			}

		};
		function closeKeyBoard () {			
			plus.pluginNumKeyBoard.closeNumKeyboard(function(result) {
			}, function(result) {
			});
		};
		function openNumKeyBoard() {
			for (var index = 0; index < 6; index++) {
				param.input.eq(index).val("");
			}
			plus.pluginNumKeyBoard
					.openNumKeyboard(
							"3des",
							function(result) {
								if (result) {
									if (result.status) {
										var json = result.payload;
										var obj = $.parseJSON(json);
										//document.getElementById(param.hiddenPswInput).value = obj.cipherText;
										var len = obj.text.length;
										for (var index = 0; index < len; index++) {
											param.input.eq(index).val("1");
										}
										for (var index = len; index < 6; index++) {
											param.input.eq(index).val("");
										}
										if (len == 6) {
											closeKeyBoard();
											funRequest(obj.cipherText);
											
										}
									} else {
										mui.alert(result.message);
									}
								} else {
									mui.alert("调用插件时发生异常。");
								}
							}, function(result) {
								mui.alert(result);
							});
		}
	};
	exports.checkMobileMsg=function(code,actionfun){
		    var url = mbank.getApiURL() + 'sendMsgToCst.do';
		
			mbank.apiSend('post', url, {mobileVerifyCode:code,flag:"1",currentBusinessCode: "02000015"}, queryLogBack, null, false);
		
			function queryLogBack(d) {
				if (typeof(actionfun) == "function"){
					actionfun();
				}
			}
	
       };
   exports.showNumberSoftKeyBoard=function(id,len) {
         var pwd=document.getElementById(id);
         var pwdHide=document.getElementById(id+"Hide");
		pwd.value = "";
		pwdHide.value = "";
        var pwdlen=len||20;
		plus.pluginNumKeyBoard
		.openNumKeyboard(
				"3des",
				function(result) {
					if (result) {
						if (result.status) {
						    var json = result.payload;
							var obj = $.parseJSON(json);
							if(obj.text.length>pwdlen){
								mui.alert("密码不能超过"+pwdlen+"位");
								return;
							}
							pwd.value = obj.text;
							pwdHide.value = obj.cipherText;
						} else {
							mui.alert(result.message);
						}
					} else {
						mui.alert("调用插件时发生异常。");
					}
				}, function(result) {
					mui.alert(result);
				});
	}
   exports.showSoftKeyBoard=function(id,len) {
       var pwd=document.getElementById(id);
       var pwdHide=document.getElementById(id+"Hide");
		pwd.value = "";
		pwdHide.value = "";
      var pwdlen=len||20;
		plus.pluginKeyBoard
		.openKeyboard(
				"3des",
				function(result) {
					if (result) {
						if (result.status) {
						    var json = result.payload;
							var obj = $.parseJSON(json);
							if(obj.text.length>pwdlen){
								mui.alert("密码不能超过"+pwdlen+"位");
								return;
							}
							pwd.value = obj.text;
							pwdHide.value = obj.cipherText;
						} else {
							mui.alert(result.message);
						}
					} else {
						mui.alert("调用插件时发生异常。");
					}
				}, function(result) {
					mui.alert(result);
				});
	} ;
	exports.openNumKeyBoardForView=function(funRequest) {
			for (var index = 0; index < 6; index++) {
				jQuery(".password-popup-input input").eq(index).val("");
			}
			plus.pluginNumKeyBoard
					.openNumKeyboard(
							"3des",
							function(result) {
								if (result) {
									if (result.status) {
										var json = result.payload;
										var obj = jQuery.parseJSON(json);
										var len = obj.text.length;
										for (var index = 0; index < len; index++) {
											param.input.eq(index).val("1");
										}
										for (var index = len; index < 6; index++) {
											param.input.eq(index).val("");
										}
										if (len == 6) {
											closeKeyBoard();
											//funRequest(obj.cipherText);
											mui.fire(maskview, 'pgKey', {psw:obj.cipherText});
											
										}
									} else {
										mui.alert(result.message);
									}
								} else {
									mui.alert("调用插件时发生异常。");
								}
							}, function(result) {
								mui.alert(result);
							});
		};
		exports.closeKeyboardDiv=	function (pswParam){
			   if(jQuery.param.SOFTPWD_SWITCH){
			    plus.pluginNumKeyBoard.closeNumKeyboard(function(result) {
				}, function(result) {
				});
			   }
	
				pswParam.pop.fadeOut(300);
				pswParam.keyboard.fadeOut(300);
				pswParam.bgBland.fadeOut(300);
				pswParam.input.val("");
	}

});