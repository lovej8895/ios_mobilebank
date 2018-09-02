define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var messageTitle = self.messageTitle;					//消息标题
		var messageContent = self.messageContent;				//消息内容
		var messageTime = self.messageTime;			//发布时间
		var messageId = self.messageId;
		var isNew = self.isNewMessage;			//是否未读
		var mbUUID = plus.device.uuid;
		var autograph = self.autograph;
		document.getElementById("messageTitle").innerHTML = messageTitle;
		document.getElementById("messageContent").innerHTML = messageContent;
		document.getElementById("messageTime").innerHTML = formatDate(messageTime);
		if(autograph==null||autograph==""){
			$("#messageAutograph").hide();
		}else{
			document.getElementById("autograph").innerHTML = autograph;
		}
		
		if(isNew=='0'){
			var params = {
				mbUUID : mbUUID,
				msgId : messageId,
				"liana_notCheckUrl":false
			};
			var url = mbank.getApiURL() + '210201_updateMessage.do';
			mbank.apiSend("post",url,params,successCallback,errorCallback,true);
			function successCallback(data){
				mui.fire(plus.webview.getWebviewById("systemMessage"), 'refreshNews', {});
				mui.fire(plus.webview.getWebviewById("main_sub"), 'refreshNews', {});
				mui.fire(plus.webview.getWebviewById("productList"), 'refreshNews', {});
				mui.fire(plus.webview.getWebviewById("life"), 'refreshNews', {});
			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
		
		function formatDate(date) {
			return date.substr(0,4) + "-" + date.substr(4,2) + "-" + date.substr(6,2);
		}
		
	});
});