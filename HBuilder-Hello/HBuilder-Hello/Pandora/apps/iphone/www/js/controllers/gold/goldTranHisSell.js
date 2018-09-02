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
		var parentPage = plus.webview.getWebviewById('goldTranHis');
		var goldAipNo = parentPage.goldAipNo;
		//列表加载
		queryList = function(beginPos){
			document.getElementById('noContent').style.display = 'none';
			document.getElementById('pullrefresh').style.display = 'block';
			params = {
				"goldAipNo" : goldAipNo,
				"beginDate" : "",
				"endDate" : "",
				"orderNo" : "",
				"orderState" : "",
				"turnPageBeginPos" : beginPos,
				"turnPageShowNum" : turnPageShowNum
			};
			url = mbank.getApiURL() + 'goldSellListQuery.do';
			mbank.apiSend("post",url,params,queryListSuc,queryListFail,true);
			function queryListSuc(data){
				if(data.ec == "000"){
					var queryList = data.goldSellList;
					turnPageTotalNum = data.turnPageTotalNum;
					if( beginPos==1 ){
			       		jQuery("#queryList").empty();
			    	}
					var	html="";
					if(queryList.length>0){
						for(var i = 0; i < queryList.length; i++){
							html +='<li value='+JSON.stringify(queryList[i])+'>';
							html +='<p class="color_6">卖金</p>';
							html +='<p class="fz_12 color_9 m_top5px">'+format.formatDateTime(queryList[i].orderSubmitTime)+'</p>';
							html +='<div class="content_rbox">';
							html +='<p class="fz_16">'+queryList[i].sellWeight+'克</p>';
							if(queryList[i].orderState =='10'){
								html +='<p class="fz_14 color_g m_top5px">'+format.formatMoney(queryList[i].sellGetMoney)+'元</p>';
							}else{
								html +='<p class="fz_14 color_9 m_top5px">'+jQuery.param.getDisplay("GOLD_BUY_STATE",queryList[i].orderState)+'</p>';
							}
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
					if( beginPos==1 ){
						document.getElementById('msgSpan').innerText = data.em;
						document.getElementById('pullrefresh').style.display = 'none';
						document.getElementById('noContent').style.display = 'block';
				    }else{
				    	mui.alert(data.em);
				    }
				}
			}
			function queryListFail(e){
				if(beginPos==1){
					document.getElementById('msgSpan').innerText = e.em;
					document.getElementById('pullrefresh').style.display = 'none';
					document.getElementById('noContent').style.display = 'block';
				}else{
					mui.alert(e.em);
				}
			}
		}
        
        queryList(1);
        
        mui('#queryList').on('tap','li',function(event) {
      		params = JSON.parse(this.getAttribute('value'));
			mbank.openWindowByLoad("../gold/goldTranHisSellDetail.html","goldTranHisSellDetail", "slide-in-right",params);
		});
	});
	
});