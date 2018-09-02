define(function(require, exports, module) {
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var parent = plus.webview.getWebviewById("adViewDetail");
		var returnurl = parent.returnurl;
		var title = parent.ADtitle;
		var ADValue = parent.ADValue;
		if (returnurl == null || returnurl == "") {
			document.getElementById("adTitle").innerHTML = title ;
	        document.getElementById("adContent").innerHTML = ADValue.replaceAll('\r\n\r\n','<br/>').replaceAll(' ','&nbsp;&nbsp;').replaceAll('&l;','\|');	 
		} else {
			location.href = returnurl;
		}
	});
});