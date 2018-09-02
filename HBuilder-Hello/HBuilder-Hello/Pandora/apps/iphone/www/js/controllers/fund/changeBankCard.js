define(function(require, exports, module) {
	//引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var cst_certNo = localStorage.getItem("session_certNo");//证件号码
	var f_id_code="";
	var turnPageBeginPos="1";			//起始位置
    var turnPageShowNum="10";			//每页数量
    var turnPageTotalNum;				//总记录条数
    var showNum = 0;					//页面显示的记录条数
    var index = 0;						//未显示账号List下标
    var accoutNoList = [];				//账号List
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
			myInvestmentQuery(f_id_code,1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
    }
	
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#transTrustQuery li').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			myInvestmentQuery(cst_certNo,turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    } 
	mui.plusReady(function() {
		//锁定竖屏
		plus.screen.lockOrientation("portrait-primary");
		plus.nativeUI.showWaiting("加载中...");
		var bankCard = $('#transTrustQuery');
		
		myInvestmentQuery=function(f_id_code,turnPageBeginPos){
			var params = {
					f_cust_type:1,
					f_id_code:cst_certNo,
					turnPageBeginPos:turnPageBeginPos,
					turnPageShowNum:turnPageShowNum
			};
			var url = mbank.getApiURL() + 'queryCustSignInfo.do';
			mbank.apiSend('post', url , params, transferSuccess, transferError, false, false);
			function transferSuccess(data){
				var f_iCustSignInfoList = data.f_iCustSignInfoList;//得到返回列表	
				turnPageTotalNum = data.turnPageTotalNum;//得到总记录数
				if( turnPageBeginPos==1 ){
		       	  	$("#transTrustQuery").empty();
		       	  	showNum = 0;
	       	  	 	if( turnPageTotalNum=='0' ){
	       	  	 	 	plus.nativeUI.closeWaiting();//关闭系统等待对话框
						$("#showMsgDiv").empty();
						$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
					    $("#showMsgDiv").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
					    $("#showMsgDiv").show();
			       		$("#pullrefresh").hide();
					    mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
	       	  	 	}	
		        }
				var html ="";
				var isExit = false;//基金账户是否在个人账号列表中存在
				if(f_iCustSignInfoList.length>0){
					for(var i = 0;i<data.f_iCustSignInfoList.length;i++){
						var singleList = data.f_iCustSignInfoList[i];
						isExit = false;
						for(var j = 0;j<iAccountInfoList.length;j++){
							if(singleList.f_deposit_acct == iAccountInfoList[j].accountNo){
								isExit = true;
							}
						}
						//显示出正常的基金签约账号                                                          =5为签约余额宝                        =3为签约基金                           isExit 存在账号列表                 状态=1为 签约                   =3为解约失败 
						if(singleList.f_cust_status == 0 && (singleList.f_open_busin_yeb == 5 || singleList.f_open_busin == 3)&& isExit &&(singleList.f_sign_status ==1 || singleList.f_sign_status ==3)){
							showNum++;
							html += '<li class="changeCard" account="'+singleList.f_deposit_acct+'"><p class="color_6">签约账号</p>';
							html += '<p class="fz_15">'+format.dealAccountHideFour(singleList.f_deposit_acct)+'</p>';
							html += '<div class="content_rbox"><p class="color_6">正常</p><p class="fz_12 color_9">状态</p></div>';
							html += '<a class="link_rbg2"></a></li>'
						}else{
							//隐藏其他的账号，保留li,方便做翻页统计
							html += '<li class="changeCard" style="display:none;"></li>';
						}
					}
					$('#transTrustQuery').append(html);
					var currentNum = $('#transTrustQuery li').length;
					if(showNum == 0){
						if(currentNum < turnPageTotalNum){
							setTimeout(function(){
								turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
								myInvestmentQuery(f_id_code,turnPageBeginPos);
							},2000);
						}else{
							plus.nativeUI.closeWaiting();//关闭系统等待对话框
							$("#transTrustQuery").empty();
							$("#showMsgDiv").empty();
							$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
						    $("#showMsgDiv").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
						    $("#showMsgDiv").show();
				       		$("#pullrefresh").hide();
						    mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
						}
					}else{
						plus.nativeUI.closeWaiting();//关闭系统等待对话框
					}
				}
				
				//添加更改按钮点击事件
				$('.changeCard').on('tap',function(){
					var datavalparam=$(this).attr("account");
					accoutNoList.splice(0, accoutNoList.length);//清空数组
					index = 0;
					for(var j = 0;j<iAccountInfoList.length;j++){
						if(datavalparam != iAccountInfoList[j].accountNo){
							accoutNoList[index] = iAccountInfoList[j];
							index++;
						}
					}
					var  params ={
						accountNo:datavalparam,
						accoutNoList:accoutNoList
					};
					mbank.openWindowByLoad("../fund/changeBankCardSubmit.html","changeBankCardSubmit",'slide-in-right',params); 
				});
			}
			function transferError(data){
				plus.nativeUI.closeWaiting();//关闭系统等待对话框
				$("#transTrustQuery").empty();
				$("#showMsgDiv").empty();
		       	$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
		       	$("#showMsgDiv").append('<p class="fz_15 text_m">' + data.em + ' </p>');
		       	$("#showMsgDiv").show();
		       	$("#pullrefresh").hide();
		       	mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
			}
		}
		
		queryDefaultAcct();
		//获取绑定账号列表
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				var length = iAccountInfoList.length;
				if(length > 0) {
					turnPageBeginPos = 1;
					myInvestmentQuery(f_id_code,1);
				}
			}
		}
		
		//回调函数 刷新账号信息
		window.addEventListener("reload",function(event){
            queryDefaultAcct();
        });
	});
});