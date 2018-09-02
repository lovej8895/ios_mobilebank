define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	
	var iAccountInfoList = [];
	var accountNoTemp;
	mui.init();//预加载
	mui.plusReady(function(){
				plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		/*var isAlive = localStorage.getItem("session_customerId");
		//如果客户登录显示信用卡账户信息，则不显示信用卡片账户信息
		if(isAlive){
			queryCreditCardAccount();
		}
		//获取用户信用卡列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"6");//6：信用卡
			function allCardBack(data){
				var length = data.length;
				if (length > 0) {
					iAccountInfoList = data;
					getCreditCarNo(iAccountInfoList);
				}	
			}
		}
		
		//查询信用卡可用额度
		function getCreditCarNo(iAccountInfoList){
			var account ="";
			//mui.alert("length :" +iAccountInfoList.length);
			for (var i=0;i<iAccountInfoList.length;i++) {
				account = iAccountInfoList[i];
				//mui.alert("account :" +account.accountNo);
				var url = mbank.getApiURL() + '007104_limitQuery.do';
				mbank.apiSend('post', url, {cardNo:account.accountNo}, callBack, null, false);
				function callBack(data){
					if (data!='') {
						var tempMesHtml ="";
						tempMesHtml += '<div class="swiper-slide" data-history="slide'+i+'">';
						tempMesHtml += '<div class="card_mbox">';
						tempMesHtml += '<img src="../../img/card_bg1.png"/>';
						tempMesHtml += '<p class="card_tit">'+data.cardNo+'</p>';
						tempMesHtml += '<a class="card_arrow" href="javascript:void(0);" onclick=showLimit("'+data.cardNo+'")></a>';
						tempMesHtml += '<p class="card_type1 color_6">可用额度</p>';
						tempMesHtml += '<p class="card_money1 color_red">¥'+format.formatMoney(data.AvblLimit)+'</p>';
						tempMesHtml += '<p class="card_type2 color_6">信用额度</p>';
						tempMesHtml += '<p class="card_money2">¥'+format.formatMoney(data.CreditLimit)+'</p>';
						tempMesHtml += '</div>';
						tempMesHtml += '</div>';
						
						$("#slidList").append(tempMesHtml);
					}
				}	
			}
		}*/
		
		showLimit = function(carnoparam){
			var param ={
				cardNo:carnoparam,
				noCheck:true
			};
			mbank.openWindowByLoad('limitManager.html','limitManager','slide-in-right',param);
		}
		
		//账单管理
		var billManager = document.getElementById("billManager");
		billManager.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		//额度管理
		var limitManager = document.getElementById("limitManager");
		limitManager.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		//积分管理
		var pointQuery = document.getElementById("pointQuery");
		pointQuery.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		
		//申办与激活
		var creditCardActivation_Input = document.getElementById("applicationAndActivation");
		creditCardActivation_Input.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		
		//本行还款
		var thisInitiativeRefundMenuInfo = document.getElementById("thisInitiativeRefundMenuInfo");
		thisInitiativeRefundMenuInfo.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		//分期信贷
		var installmentCreditMenuInfo = document.getElementById("installmentCreditMenuInfo");
		installmentCreditMenuInfo.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		//支付管理
		var thirdPayMenuInfo = document.getElementById("thirdPayMenuInfo");
		thirdPayMenuInfo.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		
		var slider1 = mui('.mui-slider');	
		slider1.slider({
			interval: 5000
		});
		
		//广告链接跳转
		jumPage=function (str){
				 jumpOrShow(mbank,str);
		}
		var nwaiting = plus.nativeUI.showWaiting();
		jQuery(getAD());
		
		function getAD(){
 		  	loadADHtml(divH,"frameBlockC","frameBlock","ad_credit_card.html",nwaiting);
			var url = mbank.getApiURL()+'adStateQuery.do';
			mbank.apiSend("post",url,{flag:'9',"liana_notCheckUrl": false},stateQuerySuccess,null,true); 
			
			function stateQuerySuccess(data){
				//noteState 2代表开启状态 若开启则对广告显示
				if(data.noteState=='2'){
					$('#adlist').show();
					var ranmdomNmu = Math.random();
					jQuery("#ADlist").load(jQuery.param.getReMoteUrl("REMOTE_URL_ADDR")+"/perbank/mbank/html/ad_credit_card_list.html?t="+ ranmdomNmu) 
				} 
			}
			
			
		} 	
//		jQuery(window).scroll(function(){
//			if(jQuery(document).scrollTop() >= jQuery(document).height() - jQuery(window).height()){
//					if(loadFlag){
//						jQuery("#ADlist").fadeOut(600) ;
//						setTimeout(getAD,500);
//						loadFlag = false;
//					}
//			}
//		})
	});
});