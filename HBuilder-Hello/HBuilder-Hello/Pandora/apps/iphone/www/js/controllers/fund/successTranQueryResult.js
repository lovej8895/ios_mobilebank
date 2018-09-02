define(function(require, exports, module) {
	//引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var turnPageBeginPos = 1;										//起始位置
	var turnPageShowNum = 10; 										//一次显示数量
	var turnPageTotalNum;	//显示总条数
	var pageTransTrustQuery=[];
	var transTrustQuery=[];
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
			turnPageBeginPos = 1;
			myInvestmentQuery(f_deposit_acct,1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	
	function pullupRefresh(){
		setTimeout(function(){
			var currentNum = $('#transTrustQuery a').length;
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
		if(f_businesscode == null){
			f_businesscode = "";
		}
		myInvestmentQuery=function(f_deposit_acct,turnPageBeginPos){
			var params = {
							"f_prodcode":f_prodcode,
							"f_deposit_acct":f_deposit_acct,
							"f_begin_date":f_begin_date,
							"f_status":'04,07',
							"f_end_date":f_end_date,
							"f_businesscode":f_businesscode,
							"turnPageBeginPos":turnPageBeginPos,
							"turnPageShowNum":turnPageShowNum
			};	
			var url = mbank.getApiURL() + '311007_transTrustQuery.do';
			mbank.apiSend('post', url , params, transferSuccess, transferError, true, false);
			function transferSuccess(data){
				transTrustQuery = data.f_transTrustQuery;//得到返回列表
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
						var index = turnPageBeginPos - 1 + i;
						var singleList =data.f_transTrustQuery[i];
						pageTransTrustQuery[index] = singleList;
						html += '<div class="goDetail backbox_th m_top10px p_down10px ove_hid" kickNum='+index+'>';
						html += '<a class="link_rbg link_t20px"></a>';
						html += '<p class="p_top10px m_left15px fz_15">'+singleList.f_prodname+'<span class="color_6">('+singleList.f_prodcode+')</span></p>';
						html += '<div class="fund_cxlbbg_l">';
						html += '<p class="p_top10px m_left15px color_6">申请时间<span class="m_left10px">'+format.dataToDate(singleList.f_transactiondate)+'</span></p>';
						
						if(singleList.f_businesscode.trim()=='24'||singleList.f_businesscode.trim()=='25'||singleList.f_businesscode.trim()=='98'){
							html += '<p class="m_top5px m_left15px color_6">确认份额<span class="m_left10px">'+format.formatMoney(singleList.f_confirmedvol,2)+'</span></p></div>';
						}else{//其余类型展示交易金额，对应确认金额
							html += '<p class="m_top5px m_left15px color_6">确认金额<span class="m_left10px">'+format.formatMoney(singleList.f_confirmedamount,2)+'</span></p></div>';
						}
							
						html += '<div class="fund_cxlbbg_r">';
						html += '<p class="p_top10px color_6">交易类型<span class="m_left10px">'+jQuery.param.getDisplay('BUSINESS_CODE', singleList.f_businesscode)+'</span></p>';
						html += '<p class="m_top5px color_6">交易账号<span class="m_left10px">'+format.dealAccountHideThree(f_deposit_acct)+'</span></p></div></div>';
					}
					
					$("#transTrustQuery").append(html);
			        //进入成交账户明细
					$(".goDetail").on("tap",function(){
						 	var kickNum = $(this).attr("kickNum");
						 	var queryDetail = pageTransTrustQuery[kickNum];
						 	var params ={
						 				f_deposit_acct:f_deposit_acct,
						 				queryDetail:queryDetail
						 	}
						 if(queryDetail != null){
						 	mbank.openWindowByLoad('../fund/successTranQueryDetail.html','successTranQueryDetail','slide-in-right',params);
						}
			        });
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
			plus.webview.close(plus.webview.getWebviewById("successTranQuery"));
			plus.webview.close(self);
		});
        
	});

});
