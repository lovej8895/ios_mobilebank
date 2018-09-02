define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var iAccountInfoList = [];
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var self = plus.webview.currentWebview();
		
		var allBranchesList = self.allBranchesList;//网点名称
		var ibwBranchName = allBranchesList.ibwBranchName;//网点名称
		var businessTime = allBranchesList.businessTime;//营业时间
		var ibwBranchAddress = allBranchesList.ibwBranchAddress;//地址
		var ibwBranchPhone = allBranchesList.ibwBranchPhone;//电话
		var routes = allBranchesList.routes;//公交路线
		var ibwBranchType = allBranchesList.ibwBranchType;//网点类型
		var paramMyPoi = self.myPosition;//当前位置
		var paramMyLat = self.paramMyLat;//当前位置纬度
		var paramMyLng = self.paramMyLng;//当前位置经度
		var distance = self.distance;//距离
		var noCheck = self.noCheck;//
		
		document.getElementById("ibwBranchName").innerHTML = ibwBranchName;
		document.getElementById("businessTime").innerHTML = businessTime;
		document.getElementById("ibwBranchAddress").innerHTML = ibwBranchAddress;
		document.getElementById("ibwBranchPhone").innerHTML = ibwBranchPhone;
//		document.getElementById("routes").innerHTML = routes;
		
//		if(ibwBranchType != 1){
//		//无卡取款 预约取款
//		document.getElementById("drawWithoutCard_li").style.display = "block";
//		var drawWithoutCard = document.getElementById("drawWithoutCard");
//		drawWithoutCard.addEventListener('tap',function(){
//			//mui.alert("111");
//			var path = this.getAttribute("path");
//			var id = this.getAttribute("id");
//			var noCheck = this.getAttribute("noCheck");
//			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
//		});
//		}else{
//			document.getElementById("drawWithoutCard_li").style.display = "none";
//		}
		
		//跳转到每个网点的位置
		goThere = document.getElementById("branchesGps"), //到这去
		goThere.addEventListener("tap", function() {
			var branchesGps = document.getElementById("branchesGps");
			var noCheck = branchesGps.getAttribute("noCheck");
			var path = branchesGps.getAttribute("path");
			var id = branchesGps.getAttribute("id");
			var param = {
				paramServiceObj: allBranchesList,//当前网点
				paramMyPoi: paramMyPoi,//当前位置
				paramMyLat: paramMyLat,//当前位置纬度
				paramMyLng: paramMyLng, //当前位置经度
				distance: distance, //距离
				noCheck : noCheck
			};
			mbank.openWindowByLoad(path, id, "slide-in-right", param);
		});
		
		dail = function (){
			if(ibwBranchPhone != ''){
				mui.confirm("您确定要拨打电话：" + ibwBranchPhone + " 吗？","提示",["确定", "取消"], function(e) {
						if (e.index == 0) {
		                	plus.device.dial( ibwBranchPhone, false );
		            	}
		        	}
		    	)
			}
		}
		
		
	});
});