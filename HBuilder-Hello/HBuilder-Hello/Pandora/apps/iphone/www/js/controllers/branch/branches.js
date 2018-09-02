define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
	var currentItem = "branchesList";
	var pageBranchesList = [];
	var myPosition;
	var lat;
	var longt;
	var top = "64px";
	if(mui.os.android ){
		top = '46px';				
	}
    
    mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
			url:'branchesList.html',
			id:'branchesList',
			styles: {
			    top: top,
			    bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		//全部网点在地图上显示
		$("#allBrancesMap").on("tap",function(){
			if(pageBranchesList.length > 0){
				var allBrancesMap = document.getElementById("allBrancesMap");
				var noCheck = allBrancesMap.getAttribute("noCheck");
				var path = allBrancesMap.getAttribute("path");
				var id = allBrancesMap.getAttribute("id");
				var param = {
					paramServiceObj: pageBranchesList,//所有网点
					paramMyPoi: myPosition,//当前位置
					paramMyLat: lat,//当前位置纬度
					paramMyLng: longt, //当前位置经度
					noCheck : noCheck
				};
				mbank.openWindowByLoad(path, id, "slide-in-right", param);
			}else{
//				var branchesList = plus.webview.getWebviewById("branchesList");
//				mui.fire(branchesList,'muiAlert',{data: "没有查询到网点信息！"});//在子页面调用

				mui.toast("没有查询到网点信息！");
//				plus.nativeUI.alert("没有查询到网点信息！");////原生弹出框 
//				mui.alert("没有查询到网点信息！");//父页面--非原生弹出框 点击有遮罩--暂未可用
//				return;
			}
		});
		//重新加载
		window.addEventListener("reload", function(event) {
			var child = plus.webview.getWebviewById("branchesList");
			mui.fire(child, 'itemId', {currentItem: currentItem});
		});
		
		//获取子页面参数
		window.addEventListener("getParam", function(event) {
			pageBranchesList = event.detail.pageBranchesList;
			myPosition = event.detail.myPosition;
			lat = event.detail.lat;
			longt = event.detail.longt;
		});
	});
});