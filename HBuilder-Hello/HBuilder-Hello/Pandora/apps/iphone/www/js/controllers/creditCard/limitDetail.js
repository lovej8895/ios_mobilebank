/*
 * 已出账单查询结果：
 * 1.信用卡帐号查询
 * 2.根据帐号与时间进行查询
 */
define(function(require, exports, module) {
	var doc = document;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');

	var turnPageBeginPos = 1;
	var turnPageShowNum = 10;
	var turnPageTotalNum;	
	var limitDetails = [];
	var length;
	var currDtail;
		
	var TrxnDesc;//交易描述
	var TrxnAmt;//交易金额
	var BillCurrency;//货币代码
	var TrxnDate;//交易日期
	var CardTailNo;//卡号后4位

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
        searchLimitDetail(1);
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().endPullUpToRefresh(); 
		}, 800);
    }

 	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#limitList ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			searchLimitDetail(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		if( mui.os.android ){
    		$("#pullrefresh").attr("style","margin-top: 44px");
    	}
		var state = app.getState();
		var self = plus.webview.currentWebview(); 
		var cardNo = self.cardNo;
		var queryTime = self.queryTime;
		
		
		var limitList = doc.getElementById("limitList");
		
		
		searchLimitDetail = function(turnPageBeginPos){
			var url = mbank.getApiURL() + 'limitHistory.do';
			var param = {cardNo:cardNo,
						 turnPageBeginPos:turnPageBeginPos,
						 turnPageShowNum:turnPageShowNum, 
						 queryTime:queryTime};
						 
			mbank.apiSend('post', url, param,
							querySuccess,queryError,true);
		
			function querySuccess(data){
				limitDetails = data.iHistorysale3;
				turnPageTotalNum=data.turnPageTotalNum;
				length = limitDetails.length;
				//mui.alert(length);
				//mui.alert(limitDetails.length);
				//setTimeout(makeLimitDetail, 1000);
				makeLimitDetail();
			}
			
			function queryError(data){
				length = 0;
				//mui.alert("查询失败");
				plus.nativeUI.toast(data.em);
				mui.back();
			}
			
			
			
			function makeLimitDetail(){
				var detailListHtml = "";
				for(var index=0;index<length;index++){
					currDtail = limitDetails[index];
					detailListHtml += '<div class="backbox_tit_bg">';
					detailListHtml += '<p class="backbox_tit_ico"></p><p class="backbox_tit">查询结果</p>';
					detailListHtml += '</div>';
					detailListHtml += '<div class="backbox_th p_lr10px">';
					detailListHtml += '<ul>';
					detailListHtml += '<li>';
					if(currDtail.TrxnDesc){
						detailListHtml += '<span class="input_lbg">摘要：</span>'+'<span class="input_m14px">'+currDtail.TrxnDesc+'</span>';
					}else{
						detailListHtml += '<span class="input_lbg">摘要：</span>'+'<span class="input_m14px">'+currDtail.TrxnName+'</span>';
					}
					detailListHtml += '</li>';
					detailListHtml += '<li>';
//					if(currDtail.TrxnAmt>0){
						detailListHtml += '<span class="input_lbg">金额：</span>';
						detailListHtml += '<span class="input_m14px">'+currDtail.TrxnAmt+'</span>';
//					}else{
//						detailListHtml += '<span class="input_lbg">支出：</span>';
//						detailListHtml += '<span class="input_m14px">'+currDtail.TrxnAmt+'</span>';
//					}
					
					detailListHtml += '</li>';
					detailListHtml += '<li>';
					detailListHtml += '<span class="input_lbg">币种：</span><span class="input_m14px">人民币</span>';
					detailListHtml += '</li>';
					detailListHtml += '<li>';
					detailListHtml += '<span class="input_lbg">卡号后四位：</span><span class="input_m14px">'+currDtail.CardTailNo+'</span>';
					detailListHtml += '</li>';
					detailListHtml += '<li>';
					detailListHtml += '<span class="input_lbg">日期：</span><span class="input_m14px">'+format.dataToDate(currDtail.TrxnDate)+'</span>';
					detailListHtml += '</li>';
					detailListHtml += '</ul>';
					detailListHtml += '</div>';
					detailListHtml += '</div>';	
				}
				$("#limitList").append(detailListHtml);
				//mui.alert(limitDetails[0].TrxnAmt);
				//mui.alert(limitDetails[0].TrxnAmt>0);
			}
			
		}
		//doc.getElementById("showTest").innerText=cardNo+" "+queryTime;
		searchLimitDetail(1);
		var frontView = plus.webview.getWebviewById("limitList");
		mui.back = function(){
			plus.webview.close(frontView);
			plus.webview.close(self);
		}
		
		/*doc.getElementById("limitDetailBack").addEventListener("tap",function(){
			mui.back();
		});*/
		
	});
});