define(function(require, exports, module) {
	var doc = document;
	var m= mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	m.init();
	m.plusReady(function() {
		
		//查询版本号
		
		plus.runtime.getProperty(plus.runtime.appid,function(inf){
		    var  wgtVer=inf.version;
		    doc.getElementById("version").innerText = "当前版本："+wgtVer;
		});
		
		
		//分享链接
		var shares = null,
			bhref = false;
		var Intent = null,
			File = null,
			Uri = null,
			main = null;
		// H5 plus事件处理
		function plusReady() {
			updateSerivces();
			if (plus.os.name == "Android") {
				Intent = plus.android.importClass("android.content.Intent");
				File = plus.android.importClass("java.io.File");
				Uri = plus.android.importClass("android.net.Uri");
				main = plus.android.runtimeMainActivity();
			}
		}
		if (window.plus) {
			plusReady();
		} else {
			document.addEventListener("plusready", plusReady, false);
		}
		/**
		 * 更新分享服务
		 */
		function updateSerivces() {
			plus.share.getServices(function(s) {
				shares = {};
				for (var i in s) {
					var t = s[i];
					shares[t.id] = t;
				}
			}, function(e) {
				console.log("获取分享服务列表失败：" + e.message);
			});
		}

		function shareHref() {
			var shareBts = [];
			// 更新分享列表
			var ss = shares['weixin'];
			ss && ss.nativeClient && (shareBts.push({
					title: '微信朋友圈',
					s: ss,
					x: 'WXSceneTimeline'
				}),
				shareBts.push({
					title: '微信好友',
					s: ss,
					x: 'WXSceneSession'
				}));
			ss = shares['qq'];
			ss && ss.nativeClient && shareBts.push({
				title: 'QQ',
				s: ss
			});
			// 弹出分享列表
			shareBts.length > 0 ? plus.nativeUI.actionSheet({
				title: '分享链接',
				cancel: '取消',
				buttons: shareBts
			}, function(e) {
				(e.index > 0) && shareAction(shareBts[e.index - 1], true);
			}) : mui.alert('当前环境无法支持分享链接操作!');
		}

		function shareAction(sb, bh) {
			console.log("分享操作：");
			if (!sb || !sb.s) {
				console.log("无效的分享服务！");
				return;
			}
			var msg = {
				content: '我正在使用HBuilder+HTML5开发移动应用，赶紧跟我一起来体验！',
				extra: {
					scene: sb.x
				}
			};
			if (bh) {
				//msg.href=sharehref.value;
				var ur = 'https://www.baidu.com';
				msg.href = ur;
				//msg.title=sharehrefTitle.value;
				msg.title = '湖北银行';
				//msg.content=sharehrefDes.value;
				msg.content = '湖北银行手机银行APP全面上线啦！';
				msg.thumbs = ["_www/icon.png"];
				msg.pictures = ["_www/icon.png"];
			} else {
				if (pic && pic.realUrl) {
					msg.pictures = [pic.realUrl];
				}
			}
			// 发送分享
			if (sb.s.authenticated) {
				shareMessage(msg, sb.s);
				console.log("---已授权---");
			} else {
				console.log("---未授权---");
				sb.s.authorize(function() {
					shareMessage(msg, sb.s);
				}, function(e) {
					console.log("认证授权失败：" + e.code + " - " + e.message);
				});
			}
		}

		function shareMessage(msg, s) {
			console.log(JSON.stringify(msg));
			s.send(msg, function() {
				console.log("分享到\"" + s.description + "\"成功！ ");
			}, function(e) {
				console.log("分享到\"" + s.description + "\"失败: " + JSON.stringify(e));
			});
		}
		
//		doc.getElementById("hubeiPhone").addEventListener('tap',function(){
//			
//		});
		
		dail = function (phoneNum){
			mui.confirm("您确定要拨打电话：" + phoneNum + " 吗？","提示",["确定", "取消"], function(e) {
					if (e.index == 0) {
		                plus.device.dial( phoneNum, false );
		            }
		        }
		    )
		}
		
//		doc.getElementById("backButton").addEventListener('tap',function(){
//			mui.back();
//		});
		

	});
	
	
});