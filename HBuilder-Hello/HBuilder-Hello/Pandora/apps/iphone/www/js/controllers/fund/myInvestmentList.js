define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
    var myAcctInfo = require('../../core/myAcctInfo');
    //绑定账号列表
    var iAccountInfoList = [];
    var accountPickerList = [];
    var accountPicker;
    //当前选定账号
    var currentAcct = '';
    var turnPageBeginPos = 1;
    var turnPageShowNum = 10;
    var turnPageTotalNum;
    var investmentList = [];
    var pageInvestmentList = [];
    
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
			myInvestmentQuery(currentAcct,1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	
	function pullupRefresh(){
		setTimeout(function(){
			var currentNum = $('#investmentList ul').length;
			if(currentNum >= turnPageTotalNum){//无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			myInvestmentQuery(currentAcct, turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);//参数为true代表没有更多数据了。
		}, 800);
	}
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//保持屏幕竖屏
		plus.nativeUI.showWaiting("加载中...");//显示系统等待对话框
		var self = plus.webview.currentWebview();//获取当前页面对象
		
		myInvestmentQuery=function(accountNo,beginPos){
			var url = mbank.getApiURL()+'311009_aipProtocolQuery.do';
			var param={
				f_cust_type:"1",//客户类型cust_type 0-机构 1-个人
				f_deposit_acct:accountNo,//银行卡号deposit_acct
//				f_deposit_acct:"6230760000004556855",//银行卡号deposit_acct 6230760000004556855--可通
				turnPageBeginPos:turnPageBeginPos,
				turnPageShowNum:turnPageShowNum	
			}
			mbank.apiSend("post",url,param,successCallback,errorCallback,false);
	    	function successCallback(data){
		       var f_investmentList=data.f_investmentList;
		       turnPageTotalNum=data.turnPageTotalNum;
		       if( turnPageBeginPos==1 ){
		       	   investmentList=[];
		       	   $("#investmentList").empty();
		       	   $("#showMsgDiv").empty();
		       	   if( turnPageTotalNum=='0' ){
		       	   		plus.nativeUI.closeWaiting();//关闭系统等待对话框
		       	       	$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
		       	       	$("#showMsgDiv").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
		       	       	$("#showMsgDiv").show();
		       	       	$("#pullrefresh").hide();
		       	       	mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
		       	       	return;
		       	   }
		       }
		       var	html="";
		       if( f_investmentList.length>0 ){
		       		$("#titleDiv").show();
		       		$("#pullrefresh").show();
		       		$("#showMsgDiv").hide();
		       		mui('#pullrefresh').pullRefresh().setStopped(false);//放开上下拉
		           for( var i=0;i<f_investmentList.length;i++ ){
		           	    var investment=f_investmentList[i]; 
		           	    investmentList.push(investment);
		           	    //翻页功能 数据处理
						var index = beginPos - 1 + i;
						pageInvestmentList[index] = f_investmentList[i];
						
		           	    var show_f_investcycle;
						var show_f_investday;
						show_f_investcycle = jQuery.param.getDisplay('SHOW_INVEST_CYCLE_MODE', pageInvestmentList[index].f_investcycle + pageInvestmentList[index].f_investcyclevalue);
						if(pageInvestmentList[index].f_investcycle == 0){
//							show_f_investcycle = '每月';
							show_f_investday = pageInvestmentList[index].f_investday + '日';
						}else{
//							show_f_investcycle = '每周';
							show_f_investday = '星期'+ jQuery.param.getDisplay('GET_NUBERTOCN', pageInvestmentList[index].f_investday);
						}
						html+='<ul class="fundmarket_tabcont liDetail" index=' + index + '>';
						html+='<li class="fundmarket_tableft">';
						html+='<p>' + pageInvestmentList[index].f_prodname + '</p><p class="color_6 fz_15">' + pageInvestmentList[index].f_prodcode + '</p></li>';
						html+='<li class="fundmarket_tabm">';
						html+='<p class="m_top5px" style="margin-top: 10px;">' + show_f_investcycle + show_f_investday + '</p></li>';
						html+='<li class="fundmarket_tabright">';
						html+='<p class="color_red  m_top5px" style="margin-top: 12px;">¥' + pageInvestmentList[index].f_investamount + '</p>';
				      	html+='</li>';
				      	html+='</ul>';
		           }
		           $("#investmentList").append(html);

		           //定投详情
					$(".liDetail").off().on('tap', function(){
						var index = $(this).attr("index");
						mbank.openWindowByLoad(
							"../fund/investmentDetail.html",
							"investmentDetail",
							"slide-in-right",
							{
						        investment: pageInvestmentList[index],
						        currentAcct: currentAcct,
						        noCheck : "false"
						    }
						);
					});
			        plus.nativeUI.closeWaiting();
			    }
		    }
	    	function errorCallback(data){
	    		$("#investmentList").empty();
	    		$("#showMsgDiv").empty();
	    		plus.nativeUI.closeWaiting();//关闭系统等待对话框
	    		if(data.ec == "3112"){
			       	$("#showMsgDiv").append('<p class="fz_15 text_m">未获取到客户签约信息 </p>');
	    		}else{
			       	$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
			       	$("#showMsgDiv").append('<p class="fz_15 text_m">' + data.em + ' </p>');
	    		}
		       	$("#showMsgDiv").show();
		       	$("#pullrefresh").hide();
		       	mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
//		    	mui.alert(data.em);
		    } 			
		}
		
		queryDefaultAcct();
		//获取绑定账号列表
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					//设置默认账号
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
					turnPageBeginPos = 1;
					myInvestmentQuery(currentAcct,1);
				}
			}
		}
		//获取账号列表
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value: i,
						text: format.dealAccountHideFour(account.accountNo)//带****格式化账号
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择账号",fireEvent:"pickAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changeAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();//显示账号选择下拉框	
		});	
		//选择账号触发事件
        window.addEventListener("pickAccount",function(event){
                var pickItem=event.detail;			
				currentAcct=iAccountInfoList[pickItem.value].accountNo;
				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
				resetPullRefresh();
        });			
		
		//重新加载
//		window.addEventListener("reload", function(event) {
//			var currentItem = event.detail.currentItem;
//		});

		window.addEventListener("reload", function(event) {
			currentAcct = event.detail.currentAcct;
			resetPullRefresh();
		});
		
		function resetPullRefresh() {
			turnPageBeginPos = 1;
			myInvestmentQuery(currentAcct,1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().refresh(true);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			mui('#pullrefresh').pullRefresh().refresh(true);
			mui('#pullrefresh').pullRefresh().scrollTo(0,0);//跳到列表上端 解决ios不能自动跳到列表上端问题
		}
		
	});
});