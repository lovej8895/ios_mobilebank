define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
	var m = mui;
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var chartListAll=[];
	var top = "64px";
	if(mui.os.android ){
		top = '44px';				
	}
	m.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback:pulldownfresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	
	function pulldownfresh(){
		setTimeout(function() {
			turnPageBeginPos=1;	
			fundChartsList(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
		}, 800);
    }

 	function pullupRefresh() {
		setTimeout(function() {
			var currentNum = $('ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			fundChartsList(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
 	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		document.getElementById('title').innerText = self.showName;
		
		fundChartsList = function(beginPos){
			var param = {
				liana_notCheckUrl : false,
				f_showType : self.showType,
				f_updownflag : "31",
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum
			};
			var url = mbank.getApiURL() + 'fundcharts.do';
			mbank.apiSend('post',url,param,successCallback,errorCallback,false);
			
			function successCallback(data){
				turnPageTotalNum = data.turnPageTotalNum;
				var chartslist = data.f_fundProList;
				if (beginPos == 1) {
					$("#chartsList").empty();
				}
				var html='';
				for(var i = 0; i < chartslist.length; i++){
					var index=beginPos+i-1;
					chartListAll[index]=chartslist[i];
					var proType = chartslist[i].f_prodtype;//基金类型
					var date = format.formatDate(format.parseDate(chartslist[i].f_navdate, "yyyymmdd"));//净值日期
					var yield = chartslist[i].f_yield;//七日年化收益
					var rzdf = chartslist[i].f_rzdf;//月涨跌幅
					var proName = chartslist[i].f_prodname;//产品名称
					var proCode = chartslist[i].f_prodcode;//产品代码
					var income = chartslist[i].f_fundincome;//万份收益
					var navincome = chartslist[i].f_nav;//最新净值
					html+='<ul class="home_banking_box" index=' + index + '>';
					if(index==0){
						html+= '<div class="fund_phb_bg2 p_lr10px m_top10px border_top_red">';
					}else{
						html+= '<div class="fund_phb_bg2 p_lr10px m_top10px">';
					}
//					html+= '<p class="fund_phbtop_icon"></p>';
//					html+= '<p class="fund_phbtop fz_15">TOP<span class="fz_17">'+(index+1)+'</span></p>';
					html+= '<p class="fz_15 p_top10px">'+proName+'&nbsp;&nbsp;<span class="color_6">('+proCode+')</span></p>';
					if(proType=='12'||proType=='91'){
						yield = parseFloat(yield).toFixed(2);
						if(yield =="-0.00" ){
							yield = "0.00";
						}
						html+= '<p class="m_top5px ove_hid"><span class="fund_phb_ico2"><span class="color_6">'+jQuery.param.getDisplay("FUND_PRODTYPE",proType)+'</span></span></p>';
						html+= '<p class="m_top14px color_9"><span class="color_6">万份收益</span>&nbsp;&nbsp;<span class="color_red">¥'+parseFloat(income).toFixed(4)+'</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span class="fz_12 color_9">'+date+'</span></p>';
						html+= '<div class="fund_phb_pbox">';
						html+= '<p><span class="fz_22 color_red">'+yield+'<span>%</span></span><br /><span class="fz_12">七日年化收益</span></p>';
					}else{
						rzdf = parseFloat(rzdf).toFixed(2);
						if(rzdf =="-0.00" ){
							rzdf = "0.00";
						}
						html+= '<p class="m_top5px ove_hid"><span class="fund_phb_ico2"><span class="color_6">'+jQuery.param.getDisplay("FUND_PRODTYPE",proType)+'</span></span></p>';
					    html+= '<p class="m_top14px color_9"><span class="color_6">最新净值</span>&nbsp;&nbsp;<span class="color_red">¥'+parseFloat(navincome).toFixed(4)+'</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span class="fz_12 color_9">'+date+'</span></p>';
						html+= '<div class="fund_phb_pbox">';
						html+= '<p><span class="fz_22 color_red">'+rzdf+'<span>%</span></span><br /><span class="fz_12">月涨跌幅</span></p>';
					}
					html+= '</div>';
					html+= '<span class="fundarrow_right2"></span>';	
					html+= '</div>';
					html+='</ul>';
				}
				$("#chartsList").append(html);
				jQuery("#chartsList ul").on('tap', function(){
					var i = jQuery(this).attr("index");
					var prodcode = chartListAll[i].f_prodcode;
					var prodType = chartListAll[i].f_prodtype;
					var prodName = chartListAll[i].f_prodname;
					var tano = chartListAll[i].f_tano;
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
			}
			function errorCallback(data){
				mui.alert(data.em);
			}
		}
		
		fundChartsList(1);
	});
});