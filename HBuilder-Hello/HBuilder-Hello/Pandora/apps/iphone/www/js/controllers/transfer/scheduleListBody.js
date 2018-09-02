define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
    var iAccountInfoList = [];
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    var accountNum = 0;
    var batchNo;
    
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
//  	console.log("1");
		var url = mbank.getApiURL()+'002002_schenuleList.do';
        var params={
        	"batchNo":batchNo,
			"turnPageBeginPos":beginPos,
        	"turnPageShowNum":turnPageShowNum
        };
        mbank.apiSend("post",url,params,successCallback,errorCallback,true);
        function successCallback(data){
        	turnPageTotalNum=data.turnPageTotalNum;
	    	var iScheduleOrder=data.iScheduleList;
	    	if( iScheduleOrder.length>0 ){
	    		Array.prototype.push.apply(iAccountInfoList,iScheduleOrder);
	    		var details = $('#details');
	    		if(beginPos=='1'){
	    			details.empty();
	    		}
	    		
	    		for( var i=0;i<iScheduleOrder.length;i++){
	    			
	    			/*<li>
							<p class="color_6">收款账号</p>
							<p class="fz_15">6000 **** 4212</p>
							<div class="content_rbox">
								<p class="color_6">¥76,858.56</p>
								<p class="fz_12 color_9">金额</p>
							</div>
							<a class="link_rbg2"></a>
						</li>*/
					var accountDetail=iScheduleOrder[i];
					var liIndex = accountNum+i;
	    			var li = $('<li num="'+liIndex+'"></li>');
	    			var p1 = $('<p class="color_6">金额</p>');
	    			var p2 = $('<p class="fz_15"></p>');
	    			p2.append(format.formatMoney(accountDetail.payAmount,2)+"元");
	    			var div = $('<div class="content_rbox"></div>');
	    			var p3 = $('<p class="color_6">预约执行时间</p>');
	    			var p4 = $('<p class="fz_12 color_9"></p>');
	    			p4.append(format.formatDateTime(accountDetail.sendHostTime));
	    			div.append(p3).append(p4);
	    			var a = $('<a class="link_rbg2"></a>');
	    			li.append(p1).append(p2).append(div).append(a);
	    			details.append(li);
	    			
	    		}
	    		accountNum += iScheduleOrder.length;
	    		$('ul li').on('tap',function(){
	    			var num = $(this).attr('num');
	    			mbank.openWindowByLoad('cycleDetails.html','cycleDetails','slide-in-right',{"params":iAccountInfoList[num]});
	    		});
	    	} else {
	    		if( beginPos==1 ){
	    			$("#details").empty();
	    			$('#showMsgDiv').show();
					mui('#pullrefresh').pullRefresh().setStopped(true);
	    		}
	    	}
        }
        function errorCallback(data){
        	mui.alert(data.em);
        }
	}
    
    
    
    
    mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var parent = plus.webview.getWebviewById("schenuleList");
		batchNo = parent.params.batchNo;
		queryBank(1);
		/*var self = plus.webview.currentWebview().params;
		batchNo = self.batchNo;
		queryBank(1);*/
	});
    
});