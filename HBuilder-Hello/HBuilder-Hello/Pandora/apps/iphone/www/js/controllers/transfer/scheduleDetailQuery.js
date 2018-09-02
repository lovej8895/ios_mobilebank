define(function(require, exports, module) {
	var mbank = require('../../core/bank');
//  var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var iAccountInfoList = [];
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    var accountNum = 0;
    var endDate;
    var startDate;
    var orderState;
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
//      queryBank(1);
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
		}, 800);
    }

 	function pullupRefresh() {
		setTimeout(function() {
			var currentNum = $('div ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			querySchenule(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
	
	function querySchenule(beginPos){
        //查询转账交易明细
        var url = mbank.getApiURL()+'002002_schenuleQuery.do';
        var params={
        	"endDate":endDate,
        	"startDate":startDate,
        	"orderState":orderState,
        	"turnPageBeginPos":beginPos,
        	"turnPageShowNum":turnPageShowNum,
        };
	    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
	    function successCallback(data){
	    	turnPageTotalNum=data.turnPageTotalNum;
	    	var iScheduleOrder=data.iScheduleOrder;
	    	if( iScheduleOrder.length>0 ){
	    		Array.prototype.push.apply(iAccountInfoList,iScheduleOrder);
//	    		var html="";
				$("ul li").unbind();
				$('.scheduleDetails').unbind();
				$('.cancleSchedule').unbind();
	    		var details = $('#details');
	    		if( beginPos==1){
	    			details.empty();
	    		}
	    		
	    		for( var i=0;i<iScheduleOrder.length;i++){
	    			var accountDetail=iScheduleOrder[i];
	    			var liIndex = accountNum+i;
	    			
	    			var ul = $('<ul class="bg_h113px m_top5px bg_br2px" num="'+liIndex+'"></ul>');
	    			var liOne = $('<li name="showDetail"></li>');
	    			var pAcc = $('<p class="sav_tit">收款账号：</p>');
	    			var aAcc = $('<a class="link_rbg link_t30px"></a>');
	    			pAcc.append(format.dealMoney(accountDetail.recAccount));
	    			liOne.append(pAcc).append(aAcc);
	    			
	    			var liTwo = $('<li class="money_box" name="showDetail"></li>');
	    			var pBalance = $('<p class="pub_li_left m_left10px">转账金额&nbsp;&nbsp;</p>');
	    			var spanBalance = $('<span class="color_red">¥</span>');
	    			var pState = $('<p class="pub_li_right m_left10px">预约状态&nbsp;&nbsp;</p>');
	    			spanBalance.append(accountDetail.payAmount);
	    			pState.append($.param.getUserType('SCHENULE_STATE_RESULT',accountDetail.state));
	    			liTwo.append(pBalance.append(spanBalance)).append(pState);
	    			
	    			
	    			var liThree = $('<li class="pub_btnbox"></li>');
//	    			var li_cancle = $('<a class="sav_a"><img src="../../img/icon19.png" /><span>取消预约</span></a>');
//	    			var li_detail = $('<a class="sav_a"><img src="../../img/icon10_2.png" /><span class="color_ddd">明细</span></a>');
	    			if(accountDetail.state=="60"){
	    				liThree.append('<a num="'+liIndex+'" class="sav_a cancleSchedule"><img src="../../img/icon19.png" /><span>取消预约</span></a>');
	    			} else {
	    				liThree.append('<a num="'+liIndex+'" class="sav_a cancleSchedule"><img src="../../img/icon19.png" /><span class="color_ddd">取消预约</span></a>');
	    			}
	    			
	    			if(accountDetail.scheduleType=="1"){
	    				liThree.append('<a num="'+liIndex+'" class="sav_a scheduleDetails"><img src="../../img/icon10_2.png" /><span>明细</span></a>');
	    			} else {
	    				liThree.append('<a num="'+liIndex+'" class="sav_a scheduleDetails"><img src="../../img/icon10_2.png" /><span class="color_ddd">明细</span></a>');
	    			}
	    			
	    			/*if(accountDetail.state=="60"){
	    				liThree.append('<a class="cancleSchedule" num="'+liIndex+'">取消预约</a>');
	    			}
	    			if(accountDetail.scheduleType=="1"){
	    				liThree.append('<a class="scheduleDetails" num="'+liIndex+'">明细</a>');
	    			}*/
	    			details.append(ul.append(liOne).append(liTwo).append(liThree));
	    			
	    		}
	    		accountNum+= iScheduleOrder.length;
	    		//预约详细信息
		        $("ul li[name='showDetail']").on("tap",function(){
		        	var num=$(this).parent().attr("num");
		        	var url = mbank.getApiURL()+'002002_cancelQuery.do';
		        	var params = {orderFlowNo:iAccountInfoList[num].orderFlowNo,dealType:'0'};
		        	mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		        	function successCallback(data){
		        		mbank.openWindowByLoad('scheduleDetails.html','scheduleDetails','slide-in-right',{params:data});
		        	}
//		        	mbank.openWindowByLoad('scheduleDetails.html','scheduleDetails','slide-in-right',{params:iAccountInfoList[num]});
		        });
		        //周期性预约明细列表
		        $('.scheduleDetails').on('tap',function(){
		        	var num=$(this).attr("num");
		        	if(iAccountInfoList[num].scheduleType=="1"){
		        		var params = {'batchNo':iAccountInfoList[num].batchNo};
		        		mbank.openWindowByLoad('schenuleList.html','schenuleList','slide-in-right',{params:params});
		        	}

		        	
		        });
		        //取消预约
		        $('.cancleSchedule').on('tap',function(){
		        	var num=$(this).attr("num");
		        	if(iAccountInfoList[num].state=="60"){
		        		var url = mbank.getApiURL()+'002002_cancelQuery.do';
						var param={
								orderFlowNo:iAccountInfoList[num].orderFlowNo
						}
						mbank.apiSend("post",url,param,function(data){
               				mbank.openWindowByLoad('../transfer/cancelScheduleConfirm.html','cancelScheduleConfirm','slide-in-right',data);			
						},function(e){
						},true);	
		        	}
		        	
		        	
		        });
	    	}else{
	    		if( beginPos==1 ){
	    			$("#details").empty();
	    			$('#showMsgDiv').show();
					mui('#pullrefresh').pullRefresh().setStopped(true);
	    		}
	    	}
	    }
	    function errorCallback(e){
	    	mui.toast(e.em);
	    }
    }
	
	
	
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var params = plus.webview.currentWebview().params;
		startDate = params.beginDate;
		endDate = params.endDate;
		orderState = params.orderState;
		querySchenule(1);
		
		//自定义刷新事件
        window.addEventListener("reload",function(event){
            querySchenule(1);
        });		
		
	});
});
