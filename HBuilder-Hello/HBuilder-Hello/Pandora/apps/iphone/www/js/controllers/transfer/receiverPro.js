//收款人维护


define(function(require, exports, module) {
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var mbank = require('../../core/bank');
	var iAccountInfoList = [];
	
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    var accountNum = 0;
	
	var freshFlag = 0;
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
//		turnPageBeginPos=1;
//      queryRecBook(1);
		setTimeout(function() {
//			turnPageBeginPos=1; 
//			queryBank(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			
		}, 800);
    }

 	function pullupRefresh() {
		setTimeout(function() {
			var currentNum = $('ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			if(freshFlag==1){
				turnPageBeginPos = 1;
				freshFlag = 0;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryRecBook(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
	
	function queryRecBook(beginPos){
        var url = mbank.getApiURL()+'payBookOption.do';
        var params={
        	"payBookDealFlag":"2",
        	"searchKey":$('#searchKey').val(),
        	"turnPageBeginPos":beginPos,
        	"turnPageShowNum":turnPageShowNum
        };
	    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
	    function successCallback(data){
	    	turnPageTotalNum=data.turnPageTotalNum;
	    	var iPayBook =data.iPayBook;
	    	if( iPayBook.length>0 ){
				Array.prototype.push.apply(iAccountInfoList,iPayBook);
				$("li a").unbind();
				$("li button").unbind();
	    		var details = $('#details');
	    		if( beginPos==1){
	    			details.empty();
	    		}
//	    		mui('#pullrefresh').pullRefresh().setStopped(false);
	    		/*
	    		 <ul class="backbox_one bg_br2px m_top10px p_lr10px">
				 	<li class="accountLi">
				 		<p class="color_6 m_top14px">湖北银行</p>
				 		<P class="color_9 m_top10px">账号&nbsp;&nbsp;<span class="fz_18">1000&nbsp;***&nbsp;0000</span></P> 
				 		<p class="color_6 m_top5px">姓名&nbsp;&nbsp;<span>网银测试</span></p>
	 	             </li>
	 	             <li class="deleteLi">
	 	             	<a class="delete_icon"><img src="../../img/delete_ico.png" /></a>
	 	             </li>
	 	             <li class="reviseLi">
	 	             	<button class="but_rev_book but_dr">转</button>
	 	             </li>
				 </ul>
	    		 * */
	    		for(var i=0;i<iPayBook.length;i++){
	    			var accountDetail=iPayBook[i];
	    			var liIndex = accountNum+i;
	    			var ul = $('<ul class="backbox_one bg_br2px m_top10px p_lr10px" num="'+liIndex+'"></ul>');
	    			var bankNameP = $('<p class="color_6 m_top14px"></p>');
	    			bankNameP.append(accountDetail.recAccountOpenBankName);
	    			var accountP = $('<P class="color_9 m_top10px">账号&nbsp;&nbsp;</P>');
	    			var spanAcc = $('<span class="fz_18"></span>');
	    			spanAcc.append(format.dealMoney(accountDetail.recAccount));
	    			accountP.append(spanAcc);
	    			var nameP = $('<p class="color_6 m_top5px">姓名&nbsp;&nbsp;</p>');
	    			var spanName = $('<span></span>');
	    			spanName.append(accountDetail.recAccountName);
	    			nameP.append(spanName);
	    			
	    			var accountLi = $('<li class="accountLi"></li>');
	    			accountLi.append(bankNameP).append(accountP).append(nameP);
	    			
	    			var deleteLi = $('<li class="deleteLi"></li>');
	    			var a = $('<a class="delete_icon" class="delete" num="'+liIndex+'"><img src="../../img/delete_ico.png" /></a>');
	    			deleteLi.append(a);
	    			
	    			var reviseLi = $('<li class="reviseLi"></li>');
	    			var btn = $('<button class="but_rev_book but_dr" class="transfer" num="'+liIndex+'">转</button>');
	    			reviseLi.append(btn);
	    			ul.append(accountLi).append(deleteLi).append(reviseLi);
	    			details.append(ul);
	    		}
	    		
	    		accountNum+= iPayBook.length;
		        $("li a").on("tap",function(){
		        	var num=$(this).attr("num");
		        	mui.confirm("确定删除该收款人？","提示",["确认","取消"], function(e) {
		        		if (e.index == 0) {
		        			var url = mbank.getApiURL() + "payBookLoad.do";
							//行内 1 行外2
							var params = {
								"payBookType":iAccountInfoList[num].payBookType,
								"recAccount":iAccountInfoList[num].recAccount,
								'recAccountName':iAccountInfoList[num].recAccountName,
								'payBookChannel':'1',
								'payBookDealFlag':'1'
							};
							mbank.apiSend("post",url,params,successCallback,errorCallback,true);
							function successCallback(data){
								var params = {"title":"收款人名册","value":"删除收款人成功！"};
								mbank.openWindowByLoad("../transfer/addReceiverResult.html","addReceiverResult",'slide-in-right',{"params":params});
							}
		        		}
		        		
		        	});
//		        	mbank.openWindowByLoad('receiverBook.html','receiverBook','slide-in-right',{params:iAccountInfoList[num]});
		        });
		        $("li button").on('tap',function(){
		        	var num=$(this).attr("num");
		        	var params = {"recAccountOpenBank":iAccountInfoList[num].recAccountOpenBank,
		        		"recAccountName":iAccountInfoList[num].recAccountName,
		        		"recAccount":iAccountInfoList[num].recAccount,
		        		"recAccountOpenBankName":iAccountInfoList[num].recAccountOpenBankName
		        	};
					if(iAccountInfoList[num].payBookType=="1"){
						mbank.openWindowByLoad("innerTranInput.html","innerTranInput",'slide-in-right',params);
					} else {
						mbank.openWindowByLoad("interTranInput.html","interTranInput",'slide-in-right',params);
					}
		        });
	    	}else{
	    		if( beginPos==1 ){
	    			$("#details").empty().append("<ul><li>未查询到收款人</li></ul>");
	    		}
	    	}
	    }
	    function errorCallback(e){
	    	mui.toast(e.em);
	    }
    }
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		queryRecBook(1);
		
		$('#submit').on('tap',function(){
			mbank.openWindowByLoad('addReceiver.html','addReceiver','slide-in-right');
		});
		
		$('#searchButton').on('tap',function(){
			iAccountInfoList=[];
			accountNum = 0;
			freshFlag = 1;
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
			queryRecBook(1);
		});
		
		
		window.addEventListener("reload",function(event){
			iAccountInfoList=[];
			accountNum = 0;
			freshFlag = 1;
//			$('#showMsgDiv').hide();
			$('#searchKey').val('');
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
            queryRecBook(1);
        });
		
	});
	
});
