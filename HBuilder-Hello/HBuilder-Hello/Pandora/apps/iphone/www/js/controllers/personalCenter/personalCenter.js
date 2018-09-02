define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	$.init();
	$.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var state = app.getState();
		var loginTime = doc.getElementById("loginTime"), //上次登录时间
			changeSelfInfo = doc.getElementById("changeSelfInfo"), //个人信息变更
			managementPwd = doc.getElementById("managementPwd"), //安全中心
			changePhone = doc.getElementById("changePhone"), //变更手机号
			cusService = doc.getElementById("cusService"),//客户服务
			adviceBack = doc.getElementById("adviceBack"),//意见反馈
			signOut = doc.getElementById("signOut"), //安全退出
			aboutUs = doc.getElementById("aboutUs"),//关于我们
			phoneNo = doc.getElementById("phoneNo"),
			aboutUs = doc.getElementById("aboutUs"),//关于我们
			
			self = plus.webview.currentWebview(),
		    submitObject = self.submitObject;
		    
			var sessionid = userInfo.get('sessionId');
			
			console.log("登录");
			
			plus.webview.close('changeSelfInfo',"none");
			plus.webview.close('changeNickName',"none");
			
		if (sessionid == '' || sessionid == null || sessionid == undefined) {
				var params = userInfo.getItem('session_keys') ||null;
				console.log("&&"+params)
				if (params!=null) { //state{0:开通；1：关闭；}  islock{0:正常；1：锁定}
					mui.openWindow({
						url: '../login/unlock.html',
						id: 'unlock'
					});
				} else {
					mui.openWindow({
						url: '../login/login.html',
						id: 'login'
					});
				}
			} else {
			

		var te=document.getElementById("switchflag");
		var desc_lock = doc.getElementById("desc_lock");
		var session_keys = userInfo.getItem("session_keys")||null;
		
		if(session_keys!=null){
			te.setAttribute("class","mui-active mui-switch mui-switch-blue");
			desc_lock.innerText = '手势密码开通';
		}else{
			desc_lock.innerText = '手势密码关闭';
		}
		
		 te.addEventListener('toggle', function(event) {
			if(te.classList.contains('mui-active')){
			desc_lock.innerText = '手势密码开通';
			
			 $.openWindow({
					url: '../plus/userLocker.html',
					id: 'userLocker',
					show: {
						aniShow: 'pop-in'
					},
					styles: {
						popGesture: 'hide'
					},
					waiting: {
						autoShow: false
					}
				});
			
		    }else{
		    	desc_lock.innerText = '手势密码关闭';
		    	userInfo.removeItem("session_keys");
		    }
		});
			
			
			//查询个人的信息
			var sessioncustomerId = localStorage.getItem("session_customerId");
			var user_nickname = doc.getElementById("user_nickname");
			
			var searchNickName = {
				currentBusinessCode: "00500401",
				session_customerId:sessioncustomerId
			};

			var url = mbank.getApiURL() + 'getUserNikeName.do';
			mbank.apiSend('post', url, searchNickName, nickBack, true);

			function nickBack(data) {
				user_nickname.innerText = data.customerAlias;
			}
			
			
			//查询手机号
			var searchCustom = {
				currentBusinessCode: "00510001",
			};

			var url = mbank.getApiURL() + 'mobilePhoneNumberInput.do';
			mbank.apiSend('post', url, searchCustom, callBack, true);

			function callBack(data) {
				phoneNo.innerHTML = data.mobileNo;
			}
			//查询登录时间
			/*var lastLoginTime = {
				currentBusinessCode: '01800103'
			}
			var url = mbank.getApiURL() + 'icQueryCstScore.do';
			mbank.apiSend('post', url, lastLoginTime, callBack1, true);*/

			function callBack1(data1) {
				lastTime = "上次登录时间：" + format.formatDateTime(data1.lastLogonTime);
				loginTime.innerHTML = lastTime;
			}
		}

		//客户服务
		cusService.addEventListener("tap", function(event) {
				$.openWindow({
					url: 'cusService.html',
					id: 'cusService',
					show: {
						aniShow: 'pop-in'
					},
					styles: {
						popGesture: 'hide'
					},
					waiting: {
						autoShow: false
					}
				});
			}, false)
		
		//意见反馈
		adviceBack.addEventListener("tap", function(event) {
				$.openWindow({
					url: 'adviceBack.html',
					id: 'adviceBack',
					show: {
						aniShow: 'pop-in'
					},
					styles: {
						popGesture: 'hide'
					},
					createNew:true,
					waiting: {
						autoShow: false
					}
				});
			}, false)
		
		
		//关于我们
		aboutUs.addEventListener("tap",function(){
			$.openWindow({
					url: 'aboutUs.html',
					id: 'aboutUs',
					show: {
						aniShow: 'pop-in'
					},
					styles: {
						popGesture: 'hide'
					},
					createNew:true,
					waiting: {
						autoShow: false
					}
				});
		},false)

		//安全退出

		signOut.addEventListener("tap", function(event) {
//				plus.nativeUI.confirm("请确认是否退出当前登录账号？", function(e) {
				mui.confirm("请确认是否退出当前登录账号？","提示",["确认", "取消"], function(e) {	
					if (e.index == 0) {
						var wvs=plus.webview.all();
						//var self=plus.webview.currentWebview();
						var w=plus.webview.getLaunchWebview();
						for(var i=0;i<wvs.length;i++){
							if(wvs[i].id!=w.id&&wvs[i].id!='main'&&wvs[i].id!=self.id){
								plus.webview.close(wvs[i].id);
							}
							
						}
						userInfo.removeItem("sessionId");
						localStorage.removeItem("re_accountNo");
						localStorage.removeItem("scanMessageFlag");
						var retPage = plus.webview.getLaunchWebview();
						mui.fire(retPage, 'footer', {
							fid: "main"
						});
						self.hide();
						$.openWindow({
							url: '../main/main.html',
							id: 'main',
							show: {
								aniShow: 'pop-in'
							},
							styles: {
								top:'0px',
								bottom:'51px'
							},
							waiting: {
								autoShow: false
							}
						});
					} else {
						plus.nativeUI.closeWaiting();
					}

				})

			}, false)
			//个人信息变更功能
		changeSelfInfo.addEventListener("tap", function(event) {
			$.openWindow({
				url: 'changeSelfInfo.html',
				id: 'changeSelfInfo',
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				createNew:true,
				waiting: {
					autoShow: false
				},
				extras:{
				       userNickName:user_nickname.innerText
				}
			});
		}, false)

		//安全中心
		managementPwd.addEventListener("tap", function(event) {
			$.openWindow({
				url: 'passwordManage.html',
				id: 'passwordManage',
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});
		}, false)

		//变更手机号
		changePhone.addEventListener("tap", function(event) {
			plus.nativeUI.toast(phoneNo.value);
			$.openWindow({
				url: 'changeTelephoneNo.html',
				id: 'changeTelephoneNo',
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				},
				extras:{
				       mobileNo:phoneNo.innerHTML
				}
			});
		}, false)

	});

})