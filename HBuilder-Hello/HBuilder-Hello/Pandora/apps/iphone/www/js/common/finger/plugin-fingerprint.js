
/**
 * 指纹解锁；
 * 
 * <p>插件名称：</p>
 * <b>pluginFingerprint</b>
 * <p>API>/p>
 * 
 * 开始指纹识别
 * startFingerprint ： function()
 * 取消指纹识别
 * startFingerprint ： function()
 */
document.addEventListener("plusready", function() {
	var _BARCODE = 'pluginFingerprint', B = window.plus.bridge;
	var pluginFingerprint = {
		startFingerprint : function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(args) {
						errorCallback(args);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "startFingerprint", [ callbackID ]);
		},
		cancelFingerprint : function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(args) {
						errorCallback(args);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "cancelFingerprint", [ callbackID ]);
		},
		isAvailable : function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(args) {
						errorCallback(args);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "isAvailable", [ callbackID ]);
		}
	};
	window.plus.pluginFingerprint = pluginFingerprint;
}, true);


