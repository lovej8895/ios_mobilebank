define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
    
	mui.init();
	mui.plusReady(function() {
		plus.nativeUI.showWaiting("加载中...");
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();	
		var url = mbank.getApiURL() + 'getUserInfo.do';
		mbank.apiSend('post', url, null, function(data){
			getIntelList();
		}, function(e){},false);
		
		function getIntelList() {
			$("#accountList").empty();
			var url = mbank.getApiURL()+'025011_signList.do';
			mbank.apiSend("post",url,{},successCallback,function(data){
				plus.nativeUI.closeWaiting();
				dealFail(data);
			},true);
			function successCallback(data){
				var intelList=data.intelList;
				for( var i=0;i<intelList.length;i++ ){
					var intel=intelList[i];
					var html="";
					var opName="";
					html+='<ul class="backbox_th m_top10px bg_br2px">';
					html+='<li>';
					html+='<p class="sav_tit"><span>账号</span>'+format.dealAccountHideFour(intel.accountNo)+'</p>';
					html+='</li>';
					html+='<li class="money_box">';
					html+='<p class="pub_li_left m_left10px color_6">签约状态&nbsp;&nbsp;<span class="color_6">'+$.param.getDisplay("SIGN_SUCCESS_FLAG",intel.signFlag)+'</span></p>';
					if (intel.signFlag=="0") {
						html+='<p class="sav_iconbg"><a class="sav_a" accountNo="'+intel.accountNo+'" signFlag="'+intel.signFlag+'"><img src="../../img/icon22.png" /><span>解约</span></a></p>';
					}else if(intel.signFlag=="1"){
						html+='<p class="sav_iconbg"><a class="sav_a" accountNo="'+intel.accountNo+'" signFlag="'+intel.signFlag+'"><img src="../../img/icon22.png" /><span>签约</span></a></p>';
					}
					html+='</li>';
					html+='</ul>';
				    $("#accountList").append(html);
				}
				$("#accountList ul li:last-child a").on("tap",function(){
					var accountNo=$(this).attr("accountNo");
					var signFlag=$(this).attr("signFlag");
					if( "0"==signFlag ){//解约
						mui.confirm("请确定是否解约？","提示",["确认", "取消"], function(e) {
						if (e.index == 0) {
							var param={
								accountNo:accountNo,
								dealCode:"1"
							};
		                    unsign(param);
						} });
					}
					if( "1"==signFlag ){//签约
						var param={
							accountNo:accountNo
						};
						mbank.openWindowByLoad('../savings/intelSignAgreement.html','intelSignAgreement','slide-in-right',param);
					}
				});
				plus.nativeUI.closeWaiting();
			}
		}

        function unsign(param){
        	var url = mbank.getApiURL()+'025011_sign.do';
			mbank.apiSend("post",url,param,successCallback,function(data){
				dealFail(data);
			},true);
			function successCallback(data){
				data.title="智能通知存款解约";
		        mbank.openWindowByLoad('../savings/savingsResult.html','savingsResult','slide-in-right',data);
			}
        }
		
		$("#queryButton").on("tap",function(){
			mbank.openWindowByLoad('../savings/signUnsignQuery.html','signUnsignQuery','slide-in-right');
		});

	    function dealFail(data){
            mui.alert(data.em);
        } 

        window.addEventListener("reload",function(event){
            getIntelList();
        });

	    window.addEventListener("swiperight",function(e){
	    	if (Math.abs(e.detail.angle) < 10) {
		    	plus.webview.getWebviewById("demandFixed").hide();
		    	plus.webview.getWebviewById("notifyDeposit").show();
		    	plus.webview.getWebviewById("intelligentNotifyDeposit").hide();	  
		    	mui.fire(self.parent(),"changeMenu",{pageId:"notifyDeposit"});	    		
	    	}
	    });

	});

});
