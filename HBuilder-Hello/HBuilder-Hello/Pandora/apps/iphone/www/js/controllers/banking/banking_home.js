define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');

	var count = 0;
	m.init();
	
	m.plusReady(function() {
		plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
		plus.screen.lockOrientation("portrait-primary");
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
		
		var fiancingProduct =  document.getElementById("fiancingProduct");
		var iFiancinglist = new Object();
		queryFiancing();
		function queryFiancing(){
			var dataNumber = {
				flag : 2,//精选理财
				turnPageBeginPos: "1",
				turnPageShowNum: "10",
				cstType: "1",
				productType:"0",
				"liana_notCheckUrl":false
			};
			//var url = mbank.getApiURL() + '009003_financingbuy_list.do';
			var url = mbank.getApiURL() + 'financingProductQuery.do';
			mbank.apiSend('post',url,dataNumber,successCallback,errorCallback,'ignore');
			function successCallback(data){
				var html = '';
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
						var productEndDate= format.formatDate(format.parseDate(iFiancinglist[i].productEndDate,"yyyymmdd"));
						if(fiancType =='3'){
							html+='<ul class="bg_h113px m_top10px" index=' + i + '>';
					    	html+='<li class="financial" >';
					      	html+='<p class="fin_tit otext">' + productName + '</p>';
					      	html+='<p class="hot_sell bg_color_y" style="width: 60px;">开放式</p>';
					      	html+='<p class="hot_end bg_color_f" style="display: none;">售罄</p>';
					      	html+='<p class="fin_type">' + proRiskLevelShow + '</p>';
					      	html+='<span class="fin_line"></span>';
					      	html+='<a class="link_rbg link_t30px"></a></li>';
					      	html+='<li class="financial_l">';
					      	html+='<span class="color_6">投资期限：</span>';
					      	html+='<span class="color_red">无固定</span><br/>';
					      	html+='<span class="color_9">产品到期日：</span>';
					      	html+='<span class="color_9">' + productEndDate + '</span></li>';
					      	html+='<li class="financial_r">';
					      	html+='<p class="color_red fz_18">' + profitRate + '%</p>';
					      	html+='<p class="color_6">预期年化收益率</p></li></ul>';
						}else{
							html+='<ul class="bg_h113px m_top10px" index=' + i + '>';
					    	html+='<li class="financial" >';
					      	html+='<p class="fin_tit otext">' + productName + '</p>';
					      	html+='<p class="hot_sell bg_color_y" style="width: 60px;">封闭式</p>';
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
					      	html+='<p class="color_6">预期年化收益率</p></li></ul>';
						}
						
				    	/*html+='<ul class="bg_h113px m_top10px" index=' + i + '>';
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
					html+='<div class="bank_waiting_pic2">';
					html+='<img src="../../img/waiting_pic1.png" style="margin-top: 10%;"/>';
					html+='</div>';
				}
				//jQuery("#fiancingProduct").addClass("mui-scroll-wrapper");
				//jQuery("#fundProduct").addClass("mui-scroll-wrapper");
				fiancingProduct.innerHTML = html;
				$("#fiancingProduct ul").on('tap', function(){
					var i = $(this).attr("index");
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
				f_functionPage : "0",
				turnPageBeginPos: "1",
				turnPageShowNum: "10",
				"liana_notCheckUrl":false
			};
			var url = mbank.getApiURL() + 'indexFundList.do';
			mbank.apiSend('post',url,param,successCallback,errorCallback,'ignore');
			function successCallback(data){
				ifundlist = data.f_fundProList;
				var html='';
				var upClass='';
				if(ifundlist.length!=0){
					for(var i = 0; i < ifundlist.length; i++){
						var proType = ifundlist[i].f_prodtype;//基金类型
						var date = format.formatDate(format.parseDate(ifundlist[i].f_navdate, "yyyymmdd"));//净值日期
						var yield = ifundlist[i].f_yield;//七日年化收益
						var rzdf = ifundlist[i].f_rzdf;//月涨跌幅
						var proName = ifundlist[i].f_prodname;//产品名称
						var proCode = ifundlist[i].f_prodcode;//产品代码
						var income = ifundlist[i].f_fundincome;//万份收益
						var navincome = ifundlist[i].f_nav;//最新净值
						
						html+= '<ul class="bg_h113px m_top10px" index=' + i + '>';
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
				}else{
					html+='<div class="bank_waiting_pic2">';
					html+='<img src="../../img/waiting_pic1.png" style="margin-top: 10%;"/>';
					html+='</div>';
				}
				
				fundProduct.innerHTML = html;
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
		
		doc.getElementById("fiancingPoint").style.visibility="visible";
		doc.getElementById("fundPoint").style.visibility="hidden";
		//doc.getElementById("fiancingProduct").style.display="block";
		//doc.getElementById("fundProduct").style.display="none";
		doc.getElementById("fiancingProduct").style.display="block";
		doc.getElementById("fundProduct").style.display="none";
		//理财基金间切换
		var fiancing = doc.getElementById("fiancing");
		var fund = doc.getElementById("fund");
		
		//理财基金滑动切换
		document.getElementById('sliderBox').addEventListener('slide', function(e) {
					if (e.detail.slideNumber === 1) {
						jQuery("#fiancing").addClass("color_9");
						jQuery("#fund").removeClass("color_9");
						doc.getElementById("fundPoint").style.visibility="visible";
						doc.getElementById("fiancingPoint").style.visibility="hidden";
						doc.getElementById("fundProduct").style.display="block";
						doc.getElementById("fiancingProduct").style.display="none";
					}else{
						jQuery("#fund").addClass("color_9");
						jQuery("#fiancing").removeClass("color_9");
						doc.getElementById("fiancingPoint").style.visibility="visible";
						doc.getElementById("fundPoint").style.visibility="hidden";
						doc.getElementById("fiancingProduct").style.display="block";
						doc.getElementById("fundProduct").style.display="none";
					}
				});
				
		//基金
		var fundHome = doc.getElementById("fundHome");
		fundHome.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		
		//投资理财
		var productMarket = doc.getElementById("productMarket");
		productMarket.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		
		//信用卡
		var creditCarHome = document.getElementById("creditCarHome");
		creditCarHome.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		})
		
		
		$(".mui-slider-item li").on("tap",function(){
			var id=$(this).attr("id");
			var path=$(this).attr("path");
			var noCheck=$(this).attr("noCheck");
            mbank.openWindowByLoad(path,id,'slide-in-right',{noCheck:noCheck}); 
		});
//		$("#clientHome").on('tap',function(){
//			var path = this.getAttribute("path");
//			var id = this.getAttribute("id");
//			var noCheck = this.getAttribute("noCheck");
//			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
//		});
//		$("#transfer").on('tap',function(){
//			var path = this.getAttribute("path");
//			var id = this.getAttribute("id");
//			var noCheck = this.getAttribute("noCheck");
//			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
//		});
//		$("#mySavings").on('tap',function(){
//			var path = this.getAttribute("path");
//			var id = this.getAttribute("id");
//			var noCheck = this.getAttribute("noCheck");
//			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
//		});
		
//		//无卡取款
//		var drawWithoutCard = doc.getElementById("drawWithoutCard");
//		drawWithoutCard.addEventListener('tap',function(){
//			//mui.alert("111");
//			var path = this.getAttribute("path");
//			var id = this.getAttribute("id");
//			var noCheck = this.getAttribute("noCheck");
//			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
//		});
//		
		/*var slider1 = mui('.mui-slider');	
		slider1.slider({
			interval: 5000
		});	*/
		/*var ws = null;
		var wc = null;
		
		ws = plus.webview.currentWebview();
		ws.addEventListener("maskClick",function(){
			wc.close("slide-out-right");
		},false);
		doc.getElementById("test").addEventListener('tap',showSide);	
		function showSide(){		
			// 防止快速点击可能导致多次创建
			if(wc){
				return;
			}
			// 开启遮罩
			ws.setStyle({mask:"rgba(0,0,0,0.5)"});
			// 创建侧滑页面
			wc=plus.webview.create("myRight.html","myRight",{left:"20%",width:"80%",popGesture:"none"});
			plus.webview.hide(wc);
			// 侧滑页面关闭后关闭遮罩
			wc.addEventListener('close',function(){
				ws.setStyle({mask:"none"});
				wc=null;
			},false);
			// 侧滑页面加载后显示（避免白屏）
			wc.addEventListener("loaded",function(){
				//wc.show("slide-in-right",200);
				plus.webview.show(wc,"slide-in-right",200);
			},false);
		}*/
		
		
		//广告链接跳转
		jumPage=function (str){
				 jumpOrShow(mbank,str);
		}
			loadADHtml(divH,"frameBlockC","frameBlock","ad_financial.html",false);
			var backButtonPress = 0;
		m.back = function(event) {
			backButtonPress++;
			if (backButtonPress > 1) {
				userInfo.removeItem("sessionId");
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};
		
		//根据查询的抽奖活动关联业务设置右上角图标
		queryScope();
		function queryScope(){
			var scopeUrl = mbank.getApiURL() + 'getAvailabelScope.do'; 
			mbank.apiSend("post",scopeUrl,{"liana_notCheckUrl": false},successCallback,errorCallback,'ignore');
			function successCallback(data){
				var scopeList = data.scopeList;
				for(var i=0;i<scopeList.length;i++){
					var scope = scopeList[i];
					if(scope.scopeNo=='1'){
						jQuery("#transferSpan").addClass('jicon jtop5');
					}else if(scope.scopeNo=='2'){
						jQuery("#fundSpan").addClass('jicon jtop5');
					}else if(scope.scopeNo=='3'){
						jQuery("#productSpan").addClass('jicon jtop');
					}
				}
			}
			function errorCallback(e){}
		}
		
		//右上角跳转
		doc.getElementById("messagelist").addEventListener('tap',function(){
			var id=$(this).attr("id");
			var path=$(this).attr("path");
			var noCheck=$(this).attr("noCheck");
            mbank.openWindowByLoad(path,id,'slide-in-right',{noCheck:noCheck}); 
		});
	});
});