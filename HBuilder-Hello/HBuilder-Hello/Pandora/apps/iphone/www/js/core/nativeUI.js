define(function(require, exports, module) {
	
	/*TODO
	 * 探索如何支持微信站和web站
	 * 1.将所有plus封入nativeUI的方法，禁止调用plus.的方法
	 * 2.如果没办法，一定要调用的话，封入mui.plusReady里面去
	 * 3.mui.plusReady需要批量替换为mui.ready 但是在webView 传值的情况下是否会出问题还需要进一步论证
	 * 4.写清楚每个js的范围，大家注意，别乱调用
	 * 5.subpages目前mui只支持一个subpage转为iframe。那么就要把启动页重新搞一下了。
	 * 6.对webView的封装其实是很困难的一件事情，尤其是页面间传值如何兼容H5站，存在极大的问题
	 * 7.去掉所有Jquery调用，或者用更优雅的方式调用
	 * 8.param的参数，重新整理一下，更优雅
	 * 9.去掉冗余的js，例如jquery mui以及echart等
	 * 10.
	 */
	
	var waitingObj = null;
	exports.pickDate = function(okCallback, cancelCallback, options) {
		if (window.plus) {
			plus.nativeUI.pickDate(function(e) {
				var date = e.date;
				if (typeof okCallback == 'function') {
					okCallback(date);
				}
			}, function(e) {
				if (typeof cancelCallback == 'function') {
					cancelCallback(e.message);
				}
			}, options);
		}
	};
	exports.pickTime = function(okCallback, cancelCallback, options) {
		if (window.plus) {
			plus.nativeUI.pickTime(function(e) {
				var date = e.date;
				if (typeof okCallback == 'function') {
					okCallback(date);
				}
			}, function(e) {
				if (typeof cancelCallback == 'function') {
					cancelCallback(e.message);
				}
			}, options);
		}
	};
	exports.toast = function(msg) {
		mui.toast(msg);
//		if (window.plus) {
//			plus.nativeUI.toast(msg, {
//				duration: 'short',
//				align: 'center',
//				verticalAlign: 'bottom'
//			});
//		}
	};
	exports.showWaiting = function(msg) {
		if (window.plus) {
			plus.nativeUI.showWaiting(msg);
		}
	};
	exports.closeWaiting = function() {
		if (window.plus) {
			plus.nativeUI.closeWaiting();
		}
	};
	exports.watting = function(msg, closeTimes) {
		if (waitingObj) { // 避免快速多次点击创建多个窗口
			return;
		}
		if (window.plus) {
			waitingObj = plus.nativeUI.showWaiting(msg);
			if (closeTimes) {
				closeTimes = parseInt(closeTimes);
				if (closeTimes > 0) {
					window.setTimeout(function() {
						if (waitingObj) {
							waitingObj.close();
							waitingObj = null;
						}
					}, closeTimes);
				}
			}
		}
	};
	exports.wattingTitle = function(msg) {
		if (window.plus) {
			if (waitingObj) {
				waitingObj.setTitle('    ' + msg + '    ');
			}
		}
	};
	exports.wattingClose = function() {
		if (window.plus) {
			if (waitingObj) {
				waitingObj.close();
				waitingObj = null;
			}
		}
	};
	exports.alert = function(title, msg, button, callback) {
//		if (window.plus) {
//			plus.nativeUI.alert(msg, function() {
//				if (typeof callback == 'function') {
//					callback();
//				}
//			}, title, button);
//		}
		mui.alert(title,msg,button,callback);
	};
	exports.confirm = function(title, msg, button, okCallback, cancelCallback) {
		if (window.plus) {
			plus.nativeUI.confirm(msg, function(e) {
				if (e.index == 0) {
					if (typeof okCallback == 'function') {
						okCallback();
					}
				} else {
					if (typeof cancelCallback == 'function') {
						cancelCallback();
					}
				}
			}, title, button);
		}
	};
	
	exports.confactionSheetirm = function(title, cancelText, buttons, callback) {
		if (window.plus) {
			plus.nativeUI.actionSheet({
				title: title,
				cancel: cancelText,
				buttons: buttons
			}, function(e) {
				if (typeof callback == 'function') {
					callback(e.index);
				}
			});
		}
	};
	exports.getCurrentPosition = function(succcessCB,errorCB,option) {
		if (window.plus) {
			plus.geolocation.getCurrentPosition(succcessCB,errorCB,option);
		}else{
			navigator.geolocation.getCurrentPosition(succcessCB,errorCB,option);
		}
	};
	exports.lockOrientation = function(orientation) {
		if (window.plus) {
			plus.screen.lockOrientation(orientation);
		}
	};
	exports.currentWebview = function() {
		if (window.plus) {
			plus.webview.currentWebview();
		}else{
			window.self;
		}
	};
/**
	 * 设置应用本地配置
	 **/
	exports.setStorage = function(_key,_value) {
		_key = _key || {};
		_value = _value || {};
		localStorage.setItem('$Liana_'+ _key,JSON.stringify( _value));
	}

	/**
	 * 获取应用本地配置
	 **/
	exports.getStorage = function(_key) {
		var _value = localStorage.getItem('$Liana_'+_key) || "{}";
		return JSON.parse(_value);
	}
	
	//确认框
	exports.confirmDialog = function(message, title, funCallback) {
		if (plus.os.name == 'Android') {
			plus.nativeUI.confirm(message, function(e) {
				if (e.index == 0) {
					funCallback();
				} else {
					plus.nativeUI.closeWaiting();
				}
			}, title, "nativeUI", ["确认", "取消"]);
		} else {
			mui.confirm(message, title, ["取消", "确认"], function(e) {
				if (e.index == 1) {
					funCallback();
				} else {
					plus.nativeUI.closeWaiting();
				}
			});
		}
	}
	//确认框
	exports.confirmDialogTwo = function(message, title, funCallback,btnArray) {
		if (plus.os.name == 'Android') {
			plus.nativeUI.confirm(message, function(e) {
				if (e.index == 0) {
					funCallback();
				} else {
					plus.nativeUI.closeWaiting();
				}
			}, title, btnArray);
		} else {
			mui.confirm(message, title, btnArray.reverse(), function(e) {
				if (e.index == 1) {
					funCallback();
				} else {
					plus.nativeUI.closeWaiting();
				}
			});
		}
	}
	//输入框
	exports.inputDialog = function(message, title, funCallback) {
		if (plus.os.name == 'Android') {
			var btnArray = ['确认', '取消'];
			mui.prompt(message, title, title, btnArray, function(e) {
				if (e.index == 0) {
					funCallback(e);
				}
			});
		} else {
			var btnArray = ['取消', '确认'];
			mui.prompt(message, title, title, btnArray, function(e) {
				if (e.index == 1) {
					funCallback(e);
				}
			});
		}
	}
	
	exports.readLocalFile = function(url,successCallback){
		console.log('读取本地虚拟报文' + url);
		plus.io.resolveLocalFileSystemURL(url, function(entry) {
			// 可通过entry对象操作test.html文件 
			entry.file(function(file) {
				var fileReader = new plus.io.FileReader();
				fileReader.readAsText(file, 'utf-8');
				fileReader.onloadend = function(evt) {
					var data = JSON.parse(evt.target.result);
					successCallback(data);
				}
			});
		}, function(e) {
			mui.alert("Resolve file URL failed: " + e.message);
		});
	}
	
});