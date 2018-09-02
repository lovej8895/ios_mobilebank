define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	var turnPageBeginPos;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    var iHistoryList = [];
	
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
			queryTransactionList(turnPageBeginPos);
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
			var currentNum = $('#transactionList li').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryTransactionList(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var parent = plus.webview.getWebviewById("transactionMain");
		var accountCardNo = parent.accountCardNo;
		var beginDate = parent.beginDate;
		var endDate = parent.endDate;
		var transType = parent.transType;
		
		queryTransactionList = function(turnPageBeginPos){
			var dataNumber = {
				accountCardNo : accountCardNo,
				beginDate : beginDate,
				endDate : endDate,
				transType : transType,
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum
			};
			var url = mbank.getApiURL() + '009008_historysale.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				turnPageTotalNum = data.turnPageTotalNum;
				if( turnPageBeginPos == 1 ){
		       	   	$("#transactionList").empty();
		       	}
				var html = '';
				var iHistorysale = data.iHistorysale;
				for(var i = 0; i < iHistorysale.length; i++){
					var finanChll = iHistorysale[i].finanChll;					//交易渠道
					var finanCordNo = iHistorysale[i].finanCordNo;				//银行卡号
					var finanBusiCode = iHistorysale[i].finanBusiCode;			//交易类型
					var finanProdCode = iHistorysale[i].finanProdCode;			//产品代码
					var finanProdName = iHistorysale[i].finanProdName;			//产品名称
					var finanTransferDate = iHistorysale[i].finanTransferDate;	//交易日期
					var finanTransferAmt = iHistorysale[i].finanTransferAmt;	//交易金额
					var transVol=iHistorysale[i].finanTransferVol;	//交易金额
					var finanTransferAmtShow="";
					if(finanBusiCode =='124' || finanBusiCode =='135'){
						 finanTransferAmtShow =transVol;
					}else if(finanBusiCode =='152'){
						if(parseFloat(transVol) ==0 ){
							 finanTransferAmtShow = format.formatMoney(finanTransferAmt, 2);
						}else{
							finanTransferAmtShow = format.formatMoney(transVol, 2);
						}
					}
					else{
						 finanTransferAmtShow = format.formatMoney(finanTransferAmt, 2);
					}
					var finanMsg = iHistorysale[i].finanMsg;					//交易信息
					var index = turnPageBeginPos - 1 + i;
					iHistoryList[index] = iHistorysale[i];
			    	html+='<li index=' + index + '>';
			      	html+='<p class="color_6">产品名称</p>';
			      	html+='<p class="fz_15 ptext">' + finanProdName + '</p>';
			      	html+='<div class="content_rbox">';
			      	
			      	if(finanBusiCode =='124' || finanBusiCode =='135'){//赎回交易
			      		html+='<p class="color_6">' + finanTransferAmtShow + '</p>';
						html+='<p class="fz_12 color_9">申请份额</p>';
					}else if(finanBusiCode =='152'){
						html+='<p class="color_6">￥' + finanTransferAmtShow + '</p>';
						html+='<p class="fz_12 color_9">申请金额</p>';
					}
			      	else{
			      		html+='<p class="color_6">￥' + finanTransferAmtShow + '</p>';
						html+='<p class="fz_12 color_9">交易金额</p>';
					}
			      	
			      	html+='</div>';
			      	html+='<a class="link_rbg2"></a>';
			      	html+='</li>';
				}
				$("#transactionList").append(html);
				$("#transactionList li").on('tap', function(){
					var index = $(this).attr("index");
					var params = {
						finanChll : iHistoryList[index].finanChll,
						finanCordNo : iHistoryList[index].finanCordNo,
						finanBusiCode : iHistoryList[index].finanBusiCode,
						finanProdCode : iHistoryList[index].finanProdCode,
						finanProdName : iHistoryList[index].finanProdName,
						finanTransferDate : iHistoryList[index].finanTransferDate,
						finanTransferAmt : iHistoryList[index].finanTransferAmt,
						finanMsg : iHistoryList[index].finanMsg,
						transVol : iHistoryList[index].finanTransferVol,
		    			noCheck : false
					};
					mbank.openWindowByLoad('transactionDetail.html','transactionDetail','slide-in-right',params);
				});
				$("#pullrefresh").show();
		       	$("#showMsgDiv").hide();
				mui('#pullrefresh').pullRefresh().setStopped(false);
			}
			function errorCallback(e){
				if ("LC9999" == e.ec) {
		    		var html = '<div class="fail_icon1 suc_top7px"></div>';
					html += '<p class="fz_15 text_m">' + e.em + '</p>';
					$("#showMsgDiv").html(html);
					$("#showMsgDiv").show();
					$("#pullrefresh").hide();
					mui('#pullrefresh').pullRefresh().setStopped(true);
		    	} else {
		    		mui.alert(e.em);
		    	}
		    }
		}
		turnPageBeginPos = 1;
		queryTransactionList(turnPageBeginPos);
	});
});