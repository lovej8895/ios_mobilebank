define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

    var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    var currentAcct="";
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
        getIntelList(currentAcct,1);
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
		}, 800);
    }

 	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#subAccountList ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			getIntelList(currentAcct,turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    } 


	mui.plusReady(function() {
		plus.nativeUI.showWaiting("加载中...");
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();		
        currentAcct=self.accountNo;


		getIntelList=function(accountNo,turnPageBeginPos){
			var url = mbank.getApiURL()+'025011_intelList.do';
			var param={
				accountNo:accountNo,
				beginDate:format.ignoreChar(self.beginDate,"-"),
				endDate:format.ignoreChar(self.endDate,"-"),
				turnPageBeginPos:turnPageBeginPos,
				turnPageShowNum:turnPageShowNum	
			}
			mbank.apiSend("post",url,param,successCallback,errorCallback,true);
	    	function successCallback(data){
		       var intelList=data.intelList;
		       turnPageTotalNum=data.turnPageTotalNum;
		       if( turnPageBeginPos==1 ){
		       	   $("#intelList").empty();
		       }
		       var	html="";
		       if( intelList.length>0 ){
		           for( var i=0;i<intelList.length;i++ ){
		           	    var intel=intelList[i]; 
						html+='<ul class="bg_h113px m_top5px bg_br2px" style="height:90px;">'
							    +	'<li>'
							    +	    '<p class="sav_tit"><span>账号</span>'+format.dealAccountHideFour(intel.accountNo)+'</p>'
								+   '</li>'
								+   '<li class="money_box">'
							    +	    '<p class="pub_li_left m_left10px">签约状态&nbsp;&nbsp;'+$.param.getDisplay("INTEL_SIGN_FLAG",intel.signFlag)+'</p>';
							    if( intel.signFlag=="0" ){
							        html+='<p class="pub_li_right m_left10px">签约日期&nbsp;&nbsp;'+format.dataToDate(intel.signDate)+'</p>';							    	
							    }else{
							    	html+='<p class="pub_li_right m_left10px">解约日期&nbsp;&nbsp;'+format.dataToDate(intel.noSignDate)+'</p>';
							    }
							    
						   html+=   '</li>'			
							    +'</ul>';								
		           }
		           $("#intelList").append(html);	
	
		           plus.nativeUI.closeWaiting();
		       }
		    }
	    	function errorCallback(data){
		    	plus.nativeUI.closeWaiting();
		    	if( "RC49"==data.ec ){
		    		 $("#intelList").empty();
		       	     $("#intelList").append('<div class="fail_icon1 suc_top7px"></div>');
		       	     $("#intelList").append('<p class="fz_15 text_m">没有符合条件的记录</p>');		    		 
		    	}else{
		    		mui.alert(data.em);
		    	}
		    } 			
		}


		getIntelList(currentAcct,1);

	});

});
