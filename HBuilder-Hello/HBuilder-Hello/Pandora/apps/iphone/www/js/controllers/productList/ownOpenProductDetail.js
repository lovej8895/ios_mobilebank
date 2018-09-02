define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var productNo = self.productNo;
		var productName = self.productName;
		var currencyType = self.currencyType;
		var transferSum = self.transferSum;
		var finanTransferVol = self.finanTransferVol;
		var interestBeginDate = self.interestBeginDate;
		var interestEndDate = self.interestEndDate;
		var yieldRate = self.yieldRate;
		var flag = self.flag;
		var status = self.status;
		var accountNo = self.accountNo;
		var productType = self.productType;
		var remainVol=self.remainVol;
		var minHold=self.minHold;
		//产品接口中获取到的数据
		var projDeadLine;
		var raiseEndDate;
//		var raiseEndDateShow = format.formatDate(format.parseDate(raiseEndDate, "yyyymmdd"));
		var profitRate;
		var proRiskLevel;
//		var proRiskLevelShow = parseRiskLevel(proRiskLevel);
		var originAmt;
		var increaseAmt;
		var returnurl;
		var productStatus;

		document.getElementById("productChart").style.height = plus.screen.resolutionWidth*0.48 +'px';

		document.getElementById('productName').innerText = productName;
		document.getElementById('profitRate').innerText = yieldRate +'%';
		document.getElementById("transferSum").innerHTML = format.formatMoney(transferSum, 2) + "元";
		document.getElementById("interestBeginDate").innerHTML = format.formatDate(format.parseDate(interestBeginDate, "yyyymmdd"));;
		document.getElementById("interestEndDate").innerHTML = format.formatDate(format.parseDate(interestEndDate, "yyyymmdd"));
		if (flag == '1') {
			document.getElementById('redem').removeAttribute("disabled");
		}
		
		document.getElementById("redem").addEventListener("tap",function(){
			var params = {
				'accountNo' : accountNo,
				'productNo' : productNo,
				'productName' : productName,
				'finanTransferVol' : finanTransferVol,
				'noCheck' : false,
				'minHold':minHold,
				'remainVol':remainVol
			};
			mbank.openWindowByLoad('productRedemInput.html','productRedemInput','slide-in-right',params);
		},false);
		dateListShow();
		stairInerestChart('');
		queryFiancingInfo();
		function stairInerestChart(tranDate){
			params = {
				"liana_notCheckUrl" : false,
				"turnPageBeginPos" : '1',
				"turnPageShowNum" : '30',
				"productNo" : productNo,
				"tranDate" : tranDate
			};
			urlVar = mbank.getApiURL()+'stairInterestQuery.do';
			mbank.apiSend("post",urlVar,params,stairInerestChartSuc,stairInerestChartFail,true);
			function stairInerestChartSuc(data){
				if(data.ec =="000"){
					var list = data.financingPorofitrateList;
					if(list.length>0){
						yieldTrendChart(list);
					}else{
						mui.alert("未查询到利率数据。");
						document.getElementById("productChart").style.display = 'none';
					}
				}else{
					mui.alert(data.em);
					document.getElementById("productChart").style.display = 'none';
				}
			}
			function stairInerestChartFail(e){
				mui.alert(e.em);
				document.getElementById("productChart").style.display = 'none';
			}
		}
		
		//阶梯利率图数据计算
		function yieldTrendChart(list){
			var dateList = [];
			var chartList = [];
			var data = [];
			for(var i=0;i<list.length;i++){
				if(i < list.length -1){
					dateList.push("    " + list[i].overDay+"天");
				}else{
					dateList.push("");
				}
				chartList.push((parseFloat(list[i].profitRate)*100.00).toFixed(2));
			}
			var minVal = Math.min.apply(null,chartList);
			var maxVal = Math.max.apply(null,chartList);
			var section = 0;
			if(minVal == maxVal){
				section = 0.1;
				minVal = minVal-0.2;
				maxVal = maxVal+0.3;
			}else{
				section = parseFloat(((maxVal-minVal)/5+0.1).toFixed(2));
				if(minVal>section){
					minVal = minVal-section;
				}
				maxVal = (section + maxVal).toFixed(2);
			}
			trendChart(dateList,chartList,"",minVal,maxVal,section);
		}

		function trendChart(dx,data,seriesName,minVal,maxVal,section){
			var distance = '4%';
			if(data.length==1){
				distance = '39%';
			}else if(data.length ==2){
				distance = '34%';
			}else if(data.length ==3){
				distance = '29%';
			}else if(data.length ==4){
				distance = '24%';
			}else if(data.length ==5){
				distance = '19%';
			}else if(data.length ==6){
				distance = '14%';
			}else if(data.length ==7){
				distance = '9%';
			}else{
				distance = '4%';
			}
			var getOption = function() {
				var chartOption = {
					grid: {
						left:distance,
						top:0,
						right:distance,
						bottom:20,
						show:true,
						borderWidth:0,
					},
					xAxis: {
				    	show:true,
				        type: 'category',
				        data:dx,
				        boundaryGap:true,
				        axisLine:{
				        	show:false
				        },
				        axisTick:{
				        	show:false
				        },
				        axisLabel:{
				        	show:true,
				        	interval: function (index) {
				                return (index === 0) || index;
				            },
				            margin:5,
				        	textStyle: {
				        		color: '#999999',
				        		align: 'left',
				        		fontSize:11
				        	}
				        }
				    },
				    yAxis: {
				    	show:false,
				        type: 'value',
				        scale:true,
				        min:minVal,
				        max:maxVal,
				        interval:section
				    },
				    series:[
				        {
				            type:'bar',
				            barWidth: '100%',
				            barMaxWidth: '30px',
			            	itemStyle: {
				                normal: {
				                    color: 'rgba(5,153,230,0.1)',
				                    borderColor: new echarts.graphic.LinearGradient(
				                        0, 0, 0, 1,
				                        [
				                            {offset: 0, color: 'rgba(5,153,230,1)'},
				                            {offset: 1, color: 'rgba(5,153,230,0.1)'},
				                        ]
				                    ),
				                    borderWidth :'1',
				                    shadowColor:'rgba(5,153,230,1)',
				                    label:{
				                    	 show: true,
				                    	 position: 'top',
				                    	 textStyle:{
				                    	 	color :'#000000'
				                    	 }
				                    }
				                }
				            },
				            data: data
				        }
				    ]
				};
				return chartOption;
			};
			lineChart = echarts.init(document.getElementById('productChart'));
			lineChart.clear();
			lineChart.setOption(getOption());
		}
		
		$("#productInfo").click(function(){
			var params = {
				productNo : productNo,
			};
			mbank.openWindowByLoad('productInfo.html','productInfo','slide-in-right',params);
	    });
	    
	    function dateListShow(){
			params = {
				"liana_notCheckUrl" : false,
				"productNo" : productNo
			};
			urlVar = mbank.getApiURL()+'financingPorofitrateDateQuery.do';
			mbank.apiSend("post",urlVar,params,dateListShowSuc,dateListShowFail,true);
			function dateListShowSuc(data){
				if(data.ec =="000"){
					var list = data.porofitrateDateList;
					var htmlA = '';
					var htmlB = '';
					if(list.length>0){
        				for(var i=0;i<list.length;i++){
        					if(i == 0){
        						htmlA +='<a class="mui-control-item mui-active fz_12" href="#item'+i+'" id="tranDate'+i+'" data="'+list[i].tranDate+'">'+format.formatDate(format.parseDate(list[i].tranDate, "yyyymmdd"))+'</a>';
        						htmlB +='<div id="item'+i+'" class="mui-slider-item mui-control-content mui-active"></div>';
        					}else{
        						htmlA +='<a class="mui-control-item fz_12" href="#item'+i+'" id="tranDate'+i+'" data="'+list[i].tranDate+'">'+format.formatDate(format.parseDate(list[i].tranDate, "yyyymmdd"))+'</a>';
        						htmlB +='<div id="item'+i+'" class="mui-slider-item mui-control-content"></div>';
        					}
        				}
        				document.getElementById('tranDateTitle').innerHTML = htmlA;
        				document.getElementById('tranDateContent').innerHTML = htmlB;
        				document.getElementById('sliderTitle').style.display = 'block';
						document.getElementById('slider').style.display = 'block';
					}
				}
			}
			function dateListShowFail(e){
			}
		}
		
		document.getElementById('slider').addEventListener('slide', function(e) {
			var slideNumber = event.detail.slideNumber;
			var thisDate = document.getElementById('tranDate'+slideNumber).getAttribute("data");
			lineChart = echarts.init(document.getElementById('productChart'));
			lineChart.clear();
			stairInerestChart(thisDate);
		});
		function parseRiskLevel(proRiskLevel) {
			switch (proRiskLevel) {
				case  "01" : return "高风险产品";
				case  "02" : return "较高风险产品";
				case  "03" : return "中等风险产品";
				case  "04" : return "较低风险产品";
				default : return "低风险产品";
			}
		}
		function parseCusRiskLevel(cusRiskLevel) {
			switch (cusRiskLevel) {
				case  "01" : return "激进型";
				case  "02" : return "进取型";
				case  "03" : return "平衡型";
				case  "04" : return "稳健型";
				case  "05" : return "谨慎型";
				default : return "";
			}
		}
		document.getElementById("nextButton").addEventListener("tap",function(){
			if(!mbank.checkLogon()){
				return false;
			}
			var dataNumber = {
				flag : 0,
				cstType : "1",
				turnPageBeginPos : '1',
				turnPageShowNum : '1',
				productNo : productNo,
				liana_notCheckUrl:false
			};
			var url = mbank.getApiURL() + 'financingOpenQuery.do';
			mbank.apiSend("post",url,dataNumber,financingOpenQuerySuc,financingOpenQueryFail,true);
			function financingOpenQuerySuc(data){
				var proList =  data.iFiancinglist[0];
				projDeadLine = proList.projDeadLine;
				raiseEndDate = proList.raiseEndDate;
				profitRate = proList.profitRate;
				proRiskLevel = proList.proRiskLevel;
				originAmt = proList.originAmt;
				increaseAmt = proList.increaseAmt;
				returnurl = proList.returnurl;
				productStatus = proList.productStatus;
				goBuy();
			}
			function financingOpenQueryFail(e){
				mui.alert(e.em);
			}
		},false);
		
		function goBuy(){
			// 查询客户返回信息
			var riskendDate,cusriskLevel,currentTime,cstno,cstType,certType,certNo,isExistCst,riskendDateflag;
			var dataNumber = {
				cstType : 1,
				certType : userInfo.getSessionData("session_certType"),
				certNo : userInfo.getSessionData("session_certNo")
			}
			var url = mbank.getApiURL() + 'queryCstInfo.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				if(data.cstno == null){
					mui.alert("不存在客户信息！");
					isExistCst = 0;
					return false;
				}else{
					riskendDate = $.trim(data.riskendDate);
					cusriskLevel = data.cusriskLevel;
					currentTime = data.currentTime;
					cstno = data.cstno;
					cstType = data.cstType;
					certType = data.certType;
					certNo = data.certNo;
					riskendDateflag = data.flag;
					
					if (riskendDate == null || riskendDate.length < 8) {
						isExistCst = 0;
					} else {
						// 风险等级过期
						$('#failcusriskLevel').html(parseCusRiskLevel(cusriskLevel));
						$('#failriskendDate').html(format.formatDate(format.parseDate(riskendDate, "yyyymmdd")));
						
						// 风险等级不匹配
						$('#highercusriskLevel').html(parseCusRiskLevel(cusriskLevel));
						$('#higherriskendDate').html(format.formatDate(format.parseDate(riskendDate, "yyyymmdd")));
						$('#higherproRiskLevel').html(parseRiskLevel(proRiskLevel));
					}
					
					// 首次风险评估页面
					if(isExistCst == 0){
						$('#noRisk').show();
						$('#productList').hide();
					}else{
						//风险评估过期
						if(riskendDateflag == 0) {
							$('#productList').hide();
							$('#obsolete').show();
						} else {
							var dataNumber = {
								certType : certType,
								certNo : certNo,
								productNo : productNo
							};
							var url = mbank.getApiURL() + '009003_riskMarry.do';
							mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
							function successCallback(data){
								var riskResultFlag = data.riskResultFlag;
								// 风险不匹配
								if(riskResultFlag == 2){
									$('#productList').hide();
									$('#higherRisk').show();
								}else if(riskResultFlag == 1){
									var params = {
										productNo : productNo,
										projDeadLine : projDeadLine,
										yieldRate : profitRate,
										cstno : cstno,
										cstType : cstType,
										certType : certType,
										certNo : certNo,
										productName : productName,
										productStatus : productStatus,
										originAmt : originAmt,
										increaseAmt : increaseAmt,
										returnurl : returnurl,
										productType :productType,
										noCheck:false
									};
									mbank.openWindowByLoad('productBuy.html','productBuy','slide-in-right',params);
								}
							}
							function errorCallback(e){
						    	mui.alert(e.em);
						    }
						}
					}
				}
			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
		function queryFiancingInfo(){
			var dataNumber = {
				productNo: productNo,
				productName: productName,
				liana_notCheckUrl:false
			};
			var url = mbank.getApiURL() + 'finacingProductInfo.do';
			mbank.apiSend("post",url,dataNumber,finacingProductInfoSuc,finacingProductInfoFail,true);
			function finacingProductInfoSuc(data){
				var startAmount = data.perFstMinbuyamt;
				queryProductLimit(productNo,startAmount);
			}
			function finacingProductInfoFail(e){
		    	mui.alert(e.em);
		    }
		}
		function queryProductLimit(productNoTemp,startAmountTemp){
			var paramsval = {
				prod_code:productNoTemp,
				org_type:"1",
				org_id:"X0000",
				liana_notCheckUrl:false
			};
			var urlsend = mbank.getApiURL() + 'queryProductLimitInfo.do';
			mbank.apiSend("post",urlsend,paramsval,queryProductLimitInfoSuc,queryProductLimitInfoFail,true);
			function queryProductLimitInfoSuc(data){
				var plan_total_quota = data.plan_total_quota;//本机构总额度
				var plan_total_used_quota = data.plan_total_used_quota;//本机构已用额度
				var surplus_quota = data.surplus_quota;//可销售额度
				//如果可销售额度小于起购金额禁用按钮
				if (surplus_quota!=null && surplus_quota!="") {
					if (parseFloat(surplus_quota) < parseFloat(startAmountTemp)) {
						document.getElementById("nextButton").innerHTML ="本渠道已售罄";
						$("#nextButton").attr({"disabled":"disabled"});
					}
				}
			}
			function queryProductLimitInfoFail(e){
		    	mui.alert(e.em);
		    }
		}
	
	});
});