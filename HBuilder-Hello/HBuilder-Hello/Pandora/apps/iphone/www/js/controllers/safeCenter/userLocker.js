define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var userInfo = require('../../core/userInfo');
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		plus.nativeUI.closeWaiting();
		plus.screen.lockOrientation("portrait-primary");
		
		var retPage = plus.webview.currentWebview().opener();
		var customerId = userInfo.get("session_customerId");
		
		if(customerId != null && customerId != ''){
		    var holder = document.querySelector('#holder');
		    var alert = document.querySelector('#alert');
			var record = [];
			
			holder.addEventListener('done', function(event) {
				var rs = event.detail;
				if (rs.points.length < 4) {
					mui.alert("手势太简单了，至少要连4个点哦！","温馨提示");
					record = [];
					rs.sender.clear();
					return;
				}
				record.push(rs.points.join(''));
				if (record.length >= 2) {
					if (record[0] == record[1]) {
						gesturePwdOpen(record[1]);
					} else {
						alert.innerText = '与上一次绘制不一致，请重新绘制';
					}
					rs.sender.clear();
					record = [];
				} else if(record.length == 1){
					alert.innerText = '请再次绘制手势密码';
					rs.sender.clear();
				}else {
					alert.innerText = '请绘制手势密码';
					rs.sender.clear();
				}
			});
		}else{
			var wvs=plus.webview.all();
			for(var i=0;i<wvs.length;i++){
				if(wvs[i].id!='HBuilder'&&wvs[i].id!='main'&&wvs[i].id!='index'){
					plus.webview.close(wvs[i].id,"none");
				}
			}
		}
		
		function gesturePwdOpen(d){
			var uuid = plus.device.uuid;
        	var pwdData = "" + CryptoJS.HmacMD5(uuid + "", d + "");
        	var reqData = {
        		"mbUUID" : uuid,
        		"PinType" : "2",
        		"PinData" : pwdData,
        		"state" : "0"
        	};
        	var url = mbank.getApiURL()+'loginTypeStateSet.do';
        	mbank.apiSend("post",url,reqData,loginTypeStateSetSucFunc,loginTypeStateSetFailFunc,true);
        	function loginTypeStateSetSucFunc(data){
        		if(data.ec =="000"){
        			var param={};
        			param[customerId]=pwdData;
					param["state"]="0";
					param["show"]="0";
					param["islock"]="0";
					userInfo.setItem("session_keys",JSON.stringify(param));
					mui.fire(retPage, 'refresh');
					plus.webview.currentWebview().close();
        		}else{
        			mui.alert(data.em,"温馨提示");
        		}
        	}
        	function loginTypeStateSetFailFunc(e){
        		mui.alert(e.em,"温馨提示");
        	}
		}
	});
});