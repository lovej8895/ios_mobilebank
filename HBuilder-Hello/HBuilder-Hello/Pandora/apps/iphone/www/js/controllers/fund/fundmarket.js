define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum1=0;//全部
	var turnPageTotalNum2=0;//宝类
	var turnPageTotalNum3=0;//可定投
	var turnPageTotalNum4=0;//股票型
	var turnPageTotalNum5=0;//债券型
	var turnPageTotalNum6=0;//混合
	var turnPageTotalNum7=0;//货币
	var turnPageTotalNum8=0;//指数
	var turnPageTotalNum9=0;//QDII
	var turnPageTotalNum10=0;//LOF

    var tempupdownflag;//排序标志
    var menuflag;//菜单标志；
    var totalNum1=0;
    var totalNum2=0;
    var totalNum3=0;
    var pullrefreshId ='#pullrefresh1';//默认全部选项卡下拉刷新
    var detailsList = '#item1DetailList ul';
    var freshflag='0';//标志
	
	/**基金名称、最新净值、月涨跌幅当前选中的排序标志start;默认降序，根据页面选择更换升降序标志*/
	var setupdflag1 = "31";
	var setupdflag2 = "21";
	var setupdflag3 = "31";
	var setupdflag4 = "31";
	var setupdflag5 = "31";
	var setupdflag6 = "31";
	var setupdflag7 = "21";
	var setupdflag8 = "31";
	var setupdflag9 = "31";
	var setupdflag10 = "31";
	/**基金名称、最新净值、月涨跌幅当前选中的排序标志end;默认降序，根据页面选择更换升降序标志*/
	var sendInterface1 ="0";
	var sendInterface2 ="0";
	var sendInterface3 ="0";
	var sendInterface4 ="0";
	var sendInterface5 ="0";
	var sendInterface6 ="0";
	var sendInterface7 ="0";
	var sendInterface8 ="0";
	var sendInterface9 ="0";
	var sendInterface10 ="0";
	//预加载
	mui.init();
	/**paramtype:产品类型；paramupdown：升降序标志;pagebegin：页码；
	 * f_cust_type:客户类型1：个人;
	 * liana_notCheckUrl:false 免登录;
	 * turnPageShowNum 显示记录数;
	 * */
	initQueryAllProdInfo = function(paramtype,paramupdown,pagebegin,menuflag){
		var params = {
			f_cust_type:"1",
			f_prodtype:paramtype,
			f_updownflag:paramupdown,
			turnPageBeginPos:pagebegin,
			turnPageShowNum:turnPageShowNum,
			liana_notCheckUrl:false
		};
		var url = mbank.getApiURL() + 'fund_ProductSearchNew.do';
		mbank.apiSend("post",url,params,successCallback,null,false);
		function successCallback(data){
			var tempMesHtml ="";
			var dataVal ="";
			getTurnTotalNum(data,menuflag);//获取当前总记录数
			//加载清空列表	
			if (pagebegin == '1') {
				clearThisList(menuflag);
			}
			
			for (var i = 0; i < data.f_fundProList2.length; i++) {
				var currObj = data.f_fundProList2[i];
				//产品代码+产品名称+产品类型+TA代码
				dataVal = currObj.f_prodcode+"&"+currObj.f_prodname+"&"+currObj.f_prodtype+"&"+currObj.f_tano;
				
				tempMesHtml +='<ul class="fundmarket_tabcont" prodInfoVal="'+dataVal+'">';
				tempMesHtml += '<li class="fundmarket_tableft"><p>'+currObj.f_prodname+'</p><p class="color_6 fz_15">'+currObj.f_prodcode+'</p></li>';
				if (menuflag == '2' || menuflag == '7') {//2宝类7货币
					tempMesHtml += '<li class="fundmarket_tabm_l"><p>'+parseFloat(currObj.f_fundincome).toFixed(4)+'</p><p class="color_9">'+format.formatDate(format.parseDate(currObj.f_navdate, "yyyymmdd"))+'</p></li>';
					tempMesHtml += '<li class="fundmarket_tabright"><p class="color_red fz_16 m_top5px">'+formatyzdf(currObj.f_yield)+'%</p></li>';
				} else{
					tempMesHtml += '<li class="fundmarket_tabm_l"><p>'+parseFloat(currObj.f_nav).toFixed(4)+'</p><p class="color_9">'+format.formatDate(format.parseDate(currObj.f_navdate, "yyyymmdd"))+'</p></li>';
					tempMesHtml += '<li class="fundmarket_tabright"><p class="color_red fz_16 m_top5px">'+formatyzdf(currObj.f_rzdf)+'%</p></li>';
				}
				tempMesHtml +='</ul>';
			}
			if (menuflag == '1') {
				$("#item1DetailList").append(tempMesHtml);
			}else if(menuflag == '2'){
				$("#item2DetailList").append(tempMesHtml);
			}else if(menuflag == '3'){
				$("#item3DetailList").append(tempMesHtml);
			}else if(menuflag == '4'){
				$("#item4DetailList").append(tempMesHtml);
			}else if(menuflag == '5'){
				$("#item5DetailList").append(tempMesHtml);
			}else if(menuflag == '6'){
				$("#item6DetailList").append(tempMesHtml);
			}else if(menuflag == '7'){
				$("#item7DetailList").append(tempMesHtml);
			}else if(menuflag == '8'){
				$("#item8DetailList").append(tempMesHtml);
			}else if(menuflag == '9'){
				$("#item9DetailList").append(tempMesHtml);
			}else if(menuflag == '10'){
				$("#item10DetailList").append(tempMesHtml);
			}//else if(menuflag == '11'){
				//$("#item11DetailList").append(tempMesHtml);
			//}
			plus.nativeUI.closeWaiting();
			
			//点击产品区域跳转到产品详情
			$("#item1DetailList ul").off().on("tap",function(){
				var prodInfoVal = $(this).attr("prodInfoVal");
				//判断产品类型，根据类型跳转到相应页面（余额宝：91）
				toFundProductDetails(prodInfoVal);				
			});
			$("#item2DetailList ul").off().on("tap",function(){
				var prodInfoVal = $(this).attr("prodInfoVal");
				//判断产品类型，根据类型跳转到相应页面（余额宝：91）
				toFundProductDetails(prodInfoVal);				
			});
			$("#item3DetailList ul").off().on("tap",function(){
				var prodInfoVal = $(this).attr("prodInfoVal");
				//判断产品类型，根据类型跳转到相应页面（余额宝：91）
				toFundProductDetails(prodInfoVal);				
			});
			$("#item4DetailList ul").off().on("tap",function(){
				var prodInfoVal = $(this).attr("prodInfoVal");
				//判断产品类型，根据类型跳转到相应页面（余额宝：91）
				toFundProductDetails(prodInfoVal);				
			});
			$("#item5DetailList ul").off().on("tap",function(){
				var prodInfoVal = $(this).attr("prodInfoVal");
				//判断产品类型，根据类型跳转到相应页面（余额宝：91）
				toFundProductDetails(prodInfoVal);				
			});
			$("#item6DetailList ul").off().on("tap",function(){
				var prodInfoVal = $(this).attr("prodInfoVal");
				//判断产品类型，根据类型跳转到相应页面（余额宝：91）
				toFundProductDetails(prodInfoVal);				
			});
			$("#item7DetailList ul").off().on("tap",function(){
				var prodInfoVal = $(this).attr("prodInfoVal");
				//判断产品类型，根据类型跳转到相应页面（余额宝：91）
				toFundProductDetails(prodInfoVal);				
			});
			$("#item8DetailList ul").off().on("tap",function(){
				var prodInfoVal = $(this).attr("prodInfoVal");
				//判断产品类型，根据类型跳转到相应页面（余额宝：91）
				toFundProductDetails(prodInfoVal);				
			});
			$("#item9DetailList ul").off().on("tap",function(){
				var prodInfoVal = $(this).attr("prodInfoVal");
				//判断产品类型，根据类型跳转到相应页面（余额宝：91）
				toFundProductDetails(prodInfoVal);				
			});
			$("#item10DetailList ul").off().on("tap",function(){
				var prodInfoVal = $(this).attr("prodInfoVal");
				//判断产品类型，根据类型跳转到相应页面（余额宝：91）
				toFundProductDetails(prodInfoVal);			
			});
		}
	}
	
	
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式	
		plus.nativeUI.showWaiting("加载中...");
		//初始化
		initPageView();
		
		document.getElementById('slider').addEventListener('slide', function(e) {
			if (e.detail.slideNumber === 0) {
				//mui.alert("全部");
				pullrefreshId ='#pullrefresh1';
				detailsList ='#item1DetailList ul';
				freshflag ='0';
			}else if (e.detail.slideNumber === 1) {
				//mui.alert("宝类");
				if (sendInterface2 == "0") {
					plus.nativeUI.showWaiting("加载中...");
					initQueryAllProdInfo(91,21,1,2);
					sendInterface2 ="1";
				}
				pullrefreshId ='#pullrefresh2';
				detailsList ='#item2DetailList ul';
				freshflag ='1';
			} else if (e.detail.slideNumber === 2) {
				//mui.alert("可定投");
				if (sendInterface3 == "0") {
					plus.nativeUI.showWaiting("加载中...");
					initQueryAllProdInfo(99,31,1,3);
					sendInterface3 ="1";
				}
				pullrefreshId ='#pullrefresh3';
				detailsList ='#item3DetailList ul';
				freshflag ='2';
			}else if (e.detail.slideNumber === 3) {
				//mui.alert("股票型");
				if (sendInterface4 == "0") {
					plus.nativeUI.showWaiting("加载中...");
					initQueryAllProdInfo(11,31,1,4);
					sendInterface4 ="1";
				}
				pullrefreshId ='#pullrefresh4';
				detailsList ='#item4DetailList ul';
				freshflag ='3';
			}else if (e.detail.slideNumber === 4) {
				//mui.alert("债券型");
				if (sendInterface5 == "0") {
					plus.nativeUI.showWaiting("加载中...");
					initQueryAllProdInfo(14,31,1,5);
					sendInterface5 ="1";
				}
				pullrefreshId ='#pullrefresh5';
				detailsList ='#item5DetailList ul';
				freshflag ='4';
			}else if (e.detail.slideNumber === 5) {
				//mui.alert("混合");
				if (sendInterface6 == "0") {
					plus.nativeUI.showWaiting("加载中...");
					initQueryAllProdInfo(17,31,1,6);
					sendInterface6 ="1";
				}
				pullrefreshId ='#pullrefresh6';
				detailsList ='#item6DetailList ul';
				freshflag ='5';
			}else if (e.detail.slideNumber === 6) {
				//mui.alert("货币");
				if (sendInterface7 == "0") {
					plus.nativeUI.showWaiting("加载中...");
					initQueryAllProdInfo(12,21,1,7);
					sendInterface7 ="1";
				}
				pullrefreshId ='#pullrefresh7';
				detailsList ='#item7DetailList ul';
				freshflag ='6';
			}else if (e.detail.slideNumber === 7) {
				//mui.alert("指数");
				if (sendInterface8 == "0") {
					plus.nativeUI.showWaiting("加载中...");
					initQueryAllProdInfo(15,31,1,8);
					sendInterface8 ="1";
				}
				pullrefreshId ='#pullrefresh8';
				detailsList ='#item8DetailList ul';
				freshflag ='7';
			}else if (e.detail.slideNumber === 8) {
				//mui.alert("QDII");
				if (sendInterface9 == "0") {
					plus.nativeUI.showWaiting("加载中...");
					initQueryAllProdInfo(16,31,1,9);
					sendInterface9 ="1";
				}
				pullrefreshId ='#pullrefresh9';
				detailsList ='#item9DetailList ul';
				freshflag ='8';
			}else if (e.detail.slideNumber === 9) {
				//mui.alert("LOF");
				if (sendInterface10 == "0") {
					plus.nativeUI.showWaiting("加载中...");
					initQueryAllProdInfo(22,31,1,10);
					sendInterface10 ="1";
				}
				pullrefreshId ='#pullrefresh10';
				detailsList ='#item10DetailList ul';
				freshflag ='9';
			}
		});
		
		//格式化月涨跌幅
		formatyzdf = function(yzdfval){
			var showfloat;
			if (yzdfval!=null && yzdfval!="") {
				showfloat = parseFloat(yzdfval).toFixed(2);
				if (showfloat == '-0.00') {
					return showfloat ='0.00';
				}else{
					return showfloat;
				}
			}
			return;
		}
		
		//清空当前列表
		clearThisList = function(itemval){
			//console.log("itemval----------> :"+itemval);
			/**
			 * 1:全部；2：宝类；3：可定投；4：股票型；5：债券型；6：混合；7：货币；8：指数；9：QDII；10：LOF；11：组合
			 */
			switch (itemval){
				case 1:
					$("#item1DetailList").empty();
					break;
				case 2:
					$("#item2DetailList").empty();
					break;
				case 3:
					$("#item3DetailList").empty();
					break;
				case 4:
					$("#item4DetailList").empty();
					break;
				case 5:
					$("#item5DetailList").empty();
					break;
				case 6:
					$("#item6DetailList").empty();
					break;
				case 7:
					$("#item7DetailList").empty();
					break;
				case 8:
					$("#item8DetailList").empty();
					break;
				case 9:
					$("#item9DetailList").empty();
					break;
				case 10:
					$("#item10DetailList").empty();
					break;
				//case "11":
					//$("#item11DetailList").empty();
			}
		}
		
		/********************全部start**********************/
		document.getElementById("nameUpdownFlag1").addEventListener('tap',function(){
			var tempvalue1=1;
			var tempClicks;
			tempClicks = getClicks(tempvalue1);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag1 ="01";
				changeUpDownStyle1("nav1class","rzdf1class");
				//改变当前的升降序图标样式
				$("#name1class").removeClass("tabarrow_no");
				$("#name1class").removeClass("tabarrow_down");
				$("#name1class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo("","01",1,1);
			} else{
				setupdflag1 ="00";
				changeUpDownStyle1("nav1class","rzdf1class");
				//改变当前的升降序图标样式
				$("#name1class").removeClass("tabarrow_top");
				$("#name1class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo("","00",1,1);
				
			}	
		},true);
		document.getElementById("navUpdownFlag1").addEventListener('tap',function(){
			var tempvalue2=2;
			var tempClicks;
			tempClicks = getClicks(tempvalue2);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag1 ="11";
				changeUpDownStyle2("name1class","rzdf1class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav1class").removeClass("tabarrow_no");
				$("#nav1class").removeClass("tabarrow_down");
				$("#nav1class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo("","11",1,1);
			} else{
				setupdflag1 ="10";
				changeUpDownStyle2("name1class","rzdf1class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav1class").removeClass("tabarrow_top");
				$("#nav1class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo("","10",1,1);
			}
		},true);
		document.getElementById("rzdfUpdownFlag1").addEventListener('tap',function(){
			var tempvalue3=3;
			var tempClicks;
			tempClicks = getClicks(tempvalue3);//获取点击次数
			if (tempClicks == '1') {
				setupdflag1 ="30";
				changeUpDownStyle3("name1class","nav1class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf1class").removeClass("tabarrow_top");
				$("#rzdf1class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo("","30",1,1);
			} else{
				setupdflag1 ="31";
				changeUpDownStyle3("name1class","nav1class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf1class").removeClass("tabarrow_no");
				$("#rzdf1class").removeClass("tabarrow_down");
				$("#rzdf1class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo("","31",1,1);
			}
		},true);
		/********************全部end**********************/
		/********************宝类start**********************/
		document.getElementById("nameUpdownFlag2").addEventListener('tap',function(){
			var tempvalue1=1;
			var tempClicks;
			tempClicks = getClicks(tempvalue1);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag2 ="01";
				changeUpDownStyle1("nav2class","rzdf2class");
				//改变当前的升降序图标样式
				$("#name2class").removeClass("tabarrow_no");
				$("#name2class").removeClass("tabarrow_down");
				$("#name2class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(91,"01",1,2);
			} else{
				setupdflag2 ="00";
				changeUpDownStyle1("nav2class","rzdf2class");
				//改变当前的升降序图标样式
				$("#name2class").removeClass("tabarrow_top");
				$("#name2class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(91,"00",1,2);
				
			}	
		},true);
		document.getElementById("navUpdownFlag2").addEventListener('tap',function(){
			var tempvalue2=2;
			var tempClicks;
			tempClicks = getClicks(tempvalue2);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag2 ="11";
				changeUpDownStyle2("name2class","rzdf2class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav2class").removeClass("tabarrow_no");
				$("#nav2class").removeClass("tabarrow_down");
				$("#nav2class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(91,11,1,2);
			} else{
				setupdflag2 ="10";
				changeUpDownStyle2("name2class","rzdf2class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav2class").removeClass("tabarrow_top");
				$("#nav2class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(91,10,1,2);
			}
		},true);
		document.getElementById("rzdfUpdownFlag2").addEventListener('tap',function(){
			var tempvalue3=3;
			var tempClicks;
			tempClicks = getClicks(tempvalue3);//获取点击次数
			if (tempClicks == '1') {
				setupdflag2 ="20";
				changeUpDownStyle3("name2class","nav2class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf2class").removeClass("tabarrow_top");
				$("#rzdf2class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(91,20,1,2);
			} else{
				setupdflag2 ="21";
				changeUpDownStyle3("name2class","nav2class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf2class").removeClass("tabarrow_no");
				$("#rzdf2class").removeClass("tabarrow_down");
				$("#rzdf2class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(91,21,1,2);
			}
		},true);
		/********************宝类end**********************/
		/********************可定投start**********************/
		document.getElementById("nameUpdownFlag3").addEventListener('tap',function(){
			var tempvalue1=1;
			var tempClicks;
			tempClicks = getClicks(tempvalue1);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag3 ="01";
				changeUpDownStyle1("nav3class","rzdf3class");
				//改变当前的升降序图标样式
				$("#name3class").removeClass("tabarrow_no");
				$("#name3class").removeClass("tabarrow_down");
				$("#name3class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(99,"01",1,3);
			} else{
				setupdflag3 ="00";
				changeUpDownStyle1("nav3class","rzdf3class");
				//改变当前的升降序图标样式
				$("#name3class").removeClass("tabarrow_top");
				$("#name3class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(99,"00",1,3);
				
			}	
		},true);
		document.getElementById("navUpdownFlag3").addEventListener('tap',function(){
			var tempvalue2=2;
			var tempClicks;
			tempClicks = getClicks(tempvalue2);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag3 ="11";
				changeUpDownStyle2("name3class","rzdf3class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav3class").removeClass("tabarrow_no");
				$("#nav3class").removeClass("tabarrow_down");
				$("#nav3class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(99,11,1,3);
			} else{
				setupdflag3 ="10";
				changeUpDownStyle2("name3class","rzdf3class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav3class").removeClass("tabarrow_top");
				$("#nav3class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(99,10,1,3);
			}
		},true);
		document.getElementById("rzdfUpdownFlag3").addEventListener('tap',function(){
			var tempvalue3=3;
			var tempClicks;
			tempClicks = getClicks(tempvalue3);//获取点击次数
			if (tempClicks == '1') {
				setupdflag3 ="30";
				changeUpDownStyle3("name3class","nav3class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf3class").removeClass("tabarrow_top");
				$("#rzdf3class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(99,30,1,3);
			} else{
				setupdflag3 ="31";
				changeUpDownStyle3("name3class","nav3class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf3class").removeClass("tabarrow_no");
				$("#rzdf3class").removeClass("tabarrow_down");
				$("#rzdf3class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(99,31,1,3);
			}
		},true);
		/********************可定投end**********************/
		/********************股票型start**********************/
		document.getElementById("nameUpdownFlag4").addEventListener('tap',function(){
			var tempvalue1=1;
			var tempClicks;
			tempClicks = getClicks(tempvalue1);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag4 ="01";
				changeUpDownStyle1("nav4class","rzdf4class");
				//改变当前的升降序图标样式
				$("#name4class").removeClass("tabarrow_no");
				$("#name4class").removeClass("tabarrow_down");
				$("#name4class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(11,"01",1,4);
			} else{
				setupdflag4 ="00";
				changeUpDownStyle1("nav4class","rzdf4class");
				//改变当前的升降序图标样式
				$("#name4class").removeClass("tabarrow_top");
				$("#name4class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(11,"00",1,4);
				
			}	
		},true);
		document.getElementById("navUpdownFlag4").addEventListener('tap',function(){
			var tempvalue2=2;
			var tempClicks;
			tempClicks = getClicks(tempvalue2);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag4 ="11";
				changeUpDownStyle2("name4class","rzdf4class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav4class").removeClass("tabarrow_no");
				$("#nav4class").removeClass("tabarrow_down");
				$("#nav4class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(11,11,1,4);
			} else{
				setupdflag4 ="10";
				changeUpDownStyle2("name4class","rzdf4class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav4class").removeClass("tabarrow_top");
				$("#nav4class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(11,10,1,4);
			}
		},true);
		document.getElementById("rzdfUpdownFlag4").addEventListener('tap',function(){
			var tempvalue3=3;
			var tempClicks;
			tempClicks = getClicks(tempvalue3);//获取点击次数
			if (tempClicks == '1') {
				setupdflag4 ="30";
				changeUpDownStyle3("name4class","nav4class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf4class").removeClass("tabarrow_top");
				$("#rzdf4class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(11,30,1,4);
			} else{
				setupdflag4 ="31";
				changeUpDownStyle3("name4class","nav4class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf4class").removeClass("tabarrow_no");
				$("#rzdf4class").removeClass("tabarrow_down");
				$("#rzdf4class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(11,31,1,4);
			}
		},true);
		/********************股票型end**********************/
		/********************债券型start**********************/
		document.getElementById("nameUpdownFlag5").addEventListener('tap',function(){
			var tempvalue1=1;
			var tempClicks;
			tempClicks = getClicks(tempvalue1);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag5 ="01";
				changeUpDownStyle1("nav5class","rzdf5class");
				//改变当前的升降序图标样式
				$("#name5class").removeClass("tabarrow_no");
				$("#name5class").removeClass("tabarrow_down");
				$("#name5class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(14,"01",1,5);
			} else{
				setupdflag5 ="00";
				changeUpDownStyle1("nav5class","rzdf5class");
				//改变当前的升降序图标样式
				$("#name5class").removeClass("tabarrow_top");
				$("#name5class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(14,"00",1,5);
				
			}	
		},true);
		document.getElementById("navUpdownFlag5").addEventListener('tap',function(){
			var tempvalue2=2;
			var tempClicks;
			tempClicks = getClicks(tempvalue2);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag5 ="11";
				changeUpDownStyle2("name5class","rzdf5class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav5class").removeClass("tabarrow_no");
				$("#nav5class").removeClass("tabarrow_down");
				$("#nav5class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(14,11,1,5);
			} else{
				setupdflag5 ="10";
				changeUpDownStyle2("name5class","rzdf5class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav5class").removeClass("tabarrow_top");
				$("#nav5class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(14,10,1,5);
			}
		},true);
		document.getElementById("rzdfUpdownFlag5").addEventListener('tap',function(){
			var tempvalue3=3;
			var tempClicks;
			tempClicks = getClicks(tempvalue3);//获取点击次数
			if (tempClicks == '1') {
				setupdflag5 ="30";
				changeUpDownStyle3("name5class","nav5class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf5class").removeClass("tabarrow_top");
				$("#rzdf5class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(14,30,1,5);
			} else{
				setupdflag5 ="31";
				changeUpDownStyle3("name5class","nav5class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf5class").removeClass("tabarrow_no");
				$("#rzdf5class").removeClass("tabarrow_down");
				$("#rzdf5class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(14,31,1,5);
			}
		},true);
		/********************债券型end**********************/
		/********************混合start**********************/
		document.getElementById("nameUpdownFlag6").addEventListener('tap',function(){
			var tempvalue1=1;
			var tempClicks;
			tempClicks = getClicks(tempvalue1);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag6 ="01";
				changeUpDownStyle1("nav6class","rzdf6class");
				//改变当前的升降序图标样式
				$("#name6class").removeClass("tabarrow_no");
				$("#name6class").removeClass("tabarrow_down");
				$("#name6class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(17,"01",1,6);
			} else{
				setupdflag6 ="00";
				changeUpDownStyle1("nav6class","rzdf6class");
				//改变当前的升降序图标样式
				$("#name6class").removeClass("tabarrow_top");
				$("#name6class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(17,"00",1,6);
				
			}	
		},true);
		document.getElementById("navUpdownFlag6").addEventListener('tap',function(){
			var tempvalue2=2;
			var tempClicks;
			tempClicks = getClicks(tempvalue2);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag6 ="11";
				changeUpDownStyle2("name6class","rzdf6class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav6class").removeClass("tabarrow_no");
				$("#nav6class").removeClass("tabarrow_down");
				$("#nav6class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(17,11,1,6);
			} else{
				setupdflag6 ="10";
				changeUpDownStyle2("name6class","rzdf6class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav6class").removeClass("tabarrow_top");
				$("#nav6class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(17,10,1,6);
			}
		},true);
		document.getElementById("rzdfUpdownFlag6").addEventListener('tap',function(){
			var tempvalue3=3;
			var tempClicks;
			tempClicks = getClicks(tempvalue3);//获取点击次数
			if (tempClicks == '1') {
				setupdflag6 ="30";
				changeUpDownStyle3("name6class","nav6class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf6class").removeClass("tabarrow_top");
				$("#rzdf6class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(17,30,1,6);
			} else{
				setupdflag6 ="31";
				changeUpDownStyle3("name6class","nav6class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf6class").removeClass("tabarrow_no");
				$("#rzdf6class").removeClass("tabarrow_down");
				$("#rzdf6class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(17,31,1,6);
			}
		},true);
		/********************混合end**********************/
		/********************货币start**********************/
		document.getElementById("nameUpdownFlag7").addEventListener('tap',function(){
			var tempvalue1=1;
			var tempClicks;
			tempClicks = getClicks(tempvalue1);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag7 ="01";
				changeUpDownStyle1("nav7class","rzdf7class");
				//改变当前的升降序图标样式
				$("#name7class").removeClass("tabarrow_no");
				$("#name7class").removeClass("tabarrow_down");
				$("#name7class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(12,"01",1,7);
			} else{
				setupdflag7 ="00";
				changeUpDownStyle1("nav7class","rzdf7class");
				//改变当前的升降序图标样式
				$("#name7class").removeClass("tabarrow_top");
				$("#name7class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(12,"00",1,7);
				
			}	
		},true);
		document.getElementById("navUpdownFlag7").addEventListener('tap',function(){
			var tempvalue2=2;
			var tempClicks;
			tempClicks = getClicks(tempvalue2);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag7 ="11";
				changeUpDownStyle2("name7class","rzdf7class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav7class").removeClass("tabarrow_no");
				$("#nav7class").removeClass("tabarrow_down");
				$("#nav7class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(12,11,1,7);
			} else{
				setupdflag7 ="10";
				changeUpDownStyle2("name7class","rzdf7class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav7class").removeClass("tabarrow_top");
				$("#nav7class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(12,10,1,7);
			}
		},true);
		document.getElementById("rzdfUpdownFlag7").addEventListener('tap',function(){
			var tempvalue3=3;
			var tempClicks;
			tempClicks = getClicks(tempvalue3);//获取点击次数
			if (tempClicks == '1') {
				setupdflag7 ="20";
				changeUpDownStyle3("name7class","nav7class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf7class").removeClass("tabarrow_top");
				$("#rzdf7class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(12,20,1,7);
			} else{
				setupdflag7 ="21";
				changeUpDownStyle3("name7class","nav7class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf7class").removeClass("tabarrow_no");
				$("#rzdf7class").removeClass("tabarrow_down");
				$("#rzdf7class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(12,21,1,7);
			}
		},true);
		/********************货币end**********************/
		/********************指数start**********************/
		document.getElementById("nameUpdownFlag8").addEventListener('tap',function(){
			var tempvalue1=1;
			var tempClicks;
			tempClicks = getClicks(tempvalue1);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag8 ="01";
				changeUpDownStyle1("nav8class","rzdf8class");
				//改变当前的升降序图标样式
				$("#name8class").removeClass("tabarrow_no");
				$("#name8class").removeClass("tabarrow_down");
				$("#name8class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(15,"01",1,8);
			} else{
				setupdflag8 ="00";
				changeUpDownStyle1("nav8class","rzdf8class");
				//改变当前的升降序图标样式
				$("#name8class").removeClass("tabarrow_top");
				$("#name8class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(15,"00",1,8);
				
			}	
		},true);
		document.getElementById("navUpdownFlag8").addEventListener('tap',function(){
			var tempvalue2=2;
			var tempClicks;
			tempClicks = getClicks(tempvalue2);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag8 ="11";
				changeUpDownStyle2("name8class","rzdf8class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav8class").removeClass("tabarrow_no");
				$("#nav8class").removeClass("tabarrow_down");
				$("#nav8class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(15,11,1,8);
			} else{
				setupdflag8 ="10";
				changeUpDownStyle2("name8class","rzdf8class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav8class").removeClass("tabarrow_top");
				$("#nav8class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(15,10,1,8);
			}
		},true);
		document.getElementById("rzdfUpdownFlag8").addEventListener('tap',function(){
			var tempvalue3=3;
			var tempClicks;
			tempClicks = getClicks(tempvalue3);//获取点击次数
			if (tempClicks == '1') {
				setupdflag8 ="20";
				changeUpDownStyle3("name8class","nav8class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf8class").removeClass("tabarrow_top");
				$("#rzdf8class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(15,20,1,8);
			} else{
				setupdflag8 ="21";
				changeUpDownStyle3("name8class","nav8class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf8class").removeClass("tabarrow_no");
				$("#rzdf8class").removeClass("tabarrow_down");
				$("#rzdf8class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(15,21,1,8);
			}
		},true);
		/********************指数end**********************/
		/********************QDIIstart**********************/
		document.getElementById("nameUpdownFlag9").addEventListener('tap',function(){
			var tempvalue1=1;
			var tempClicks;
			tempClicks = getClicks(tempvalue1);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag9 ="01";
				changeUpDownStyle1("nav9class","rzdf9class");
				//改变当前的升降序图标样式
				$("#name9class").removeClass("tabarrow_no");
				$("#name9class").removeClass("tabarrow_down");
				$("#name9class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(16,"01",1,9);
			} else{
				setupdflag9 ="00";
				changeUpDownStyle1("nav9class","rzdf9class");
				//改变当前的升降序图标样式
				$("#name9class").removeClass("tabarrow_top");
				$("#name9class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(16,"00",1,9);
				
			}	
		},true);
		document.getElementById("navUpdownFlag9").addEventListener('tap',function(){
			var tempvalue2=2;
			var tempClicks;
			tempClicks = getClicks(tempvalue2);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag9 ="11";
				changeUpDownStyle2("name9class","rzdf9class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav9class").removeClass("tabarrow_no");
				$("#nav9class").removeClass("tabarrow_down");
				$("#nav9class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(16,11,1,9);
			} else{
				setupdflag9 ="10";
				changeUpDownStyle2("name9class","rzdf9class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav9class").removeClass("tabarrow_top");
				$("#nav9class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(16,10,1,9);
			}
		},true);
		document.getElementById("rzdfUpdownFlag9").addEventListener('tap',function(){
			var tempvalue3=3;
			var tempClicks;
			tempClicks = getClicks(tempvalue3);//获取点击次数
			if (tempClicks == '1') {
				setupdflag9 ="30";
				changeUpDownStyle3("name9class","nav9class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf9class").removeClass("tabarrow_top");
				$("#rzdf9class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(16,30,1,9);
			} else{
				setupdflag9 ="31";
				changeUpDownStyle3("name9class","nav9class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf9class").removeClass("tabarrow_no");
				$("#rzdf9class").removeClass("tabarrow_down");
				$("#rzdf9class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(16,31,1,9);
			}
		},true);
		/********************QDIIend**********************/
		/********************LOFstart**********************/
		document.getElementById("nameUpdownFlag10").addEventListener('tap',function(){
			var tempvalue1=1;
			var tempClicks;
			tempClicks = getClicks(tempvalue1);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag10 ="01";
				changeUpDownStyle1("nav10class","rzdf10class");
				//改变当前的升降序图标样式
				$("#name10class").removeClass("tabarrow_no");
				$("#name10class").removeClass("tabarrow_down");
				$("#name10class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(22,"01",1,10);
			} else{
				setupdflag10 ="00";
				changeUpDownStyle1("nav10class","rzdf10class");
				//改变当前的升降序图标样式
				$("#name10class").removeClass("tabarrow_top");
				$("#name10class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(22,"00",1,10);
				
			}	
		},true);
		document.getElementById("navUpdownFlag10").addEventListener('tap',function(){
			var tempvalue2=2;
			var tempClicks;
			tempClicks = getClicks(tempvalue2);//获取点击次数
			//奇数：降序；偶数：升序
			if (tempClicks == '1') {
				setupdflag10 ="11";
				changeUpDownStyle2("name10class","rzdf10class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav10class").removeClass("tabarrow_no");
				$("#nav10class").removeClass("tabarrow_down");
				$("#nav10class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(22,11,1,10);
			} else{
				setupdflag10 ="10";
				changeUpDownStyle2("name10class","rzdf10class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#nav10class").removeClass("tabarrow_top");
				$("#nav10class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(22,10,1,10);
			}
		},true);
		document.getElementById("rzdfUpdownFlag10").addEventListener('tap',function(){
			var tempvalue3=3;
			var tempClicks;
			tempClicks = getClicks(tempvalue3);//获取点击次数
			if (tempClicks == '1') {
				setupdflag10 ="30";
				changeUpDownStyle3("name10class","nav10class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf10class").removeClass("tabarrow_top");
				$("#rzdf10class").addClass("tabarrow_down");
				
				turnPageBeginPos=1;
				//发送升序请求
				initQueryAllProdInfo(22,30,1,10);
			} else{
				setupdflag10 ="31";
				changeUpDownStyle3("name10class","nav10class");
				//最新净值、月涨跌幅升降序图标置灰
				$("#rzdf10class").removeClass("tabarrow_no");
				$("#rzdf10class").removeClass("tabarrow_down");
				$("#rzdf10class").addClass("tabarrow_top");
				
				turnPageBeginPos=1;
				//发送降序请求
				initQueryAllProdInfo(22,31,1,10);
			}
		},true);
		/********************LOFend**********************/
		//获取点击次数
		function getClicks(tempval){
			//mui.alert("totalNum1 :"+totalNum1+" totalNum2 :"+totalNum2+" totalNum3 :"+totalNum3);
			var hitCount;
			var tempNum = $("#showUpdownFlag").val();
			if (tempval == '1') {
				totalNum2 ='0';
				totalNum3 ='0';
				totalNum1 = Number(totalNum1)+Number(tempNum);
				if (totalNum1 % 2 == 1) {
					//mui.alert("降序");
					hitCount = '1'; 
				}else{
					//mui.alert("升序");
					hitCount = '2'; 
				}
			}else if(tempval == '2'){
				totalNum1 ='0';
				totalNum3 ='0';
				totalNum2 = Number(totalNum2)+Number(tempNum);
				if (totalNum2 % 2 == 1) {
					//mui.alert("降序");
					hitCount = '1'; 
				}else{
					//mui.alert("升序");
					hitCount = '2'; 
				}
			}else if(tempval == '3'){
				totalNum1 ='0';
				totalNum2 ='0';
				totalNum3 = Number(totalNum3)+Number(tempNum);				
				if (totalNum3 % 2 == 1) {
					//mui.alert("降序");
					hitCount = '1'; 
				}else{
					//mui.alert("升序");
					hitCount = '2'; 
				}
			}
			return hitCount;
		}
		
		//改变基金名称升降序样式
		function changeUpDownStyle1(styleval1,styleval2){
			$("#"+styleval1).removeClass("tabarrow_top");
			$("#"+styleval1).removeClass("tabarrow_down");
			$("#"+styleval1).addClass("tabarrow_no");
			$("#"+styleval2).removeClass("tabarrow_top");
			$("#"+styleval2).removeClass("tabarrow_down");
			$("#"+styleval2).addClass("tabarrow_no");
		}
		//改变最新净值升降序样式
		function changeUpDownStyle2(styleval3,styleval4){
			$("#"+styleval3).removeClass("tabarrow_top");
			$("#"+styleval3).removeClass("tabarrow_down");
			$("#"+styleval3).addClass("tabarrow_no");
			$("#"+styleval4).removeClass("tabarrow_top");
			$("#"+styleval4).removeClass("tabarrow_down");
			$("#"+styleval4).addClass("tabarrow_no");
		}
		//改变月涨跌幅升降序样式
		function changeUpDownStyle3(styleval5,styleval6){
			$("#"+styleval5).removeClass("tabarrow_top");
			$("#"+styleval5).removeClass("tabarrow_down");
			$("#"+styleval5).addClass("tabarrow_no");
			$("#"+styleval6).removeClass("tabarrow_top");
			$("#"+styleval6).removeClass("tabarrow_down");
			$("#"+styleval6).addClass("tabarrow_no");
		}
		//初始化
		function initPageView(){
			//全部按月涨跌幅降序排序31
			initQueryAllProdInfo("",31,1,1);
			//宝类
//			initQueryAllProdInfo(91,21,1,2);
//			//可定投
//			initQueryAllProdInfo(99,31,1,3);
//			//股票型
//			initQueryAllProdInfo(11,31,1,4);
//			//债券型
//			initQueryAllProdInfo(14,31,1,5);
//			//混合
//			initQueryAllProdInfo(17,31,1,6);
//			//货币
//			initQueryAllProdInfo(12,21,1,7);
//			//指数
//			initQueryAllProdInfo(15,31,1,8);
//			//QDII
//			initQueryAllProdInfo(16,31,1,9);
//			//LOF
//			initQueryAllProdInfo(22,31,1,10);
			//组合
			//initQueryAllProdInfo(17,31,1,11);
		}
		
		checkFreshflag = function(valflag,flagtype){
			//console.log("valflag----------> :"+valflag+" flagtype :"+flagtype+" turnPageBeginPos :"+turnPageBeginPos);
			if (flagtype == '1') {
				switch (valflag){
					case '0':
						initQueryAllProdInfo("",31,1,1);
						break;
					case '1':
						initQueryAllProdInfo(91,21,1,2);
						break;
					case '2':
						initQueryAllProdInfo(99,31,1,3);
						break;
					case '3':
						initQueryAllProdInfo(11,31,1,4);
						break;
					case '4':
						initQueryAllProdInfo(14,31,1,5);
						break
					case '5':
						initQueryAllProdInfo(17,31,1,6);
						break;
					case '6':
						initQueryAllProdInfo(12,21,1,7);
						break;
					case '7':
						initQueryAllProdInfo(15,31,1,8);
						break;
					case '8':
						initQueryAllProdInfo(16,31,1,9);
						break;
					case '9':
						initQueryAllProdInfo(22,31,1,10);
						break;
				}
			} else{
				//console.log("biaoz-------> :"+valflag)
				switch (valflag){
					case '0':
						initQueryAllProdInfo("",setupdflag1,turnPageBeginPos,1);
						break;
					case '1':
						initQueryAllProdInfo(91,setupdflag2,turnPageBeginPos,2);
						break;
					case '2':
						initQueryAllProdInfo(99,setupdflag3,turnPageBeginPos,3);
						break;
					case '3':
						initQueryAllProdInfo(11,setupdflag4,turnPageBeginPos,4);
						break;
					case '4':
						initQueryAllProdInfo(14,setupdflag5,turnPageBeginPos,5);
						break
					case '5':
						initQueryAllProdInfo(17,setupdflag6,turnPageBeginPos,6);
						break;
					case '6':
						initQueryAllProdInfo(12,setupdflag7,turnPageBeginPos,7);
						break;
					case '7':
						initQueryAllProdInfo(15,setupdflag8,turnPageBeginPos,8);
						break;
					case '8':
						initQueryAllProdInfo(16,setupdflag9,turnPageBeginPos,9);
						break;
					case '9':
						initQueryAllProdInfo(22,setupdflag10,turnPageBeginPos,10);
						break;
				}
			}
			
		}
		//获取产品类型返回的总记录数
		getTurnTotalNum = function(totalval,menuval){
			//console.log("totalval :"+totalval.turnPageTotalNum+" menuval :"+menuval);
			switch (menuval){
				case 1:
					turnPageTotalNum1 = totalval.turnPageTotalNum;
					break;
				case 2:
					turnPageTotalNum2 = totalval.turnPageTotalNum;
					break;
				case 3:
					turnPageTotalNum3 = totalval.turnPageTotalNum;
					break;
				case 4:
					turnPageTotalNum4 = totalval.turnPageTotalNum;
					break;
				case 5:
					turnPageTotalNum5 = totalval.turnPageTotalNum;
					break;
				case 6:
					turnPageTotalNum6 = totalval.turnPageTotalNum;
					break;
				case 7:
					turnPageTotalNum7 = totalval.turnPageTotalNum;
					break;
				case 8:
					turnPageTotalNum8 = totalval.turnPageTotalNum;
					break;
				case 9:
					turnPageTotalNum9 = totalval.turnPageTotalNum;
					break;
				case 10:
					turnPageTotalNum10 = totalval.turnPageTotalNum;
					break;
			}
		}
		
		//返回当前属于哪个选项卡
		returnMenuFlag = function(flagParams){
			//console.log("flagParams :"+flagParams);
			switch (flagParams){
				case '0':
					return turnPageTotalNum1;
				case '1':
					return turnPageTotalNum2;
				case '2':
					return turnPageTotalNum3;
				case '3':
					return turnPageTotalNum4;
				case '4':
					return turnPageTotalNum5;
				case '5':
					return turnPageTotalNum6;
				case '6':
					return turnPageTotalNum7;
				case '7':
					return turnPageTotalNum8;
				case '8':
					return turnPageTotalNum9;
				case '9':
					return turnPageTotalNum10;
			}
		}
		//当下拉刷新时基金名称、最新净值、月涨跌幅的升降序重置到默认
		function upDownFlagReset(menuresetflag){
			switch (menuresetflag){
				case '0':
					$("#name1class").removeClass("tabarrow_top");
					$("#name1class").removeClass("tabarrow_down");
					$("#name1class").addClass("tabarrow_no");					
					$("#nav1class").removeClass("tabarrow_top");
					$("#nav1class").removeClass("tabarrow_down");
					$("#nav1class").addClass("tabarrow_no");					
					$("#rzdf1class").removeClass("tabarrow_top");
					$("#rzdf1class").removeClass("tabarrow_down");
					$("#rzdf1class").addClass("tabarrow_top");
					break;
				case '1':
					$("#name2class").removeClass("tabarrow_top");
					$("#name2class").removeClass("tabarrow_down");
					$("#name2class").addClass("tabarrow_no");					
					$("#nav2class").removeClass("tabarrow_top");
					$("#nav2class").removeClass("tabarrow_down");
					$("#nav2class").addClass("tabarrow_no");					
					$("#rzdf2class").removeClass("tabarrow_top");
					$("#rzdf2class").removeClass("tabarrow_down");
					$("#rzdf2class").addClass("tabarrow_top");
					break;
				case '2':
					$("#name3class").removeClass("tabarrow_top");
					$("#name3class").removeClass("tabarrow_down");
					$("#name3class").addClass("tabarrow_no");					
					$("#nav3class").removeClass("tabarrow_top");
					$("#nav3class").removeClass("tabarrow_down");
					$("#nav3class").addClass("tabarrow_no");					
					$("#rzdf3class").removeClass("tabarrow_top");
					$("#rzdf3class").removeClass("tabarrow_down");
					$("#rzdf3class").addClass("tabarrow_top");
					break;
				case '3':
					$("#name4class").removeClass("tabarrow_top");
					$("#name4class").removeClass("tabarrow_down");
					$("#name4class").addClass("tabarrow_no");					
					$("#nav4class").removeClass("tabarrow_top");
					$("#nav4class").removeClass("tabarrow_down");
					$("#nav4class").addClass("tabarrow_no");					
					$("#rzdf4class").removeClass("tabarrow_top");
					$("#rzdf4class").removeClass("tabarrow_down");
					$("#rzdf4class").addClass("tabarrow_top");
					break;
				case '4':
					$("#name5class").removeClass("tabarrow_top");
					$("#name5class").removeClass("tabarrow_down");
					$("#name5class").addClass("tabarrow_no");					
					$("#nav5class").removeClass("tabarrow_top");
					$("#nav5class").removeClass("tabarrow_down");
					$("#nav5class").addClass("tabarrow_no");					
					$("#rzdf5class").removeClass("tabarrow_top");
					$("#rzdf5class").removeClass("tabarrow_down");
					$("#rzdf5class").addClass("tabarrow_top");
					break
				case '5':
					$("#name6class").removeClass("tabarrow_top");
					$("#name6class").removeClass("tabarrow_down");
					$("#name6class").addClass("tabarrow_no");					
					$("#nav6class").removeClass("tabarrow_top");
					$("#nav6class").removeClass("tabarrow_down");
					$("#nav6class").addClass("tabarrow_no");					
					$("#rzdf6class").removeClass("tabarrow_top");
					$("#rzdf6class").removeClass("tabarrow_down");
					$("#rzdf6class").addClass("tabarrow_top");
					break;
				case '6':
					$("#name7class").removeClass("tabarrow_top");
					$("#name7class").removeClass("tabarrow_down");
					$("#name7class").addClass("tabarrow_no");					
					$("#nav7class").removeClass("tabarrow_top");
					$("#nav7class").removeClass("tabarrow_down");
					$("#nav7class").addClass("tabarrow_no");					
					$("#rzdf7class").removeClass("tabarrow_top");
					$("#rzdf7class").removeClass("tabarrow_down");
					$("#rzdf7class").addClass("tabarrow_top");
					break;
				case '7':
					$("#name8class").removeClass("tabarrow_top");
					$("#name8class").removeClass("tabarrow_down");
					$("#name8class").addClass("tabarrow_no");					
					$("#nav8class").removeClass("tabarrow_top");
					$("#nav8class").removeClass("tabarrow_down");
					$("#nav8class").addClass("tabarrow_no");					
					$("#rzdf8class").removeClass("tabarrow_top");
					$("#rzdf8class").removeClass("tabarrow_down");
					$("#rzdf8class").addClass("tabarrow_top");
					break;
				case '8':
					$("#name9class").removeClass("tabarrow_top");
					$("#name9class").removeClass("tabarrow_down");
					$("#name9class").addClass("tabarrow_no");					
					$("#nav9class").removeClass("tabarrow_top");
					$("#nav9class").removeClass("tabarrow_down");
					$("#nav9class").addClass("tabarrow_no");					
					$("#rzdf9class").removeClass("tabarrow_top");
					$("#rzdf9class").removeClass("tabarrow_down");
					$("#rzdf9class").addClass("tabarrow_top");
					break;
				case '9':
					$("#name10class").removeClass("tabarrow_top");
					$("#name10class").removeClass("tabarrow_down");
					$("#name10class").addClass("tabarrow_no");					
					$("#nav10class").removeClass("tabarrow_top");
					$("#nav10class").removeClass("tabarrow_down");
					$("#nav10class").addClass("tabarrow_no");					
					$("#rzdf10class").removeClass("tabarrow_top");
					$("#rzdf10class").removeClass("tabarrow_down");
					$("#rzdf10class").addClass("tabarrow_top");
					break;
				}
			}
		
		//点击产品区域跳转到产品详情
		toFundProductDetails = function(prodInfoVals){
			var f_prodcode = prodInfoVals.split("&")[0];//产品代码
			var f_prodname = prodInfoVals.split("&")[1];//产品名称
			var f_prodtype = prodInfoVals.split("&")[2];//产品类型
			var f_tano = prodInfoVals.split("&")[3];//TA代码
			if (f_prodtype == '91') {
				var params1 ={
						"noCheck" : "false",
						f_prodcode:f_prodcode,
						f_prodname:f_prodname,
						f_prodtype:f_prodtype,
						f_tano:f_tano
					};
					mbank.openWindowByLoad('../fund/cashFundDetail.html','cashFundDetail','slide-in-right',params1);
					
				} else{//非余额宝
					var params2 ={
						f_prodcode:f_prodcode,
						f_prodname:f_prodname,
						f_prodtype:f_prodtype,
						f_tano:f_tano
					};
					mbank.openWindowByLoad('../fund/fundProductDetail.html','fundProductDetail','slide-in-right',params2);
				}
		}
		pulldownfresh = function(pullRefreshElVal,selfVal){//下拉刷新
			setTimeout(function(){
				turnPageBeginPos=1;
				upDownFlagReset(freshflag);//重置升降序标志
				checkFreshflag(freshflag,'1');
				selfVal.endPulldownToRefresh();
				selfVal.endPullupToRefresh();
			},1000);
			//重置上拉加载
			selfVal.refresh(true);
		}
		pullupRefresh = function(pullRefreshElVal,selfVal){//上拉加载
			setTimeout(function(){
			var currentNum = jQuery(detailsList).length;
			var turnPageTotalNum = returnMenuFlag(freshflag);
			if(currentNum >= turnPageTotalNum) {
				selfVal.endPullupToRefresh(true);
				setTimeout(function(){
					selfVal.disablePullupToRefresh();
					setTimeout(function(){
						selfVal.enablePullupToRefresh();
					},1000);
				},2000);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			checkFreshflag(freshflag,'2');
			selfVal.endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
			},1000);
		}
	});
});