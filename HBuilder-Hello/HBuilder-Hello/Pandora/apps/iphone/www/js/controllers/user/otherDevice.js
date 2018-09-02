/*
 * suxing
 * 设备绑定js,查询信息生成页面数据
 * 通过页面开关控制设备绑定状态(一般登录进去就是打开状态，关闭的话就会退出应用)
 */
define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var userInfo = require('../core/userInfo');
	
	mui.init();
	mui.plusReady(function() {
		var customerId = localStorage.getItem("session_customerId");
		var deviceList = [];
		var mbUUID = plus.device.uuid;
		
		var customerType = localStorage.getItem("customerType");
		
		
		//mui.alert(customerId);
		if(customerType=="01"){
			queryDeviceInfo();
		}else{
			document.getElementById("deviceList").innerText="您的账号为大众绑定";
		}
		function queryDeviceInfo(){
			var url = mbank.getApiURL() + 'deviceBoundQuery.do';
			var params = {
				session_customerId : customerId
				//mbUUID : mbUUID
			};
			mbank.apiSend('post', url, params, querrySuccess, queryError,false);
		
			function querrySuccess(data){
				//查询成功，开始循环查找此账号绑定设备中是否有当前登录的设备信息，没有进入绑定页面
				deviceList = data.deviceList;
				var count = 0;
				var html = '';
				for(var i=0;i<deviceList.length;i++){
					if(mbUUID==deviceList[i].mbUUID){
						count++;
						continue;
					}
					var showDate = (deviceList[i].boundTime).substring(0,4)+"年"+(deviceList[i].boundTime).substring(4,6)+"月"+(deviceList[i].boundTime).substring(6,8)+"日";
					html+='<div class="backbox_tit_bg"><p class="backbox_tit_ico"></p><p class="backbox_tit">设备信息</p></div>';
					html+='<div class="backbox_th p_lr10px">';
					html+='<ul>';
//					html+='<li class="form-item">';
//					html+='<p><span class="input_lbg">设备编号：</span>';
//					html+='<span class="input_m14px" id="deviceType">'+deviceList[i].mbUUID+'</span></p>';
//					html+='</li>';
					html+='<li class="form-item">';
					html+='<p><span class="input_lbg">手机型号：</span>';
					html+='<span class="input_m14px" id="deviceType">'+deviceList[i].deviceType+'</span></p>';
					html+='</li>';
					html+='<li class="form-item">';
					html+='<p><span class="input_lbg">操作系统：</span>';
					html+='<span class="input_m14px" id="mpOS">'+deviceList[i].mpOS+'</span></p>';
					html+='</li>';
					html+='<li class="form-item">';
					html+='<p><span class="input_lbg">绑定日期：</span>';
					html+='<span class="input_m14px" id="boundTime">'+showDate+'</span></p>';
					html+='</li>';
					html+='</ul>';
					html+='</div>';
				}
				//当查询结果中没有匹配此设备的信息时，进入绑定页面
				if(count==0){
					plus.nativeUI.toast('请先绑定设备再进行操作');
					var path = "../user/infoVerification.html";
					var id = "infoVerification";
					var noCheck = "false";
					mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
					return;
				}else{
					//进入显示页面
					document.getElementById("deviceList").innerHTML=html;
				}
				
			}
			
			function queryError(data){
				plus.nativeUI.toast(data.em);
			}
		
		}
		
		plus.key.addEventListener('backbutton',function(){
			$("#deviceBoundBack").click();
		},false);
		
		var currView = plus.webview.currentWebview();
		var frontView = plus.webview.getWebviewById("deviceManager");
		mui.back = function(){
			plus.webview.close(frontView);
			plus.webview.close(currView);
		}
		
		//滑动切换
		window.addEventListener("swiperight",function(e){
			if (Math.abs(e.detail.angle) < 10) {
		    	plus.webview.getWebviewById("deviceBound").show();
		    	mui.fire(plus.webview.getWebviewById("deviceManager"),"changeMenu",{pageId:"deviceBound"});
		    }
	    	//plus.webview.close(currView);
		});
		
		
		
	});

});