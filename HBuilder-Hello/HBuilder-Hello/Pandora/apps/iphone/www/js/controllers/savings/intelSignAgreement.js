define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();

        $("#backButton").on("tap",function(){
        	self.close();
        });
        
        $("#confirmButton").on("tap",function(){
        	if( !$("#agreeCheck").is(":checked") ){
        		mui.alert("请先阅读并同意该协议！");
        		return false;
        	}
        	var url = mbank.getApiURL()+'025011_sign.do';
        	var param={
        		accountNo:self.accountNo,
				dealCode:"0"
        	};
			mbank.apiSend("post",url,param,successCallback,function(data){
				mui.alert("智能通知存款签约失败[失败信息:"+data.em+"]");
			},true);
			function successCallback(data){
				data.title="智能通知存款签约";
		        mbank.openWindowByLoad('../savings/savingsResult.html','savingsResult','slide-in-right',data);
			}
        });
               
        
	});

});
