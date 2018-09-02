define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var myAcctInfo = require('../../core/myAcctInfo');
	//绑定账号列表
	var iAccountInfoList = [];
	var accountPickerList=[];
    var accountPicker;
	//当前选定账号
	var currentAcct="";
    var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    var subAccountList=[];
    var sysDate="";
    
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
    	turnPageBeginPos=1;	
        subAccountQuery(currentAcct,1);
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
    }

 	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#subAccountList ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			subAccountQuery(currentAcct,turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    } 


	mui.plusReady(function() {
		plus.nativeUI.showWaiting("加载中...");
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();		
		
		subAccountQuery=function(accountNo,turnPageBeginPos){
			var url = mbank.getApiURL()+'savingSubAccountQuery.do';
			var param={
				actionFlag:"1",
				signFlag:"1",
				accountNo:accountNo,
				turnPageBeginPos:turnPageBeginPos,
				turnPageShowNum:turnPageShowNum	
			}
			mbank.apiSend("post",url,param,successCallback,errorCallback,true);
	    	function successCallback(data){
		       var iSubAccountInfo=data.iSubAccountInfo;
		       turnPageTotalNum=data.turnPageTotalNum;
		       sysDate=data.sysDate;
		       if( turnPageBeginPos==1 ){
		       	   subAccountList=[];
		       	   $("#subAccountList").empty();
		       	   if( turnPageTotalNum=='0' ){
		       	       	 $("#subAccountList").append('<div class="fail_icon1 suc_top7px"></div>');
		       	       	 $("#subAccountList").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
//		       	       	 mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		       	       	 return;
		       	   }		       	   
		       }
		       var	html="";
		       if( iSubAccountInfo.length>0 ){
		           for( var i=0;i<iSubAccountInfo.length;i++ ){
		           	    var subAccount=iSubAccountInfo[i]; 
		           	    subAccountList.push(subAccount);
		           	    var savingPeriod=subAccount.savingPeriod;
		           	    var noteState=subAccount.noteState;								
						html+='<ul class="bg_h113px m_top10px bg_br2px">';
						html+='<div class="goDetail" subAccountNo="'+subAccount.subAccountNo+'">';
						html+='<li>';
						html+='<p class="sav_tit">'+$.param.getDisplay("SAVING_PERIOD_TYPE",subAccount.savingPeriod)+'通知存款</p>';
						html+='<a class="link_rbg link_top5px"></a>';
						html+='</li>';
						html+='<li class="money_box">';
						html+='<p class="pub_li_left m_left10px color_6">金额&nbsp;&nbsp;<span class="fz_17 color_red">¥'+format.formatMoney(subAccount.balance,2)+'</span></p>';
						html+='</li>';
						html+='</div>';
						html+='<li class="pub_btnbox">';
						if (noteState == "1") {
							html+='<a class="cancelReserve sav_a" noteState="'+noteState+'" subAccountNo="'+subAccount.subAccountNo+'"><img src="../../img/icon20.png" /><span>取消预约</span></a>';
							html+='<a class="sav_a"><img src="../../img/icon21_1.png" /><span class="color_ddd">支取通知存款</span></a>';
						} else{
							html+='<a class="sav_a"><img src="../../img/icon20_1.png" /><span class="color_ddd">取消预约</span></a>';
							html+='<a class="notify2DemandInput sav_a" noteState="'+noteState+'"  subAccountNo="'+subAccount.subAccountNo+'"><img src="../../img/icon21.png" /><span>支取通知存款</span></a>';
						}
						html+='</li>';
						html+='</ul>';
		           }
		           $("#subAccountList").append(html);	
		           //子账户明细
					$(".goDetail").on("tap",function(){
		           	    var subAccountNo=$(this).attr("subAccountNo");
			            var subAccount=getSubAccountBySubAccNo(subAccountNo);
			            if( null!=subAccount){
			            	mbank.openWindowByLoad('../savings/notifySubAccountDetail.html','notifySubAccountDetail','slide-in-right',subAccount);
			            }		           	    
		           });		           
		           //取消预约
		           $(".cancelReserve").on("tap",function(){
		           	    var noteState=$(this).attr("noteState");
		           	    var subAccountNo=$(this).attr("subAccountNo");
			            var subAccount=getSubAccountBySubAccNo(subAccountNo);
			            if( null!=subAccount && noteState=="1" ){
			            	subAccount.accountNo=currentAcct;
		            		cancelReserve(subAccount);
			            }		           	    
		           });
		           
		           //支取
		           $(".notify2DemandInput").on("tap",function(){
		           	    var noteState=$(this).attr("noteState");
		           	    var subAccountNo=$(this).attr("subAccountNo");
			            var subAccount=getSubAccountBySubAccNo(subAccountNo);
			            if( null!=subAccount && noteState!="1" ){
		            		subAccount.sysDate=sysDate;
		            		subAccount.accountNo=currentAcct;
		            		mbank.openWindowByLoad('../savings/notify2DemandInput.html','notify2DemandInput','slide-in-right',subAccount);  
		            	}	
		           });		           
		           
		           plus.nativeUI.closeWaiting();
		       }
		    }
	    	function errorCallback(data){
	    		$("#subAccountList").empty();
		    	plus.nativeUI.closeWaiting();
		    	dealFail(data);
		    } 			
		}		
		
		function cancelReserve(subAccount){
    		var params={
         		accountNo:subAccount.accountNo,
         	    subAccountNo:subAccount.subAccountNo,
         	    openDate:subAccount.openDate,
         		currencyType:subAccount.currencyType,
         		subAccountSerNo:subAccount.subAccountSerNo,
         		savingPeriod:subAccount.savingPeriod,
         		drawAmount:subAccount.balance
         	};
        	var url = mbank.getApiURL()+'002005_cancelReserveConfirm.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
			    mbank.openWindowByLoad('../savings/cancelReserve.html','cancelReserve','slide-in-right',subAccount);	
		    }
		    function errorCallback(data){
		    	dealFail(data);
		    } 		    	
	    }
		
		queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack,2,true);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
					subAccountQuery(currentAcct,1);
				}
			}
		}
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value:i,
						text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择账号",fireEvent:"pickAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changeAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();	
		});	
		
        window.addEventListener("pickAccount",function(event){
                var pickItem=event.detail;			
				currentAcct=iAccountInfoList[pickItem.value].accountNo;
				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
				subAccountQuery(currentAcct,1);
        });	

		//根据子账户查询子账户对象
		getSubAccountBySubAccNo=function(subAccountNo){
            if( subAccountList!=null && subAccountList.length>0 ){
            	for( var i=0;i<subAccountList.length;i++ ){
            		var subAccount=subAccountList[i];
            		if( subAccount.subAccountNo==subAccountNo ){
            			return subAccount;
            		}
            	}
            }
			return null;
		}
		

		$("#demand2Notify").on("tap",function(){
			var param={
				accountNo:currentAcct
			};
			mbank.openWindowByLoad('../savings/demand2NotifyInput.html','demand2NotifyInput','slide-in-right',param);
		});

        window.addEventListener("reload",function(event){
            subAccountQuery(currentAcct,1);
        });
        
 	    function dealFail(data){
            mui.alert(data.em);
        }

	    window.addEventListener("swipe",function(e){
	    	var direction=e.detail.direction;
	    	if( direction=="left" ){
	    		if (Math.abs(e.detail.angle) > 170) {
			    	plus.webview.getWebviewById("demandFixed").hide();
			    	plus.webview.getWebviewById("notifyDeposit").hide();
			    	plus.webview.getWebviewById("intelligentNotifyDeposit").show();	    		
		    		mui.fire(self.parent(),"changeMenu",{pageId:"intelligentNotifyDeposit"});	    			
	    		}
	    	}
	    	if( direction=="right" ){
	    		if (Math.abs(e.detail.angle) < 10) {
			    	plus.webview.getWebviewById("demandFixed").show();
			    	plus.webview.getWebviewById("notifyDeposit").hide();
			    	plus.webview.getWebviewById("intelligentNotifyDeposit").hide();	  
		    		mui.fire(self.parent(),"changeMenu",{pageId:"demandFixed"});	    			
	    		}
	    	}	    	
	    });

	});

});
