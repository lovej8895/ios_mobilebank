define(function(require, exports, module) {
	//引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var turnPageBeginPos = 1;										//起始位置
	var turnPageShowNum = 10; 										//一次显示数量
	var turnPageTotalNum;											//显示总条数
	var f_weekincome;												//近一周收益
	var f_monthincome;												//近一月收益
	var f_deposit_acct ="";											//账号;  
	var transTrustQuery=[];
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});

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
		plus.nativeUI.showWaiting("加载中...");//显示系统等待对话框
		//得到相关参数
		var self=plus.webview.getWebviewById("treasureClassIncomeQueryDetail");
		f_deposit_acct = self.f_deposit_acct;	//账号
		var f_prodcode =self.f_prodcode;        //产品代码
		var f_tano =self.f_tano;                //TA代码
		myInvestmentQuery=function(f_deposit_acct,turnPageBeginPos){
			var url = mbank.getApiURL()+'300046_treasureIncomeQuery.do';
			var params = {
					"f_deposit_acct":f_deposit_acct,
					"f_tano":f_tano,
					"f_prodcode":f_prodcode,
					"turnPageBeginPos":turnPageBeginPos,
					"turnPageShowNum":turnPageShowNum
			};
		mbank.apiSend('post', url , params, transferSuccess, transferError, true,false);
		function transferSuccess(data){
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
				var f_transTrustQuery = data.f_treasureIncomeDetail;//得到返回列表
				var html = "";
				if(f_transTrustQuery.length>0){
					$("#showMsgDiv").hide();
	       			$("#pullrefresh").show();
					for(var i=0;i<data.f_treasureIncomeDetail.length;i++){
						var singleList = data.f_treasureIncomeDetail[i];
						/*html += '<li><p class="m_left15px fz_16">收益';
						html += '<span class="detail_right"><a class="color_g">'+format.formatMoney(singleList.f_incomeamount,2)+'</a>元</span></p>';
						html += '<p class="m_left15px"><span class="color_9">'+format.dataToDate(singleList.f_income_day)+'</span></p></li>';*/
						html +='<li>';
						html +='<p class="m_left15px"><span class="fz_16">收益</span><br /><span class="color_9">'+format.dataToDate(singleList.f_income_day)+'</span></p>';
						html += '<p class="fund_detail_amt"><span class="color_g fz_16">'+format.formatMoney(singleList.f_incomeamount,2)+'</span><span >元</span></p>';
						html +='</li>';
					}
				$("#transTrustQuery").append(html);
				f_weekincome = data.f_weekincome;
				f_monthincome = data.f_monthincome;
				$("#lastWeekIncome").html(format.formatMoney(f_weekincome,2));
				$("#lastMonthIncome").html(format.formatMoney(f_monthincome,2));
				//将值传给父页面treasureClassIncomeQueryDetail
//				mui.fire(plus.webview.getWebviewById("treasureClassIncomeQueryDetail"),'getNumWeek',{f_weekincome: f_weekincome,f_monthincome:f_monthincome});
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
			 
		window.addEventListener("reload",function(event){
			turnPageBeginPos = 1;
            myInvestmentQuery(f_deposit_acct,1);
        });
		document.getElementById("submit").addEventListener('tap',function(){
			plus.webview.close(plus.webview.getWebviewById("treasureClassIncomeQueryDetail"));
			plus.webview.close(plus.webview.getWebviewById("lastWeekIncome"));
		});
	});

});