define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var turnPageBeginPos=1;
    var turnPageShowNum=25;
    var turnPageTotalNum;
    var retPage=null;
    var payBookType="";
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
			queryBank(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
    }

 	function pullupRefresh() {
		setTimeout(function() {
			var currentNum = $('#bankDiv ul li').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryBank(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    } 

     function queryBank(beginPos){
        //查询开户行
        var url = mbank.getApiURL()+'queryBankNoMsg.do';
        var params={
        	payBookType:payBookType,
        	searchKey:$("#searchKey").val(),
        	turnPageBeginPos:beginPos,
        	turnPageShowNum:turnPageShowNum
        };
	    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
	    function  successCallback(data){
	    	turnPageTotalNum=data.turnPageTotalNum;
    		if( beginPos==1 ){
    			$("#bankDiv ul").empty();
    			if( turnPageTotalNum=='0' ){
                    $("#bankDiv ul").empty().append("<li>没有符合条件的记录</li>");
//                  mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    return;
    			}
    		}	    	
	    	var pmsAndclearBankList=data.pmsAndclearBankList;
	    	if( pmsAndclearBankList.length>0 ){
	    		var html="";
	    		for( var i=0;i<pmsAndclearBankList.length;i++ ){
	    			var bank=pmsAndclearBankList[i];
                    html+='<li clearBankNo="'+bank.clearBankNo+'">'+bank.signBankName+'</li>';
	    		}

	    		$("#bankDiv ul").append(html);
		        $("#bankDiv ul li").on("tap",function(){
		        	var clearBankNo=$(this).attr("clearBankNo");
		        	var signBankName=$(this).html();
					mui.fire(retPage, 'bankInfo', {clearBankNo:clearBankNo,signBankName:signBankName});
					plus.webview.close("hotBank");
					plus.webview.currentWebview().close();
		        });	    		
	    	}else{
	    		if( beginPos==1 ){
	    			$("#bankDiv ul").empty().append("<li>为查询到符合条件的数据</li>");
	    		}
	    	}
	    }
	    function errorCallback(e){
	    	mui.toast("查询开户行失败！");
	    }
    }
  
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		retPage = plus.webview.currentWebview().opener();
		var self=plus.webview.currentWebview();
		if(self.retPageId ){
			retPage=plus.webview.getWebviewById(self.retPageId);
		}
		$("#searchKey").val(self.searchKey);
		payBookType=self.payBookType;
        queryBank(1);
        $("#searchButton").on("tap",function(){
			var searchKey=$("#searchKey").val();
	        queryBank(1);
        });
        
        
          
   });	
});