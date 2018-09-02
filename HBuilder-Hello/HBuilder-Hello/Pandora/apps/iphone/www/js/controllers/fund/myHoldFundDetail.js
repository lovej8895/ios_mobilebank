define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	
	var self = "";
	var params;
	var urlVar;
	var customerId ="";
	var collectFlag = "0"
	
	var chartType = "";
	var chartBtn = "";
	var isSevenDay ="0";
	
	var currentAcct = "";
	var productCode = "";
	var prodType = "";
	var tano = "";
	
	var prodName = "";
	var buyMinAmt = "";
	var buySecMinAmt = "";
	var buyStepAmt = "";
	var f_b24minamt ="";
	var f_b25maxamt = "";
	var f_holdmin = "";
	var f_day_payment = "";
	
	var f_dividend = "";
	var f_avdilvol = "";
	var lineChart;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		customerId = userInfo.get("session_customerId");
		currentAcct = self.currentAcct;
		productCode = self.f_prodcode;
		tano = self.f_tano;
		prodType = self.f_prodtype;
		
		document.getElementById("productChart").style.height = plus.screen.resolutionWidth*0.45 +'px';
		searchFundDetail();
		myHoldFundQuery();
		setTimeout(function() {
			chartInit();
		}, 200);
		collect();
		window.addEventListener("refreshMyHoldFundDetail", function(event) {
			myHoldFundQuery();
		});
		//产品状态信息
		function searchFundDetail(){
			params = {
				"liana_notCheckUrl" : false,
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "1",
				"f_prodcode" : productCode,
				"f_tano" : tano,
				"f_prodtype" : prodType,
				"f_cust_type" : "1"
			};
			urlVar = mbank.getApiURL()+'fund_ProductSearch.do';
			mbank.apiSend("post",urlVar,params,searchFundDetailSuc,searchFundDetailFail,true);
			function searchFundDetailSuc(data){
				if(data.ec == "000"){
					prodName = data.f_iProductInfo[0].f_prodname;
					var f_status = data.f_iProductInfo[0].f_status;
					var f_buyplanflag = data.f_iProductInfo[0].f_buyplanflag;
					var f_nav = data.f_iProductInfo[0].f_nav;
					var f_fundincome = data.f_iProductInfo[0].f_fundincome;
					var	f_risklevel = data.f_iProductInfo[0].f_risklevel;
					var f_dividstatus = data.f_iProductInfo[0].f_dividstatus;
					var f_b20fstminamt = data.f_iProductInfo[0].f_b20fstminamt;
					var f_b20conminamt = data.f_iProductInfo[0].f_b20conminamt;
					var f_b20stepunit = data.f_iProductInfo[0].f_b20stepunit;
					var f_b22fstminamt = data.f_iProductInfo[0].f_b22fstminamt;
					var f_b22conminamt = data.f_iProductInfo[0].f_b22conminamt;
					var f_b22stepunit = data.f_iProductInfo[0].f_b22stepunit;
					f_b24minamt = data.f_iProductInfo[0].f_b24minamt;
					f_b25maxamt = data.f_iProductInfo[0].f_b25maxamt;
					f_holdmin = data.f_iProductInfo[0].f_holdmin;
					f_day_payment = data.f_iProductInfo[0].f_day_payment;;
					
					document.getElementById("f_prodname").innerText = prodName;
					document.getElementById("productCode").innerText = "(" +productCode+")";
					document.getElementById("propTypeShow").innerText =jQuery.param.getDisplay("FUND_PRODTYPE",prodType);
					document.getElementById("risklevelShow").innerText =jQuery.param.getDisplay("FUND_RISK_LEVEL",f_risklevel);
					if(prodType =="12"){
						document.getElementById("incomeTitle").innerText = "每万份收益";
						document.getElementById("income").innerText = parseFloat(f_fundincome).toFixed(4);
//						document.getElementById("propTypeIcon").className="fundpro_lxicon fund_phb_ico2";
					}else{
						document.getElementById("incomeTitle").innerText = "净值";
						document.getElementById("income").innerText = parseFloat(f_nav).toFixed(4);
//						document.getElementById("propTypeIcon").className="fundpro_lxicon fund_phb_ico1";
					}
					//风险等级图标
					if(f_risklevel == "01" || f_risklevel == "02"){
						document.getElementById("risklevelIcon").className="fundpro_lxicon fund_fxejd";
					}else if(f_risklevel == "03"){
						document.getElementById("risklevelIcon").className="fundpro_lxicon fund_fxejm";
					}else{
						document.getElementById("risklevelIcon").className="fundpro_lxicon fund_fxejh";
					}
					if(f_status == "1"){
						buyMinAmt = f_b20fstminamt;
						buySecMinAmt = f_b20conminamt;
						buyStepAmt = f_b20stepunit;
					}else if(f_status == "0" || f_status == "2" || f_status == "3" ||f_status == "6"){
						buyMinAmt = f_b22fstminamt;
						buySecMinAmt = f_b22conminamt;
						buyStepAmt = f_b22stepunit;
					}else{
						buyMinAmt = f_b22fstminamt;
						buySecMinAmt = f_b22conminamt;
						buyStepAmt = f_b22stepunit;
					}
					if(f_status == "1" || f_status == "0" || f_status == "2" || f_status == "3" ||f_status == "6"){
						document.getElementById("buyBtn").removeAttribute("disabled");
					}
					if(f_status == "0" || f_status == "2" || f_status == "3" || f_status == "5"){
						document.getElementById("sellBtn").removeAttribute("disabled");
					}
					if(f_buyplanflag =="1"){
						document.getElementById("buyPlanBtn").removeAttribute("disabled");
					}
					if((f_status == "0" || f_status == "1" || f_status == "2" || f_status == "3" || f_status == "5" || f_status == "6" || f_status == "9")&&(f_dividstatus =="1")){
						document.getElementById("dividChangeBtn").style.display = "block";
					}
				}else{
					mui.alert(data.em);
				}
			}
			function searchFundDetailFail(e){
				mui.alert(e.em);
			}
		}
		//持有基金情况
		function myHoldFundQuery(){
			params = {
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "1",
				"f_deposit_acct" : currentAcct,
				"f_cust_type" : "1",
				"f_prodcode" : productCode,
				"f_tano" : tano
			};
			urlVar = mbank.getApiURL()+'myFundQuery.do';
			mbank.apiSend("post",urlVar,params,myHoldFundQuerySuc,myHoldFundQueryFail,true);
			function myHoldFundQuerySuc(data){
				if(data.ec == "000"){
					var myHoldFundList = data.f_myfundList;
					if(myHoldFundList.length >0){
						f_dividend = myHoldFundList[0].f_dividend;
						f_avdilvol = myHoldFundList[0].f_avdilvol;
						var f_profitRate = myHoldFundList[0].f_profit_rate;
						if(f_profitRate != null && f_profitRate!=undefined && f_profitRate!="null" && f_profitRate!="" && f_profitRate.trim()!=""){
							f_profitRate = parseFloat(f_profitRate).toFixed(2);
							if(f_profitRate =="-0.00"){
								f_profitRate = "0.00";
							}
						}
						document.getElementById("f_profit_rate").innerText = f_profitRate;
						document.getElementById("f_fundvol").innerText = format.formatMoney(myHoldFundList[0].f_fundvol);
						document.getElementById("f_avdilvol").innerText = format.formatMoney(f_avdilvol);
						document.getElementById("f_marketval").innerText = format.formatMoney(myHoldFundList[0].f_marketval);
						document.getElementById("f_profit_loss").innerText = format.formatMoney(myHoldFundList[0].f_profit_loss);
						document.getElementById("nowDivid").innerText = jQuery.param.getDisplay("DIVIDEND_METHOD",f_dividend);
					}else{
						mui.alert("未查询到该持有信息");
					}
				}else{
					mui.alert(data.em);
				}
			}
			function myHoldFundQueryFail(e){
				mui.alert(e.em);
			}
		}
		
		
		//走势图
		function chartInit(){
			if(prodType =="12"){
				document.getElementById("chartTypeShow1").innerText = "7日年化收益率";
				document.getElementById("chartTypeShow2").innerText = "每万份收益";
				chartType = "1";
				document.getElementById("chartBtnShow1").innerText = "近7日";
				document.getElementById("chartBtnShow2").innerText = "近1个月";
				document.getElementById("chartBtnShow3").innerText = "近3个月";
				document.getElementById("chartBtnShow4").innerText = "近1年";
				chartBtn = "1";
			}else{
				document.getElementById("chartTypeShow1").innerText = "单位净值";
				document.getElementById("chartTypeShow2").innerText = "累计净值";
				chartType = "1";
				document.getElementById("chartBtnShow1").innerText = "近1个月";
				document.getElementById("chartBtnShow2").innerText = "近3个月";
				document.getElementById("chartBtnShow3").innerText = "近半年";
				document.getElementById("chartBtnShow4").innerText = "近1年";
				chartBtn = "1";
			}
			calQueryInput();
		}
		document.getElementById("chartType1").addEventListener("tap",function(){
			document.getElementById("chartType2").className = "fund_zst_tab_r";
			document.getElementById("chartTypeIcon2").style.display ="none";
			document.getElementById("chartTypeShow2").className = "";
			document.getElementById("chartType1").className = "fund_zst_tab_l fund_tab_onbox";
			document.getElementById("chartTypeIcon1").style.display ="block";
			document.getElementById("chartTypeShow1").className = "fund_tab_on";
			chartType = "1";
			calQueryInput();
		},false);
		document.getElementById("chartType2").addEventListener("tap",function(){
			document.getElementById("chartType1").className = "fund_zst_tab_l";
			document.getElementById("chartTypeIcon1").style.display ="none";
			document.getElementById("chartTypeShow2").className = "";
			document.getElementById("chartType2").className = "fund_zst_tab_r fund_tab_onbox";
			document.getElementById("chartTypeIcon2").style.display ="block";
			document.getElementById("chartTypeShow2").className = "fund_tab_on";
			chartType = "2";
			calQueryInput();
		},false);
		document.getElementById("chartBtn1").addEventListener("tap",function(){
			chartBtn = "1";
			chartBtnClass("chartBtnShow1");
			calQueryInput();
		},false);
		document.getElementById("chartBtn2").addEventListener("tap",function(){
			chartBtn = "2";
			chartBtnClass("chartBtnShow2");
			calQueryInput();
		},false);
		document.getElementById("chartBtn3").addEventListener("tap",function(){
			chartBtn = "3";
			chartBtnClass("chartBtnShow3");
			calQueryInput();
		},false);
		document.getElementById("chartBtn4").addEventListener("tap",function(){
			chartBtn = "4";
			chartBtnClass("chartBtnShow4");
			calQueryInput();
		},false);
		function chartBtnClass(btnId){
			document.getElementById("chartBtnShow1").className = "zst_tab";
			document.getElementById("chartBtnShow2").className = "zst_tab";
			document.getElementById("chartBtnShow3").className = "zst_tab";
			document.getElementById("chartBtnShow4").className = "zst_tab";
			document.getElementById(btnId).className = "zst_tab tab_on";
		}
		//查询参数计算
		function calQueryInput(){
			//	1:7日年化收益率,2:万份收益,3:单位净值,4:累计净值
			var chartFlag = "";
			var beginDate = "";
			var endDate = "";
			isSevenDay = "0";
			if(prodType =="12"){
				if(chartType =="1"){
					chartFlag = "1";
				}else if(chartType =="2"){
					chartFlag = "2";
				}
				if(chartBtn =="1"){
					beginDate = format.prevDay(new Date(),7)
					endDate = format.prevDay(new Date(),0);
					isSevenDay = "1";
				}else if(chartBtn =="2"){
					beginDate = format.prevMonth(new Date(),1)
					endDate = format.prevDay(new Date(),0);
				}else if(chartBtn =="3"){
					beginDate = format.prevMonth(new Date(),3)
					endDate = format.prevDay(new Date(),0);
				}else if(chartBtn =="4"){
					beginDate = format.prevMonth(new Date(),12)
					endDate = format.prevDay(new Date(),0);
				}
			}else{
				if(chartType =="1"){
					chartFlag = "3";
				}else if(chartType =="2"){
					chartFlag = "4";
				}
				if(chartBtn =="1"){
					beginDate = format.prevMonth(new Date(),1)
					endDate = format.prevDay(new Date(),0);
				}else if(chartBtn =="2"){
					beginDate = format.prevMonth(new Date(),3)
					endDate = format.prevDay(new Date(),0);
				}else if(chartBtn =="3"){
					beginDate = format.prevMonth(new Date(),6)
					endDate = format.prevDay(new Date(),0);
				}else if(chartBtn =="4"){
					beginDate = format.prevMonth(new Date(),12)
					endDate = format.prevDay(new Date(),0);
				}
			}
			lineChart = echarts.init(document.getElementById('productChart'));
			lineChart.clear();
			fundProductTrendChart(chartFlag,beginDate,endDate);
		}
		function fundProductTrendChart(chartFlagVar,beginDateVar,endDateVar){
			params = {
				"liana_notCheckUrl" : false,
				"f_prodcode" : productCode,
				"f_tano" : tano,
				"f_prodtype" : prodType,
				"f_queryFlag" : chartFlagVar,
				"f_begin_date" : beginDateVar,
				"f_end_date" : endDateVar,
				"f_isSevenDay" : isSevenDay
			};
			urlVar = mbank.getApiURL()+'fundProductTrendChart.do';
			mbank.apiSend("post",urlVar,params,fundProductTrendChartSuc,fundProductTrendChartFail,true);
			function fundProductTrendChartSuc(data){
				if(data.ec == "000"){
					if(data.f_productChart.length>0){
						if(chartFlagVar == "1"){
							chartShow(data.f_productChart,chartFlagVar,"七日年化收益");
						}else if(chartFlagVar == "2"){
							chartShow(data.f_productChart,chartFlagVar,"万份收益");
						}else if(chartFlagVar == "3"){
							chartShow(data.f_productChart,chartFlagVar,"单位净值");
						}else if(chartFlagVar == "4"){
							chartShow(data.f_productChart,chartFlagVar,"累计净值");
						}
					}else{
						mui.alert("未查询到走势图数据");
					}
				}else{
					mui.alert(data.em);
				}
			}
			function fundProductTrendChartFail(e){
				mui.alert(e.em);
			}
		}
		function chartShow(list,chartType,chartTitle){
			var dateList = [];
			var chartList = [];
			for(var i=0;i<list.length;i++){
				dateList.push(format.dataToDate(list[i].f_navdate));
				chartList.push(parseFloat(list[i].f_chartValue).toFixed(4));
			}
			var minVal = Math.min.apply(null,chartList);
			var maxVal = Math.max.apply(null,chartList);
			var section = 0;
			if(minVal == maxVal){
				section = 0.0001;
				minVal = minVal-0.0002;
				maxVal = maxVal+0.0003;
			}else{
				section = parseFloat(((maxVal-minVal)/5+0.0001).toFixed(4));
				maxVal = (5*section + minVal).toFixed(4);
			}
			var symbolFlag = false;
			if(chartList.length<8){
				symbolFlag = true;
			}
			trendChart(dateList,chartList,chartTitle,minVal,maxVal,section,symbolFlag);
		}
		//走势图
		function trendChart(dx,data,seriesName,minVal,maxVal,section,symbolFlag){
			var getOption = function() {
				var chartOption = {
					grid: {
						left:'20%',
						top:15,
						right:'2%',
						bottom:30,
						show:true,
						borderWidth:1,
						borderColor:"#EEEEEE"
					},
					xAxis: {
				    	show:true,
				        type: 'category',
				        data:dx,
				        boundaryGap:false,
				        axisLine:{
				        	show:false
				        },
				        axisTick:{
				        	show:false
				        },
				        axisLabel:{
				        	show:true,
				        	interval: function (index) {
				                return (index === 0) || (index === dx.length - 1);
				            },
				            margin:15,
				        	textStyle: {
				        		color: '#999999',
				        		align: 'right'
				        	}
				        },
				        splitLine:{
				        	show:false
				        }
				    },
				    yAxis: {
				    	show:true,
				        type: 'value',
				        scale:true,
				       	axisLine:{
				        	show:false
				        },
				        axisTick:{
				        	show:false
				        },
				        splitLine:{
				        	show:true,
				        	lineStyle:{
				        		color: '#DDDDDD'
				        	}
				        },
				        min:minVal,
				        max:maxVal,
				        interval:section,
				        axisLabel:{
				        	textStyle: {
				        		color: '#666666'
				        	},
       						formatter:function(value,index){
       							return parseFloat(value).toFixed(4)+"";
       						}
       					}
				    },
    				tooltip: {
				        trigger: 'axis',
				        axisPointer:{
				        	type:'line',
				        	lineStyle:{
				        		color: '#DDDDDD'
				        	}
				        },
				        backgroundColor:'rgba(50,50,50,0.4)'
				    },
				    series:[
				        {
				            name:seriesName,
				            type:'line',
				            smooth:true,
				            symbol: 'circle',
				            symbolSize:4,
				            showSymbol:symbolFlag,
				            showAllSymbol:symbolFlag,
				            sampling: 'average',
				            itemStyle: {
				                normal: {
				                    color: 'rgba(5,153,230,1)',
				                    borderWidth :10
				                }
				            },
				            lineStyle:{
				            	normal: {
				                    color: '#0599E6',
				                    width :1
				                }
				            },
				            areaStyle:{
				            	normal: {
				                    color: 'rgba(5,153,230,0.1)'
				                }
				            },
				            data: data
				        }
				    ]
				};
				return chartOption;
			};
			lineChart = echarts.init(document.getElementById('productChart'));
			lineChart.setOption(getOption());
		}
		//关注处理
		function collect(){
			if(customerId != null && customerId != ''){
				params = {
					"f_prodcode" : productCode
				};
				urlVar = mbank.getApiURL()+'noticeQuery.do';
				mbank.apiSend("post",urlVar,params,noticeQuerySuc,noticeQueryFail,true);
				function noticeQuerySuc(data){
					if(data.ec =="000"){
						if(data.flag =="1"){
							collectFlag = "1";
							document.getElementById("collectBtn").innerHTML = '<span class="notice_btndelico">取消</span>';
							document.getElementById("collectBtn").style.display = "block";
						}else{
							document.getElementById("collectBtn").innerHTML = '<span class="notice_btnico">关注</span>';
							document.getElementById("collectBtn").style.display = "block";
						}
					}else{
						document.getElementById("collectBtn").innerHTML = "";
						document.getElementById("collectBtn").style.display = "none";
					}
				}
				function noticeQueryFail(e){
					document.getElementById("collectBtn").innerHTML = "";
					document.getElementById("collectBtn").style.display = "none";
				}
			}else{
				document.getElementById("collectBtn").innerHTML = "";
				document.getElementById("collectBtn").style.display = "none";
			}
		}
		document.getElementById("collectBtn").addEventListener("tap",function(){
			if(collectFlag == "0"){
				params = {
					"f_prodcode" : productCode
				};
				urlVar = mbank.getApiURL()+'addNotice.do';
				mbank.apiSend("post",urlVar,params,addNoticeSuc,addNoticeFail,true);
				function addNoticeSuc(data){
					if(data.ec =="000"){
						collectFlag = "1";
						mui.toast("关注成功");
						document.getElementById("collectBtn").innerHTML = '<span class="notice_btndelico">取消</span>';
						mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshMyCollect', {});
					}else{
						mui.toast(data.em);
					}
				}
				function addNoticeFail(e){
					mui.toast(e.em);
				}
			}else{
				params = {
					"f_prodcode" : productCode
				};
				urlVar = mbank.getApiURL()+'cancelNotice.do';
				mbank.apiSend("post",urlVar,params,cancelNoticeSuc,cancelNoticeFail,true);
				function cancelNoticeSuc(data){
					if(data.ec =="000"){
						collectFlag = "0";
						mui.toast("取消关注成功");
						document.getElementById("collectBtn").innerHTML = '<span class="notice_btnico">关注</span>';
						mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshMyCollect', {});
					}else{
						mui.toast(data.em);
					}
				}
				function cancelNoticeFail(e){
					mui.toast(e.em);
				}
			}
		},false);
		
		document.getElementById("transRule").addEventListener("tap",function(){
			params = {
					"f_prodcode" : productCode,
					"f_tano" : tano,
					"buyMinAmt" : buyMinAmt,
					"buySecMinAmt" : buySecMinAmt,
					"buyStepAmt" : buyStepAmt,
					"f_b24minamt" : f_b24minamt,
					"f_holdmin" : f_holdmin,
					"f_day_payment" : f_day_payment
			};
			mbank.openWindowByLoad("../fund/fundTransRule.html","fundTransRule", "slide-in-right",params);
		},false);
		
		document.getElementById("buyBtn").addEventListener("tap",function(){
			params = {
				"noCheck" : "false",
				"f_prodcode" : productCode,
				"f_prodtype" : prodType,
				"f_tano" : tano
			};
			mbank.openWindowByLoad("../fund/fundBuy.html","fundBuy", "slide-in-right",params);
		},false);

		document.getElementById("sellBtn").addEventListener("tap",function(){
			params = {
				"noCheck" : "false",
				"accountCardNo" : currentAcct,
				"f_prodname" : prodName,
				"f_prodcode" : productCode,
				"f_tano" : tano,
				"f_prodtype" : prodType,
				"f_avdilvol" : f_avdilvol,
				"f_b24minamt" : f_b24minamt,
				"f_b25maxamt" : f_b25maxamt,
				"f_holdmin" : f_holdmin
			};
			mbank.openWindowByLoad("../fund/fundRedemption.html","fundRedemption", "slide-in-right",params);
		},false);
		
		document.getElementById("buyPlanBtn").addEventListener("tap",function(){
			params = {
				"noCheck" : "false",
				"f_prodcode" : productCode,
				"f_prodtype" : prodType,
				"f_tano" : tano
			};
			mbank.openWindowByLoad("../fund/changeInvestment.html","changeInvestment", "slide-in-right",params);
		},false);
		
		document.getElementById("dividChangeBtn").addEventListener("tap",function(){
			params = {
				"noCheck" : "false",
				"accountCardNo" : currentAcct,
				"f_prodname" : prodName,
				"f_prodcode" : productCode,
				"f_tano" : tano,
				"f_prodtype" : prodType,
				"f_dividend" : f_dividend
			};
			mbank.openWindowByLoad("../fund/fundShareChange.html","fundShareChange", "slide-in-right",params);
		},false);
		
	});
});