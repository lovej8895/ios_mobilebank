define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var itemArray = new Array("oneYear", "threeYear", "all", "other");
	var currentItem = "oneYear";
	var startDate;
	var endDate;
	var turnPageBeginPos;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    var totalList = [];
	
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
			queryRepaymentPlan(turnPageBeginPos);
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
			var currentNum = $('#repaymentPlan ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullRefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryRepaymentPlan(turnPageBeginPos);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
   	}
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var parent = self.parent();
		var loanAccount = parent.loanAccount;
		
		var d = new Date();
		var s = d.getFullYear();
		startDate = s + "/01/01";
		endDate = s + "/12/31";
		
	    /*查询还款计划*/
	    queryRepaymentPlan = function(turnPageBeginPos){
			var dataNumber = {
				loanAccount : loanAccount,
				startDate : startDate,
				endDate : endDate,
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum
			};
			var url = mbank.getApiURL() + '005006_back_plan.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				turnPageTotalNum = data.turnPageTotalNum;
				if( turnPageBeginPos == 1 ){
		       	   	$("#repaymentPlan").empty();
		       	}
				var html = '';
				var personalLoanBackPlanList = data.personalLoanBackPlanList;
				if (personalLoanBackPlanList.length == 0) {
					$("#showMsgDiv").show();
					$("#pullRefresh").hide();
					return;
				}
				for(var i=0;i<personalLoanBackPlanList.length;i++){
					var customerNameCN = personalLoanBackPlanList[i].customerNameCN;						//客户姓名
					var TacitlyrepaymentAccountNo = personalLoanBackPlanList[i].TacitlyrepaymentAccountNo;	//默认还款账号
					var TacitlyrepaymentAccountNoShow = format.dealAccountHideFour(TacitlyrepaymentAccountNo);
					var shouldBackAmount = personalLoanBackPlanList[i].shouldBackAmount;					//应还金额
					var shouldBackAmountShow = format.formatMoney(shouldBackAmount, 2);
					var realityBackAmount = personalLoanBackPlanList[i].realityBackAmount;					//实还金额
					var realityBackAmountShow = format.formatMoney(realityBackAmount, 2);
					var shouldBackPrincipal = personalLoanBackPlanList[i].shouldBackPrincipal;				//应还本金
					var realityBackPrincipal = personalLoanBackPlanList[i].realityBackPrincipal;			//实还本金
					var shouldBackInterest = personalLoanBackPlanList[i].shouldBackInterest;				//应还利息
					var realityBackInterest = personalLoanBackPlanList[i].realityBackInterest;				//实还利息
					var shouldBackFine = personalLoanBackPlanList[i].shouldBackFine;						//应还罚息
					var realityBackFine = personalLoanBackPlanList[i].realityBackFine;						//实还罚息
					var shouldBackFuLi = personalLoanBackPlanList[i].shouldBackFuLi;						//应还复利
					var realityBackFuLi = personalLoanBackPlanList[i].realityBackFuLi;						//实还复利
					var endInterestDate = personalLoanBackPlanList[i].endInterestDate;						//结息日期
					var endInterestDateShow = format.formatDate(format.parseDate(endInterestDate, "yyyy/mm/dd"));
					var loanBalance = personalLoanBackPlanList[i].loanBalance;								//贷款余额
					var loanBalanceShow = format.formatMoney(loanBalance, 2);
					var closeDate = personalLoanBackPlanList[i].closeDate;									//结清日期
					var closeDateShow = "- -";
					if (closeDate != null && closeDate != "") {
						closeDateShow = format.formatDate(format.parseDate(closeDate, "yyyy/mm/dd"));
					}
					var index = turnPageBeginPos - 1 + i;
					totalList[index] = personalLoanBackPlanList[i];
			    	html+='<ul class="backbox_th m_top10px p_down10px ove_hid" index=' + index + '>';
			    	html+='<li class="loan_topbox"><div class="ove_hid">';
			    	html+='<p class="sav_tit" style="float:left">应还金额</p><span class="fz_17 color_red" style="float:right;margin:10px 30px 0 0">¥' + shouldBackAmountShow + '</span></div>';
			    	html+='<p class="m_left10px color_9">实还金额<span class="color_3 fz_15 m_left10px" style="display:inline-block;">¥' + realityBackAmountShow + '</span>';
			    	html+='</p>';
			    	html+='<a class="link_rbg link_t15px"></a>';
			    	html+='</li><li class="loan_timebox">';
			    	html+='<p><span class="fz_16">' + endInterestDateShow + '</span><br/>应还日期</p>';
					html+='<p><span class="fz_16">' + closeDateShow + '</span><br/>实还日期</p>';
					html+='<p><span class="fz_16 color_6">¥' + loanBalanceShow + '</span><br/>贷款余额</p>';
					html+='</li></ul>';
				}
				$("#repaymentPlan").append(html);
				$("#pullRefresh").show();
				$("#showMsgDiv").hide();
				$("#repaymentPlan ul").on('tap', function(){
					var index = $(this).attr("index");
					var params = {
						customerNameCN : totalList[index].customerNameCN,
						TacitlyrepaymentAccountNo : totalList[index].TacitlyrepaymentAccountNo,
						shouldBackAmount : totalList[index].shouldBackAmount,
						realityBackAmount : totalList[index].realityBackAmount,
						shouldBackPrincipal : totalList[index].shouldBackPrincipal,
						realityBackPrincipal : totalList[index].realityBackPrincipal,
						shouldBackInterest : totalList[index].shouldBackInterest,
						realityBackInterest : totalList[index].realityBackInterest,
						shouldBackFine : totalList[index].shouldBackFine,
						realityBackFine : totalList[index].realityBackFine,
						shouldBackFuLi : totalList[index].shouldBackFuLi,
						realityBackFuLi : totalList[index].realityBackFuLi,
						endInterestDate : totalList[index].endInterestDate,
						loanBalance : totalList[index].loanBalance,
						closeDate : totalList[index].closeDate,
						noCheck : false
					};
					mbank.openWindowByLoad('repaymentPlanInfo.html','repaymentPlanInfo','slide-in-right',params);
				});
			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
	    
	    turnPageBeginPos = 1;
	    queryRepaymentPlan(turnPageBeginPos);
	    
	    /*获取父页面参数*/
	    window.addEventListener("itemId", function(event) {
	    	currentItem = event.detail.currentItem;
			startDate = event.detail.startDate;
			endDate = event.detail.endDate;
			$("#repaymentPlan").empty();
			resetPullRefresh();
			turnPageBeginPos = 1;
			queryRepaymentPlan(turnPageBeginPos);
		});
		
		function resetPullRefresh() {
			mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().scrollTo(0,0);
		}
		
		//子页面向左滑动
//		window.addEventListener("swipeleft", function(event) {
//			if (Math.abs(event.detail.angle) > 170) {
//				if (currentItem == itemArray[itemArray.length - 1]) {
//					return;
//				}
//				for (var i = 0; i < itemArray.length; i++) {
//					if (currentItem == itemArray[i]) {
//						currentItem = itemArray[i + 1];
//						break;
//					}
//				}
//				mui.fire(parent, "changeItem", {currentItem: currentItem});
//			}
//		});
		
		//子页面向右滑动
//		window.addEventListener("swiperight", function(event) {
//			if (Math.abs(event.detail.angle) < 10) {
//				if (currentItem == itemArray[0]) {
//					return;
//				}
//				for (var i = 0; i < itemArray.length; i++) {
//					if (currentItem == itemArray[i]) {
//						currentItem = itemArray[i - 1];
//						break;
//					}
//				}
//				mui.fire(parent, "changeItem", {currentItem: currentItem});
//			}
//		});
		
	});
});