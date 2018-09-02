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
			queryPersonalLoan(turnPageBeginPos);
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
			var currentNum = $('#personalLoan ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryPersonalLoan(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		queryPersonalLoan = function(turnPageBeginPos){
			var dataNumber = {
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum
			};
			var url = mbank.getApiURL() + '005006_personalLoanQuery.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				turnPageTotalNum = data.turnPageTotalNum;
				if( turnPageBeginPos == 1 ){
		       	   	$("#personalLoan").empty();
		       	}
				var html = '';
				var personalLoanList = data.personalLoanList;
				if (personalLoanList.length == 0) {
					$("#showMsgDiv").show();
					$("#pullrefresh").hide();
					mui('#pullrefresh').pullRefresh().setStopped(true);
					return;
				}
				for(var i = 0; i < personalLoanList.length; i++){
					var loanAccount = personalLoanList[i].loanAccount;				//贷款账号
					var repaymentAccountNo = personalLoanList[i].repaymentAccountNo;//还款账号
					var loanVariety = personalLoanList[i].loanVariety;				//借据品种
					var currencyType = personalLoanList[i].currencyType;			//币种
					var loanRate = personalLoanList[i].loanRate;					//贷款利率
					var loanPeriod = personalLoanList[i].loanPeriod;				//还款周期
					var repaymentPattern = personalLoanList[i].repaymentPattern;	//还款方式
					var customerMaster = personalLoanList[i].customerMaster;		//客户经理
					var managOrganization = personalLoanList[i].managOrganization;	//经办机构
					var shouldRealAmt = personalLoanList[i].shouldRealAmt;			//应还未还金额
					var contractAmt = personalLoanList[i].contractAmt;				//合同金额
					var contractAmtShow = format.formatMoney(contractAmt, 2);
					var loanBalance = personalLoanList[i].loanBalance;				//贷款余额
					var loanBalanceShow = format.formatMoney(loanBalance, 2);
					var returnPrincipal = personalLoanList[i].returnPrincipal;		//已还本金
					var returnInterest = personalLoanList[i].returnInterest;		//已还利息
					var loanDeliverDate = personalLoanList[i].loanDeliverDate;		//贷款开始日
					var loanDeliverDateShow = format.formatDate(format.parseDate(loanDeliverDate, "yyyy/mm/dd"));
					var loanExpireDate = personalLoanList[i].loanExpireDate;		//贷款到期日
					var loanExpireDateShow = format.formatDate(format.parseDate(loanExpireDate, "yyyy/mm/dd"));
					var repaymentDate = personalLoanList[i].repaymentDate;			//下次还款日
					var debtIntAmt = personalLoanList[i].debtIntAmt;				//欠息金额
					var isCalculated = personalLoanList[i].isCalculated;
					var index = turnPageBeginPos - 1 + i;
					totalList[index] = personalLoanList[i];
			    	html+='<ul class="bg_h113px m_top10px bg_br2px" index=' + index + '>';
			      	html+='<li class="loan_topbox">';
			      	html+='<p class="sav_tit">' + loanVariety + '</p>';
			      	html+='<p class="m_left10px color_6">合同金额&nbsp;&nbsp;¥' + contractAmtShow + '</p>';
			      	html+='<a class="link_rbg link_t10px"></a>';
			      	html+='</li><li class="loan_timebox">';
			      	html+='<p><span class="t_start fz_12">起</span>&nbsp;' + loanDeliverDateShow + '</p>';
			      	html+='<p><span class="t_end fz_12">止</span>&nbsp;' + loanExpireDateShow + '</p>';
			      	html+='<p><span class="fz_16 color_red">¥' + loanBalanceShow + '</span><br />贷款余额</p>';
			      	html+='</li></ul>';
				}
				$("#personalLoan").append(html);
				$("#pullrefresh").show();
				$("#showMsgDiv").hide();
				mui('#pullrefresh').pullRefresh().setStopped(false);
				$("#personalLoan ul").on('tap', function(){
					var index = $(this).attr("index");
					var loanVariety = totalList[index].loanVariety;
					if(loanVariety=='个人自助贷款' || loanVariety=='个人便利贷款' || loanVariety=='V易贷'|| loanVariety=='房抵贷-消费（循环）'|| loanVariety=='尊享贷（循环）'|| loanVariety=='尊享贷（非循环）'|| loanVariety=='房抵贷-经营（循环）'|| loanVariety=='臻薪贷' || loanVariety=='微易贷'){
						if (loanVariety != '个人自助贷款' && loanVariety != '个人便利贷款' &&
					    	loanVariety != 'V易贷' && loanVariety != '房抵贷-消费（循环）' &&
					    	loanVariety != '尊享贷（循环）' && loanVariety != '尊享贷（非循环）' &&
					    	loanVariety != '房抵贷-经营（循环）' && loanVariety != '臻薪贷' && 
					    	loanVariety != '微易贷') {
				    		mui.alert("该借据品种不能进行循环贷款明细查询！");
				    		return false;
				    	}
						var params = {
							loanAccount : totalList[index].loanAccount,
							noCheck : false
						};
						mbank.openWindowByLoad('cycleDetailQuery.html','cycleDetailQuery','slide-in-right',params);
					} else {
						var params = {
							loanAccount : totalList[index].loanAccount,
							repaymentAccountNo : totalList[index].repaymentAccountNo,
							loanVariety : totalList[index].loanVariety,
							currencyType : totalList[index].currencyType,
							loanRate : totalList[index].loanRate,
							loanPeriod : totalList[index].loanPeriod,
							repaymentPattern : totalList[index].repaymentPattern,
							customerMaster : totalList[index].customerMaster,
							managOrganization : totalList[index].managOrganization,
							shouldRealAmt : totalList[index].shouldRealAmt,
							contractAmt : totalList[index].contractAmt,
							loanBalance : totalList[index].loanBalance,
							returnPrincipal : totalList[index].returnPrincipal,
							returnInterest : totalList[index].returnInterest,
							loanDeliverDate : totalList[index].loanDeliverDate,
							loanExpireDate : totalList[index].loanExpireDate,
							repaymentDate : totalList[index].repaymentDate,
							debtIntAmt : totalList[index].debtIntAmt,
							isCalculated : totalList[index].isCalculated,
		    				noCheck:false
						};
						mbank.openWindowByLoad('personalLoanInfo.html','personalLoanInfo','slide-in-right',params);
					}
				});
			}
			function errorCallback(e){
				mui.alert(e.em);
				$("#showMsgDiv").show();
				$("#pullrefresh").hide();
				mui('#pullrefresh').pullRefresh().setStopped(true);
		    }
		}
		
		turnPageBeginPos = 1;
		queryPersonalLoan(turnPageBeginPos);
		
		$("#trialButton").click(function(){
			var params = {
    			noCheck:false
	    	};
			mbank.openWindowByLoad('loanTrial.html','loanTrial','slide-in-right',params);
		});
		
		//重新加载
		window.addEventListener("reload", function(event) {
			turnPageBeginPos = 1;
			queryPersonalLoan(turnPageBeginPos);
		});
		
	});
});