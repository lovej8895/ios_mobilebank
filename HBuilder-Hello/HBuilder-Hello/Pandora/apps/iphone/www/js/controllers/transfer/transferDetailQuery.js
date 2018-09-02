define(function(require, exports, module) {
	var mbank = require('../../core/bank');
//  var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
	var iAccountInfoList = [];
	var beginDate;
	var endDate;
	var transferType;
	var accountNo;
	var accountNum = 0;
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
			turnPageBeginPos=1;	
			queryBank(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
    }

 	function pullupRefresh() {
		setTimeout(function() {
			var currentNum = $('ul li').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryBank(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    } 
	
	function queryBank(beginPos){
        //查询转账交易明细
        var url = mbank.getApiURL()+'002007_transferDetailQuery.do';
        var params={
        	"accountNo":accountNo,
        	"beginDate":beginDate,
        	"endDate":endDate,
        	"transferType":transferType,
        	"turnPageBeginPos":beginPos,
        	"turnPageShowNum":turnPageShowNum
        };
	    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
	    function successCallback(data){
	    	turnPageTotalNum=data.turnPageTotalNum;
	    	var iTransferDetail =data.iTransferDetail;
	    	if( iTransferDetail.length>0 ){
//	    		var html="";
				Array.prototype.push.apply(iAccountInfoList,iTransferDetail);//将iTransferDetail添加到iAccountInfoList中
				$("ul li").unbind();
	    		var detail = $('#detail');
	    		if( beginPos==1 ){
	    			detail.empty();
	    		}
	    		/*<li>
							<p class="color_6">收款账号</p>
							<p class="fz_15">6000 **** 4212</p>
							<div class="content_rbox">
								<p class="color_6">¥76,858.56</p>
								<p class="fz_12 color_9">金额</p>
							</div>
							<a class="link_rbg2"></a>
						</li>*/
	    		
	    		for( var i=0;i<iTransferDetail.length;i++){
	    			var accountDetail=iTransferDetail[i];
	    			var liIndex = accountNum+i;
	    			var li = $('<li num="'+liIndex+'"></li>');
	    			var p1 = $('<p class="color_6"></p>');
	    			p1.append(accountDetail.recAccountName);
//	    			p1.append(format.dealMoney(accountDetail.recAccount));
	    			var p2 = $('<p class="fz_15"></p>');
	    			p2.append(format.dealMoney(accountDetail.recAccount));
	    			var div = $('<div class="content_rbox"></div>');
	    			var p3 = $('<p class="color_6"></p>');
	    			p3.append(format.dataToDate(accountDetail.transferTime));
	    			var p4 = $('<p class="fz_12 color_9"></p>');
	    			p4.append($.param.getUserType('TRANS_RESULT',accountDetail.transferResult));
	    			div.append(p3).append(p4);
	    			var a = $('<a class="link_rbg2"></a>');
	    			li.append(p1).append(p2).append(div);
//	    			if(accountDetail.transferResult=='90'){
	    				li.append(a);
//	    			}
	    			detail.append(li);
	    			/*var span = $("<span class='input_lbg'></span>");
	    			span.append("收款账号"+ accountDetail.recAccount+"交易金额"+format.formatMoney(accountDetail.transferSum,2));
					var cryType = $("<span class='input_m12px' id='cryType'></span>");
					cryType.append("时间"+format.dataToDate(accountDetail.transferTime)+"状态"+$.param.getUserType('TRANS_RESULT',accountDetail.transferResult));
					var a = $("<a class='link_rbg'></a>");
	    			detail.append(li.append(span).append(cryType).append(a));*/
	    			
	    		}
	    		accountNum+= iTransferDetail.length;
		        $("ul li").on("tap",function(){
		        	var num=$(this).attr("num");
//		        	if(iAccountInfoList[num].transferResult=='90'){
		        		
		        		var params = {orderFlowNo:iAccountInfoList[num].transferFlowNo,
		        			"transferType":iAccountInfoList[num].transferType,
		        			"transferResult":iAccountInfoList[num].transferResult
		        		};
		        		mbank.openWindowByLoad('transferDetails.html','transferDetails','slide-in-right',{params:params});
//		        	}
		        	
		        });	    		
	    	}else{
	    		if( beginPos==1 ){
	    			$("ul").empty();
	    			$('#showMsgDiv').show();
					mui('#pullrefresh').pullRefresh().setStopped(true);
	    		}
	    	}
	    }
	    function errorCallback(e){
	    	mui.toast("查询交易失败！");
	    }
    }
	
	
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var params = plus.webview.currentWebview().params;
		accountNo = params.accountNo;
		beginDate = params.beginDate;
		endDate = params.endDate;
		transferType = params.transferType;
		queryBank(1);
	});
});
