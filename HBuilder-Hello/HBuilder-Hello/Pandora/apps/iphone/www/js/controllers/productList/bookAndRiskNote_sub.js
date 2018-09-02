define(function(require, exports, module) {
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var parent = plus.webview.getWebviewById("bookAndRiskNote");
		var returnurl = parent.returnurl;
		if (returnurl == null || returnurl == "") {
			var html = '<div class="fail_icon1 suc_top7px"></div>';
			html += '<p class="fz_15 text_m">无效的链接</p>';
	        $("#bookAndRiskNote").html(html);
		} else {
			location.href = returnurl;
		}
	});
});