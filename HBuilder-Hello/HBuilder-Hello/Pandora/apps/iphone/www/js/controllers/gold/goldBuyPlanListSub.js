define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	
    var self;
	var params;
	var url;
	
	var turnPageBeginPos = 1;
    var turnPageShowNum = 20;
    var turnPageTotalNum;
	
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
			queryList(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = jQuery('#queryList li').length;
			if(currentNum >= turnPageTotalNum) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
//			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			turnPageBeginPos = parseInt(currentNum) + 1;
			queryList(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
		}, 800);
	}
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		plus.nativeUI.closeWaiting();
		var self = plus.webview.currentWebview();
		var parentPage = plus.webview.getWebviewById('goldBuyPlanList');
		var goldAipNo = parentPage.goldAipNo;
		//列表加载
		queryList = function(beginPos){
			document.getElementById('noContent').style.display = 'none';
			document.getElementById('pullrefresh').style.display = 'block';
			params = {
				"goldAipNo" : goldAipNo,
				"planNo" : "",
				"orderState" : "",
				"beginDate" : "",
				"endDate" : "",
				"turnPageBeginPos" : beginPos,
				"turnPageShowNum" : turnPageShowNum
			};
			url = mbank.getApiURL() + 'goldPlanListQuery.do';
			mbank.apiSend("post",url,params,queryListSuc,queryListFail,true);
			function queryListSuc(data){
				if(data.ec == "000"){
					var queryList = data.goldPlanList;
					turnPageTotalNum = data.turnPageTotalNum;
					if( beginPos==1 ){
			       		jQuery("#queryList").empty();
			    	}
					var	html="";
					if(queryList.length>0){
						for(var i = 0; i < queryList.length; i++){
							var investDateDesc;
							var investPeriod = queryList[i].investPeriod;
							if(investPeriod =="1"){
								var investDateVar = queryList[i].investDate;
								if(investDateVar.length ==1){
									investDateVar = '0'+investDateVar;
								}
								investDateDesc = jQuery.param.getDisplay('GOLD_INVESTDAY_MONTH', investDateVar);
							}else if(investPeriod == "4"){
								investDateDesc = "每周" + jQuery.param.getDisplay('GOLD_INVEST_WEEK', queryList[i].investDate);
							}else{
								investDateDesc = "每天";
							}
							html +='<li value='+JSON.stringify(queryList[i])+'>';
							html +='<p class="color_6">'+queryList[i].planNo+'</p>';
							html +='<p class="fz_12 color_9 m_top5px">'+investDateDesc+'</p>';
							html +='<div class="content_rbox">';
							html +='<p class="fz_16">定投金额'+format.formatMoney(queryList[i].tranAmt)+'元</p>';
							html +='<p class="fz_14 color_g m_top5px">'+jQuery.param.getDisplay('GOLD_PLAN_STATE', queryList[i].orderState)+'</p>';
							html +='</div>';
							html +='<a class="link_rbg2"></a>';
							html +='</li>';
						}
						jQuery("#queryList").append(html);
					}else{
						if( beginPos==1 ){
		       				document.getElementById('msgSpan').innerText = '没有符合条件的记录';
							document.getElementById('pullrefresh').style.display = 'none';
							document.getElementById('noContent').style.display = 'block';
				    	}
					}
				}else{
					document.getElementById('msgSpan').innerText = data.em;
					document.getElementById('pullrefresh').style.display = 'none';
					document.getElementById('noContent').style.display = 'block';
				}
			}
			function queryListFail(e){
				document.getElementById('msgSpan').innerText = e.em;
				document.getElementById('pullrefresh').style.display = 'none';
				document.getElementById('noContent').style.display = 'block';
			}
		}
        
        queryList(1);
        
        window.addEventListener('reload',function(event){
        	turnPageBeginPos = 1;
			queryList(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
        });
        
      	mui('#queryList').on('tap','li',function(event) {
      		params = JSON.parse(this.getAttribute('value'));
			mbank.openWindowByLoad("../gold/goldBuyPlanListDetail.html","goldBuyPlanListDetail", "slide-in-right",params);
		});
        
	});
	
});