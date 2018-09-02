define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
	var m = mui;
	var notice = document.getElementById('notice');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var customerId = localStorage.getItem("session_customerId");//网银客户号
	var noticeListAll=[];
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
			getNoticeList(1);
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
			getNoticeList(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
 	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		getNoticeList = function(beginPos){
			var param = {
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum
			};
			var url = mbank.getApiURL() + 'myNoticeList.do';
			mbank.apiSend('post',url,param,successCallback,errorCallback,false);
			
			function successCallback(data){
				turnPageTotalNum = data.turnPageTotalNum;
				noticelist = data.f_fundProList;
				if (beginPos == 1) {
					$("#notice").empty();
					if( turnPageTotalNum=='0' ){
//	                    $("#notice").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
	//                  mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						plus.webview.close(self);
	                    return;
	    			}
				}
				var noticelist2 = data.data01.split(',');
				var html='';
				for(var j = 0; j < noticelist2.length; j++){
					for(var i = 0; i < noticelist.length; i++){
						if(noticelist2[j]==noticelist[i].f_prodcode){
							var index=beginPos+i-1;
							noticeListAll[index]=noticelist[i];
							var proType = noticelist[i].f_prodtype;//基金类型
							var date = format.formatDate(format.parseDate(noticelist[i].f_navdate, "yyyymmdd"));//净值日期
							var yield = noticelist[i].f_yield;//七日年化收益
							var rzdf = noticelist[i].f_rzdf;//月涨跌幅
							var proName = noticelist[i].f_prodname;//产品名称
							var proCode = noticelist[i].f_prodcode;//产品代码
							var income = noticelist[i].f_fundincome;//万份收益
							var navincome = noticelist[i].f_nav;//最新净值
							html+='<ul class="home_banking_box" index=' + index + '>';
							html+= '<div class="mynotice_fund_bg m_top10px">';
							html+= '<div class="mynotice_left">';
							if(proType=='12'||proType=='91'){
								yield = parseFloat(yield).toFixed(2);
								if(yield =="-0.00" ){
									yield = "0.00";
								}
								html+= '<p><span class="fz_22 color_red">'+yield+'</span>%</p>';
								html+= '<p class="color_6 fz_12">七日年化收益</p>';
							} else {
								rzdf = parseFloat(rzdf).toFixed(2);
								if(rzdf =="-0.00" ){
									rzdf = "0.00";
								}
								html+= '<p><span class="fz_22 color_red">'+rzdf+'</span>%</p>';
								html+= '<p class="color_6 fz_12">月涨跌幅</p>';
							}
							html+= '</div>';
							html+= '<div class="mynotice_right">';
							html+= '<p class="mynotice_fundtit m_top5px fz_15">'+proName+'<span class="color_6">('+proCode+')</span></p>';
							if(proType=='12'||proType=='91'){
								html+= '<p class="m_top5px">';
								html+= '<span class="color_6">万份收益</span>&nbsp;';
								html+= '<span class="color_red">¥'+parseFloat(income).toFixed(4)+'</span>&nbsp;';
								html+= '<span class="fz_12 color_9">('+date+')</span>';
								html+= '</p>';
								html+= '<div class="mynotice_iconbox">';
								html+= '<p><span class="mynotice_icon fund_lxicon_y"></span>&nbsp;';
							}else{
								html+= '<p class="m_top5px">';
								html+= '<span class="color_6">最新净值</span>&nbsp;';
								html+= '<span class="color_red">¥'+parseFloat(navincome).toFixed(4)+'</span>&nbsp;';
								html+= '<span class="fz_12 color_9">('+date+')</span>';
								html+= '</p>';
								html+= '<div class="mynotice_iconbox">';
								html+= '<p><span class="mynotice_icon fund_lxicon_y"></span>&nbsp;';
							}
							
							html+= '<span class="color_6">'+jQuery.param.getDisplay("FUND_PRODTYPE",proType)+'</span></p>';
							html+= '<p class="cancelNotice" proCode="' + proCode + '"><span class="clear_gz"></span>&nbsp;<span>取消关注</span></p>';
							html+= '</div>';
							html+= '<div class="mynoticearrow_right"></div>';
							html+= '</div>';
							html+= '</div>';
							html+='</ul>';
						}
					}
				}
				$("#notice").append(html);
				var prodCode = '';
		
				jQuery("#notice ul .cancelNotice").off().on('tap', function(event) {
					var value = jQuery(this).attr("proCode");
					mui.confirm("您确定要取消关注吗？","温馨提示",["确定", "取消"], function(e) {
						if (e.index == 0) {
			                var dataNumber = {
								f_prodcode : value
							};
							var url = mbank.getApiURL() + 'cancelNotice.do';
							mbank.apiSend('post',url,dataNumber,successCallback,errorCallback,false);
							function successCallback(data){
								mui.fire(plus.webview.getWebviewById("myNotice"), 'refreshNotice', {});
								mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshMyCollect', {});
							}
							function errorCallback(e){
						    	mui.alert(e.em);
						    }
			            }
			        });
			        event.stopPropagation();
				});
				jQuery("#notice ul").on('tap', function(){
					var i = jQuery(this).attr("index");
					var prodcode = noticeListAll[i].f_prodcode;
					var prodType = noticeListAll[i].f_prodtype;
					var prodName = noticeListAll[i].f_prodname;
					var tano = noticeListAll[i].f_tano;
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
			function errorCallback(e){
				mui.toast(e.em);
			}
		}
		getNoticeList(1);
		//刷新关注列表
		window.addEventListener("refreshNotice", function(event) {
			$("#notice").empty();
			turnPageBeginPos=1;
			getNoticeList(turnPageBeginPos);
			resetPullRefresh();
		});
		
		function resetPullRefresh() {
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			mui('#pullrefresh').pullRefresh().refresh(true);
			mui('#pullrefresh').pullRefresh().scrollTo(0,0);//跳到列表上端 解决ios不能自动跳到列表上端问题
		}
	});
});