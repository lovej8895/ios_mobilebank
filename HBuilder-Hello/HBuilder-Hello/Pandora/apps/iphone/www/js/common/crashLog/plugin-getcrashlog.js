/**
 * writelog：写日志方法   （仅供测试使用）
 * 
 * getLog ： 查询日志
 * 
 * deleteLog：删除日志
 */
document.addEventListener("plusready", function() {
	var _BARCODE = 'plugingetCrashLog',B = window.plus.bridge;
	var plugingetCrashLog = {
		//测试使用  使用该方法需要替换 yumobile-hubiebank-log.jar包
		writelog: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null :
				function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null :
				function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "writelog", [callbackID]);
		},
		getLog: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null :
				function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null :
				function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "getLog", [callbackID]);
		},
		deleteLog: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null :
				function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null :
				function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "deleteLog", [callbackID]);
		}
	};
	window.plus.plugingetCrashLog = plugingetCrashLog;
}, true);