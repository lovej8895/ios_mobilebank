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
		var deviceManager = plus.webview.getWebviewById("deviceManager");
		var frontView = plus.webview.getWebviewById('infoConfirm');
		var beginView = plus.webview.getWebviewById('infoVerification');
		var self = plus.webview.currentWebview();
		var loginView = plus.webview.getWebviewById("login");
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
					break;
					}
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
		
		
		document.getElementById("delDeviceBound").addEventListener('tap',function(){
			showConfirm();
		});
		
	
		function showConfirm(){
			var bts=["是","取消"];
//			plus.nativeUI.confirm("解绑后将自动退出登录",function(e){
			mui.confirm("解绑后将自动退出登录","解除设备绑定",bts, function(e) {		
				var i=e.index;
				if(i==0){//当选择为是时，后台进行设备绑定解除后，清除缓存信息，退出应用
					var params = {
						session_customerId : customerId,
						mbUUID : mbUUID
					};
					var url = mbank.getApiURL() + 'delDeviceInfo.do';
					mbank.apiSend('post', url, params, delSuccess, delError,  true, false);
				}else{
					return;
				}
			});
		}
		//解绑成功调用清除缓存后再退出应用
		function delSuccess(){
//			var url = mbank.getApiURL() + 'userSignOff.do';
//			mbank.apiSend('post', url, null ,quitSuccess, quitError, false);
//			function quitSuccess(){
				var main_sub = plus.webview.getWebviewById("main_sub");
				mui.fire(main_sub,'logOut',{});
				plus.webview.getLaunchWebview().setStyle({mask:"none"});
				plus.nativeUI.toast("您已成功退出");
				var myOwn = plus.webview.getWebviewById("myOwn");
				mui.fire(myOwn,"reload");
				var safeCenterHome = plus.webview.getWebviewById("safeCenterHome");
				plus.webview.close(safeCenterHome);
				var myRight = plus.webview.getWebviewById("myRight");
				plus.webview.close(myRight);
				mbank.backToIndex(true);
				self.close();
//			}
			
//			function quitError(){
//				
//			}
		}
		function delError(data){
			plus.nativeUI.toast(data.em);
		}
		
		var frontView = plus.webview.getWebviewById("deviceManager");
		mui.back = function(){
			plus.webview.close(frontView);
			plus.webview.close(self);
		}
		
		//滑动切换
		window.addEventListener("swipeleft",function(e){
			if (Math.abs(e.detail.angle) > 170) {
				plus.webview.getWebviewById("otherDevice").show();
	    		mui.fire(plus.webview.getWebviewById("deviceManager"),"changeMenu",{pageId:"otherDevice"});
			}
	   		//plus.webview.close(self);
		});
		
	});

});