define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	var turnPageBeginPos;
    var turnPageShowNum = 10;
    var turnPageTotalNum;
    var totalList = [];
	
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
			queryFiancing(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
		}, 800);
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().refresh(true);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			mui('#pullrefresh').pullRefresh().refresh(true);
		}, 1600);
    }
	
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#fiancingProduct ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryFiancing(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		queryFiancing = function(turnPageBeginPos){
			var dataNumber = {
				flag : 0,
				cstType : "1",
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum,
				liana_notCheckUrl:false
			};
			var url = mbank.getApiURL() + 'financingOpenQuery.do';
			//var url = mbank.getApiURL() + 'financingProductQuery.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				turnPageTotalNum = data.turnPageTotalNum;
				if( turnPageBeginPos == 1 ){
		       		$("#fiancingProduct").empty();
		       	}
				var html = '';
				var iFiancinglist = data.iFiancinglist;
				if (iFiancinglist.length == 0) {
					$("#showMsgDiv").show();
					$("#pullrefresh").hide();
					mui('#pullrefresh').pullRefresh().setStopped(true);
					return;
				}
				for(var i=0;i<iFiancinglist.length;i++){
					var productNo = iFiancinglist[i].productNo;			//产品编号
					var productName = iFiancinglist[i].productName;		//产品名称
					var projDeadLine = iFiancinglist[i].projDeadLine;	//产品期限
					var raiseEndDate = iFiancinglist[i].raiseEndDate;	//募集结束日
					var raiseEndDateShow = format.formatDate(format.parseDate(raiseEndDate, "yyyymmdd"));
					var profitRate = iFiancinglist[i].profitRate;		//预期收益率
					
					var proRiskLevel = iFiancinglist[i].proRiskLevel;	//产品风险等级
					var proRiskLevelShow = parseRiskLevel(proRiskLevel);
					var originAmt = iFiancinglist[i].originAmt;			//起购金额
					var increaseAmt = iFiancinglist[i].increaseAmt;		//递增金额
					var returnurl = iFiancinglist[i].returnurl;			
					var index = turnPageBeginPos - 1 + i;
					var productType=iFiancinglist[i].productType;
					var productEndDate= format.formatDate(format.parseDate(iFiancinglist[i].productEndDate,"yyyymmdd"));
					totalList[index] = iFiancinglist[i];
			    	html+='<ul class="bg_h113px m_top10px banner_bg_boxshw" index=' + index + '>';
			    	html+='<li class="financial">';
			      	html+='<p class="fin_tit otext">' + productName + '</p>';
			      	if(productType =='5'){
			      	   html+='<p class="hot_sell_p bg_color_y">封闭式</p>';
			      	}else if(productType=='3'){
			      		html+='<p class="hot_sell_p bg_color_y">开放式</p>';
			      	}else{
			      		html+='<p class="hot_sell_p bg_color_y">未定义</p>';
			      	}
			      	html+='<p class="hot_end bg_color_f" style="display: none;">售罄</p>';
			      	html+='<p class="fin_type">' + proRiskLevelShow + '</p>';
			      	html+='<span class="fin_line"></span>';
			      	html+='<a class="link_rbg link_t30px"></a></li>';
			      	html+='<li class="financial_l">';
			      	if(productType =='5'){//封闭式产品
			      		html+='<span class="color_6">投资期限：</span>';
			      		html+='<span class="color_red">' + projDeadLine + '天</span><br/>';
			      		html+='<span class="color_9">募集结束日期：</span>';
			      		html+='<span class="color_9">' + raiseEndDateShow + '</span></li>';
			      	}else{
			      		html+='<span class="color_6">投资期限：</span>';
			      		html+='<span class="color_red">无固定</span><br/>';
			      		html+='<span class="color_9">产品到期日：</span>';
			      		html+='<span class="color_9">' + productEndDate + '</span></li>';
			      	}
			      	
			      	html+='<li class="financial_r">';
			      	if(profitRate == '-'){
			      		html+='<p class="color_red">未配置</p>';
					}else{
						html+='<p class="color_red fz_18">' + profitRate + '%</p>';
					}
			      	
			      	//html+='<p class="color_red fz_18">4.2-6.5%</p>';
			      	html+='<p class="color_6">预期年化收益率</p></li></ul>';
				}
				//console.log(html);
				$("#fiancingProduct").append(html);
				$("#pullrefresh").show();
				$("#showMsgDiv").hide();
				mui('#pullrefresh').pullRefresh().setStopped(false);
				$("#fiancingProduct ul").on('tap', function(){
					var index = $(this).attr("index");
					var productType=totalList[index].productType;
					var params = {
						productNo : totalList[index].productNo,
						productName : totalList[index].productName,
						projDeadLine : totalList[index].projDeadLine,
						raiseEndDate : totalList[index].raiseEndDate,
						profitRate : totalList[index].profitRate,
						proRiskLevel : totalList[index].proRiskLevel,
						originAmt : totalList[index].originAmt,
						increaseAmt : totalList[index].increaseAmt,
						returnurl : totalList[index].returnurl,
						productType : productType,
	    				noCheck : "true"
					};
					if(productType =='3'){
						mbank.openWindowByLoad('productDetailOpen.html','productDetailOpen','slide-in-right',params);
					}else{
						mbank.openWindowByLoad('productDetail.html','productDetail','slide-in-right',params);
					}
					
				});
			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
		
		turnPageBeginPos = 1;
		queryFiancing(turnPageBeginPos);
		
		function parseRiskLevel(proRiskLevel) {
			switch (proRiskLevel) {
				case  "01" : return "高风险产品";
				case  "02" : return "较高风险产品";
				case  "03" : return "中等风险产品";
				case  "04" : return "较低风险产品";
				default : return "低风险产品";
			}
		}
		
	});
});