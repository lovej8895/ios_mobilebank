define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	
	mui.init();
	mui.plusReady(function() {
		plus.nativeUI.closeWaiting();
		plus.screen.lockOrientation("portrait-primary");
		
		var retPage = plus.webview.currentWebview().opener();
		var customerId = userInfo.get("session_customerId");
		var flag = true;
		
		var params=userInfo.getItem("session_keys") || "{}";
		if(params!=null && params!="" && params !="{}" && params !=undefined){
			params=JSON.parse(params);
		}
		
		if (customerId != null && customerId != '') {
			var holderShow = document.querySelector('#holder');
			var	alert = document.querySelector('#alert');
			var	record = [];
			holderShow.addEventListener('done', function(event) {
				checkHolder(event);
			});
			function checkHolder(event){
				var rs = event.detail;
				if (rs.points.length < 4) {
					mui.alert("手势太简单了，至少要连4个点哦！","温馨提示");
					record = [];
					rs.sender.clear();
					return;
				}
				if (flag) {
					record.push(rs.points.join(''));
					if (record.length >= 2) {
						if (record[0] == record[1]) {
							gesturePwdOpen(record[1]);
						} else {
							alert.innerText = '与上一次绘制不一致，请重新绘制';
						}
						rs.sender.clear();
						record = [];
					}else if(record.length == 1){
						alert.innerText = '请再次绘制手势密码';
						rs.sender.clear();
					}else {
						alert.innerText = '请绘制手势密码';
						rs.sender.clear();
					}
				} else {
					checkUserlocker(rs.points.join(''));
					record = [];
					rs.sender.clear();
					return;
				}
			
			}
			function checkUserlocker(d){
				var uuid = plus.device.uuid;
	        	var pwdDataNow = "" + CryptoJS.HmacMD5(uuid + "",d + "");
	        	var reqData = {
	        		"mbUUID" : uuid,
	        		"PinType" : "2"
	        	};
        		var url = mbank.getApiURL()+'pwdQuery.do';
        		mbank.apiSend("post",url,reqData,pwdQuerySucFunc,pwdQueryFailFunc,true);
	        	function pwdQuerySucFunc(data){
	        		if(data.ec =="000"){
	        			var pwdDataOld = data.PinData;
	        			if(pwdDataNow == pwdDataOld){
	        				alert.innerText = '请绘制新手势密码';
							flag = true;
	        			}else{
	        				alert.innerText = '原手势密码错误，请重新输入';
							flag = false;
	        			}
	        		}else{
	        			flag = false;
	        			mui.alert(data.em,"温馨提示");
	        		}
	        	}
	        	function pwdQueryFailFunc(e){
	        		flag = false;
	        		mui.alert(e.em,"温馨提示");
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
	        			params[customerId] = pwdData;
	        			params["state"] = "0";
						params["islock"] = "0";
						userInfo.setItem("session_keys",JSON.stringify(params));
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
		} else {
			var wvs = plus.webview.all();
			for (var i = 0; i < wvs.length; i++) {
				if (wvs[i].id != 'HBuilder' && wvs[i].id != 'main' && wvs[i].id != 'index') {
					plus.webview.close(wvs[i].id);
				}
			}
		}
		

	});
});