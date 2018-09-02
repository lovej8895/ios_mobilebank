define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	
	var customerId ="";
	var params;
	var urlVar;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		customerId = userInfo.get("session_customerId");
		if(customerId != null && customerId != ''){
			showTotalFund();
			showMyCollect();
		}else{
			showNoTotalFund();
			document.getElementById("myCollectDiv").style.display = "none";
		}
		showFundList();
		
		window.addEventListener("refreshTotalFund", function(event) {
			customerId = userInfo.get("session_customerId");
			if(customerId != null && customerId != ''){
				showTotalFund();
				showMyCollect();
			}else{
				showNoTotalFund();
				document.getElementById("myCollectDiv").style.display = "none";
			}
		});
		window.addEventListener("refreshMyCollect", function(event) {
			customerId = userInfo.get("session_customerId");
			if(customerId != null && customerId != ''){
				showMyCollect();
			}else{
				document.getElementById("myCollectDiv").style.display = "none";
			}
		});
		
		document.getElementById("searchDiv").addEventListener("tap",function(){
			mbank.openWindowByLoad('../fund/searchProductInfo.html','searchProductInfo','slide-in-right',"");
		},false);
		document.getElementById("fundMarketBtn").addEventListener("tap",function(){
			mbank.openWindowByLoad('../fund/fundmarket.html','fundmarket','slide-in-right',"");
		},false);
		
		//登录时基金总览
		function showTotalFund(){
			params = {
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "1"
			};
			urlVar = mbank.getApiURL()+'indexFundCapitalQuery.do';
			mbank.apiSend("post",urlVar,params,indexFundCapitalQuerySucFunc,indexFundCapitalQueryFailFunc,true);
			function indexFundCapitalQuerySucFunc(data){
				if(data.ec == "000"){
					if(data.f_custTotalFundval > 0){
						document.getElementById("totalFundMsg").innerHTML = '持有基金总览<span class="totalfund_ico2"></span>';
						document.getElementById("totalFundvalSpan").innerText = "¥"+format.formatMoney(data.f_custTotalFundval);
						document.getElementById("totalProfitLossSpan").innerText = "¥"+format.formatMoney(data.f_custTotalProfitLoss);
					}else{
						document.getElementById("totalFundMsg").innerHTML = '暂无基金资产<span class="totalfund_ico2"></span>';
						document.getElementById("totalFundvalSpan").innerText = "¥0.00";
						document.getElementById("totalProfitLossSpan").innerText = "¥0.00";
					}
				}else{
					mui.alert("基金资产查询失败，请重试");
				}
			}
			function indexFundCapitalQueryFailFunc(e){
				mui.alert("基金资产查询失败，请重试");
			}
		}
		//未登录时基金总览
		function showNoTotalFund(){
			document.getElementById("totalFundMsg").innerHTML = '暂未登录<span class="totalfund_ico2"></span>';
			document.getElementById("totalFundvalSpan").innerText = "¥0.00";
			document.getElementById("totalProfitLossSpan").innerText = "¥0.00";
		}
		//持有基金区域跳转
		document.getElementById("totalFundDiv").addEventListener("tap",function(){
			params = {
				"noCheck" : "false"
			};
			mbank.openWindowByLoad('../fund/myFund.html','myFund','slide-in-right',params);
		},false);
		//功能区域
		mui('body').on('tap','#functionDiv li',function(event) {
			var id = this.getAttribute("id");
		  	var path = this.getAttribute("path");
		 	var noCheck = this.getAttribute("noCheck");
		 	if(id==""){
			  	mui.alert("功能正在研发中···");
			  	return;
			}
            mbank.openWindowByLoad(path,id, "slide-in-right",{noCheck:noCheck});
		});		
		//我的关注
		function showMyCollect(){
			params = {
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "2"
			};
			urlVar = mbank.getApiURL()+'myNoticeList.do';
			mbank.apiSend("post",urlVar,params,myNoticeListSuc,myNoticeListFail,true);
			function myNoticeListSuc(data){
				if(data.ec =="000"){
					if(data.f_fundProList.length>0){
						var collectList = data.f_fundProList;
						var noticelist2 = data.data01.split(',');
						var html3 = "";
						var zdfIcon = "";
						var rateName = "";
						var rate = ""
						var incomeName="";
						var income = "";
						for(var j = 0; j < noticelist2.length; j++){
							for(var i=0;i<collectList.length;i++){
								if(noticelist2[j]==collectList[i].f_prodcode){
									rateName = "月涨跌幅";
									rate = parseFloat(collectList[i].f_rzdf).toFixed(2);
									if(rate =="-0.00" ){
										rate = "0.00";
									}
									incomeName = "最新净值";
									income = collectList[i].f_nav;
									if(rate >=0){
										zdfIcon = "fund_phb_icon fundarrow1";
									}else{
										zdfIcon = "fund_gz_icon fundarrow2";
									}
									if(collectList[i].f_prodtype =="12" || collectList[i].f_prodtype =="91"){
										zdfIcon ="";
										rateName = "七日年化收益";
										rate = parseFloat(collectList[i].f_yield).toFixed(2);
										if(rate =="-0.00" ){
											rate = "0.00";
										}
										incomeName = "万份收益";
										income = collectList[i].f_fundincome;
									}
									html3 +='<ul class="ove_hid goDetail" data="'+collectList[i].f_prodcode+'|'+collectList[i].f_tano+'|'+collectList[i].f_prodtype+'|'+collectList[i].f_prodname+'">';
									html3 +='<li class="fund_gz_left"><span class="'+zdfIcon+'"></span><p><span class="fz_22 color_red">'+rate+'</span><span>%</span><br /></rb><span>'+rateName+'</span></p></li>'
									html3 +='<li><p class="fund_gz_leftline"><span></span></p></li>';
									html3 +='<li class="fund_gz_r m_left15px">';
									html3 +='<p class="m_top14px fz_15">'+collectList[i].f_prodname+'<span class="color_6">('+collectList[i].f_prodcode+')</span></p>'
									html3 +='<p class="color_9">'+incomeName+'&nbsp;&nbsp;<span class="color_red">'+parseFloat(income).toFixed(4)+'</span></p>'
									html3 +='<span class="fundarrow_right"></span>';
									html3 +='</li></ul>';
								}
							}
						}
						jQuery('#myCollectDetailDiv').empty().append(html3);
						document.getElementById("myCollectDiv").style.display = "block";
					}else{
						document.getElementById("myCollectDiv").style.display = "none";
					}
				}else{
					document.getElementById("myCollectDiv").style.display = "none";
				}
			}
			function myNoticeListFail(e){
				document.getElementById("myCollectDiv").style.display = "none";
			}
		}
		//我的关注更多
		document.getElementById("noticemore").addEventListener("tap",function(){
			params = {
				"noCheck" : "false"
			};
			mbank.openWindowByLoad('../fund/myNotice.html','myNotice','slide-in-right',params);
		},false);
		//排行榜
		function showFundList(){
			params = {
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "2",
				"f_functionPage" : "1",
				"liana_notCheckUrl" : false
			};
			urlVar = mbank.getApiURL()+'indexFundList.do';
			mbank.apiSend("post",urlVar,params,indexFundListSucFunc,indexFundListFailFunc,true);
			function indexFundListSucFunc(data){
				if(data.ec == "000"){
					var html1="";
					var f_indexFundList = data.f_indexFundList;
					var f_fundProList = data.f_fundProList;
					if(f_indexFundList.length>0 && f_fundProList.length>0){
						var showName = "";
						var showType = "";
						for(var i=0;i<f_indexFundList.length;i++){
							showName = f_indexFundList[i].f_showName;
							showType = f_indexFundList[i].f_showType;
							html1="";
							html1 +='<div class="backbox_tit_homebg m_top10px fundListMoreDiv" showType="'+showType+'" showName="'+showName+'"><div class="backbox_tit_homeline">';
							html1 +='<p class="backbox_tit_homeico"></p><p class="backbox_hometit">'+showName+'</p>';
							html1 +='<p class="fund_more">更多</p></div></div>';
							var k=0;
							var iconClass="";
							var navOrIncomeName ="";
							var navOrIncome = "";
							var rzdfOrYieldName = "";
							var rzdfOrYield = "";
							var upClass = "";
							var html2="";
							for(var j=0;j<f_fundProList.length;j++){
								if(showType==f_fundProList[j].f_showType){
									iconClass="fund_phb_ico2";
									navOrIncomeName ="最新净值";
									navOrIncome = f_fundProList[j].f_nav;
									rzdfOrYieldName = "月涨跌幅";
									rzdfOrYield = parseFloat(f_fundProList[j].f_rzdf).toFixed(2);
									if(rzdfOrYield == "-0.00"){
										rzdfOrYield = "0.00";
									}
									upClass = "";
									if(rzdfOrYield >=0){
										upClass = "fund_phb_icon fundarrow1";
									}else{
										upClass = "fund_phb_icon fundarrow2";
									}
									if(f_fundProList[j].f_prodtype =="12" || f_fundProList[j].f_prodtype =="91"){
										iconClass="fund_phb_ico2";
										navOrIncomeName ="万份收益";
										navOrIncome = f_fundProList[j].f_fundincome;
										rzdfOrYieldName = "七日年化收益";
										rzdfOrYield = parseFloat(f_fundProList[j].f_yield).toFixed(2);
										if(rzdfOrYield == "-0.00"){
											rzdfOrYield = "0.00";
										}
										upClass = "";
									}
									if(k==0){
										html2 +='<div class="fund_phb_bg p_lr10px goDetail" data="'+f_fundProList[j].f_prodcode+'|'+f_fundProList[j].f_tano+'|'+f_fundProList[j].f_prodtype+'|'+f_fundProList[j].f_prodname+'" >';
//										html2 +='<p class="fund_phbtop_icon"></p>';
//										html2 +='<p class="fund_phbtop fz_15">TOP<span class="fz_17">1</span></p>';
										html2 +='<p class="fz_15 p_top10px">'+f_fundProList[j].f_prodname+'&nbsp;&nbsp;<span class="color_6">('+f_fundProList[j].f_prodcode+')</span></p>';
										html2 +='<p class="m_top5px ove_hid"><span class="'+iconClass+'"><span class="color_6">'+jQuery.param.getDisplay("FUND_PRODTYPE",f_fundProList[j].f_prodtype)+'</span></span></p>';
										html2 +='<p class="m_top14px color_9"><span class="color_6">'+navOrIncomeName+'</span>&nbsp;&nbsp;<span class="color_red">'+parseFloat(navOrIncome).toFixed(4)+'</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span class="fz_12 color_9">'+format.dataToDate(f_fundProList[j].f_navdate)+'</span></p>';
										html2 +='<div class="fund_phb_pbox">';
										html2 +='<span class="'+upClass+'"></span>';
										html2 +='<p><span class="fz_22 color_red">'+rzdfOrYield+'<span>%</span></span><br /><span class="fz_12">'+rzdfOrYieldName+'</span></p>';
										html2 +='</div><span class="fundarrow_right2"></span>';
										html2 +='</div>';
									}else if(k==1){
										html2 +='<div class="fund_phb_bg2 p_lr10px m_top10px goDetail" data="'+f_fundProList[j].f_prodcode+'|'+f_fundProList[j].f_tano+'|'+f_fundProList[j].f_prodtype+'|'+f_fundProList[j].f_prodname+'">';
//										html2 +='<p class="fund_phbtop_icon"></p>';
//										html2 +='<p class="fund_phbtop fz_15">TOP<span class="fz_17">2</span></p>';
										html2 +='<p class="fz_15 p_top10px">'+f_fundProList[j].f_prodname+'&nbsp;&nbsp;<span class="color_6">('+f_fundProList[j].f_prodcode+')</span></p>';
										html2 +='<p class="m_top5px ove_hid"><span class="'+iconClass+'"><span class="color_6">'+jQuery.param.getDisplay("FUND_PRODTYPE",f_fundProList[j].f_prodtype)+'</span></span></p>';
										html2 +='<p class="m_top14px color_9"><span class="color_6">'+navOrIncomeName+'</span>&nbsp;&nbsp;<span class="color_red">'+parseFloat(navOrIncome).toFixed(4)+'</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span class="fz_12 color_9">'+format.dataToDate(f_fundProList[j].f_navdate)+'</span></p>';
										html2 +='<div class="fund_phb_pbox">';
										html2 +='<span class="'+upClass+'"></span>';
										html2 +='<p><span class="fz_22 color_red">'+rzdfOrYield+'<span>%</span></span><br /><span class="fz_12">'+rzdfOrYieldName+'</span></p>';
										html2 +='</div><span class="fundarrow_right2"></span>';
										html2 +='</div>';
									}
									k++;
								}
							}
							if(html1 !='' && html2 !=''){
								jQuery('#fundListDiv').append(html1);
								jQuery('#fundListDiv').append(html2);
							}
						}
					}
				}
			}
			function indexFundListFailFunc(e){
			}
		}
		//排行榜区域详情
		mui('body').on('tap','.goDetail',function(event) {
			var prodcode = this.getAttribute('data').split("|")[0];
			var tano = this.getAttribute('data').split("|")[1];
			var prodType = this.getAttribute('data').split("|")[2];
			var prodName = this.getAttribute('data').split("|")[3];
			if(prodType == "91"){
				params = {
					"noCheck" : "false",
					"f_prodcode" : prodcode,
					"f_prodtype" : prodType,
					"f_tano" : tano,
					"f_prodname" : prodName
				};
				mbank.openWindowByLoad("../fund/cashFundDetail.html","cashFundDetail", "slide-in-right",params);
			}else{
				params = {
					"f_prodcode" : prodcode,
					"f_prodtype" : prodType,
					"f_tano" : tano,
					"f_prodname" : prodName
				};
				mbank.openWindowByLoad("../fund/fundProductDetail.html","fundProductDetail", "slide-in-right",params);
			}
		});
		//排行榜区域更多
		mui('body').on('tap','.fundListMoreDiv',function(event) {
			var showTypeVar = this.getAttribute('showType');
			var showNameVar = this.getAttribute('showName');
			params = {
				"showType" : showTypeVar,
				"showName" : showNameVar
			};
			mbank.openWindowByLoad("../fund/fundcharts.html","fundcharts", "slide-in-right",params);
		});
		
		
		//广告链接跳转
		jumPage=function (str){
				 jumpOrShow(mbank,str);
		}
		//广告加载
		jQuery(loadADHtml(false, "frameBlockC", "frameBlock", "ad_fund_home.html",false));
	});
});