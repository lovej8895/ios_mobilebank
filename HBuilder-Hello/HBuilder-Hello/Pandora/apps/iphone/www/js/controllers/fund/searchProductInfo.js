define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');	
	
	var fundProdInfo = [];
	var turnPageBeginPos=1;
    var turnPageShowNum=1;
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		plus.nativeUI.showWaiting("加载中...");
		queryAllProductInfo();
		function queryAllProductInfo(){			
			var params={
				f_cust_type:"1",
				liana_notCheckUrl:false
        	};
        	//var url = mbank.getApiURL()+'queryAllProdNameCodeInfo.do';
        	var url = mbank.getApiURL()+'queryDownProdInfo.do';//查询定时任务下载的产品信息
        	mbank.apiSend("post",url,params,successCallback,errorCallback,true);
        	
        	function successCallback(data){
        		var tempMesHtml ="";
        		var dataVal ="";
        		var TempSearchProd ="";
        		var tempvalues ="";
        		
        		var f_iAllProductInfoList = data.f_briefInfoList;
        		if (f_iAllProductInfoList.length > 0) {
        			for (var i = 0; i < data.f_briefInfoList.length; i++) {
		        		var currObj = data.f_briefInfoList[i];
		        		dataVal = currObj.f_prodcode+"&"+currObj.f_prodname+"&"+currObj.f_prodtype+"&"+currObj.f_tano;
		        		TempSearchProd = currObj.f_prodcode + currObj.f_prodname+":"+dataVal;//产品代码+产品名称
		        		
		        		tempMesHtml += '<li productDetails="'+dataVal+'">';
		        		tempMesHtml += '<p class="color_6">'+currObj.f_prodname+'</p>';
		        		tempMesHtml += '<p class="fz_15">'+currObj.f_prodcode+'</p>';
		        		tempMesHtml += '</li>';
		        		
		        		fundProdInfo.push(TempSearchProd);//添加到数组
        			}
        			$("ul").append(tempMesHtml);
        			plus.nativeUI.closeWaiting();
        			//点击单个产品跳转到基金详情页面
        			$("ul li").on("tap",function(){
        				var productDetails=$(this).attr("productDetails");      				
        				var showf_prodcode = productDetails.split("&")[0];
						var showf_prodname = productDetails.split("&")[1];
						var showf_prodtype = productDetails.split("&")[2];
						var showf_tano = productDetails.split("&")[3];
						//跳转基金详情
						toFundProdDetails(showf_prodcode,showf_prodname,showf_prodtype,showf_tano);
        			});
        		}
        	}
        	function errorCallback(e){
        		plus.nativeUI.closeWaiting();
        		mui.toast(e.em);
        	}
        	
		}
		
		//监听搜索框输入，模糊查询产品信息
		$("#searchKey").bind('input propertychange',function(){
			var keyWord = $("#searchKey").val();
			var fundProdInfoList = searchByIndexOf(keyWord,fundProdInfo);			
			renderProds(fundProdInfoList);
		});
		
		//模糊查询
		function searchByIndexOf(keyWord,list){
			if (!(list instanceof Array)) {
				return;
			}
			var subkey ="";
			var showsubkey ="";
			var arr = [];
			for (var j = 0; j < list.length; j++) {
				subkey = list[j];
				showsubkey = subkey.split(":")[0];
				//mui.alert("keyWord :" +keyWord+ " --- "+list[j]);
				if (showsubkey.indexOf(keyWord)>-1) {
					arr.push(list[j]);
				}
			}
			return arr;
		}
		
		function renderProds(list){
			if (!(list instanceof Array)) {
				return;
			}
			var itemHtml = '';
			var showprodname = '';
			var showprodcode ='';
			var slistr ='';
			var tempslistr ='';
			
			for (var i = 0; i < list.length; i++) {
				$("ul").empty();
				
				tempslistr = list[i];				
				slistr = tempslistr.split(":")[1];
				showprodcode = slistr.split("&")[0];
				showprodname = slistr.split("&")[1];
				
				itemHtml += '<li showproductDetails="'+slistr+'">';
		        itemHtml += '<p class="color_6">'+showprodname+'</p>';
		        itemHtml += '<p class="fz_15">'+showprodcode+'</p>';
		        itemHtml += '</li>';
		        
		        $("ul").append(itemHtml);
			}
			//点击单个产品跳转到基金详情页面
        	$("ul li").on("tap",function(){
        		var showproductDetails=$(this).attr("showproductDetails");       		
        		var showf_prodcode1 = showproductDetails.split("&")[0];
				var showf_prodname1 = showproductDetails.split("&")[1];
				var showf_prodtype1 = showproductDetails.split("&")[2];
				var showf_tano1 = showproductDetails.split("&")[3];
				//跳转基金详情
				toFundProdDetails(showf_prodcode1,showf_prodname1,showf_prodtype1,showf_tano1);
        	});
		}
		
		//基金详情
		function toFundProdDetails(valProdCode,valProdname,valProdType,valTano){
			console.log("productcode :"+valProdCode+" ProdType :"+valProdType);
			//判断产品类型，根据类型跳转到相应页面（余额宝：91）
			if (valProdType == '91') {
				var params4 ={
					"noCheck" : "false",
					f_prodcode:valProdCode,
					f_prodname:valProdname,
					f_prodtype:valProdType,
					f_tano:valTano
				};
				mbank.openWindowByLoad('../fund/cashFundDetail.html','cashFundDetail','slide-in-right',params4);
				
			} else{//非余额宝
				var params5 ={
					f_prodcode:valProdCode,
					f_prodname:valProdname,
					f_prodtype:valProdType,
					f_tano:valTano
				};
				mbank.openWindowByLoad('../fund/fundProductDetail.html','fundProductDetail','slide-in-right',params5);
			}
		}
	});
});