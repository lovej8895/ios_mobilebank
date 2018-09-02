define(function(require, exports, module) {
    var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var productType=self.productType;
		$("#productMarket").on("tap",function(){
			if(productType == '3'){
				plus.webview.close("productDetailOpen");
			}else{
				plus.webview.close("productDetail");
			}
			
			plus.webview.close("productBuy");
			plus.webview.close("productBuyConfirm");
			mui.fire(plus.webview.getWebviewById("productMarket"), 'reload', {});
			plus.webview.close(self);
		});
		
		 //查询当前可抽奖的活动
        var activityNo="";
        //console.log(self.payAmount);
        setTimeout(1000);
        getAvailableActivity("3",self.payAmount);
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
        		scopeNo: "3"
        	};
        	mbank.apiSend("post", url, params, querySuccess, queryError, false);
        
        	function querySuccess(data) {
        		lotteryAllNum = data.lotteryAllNum;
        		lotteryNum = data.lotteryNum;
        
        		if(parseInt(lotteryNum) < parseInt(lotteryAllNum)  || lotteryNum=='' || lotteryNum==null) {
        			getScopeTimes(activityNo, "3");
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
				            mbank.openWindowByLoad('../lottery/lottery.html','lottery','slide-in-right',{activityNo:activityNo,scopeNo:"3",noCheck : false});
						});
            }
            function queryError(){
            	
            }
		}
		
		$("#myProductQuery").on("tap",function(){
			var params = {
				bought : "true",
	    		noCheck : false
			}
			mbank.openWindowByLoad('myProductQuery.html','myProductQuery','slide-in-right',params);
		});
		
		var muiBack = mui.back;
			mui.back=function(){
			if(productType == '3'){
				plus.webview.close("productDetailOpen");
			}else{
				plus.webview.close("productDetail");
			}
			plus.webview.close("productBuy");
			plus.webview.close("productBuyConfirm");
			mui.fire(plus.webview.getWebviewById("productMarket"), 'reload', {});
			plus.webview.close(self);
		}
	});

});