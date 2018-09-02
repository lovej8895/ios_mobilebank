/**
 * 获取ip地址
 */
document.addEventListener("plusready", function() {
	var _BARCODE = 'plugingetIPAdress', B = window.plus.bridge;
	var plugingetIPAdress = {
		getIPAdress : function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(code) {
						errorCallback(code);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "getIPAdress", [ callbackID]);
		}
	};
	window.plus.plugingetIPAdress = plugingetIPAdress;
}, true);