define(function(require, exports, module) {
	//引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var turnPageBeginPos = 1;										//起始位置
	var turnPageShowNum = 10; 										//一次显示数量
	var turnPageTotalNum;											//显示总条数
	var f_deposit_acct ="";											//账号;     
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
			myInvestmentQuery(f_deposit_acct,1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	
	function pullupRefresh(){
		
		setTimeout(function(){
			var currentNum = $('#transTrustQuery .goDetail').length;
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
		f_deposit_acct = self.f_deposit_acct;							//账号
		var f_prodcode = self.f_prodcode;								//产品代码
		myInvestmentQuery=function(f_deposit_acct,turnPageBeginPos){
			var params = {
							"f_prodcode":f_prodcode,
							"f_deposit_acct":f_deposit_acct,
							"f_cust_type":1,
							"turnPageBeginPos":turnPageBeginPos,
							"turnPageShowNum":turnPageShowNum
			};	
		var url = mbank.getApiURL() + 'myFundQuery.do';
		mbank.apiSend('post', url , params, transferSuccess, transferError, true, false);
		function transferSuccess(data){
			var transTrustQuery = data.f_myfundList;//得到返回列表
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
			for(var i= 0;i<data.f_myfundList.length;i++){
				var singleList =data.f_myfundList[i];
					html += '<div class="goDetail backbox_th m_top10px p_down10px ove_hid">';
					html += '<p class="p_top10px m_left15px fz_15">'+singleList.f_prodname+'<span class="color_6">('+singleList.f_prodcode+')</span></p>';
					html += '<div class="fund_cxlbbg_l">';
					html += '<p class="p_top10px m_left15px color_6">累计投入<span class="m_left10px">'+format.formatMoney(singleList.f_all_buy)+' 元</span></p>';
					html += '<p class="m_top5px m_left15px color_6">收益率<span class="m_left10px">'+format.formatMoney(singleList.f_profit_rate)+'%</span></p></div>';
					html += '<div class="fund_cxlbbg_r">';
					html += '<p class="p_top10px color_6">累计收益<span class="m_left10px">'+format.formatMoney(singleList.f_profit_loss)+' 元</span></p>';
					html += '<p class="m_top5px color_6">交易账号<span class="m_left10px">'+format.dealAccountHideThree(f_deposit_acct)+'</span></p></div></div>';
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
        //点击返回按钮回到首页	
        document.getElementById("submit").addEventListener('tap',function(){
			plus.webview.close(plus.webview.getWebviewById("historyHoldStore"));
			plus.webview.close(plus.webview.getWebviewById("historyHoldStoreResult"));
		});
	});

});
