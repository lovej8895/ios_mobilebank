define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var currentItem = "backNow";
	var turnPageBeginPos;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    var backNowList = [];
    var changeList = [];
    
    mui.init({
		pullRefresh: {
			container: '#pullRefresh',
			down: {
				callback: pulldownfresh
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
			queryChangeRecord(currentItem, turnPageBeginPos);
			mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullRefresh').pullRefresh().disablePullupToRefresh();
		}, 800);
		setTimeout(function() {
			mui('#pullRefresh').pullRefresh().enablePullupToRefresh();
			mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
		}, 1600);
    }
	
 	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#changeRecordList li').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullRefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryChangeRecord(currentItem, turnPageBeginPos);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
   	}
 	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var parent = self.parent();
		var loanAccount = parent.loanAccount;
	    /*统一查询*/
	    queryChangeRecord = function(itemId, turnPageBeginPos){
			var dataNumber = {
				loanAccount : loanAccount,
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum
			};
			var action = '';
			if (itemId == 'backNow') {
				action = '005006_back_now.do';
			} else {
				action = '005006_change_item.do';
			}
			var url = mbank.getApiURL() + action;
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				turnPageTotalNum = data.turnPageTotalNum;
				if( turnPageBeginPos == 1 ){
		       	   	$("#changeRecordList").empty();
		       	}
		       	if (itemId == 'backNow') {
		       		dealBackNowQuery(data);
		       	} else {
		       		dealChangeItemQuery(data);
		       	}
			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
	    
	    turnPageBeginPos = 1;
	    queryChangeRecord(currentItem, turnPageBeginPos);
	    
	    /*获取父页面参数*/
	    window.addEventListener("itemId", function(event) {
			currentItem = event.detail.currentItem;
			$("#changeRecordList").empty();
			resetPullRefresh();
			turnPageBeginPos = 1;
			queryChangeRecord(currentItem, turnPageBeginPos);
		});
	    
	    /*处理提前还款记录查询*/
	    function dealBackNowQuery(data) {
	    	var html = '';
			var personalLoanBackNowList = data.personalLoanBackNowList;
			if (personalLoanBackNowList.length == 0) {
				$("#showMsgDiv").show();
				$("#pullRefresh").hide();
				return;
			}
			for(var i=0;i<personalLoanBackNowList.length;i++){
				var realityBackAmount = personalLoanBackNowList[i].realityBackAmount;		//实还金额
				var realityBackAmountShow = format.formatMoney(realityBackAmount, 2);
				var realityBackPrincipal = personalLoanBackNowList[i].realityBackPrincipal;	//实还本金
				var realityBackPrincipalShow = format.formatMoney(realityBackPrincipal, 2);
				var realityBackInterest = personalLoanBackNowList[i].realityBackInterest;	//实还利息
				var realityBackFine = personalLoanBackNowList[i].realityBackFine;			//实还罚息
				var realityBackFuLi = personalLoanBackNowList[i].realityBackFuLi;			//实还复利
				var closeDate = personalLoanBackNowList[i].closeDate;						//结清日期
				var closeDateShow = format.formatDate(format.parseDate(closeDate, "yyyy/mm/dd"));
				var index = turnPageBeginPos - 1 + i;
				backNowList[index] = personalLoanBackNowList[i];
		    	html+='<li index=' + index + '>';
		      	html+='<p class="color_6">实还金额</p>';
		      	html+='<p class="fz_15">' + realityBackAmountShow + '</p>';
		      	html+='<div class="content_rbox">';
		      	html+='<p class="color_6">' + closeDateShow + '</p>';
		      	html+='<p class="fz_12 color_9">结清日期</p>';
		      	html+='</div>';
		      	html+='<a class="link_rbg2"></a>';
		      	html+='</li>';
			}
			$("#changeRecordList").append(html);
			$("#pullRefresh").show();
			$("#showMsgDiv").hide();
			$("#changeRecordList li").on('tap', function(){
				var index = $(this).attr("index");
				var params = {
					realityBackAmount : backNowList[index].realityBackAmount,
					realityBackPrincipal : backNowList[index].realityBackPrincipal,
					realityBackInterest : backNowList[index].realityBackInterest,
					realityBackFine : backNowList[index].realityBackFine,
					realityBackFuLi : backNowList[index].realityBackFuLi,
					closeDate : backNowList[index].closeDate,
					noCheck : false
				};
				mbank.openWindowByLoad('backNowInfo.html','backNowInfo','slide-in-right',params);
			});
	    }
	   	
	    /*处理变更记录查询*/
	    function dealChangeItemQuery(data){
			var html = '';
			var personalLoanChangeList = data.personalLoanChangeList;
			if (personalLoanChangeList.length == 0) {
				$("#showMsgDiv").show();
				$("#pullRefresh").hide();
				return;
			}
			for(var i=0;i<personalLoanChangeList.length;i++){
				var tranflowno = personalLoanChangeList[i].tranflowno;		//交易流水号
				var loanTranType = personalLoanChangeList[i].loanTranType;	//交易类型
				var effectDate = personalLoanChangeList[i].effectDate;		//生效日期
				var effectDateShow = format.formatDate(format.parseDate(effectDate, "yyyy/mm/dd"));
				var channel = personalLoanChangeList[i].channel;			//渠道
				var channelShow = parseChannel(channel);
				var index = turnPageBeginPos - 1 + i;
				changeList[index] = personalLoanChangeList[i];
				html+='<li index=' + index + '>';
		      	html+='<p class="color_6">交易流水号</p>';
		      	html+='<p class="fz_15">' + tranflowno + '</p>';
		      	html+='<div class="content_rbox">';
		      	html+='<p class="color_6">' + effectDateShow + '</p>';
		      	html+='<p class="fz_12 color_9">生效日期</p>';
		      	html+='</div>';
		      	html+='<a class="link_rbg2"></a>';
		      	html+='</li>';
			}
			$("#changeRecordList").append(html);
			$("#pullRefresh").show();
			$("#showMsgDiv").hide();
			$("#changeRecordList li").on('tap', function(){
				var index = $(this).attr("index");
				var params = {
					tranflowno : changeList[index].tranflowno,
					loanTranType : changeList[index].loanTranType,
					effectDate : changeList[index].effectDate,
					channel : changeList[index].channel,
					noCheck : false
				};
				mbank.openWindowByLoad('changeItemInfo.html','changeItemInfo','slide-in-right',params);
			});
		}
	    
		function parseChannel(channel) {
			switch (channel) {
				case "I" : return "网银";
				case "J" : return "手机";
				default : return "信贷";
			}
		}
		
		function resetPullRefresh() {
			mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().scrollTo(0,0);
		}
		
		//子页面向左滑动
		window.addEventListener("swipeleft", function(event) {
			if (currentItem == "changeItem") {
				return;
			}
			currentItem = "changeItem";
			mui.fire(parent, "changeWebview", {currentItem: currentItem});
			resetPullRefresh();
			turnPageBeginPos = 1;
			queryChangeRecord(currentItem, turnPageBeginPos);
		});
		
		//子页面向右滑动
		window.addEventListener("swiperight", function(event) {
			if (currentItem == "backNow") {
				return;
			}
			currentItem = "backNow";
			mui.fire(parent, "changeWebview", {currentItem: currentItem});
			resetPullRefresh();
			turnPageBeginPos = 1;
			queryChangeRecord(currentItem, turnPageBeginPos);
		});
		
	});
});