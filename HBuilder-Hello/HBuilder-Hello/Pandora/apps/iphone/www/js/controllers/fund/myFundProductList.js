define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	//绑定账号列表
	var iAccountInfoList = [];
	var accountPickerList=[];
    var accountPicker;
    //当前选定账号
	var currentAcct = "";
	var currentItem = "";
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var f_cust_type = '1';
    var f_bank_cust_code = "";
    var turnPageTotalNum = '0';
    var ownProductList = [];
    var todaySaleList = [];
    
    
    mui.init({		
		pullRefresh: {
			container: '#pullRefresh',
			down: {
				callback: pulldownfresh,				
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}			
		}
	});
	
	function pulldownfresh(){
		setTimeout(function() {
			turnPageBeginPos = 1;
			queryFiancing(currentItem,currentAcct,turnPageBeginPos);
			mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullRefresh').pullRefresh().disablePullupToRefresh();
		}, 800);
		setTimeout(function() {
			mui('#pullRefresh').pullRefresh().enablePullupToRefresh();
			mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
		}, 1600);
    }
	
 	function pullupRefresh(){ 				
		setTimeout(function() {
			var currentNum = $('#fundList li').length;						
			//无数据时，事件处理
			if(currentNum >= turnPageTotalNum) { 				
				mui('#pullRefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryFiancing(currentItem,currentAcct,turnPageBeginPos);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
   	}
 	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		/*统一查询*/
	    queryFiancing = function(itemId, f_deposit_acct, turnPageBeginPos){	    	
	    	f_bank_cust_code = localStorage.getItem("session_hostId");	    		    	
			var dataNumber = {				
				
				f_deposit_acct : currentAcct,
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum,				
				f_cust_type : f_cust_type
			};
			
			var url = mbank.getApiURL() + 'fundTradeQuery.do';			
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){												
				turnPageTotalNum = data.turnPageTotalNum;
				if( turnPageBeginPos == 1 ){
		       	   	$("#fundList").empty();		       	   	
		       	    if( turnPageTotalNum=='0' ){
						$("#showMsgDiv").empty();
						$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
					    $("#showMsgDiv").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
					    $("#showMsgDiv").show();
			       		$("#pullRefresh").hide();
					    mui('#pullRefresh').pullRefresh().setStopped(true);//禁止上下拉
		       	   }
		       }
				
				if(data.f_tradeList.length>0){
					$("#pullRefresh").show();
			       	$("#showMsgDiv").hide();
					dealTodaySaleQuery(data);
				}
			}
		   function errorCallback(data){
	    		$("#fundList").empty();
	    		$("#showMsgDiv").empty();
	    		plus.nativeUI.closeWaiting();//关闭系统等待对话框
	    		if(data.ec == "3112"){
			       	$("#showMsgDiv").append('<p class="fz_15 text_m">未获取到客户签约信息 </p>');
	    		}else{
			       	$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
			       	$("#showMsgDiv").append('<p class="fz_15 text_m">' + data.em + ' </p>');
	    		}	    		
		       	$("#showMsgDiv").show();
		       	$("#pullRefresh").hide();
		       	mui('#pullRefresh').pullRefresh().setStopped(true);//禁止上下拉
//		    	mui.alert(data.em);
		    }
		}
	    
	    /*获取父页面currentItem*/
	    window.addEventListener("itemId", function(event) {
			currentItem = event.detail.currentItem;
			resetPullRefresh();
			queryDefaultAcct();
		});
	    
	    queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack, "2");
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
					turnPageBeginPos = 1;
					queryFiancing(currentItem, currentAcct, turnPageBeginPos);
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
				accountPicker = new mui.SmartPicker({title:"请选择银行账号",fireEvent:"accountNo"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		
		$("#changeAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();
		});
		
		window.addEventListener("accountNo",function(event){
			var pickItem=event.detail;
			currentAcct=iAccountInfoList[pickItem.value].accountNo;
			$("#accountNo").html(format.dealAccountHideFour(currentAcct));
			resetPullRefresh();
			turnPageBeginPos = 1;
			queryFiancing(currentItem, currentAcct, turnPageBeginPos);
		});
	    	   
		/*处理当日委托交易查询*/
		function dealTodaySaleQuery(data) {	 
			mui('#pullRefresh').pullRefresh().setStopped(false);//放开上下拉
    		var html = '';			
			var iCurrentbail = data.f_tradeList;
			for(var i=0;i<iCurrentbail.length;i++){
				var f_applicationamount = iCurrentbail[i].f_applicationamount;		//申请金额
				var f_applicationvol = iCurrentbail[i].f_applicationvol;      //申请份额
				var f_prodname = iCurrentbail[i].f_prodname;					//产品名称
				var f_transtatus = iCurrentbail[i].f_transtatus;				//产品状态
				var f_transactiondate = iCurrentbail[i].f_transactiondate;	//申请日期
				var f_prodtype = iCurrentbail[i].f_prodtype;		//产品类型
				var f_businesscode = iCurrentbail[i].f_businesscode;
				var f_prodcode = iCurrentbail[i].f_prodcode;
				
				f_businesscode = $.param.getDisplay("BUSINESS_CODE",f_businesscode);
				//f_businesscode = $.param.getAttribute("TRANSFER_LIST",f_businesscode);
																
				f_transactiondate = format.formatDate(format.parseDate(f_transactiondate, "yyyymmdd"));
				var index = turnPageBeginPos - 1 + i;
				todaySaleList[index] = iCurrentbail[i];
	
				html+='<li  index=' + index + '>';
				//html+='<ul class="backbox_th m_top10px p_down10px ove_hid" index=' + index + '>';
			    //html+='<li class="fundList">';				
			    html+='<div class="backbox_th m_top10px p_down10px ove_hid" id="transTrustQuery">';
			    html+='<a class="link_rbg link_t20px"></a>';
			    html+='<p class="p_top10px m_left15px fz_15">'+f_prodname+'<span class="color_6">(' + f_prodcode + ')</span></p>';
				html+='<div class="fund_cxlbbg_l">';
				html+='<p class="p_top10px m_left15px color_6">交易时间<span class="m_left10px">'+f_transactiondate+'</span></p>';
				if(iCurrentbail[i].f_businesscode == '24' || iCurrentbail[i].f_businesscode == '25' || iCurrentbail[i].f_businesscode=='98'){
					html+='<p class="m_top5px m_left15px color_6">申请份额<span class="m_left10px">' + format.formatMoney(f_applicationvol, 2) + '</span>份</p>';
				}else{
					html+='<p class="m_top5px m_left15px color_6">申请金额<span class="m_left10px">' + format.formatMoney(f_applicationamount, 2) + '</span>元</p>';
				}
				html+='</div>';				
				html+='<div class="fund_cxlbbg_r">';
				html+='<p class="p_top10px color_6">交易类型<span class="m_left10px">'+f_businesscode+'</span></p>';				
				html+='<p class="m_top5px color_6">交易账号<span class="m_left10px">'+format.dealAccountHideThree(currentAcct)+'</span></p>';
				html+='</div>';																									
		      	html+='</div>';	
		      	html+='</li>';		      			      	
			}						
			$("#accountNo").html(format.dealAccountHideFour(currentAcct));
			$("#fundList").append(html);
			$("#fundList li").on('tap', function(){
				var index = $(this).attr("index");
				var params = {
					f_prodname : todaySaleList[index].f_prodname,
					f_prodcode : todaySaleList[index].f_prodcode,
					f_transactiondate : todaySaleList[index].f_transactiondate,
					f_applicationamount : todaySaleList[index].f_applicationamount,
					f_applicationvol : todaySaleList[index].f_applicationvol,
					f_prodtype : todaySaleList[index].f_prodtype,
					f_transtatus : todaySaleList[index].f_transtatus,
					f_app_sno : todaySaleList[index].f_app_sno,
					f_businesscode : todaySaleList[index].f_businesscode,
					accountCardNo : currentAcct,
					noCheck : false
				};
				mbank.openWindowByLoad('../fund/fundAgentProductDetail.html','fundAgentProductDetail','slide-in-right',params);
			});
		}
		
		window.addEventListener("reload",function(event){
            queryDefaultAcct();
        });
		
		function resetPullRefresh() {
			mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().scrollTo(0,0);
		}
	});
});