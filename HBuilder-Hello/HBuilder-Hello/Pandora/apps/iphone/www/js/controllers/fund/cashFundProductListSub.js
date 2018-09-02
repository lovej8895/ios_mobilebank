define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
	var params;
	var urlVar;
	
	mui.init({
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
			turnPageBeginPos = 1;
			queryProductList(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = jQuery('#productList ul').length;
			if(currentNum >= turnPageTotalNum) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryProductList(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
		}, 800);
	}
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		queryProductList = function(beginPos){
			params = {
				"f_cust_type":"1",
				"f_prodtype":"91",
				"f_updownflag":"",
				"turnPageBeginPos":beginPos,
				"turnPageShowNum":turnPageShowNum,
				"liana_notCheckUrl":false
			};
			urlVar = mbank.getApiURL() + 'fund_ProductSearchNew.do';
			mbank.apiSend("post",urlVar,params,queryProductListSuc,queryProductListFail,false);
			function queryProductListSuc(data){
				if(data.ec == "000"){
					document.getElementById("noContent").style.display="none";
					var pordList = data.f_fundProList2;
					turnPageTotalNum = data.turnPageTotalNum;
					if( beginPos==1 ){
			       		jQuery("#productList").empty();
			    	}
					var	html="";
					if(pordList.length>0){
						for(var i = 0; i < pordList.length; i++){
							var proName = pordList[i].f_prodname;
							var proCode = pordList[i].f_prodcode;
							var tano = pordList[i].f_tano;
							var income = pordList[i].f_fundincome;
							var navDate = format.formatDate(format.parseDate(pordList[i].f_navdate, "yyyymmdd"));
							var yield = pordList[i].f_yield;
							html+='<ul class="home_banking_box goDetail" data="'+proCode+'|'+tano+'">';
							if(beginPos==1 && i==0){
								html+= '<div class="fund_phb_bg2 p_lr10px m_top10px border_top_red">';
							}else{
								html+= '<div class="fund_phb_bg2 p_lr10px m_top10px">';
							}
							html+= '<p class="fund_phbtop fz_15"><span class="fz_17"></span></p>';
							html+= '<p class="fz_15 p_top10px">'+proName+'&nbsp;&nbsp;<span class="color_6">('+proCode+')</span></p>';
							html+= '<p class="m_top5px ove_hid"><span class="fund_phb_ico2"><span class="color_6">'+jQuery.param.getDisplay("FUND_PRODTYPE","91")+'</span></span></p>';
							html+= '<p class="m_top14px color_9"><span class="color_6">万份收益</span>&nbsp;&nbsp;<span class="color_red">¥'+parseFloat(income).toFixed(4)+'</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span class="fz_12 color_9">'+navDate+'</span></p>';
							html+= '<div class="fund_phb_pbox">';
							html+= '<p><span class="fz_22 color_red">'+parseFloat(yield).toFixed(2)+'<span>%</span></span><br /><span class="fz_12">七日年化收益</span></p>';
							html+= '</div>';
							html+= '<span class="fundarrow_right2"></span>';	
							html+= '</div>';
							html+='</ul>';
						}
						jQuery("#productList").append(html);
					}else{
						if( beginPos==1 ){
		       				document.getElementById("noContent").style.display="block";
				    	}
					}
				}else{
					mui.alert(data.em,"温馨提示");
				}
			}
			function queryProductListFail(e){
				mui.alert(e.em,"温馨提示");
			}
		}
		queryProductList(1);
		mui('body').on('tap','.goDetail',function(event) {
			var prodcode = this.getAttribute('data').split("|")[0];
			var tano = this.getAttribute('data').split("|")[1];
			params = {
				"noCheck" : "false",
				"f_prodcode" : prodcode,
				"f_prodtype" : "91",
				"f_tano" : tano
			};
			mbank.openWindowByLoad("../fund/cashFundDetail.html","cashFundDetail", "slide-in-right",params);
		});
		
	});
});