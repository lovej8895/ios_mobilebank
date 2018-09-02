define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var turnPageBeginPos=1;
	var turnPageTotalNum=0;
	var turnPageShowNum=10;
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
		setTimeout(function() 
		{
			turnPageBeginPos=1; 
			getMyPrizes(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
    }

 	function pullupRefresh() {
		setTimeout(function() {
			var currentNum = $('.backbox_prize ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			getMyPrizes(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }	
	
    function getMyPrizes(beginPos){
    	var url = mbank.getApiURL()+'getMyPrizes.do';
    	var param={
    		turnPageBeginPos:beginPos,
        	turnPageShowNum:turnPageShowNum
    	};
	    mbank.apiSend("post",url,param,successCallback,errorCallBack,true); 
	    function successCallback(data){
	    	if( beginPos==1 ){
	    		$('.backbox_prize').empty();
	    	}
	    	turnPageTotalNum=data.turnPageTotalNum;
	    	if( turnPageTotalNum=='0' ){
	    		$(".backbox_prize").append('<div class="fail_icon1"></div>');
		       	$(".backbox_prize").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
		       	return;
	    	}
	    	var prizeList=data.prizeList;
	        if( null!=prizeList && prizeList.length>0 ){
	        	var imgPath=mbank.getRemoteUrl()+"lottery/";
	        	for( var i=0;i<prizeList.length;i++ ){
	        		var prize=prizeList[i];
	        		var imgUrl=imgPath+prize.giftURL;
	        		var level=$.param.getDisplay("RAFFLE_LEVEL",prize.raffleLevel);
	        		var html='<ul class="myprizes">'
			                +       '<li class="myprize_pic"><img src="'+imgUrl+'" /></li>'
							+       '<li class="myprize_right">'
							+	       '<p class="shop_name fz_15">'+prize.giftName+'</p>'							
							+	       '<p class="color_9">'+level+'</p>'   
						    +     	'</li>'
		         	        +       '<li class="prize_delete" flowno="'+prize.flowno+'"></li>'
	         	            +'</ul>';
	         	    $('.backbox_prize').append(html);        
	        	}
	        	$('.prize_delete').on('tap',function(){
	        		var flowNo=$(this).attr("flowno");
	                mui.confirm("确认放弃本奖品吗？","提示",["确定", "取消"],function(event){
	                	if(event.index == 0){		
	                	    abandonPrize(flowNo);	
	                	}else{
	                		return false;
	                	}
	                });
	        	});
	        }
	    }
	    function errorCallBack(e){
	    	mui.alert("查询奖品失败！");
	    }
    }	
	
	mui.plusReady(function() {
    getMyPrizes(1);
    

    
    abandonPrize=function(flowno){
    	var url = mbank.getApiURL()+'abandonPrize.do';
    	var param={
            flowno:flowno
    	};
	    mbank.apiSend("post",url,param,successCallback,errorCallBack,true);  
	    function successCallback(data){
	    	getMyPrizes(1);
	    }
	    function errorCallBack(e){
	    	mui.alert(e.em);
	    }
    }
    
          
	});
});