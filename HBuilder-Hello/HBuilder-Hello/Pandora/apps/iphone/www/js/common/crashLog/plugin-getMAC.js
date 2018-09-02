/**
 * 获取mac地址
 */
document.addEventListener("plusready", function() {
                    
	var _BARCODE = 'plugingetMACAdress', B = window.plus.bridge;
	var plugingetMACAdress = {
		getMACAdress : function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(code) {
						errorCallback(code);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "getMACAdress", [ callbackID]);
		}
	};
	window.plus.plugingetMACAdress = plugingetMACAdress;
                          
}, true);