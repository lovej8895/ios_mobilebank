define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var nativeUI = require('../../core/nativeUI');
	mui.init();
	mui.plusReady(function() {
		var scopeNum = 0;
		var lotteryNum = 0;
		var flag = false;//是否可继续抽奖
		var lastLotteryDate;//上次抽奖日期
		var sysDate;//系统日期
		var self = plus.webview.currentWebview();
		var activityNo = self.activityNo;
		plus.screen.lockOrientation("portrait-primary");
		var scopeNo = self.scopeNo;
		var lottery={
		    index:0,    //当前转动到哪个位置，起点位置
		    count:8,    //总共有多少个位置
		    timer:0,    //setTimeout的ID，用clearTimeout清除
		    speed:20,    //初始转动速度
		    times:0,    //转动次数
		    cycle:50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
		    prize:-1,    //中奖位置
		    result:0,    //中奖等级，0表示未中奖
		    click:false, //防重复点击标志
		    activityNo:"",
		    init:function(){

		    },
		    roll:function(){
		        var index = this.index;
		        var count = this.count;
		        var lottery = this.obj;
		        $("#prize"+index).find(".pd_flash").hide();
		        index += 1;
		        if (index>count) {
		            index = 0;
		        };
		        $("#prize"+index).find(".pd_flash").show();
		        this.index=index;
		        return false;
		    },
		    stop:function(index){
		        this.prize=index;
		        return false;
		    }
		};
		
		queryScope();
		function queryScope(){
			var scopeUrl = mbank.getApiURL() + 'getAvailabelScope.do'; 
			mbank.apiSend("post",scopeUrl,null,successCallback,errorCallback,false);
			function successCallback(data){
				//mui.alert("1111");
				var scopeList = data.scopeList;
				for(var i=0;i<scopeList.length;i++){
					var scope = scopeList[i];
					if(scope.scopeNo==scopeNo){
						scopeNum = scope.scopeNum;
						//mui.alert("scopeNum:"+scopeNum);
					}
				}
			}
			function errorCallback(e){}
		
		
		}
		
		queryAvaliableTimes();
		function queryAvaliableTimes(){
			var url = mbank.getApiURL() + 'queryAvaliableTimes.do'; 
			var params ={
				activityNo : activityNo,
				scopeNo : scopeNo
			};
			mbank.apiSend("post",url,params,querySuccess,queryError,false);
			function querySuccess(data){
				var lotteryAllNum = data.lotteryAllNum;
				var lotteryNum = data.lotteryNum;
				sysDate = data.sysDate.substr(0,8);
				lastLotteryDate = data.lastLotteryDate;
				if(parseInt(lotteryNum)<parseInt(lotteryAllNum)){
					flag = true;
				}
			}
			function queryError(e){
				
			}
		}
		
		
		function roll(){
		    lottery.times += 1;
		    lottery.roll();//转动过程调用的是lottery的roll方法，这里是第一次调用初始化
		    if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
		        clearTimeout(lottery.timer);
		        showPrize();
		    }else{
		        if (lottery.times<lottery.cycle) {
		            lottery.speed -= 10;
		        }else if(lottery.times==lottery.cycle) {
		        	if( lottery.result!="0" ){//中奖了
			            for( var i=0;i<indexArray.length;i++ ){
			            	if( indexArray[i]==lottery.result ){
			            		lottery.prize =i+1;   
			            		break;
			            	}
			            }		        		
		        	}else{
		        		while(true){
				            var pIndex = parseInt(Math.random() * lottery.count);
				            if( indexArray[pIndex]==0 ){
				            	lottery.prize=pIndex+1;
				            	
				            	break;
				            } 	        			
		        		}
		        		
		        	}
		                 
		        }else{
		            if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
		                lottery.speed += 110;
		            }else{
		                lottery.speed += 20;
		            }
		        }
		        if (lottery.speed<40) {
		            lottery.speed=40;
		        };
		        lottery.timer = setTimeout(roll,lottery.speed);//循环调用
		    }
		    return false;
		}
		 
        $(".btn_start").on("tap",function(){
        	if( lastLotteryDate == sysDate.substr(0,8) ){
        		if(!flag){
	        		mui.alert("当天抽奖次数已达上限，下次再来哟！");
	        		return false;
	        	}
        	}
    	
        	if(lotteryNum>=scopeNum){
        		mui.alert("抽奖次数已达上限，下次再来哟！");
        	}else{
        		 if (lottery.click || lottery.activityNo=="") {
		            return false;
		        }else{
		        	var url = mbank.getApiURL()+'lottery.do';
		        	mbank.apiSend("post",url,{activityNo:lottery.activityNo,scopeNo:scopeNo},successCallback,errorCallback,true);
		        	function successCallback(data){
			        	lottery.speed=100;
			        	lottery.result=data.lotteryResult;
			        	lottery.click=true;
			            roll();   
			            lotteryNum ++;
			           	
 		        		 
			            
		        	}
		        	function errorCallback(e){
		        		mui.alert(e.em);
		        	}  
		        } 
        	}
        	
        	
	            	
        }); 
		//获奖等级 0：没有中奖    1-8：一等至八等将
		var indexArray = new Array(0, 0, 0, 0, 0, 0, 0, 0);
		var indexMap={};
        var imgPath=mbank.getRemoteUrl()+"lottery/";
        
        lottery.activityNo=self.activityNo;
        if( lottery.activityNo!=null && lottery.activityNo!="" ){
        	    queryActivityInfo(lottery.activityNo);
        		queryRuleAndGift(lottery.activityNo);
        }
        //查询活动信息
        function queryActivityInfo(activityNo){
        	var url = mbank.getApiURL()+'getActivityByNo.do';
			mbank.apiSend("post",url,{activityNo:activityNo},successCallback,errorCallBack,true);   
			function successCallback(data){
				if(data.beginTime!=null && data.endTime!=null){
					var beginTime=data.beginTime.substring(4,6)+"月"+data.beginTime.substring(6,8)+"日";
					var endTime=data.endTime.substring(4,6)+"月"+data.endTime.substring(6,8)+"日";
					$("#activityTime").html("活动时间："+beginTime+"-"+endTime);
				}
				//mui.alert(data.desc);
				$("#content").html(data.desc);

			}
			function errorCallBack(e){
				mui.alert(e.em);
			}
		}	
        //查询活动规则与奖品
        function queryRuleAndGift(activityNo){
            var url = mbank.getApiURL()+'getRuleAndGift.do';
            var param={
            	activityNo:activityNo  	
            };
			mbank.apiSend("post",url,param,function(data){
				//mui.alert("11111111:");
			    var sweepstakeList=data.prizeLevelList;	
			    //mui.alert("length:"+sweepstakeList.length);
			    if( null!=sweepstakeList && sweepstakeList.length>0 ){
			    	initRuleAndGift(sweepstakeList);
			    }
			},function(data){
				mui.alert(data.em);
			},true);	
			
			function initRuleAndGift(sweepstakeList){
				for( var i=0;i<sweepstakeList.length;i++ ){
					var flag = true;
					var imgIndex = 0;
					while(flag){
						imgIndex = parseInt(Math.random() * 8);
						if( !indexMap[imgIndex] ){
							flag=false;
						}
					}
					var sweepstake=sweepstakeList[i];
					indexMap[imgIndex]=sweepstake;
					indexArray[imgIndex]=sweepstake.raffleLevel;
					//mui.alert("111:"+imgPath+sweepstake.giftURL);
					$("#prize"+(imgIndex+1)).find(".pd_prizes").find("img").attr("src",imgPath+sweepstake.giftURL+"?time="+new Date());
					$(".priceImg").css("height",91.2+'px');
					$(".priceImg").css("width",91.2+'px');
					//$("#prize"+(imgIndex+1)).find(".pd_prizes").find(".levelName").html($.param.getDisplay("RAFFLE_LEVEL",sweepstake.raffleLevel));
					//$("#prize"+(imgIndex+1)).find(".pd_prizes").find(".prizeName").html(sweepstake.giftName);
					$("#prize"+(imgIndex+1)).find(".pd_prizes").show();
					$("#prize"+(imgIndex+1)).find(".prizes_word").hide();
					$("#prize"+(imgIndex+1)).removeClass("prize_bg_g").removeClass("prize_bg_y").removeClass("prize_bg_b");
					var p='<p class="pd_gzcontent">'+$.param.getDisplay("RAFFLE_LEVEL",sweepstake.raffleLevel)+':'+sweepstake.giftName+'</p>';
					//$("#lottery").append(p);
				}
			}
        }
        
        function showPrize(){
        	if( lottery.result=="0" ){
        		lottery.prize=-1;
		        lottery.times=0;		        
		        lottery.click=false;
        		  mui.alert("真遗憾，没抽中，再来一次！");
        	}else{
	        	var sweepstake=indexMap[lottery.prize-1];
	        	var popElement=document.createElement("div");
	        	jQuery("html,body").animate({scrollTop:0},500);
	        	popElement.className="pickernew_bg";
	        	var html='<div class="pd_divpic">'
						+    '<div style="width: 100%; padding-bottom: 45%;"></div>'
						+    '<p class="pd_divtit">恭喜您获得'+$.param.getDisplay("RAFFLE_LEVEL",sweepstake.raffleLevel)+'</p>'
						+    '<p class="pd_divname">'+sweepstake.giftName+sweepstake.rfbit+sweepstake.giftUnit+'</p>'
						+    '<button class="pd_divbtn"  id="conButton">确&nbsp;&nbsp;定</button>'
					    +'</div>';
				popElement.innerHTML=html;
				popElement.addEventListener(mui.EVENT_MOVE, mui.preventDefault);
				document.body.appendChild(popElement);
				$("#conButton").on("tap",function(){
					lottery.prize=-1;
			        lottery.times=0;		        
			        lottery.click=false;
					if( popElement ){
						popElement.parentNode.removeChild(popElement);
						popElement=null;
					}
				});
	        }
        }
        
        $('#myPrizes').on("tap",function(){
        	mbank.openWindowByLoad('../lottery/myPrizes.html','myPrizes','slide-in-right',{noCheck : "false"});
        });
        
        mui.back=function(){
        	var destView;
        	if(scopeNo=='1'){
        		destView = plus.webview.getWebviewById("transfer");
        		/*plus.webview.close("innerTranConfirm");
				plus.webview.close("sameTranConfirm");
				plus.webview.close("interTranConfirm");
				plus.webview.close("mobileTranConfirm");
				plus.webview.close("transferResult");*/
        	}else if(scopeNo=='2'){
        		/*plus.webview.close(plus.webview.getWebviewById("fundBuy"));
				plus.webview.close(plus.webview.getWebviewById("fundBuyConfirm"));
				plus.webview.close(plus.webview.getWebviewById("fundBuyResult"));*/
				destView = plus.webview.getWebviewById("fundHome");
        	}else if(scopeNo=='3'){
        		/*plus.webview.close(plus.webview.getWebviewById("productBuyResult"));
        		plus.webview.close(plus.webview.getWebviewById("productBuyConfirm"));
        		plus.webview.close(plus.webview.getWebviewById("productBuy"));*/
        		destView = plus.webview.getWebviewById("productMarket");
        	}
        	if(destView == null){
        		destView = plus.webview.getWebviewById("main");
        	}
        	destView.show();
        	mui.closeOpened(destView);
        }
        
	});
});