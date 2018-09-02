define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
    var turnPageBeginPos=1;
    var turnPageShowNum=20;
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
		setTimeout(function() {
			turnPageBeginPos=1;
			queryCommonPayee(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(false); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
    }

 	function pullupRefresh() {
		setTimeout(function() {
			var currentNum = $('ul li').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryCommonPayee(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>=turnPageTotalNum);
		}, 800);
    } 

     function queryCommonPayee(beginPos){
        //查询常用收款人
        var url = mbank.getApiURL()+'payBookOption.do';
        var params={
 			 payBookDealFlag:"2",
			 searchKey:$("#searchKey").val(),
        	 turnPageBeginPos:turnPageBeginPos,
        	 turnPageShowNum:turnPageShowNum,
			 payBookType:payBookType   	
        };
	    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
	    function  successCallback(data){
	    	turnPageTotalNum=data.turnPageTotalNum;
    		if( beginPos==1 ){
    			$("ul").empty();
    			if( turnPageTotalNum=='0' ){
                    $("ul").empty().append("<li>没有符合条件的记录</li>");
//                  mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    return;
    			}
    		}	    	
	    	var iPayBook=data.iPayBook;
	    	if( iPayBook.length>0 ){
	    		var html="";
	    		for( var i=0;i<iPayBook.length;i++ ){
	    			var payBook=iPayBook[i];
	    			var recAccountOpenBank=payBook.recAccountOpenBank;
	    			var recAccountOpenBankName=payBook.recAccountOpenBankName;
	    			var recAccount=payBook.recAccount;
	    			var recAccountName=payBook.recAccountName;
                    html+='<li recAccountOpenBank="'+recAccountOpenBank+'" recAccountOpenBankName="'+recAccountOpenBankName
                        +'" recAccount="'+recAccount+'" recAccountName="'+recAccountName+'">';
                    html+='<p class="color_6">'+recAccountName+'</p>';
                        if( payBookType=="2" ){
                        	html+='<p class="fz_15">'+recAccountOpenBankName+'&nbsp;&nbsp;'+format.dealAccountHideFour(recAccount)+'</p></li>';
                        } else{
                        	html+='<p class="fz_15">'+format.dealAccountHideFour(recAccount)+'</p></li>';
                        }
	    		}

	    		$("ul").append(html);
		        $("ul li").on("tap",function(){
		        	var recAccountOpenBank=$(this).attr("recAccountOpenBank");
		            var recAccountOpenBankName=$(this).attr("recAccountOpenBankName");
		            var recAccount=$(this).attr("recAccount");
		            var recAccountName=$(this).attr("recAccountName");
		            var param={
		            	recAccountOpenBank:recAccountOpenBank,
		            	recAccountOpenBankName:recAccountOpenBankName,
		            	recAccount:recAccount,
		            	recAccountName:recAccountName
		            };
					mui.fire(retPage, 'selectPayBook', param);
					plus.webview.currentWebview().close();
		        });	    		
	    	}
	    }
	    function errorCallback(data){
	    	mui.alert(data.em);
	    }
    }
  
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		retPage = plus.webview.currentWebview().opener();
		var self=plus.webview.currentWebview();
		payBookType=self.payBookType;
        queryCommonPayee(1);
        
        $("#searchButton").on("tap",function(){
			var searchKey=$("#searchKey").val();
	        queryCommonPayee(1);
        });
          
   });	
});