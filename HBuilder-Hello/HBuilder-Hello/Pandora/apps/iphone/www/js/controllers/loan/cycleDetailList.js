define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var itemArray = new Array("unsettled", "settled");
	var currentItem = "unsettled";
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
			queryCycleDetail(currentItem, turnPageBeginPos);
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
			var currentNum = $('#cycleDetailList ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullRefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryCycleDetail(currentItem, turnPageBeginPos);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
   	}
 	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var parent = self.parent();
		var loanAccount = parent.loanAccount;
		
	    /*查询循环贷款明细*/
	    queryCycleDetail = function(itemId, turnPageBeginPos){
	    	var isAll = "1";
	    	if (itemId == "settled") {
	    		isAll = "2";
	    	}
			var dataNumber = {
				loanAccount : loanAccount,
				isAll : isAll,
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum
			};
			var url = mbank.getApiURL() + '005006_cycleDetailQuery.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				turnPageTotalNum = data.turnPageTotalNum;
				if( turnPageBeginPos == 1 ){
		       	   	$("#cycleDetailList").empty();
		       	}
				var html = '';
				var PersonalcycleDetailQueryList = data.PersonalcycleDetailQueryList;
				if (PersonalcycleDetailQueryList.length == 0) {
					$("#showMsgDiv").show();
					$("#pullRefresh").hide();
					return;
				}
				for (var i = 0; i < PersonalcycleDetailQueryList.length; i++) {
					var loanAccount = PersonalcycleDetailQueryList[i].loanAccount;		//贷款账号
					var giveAmt = PersonalcycleDetailQueryList[i].giveAmt;				//发放金额
					var giveAmtShow = format.formatMoney(giveAmt, 2);
					var loanBalance = PersonalcycleDetailQueryList[i].loanBalance;		//贷款余额
					var loanBalanceShow = format.formatMoney(loanBalance, 2);
					var outDate = PersonalcycleDetailQueryList[i].outDate;				//出账日期
					outDateShow = format.formatDate(format.parseDate(outDate, "yyyy/mm/dd"));
					var arrDate = PersonalcycleDetailQueryList[i].arrDate;				//到期日期
					arrDateShow = format.formatDate(format.parseDate(arrDate, "yyyy/mm/dd"));
					var index = turnPageBeginPos - 1 + i;
					totalList[index] = PersonalcycleDetailQueryList[i];
					html+='<ul class="bg_h113px m_top10px bg_br2px" index=' + index + '>';
			      	html+='<li class="loan_topbox"><div class="ove_hid">';
			    	html+='<p class="sav_tit" style="float:left">贷款金额</p><span class="fz_17 color_red" style="float:right;margin:10px 30px 0 0">¥' + giveAmtShow + '</span></div>';
			    	html+='<p class="m_left10px color_9">贷款余额<span class="color_3 fz_15 m_left10px" style="display:inline-block;">¥' + loanBalanceShow + '</span>';
			    	html+='</p>';
			      	html+='<a class="link_rbg link_t10px"></a>';
			      	html+='</li><li class="loan_timebox">';
			      	html+='<p><span class="t_start fz_12">起</span>&nbsp;' + outDateShow + '</p>';
			      	html+='<p><span class="t_end fz_12">止</span>&nbsp;' + arrDateShow + '</p>';
			      	html+='</li></ul>';
				}
				$("#cycleDetailList").append(html);
				$("#pullRefresh").show();
				$("#showMsgDiv").hide();
				$("#cycleDetailList ul").on('tap', function(){
					var index = $(this).attr("index");
					var dataNumber = {
						accountNo : totalList[index].loanAccount,
						turnPageBeginPos : 1,
						turnPageShowNum : 10
					};
					var url = mbank.getApiURL() + '005006_personalLoanQuery.do';
					mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
					function successCallback(data){
						var personalLoanList = data.personalLoanList;
						if (personalLoanList == null || personalLoanList.length == 0) {
							return;
						}
						var loanAccount = personalLoanList[0].loanAccount;				//贷款账号
						var repaymentAccountNo = personalLoanList[0].repaymentAccountNo;//还款账号
						var loanVariety = personalLoanList[0].loanVariety;				//借据品种
						var currencyType = personalLoanList[0].currencyType;			//币种
						var loanRate = personalLoanList[0].loanRate;					//贷款利率
						var repaymentPattern = personalLoanList[0].repaymentPattern;	//还款方式
						var customerMaster = personalLoanList[0].customerMaster;		//客户经理
						var managOrganization = personalLoanList[0].managOrganization;	//经办机构
						var contractAmt = personalLoanList[0].contractAmt;				//合同金额
						var loanBalance = personalLoanList[0].loanBalance;				//贷款余额
						var returnPrincipal = personalLoanList[0].returnPrincipal;		//已还本金
						var loanDeliverDate = personalLoanList[0].loanDeliverDate;		//贷款开始日
						var loanExpireDate = personalLoanList[0].loanExpireDate;		//贷款到期日
						var isCalculated = personalLoanList[0].isCalculated;
						var params = {
							loanVariety : loanVariety,
							loanAccount : loanAccount,
							repaymentPattern : repaymentPattern,
							contractAmt : contractAmt,
							currencyType : currencyType,
							loanBalance : loanBalance,
							loanRate : loanRate,
							returnPrincipal : returnPrincipal,
							loanDeliverDate : loanDeliverDate,
							loanExpireDate : loanExpireDate,
							customerMaster : customerMaster,
							managOrganization : managOrganization,
							repaymentAccountNo : repaymentAccountNo,
							isCalculated : isCalculated,
							noCheck : false
						};
						mbank.openWindowByLoad('cycleDetailInfo.html','cycleDetailInfo','slide-in-right',params);
					}
					function errorCallback(e){
						mui.alert(e.em);
				    }
				});
			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
	    
	    turnPageBeginPos = 1;
	    queryCycleDetail(currentItem, turnPageBeginPos);
	    
	    /*获取父页面参数*/
	    window.addEventListener("itemId", function(event) {
			currentItem = event.detail.currentItem;
			$("#cycleDetailList").empty();
			resetPullRefresh();
			turnPageBeginPos = 1;
			queryCycleDetail(currentItem, turnPageBeginPos);
		});
		
		//重新加载
		window.addEventListener("reload", function(event) {
			console.log(1223);
			$("#cycleDetailList").empty();
			resetPullRefresh();
			turnPageBeginPos = 1;
			queryCycleDetail(currentItem, turnPageBeginPos);
		});
		
		function resetPullRefresh() {
			mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().scrollTo(0,0);
		}
		
		//子页面向左滑动
		window.addEventListener("swipeleft", function(event) {
			if (Math.abs(event.detail.angle) > 170) {
				if (currentItem == itemArray[itemArray.length - 1]) {
					return;
				}
				for (var i = 0; i < itemArray.length; i++) {
					if (currentItem == itemArray[i]) {
						currentItem = itemArray[i + 1];
						break;
					}
				}
				mui.fire(parent, "changeItem", {currentItem: currentItem});
				$("#cycleDetailList").empty();
				resetPullRefresh();
				turnPageBeginPos = 1;
				queryCycleDetail(currentItem, turnPageBeginPos);
			}
		});
		
		//子页面向右滑动
		window.addEventListener("swiperight", function(event) {
			if (Math.abs(event.detail.angle) < 10) {
				if (currentItem == itemArray[0]) {
					return;
				}
				for (var i = 0; i < itemArray.length; i++) {
					if (currentItem == itemArray[i]) {
						currentItem = itemArray[i - 1];
						break;
					}
				}
				mui.fire(parent, "changeItem", {currentItem: currentItem});
				$("#cycleDetailList").empty();
				resetPullRefresh();
				turnPageBeginPos = 1;
				queryCycleDetail(currentItem, turnPageBeginPos);
			}
		});
		
	});
});