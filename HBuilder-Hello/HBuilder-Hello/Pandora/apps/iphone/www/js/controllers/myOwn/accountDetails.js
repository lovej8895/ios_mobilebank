define(function(require, exports, module) {
	var mbank = require('../../core/bank');
//  var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var iAccountInfoList = [];
	var accountNo;
	var beginDate;
	var endDate;
	var sonAccNo;
	var turnPageBeginPos=1;
	var turnPageShowNum = 10;
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var dataBefore = plus.webview.currentWebview().params;
		accountNo = dataBefore.accountNo;
		beginDate = dataBefore.beginDate;
		endDate = dataBefore.endDate;
		sonAccNo = dataBefore.sonAccNo;
		
		var currentPageId = "all";
		
		var url = mbank.getApiURL() + '001002_subAccountDetailQueryAjax.do';
		var params = {
			"accountNo":accountNo,
			"beginDate":beginDate,
			"endDate":endDate,
			"sonAccNo":sonAccNo,
			"currencyType":'01',
			"turnPageBeginPos":turnPageBeginPos,
			"turnPageShowNum":turnPageShowNum
		};
		mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		function successCallback(data){
			iAccountInfoList = data.iAccountDealTemp_hb;
			getInfo();
		}
		function errorCallback(data){
			mui.alert(data.em);
		}
		
		
		var detail = $("#detail");
//		getInfo(iAccountInfoList);
		
		
		$('#pay').on('tap',function(){
			$("li").remove();
			currentPageId = "pay";
			getInfo("-");
		});
		$('#income').on('tap',function(){
			$("li").remove();	
			currentPageId = "income";
			getInfo("+");
		});
		$('#all').on('tap',function(){
			$("li").remove();
			currentPageId = "all";
			getInfo();
		});
		
		
		//根据条件判断显示的内容
		function getInfo(info){
			if(iAccountInfoList.length>0){
				for(var index=0;index<iAccountInfoList.length;index++){
					var accounInfo = iAccountInfoList[index];
					if(info=="+"){//收入
						//当为借并且金额大于0时才忽略此记录   因为可能会出现为借 但是金额为负的情况
						if($.param.getUserType("LOAN_FLAG",accounInfo.loanFlag)=="-"&&parseFloat(accounInfo.tranAmt)>0){
							continue;
						}
					} else if(info=="-"){//支出
						//当为贷
						if($.param.getUserType("LOAN_FLAG",accounInfo.loanFlag)=="+"){
							continue;
						} 
						if($.param.getUserType("LOAN_FLAG",accounInfo.loanFlag)=="-"&&parseFloat(accounInfo.tranAmt)<0){
							continue;
						}
					}
					
					var li = $('<li num="'+index+'"></li>');
					var remP;
					if(accounInfo.fuyan==''||accounInfo.fuyan==null){
						remP = $('<p class="color_6">其他</p>');
					} else {
						remP = $('<p class="color_6">'+accounInfo.fuyan+'</p>');
					}
					var p1;
					//当为借 并且交易金额为负时 将齐显示为收入
					if($.param.getUserType("LOAN_FLAG",accounInfo.loanFlag)=="-"&&parseFloat(accounInfo.tranAmt)<0){
						p1 = $('<p class="fz_16">'+'+'+format.formatMoney(format.ignoreChar(accounInfo.tranAmt,"-"),2)+'</p>');
					} else {
						p1 = $('<p class="fz_16">'+$.param.getUserType("LOAN_FLAG",accounInfo.loanFlag)+format.formatMoney(accounInfo.tranAmt,2)+'</p>');
					}
					
					var balanceP = $('<p class="fz_15">余额&nbsp;&nbsp;'+format.formatMoney(accounInfo.balance,2)+'</p>');
					var div = $('<div class="content_rbox"></div>');
					
					
					var p2 = $('<p class="fz_12 color_9 m_top5px">'+format.dataToDate(accounInfo.tranDate)+'</p>');
					var a = $('<a class="link_rbg2"></a>');
					div.append(p1).append(p2);
					li.append(remP).append(balanceP).append(div).append(a);
					detail.append(li);
					/*var span = $("<span class='input_lbg'></span>");
					span.append("备注:"+accounInfo.rem);*/
					
					/*var moneySpan = $("<span class='input_lbg'></span>");
					moneySpan.append("余额"+format.formatMoney(accounInfo.balance,2));*/
					
					/*var cryType = $("<span class='input_m12px' id='cryType'></span>");
					cryType.append($.param.getUserType("LOAN_FLAG",accounInfo.loanFlag)+format.formatMoney(accounInfo.tranAmt,2));
					
					var timeSpan = $("<span class='input_lbg'></span>");
					timeSpan.append("时间"+format.dataToDate(accounInfo.tranDate));
					
					var a = $("<a class='link_rbg'></a>");
					detail.append(li.append(span).append(moneySpan).append(cryType).append(timeSpan).append(a));*/
				}
				$('ul li').on('tap',function(){
					var num = $(this).attr("num");
					mbank.openWindowByLoad("accountTransferDetail.html","accountTransferDetail",'slide-in-right',{"params":iAccountInfoList[num]});
				});
			} else {
				detail.empty();
				$('#showMsgDiv').show();
				mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
			}
			
			
		}
		//向左
		window.addEventListener("swipeleft", function(event) {
			if (Math.abs(event.detail.angle) > 170) {
				if(currentPageId=='all'){
	    			currentPageId = 'pay';
	    			$("li").remove();
	    			$('#all').removeClass('mui-active');
	    			$('#pay').addClass('mui-active');
	    			getInfo('-');
	    		} else if(currentPageId=='pay'){
	    			currentPageId = 'income';
	    			$("li").remove();
	    			$('#pay').removeClass('mui-active');
	    			$('#income').addClass('mui-active');
	    			getInfo('+');
	    		}
			}
		});
		
		//向右
		window.addEventListener("swiperight", function(event) {
			if (Math.abs(event.detail.angle) < 10) {
				if(currentPageId=='income'){
	    			currentPageId = 'pay';
	    			$("li").remove();
	    			$('#income').removeClass('mui-active');
	    			$('#pay').addClass('mui-active');
	    			getInfo('-');
	    		} else if(currentPageId=='pay'){
	    			currentPageId = 'all';
	    			$("li").remove();
	    			$('#pay').removeClass('mui-active');
	    			$('#all').addClass('mui-active');
	    			getInfo();
	    		}
			}
		});
		
	});
});
