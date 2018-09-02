define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	
	var self = "";
	var params;
	var urlVar;
	var customerId = "";
	var chartType = "1";
	var collectFlag = "0"
	var productCode = "";
	var prodType = "";
	var tano = "";
	var prodName = "";
	var risklevel = "";
	var currentAcct = "";
	var lastIncome = 0;
	var totalAmt = 0;
	var allIncome = 0;
	var f_cust_risk = "";
	var f_risk_end_date = "";
	var times = 0;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		customerId = userInfo.get("session_customerId");
		self = plus.webview.currentWebview();
		productCode = self.f_prodcode;
		prodType = self.f_prodtype;
		tano = self.f_tano;
		currentAcct = self.currentAcct;
		
		document.getElementById("productChart").style.height = plus.screen.resolutionWidth*0.45 +'px';
		if(currentAcct == null || currentAcct =="" || currentAcct ==undefined || currentAcct =='undefined'){
			getDefaultAcc();
		}else{
			loadAccountList();
		}
		searchFundDetail();
		setTimeout(function() {
			cashFundTrendChart();
		}, 200);
		collect();
		
		window.addEventListener("refreshCashFundDetail", function(event) {
			cashFundCapitalQuery();
		});

		
		function getDefaultAcc(){
			params = {};
			urlVar = mbank.getApiURL()+'filterSignList.do';
			mbank.apiSend("post",urlVar,params,getDefaultAccSuc,getDefaultAccFail,true);
			function getDefaultAccSuc(data){
				if(data.ec == "000"){
					var custList = data.f_iCustSignInfoList;
					if(custList.length>0){
						for(var i=0;i<custList.length;i++){
							if(custList[i].f_cust_status =="0" && (custList[i].f_sign_status =="1" || custList[i].f_sign_status =="3") && custList[i].f_open_busin_yeb=="5"){
								currentAcct = custList[i].f_deposit_acct;
								break;
							}
						}
						loadAccountList();
					}else{
						loadAccountList();
					}
				}else{
					loadAccountList();
				}
			}
			function getDefaultAccFail(e){
				loadAccountList();
			}
		}
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
					risklevel = data.f_iProductInfo[0].f_risklevel;
					var f_fundincome = data.f_iProductInfo[0].f_fundincome;
					document.getElementById("prodName").innerText = prodName;
					document.getElementById("productCode").innerText = "(" + productCode + ")";
					document.getElementById("propTypeShow").innerText =jQuery.param.getDisplay("FUND_PRODTYPE",prodType);
					document.getElementById("risklevelShow").innerText =jQuery.param.getDisplay("FUND_RISK_LEVEL",risklevel);
					//风险等级图标
					if(risklevel == "01" || risklevel == "02"){
						document.getElementById("risklevelIcon").className="fundpro_lxicon fund_fxejd";
					}else if(risklevel == "03"){
						document.getElementById("risklevelIcon").className="fundpro_lxicon fund_fxejm";
					}else{
						document.getElementById("risklevelIcon").className="fundpro_lxicon fund_fxejh";
					}
					document.getElementById("f_fundincome").innerText = parseFloat(f_fundincome).toFixed(4);
				}else{
					mui.alert(data.em);
				}
			}
			function searchFundDetailFail(e){
				mui.alert(e.em);
			}
		}
		//账户加载
		function loadAccountList(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				var iAccountList = data;
				var accountPickerList = [];
				for( var i=0;i<iAccountList.length;i++ ){
					var pickItem = {
						value:iAccountList[i].accountNo,
						text:iAccountList[i].accountNo
					};
					accountPickerList.push(pickItem);
				}
				var accountPicker = new mui.SmartPicker({title:"请选择交易账号",fireEvent:"accountChange"});
				accountPicker.setData(accountPickerList);
				
				if(currentAcct == null || currentAcct =="" || currentAcct ==undefined || currentAcct =="null" || currentAcct =='undefined'){
					currentAcct = iAccountList[0].accountNo;
				}
				document.getElementById("buyInBtn").removeAttribute("disabled");
				document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
				cashFundCapitalQuery();	
				document.getElementById("changeAccount").addEventListener("tap",function(){
					accountPicker.show();
				},false);
			}
		}
		window.addEventListener("accountChange",function(event){
			lastIncome = 0;
			totalAmt = 0;
			allIncome = 0;
			document.getElementById("buyOutBtn").setAttribute("disabled",true);
			currentAcct = event.detail.value;
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
			cashFundCapitalQuery();
        });
		
		function cashFundCapitalQuery(){
			params = {
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "1",
				"f_deposit_acct" : currentAcct,
				"f_tano" : tano,
				"f_prodcode" : productCode
			};
			urlVar = mbank.getApiURL()+'cashFundCapitalQuery.do';
			mbank.apiSend("post",urlVar,params,cashFundCapitalQuerySuc,cashFundCapitalQueryFail,true);
			function cashFundCapitalQuerySuc(data){
				if(data.ec =="000"){
					if(data.f_cashHoldFundList.length>0){
						lastIncome = data.f_cashHoldFundList[0].f_incomeamount;
						totalAmt = data.f_cashHoldFundList[0].f_fundvol;
						allIncome = data.f_cashHoldFundList[0].f_sumincome;
						showMsg();
					}else{
						showMsg();
					}
				}else{
					showMsg();
				}
			}
			function cashFundCapitalQueryFail(e){
				showMsg();
			}
		}
		function showMsg(){
			document.getElementById("lastIncome").innerText = format.formatMoney(lastIncome);
			document.getElementById("totalAmt").innerText = format.formatMoney(totalAmt);
			document.getElementById("allIncome").innerText = format.formatMoney(allIncome);
			if(parseFloat(totalAmt) >0){
				document.getElementById("buyOutBtn").removeAttribute("disabled");
			}
		}
