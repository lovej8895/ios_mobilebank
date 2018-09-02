define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

	mui.init();//预加载
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();		
		var f_deposit_acct = self.f_deposit_acct; //交易账号									
		var f_prodname = self.f_prodname;	 //产品名称			
		var f_dividend = self.f_dividend;	//分红方式
		var f_tano = self.f_tano;  //TA代码		
		var f_prodcode = self.f_prodcode; //产品代码
		var f_app_date = self.f_app_date;//币种
		var buyAmount = self.f_applicationamount;//购买金额
		var f_status = self.f_status;//产品状态
		var fianceManagerCode = self.fianceManagerCode;//理财经理代码
		var f_status = self.f_status;//产品状态
		var f_closeTip = self.f_closeTip;//收市标志
		console.log("buyAmount:"+buyAmount);
		if(f_status == "1"){
			$("#fundType").html("基金认购");
		}else if(f_status == "0" || f_status == "2" || f_status == "3" ||f_status == "6"){
			$("#fundType").html("基金申购");
		}
		$("#accountNo").html(format.dealAccountHideFour(f_deposit_acct));
		$("#prodName").html(f_prodname+"("+f_prodcode+")");
		$("#buyAmount").html(format.formatMoney(buyAmount)+"元");
		$("#applyDate").html(format.dataToDate(f_app_date));
		if(f_closeTip=='0'){
//			$("#resulConfirm").html("您的交易委托已接受！");
			$("#resultDes").html("您的交易委托已接受！该交易成功与否以基金公司确认结果为准，您可于T+2(T日为工作日）起查询确认结果。");
		}else{
//			$("#resulConfirm").html("现在为非交易时间，您提交的交易申请将于下一基金交易日处理，请保持账户余额充足。");
			$("#resultDes").html("现在为非交易时间，您提交的交易申请将于下一基金交易日处理，请保持账户余额充足。该交易成功与否以基金公司确认结果为准，您可于T+2（T日为工作日）起查询确认结果。");
		}
//		$("#resultDate").html(format.dataToDate(self.f_ta_ack_date));
//		$("#applyToCompany").html(format.dataToDate(f_app_date));//格式化日期，把YYYYMMDD转换YYYY-MM-DD
//		$("#resultDate2").html(format.formatDate(format.addDay(new Date(self.f_ta_ack_date.replace(/^(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3")),1)));//格式化日期，把YYYYMMDD转换YYYY-MM-DD
		//返回
		mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshTotalFund', {});
		mui.fire(plus.webview.getWebviewById("myHoldFundDetail"), 'refreshMyHoldFundDetail', {});
		$("#checkFund").click(function(){
			var params = {
				noCheck : false
			};
			mbank.openWindowByLoad('../fund/myFund.html','myFund','slide-in-right',params);
			setTimeout(function(){
				plus.webview.close(plus.webview.getWebviewById("fundBuy"));
				plus.webview.close(plus.webview.getWebviewById("fundBuyConfirm"));
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
        
        		if(parseInt(lotteryNum) < parseInt(lotteryAllNum)  || lotteryNum=='' || lotteryNum==null) {
        			getScopeTimes(activityNo, "2");
        		}
        
        	}
        
        	function queryError(e) {
        
        	}
        }
		function getScopeTimes(lotteryNo,scopeNo){
			var scopeUrl = mbank.getApiURL()+'getScopeTimes.do';
            mbank.apiSend("post",scopeUrl,{activityNo:activityNo,scopeNo:scopeNo},querySuccess,queryError,true); 
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
			plus.webview.close(plus.webview.getWebviewById("fundBuy"));
			plus.webview.close(plus.webview.getWebviewById("fundBuyConfirm"));
			plus.webview.close(self);
		});
		
		mui.back = function(){
			plus.webview.close(plus.webview.getWebviewById("fundBuy"));
			plus.webview.close(plus.webview.getWebviewById("fundBuyConfirm"));
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