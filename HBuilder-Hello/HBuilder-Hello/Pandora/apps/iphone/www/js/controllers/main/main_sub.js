define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var bankMenu = require('../../core/bankMenu');
	
	var liArray = [];
	var switchTap=false;
	var menu_bar_bg,menu_bar_up,menu_bar_down;
		menu_bar_bg = doc.querySelector('.spread_bg');
		menu_bar_up = doc.querySelector('.spread_off');
		menu_bar_down = doc.querySelector('.spread_on');
	function initMenu(){
		liArray = [];
		//主页菜单加载 与隐藏显示切换
		var main_menu_ul = doc.querySelector('#main_menu_area ul');
		
		var bankMenuList = bankMenu.getLocalStorgeMenuData('bankMenu')||[{'menuList':[]}];
		var menuList = bankMenuList[0]['menuList'];
		var defaultMenuLi = doc.getElementById('definedMenu').parentNode;
		
		jQuery(defaultMenuLi).siblings().remove();
		
		for (var i = 0; i<menuList.length;i++) {
			var liElem = jQuery('<li><a><span class="short_ico"></span><br/><span></span></a></li>');
			var aElem = liElem.find('a');
			var spanElem = aElem.find('span:first');
			var textElem = aElem.find('span:last');
			var menuObj = menuList[i];
			aElem.attr({
				id:menuObj['id'],
				path:menuObj['path'],
				noCheck:menuObj['nocheck'],
				menucode:menuObj['menucode'],
				menuserno:menuObj['menuserno']
			});
			spanElem.addClass(menuObj['menuclass']+'_home');
			textElem.text(menuObj['menuname']);
			liArray.push(liElem);
			main_menu_ul.insertBefore(liElem[0],defaultMenuLi);
		}
		liArray.push(defaultMenuLi);
		
		//大于四个菜单时，隐藏后面的
		for (var k=0; k<liArray.length;k++) {
			if(k>3){
				jQuery(liArray[k]).css('display','none');
			}else{
				jQuery(liArray[k]).css('display','block');
			}
		}
		
		//菜单总个数大于四个则显示切换隐藏或显示的区域
		if(liArray.length>4){
			menu_bar_bg.style.display = 'block';
			menu_bar_down.style.display = 'block';
			menu_bar_up.style.display = 'none';
//			defaultMenuLi.style.display = 'none';
			if(liArray.length==16){
				jQuery(liArray[liArray.length-1]).find('span').css('backgroundImage','url(../../img/h_ico_more.png)');
			}else{
				jQuery(liArray[liArray.length-1]).find('span').removeAttr('style');
			}
		}else{
			menu_bar_bg.style.display = 'none';
			menu_bar_down.style.display = 'none';
			menu_bar_up.style.display = 'none';
		}
	}
	window.addEventListener('load',initMenu);
	
	mui.init({
		swipeBack: false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		}
	});
	$.plusReady(function() {
		
		setTimeout(function() {
			//关闭 splash
			plus.navigator.closeSplashscreen();
			console.log('close splash.........')
		}, 800);
		plus.screen.lockOrientation("portrait-primary");
		
		window.addEventListener('reloadMenu',function(){
			initMenu();
		});
		
		//公告查询
		var announcementList = [];
		var announceTitle;
		var announceContent;
		var announcementLength;
		var announceId;
		announcementQuery();
	
		
		function announcementQuery(){
			var param = {
				mbUUID : plus.device.uuid,
				liana_notCheckUrl:false
			};
			var url = mbank.getApiURL() + '210201_announcementQuery.do';
			mbank.apiSend("post",url,param,querySuccess,queryError,'ignore');
			
			function querySuccess(data){
				announcementList = data.msgList;
				announcementLength = announcementList.length;
				if(announcementLength>0){
					announceId = announcementList[0].msgId;
					if(announcementList[0].msgTitle.length>12){
						announceTitle = announcementList[0].msgTitle.substr(0,12)+'...';
					}else{
						announceTitle = announcementList[0].msgTitle;
					}
					announceContent = dataReplace(announcementList[0].msgContent);
					jQuery.maskLayer({
						title:announceTitle,
						content:announceContent,
						maskHeightRatio:0.7,
						contentHeightRatio:0.65
					}).showMask();
					changeMsgState(announceId);
				}
				
			}
			
			function queryError(data){
//				nativeUI.toast(data.em);
			}
		}
		
		function changeMsgState(msgId){
			var params = {
				mbUUID : plus.device.uuid,
				msgId : msgId,
				liana_notCheckUrl:false
			};
			var url = mbank.getApiURL() + '210201_updateMessage.do';
			mbank.apiSend("post",url,params,successCallback,errorCallback,'ignore');
			function successCallback(data){

			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
		
		//switch   menu_bar_bg
		
		menu_bar_bg.addEventListener('tap',function(e){
			if(!switchTap){//展开
				switchTap = true;
				menu_bar_down.style.display = 'none';
				menu_bar_up.style.display = 'block';
				for (var k=0; k<liArray.length;k++) {
					
					jQuery(liArray[k]).css('display','block');
					//if(k<4){
						jQuery(liArray[k]).css('borderBottom', '1px #eee solid');
					//}
				}
				//避免展开菜单的时候触发菜单
				this.addEventListener('touchend',function(e){
					e.preventDefault();
				})
			}else{//关闭
				switchTap = false;
				menu_bar_down.style.display = 'block';
				menu_bar_up.style.display = 'none';
				for (var k=0; k<liArray.length;k++) {
					if(k>3){
						jQuery(liArray[k]).css('display','none');
					}else{
						jQuery(liArray[k]).css({
							display:'block',
							borderBottom: 'none'
						});
					}
				}
			}
			
		},true)
		
		
		//消息提醒
		queryNewMessage();
		function queryNewMessage() {
			var dataNumber = {
				mbUUID : plus.device.uuid,
				turnPageBeginPos : 1,
				turnPageShowNum : 1,
				"liana_notCheckUrl":false
			};
			var url = mbank.getApiURL() + '210201_systemMessage.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,'ignore');
			function successCallback(data){
				var msgList = data.msgList;
				if (msgList.length == 0) {
					jQuery("#messagelist").html('');
					return;
				}
				var isNewMessage = msgList[0].msgIsRead;
				if (isNewMessage == '0') {
					jQuery("#messagelist").html('<span class="message_new"></span>');
				} else {
					jQuery("#messagelist").html('');
				}
			}
			function errorCallback(e){}
		}
		//刷新消息提醒
		window.addEventListener("refreshNews", function(event) {
			queryNewMessage();
		});
		
		var state = app.getState();
		var message = document.getElementById("message"); 
		var announcement = document.getElementById("announcement");//公告
		var riskValue = doc.getElementById('risk')
		var nowDate=0;

		var slider1 = mui('.mui-slider');	
		slider1.slider({
			interval: 5000
		});
		window.addEventListener('reflashMainView',function(){
			console.log.log('下拉刷新....');
//			var divH = jQuery("#frameBlock > div > div > div > a > img").height() ;
//			jQuery(loadADHtml(divH,"frameBlockC","frameBlock","main_sub_ad.html"));
		})
		var eventName='tap';
		if(mui.os.android){
			eventName='click';
		}
		
		//解决首页存在苹果手机下拉刷新广告无法点击的现象
		mui("#pullrefresh").on('tap','#frameBlock > div > div > div > a',function(event){//不使用  eventName ，因为 eventName 的话安卓手机会重复进入多次
			console.log.log("首页点击广告");
			this.click();
		})
		
		mui(".short_hiconbox").on(eventName,'span',function(){
			if(!this.className){
				return;
			}
		  //获取id
		  var id = this.parentNode.getAttribute("id");
		  var path=this.parentNode.getAttribute("path");
		  var nocheck=this.parentNode.getAttribute("noCheck")||this.parentNode.getAttribute("nocheck");
		  if(id==""){
		  	mui.toast("功能正在研发中···");
		  	return;
		  }
		  if(id!="question"){
		  	mbank.openWindowByLoad(path,id, "slide-in-right",{nocheck:nocheck});
		  }
		}) ;
		
		//监听iframe事件
		window.addEventListener('message',function(e){
		if(e.data.path&&e.data.pid){
		   if("true"==e.data.noCheck||mbank.checkLogon()){
		   		mbank.openWindowByLoad(e.data.path,e.data.pid,"slide-in-right");
		   	}
		  }else{
	   		mui.toast("正在研发中，敬请期待···");
	  	    return;
		  }
		   	 
          
        },false);

			
		function queryBankInfo(){
       	    var url = mbank.getApiURL() + 'queryNoticeInfo.do';

			mbank.apiSend('post', url, {"liana_notCheckUrl":false}, queryLogBack, function(){}, 'ignore');

			function queryLogBack(d) {
				var tempMesHtml = "";
				var notice=d.iBankNotice;
				var messageFlag = plus.storage.getItem("messageTimeFlag");
				var mTime = plus.storage.getItem("messageTime");
				
				var i;
				for(i=0;i<notice.length;i++){
					if(nowDate<notice[i].messageTime){
						nowDate = notice[i].messageTime;
					}
				}
				if((mTime!=nowDate)&&(messageFlag !=="true")){
					message.innerHTML = notice[0].messageContent;
					show();
				}
			}
       }
		
		//展示公告
		function show(){
			setTimeout(function(){
					jQuery(".pop_bg").css({"height":jQuery(window).height()});
					jQuery(".pop_cont").css({"top":(jQuery(window).height() - jQuery(".pop_cont").height())/2,"left":(jQuery(window).width() - jQuery(".pop_cont").width())/2});
				    jQuery(".pop_bg").fadeIn();
				    jQuery(".pop_cont").fadeIn()
				    jQuery(".pop_cont .close").click(function(){
				    	jQuery(".pop_bg").fadeOut();
				    	jQuery(".pop_cont").fadeOut()
				    });   
				},500)
			plus.storage.setItem("messageTime",nowDate);
			plus.storage.setItem("messageTimeFlag",'true');
		}
		
		function riskAssessmentQuery(){
			var param = {
				CustNo:'P'+localStorage.getItem("session_hostNo"),
				"liana_notCheckUrl":false
			}
			var url = mbank.getApiURL()+'riskAssessmentQuery.do';
		    mbank.apiSend('post',url,param,callBack,errfun,'ignore');
		    function callBack(data){
		    	riskValue.value = data.riskLevel;
		    	if(riskValue.value!=null&&riskValue.value!=''&&riskValue.value!=undefined&&mbank.checkLogon()==true){
						mbank.openWindowByLoad('../question/riskAssFirst.html','riskAssFirst',"slide-in-right",{riskLevel:riskValue.value});
					}else if(mbank.checkLogon()){
						mbank.openWindowByLoad('../question/question.html','question',"slide-in-right");
					}
		    }
		    function errfun(data){
		    	if(data.ec=='1261'){//客户未进行风评或风评已失效
		    		mbank.openWindowByLoad('../question/question.html','question',"slide-in-right");
		    	}else{
		    	mui.console.log(data.ec+":"+data.em)	
		    	}
		    	
		    }
		}
		
		jQuery("#productFr").on("tap",function(){
			var retPage = plus.webview.getLaunchWebview();
			mui.fire(retPage, 'footer', {
				fid: "productList"
			});
			mbank.openWindowByLoad("../productList/productList.html","productList", "slide-in-right",'',{top:0,bottom:'50px'});
		});
		//金融资讯跳转
		jQuery(".col").on("tap", function() {
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			mbank.openWindowByLoad(path,id, "slide-in-right");
		});
		
		
//		doc.getElementById("liveTime").innerText = (new Date()).getMonth()+1+"-"+(new Date()).getDate();
//		affairRemind = doc.getElementById("affairRemind");
//		affairRemind.addEventListener('tap',function(){
//			var path = this.getAttribute("path");
//			var id = this.getAttribute("id");
//			var noCheck = this.getAttribute("noCheck");
//			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
//		});
		
		var fiancingProduct =  document.getElementById("fiancingProduct");
		var iFiancinglist = new Object();
		queryFiancing();
		function queryFiancing(){
			var dataNumber = {
				flag : 3,//热销理财
				turnPageBeginPos: "1",
				turnPageShowNum: "10",
				cstType: "1",
				productType:"0",
				liana_notCheckUrl:false
			};
			//var url = mbank.getApiURL() + '009003_financingbuy_list.do';
			var url = mbank.getApiURL() + 'financingProductQuery.do';
			mbank.apiSend('post',url,dataNumber,successCallback,errorCallback,'ignore');
			function successCallback(data){
				var html = '<div class="backbox_tit_homebg m_top10px"><div class="backbox_tit_homeline"><p class="backbox_tit_homeico"></p><p class="backbox_hometit">热点投资</p></div></div>';
				iFiancinglist = data.iFiancinglist;
				if(iFiancinglist.length!=0){
					for(var i=0;i<iFiancinglist.length;i++){
						var productNo = iFiancinglist[i].productNo;			//产品编号
						var productName = iFiancinglist[i].productName;		//产品名称
						var projDeadLine = iFiancinglist[i].projDeadLine;	//产品期限
						var raiseEndDate = iFiancinglist[i].raiseEndDate;	//募集结束日
						var raiseEndDateShow = format.formatDate(format.parseDate(raiseEndDate, "yyyymmdd"));
						var profitRate = iFiancinglist[i].profitRate;		//预期收益率
						var proRiskLevel = iFiancinglist[i].proRiskLevel;	//产品风险等级
						var proRiskLevelShow = parseRiskLevel(proRiskLevel);
						var originAmt = iFiancinglist[i].originAmt;			//起购金额
						var increaseAmt = iFiancinglist[i].increaseAmt;		//递增金额
						var fiancType = iFiancinglist[i].productType;
						if(i==0){
							html+='<div class="backbox_one" >';
						}else{
							html+='<div class="backbox_one m_top10px" >';
						}
						if(fiancType == '3'){
							html+='<p class="home_banking_bg"></p>';
//							html+='<p class="banking_icon">开放式</p>';
							html+='<p class="fin_tit otext">'+productName+'</p>';
							html+='<ul class="home_banking_box" index=' + i + '>';
							html+='<li>';
							html+='<p class="fz_18" style="margin-top: 5px;margin-bottom: 5px;">'+originAmt+'<span>元</span></p>';
							html+='<p class="fz_12 color_6">起购金额</p>';
							html+='</li>';
							html+='<li style="width: 68%;border-left:none">';
							html+='<p class="fz_28 color_red">'+profitRate+'<span class="fz_16 color_red">%</span></p>';
							html+='<p class="fz_12 color_6">预期年化收益率</p> ';
							html+='</li>';
							html+='</ul>';
						}else{
							html+='<p class="home_banking_bg"></p>';
//							html+='<p class="banking_icon">封闭式</p>';
							html+='<p class="fin_tit otext">'+productName+'</p>';
							html+='<ul class="home_banking_box" index=' + i + '>';
							html+='<li>';
							html+='<p class="fz_18" style="margin-top: 5px;margin-bottom: 5px;">'+originAmt+'<span>元</span></p>';
							html+='<p class="fz_12 color_6">起购金额</p>';
							html+='</li>';
							html+='<li style="width: 36%;">';
							html+='<p class="fz_28 color_red">'+profitRate+'<span class="fz_16 color_red">%</span></p>';
							html+='<p class="fz_12 color_6">预期年化收益率</p> ';
							html+='</li>';
							html+='<li>';
							html+='<p class="fz_18">'+projDeadLine+'<span>天</span></p>';
							html+='<p class="fz_12 color_6">投资期限</p> ';
							html+='</li>';
							html+='</ul>';
						}
						/*html+='<p class="home_banking_bg"></p>';
						html+='<p class="banking_icon">荐</p>';
						html+='<p class="fin_tit">'+productName+'</p>';
						html+='<ul class="home_banking_box" index=' + i + '>';
						html+='<li>';
						html+='<p class="fz_18">'+originAmt+'<span>元</span></p>';
						html+='<p class="fz_12 color_6">起购金额</p>';
						html+='</li>';
						html+='<li style="width: 36%;">';
						html+='<p class="fz_28 color_red">'+profitRate+'<span class="fz_16 color_red">%</span></p>';
						html+='<p class="fz_12 color_6">预期年化收益率</p> ';
						html+='</li>';
						html+='<li>';
						html+='<p class="fz_18">'+projDeadLine+'<span>天</span></p>';
						html+='<p class="fz_12 color_6">投资期限</p> ';
						html+='</li>';
						html+='</ul>';*/
						html+='</div>';
				    	/*html+='<ul class="bg_h113px m_top5px" paramStr=' + paramStr + '>';
				    	html+='<li class="financial" >';
				      	html+='<p class="fin_tit">' + productName + '</p>';
				      	html+='<p class="hot_sell bg_color_y">热销</p>';
				      	html+='<p class="hot_end bg_color_f" style="display: none;">售罄</p>';
				      	html+='<p class="fin_type">' + proRiskLevelShow + '</p>';
				      	html+='<span class="fin_line"></span>';
				      	html+='<a class="link_rbg link_t30px"></a></li>';
				      	html+='<li class="financial_l">';
				      	html+='<span class="color_6">投资期限：</span>';
				      	html+='<span class="color_red">' + projDeadLine + '天</span><br/>';
				      	html+='<span class="color_9">募集结束日期：</span>';
				      	html+='<span class="color_9">' + raiseEndDateShow + '</span></li>';
				      	html+='<li class="financial_r">';
				      	html+='<p class="color_red fz_18">' + profitRate + '%</p>';
				      	html+='<p class="color_6">预期年化收益率</p></li></ul>';*/
					}
				}else{
					fiancingProduct.style.display="none";
				        /*html += '<ul class="bg_h113px m_top5px">'+
	        					'<li class="financial_l">'+
	        					'暂无理财产品'+	
	        					'</li>'+
	        					'</ul>';*/
				}
				fiancingProduct.innerHTML = html;
				jQuery("#fiancingProduct ul").on('tap', function(){
					var i = jQuery(this).attr("index");
					var params = {
						productNo : iFiancinglist[i].productNo,
						productName : iFiancinglist[i].productName,
						projDeadLine : iFiancinglist[i].projDeadLine,
						raiseEndDate : iFiancinglist[i].raiseEndDate,
						profitRate : iFiancinglist[i].profitRate,
						proRiskLevel : iFiancinglist[i].proRiskLevel,
						originAmt : iFiancinglist[i].originAmt,
						increaseAmt : iFiancinglist[i].increaseAmt,
						returnurl : iFiancinglist[i].returnurl,
						productType : iFiancinglist[i].productType,
	    				noCheck : "true"
					};
					if(iFiancinglist[i].productType == '3'){
						mbank.openWindowByLoad('../productList/productDetailOpen.html','productDetailOpen','slide-in-right',params);
					}else{
						mbank.openWindowByLoad('../productList/productDetail.html','productDetail','slide-in-right',params);
					}
				});
			}
			function errorCallback(e){
//		    	mui.alert(e.em);
		    }
		}
		
		var fundProduct =  document.getElementById("fundProduct");
		var ifundlist = [];
		queryFund();
		function queryFund(){
			var param = {
				f_functionPage : "2",
				turnPageBeginPos: "1",
				turnPageShowNum: "10",
				"liana_notCheckUrl":false
			};
			var url = mbank.getApiURL() + 'indexFundList.do';
			mbank.apiSend('post',url,param,successCallback,errorCallback,'ignore');
			function successCallback(data){
				ifundlist = data.f_fundProList;
				var upClass='';
				if(ifundlist.length!=0){
					var html='<div class="backbox_tit_homebg m_top10px"><div class="backbox_tit_homeline"><p class="backbox_tit_homeico"></p><p class="backbox_hometit">热销基金</p></div></div>';
					for(var i = 0; i < ifundlist.length; i++){
						var proType = ifundlist[i].f_prodtype;//基金类型
						var date = format.formatDate(format.parseDate(ifundlist[i].f_navdate, "yyyymmdd"));//净值日期
						var yield = ifundlist[i].f_yield;//七日年化收益
						var rzdf = ifundlist[i].f_rzdf;//月涨跌幅
						var proName = ifundlist[i].f_prodname;//产品名称
						var proCode = ifundlist[i].f_prodcode;//产品代码
						var income = ifundlist[i].f_fundincome;//万份收益
						var navincome = ifundlist[i].f_nav;//最新净值
						
						if(i==0){
							html+= '<ul class="bg_h113px" index=' + i + '>';
						}else{
							html+= '<ul class="bg_h113px m_top10px" index=' + i + '>';
						}
						html+= '<li class="financial" >';
						html+= '<p class="fin_tit2">'+proName+'<span class="color_6 m_left10px">('+proCode+')</span></p>';
						if(proType=='12'||proType=='91'){
							yield = parseFloat(yield).toFixed(2);
							if(yield =="-0.00" ){
								yield = "0.00";
							}
							if(yield >=0){
								upClass = "bankfund_phb_icon fundarrow1";
							}else{
								upClass = "bankfund_phb_icon fundarrow2";
							} 
							html+= '<p class="m_top5px ove_hid m_left15px"><span class="fund_phb_ico2"></span><span class="color_6">'+jQuery.param.getDisplay("FUND_PRODTYPE",proType)+'</span></p>';
							html+= '<a class="link_rbg link_t40px"></a></li>';
							html+= '<li class="financial_l2"><span class="color_6">万份收益</span>&nbsp;&nbsp;<span class="color_red">¥'+parseFloat(income).toFixed(4)+'</span><br/><span class="color_9">'+date+'</span></li>';
							html+= '<li class="financial_rmain">';
							html+= '<p class="color_red fz_28">'+yield+'<span class="fz_15 color_6">%</span></p><p class="color_6">七日年化收益</p>';
						}else{
							rzdf = parseFloat(rzdf).toFixed(2);
							if(rzdf =="-0.00" ){
								rzdf = "0.00";
							}
							if(rzdf >=0){
								upClass = "bankfund_phb_icon fundarrow1";
							}else{
								upClass = "bankfund_phb_icon fundarrow2";
							} 
							html+= '<p class="m_top5px ove_hid m_left15px"><span class="fund_phb_ico2"></span><span class="color_6">'+jQuery.param.getDisplay("FUND_PRODTYPE",proType)+'</span></p>';
						    html+= '<a class="link_rbg link_t40px"></a></li>';
						    html+= '<li class="financial_l2"><span class="color_6">最新净值</span>&nbsp;&nbsp;<span class="color_red">¥'+parseFloat(navincome).toFixed(4)+'</span><br/><span class="color_9">'+date+'</span></li>';
							html+= '<li class="financial_rmain">';
							html+= '<p class="color_red fz_28">';
							html+= '<span class="'+upClass+'"></span>'+rzdf+'<span class="fz_15 color_6">%</span></p><p class="color_6">月涨跌幅</p>';
						}
						html+= '</li>';
						html+= '</ul>';
					}
					fundProduct.innerHTML = html;
				}
				
				jQuery("#fundProduct ul").on('tap', function(){
					var i = jQuery(this).attr("index");
					var prodcode = ifundlist[i].f_prodcode;
					var prodType = ifundlist[i].f_prodtype;
					var tano = ifundlist[i].f_tano;
					var prodName = ifundlist[i].f_prodname;
					if(prodType == "91"){
						params = {
							"noCheck" : "false",
							"f_prodcode" : prodcode,
							"f_prodtype" : prodType,
							"f_tano" : tano,
							"f_prodname" : prodName
						};
						mbank.openWindowByLoad("../fund/cashFundDetail.html","cashFundDetail", "slide-in-right",params);
					}else{
						params = {
							"f_prodcode" : prodcode,
							"f_prodtype" : prodType,
							"f_tano" : tano,
							"f_prodname" : prodName
						};
						mbank.openWindowByLoad("../fund/fundProductDetail.html","fundProductDetail", "slide-in-right",params);
					}
				});
			}
			function errorCallback(data){
//				mui.alert(data.em);
			}
		}
		
		function parseRiskLevel(proRiskLevel) {
			switch (proRiskLevel) {
				case  "01" : return "高风险产品";
				case  "02" : return "较高风险产品";
				case  "03" : return "中等风险产品";
				case  "04" : return "较低风险产品";
				default : return "低风险产品";
			}
		}
		
		//展示热点服务
		var hotShow =  document.getElementById("hotShow");
		queryHotService();
		function queryHotService(){
			var url = mbank.getApiURL() + 'hotServiceQuery.do';
			mbank.apiSend('post',url,{"liana_notCheckUrl":false},successCallback,errorCallback,'ignore');
			function successCallback(data){
				var serviceId = data.serviceId;
				var pictureURL = data.pictureURL;
				var service = data.serviceCode;
				var description = data.description;
				var serviceURL = data.serviceURL;		
				if(serviceId!=null){
					var quicklyFeePay = '';
					var html = '<div class="backbox_tit_homebg m_top10px"><div class="backbox_tit_homeline"><p class="backbox_tit_homeico"></p>'
					+'<p class="backbox_hometit">热点服务</p></div></div><div class="home_hotbg"><div class="home_hot_box">';
					html += '<a id="feePayInput" path="'+serviceURL+'" noCheck="true">';
						quicklyFeePay = 'feePayInput';
					
				/*	if(serviceId=='1'){
						html += '<a id="phoneFeePayInput" path="../feePayment/phoneFeePayInput.html" noCheck="false">';
						quicklyFeePay = 'phoneFeePayInput';
					}else if(serviceId=='2'){
						html += '<a id="telecomFeePayQuery" path="../feePayment/telecomFeePayQuery.html" noCheck="false">';
						quicklyFeePay = 'telecomFeePayQuery';
					}else if(serviceId=='3'){
						html += '<a id="waterFeePayQuery" path="../feePayment/waterFeePayQuery.html" noCheck="false">';
						quicklyFeePay = 'waterFeePayQuery';
					}else if(serviceId=='4'){
						html += '<a id="electricityFeePayQuery" path="../feePayment/electricityFeePayQuery.html" noCheck="false">';
						quicklyFeePay = 'electricityFeePayQuery';
					}else if(serviceId=='5'){
						html += '<a id="chinaGasFeePayQuery" path="../feePayment/chinaGasFeePayQuery.html" noCheck="false">';
						quicklyFeePay = 'chinaGasFeePayQuery';
					}else{
						html += '<a id="etcFeePayQuery" path="../feePayment/etcFeePayQuery.html" noCheck="false">';
						quicklyFeePay = 'etcFeePayQuery';
					}*/
					
					html+='<img src="'+mbank.getRemoteUrl()+pictureURL+'"/>';
//					html+='<p class="help_tit fz_15">'+service+'&nbsp;<span class="color_6">'+description+'</span></p>';
//					html+='<button class="pay_bnt">热点服务</button></a></div></div></div>';
					hotShow.innerHTML = html;
					
					document.getElementById(quicklyFeePay).addEventListener('tap',function(){
						var path = this.getAttribute("path");
						var id = this.getAttribute("id");
						var noCheck = this.getAttribute("noCheck");
						mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
					});
				}else{
					hotShow.style.display="none";
				}
			}
			function errorCallback(e){
//		    	mui.alert(e.em);
		    }
			
		}
		
		//改变头部的透明度
//		mbank.changeOpacityByPullRefresh();
		
		//广告链接跳转
		jumPage=function (str){
				 jumpOrShow(mbank,str);
		}

//		divH = plus.display.resolutionWidth * 326/750 + "px";
//		jQuery("#frameBlock").height(divH);
//		jQuery("#slider").hide();
		jQuery(loadADHtml(false, "frameBlockC", "frameBlock", "main_sub_ad.html",false));
	 
		//登陆成功后重新加载此页面方法
		window.addEventListener("reload",function(event){
			//掉落蛋糕  数量10  速度2
//			jQuery('#cake').fallCake({container:'#main_sub_container',counts:10,fallSpeed:5.8});
//			queryAffair(event.detail.session_customerId);
//			mbank.initAccountInfo();
            queryLatestRecAccount();
            setTimeout(function(){
            	mbank.isExceedCertValid();
            },1000);
		});
		
		//查询事件提醒
		function queryAffair(session_customerId){
			var url = mbank.getApiURL() + 'ebankQueryAffairList.do';
			mbank.apiSend('post', url, {session_customerId:session_customerId}, querySuccess, queryError, 'ignore');
			
			function querySuccess(data){
				allAffairList = data.allAffairList;
				length = allAffairList.length;
				var liveDate = (new Date()).format("yyyymmdd");
				if(length>0){
					for(var i=0;i<length;i++){
						if(allAffairList[i].affairDate>liveDate){
							var loginAffair = doc.getElementById("loginAffair");
							var unLoginAffair = doc.getElementById("unLoginAffair");
							var birth = doc.getElementById("birth");
							var affairTopic = doc.getElementById("affairTopic");
							var affairTime = doc.getElementById("affairTime");
							loginAffair.style.display="block";
							unLoginAffair.style.display="none";
							birth.setAttribute("class","home_lifeico");
							//birth.style.display="none";
							affairTime.innerText = (allAffairList[i].affairDate).substring(4,6)+"-"+(allAffairList[i].affairDate).substring(6,8);
							affairTopic.innerText = allAffairList[i].affairTopic;
							break;
						}
					}
				}else{
					var loginAffair = doc.getElementById("loginAffair");
					var unLoginAffair = doc.getElementById("unLoginAffair");
					var birth = doc.getElementById("birth");
					var affairTopic = doc.getElementById("affairTopic");
					var affairTime = doc.getElementById("affairTime");
					loginAffair.style.display="block";
					unLoginAffair.style.display="none";
					birth.setAttribute("class","home_lifeico");
					affairTime.innerText = "";
					affairTopic.innerText = "无提醒事件";
				}
			}
			
			function queryError(data){
				length = 0;
			}
		}
		
		//安全退出后执行此刷新方法
		window.addEventListener('logOut',function(){
			var loginAffair = doc.getElementById("loginAffair");
			var unLoginAffair = doc.getElementById("unLoginAffair");
			var birth = doc.getElementById("birth");
			loginAffair.style.display="none";
			unLoginAffair.style.display="block";
			birth.style.display="block";
			jQuery("#hasTransfer").hide();
			jQuery("#noTransfer").show();	
		});
		
		//左右上角链接跳转
		mui('body').on('tap', '#upperLeftLinkDiv a', function(event) {
			var id = jQuery(this).attr("id");
			var path = jQuery(this).attr("path");
			var noCheck = jQuery(this).attr("noCheck");
			if(id == "") {
				mui.alert("功能正在研发中···");
				return;
			}
			mbank.openWindowByLoad(path, id, "slide-in-right", { noCheck: noCheck });
		});
		
		window.addEventListener("queryLatestRecAccount",function(event){
            queryLatestRecAccount();			
		});
		//查询最近转账人
        function queryLatestRecAccount(){
			var url = mbank.getApiURL()+'002007_queryLatestRecAccount.do';
	        var nowDate=new Date();
		    var param={
//		    	beginDate:format.formatDate(format.addDay(nowDate,-30))+'000000',
//		    	endDate:format.formatDate(nowDate)+'235959'
		    };
	    	mbank.apiSend("post",url,param,successCallback,errorCallback,'ignore');
	    	function successCallback(data){
		        var iTransferItems=data.iTransferItems;
		        if( iTransferItems.length>0 ){
		        	var length=Math.min(iTransferItems.length,2);
		        	var html="";
		        	for( var i=0;i<length;i++ ){

		        		var tranDetail=iTransferItems[i];
		        		var recAccountOpenBank=tranDetail.recAccountOpenBank;
		        		var recAccountOpenBankName=tranDetail.recAccountOpenBankName;
		        		var transferType=tranDetail.transferType;
		        		if( transferType=="1" || transferType=="3" ){
		        			recAccountOpenBank="";
		        			recAccountOpenBankName="湖北银行";
		        		}
		        		var recAccount=tranDetail.recAccount;
		        		var recAccountName=tranDetail.recAccountName;
                        if( length==1 ){
                            html='<p class="toTransfer" transferType="'+transferType+'" recAccount="'+recAccount+'" recAccountName="'
                                    +recAccountName+'" recAccountOpenBank="'+recAccountOpenBank+'" recAccountOpenBankName="'+recAccountOpenBankName+'">'
								+	'<span class="ht_icon"></span>'
								+	'<a class="fz_17 color_3">'+format.dealAccountHideThree(recAccount)+'<span class="ht_arow"></span></a>'
								+	'<span class="fz_15 color_6">'+dealName(recAccountOpenBankName)+'</span>'
								+	'<span class="color_9">'+dealName(recAccountName)+'</span>'
								+'</p>'
								+'<p>'
								+	'<span class="ht_icon2"></span>'
								+	'<span class="fz_17 color_ddd">8888 *** 8888</span>'
								+	'<span class="fz_15 color_ddd">开户行</span>'
								+	'<span class="color_ddd">账户名</span>'
								+'</p>';
                            
                        }else{
                            html+='<p class="toTransfer" transferType="'+transferType+'" recAccount="'+recAccount+'" recAccountName="'
                                    +recAccountName+'" recAccountOpenBank="'+recAccountOpenBank+'" recAccountOpenBankName="'+recAccountOpenBankName+'">'
								+	'<span class="ht_icon"></span>'
								+	'<a class="fz_17 color_3">'+format.dealAccountHideThree(recAccount)+'<span class="ht_arow"></span></a>'
								+	'<span class="fz_15 color_6">'+dealName(recAccountOpenBankName)+'</span>'
								+	'<span class="color_9">'+dealName(recAccountName)+'</span>'
								+  '</p>';
                        }
	                    	     
		        	}
                    jQuery("#hasTransfer").empty().append(html);
                    
			    	jQuery(".toTransfer").on("tap",function(){
			    		var transferType=jQuery(this).attr("transferType");
			    		var recAccount=jQuery(this).attr("recAccount");
			    		var recAccountName=jQuery(this).attr("recAccountName");
			    		var recAccountOpenBank=jQuery(this).attr("recAccountOpenBank");
			    		var recAccountOpenBankName=jQuery(this).attr("recAccountOpenBankName");
			            if( transferType=="1" || transferType=="3" ){
			            	var param={
			            		recAccount:recAccount,
			            		recAccountName:recAccountName
			            	};
			            	mbank.openWindowByLoad('../transfer/innerTranInput.html','innerTranInput','slide-in-right',param);
			            }
			            if( transferType=="2" ){
			            	var param={
			            		recAccount:recAccount,
			            		recAccountName:recAccountName,
			            		recAccountOpenBank:recAccountOpenBank,
			            		recAccountOpenBankName:recAccountOpenBankName
			            	};
			            	mbank.openWindowByLoad('../transfer/interTranInput.html','interTranInput','slide-in-right',param);
			            }   
			    	});	
			    	jQuery("#hasTransfer").show();
			    	jQuery("#noTransfer").hide();
		        }else{
			    	jQuery("#hasTransfer").hide();
			    	jQuery("#noTransfer").show();		        	
		        }
		    }
	    	function errorCallback(data){
	    		//mui.toast("查询最近转账人失败["+data.em+"]");
		    }
	    	function dealName(name){
	    		if( name!=null && name.length>10 ){
	    			name=name.substring(0,8)+"...";
	    		}
	    		return name;
	    	}
        }
        
		jQuery("#noTransfer").on("tap",function(){
			if( mbank.checkLogon() ){
				mbank.openWindowByLoad("../transfer/transfer.html","transfer",'slide-in-right',{noCheck:false});   
			}
             
		});
		
		//在线客服
		jQuery("#onlineAgent").on("tap",function(){
			if(plus.webview.getWebviewById("onlineAgent")) {
				plus.webview.getWebviewById("onlineAgent").show();
			}else{
				mbank.openWindowByLoad('../main/onlineAgent.html','onlineAgent','slide-in-right');
			}
		});
		
		
		
		//主要针对IOS10系统，第一次打开app无网络访问
		//后续由解决方案可以去掉下面的延时回调。
		window.addEventListener('reloadmainSub',function(){
			setTimeout(function(){
				loadADHtml(false, "frameBlockC", "frameBlock", "main_sub_ad.html",false)
				queryHotService();
				queryFiancing();
				queryNewMessage();
				announcementQuery();
			},100);
		})
		
		function dataReplace(content){
			var flag=true;
			while(flag){
				content=content.replace("|","<br />");
				var index=content.indexOf("|");
				if(index == -1)
				{
			  		flag=false;	
				}
			}
			return content;
		} 
		
	});
});