//		走势图
		function cashFundTrendChart(){
			params = {
				"liana_notCheckUrl" : false,
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "7",
				"f_tano" : tano,
				"f_prodcode" : productCode
			};
			urlVar = mbank.getApiURL()+'cashFundTrendChart.do';
			mbank.apiSend("post",urlVar,params,cashFundTrendChartSuc,cashFundTrendChartFail,true);
			function cashFundTrendChartSuc(data){
				if(data.ec =="000"){
					var list = data.f_productTrendChart;
					if(list.length>0){
						yieldTrendChart(list);
//						fundincome(list);
					}else{
						mui.alert("未查询到走势图数据");
					}
				}else{
					mui.alert(data.em);
				}
			}
			function cashFundTrendChartFail(e){
				mui.alert(e.em);
			}
		}
		//七日年化收益率走势图数据计算
		function yieldTrendChart(list){
			var dateList = [];
			var chartList = [];
			for(var i=0;i<list.length;i++){
				dateList.push(format.dataToDate(list[i].f_navdate));
				chartList.push(parseFloat(list[i].f_yield).toFixed(4));
			}
			var minVal = Math.min.apply(null,chartList);
			var maxVal = Math.max.apply(null,chartList);
			var section = 0;
			if(minVal == maxVal){
				section = 0.0001;
				minVal = minVal-0.0002;
				maxVal = maxVal+0.0003;
			}else{
				section = parseFloat(((maxVal-minVal)/5+0.0001).toFixed(4))*2;
				if(minVal>section){
					minVal = minVal-section;
				}
				maxVal = (5*section + minVal).toFixed(4);
			}
			trendChart(dateList,chartList,"七日年化收益",minVal,maxVal,section);
		}
