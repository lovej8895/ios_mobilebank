define(function(require, exports, module) {
    var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		/*console.log(self.scheduleFlag+"+++++");*/
		var openner = plus.webview.currentWebview().opener();
		if( self.orderState=="50" ){
			$("#em").html("状态可疑！");	
			$("#resultDiv").removeClass("success_icon1");
			$("#resultDiv").addClass("warn_icon1");
		}
		var title=self.title;
		if( title ){
			$(".mui-title").html(title);
		}
		if( openner.id=="interTranConfirm" ){
			//查询广告是否为开启状态
			var url = mbank.getApiURL()+'adStateQuery.do';
			mbank.apiSend("post",url,{flag:'6'},stateQuerySuccess,null,true); 
			
			function stateQuerySuccess(data){
				//noteState 2代表开启状态 若开启则对广告显示
				if(data.noteState=='2'){
					var ranmdomNmu = Math.random();
		            $("#banner").load($.param.getReMoteUrl("REMOTE_URL_ADDR")+"/perbank/mbank/html/ad_transfer_result.html?t="+ ranmdomNmu);
					$("#banner").show();
				}
			}
			
		}
		//刷新最近转账人记录
		mui.fire(plus.webview.getWebviewById("transfer_sub"),"queryLatestRecAccount",{});
		mui.fire(plus.webview.getWebviewById("main_sub"),"queryLatestRecAccount",{});
		
		$("#queryTranDetail").on("tap",function(){			
			plus.webview.close("innerTranInput");
			plus.webview.close("innerTranConfirm");
			plus.webview.close("interTranInput");
			plus.webview.close("interTranConfirm");
			plus.webview.close("sameTranInput");
			plus.webview.close("sameTranConfirm");	
			plus.webview.close("mobileTranInput");
			plus.webview.close("mobileTranConfirm");				
			var param={
				noCheck:false,
				payAccount:self.payAccount
			};
			mbank.openWindowByLoad("../transfer/transferDetail.html","transferDetail", "slide-in-right",param);
		
		});
		
		$("#continueTransfer").on("tap",function(){
			if( openner.id=="innerTranConfirm" ){
				plus.webview.close("innerTranConfirm");	
				mui.fire(plus.webview.getWebviewById("innerTranInput"),"reload",{});
			}
			if( openner.id=="interTranConfirm" ){
				plus.webview.close("interTranConfirm");	
				mui.fire(plus.webview.getWebviewById("interTranInput"),"reload",{});
			}	
			if( openner.id=="sameTranConfirm" ){
				plus.webview.close("sameTranConfirm");	
				mui.fire(plus.webview.getWebviewById("sameTranInput"),"reload",{});
			}	
			if( openner.id=="mobileTranConfirm" ){
				plus.webview.close("mobileTranConfirm");
				mui.fire(plus.webview.getWebviewById("mobileTranInput"),"reload",{});
			}	
			
			plus.webview.close(self);
		});
		
		//广告链接跳转
		jumPage=function (str){
				 jumpOrShow(mbank,str);
		}
        //查询当前可抽奖的活动
        var activityNo="";
        setTimeout(1000);
        //console.log(self.scheduleFlag+"++++");
        if(self.scheduleFlag!=1){
        	getAvailableActivity("1",self.payAmount);
        }
        
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
        
        var lotteryAllNum;//总次数
        var lotteryNum;//以抽奖次数
		function queryAvaliableTimes(){
			var url = mbank.getApiURL() + 'queryAvaliableTimes.do'; 
			var params ={
				activityNo : activityNo,
				scopeNo : "1"
			};
			mbank.apiSend("post",url,params,querySuccess,queryError,false);
			function querySuccess(data){
				lotteryAllNum = data.lotteryAllNum;
				lotteryNum = data.lotteryNum;
				
				if(parseInt(lotteryNum)<parseInt(lotteryAllNum) || lotteryNum=='' || lotteryNum==null){
					getScopeTimes(activityNo,"1");
				}
				
			}
			function queryError(e){
				
			}
		}
		function getScopeTimes(lotteryNo,scopeNo){
			var scopeUrl = mbank.getApiURL()+'getScopeTimes.do';
            mbank.apiSend("post",scopeUrl,{activityNo:activityNo,scopeNo:scopeNo},querySuccess,queryError,true); 
            function querySuccess(data){
            	var scopeNum = data.scopeNum;
            	if( parseInt(lotteryAllNum)-parseInt(lotteryNum) < parseInt(scopeNum) ){
            		scopeNum = parseInt(lotteryAllNum)-parseInt(lotteryNum);
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
							if( popElement ){
								popElement.parentNode.removeChild(popElement);
								popElement=null;
							}
				            mbank.openWindowByLoad('../lottery/lottery.html','lottery','slide-in-right',{activityNo:activityNo,scopeNo:"1",noCheck : false});
						});
            }
            function queryError(){
            	
            }
		}
		
		
		//重写返回方法
		mui.back=function(){
			plus.webview.close("innerTranConfirm");
			plus.webview.close("sameTranConfirm");
			plus.webview.close("interTranConfirm");
			plus.webview.close("mobileTranConfirm");
			plus.webview.close(self.id);
		}
	});

});