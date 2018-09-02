define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	
	var self = "";
	var params;
	var urlVar;
	
	var chartBtn = "1";
	var capitalQueryFlag = false;
	
	var goldIntroduct;
	var goldBuyFee;
	var goldSellFee;
	var goldBuyStartAmt;
	var goldInvestTerm;
	var goldRiskPrompt;
	var goldPaySource;
	var goldTradeRule;
	
	var goldTotalVal;
	var goldUnitPrice;
	var goldTotalWeight;
	var goldProfigLoss;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		document.getElementById("productChart").style.height = plus.screen.resolutionWidth*0.45 +'px';
		queryGoldInfo();
		var customerId = userInfo.get("session_customerId");
		if(customerId != null && customerId != ''){
			isOpen("");
		}
		//产品信息，通过内管进行维护
		function queryGoldInfo(){
			params = {
				"liana_notCheckUrl" : false
			};
			urlVar = mbank.getApiURL()+'queryGoldInfo.do';
			mbank.apiSend("post",urlVar,params,queryGoldInfoSuc,queryGoldInfoFail,true);
			function queryGoldInfoSuc(data){
				if(data.ec == "000"){
					goldIntroduct = data.goldIntroduct;
					goldBuyFee = data.goldBuyFee;
					goldSellFee = data.goldSellFee;
					goldBuyStartAmt = data.goldBuyStartAmt;
					goldInvestTerm = data.goldInvestTerm;
					goldRiskPrompt = data.goldRiskPrompt;
					goldPaySource = data.goldPaySource;
					goldTradeRule = data.goldTradeRule;
					document.getElementById("goldBuyStartAmt").innerText = goldBuyStartAmt;
					document.getElementById("goldRiskPrompt").innerText = goldRiskPrompt;
					document.getElementById("goldInvestTerm").innerText = goldInvestTerm;
					document.getElementById("goldBuyFee").innerText = goldBuyFee;
					document.getElementById("goldSellFee").innerText = goldSellFee;
					document.getElementById("goldIntroduct").innerText = goldIntroduct;
					document.getElementById("goldPaySource").innerText = goldPaySource;
					document.getElementById("goldTradeRule").innerText = goldTradeRule;
					setTimeout(function() {
						chartInit();
					}, 200);
				}else{
					mui.toast(data.em);
					plus.webview.currentWebview().close();
				}
			}
			function queryGoldInfoFail(e){
				mui.toast(e.em);
				plus.webview.currentWebview().close();
			}
		}
		document.getElementById("chartBtn1").addEventListener("tap",function(){
			chartBtn = "1";
			chartBtnClass("chartBtnShow1");
			chartInit();
		},false);
		document.getElementById("chartBtn2").addEventListener("tap",function(){
			chartBtn = "2";
			chartBtnClass("chartBtnShow2");
			chartInit();
		},false);
		document.getElementById("chartBtn3").addEventListener("tap",function(){
			chartBtn = "3";
			chartBtnClass("chartBtnShow3");
			chartInit();
		},false);
		document.getElementById("chartBtn4").addEventListener("tap",function(){
			chartBtn = "4";
			chartBtnClass("chartBtnShow4");
			chartInit();
		},false);
		function chartBtnClass(btnId){
			document.getElementById("chartBtnShow1").className = "zst_tab";
			document.getElementById("chartBtnShow2").className = "zst_tab";
			document.getElementById("chartBtnShow3").className = "zst_tab";
			document.getElementById("chartBtnShow4").className = "zst_tab";
			document.getElementById(btnId).className = "zst_tab tab_on";
		}
		//查询参数计算
		function chartInit(){
			var beginDate = "";
			var endDate = "";
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
			lineChart = echarts.init(document.getElementById('productChart'));
			lineChart.clear();
			goldUnitPriceQuery(beginDate,endDate);
		}
		function goldUnitPriceQuery(beginDateVar,endDateVar){
			params = {
				
				"liana_notCheckUrl" : false,
				"turnPageBeginPos" :"",
				"turnPageShowNum" : "",
				"beginDate" : beginDateVar,
				"endDate" : endDateVar,
				"latestFlag" : '0',
				"pageStyle" : "0"
			};
			urlVar = mbank.getApiURL()+'goldUnitPriceQuery.do';
			mbank.apiSend("post",urlVar,params,goldUnitPriceQuerySuc,goldUnitPriceQueryFail,true);
			function goldUnitPriceQuerySuc(data){
				if(data.ec == "000"){
					if(data.goldPriceList.length>0){
						chartShow(data.goldPriceList,"历史金价走势");
					}else{
						mui.alert("未查询到走势图数据");
					}
				}else{
					mui.alert(data.em);
				}
			}
			function goldUnitPriceQueryFail(e){
				mui.alert(e.em);
			}
		}
		function chartShow(list,chartTitle){
			var dateList = [];
			var chartList = [];
			for(var i=0;i<list.length;i++){
				dateList.push(format.dataToDate(list[i].date));
				chartList.push(parseFloat(list[i].goldUnitPrice).toFixed(2));
			}
			var minVal = Math.min.apply(null,chartList);
			var maxVal = Math.max.apply(null,chartList);
			var section = 0;
			if(minVal == maxVal){
				section = 0.01;
				minVal = minVal-0.02;
				maxVal = maxVal+0.03;
			}else{
				section = parseFloat(((maxVal-minVal)/5+0.01).toFixed(2));
				maxVal = (5*section + minVal).toFixed(2);
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
       							return parseFloat(value).toFixed(2)+"";
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
		
		
		
		//我的
		document.getElementById("myGold").addEventListener("tap",function(){
			isOpen("myGold");
		},false);
		//卖金
		document.getElementById("sellBtn").addEventListener("tap",function(){
			isOpen("sellBtn");
		},false);
		//计划买
		document.getElementById("buyPlanBtn").addEventListener("tap",function(){
			isOpen("buyPlanBtn");
		},false);
		//随时买
		document.getElementById("buyNowBtn").addEventListener("tap",function(){
			isOpen("buyNowBtn");
		},false);
		
		//客户信息查询
		function isOpen(btnId){
			customerId = userInfo.get("session_customerId");
			if(customerId != null && customerId != ''){
				if(userInfo.get("session_certType") == '0'){
					params = {
						"certType" : "s"
					};
					urlVar = mbank.getApiURL()+'goldCustInfoQuery.do';
					mbank.apiSend("post",urlVar,params,goldCustInfoQuerySuc,goldCustInfoQueryFail,true);
					function goldCustInfoQuerySuc(data){
						if(data.ec =='000'){
							if(data.goldAipNo){
								var accountNo = data.accountNo;
								var goldAipNo = data.goldAipNo;
								if(!isAppendAcc(accountNo)){
									mui.confirm("您的黄金定投签约账户并未加挂在手机银行，请前往加挂或换卡","温馨提示",["确认", "取消"], function(event) {
										if (event.index == 0) {
											params = {
												"goldAipNo" :goldAipNo,
												"accountNo" : accountNo
											};
											mbank.openWindowByLoad('../gold/goldAcctChangeOrAdd.html','goldAcctChangeOrAdd','slide-in-right',params);
										}else{
											return;
										}
									});
								}else{
									if(!capitalQueryFlag){
										queryGoldCapital(goldAipNo);
									}
									if(btnId =='buyPlanBtn'){
										params = {
											"accountNo" : accountNo,
											"goldAipNo" : goldAipNo,
											"noCheck" : "false"
										};
							            mbank.openWindowByLoad("../gold/goldBuyPlanInput.html","goldBuyPlanInput", "slide-in-right",params);
									}else if(btnId =='buyNowBtn'){
										params = {
											"accountNo" : accountNo,
											"goldAipNo" : goldAipNo,
											"noCheck" : "false"
										};
							            mbank.openWindowByLoad("../gold/goldBuyNowInput.html","goldBuyNowInput", "slide-in-right",params);
									}else if(btnId =='myGold'){
										params = {
											"accountNo" : accountNo,
											"goldAipNo" : goldAipNo,
											"noCheck" : "false"
										};
										mbank.openWindowByLoad('../gold/myGold.html','myGold','slide-in-right',params);
									}else if(btnId =='sellBtn'){
										params = {
											"accountNo" : accountNo,
											"goldAipNo" : goldAipNo,
											"goldTotalWeight" : goldTotalWeight,
											"noCheck" : "false"
										};
										mbank.openWindowByLoad('../gold/goldSellInput.html','goldSellInput','slide-in-right',params);
									}else{
										return;
									}
								}
							}else{
								if(btnId){
									goOpen(btnId)
								}else{
									return false;
								}
							}
						}else if(data.ec =='HJ1000' || data.ec =='HJ1001' || data.ec =='KG1001'|| data.ec =='KG1006' || data.ec =='KG1035'){
							if(btnId){
								goOpen(btnId)
							}else{
								return false;
							}
						}else{
							mui.alert(data.em);
							return false;
						}
					}
					function goldCustInfoQueryFail(e){
						if(e.ec =='HJ1000' || e.ec =='HJ1001' || e.ec =='KG1001'|| e.ec =='KG1006' || e.ec =='KG1035'){
							if(btnId){
								goOpen(btnId)
							}else{
								return false;
							}
						}else{
							mui.alert(e.em);
							return false;
						}
					}
				}else{
					mui.alert("尊敬的客户您好，黄金交易仅身份证注册客户可操作，敬请谅解");
					return false;
				}
			}else{
				mbank.checkLogon();
			}
		}
		
		function goOpen(btnId){
			mui.confirm("您尚未开通黄金账户，是否前往开通？","温馨提示",["确定", "取消"], function(event) {	
				if(event.index == 0){
					params = {
						"noCheck" : "false",
						"goPageId" : btnId
					};
					mbank.openWindowByLoad("../gold/goldAcctOpen.html","goldAcctOpen", "slide-in-right",params);
				}else{
					return false;
				}
			});
		}
		//客户持有信息,当客户未持有时是否当前金价
		function queryGoldCapital(goldAipNo){
			params = {
				"goldAipNo" : goldAipNo
			};
			urlVar = mbank.getApiURL()+'goldCapitalQuery.do';
			mbank.apiSend("post",urlVar,params,goldCapitalQuerySuc,goldCapitalQueryFail,true);
			function goldCapitalQuerySuc(data){
				if(data.ec =='000'){
					capitalQueryFlag = true;
					goldUnitPrice = data.goldUnitPrice;
					goldTotalWeight = data.goldStorCanUseBal;
					goldTotalVal = parseFloat(goldTotalWeight)*parseFloat(goldUnitPrice);
					goldProfigLoss = parseFloat(goldTotalWeight)*(parseFloat(goldUnitPrice)-parseFloat(data.goldWeightedPrice));
					document.getElementById('goldTotalVal').innerText = format.formatMoney(goldTotalVal);
					document.getElementById('goldUnitPrice').innerText = format.formatMoney(goldUnitPrice);
					document.getElementById('goldTotalWeight').innerText = goldTotalWeight;
					document.getElementById('goldProfigLoss').innerText = format.formatMoney(goldProfigLoss);
					if(parseFloat(goldTotalVal)>0){
						document.getElementById('sellBtn').removeAttribute("disabled");
					}
				}
			}
			function goldCapitalQueryFail(e){
					
			}
		}
		
		function isAppendAcc(signAcc){
			var flag = false;
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				if(data.length>0){
					for(var i=0;i<data.length;i++){
						if(data[i].accountNo == signAcc){
							flag = true;
							break;
						}
					}
				}
			}
			return flag;
		}
	});
});