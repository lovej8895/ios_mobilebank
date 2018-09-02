define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

	mui.init();//预加载
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();		
		var f_deposit_acct = self.f_deposit_acct; //交易账号									
		var f_tano = self.f_tano;  //TA代码		
		var f_prodcode = self.f_prodcode; //产品代码
		var f_prodname = self.f_prodname;//产品名称
		var buyAmount = self.f_applicationamount;//购买金额
		var f_inc_begin_date = self.f_inc_begin_date;//开始计算收益日期
		var f_inc_arrive_date = self.f_inc_arrive_date;//收益到账日期
		$("#resultDes").html("您已成功转入"+format.formatMoney(buyAmount)+"元到"+f_prodname);
		$("#beginDate").html(format.dataToDate(f_inc_begin_date));//格式化日期，把YYYYMMDD转换YYYY-MM-DD
		$("#endDate").html(format.dataToDate(f_inc_arrive_date));//格式化日期，把YYYYMMDD转换YYYY-MM-DD
		//跳转已持仓基金
		mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshTotalFund', {});
		mui.fire(plus.webview.getWebviewById("cashFundDetail"), 'refreshCashFundDetail', {});
		$("#checkFund").click(function(){
			var params = {
				"noCheck" : "false"
			};
			mbank.openWindowByLoad('../fund/myFund.html','myFund','slide-in-right',params);
			setTimeout(function(){
				plus.webview.close(plus.webview.getWebviewById("cashTransferInto"));
				plus.webview.close(plus.webview.getWebviewById("cashTransferIntoConfirm"));
				plus.webview.hide(self);
			},1000);
		});
		
		 //查询当前可抽奖的活动
        var activityNo="";
       // console.log("111111");
        //console.log("buyAmount:"+buyAmount);
        setTimeout(1000);
        getAvailableActivity("2",buyAmount);
        function getAvailableActivity(tranCode,tranAmt){
        	var url = mbank.getApiURL()+'getAvailableActivity.do';
        	mbank.apiSend("post",url,{tranCode:tranCode,tranAmt:tranAmt},successCallback,errorCallBack,true); 
        	function successCallback(data){
        		//console.log("2222222222");
        		//console.log("activityNo:"+data.activityNo);
                if( data.activityNo!=null && data.activityNo!="" ){
                	activityNo=data.activityNo;
                	queryAvaliableTimes();
                }
        	}
        	function errorCallBack(e){
        		
        	}
        }		
        var lotteryAllNum; //总次数
        var lotteryNum; //以抽奖次数
        function queryAvaliableTimes() {
        	var url = mbank.getApiURL() + 'queryAvaliableTimes.do';
        	var params = {
        		activityNo: activityNo,
        		scopeNo: "2"
        	};
        	mbank.apiSend("post", url, params, querySuccess, queryError, false);
        
        	function querySuccess(data) {
        		lotteryAllNum = data.lotteryAllNum;
        		lotteryNum = data.lotteryNum;
        		
        		if(parseInt(lotteryNum) < parseInt(lotteryAllNum) || lotteryNum=='' || lotteryNum==null) {
        			getScopeTimes(activityNo, "2");
        		}
        
        	}
        
        	function queryError(e) {
        
        	}
        }
		function getScopeTimes(lotteryNo,scopeNo){
			var scopeUrl = mbank.getApiURL()+'getScopeTimes.do';
            mbank.apiSend("post",scopeUrl,{activityNo:activityNo,scopeNo:"2"},querySuccess,queryError,true); 
            function querySuccess(data){
            	var scopeNum = data.scopeNum;
            	if(parseInt(lotteryAllNum) - parseInt(lotteryNum) < parseInt(scopeNum)) {
            		scopeNum = parseInt(lotteryAllNum) - parseInt(lotteryNum);
            	}
            	var popElement=document.createElement("div");
			        	jQuery("html,body").animate({scrollTop:0},500);
			        	popElement.className="pickernew_bg";
			        	var html='<div class="pd_divpic">'
								+    '<div style="width: 100%; padding-bottom: 45%;"></div>'
								+    '<p class="pd_divtit"></p>'
								+    '<p class="pd_divname" style="padding-bottom:15px ">您获得'+scopeNum+'次抽奖机会，快去碰碰运气吧</p>'
								+    '<button class="pd_divbtn"  id="lottery">确&nbsp;&nbsp;定</button>&nbsp;&nbsp;<button class="pd_divbtn"  id="cancel">取&nbsp;&nbsp;消</button>'
							    +'</div>';
						popElement.innerHTML=html;
						popElement.addEventListener(mui.EVENT_MOVE, mui.preventDefault);
						document.body.appendChild(popElement);
						$("#cancel").on("tap",function(){
							lottery.prize=-1;
					        lottery.times=0;		        
					        lottery.click=false;
							if( popElement ){
								popElement.parentNode.removeChild(popElement);
								popElement=null;
							}
						});
						$("#lottery").on("tap",function(){
				            mbank.openWindowByLoad('../lottery/lottery.html','lottery','slide-in-right',{activityNo:activityNo,scopeNo:"2",noCheck : false});
						});
            }
            function queryError(){
            	
            }
		}
		//返回
		$("#backBtn").click(function(){
			plus.webview.close(plus.webview.getWebviewById("cashTransferInto"));
			plus.webview.close(plus.webview.getWebviewById("cashTransferIntoConfirm"));
			plus.webview.close(self);
		});
		
		mui.back = function(){
			plus.webview.close(plus.webview.getWebviewById("cashTransferInto"));
			plus.webview.close(plus.webview.getWebviewById("cashTransferIntoConfirm"));
			plus.webview.close(self);			
		}
		
		
		//查询广告是否为开启状态
		var url = mbank.getApiURL()+'adStateQuery.do';
		mbank.apiSend("post",url,{flag:'7'},stateQuerySuccess,null,true); 
		
		function stateQuerySuccess(data){
			//noteState 2代表开启状态 若开启则对广告显示
			if(data.noteState=='2'){
				var ranmdomNmu = Math.random();
		        $("#banner").load($.param.getReMoteUrl("REMOTE_URL_ADDR")+"/perbank/mbank/html/ad_fund_result.html?t="+ ranmdomNmu);
				$("#banner").show();
			}
		}
		
		//广告
		/*var ranmdomNmu = Math.random();
        $("#banner").load($.param.getReMoteUrl("REMOTE_URL_ADDR")+"/perbank/mbank/html/ad_fund_result.html?t="+ ranmdomNmu);
		$("#banner").show();*/
		jumPage=function (str){
			jumpOrShow(mbank,str);
		}
	});
});