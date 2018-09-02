define(function(require, exports, module) {
	//引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var turnPageBeginPos = 1;										//起始位置
	var turnPageShowNum = 10; 										//一次显示数量
	var turnPageTotalNum;											//显示总条数
	var f_deposit_acct ="";		
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
			var currentNum = $('#transTrustQuery li').length;
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
		plus.nativeUI.showWaiting("加载中...");							//显示系统等待对话框		
		var self=plus.webview.currentWebview();
		f_deposit_acct = self.f_deposit_acct;	//账号
		var f_prodcode = self.f_prodcode;								//产品代码
		var f_begin_date = self.f_begin_date.substring(0,8);			//起始日期
		var f_end_date = self.f_end_date.substring(0,8);				//结束日期
		myInvestmentQuery=function(f_deposit_acct,turnPageBeginPos){
			var params = {
							"f_prodcode":f_prodcode,
							"f_deposit_acct":f_deposit_acct,
							"f_begin_date":f_begin_date,
							"f_end_date":f_end_date,
							"f_businesscode":"143",            			//上送分红方式交易代码：权益分派
							"turnPageBeginPos":turnPageBeginPos,
							"turnPageShowNum":turnPageShowNum
							
			};	
			var url = mbank.getApiURL() + '311007_transTrustQuery.do';
			mbank.apiSend('post', url , params, transferSuccess, transferError, true, false);
			function transferSuccess(data){
				var transTrustQuery = data.f_transTrustQuery;//得到返回列表
				var html ="";
				turnPageTotalNum = data.turnPageTotalNum;
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
			if(transTrustQuery.length>0){
				$("#showMsgDiv").hide();
	       		$("#pullrefresh").show();
			for(var i= 0;i<data.f_transTrustQuery.length;i++){
					var singleList =data.f_transTrustQuery[i];
					var f_transactioncfmdate = singleList.f_transactioncfmdate.trim();  //确认日期
					var f_confirmedamount = singleList.f_confirmedamount.trim();		//确认金额
					var f_confirmedvol = singleList.f_confirmedvol.trim();  			//确认份额
					if(f_transactioncfmdate==""||f_transactioncfmdate==undefined||f_transactioncfmdate==null){
						f_transactioncfmdate = singleList.f_transactiondate;
					}
					html += '<li><p class="fz_14">'+singleList.f_prodname+"（"+singleList.f_prodcode+")"+'</p>';
					html += '<p class="color_6 fz_12 fundbonus_tabtit"><span class="fundbonus_tableft">'+format.dataToDate(f_transactioncfmdate)+'</span>';
				//如果确认金额有值，显示确认金额
				if(f_confirmedamount!=null&&f_confirmedamount!=""&&f_confirmedamount!=undefined && f_confirmedamount!=0){
					html += '<span class="fundbonus_tabmid1">现金分红</span>';
					html += '<span class="fundbonus_tabright">分红金额&nbsp;&nbsp;&nbsp;'+format.formatMoney(f_confirmedamount,2)+'元</span></p>';
				//如果确认金额无值，确认份额有值，显示确认份额
				}else if(f_confirmedvol!=null&&f_confirmedvol!=""&&f_confirmedvol!=undefined &&f_confirmedvol!=0){
					html += '<span class="fundbonus_tabmid1">红利再投资</span>';
					html += '<span class="fundbonus_tabright">再投资份额&nbsp;&nbsp;&nbsp;'+format.formatMoney(f_confirmedvol,2)+'</span></p>';
				}
					html += '</li>';
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
			plus.webview.close(plus.webview.getWebviewById("divideBonusQuery"));
			plus.webview.close(plus.webview.getWebviewById("divideBonusQueryResult"));
		});
        
        
	});

});
