define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
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
			var currentNum = $('#fundList li').length;
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
	    queryFiancing = function(itemId, f_deposit_acct, turnPageBeginPos){	
			var dataNumber = {				
				f_deposit_acct : currentAcct,
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum,				
				f_cust_type : f_cust_type
			};
			
			var url = mbank.getApiURL() + 'myFundQuery.do';			
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
				var f_total_fundval = data.f_total_fundval;
				var f_total_profit_loss = data.f_total_profit_loss;
				var f_total_appamount = data.f_total_appamount;
				f_total_fundval = format.formatMoney(f_total_fundval, 2);
				f_total_profit_loss = format.formatMoney(f_total_profit_loss, 2);
				f_total_appamount = format.formatMoney(f_total_appamount, 2);
				document.getElementById("total_fundval").innerHTML = f_total_fundval;
				document.getElementById("total_profit_loss").innerHTML = f_total_profit_loss;
				document.getElementById("total_appamount").innerHTML = f_total_appamount;
				if(data.f_myfundList.length>0){      
					$("#pullRefresh").show();
			       	$("#showMsgDiv").hide();
					//mui('#pullRefresh').pullRefresh().setStopped(false);
					myFundList(data);
				}
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
	    		
		//处理我的持仓集合
		function myFundList(data) {	
			mui('#pullRefresh').pullRefresh().setStopped(false);//放开上下拉
			var html = '';
			var f_myfundList = data.f_myfundList;
			
			for(var i=0;i<f_myfundList.length;i++){
				var f_prodname = f_myfundList[i].f_prodname;		//产品名称
				var f_prodcode = f_myfundList[i].f_prodcode;		//产品代码
				var f_nav = f_myfundList[i].f_nav;				//最新净值
				var f_navdate = f_myfundList[i].f_navdate;	//净值日期
				var f_marketval = f_myfundList[i].f_marketval;		//参考市值
				var f_prodtype = f_myfundList[i].f_prodtype;  //产品类型
				var f_profit_loss = f_myfundList[i].f_profit_loss;  //浮动盈亏
				var f_fundincome = f_myfundList[i].f_fundincome;  //万份收益
				
				f_profit_loss = format.formatMoney(f_profit_loss, 2);
				f_marketval = format.formatMoney(f_marketval, 2);
				f_navdate = format.formatDate(format.parseDate(f_navdate, "yyyymmdd"));
				var index = turnPageBeginPos - 1 + i;
				todaySaleList[index] = f_myfundList[i];
							
				html+='<li index=' + index + '>';
				//html+='<div class="content_box5px">';
				html+='<div class="backbox_th m_top10px p_down10px ove_hid" id="transTrustQuery">';
				 html+='<a class="link_rbg link_t20px"></a>';
			    html+='<p class="p_top10px m_left15px fz_15">'+f_prodname+'<span class="color_6">(' + f_prodcode + ')</span></p>';
				html+='<div class="fund_cxlbbg_l">';
				html+='<p class="p_top10px m_left15px color_6">交易盈亏<span class="m_left10px">'+f_profit_loss+'</span>元</p>';
				html+='<p class="m_top5px m_left15px color_6">当前市值<span class="m_left10px">' + f_marketval + '</span>元</p>';
				html+='</div>';
				
				html+='<div class="fund_cxlbbg_r">';
				if(f_prodtype == "12" || f_prodtype == "91"){
					html+='<p class="p_top10px color_6">万份收益<span class="m_left10px">'+f_fundincome+'</span></p>';
					html+='<p class="m_top5px color_6">日期<span class="m_left10px">'+f_navdate+'</span></p>';
				}else{
					html+='<p class="p_top10px color_6">最新净值<span class="m_left10px">'+f_nav+'</span></p>';				
					html+='<p class="m_top5px color_6">日期<span class="m_left10px">'+f_navdate+'</span></p>';
				}
				html+='</div>';																				
		      	html+='</div>';	
		      	html+='</li>';

			}			
			
			$("#accountNo").html(format.dealAccountHideFour(currentAcct));
			$("#fundList").append(html);
			$("#fundList li").on('tap', function(){
				var index = $(this).attr("index");
				var f_prodtype = todaySaleList[index].f_prodtype;
				
				var params = {
					currentAcct : currentAcct,
					f_prodname : todaySaleList[index].f_prodname,
					f_prodcode : todaySaleList[index].f_prodcode,
					f_profit_loss : todaySaleList[index].f_profit_loss,
					f_prodtype : todaySaleList[index].f_prodtype,					
					f_profit_rate : todaySaleList[index].f_profit_rate, //收益率					
					f_avdilvol : todaySaleList[index].f_avdilvol, //产品可用份额
					f_fundvol : todaySaleList[index].f_fundvol, //产品总份额
					f_marketval : todaySaleList[index].f_marketval, //市值
					f_nav : todaySaleList[index].f_marketval, //产品净值
					f_tano : todaySaleList[index].f_tano,
					noCheck : false
				};
				
				if(f_prodtype == 91){
					
					mbank.openWindowByLoad('../fund/cashFundDetail.html','cashFundDetail','slide-in-right',params);
					
				}else{					
					mbank.openWindowByLoad('../fund/myHoldFundDetail.html','myHoldFundDetail','slide-in-right',params);
				}
				
			});
		}
		
		function resetPullRefresh() {
			mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh();
			mui('#pullRefresh').pullRefresh().refresh(true);
			mui('#pullRefresh').pullRefresh().scrollTo(0,0);
		}
		
		window.addEventListener("refreshMyFundList", function(event) {
			queryDefaultAcct();
		});
		
	});
});