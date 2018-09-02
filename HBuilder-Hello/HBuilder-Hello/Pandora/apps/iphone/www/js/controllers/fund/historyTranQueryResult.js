define(function(require, exports, module) {
	//引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var turnPageBeginPos = 1;										//起始位置
	var turnPageShowNum = 10; 										//一次显示数量
	var turnPageTotalNum;											//显示总条数
	var f_deposit_acct ="";											//账号;      
	var transTrustQuery=[];
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
		setTimeout(function(){
			turnPageBeginPos = 1;
			myInvestmentQuery(f_deposit_acct,1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	
	function pullupRefresh(){
		setTimeout(function(){
			var currentNum = $('#transTrustQuery ul').length;
			if(currentNum >= turnPageTotalNum){//无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			myInvestmentQuery(f_deposit_acct, turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);//参数为true代表没有更多数据了。
		}, 800);
	}
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		plus.nativeUI.showWaiting("加载中...");//显示系统等待对话框
		var self=plus.webview.currentWebview();
		f_deposit_acct = self.f_deposit_acct;	//账号
		var f_prodcode = self.f_prodcode;								//产品代码
		var f_begin_date = self.f_begin_date.substring(0,8);			//起始日期
		var f_end_date = self.f_end_date.substring(0,8);				//结束日期
		var f_businesscode = self.f_businesscode;						//交易类型
		myInvestmentQuery=function(f_deposit_acct,turnPageBeginPos){
			if(f_businesscode == null){
				f_businesscode = "";
			}
			var params = {
					"f_prodcode":f_prodcode,
					"f_deposit_acct":f_deposit_acct,
					"f_begin_date":f_begin_date,
					"f_end_date":f_end_date,
					"f_businesscode":f_businesscode,
					"turnPageBeginPos":turnPageBeginPos,
					"turnPageShowNum":turnPageShowNum
							
			};	
		var url = mbank.getApiURL() + '311007_transTrustQuery.do';
		mbank.apiSend('post', url , params, transferSuccess, transferError, true, false);
			function transferSuccess(data){
				turnPageTotalNum = data.turnPageTotalNum;
				var f_transTrustQuery = data.f_transTrustQuery;//得到返回列表
				if( turnPageBeginPos==1 ){
		       	    $("#transTrustQuery").empty();
		       	    if( turnPageTotalNum=='0' ){
						$("#showMsgDiv").empty();
						$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
					    $("#showMsgDiv").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
					    $("#showMsgDiv").show();
			       		$("#pullrefresh").hide();
					    mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
		       	   }
		       }
				var html ="";
					if(data.f_transTrustQuery.length>0){
						$("#showMsgDiv").hide();
		       			$("#pullrefresh").show();
						for(var i= 0;i<data.f_transTrustQuery.length;i++){
							var singleList =data.f_transTrustQuery[i];
							html += '<p class="backbox_tit2">'+singleList.f_prodname+"（"+singleList.f_prodcode+")"+'</p>';
							html += '<ul class="p_lr30px">';
							html += '<li><span class="detail_left">交易日期</span><span class="detail_right">'+format.dataToDate(singleList.f_transactiondate)+'</span></li>';
							html += '<li><span class="detail_left">交易类型</span><span class="detail_right">'+jQuery.param.getDisplay('BUSINESS_CODE', singleList.f_businesscode)+'</span></li>';
							//如果交易类型为赎回类型，展示交易份额，对应确认份额
							if(singleList.f_businesscode.trim()=='24'||singleList.f_businesscode.trim()=='25'||singleList.f_businesscode.trim()=='98'){
								html += '<li><span class="detail_left">申请份额</span><span class="detail_right">'+format.formatMoney(singleList.f_applicationvol, 2) + " 份"+'</span></li>';
								html += '<li><span class="detail_left">确认份额</span><span class="detail_right">'+format.formatMoney(singleList.f_confirmedvol, 2) + " 份"+'</span></li>';
							}else{//其余类型展示交易金额，对应确认金额
								html += '<li><span class="detail_left">申请金额</span><span class="detail_right">'+format.formatMoney(singleList.f_applicationamount, 2) + " 元"+'</span></li>';
								html += '<li><span class="detail_left">确认金额</span><span class="detail_right">'+format.formatMoney(singleList.f_confirmedamount, 2) + " 元"+'</span></li>';
							}
							html += '<li><span class="detail_left">交易账号</span><span class="detail_right">'+format.dealAccountHideFour(f_deposit_acct)+'</span></li>';
							html += '<li><span class="detail_left">交易状态</span><span class="detail_right">'+jQuery.param.getDisplay('FUND_TRANS_STATUS',singleList.f_status)+'</span></li>';
							html += '<li><span class="detail_left">交易渠道</span><span class="detail_right">'+jQuery.param.getDisplay('ACCEPT_METHOD',singleList.f_acceptmethod)+'</span></li></ul>';
						}
						$("#transTrustQuery").append(html);
					}
				}
			function transferError(data){
				plus.nativeUI.closeWaiting();//关闭系统等待对话框
				$("#transTrustQuery").empty();
				$("#showMsgDiv").empty();
		       	$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
		       	$("#showMsgDiv").append('<p class="fz_15 text_m">' + data.em + ' </p>');
		       	$("#showMsgDiv").show();
		       	$("#pullrefresh").hide();
		       	mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
			}
		}
		
        myInvestmentQuery(f_deposit_acct,1);
        
        document.getElementById("submit").addEventListener('tap',function(){
			plus.webview.close(plus.webview.getWebviewById("historyTranQuery"));
			plus.webview.close(plus.webview.getWebviewById("historyTranQueryResult"));
		});
	});
});