//		function fundincome(list){
//			document.getElementById("f_fundincome").innerText = list[list.length-1].f_fundincome;
//		}
		//走势图
		function trendChart(dx,data,seriesName,minVal,maxVal,section){
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
				            showAllSymbol:true,
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
			var lineChart = echarts.init(document.getElementById('productChart'));
			lineChart.setOption(getOption());
		}
		//关注
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
						mui.fire(plus.webview.getWebviewById("myNotice"), 'refreshNotice', {});
					}else{
						mui.toast(data.em);
					}
				}
				function cancelNoticeFail(e){
					mui.toast(e.em);
				}
			}
		},false);
		//转入
		document.getElementById("buyInBtn").addEventListener("click",function(){
			document.getElementById("buyInBtn").setAttribute("disabled",true);
			if(currentAcct == null || currentAcct =="" || currentAcct == undefined || currentAcct =='undefined'){
				document.getElementById("buyInBtn").removeAttribute("disabled");
				mui.alert("请选择付款账户","温馨提示");
				return;
			}
			times = 0;
			cashTransferInto();
//			getCustInfo();
		},false);
		//转出
		document.getElementById("buyOutBtn").addEventListener("tap",function(){
			if(currentAcct == null || currentAcct =="" || currentAcct == undefined || currentAcct =='undefined'){
				mui.alert("请选择付款账户","温馨提示");
				return;
			}
			params = {
				"noCheck" : "false",
				"f_prodcode" : productCode,
				"f_prodname" : prodName,
				"currentAcct" : currentAcct,
				"f_prodtype" : prodType,
				"f_tano" : tano,
				"f_avdilvol" : totalAmt
			};
			mbank.openWindowByLoad("../fund/fundTreasureOut.html","fundTreasureOut", "slide-in-right",params);
		},false);
		//每月定额转入
		/*document.getElementById("buyPlanBtn").addEventListener("tap",function(){
			mui.alert("跳转到每月定额转入功能");
		},false);*/
		
		//交易明细
		document.getElementById("totalAmtDiv").addEventListener("tap",function(){
			params = {
				"noCheck" : "false",
				"f_deposit_acct" : currentAcct,
				"f_tano" : tano,
				"f_prodcode" : productCode
			};
			mbank.openWindowByLoad("../fund/treasureClassTransQueryDetail.html","treasureClassTransQueryDetail", "slide-in-right",params);
		},false);
		
		//收益明细
		document.getElementById("allIncomeDiv").addEventListener("tap",function(){
			params = {
				"noCheck" : "false",
				"f_deposit_acct" : currentAcct,
				"f_tano" : tano,
				"f_prodcode" : productCode
			};
			mbank.openWindowByLoad("../fund/treasureClassIncomeQueryDetail.html","treasureClassIncomeQueryDetail", "slide-in-right",params);
		},false);
		
		function getCustInfo(){
			params = {
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "1",
				"f_cust_type":"1",
				"f_deposit_acct":currentAcct
			};
			urlVar = mbank.getApiURL() + 'queryCustSignInfo.do';
			mbank.apiSend('post',urlVar,params,queryCustSignInfoSuc,queryCustSignInfoFail,false);
			function queryCustSignInfoSuc(data){
				if(data.ec == "000"){
					var currObj = data.f_iCustSignInfoList;
					if(currObj.length==0){
						cashFundSign();
					}else{
						var custStatus = currObj[0].f_cust_status;
						var signStatus = currObj[0].f_sign_status;
						var f_open_busin_yeb = currObj[0].f_open_busin_yeb;
						f_risk_end_date = currObj[0].f_risk_end_date;
						f_cust_risk = currObj[0].f_cust_risk;
						if(custStatus =="0" && (signStatus =="1" || signStatus =="3") && f_open_busin_yeb =="5"){
							cashTransferInto();
						}else{
							if(times >2){
								document.getElementById("buyInBtn").removeAttribute("disabled");
								mui.alert("基金系统返回数据异常");
								return;
							}else{
								cashFundSign();
							}
						}
					}
				}else{
					document.getElementById("buyInBtn").removeAttribute("disabled");
					mui.alert(data.em);
					return;
				}
			}
			function queryCustSignInfoFail(e){
				document.getElementById("buyInBtn").removeAttribute("disabled");
				mui.alert(e.em);
				return;
			}
		}
		function cashFundSign(){
			params = {
				"f_tano" : tano,
				"f_mobile_telno":userInfo.getItem("logonId"),
				"f_deposit_acct":currentAcct
			};
			urlVar = mbank.getApiURL() + 'cashFundSign.do';
			mbank.apiSend('post',urlVar,params,cashFundSignSuc,cashFundSignFail,false);
			function cashFundSignSuc(data){
				if(data.ec =="000"){
					times++;
					getCustInfo();
				}else{
					document.getElementById("buyInBtn").removeAttribute("disabled");
					mui.alert(data.em);
					return;
				}
			}
			function cashFundSignFail(e){
				document.getElementById("buyInBtn").removeAttribute("disabled");
				mui.alert(e.em);
				return;
			}
		}
		function cashTransferInto(){
			params = {
				"noCheck" : "false",
				"f_prodcode" : productCode,
				"f_prodtype" : prodType,
				"f_prodname" : prodName,
				"f_tano" : tano,
				"f_deposit_acct":currentAcct
//				"f_cust_risk" : f_cust_risk,
//				"f_risk_end_date" : f_risk_end_date
			};
			document.getElementById("buyInBtn").removeAttribute("disabled");
			mbank.openWindowByLoad("../fund/cashTransferInto.html","cashTransferInto", "slide-in-right",params);
		}
		
		document.getElementById("productIntro").addEventListener("tap",function(){
			mbank.openWindowByLoad("../fund/cashFundProductIntro.html","cashFundProductIntro", "slide-in-right","");
		},false);
		
		document.getElementById("agreement").addEventListener("tap",function(){
			mbank.openWindowByLoad("../fund/cashFundAgreement.html","cashFundAgreement", "slide-in-right","");
		},false);
		
	});
	/*function getCustInfo(){
		var param = {
			"turnPageBeginPos" : "1",
			"turnPageShowNum" : "1",
			f_cust_type:"1",
			f_deposit_acct:currentAcct
		};
		var url = mbank.getApiURL() + 'queryCustSignInfo.do';
		mbank.apiSend('post',url,param,successCallback,null,false);
		function successCallback(data){
			if(data.ec == "000"){
				var currObj = data.f_iCustSignInfoList;
				if(currObj.length==0){
//					mui.alert("查询不到该卡号的客户信息");
					mui.confirm("客户尚未签约宝类系统，是否前往签约？","温馨提示",["确定", "取消"], function(event) {	
			            if(event.index == 0){
			            	var params = {
			            		f_deposit_acct:currentAcct,
			            		f_tano : tano
			            	}
			                mbank.openWindowByLoad("../fund/treasureClassSign_Input.html","treasureClassSign_Input", "slide-in-right",params);
			            }else{
			                return false;
			            }
			        });
				}else{
					var custStatus = currObj[0].f_cust_status;
					var signStatus = currObj[0].f_sign_status;
					var f_open_busin_yeb = currObj[0].f_open_busin_yeb;
					var f_risk_end_date = currObj[0].f_risk_end_date;
					var f_cust_risk = currObj[0].f_cust_risk;
					var f_telno = currObj[0].f_telno;
					var f_cust_name = currObj[0].f_cust_name;
					var f_id_type = currObj[0].f_id_type;
					var f_id_code = currObj[0].f_id_code;
					if(custStatus!='0'){
						mui.confirm("账户状态异常，是否前往签约？","温馨提示",["确定", "取消"], function(event) {	
				            if(event.index == 0){
				            	var params = {
				            		f_deposit_acct:currentAcct,
			            			f_tano : tano
				            	}
				                mbank.openWindowByLoad("../fund/treasureClassSign_Input.html","treasureClassSign_Input", "slide-in-right",params);
				            }else{
				                return false;
				            }
				        });
					}
					if((signStatus!='1'&&signStatus!='3')||f_open_busin_yeb!='5'){
						mui.confirm("客户尚未签约宝类系统，是否前往签约？","温馨提示",["确定", "取消"], function(event) {	
				            if(event.index == 0){
				            	var params = {
				            		f_deposit_acct:currentAcct,
				            		f_telno:f_telno,
				            		f_tano : tano,
				            		f_cust_name :f_cust_name,
				            		f_id_type : f_id_type,
				            		f_id_code : f_id_code
				            	}
				                mbank.openWindowByLoad("../fund/treasureClassSign_Input.html","treasureClassSign_Input", "slide-in-right",params);
				            }else{
				                return false;
				            }
				        });
					}else{
						params = {
							"noCheck" : "false",
							f_prodcode : productCode,
							f_prodtype : prodType,
							f_tano : tano,
							f_deposit_acct : currentAcct,
							f_cust_risk : f_cust_risk,
							f_risk_end_date : f_risk_end_date
						};
						mbank.openWindowByLoad("../fund/cashTransferInto.html","cashTransferInto", "slide-in-right",params);
					}
				}
			}
		}
	}*/
	
	
});