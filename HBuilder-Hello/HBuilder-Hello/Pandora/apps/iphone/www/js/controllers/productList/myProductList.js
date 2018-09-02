define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	//绑定账号列表
	var iAccountInfoList = [];
	var accountPickerList=[];
    var accountPicker;
    //当前选定账号
	var currentAcct = "";
	var currentItem = "ownProduct";
	var turnPageBeginPos;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    var ownProductList = [];
    var todaySaleList = [];
    
    mui.init({
		pullRefresh: {
			container: '#pullRefresh',
			down: {
				callback: pulldownfresh
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
			var currentNum = $('#finacingList li').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
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
	    queryFiancing = function(itemId, accountCardNo, turnPageBeginPos){
			var dataNumber = {
				accountCardNo : currentAcct,
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum
			};
			var action = '';
			if (itemId == 'ownProduct') {
				action = 'ownfinancingList.do';
			} else {
				action = '009007_todaysale.do';
			}
			var url = mbank.getApiURL() + action;
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				turnPageTotalNum = data.turnPageTotalNum;
				if( turnPageBeginPos == 1 ){
		       	   	$("#finacingList").empty();
		       	}
		       	if (itemId == 'ownProduct') {
		       		dealOwnProductQuery(data);
		       	} else {
		       		dealTodaySaleQuery(data);
		       	}
				$("#pullRefresh").show();
		       	$("#showMsgDiv").hide();
				mui('#pullRefresh').pullRefresh().setStopped(false);
			}
			function errorCallback(e){
		    	if ("LC9999" == e.ec) {
		    		var html = '<div class="fail_icon1 suc_top7px"></div>';
					html += '<p class="fz_15 text_m">' + e.em + '</p>';
					$("#showMsgDiv").html(html);
					$("#showMsgDiv").show();
					$("#pullRefresh").hide();
					mui('#pullRefresh').pullRefresh().setStopped(true);
		    	} else {
		    		mui.alert(e.em);
		    	}
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
//			accountPicker.show(function(items) {
//				var pickItem=items[0];
//				currentAcct=iAccountInfoList[pickItem.value].accountNo;
//				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
//				resetPullRefresh();
//				turnPageBeginPos = 1;
//				queryFiancing(currentItem, currentAcct, turnPageBeginPos);
//			});
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
	    
		/*处理持有理财产品查询*/
		function dealOwnProductQuery(data) {
	   		var html = '';
			var iOwnfiancing = data.iOwnfiancingOpen;
			for(var i=0;i<iOwnfiancing.length;i++){
				var productNo = iOwnfiancing[i].productNo;					//产品编号
				var productName = iOwnfiancing[i].productName;				//产品名称
				var currencyType = iOwnfiancing[i].currencyType;			//币种
				var transferSum = iOwnfiancing[i].transferSum;				//持有金额
				var finanTransferVol = iOwnfiancing[i].finanTransferVol;	//持有份额
				var flag = iOwnfiancing[i].flag;							//标志
				var status = iOwnfiancing[i].status;						//交易状态
				var raiseBeginDate = iOwnfiancing[i].raiseBeginDate;		//募集开始日
				var raiseEndDate = iOwnfiancing[i].raiseEndDate;			//募集结束日
				var interestBeginDate = iOwnfiancing[i].interestBeginDate;	//起息日
				var interestEndDate = iOwnfiancing[i].interestEndDate;		//到期日
				var yieldRate = iOwnfiancing[i].yieldRate;					//预期收益率
				var raiseBeginDateShow = format.formatDate(format.parseDate(raiseBeginDate, "yyyymmdd"));
				var raiseEndDateShow = format.formatDate(format.parseDate(raiseEndDate, "yyyymmdd"));
				var interestBeginDateShow = format.formatDate(format.parseDate(interestBeginDate, "yyyymmdd"));
				var interestEndDateShow = format.formatDate(format.parseDate(interestEndDate, "yyyymmdd"));
				var index = turnPageBeginPos - 1 + i;
				ownProductList[index] = iOwnfiancing[i];
				html+='<li index=' + index + '>';
		      	html+='<p class="color_6">产品名称</p>';
		      	html+='<p class="fz_15 ptext">' + productName + '</p>';
		      	html+='<div class="content_rbox">';
		      	
		      	html+='<p class="color_6">' + yieldRate + '%</p>';
		      	html+='<p class="fz_12 color_9">预期收益率</p>';
		      	html+='</div>';
		      	html+='<a class="link_rbg2"></a>';
		      	html+='</li>';
			}
			$("#finacingList").append(html);
			$("#finacingList li").on('tap', function(){
				var index = $(this).attr("index");
				var productType=ownProductList[index].productType;
				var params = {
					productNo : ownProductList[index].productNo,
					productName : ownProductList[index].productName,
					currencyType : ownProductList[index].currencyType,
					transferSum : ownProductList[index].transferSum,
					finanTransferVol : ownProductList[index].finanTransferVol,
					interestBeginDate : ownProductList[index].interestBeginDate,
					interestEndDate : ownProductList[index].interestEndDate,
					yieldRate : ownProductList[index].yieldRate,
					flag : ownProductList[index].flag,
					status : ownProductList[index].status,
					accountNo : currentAcct,
					noCheck : false,
					productType:productType,
					remainVol:ownProductList[index].remainVol,
					minHold:ownProductList[index].minHold
				};
				if(productType=='3'){
					mbank.openWindowByLoad('ownOpenProductDetail.html','ownOpenProductDetail','slide-in-right',params);
				}else{
					mbank.openWindowByLoad('ownProductDetail.html','ownProductDetail','slide-in-right',params);
				}

			});
	   	}
		
		/*处理当日委托交易查询*/
		function dealTodaySaleQuery(data) {
			var html = '';
			var iCurrentbail = data.iCurrentbail;
			for(var i=0;i<iCurrentbail.length;i++){
				var transferFlowNo = iCurrentbail[i].transferFlowNo;		//交易流水号
				var productNo = iCurrentbail[i].productNo;					//产品编号
				var productName = iCurrentbail[i].productName;				//产品名称
				var interestBeginDate = iCurrentbail[i].interestBeginDate;	//起息日
				var interestEndDate = iCurrentbail[i].interestEndDate;		//到期日
				var transAmt = iCurrentbail[i].transAmt;					//交易金额
				var transVol=iCurrentbail[i].applyVolume;	                //申请份额
				var transType = iCurrentbail[i].transType;					//交易类型
				var channelType = iCurrentbail[i].channelType;				//交易渠道
				var currencyType = iCurrentbail[i].currencyType;			//币种
				var interestBeginDateShow = format.formatDate(format.parseDate(interestBeginDate, "yyyymmdd"));
				var interestEndDateShow = format.formatDate(format.parseDate(interestEndDate, "yyyymmdd"));
				var index = turnPageBeginPos - 1 + i;
				todaySaleList[index] = iCurrentbail[i];
				html+='<li index=' + index + '>';
		      	html+='<p class="color_6">产品名称</p>';
		      	html+='<p class="fz_15 ptext">' + productName + '</p>';
		      	html+='<div class="content_rbox">';
		      	if(transType == '124'){
		      		html+='<p class="color_6">¥' + format.formatMoney(transVol, 2) + '</p>';
		      		html+='<p class="fz_12 color_9">申请份额</p>';
		      	}else{
		      		html+='<p class="color_6">¥' + format.formatMoney(transAmt, 2) + '</p>';
		      		html+='<p class="fz_12 color_9">购买金额</p>';
		      	}
		      	
		      	html+='</div>';
		      	html+='<a class="link_rbg2"></a>';
		      	html+='</li>';
			}
			$("#finacingList").append(html);
			$("#finacingList li").on('tap', function(){
				var index = $(this).attr("index");
				var params = {
					transferFlowNo : todaySaleList[index].transferFlowNo,
					productNo : todaySaleList[index].productNo,
					productName : todaySaleList[index].productName,
					interestBeginDate : todaySaleList[index].interestBeginDate,
					interestEndDate : todaySaleList[index].interestEndDate,
					transAmt : todaySaleList[index].transAmt,
					transVol: todaySaleList[index].applyVolume,
					transType : todaySaleList[index].transType,
					channelType : todaySaleList[index].channelType,
					currencyType : todaySaleList[index].currencyType,
					accountCardNo : currentAcct,
					noCheck : false
				};
				mbank.openWindowByLoad('todaySaleDetail.html','todaySaleDetail','slide-in-right',params);
			});
		}
		
		function resetPullRefresh() {
			mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().scrollTo(0,0);
		}
		
		//子页面向左滑动
		window.addEventListener("swipeleft", function(event) {
			if (Math.abs(event.detail.angle) > 170) {
				if (currentItem == "todaySale") {
					return;
				}
				currentItem = "todaySale";
				mui.fire(self.parent(), "changeItem", {currentItem: currentItem});
				resetPullRefresh();
				queryDefaultAcct();
			}
		});
		
		//子页面向右滑动
		window.addEventListener("swiperight", function(event) {
			if (Math.abs(event.detail.angle) < 10) {
				if (currentItem == "ownProduct") {
					return;
				}
				currentItem = "ownProduct";
				mui.fire(self.parent(), "changeItem", {currentItem: currentItem});
				resetPullRefresh();
				queryDefaultAcct();
			}
		});
		
		window.addEventListener("refresh", function(event) {
			turnPageBeginPos = 1;
			queryFiancing(currentItem, currentAcct, turnPageBeginPos);
		});
		
	});
});