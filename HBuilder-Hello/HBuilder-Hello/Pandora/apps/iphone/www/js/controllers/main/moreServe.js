define(function(require, exports, module) {
	console.log("更多服务");
	var doc = document;
	var $ = mui;
    var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format=require('../../core/format');
	$.init();
	$.plusReady(function() {
		 /*var backBtnId = doc.getElementById("backBtnId");
		 
		 backBtnId.addEventListener("tap",function(){
			plus.webview.close('moreServe');
		});*/
		//助农贷款
		jQuery("#helpFarmLoan").on("tap", function() {
			$.openWindow({
				url: '../main/specServe.html',
				id: 'specServe',
				show: {
					aniShow: 'none'
				},
				styles: {
					top: 0, //子页面顶部位置
					bottom: 0 //子页面底部位置
				},
				waiting: {
					autoShow: false
				}
			});
		});
		//vip会员尊享
		jQuery("#vipMember").on("tap", function() {
			$.openWindow({
				url: '../main/VIP.html',
				id: 'VIP',
				show: {
					aniShow: 'none'
				},
				styles: {
					top: 0, //子页面顶部位置
					bottom: 0 //子页面底部位置
				},
				waiting: {
					autoShow: false
				}
			});
		});
		//理财
		jQuery("#financeBuyId").on("tap", function() {
			var retPage = plus.webview.getLaunchWebview();
			mui.fire(retPage, 'footer', {
				fid: "productList"
			});
			$.openWindow({
				url: '../productList/productList.html',
				id: 'productList',
				extras: {
					productFlag: 'finances'
				},
				show: {
					aniShow: 'none'
				},
				styles: {
					top: 0, //子页面顶部位置
					bottom: '51px' //子页面底部位置
				},
				createNew: true,
				waiting: {
					autoShow: false
				}
			});
		});
		//基金
		jQuery("#fundBuyId").on("tap", function() {
			var retPage = plus.webview.getLaunchWebview();
			mui.fire(retPage, 'footer', {
				fid: "productList"
			});
			$.openWindow({
				url: '../productList/productList.html',
				id: 'productList',
				extras: {
					productFlag: 'funds'
				},
				show: {
					aniShow: 'none'
				},
				styles: {
					top: 0, //子页面顶部位置
					bottom: '51px' //子页面底部位置
				},
				createNew: true,
				waiting: {
					autoShow: false
				}
			});
		});
		
	});
});