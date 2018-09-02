define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
	var iAccountInfoList = [];
	var accountNum = 0;
	var accountNo;
	var signFlag;
	var actionFlag;
	var flag;
	var baseBank;
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
//			turnPageBeginPos = 1;
//			queryNoticeAccount(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
//			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
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
			queryNoticeAccount(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    } 
    
    function queryNoticeAccount(beginPos){
    	var url = mbank.getApiURL()+'savingSubAccountQuery.do';
    	var params = {
    		"accountNo":accountNo,
			"actionFlag":actionFlag,
			"signFlag":signFlag,
			"turnPageBeginPos":turnPageBeginPos,
			"turnPageShowNum":turnPageShowNum
    	};
    	mbank.apiSend("post",url,params,successCallback,errorCallback,true);
    	function successCallback(data){
    		turnPageTotalNum=data.turnPageTotalNum;
	    	var iSubAccountInfo = data.iSubAccountInfo;
	    	if(iSubAccountInfo.length>0){
	    		$('#totleNum').empty().append('总记录数:'+turnPageTotalNum);
	    		Array.prototype.push.apply(iAccountInfoList,iSubAccountInfo);
	    		$("ul li").unbind();
	    		var detail = $('#detail');
	    		if( beginPos==1 ){
	    			$("ul").empty();
	    		}
	    		
	    		for(var i=0;i<iSubAccountInfo.length;i++){
	    			/*
	    		 	 <li>
							<p class="color_6">子账号</p>
							<p class="fz_15">6000 **** 4212</p>
							<div class="content_rbox">
								<p class="color_6">¥76,858.56</p>
								<p class="fz_12 color_9">余额</p>
							</div>
							<a class="link_rbg2"></a>
						</li>
	    		 	 * */
	    		 	var accountDetail=iSubAccountInfo[i];
	    			var liIndex = accountNum+i;
	    		 	var li = $('<li num="'+liIndex+'"></li>');
	    			var p1 = $('<p class="color_6">￥</p>');
	    			var p2 = $('<p class="fz_15"></p>');
//	    			p2.append(format.dealMoney(accountDetail.subAccountNo));
	    			
	    			var div = $('<div class="content_rbox"></div>');
	    			var p3 = $('<p class="color_6"></p>');
//	    			p3.append(format.formatMoney(accountDetail.balance,2));
	    			var p4 = $('<p class="fz_12 color_9"></p>');
	    			var a = $('<a class="link_rbg2"></a>');
	    			/*div.append(p3).append(p4);
	    			li.append(p1).append(p2).append(div).append(a);
	    			detail.append(li);*/
	    			if(flag=='0'){
	    				p1.append(format.formatMoney(accountDetail.balance,2));//金额
	    				p2.append("到期日:"+format.dataToDate(accountDetail.interestEndDate));//到期日
	    				p3.append($.param.getDisplay('DESPOSIT_TYPE_NEW',accountDetail.depositType)+$.param.getDisplay('SAVING_PERIOD_TYPE',accountDetail.savingPeriod));//储种
	    				
	    				if(accountDetail.transferSaveType=="0"){
							p4.append("不转存");
						} else {
							if(accountDetail.transferSaveDays!=null&&accountDetail.transferSaveDays!=''){
								p4.append("自动转存  "+$.param.getDisplay('SAVING_PERIOD_TYPE2',accountDetail.transferSaveDays));
							}
						}
						
	    			} else {
	    				p1.append(format.formatMoney(accountDetail.balance,2));//金额
	    				p2.append($.param.getDisplay('SAVING_PERIOD_TYPE',accountDetail.savingPeriod)+$.param.getUserType('DESPOSIT_TYPE_NEW',accountDetail.depositType));//储种
	    				p3.append("开户:"+format.dataToDate(accountDetail.openDate));//开户日
	    				if(accountDetail.reserveDate!=''){
	    					p4.append("预约:"+format.dataToDate(accountDetail.reserveDate));//预约日期
	    				}
	    				
	    			}
	    			
	    			div.append(p3).append(p4)
					li.append(p1).append(p2).append(div).append(a)
					detail.append(li);
	    			
	    		}
	    		accountNum+= iSubAccountInfo.length;
	    		 $("ul li").on("tap",function(){
	    		 	var num=$(this).attr("num");
	    		 	if(flag=='0'){
	    		 		mbank.openWindowByLoad('regSonDetail.html','regSonDetail','slide-in-right',{"params":iAccountInfoList[num]});
	    		 	} else {
	    		 		mbank.openWindowByLoad('noticeSonAccount.html','noticeSonAccount','slide-in-right',{"params":iAccountInfoList[num],"baseBank":baseBank});
	    		 	}
	    		 });
	    		
	    	} else{
	    		if( beginPos==1 ){
	    			$("ul").empty();
	    			$('#showMsgDiv').show();
	    			mui('#pullrefresh').pullRefresh().setStopped(true);
	    		}
	    	}
    	}
    	function errorCallback(data){
    		console.log(data.em);
    	}
    }
    
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var dataBefore = plus.webview.currentWebview().params;
		accountNo = dataBefore.accountNo;
		signFlag = dataBefore.signFlag;
		actionFlag = dataBefore.actionFlag;
		flag = dataBefore.flag; //0代表定期    1代表通知
		baseBank = dataBefore.baseBank;
		$('#title').html(dataBefore.title);
//		console.log(accountNo+","+signFlag+","+actionFlag+","+flag);
		queryNoticeAccount(1);
	});
});