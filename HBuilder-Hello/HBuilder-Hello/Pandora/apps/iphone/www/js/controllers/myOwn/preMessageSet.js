define(function(require, exports, module) {
	//预留信息设置
	var doc = document;
	var m = mui;
	// 引入依赖
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

	m.init();
	m.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		mbank.resizePage('.but_315px');
		var preMsgUrl = mbank.getApiURL()+'showPreSettingMessagePage.do';
		var prPparams = {};
		var messageSet = $('#messageSet');
		//在页面加载完成后发送请求获取以前的预留信息
//		mbank.apiSend("post",preMsgUrl,prPparams,successback,errorback,true);
		var customerMessage = userInfo.get("customerMessage");
//		console.log(customerMessage);
		if(customerMessage!=''&&customerMessage!=null&&customerMessage!="null"){
			messageSet.val(customerMessage);
		}
		/*function successback(data){
			if(data.customerMessage!=''&&data.customerMessage!=null){
				messageSet.val(data.customerMessage);
			}else{
			}
			
		}
		function errorback(e){
			mui.alert("信息加载失败");
		}*/
		
		//进行新的预留信息设置
		
		var confirm = doc.getElementById("confirm");
		
		confirm.addEventListener('tap',function(){
			if(messageSet.val()==''){
				mui.alert("预留信息不能为空");
				return false;
			}
			if(messageSet.val().length>10){
				mui.alert("预留信息长度不能大于十位");
				return false;
			}
			var url = mbank.getApiURL()+'updatePreSettingMessage.do';
			var params = {customerMessage:messageSet.val()};
			mbank.apiSend("post",url,params,successCallback,errorCallback,true);
			function successCallback(data){
				var msg = {title:"预留信息修改",value:"预留信息修改成功!"};
				localStorage.setItem("customerMessage", data.customerMessage);
//				console.log(localStorage.getItem('customerMessage'));
				mbank.openWindowByLoad('msgSetOK.html','msgSetOK','slide-in-right',{params:msg});
		    }
		    function errorCallback(e){
		    	mui.alert("修改预留信息失败");
		    }
		})
		
	});
});