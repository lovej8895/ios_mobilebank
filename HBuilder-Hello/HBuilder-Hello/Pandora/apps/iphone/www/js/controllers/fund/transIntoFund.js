define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
	var f_deposit_acct = "";
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
		myInvestmentQuery(f_deposit_acct,1);	
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
		    console.log(turnPageBeginPos);
			myInvestmentQuery(f_deposit_acct,turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    } 
    
    mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		plus.nativeUI.showWaiting("加载中...");
		var self=plus.webview.getWebviewById("treasureClassTransQueryDetail");
		f_deposit_acct = self.f_deposit_acct;	//账号
		var f_prodcode =self.f_prodcode;        //产品代码
		var f_tano =self.f_tano;                //TA代码
		myInvestmentQuery=function(f_deposit_acct,turnPageBeginPos){
			var url = mbank.getApiURL()+'300047_treasureTransDetailQuery.do';
			var params = {
				"f_deposit_acct":f_deposit_acct,
				"f_prodcode":f_prodcode,
				"f_tano":f_tano,
				"f_businesscode":"22",
				"f_status" :"1",
				"turnPageBeginPos":turnPageBeginPos,
				"turnPageShowNum":turnPageShowNum
			};
			mbank.apiSend('post', url , params, transferSuccess, transferError, true,false);
			function transferSuccess(data){
					var f_treasureTransDetailQuery = data.f_treasureTransDetailQuery;
					turnPageTotalNum = data.turnPageTotalNum;
					  if( turnPageBeginPos==1 ){
			       	   $("#transTrustQuery").empty();
			       	   if( turnPageTotalNum=='0' ){
			       	       	 $("#transTrustQuery").append('<div class="fail_icon1 suc_top7px"></div>');
			       	       	 $("#transTrustQuery").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
			       	       	 mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
			       	       	 return;
			       	   }
			       }
				var html = "";
				if(f_treasureTransDetailQuery.length>0){
					for(var i=0;i<data.f_treasureTransDetailQuery.length;i++){
						var singleList = data.f_treasureTransDetailQuery[i];
						/*html += '<li><p class="m_left15px fz_16">'+jQuery.param.getDisplay("FUND_BUSNISSCODE",singleList.f_businesscode);
						  	html += '<span class="detail_right"><a class="color_g">'+format.formatMoney(singleList.f_confirmedamount,2)+'</a>元</span></p>';
						  html += '<p class="m_left15px"><span class="color_9">'+format.dataToDate(singleList.f_uptdate)+'</span></p></li>';*/
						  
						html +='<li>';
						html +='<p class="m_left15px"><span class="fz_16">'+jQuery.param.getDisplay("FUND_BUSNISSCODE",singleList.f_businesscode)+'</span><br /><span class="color_9">'+format.dataToDate(singleList.f_uptdate)+'</span></p>';
						html += '<p class="fund_detail_amt"><span class="color_g fz_16">'+format.formatMoney(singleList.f_confirmedamount,2)+'</span><span >元</span></p>';
						html +='</li>';
					}
					
				$("#transTrustQuery").append(html);
				}else{
					$("#transTrustQuery").empty();
					$("#showMsgDiv").empty();
					$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
				    $("#showMsgDiv").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
				    $("#showMsgDiv").show();
		       		$("#pullrefresh").hide();
				    mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
				}
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
		
		myInvestmentQuery(f_deposit_acct,1);	
			 
		window.addEventListener("reload",function(event){
            myInvestmentQuery(f_deposit_acct,1);
        });
		document.getElementById("submit").addEventListener('tap',function(){
			plus.webview.close(plus.webview.getWebviewById("treasureClassTransQueryDetail"));
			plus.webview.close(plus.webview.getWebviewById("transIntoFund"));
		});
		//增加左滑右滑
		 window.addEventListener("swipe",function(e){
	    	var direction=e.detail.direction;
	    	if( direction=="left" ){
	    		if (Math.abs(e.detail.angle) > 170) {
			    	plus.webview.getWebviewById("allPickFund").hide();
			    	plus.webview.getWebviewById("transIntoFund").hide();
			    	plus.webview.getWebviewById("transOutFund").show();	    		
		    		mui.fire(self,"changeMenu",{pageId:"transOutFund"});	    			
	    		}
	    	}
	    	if( direction=="right" ){
	    		if (Math.abs(e.detail.angle) < 10) {
			    	plus.webview.getWebviewById("allPickFund").show();
			    	plus.webview.getWebviewById("transIntoFund").hide();
			    	plus.webview.getWebviewById("transOutFund").hide();	  
		    		mui.fire(self,"changeMenu",{pageId:"allPickFund"});	    			
	    		}
	    	}	    	
	    });

	});

});