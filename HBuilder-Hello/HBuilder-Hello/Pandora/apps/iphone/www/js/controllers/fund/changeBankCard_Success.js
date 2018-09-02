define(function(require, exports, module) {
    var mbank = require('../../core/bank');
//  var app = require('../../core/app');
//  var myAcctInfo = require('../../core/myAcctInfo');
//	var format = require('../../core/format');
	
	mui.init();
	mui.plusReady(function() {
		//变更成功返回按钮-->返回交易账号变更页面
		plus.screen.lockOrientation("portrait-primary");
		document.getElementById("submit").addEventListener('tap',function(){
			mui.fire(plus.webview.getWebviewById("changeBankCard"),"reload"); //重新加载签约账号信息
			plus.webview.close(plus.webview.getWebviewById("changeBankCardSubmit"));
			plus.webview.close(plus.webview.getWebviewById("changeBankCard_Success"));
		});
	});

});