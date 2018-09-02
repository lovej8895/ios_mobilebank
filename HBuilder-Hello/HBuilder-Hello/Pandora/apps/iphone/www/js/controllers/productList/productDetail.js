define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var productNo = self.productNo;
		var productName = self.productName;
		var projDeadLine = self.projDeadLine;
		var raiseEndDate = self.raiseEndDate;
		var raiseEndDateShow = format.formatDate(format.parseDate(raiseEndDate, "yyyymmdd"));
		var profitRate = self.profitRate;
		var proRiskLevel = self.proRiskLevel;
		var proRiskLevelShow = parseRiskLevel(proRiskLevel);
		var originAmt = self.originAmt;
		var increaseAmt = self.increaseAmt;
		var returnurl = self.returnurl;
		var productType = self.productType;
		var productStatus = "";
		
		queryFiancingInfo();
		function queryFiancingInfo(){
			var dataNumber = {
				productNo: productNo,
				productName: productName,
				liana_notCheckUrl:false
			};
			//var url = mbank.getApiURL() + '009003_financingInfo.do';
			var url = mbank.getApiURL() + 'finacingProductInfo.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				var beginDate = data.raiseBeginDate;
				var beginDateShow = format.formatDate(format.parseDate(beginDate, "yyyymmdd"));
				var productName = data.productName;
				productStatus = data.productStatus;
				var interestBeginDate = data.productBeginDate;
				var interestBeginDateShow = format.formatDate(format.parseDate(interestBeginDate, "yyyymmdd"));
				var interestEndDate = data.productEndDate;
				var interestEndDateShow = format.formatDate(format.parseDate(interestEndDate, "yyyymmdd"));
				var startAmount = data.perFstMinbuyamt;
				var minAppendAmt = data.perBuyStepamt;
				document.getElementById("beginDate").innerHTML = beginDateShow;
				document.getElementById("endDate").innerHTML = raiseEndDateShow;
				document.getElementById("productName").innerHTML = productName;
				document.getElementById("productNo").innerHTML = productNo;
				document.getElementById("interestBeginDate").innerHTML = interestBeginDateShow;
				document.getElementById("interestEndDate").innerHTML = interestEndDateShow;
				document.getElementById("proRiskLevel").innerHTML = proRiskLevelShow;
				document.getElementById("projDeadLine").innerHTML = projDeadLine + "天";
				document.getElementById("profitRate").innerHTML = profitRate + "%";
				document.getElementById("startAmount").innerHTML = format.formatMoney(startAmount, 2) + "元";
				document.getElementById("minAppendAmt").innerHTML = format.formatMoney(minAppendAmt, 2) + "元";
				switch (productStatus) {
					case  "1" : 
						document.getElementById("nextButton").innerHTML ="预&nbsp;&nbsp;约";
						break;
					case  "2" : 
						document.getElementById("nextButton").innerHTML ="认&nbsp;&nbsp;购";
						break;
					case  "5" : 
						document.getElementById("nextButton").innerHTML ="申&nbsp;&nbsp;购";
				}
				//产品额度信息查询
				queryProductLimit(productNo,startAmount);
			}
			function errorCallback(e){
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
			mbank.apiSend("post",urlsend,paramsval,successCallback,errorCallback,true);
			
			function successCallback(data){
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
			function errorCallback(e){
		    	mui.alert(e.em);
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
		
		$("#nextButton").click(function(){
			if(!mbank.checkLogon()){
				return false;
			}
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
										productType : productType,
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
		});
		
		$('#gotoRisk1').click(function() {
			mbank.openWindowByLoad('riskAssessment.html','riskAssessment','slide-in-right',{noCheck:false});
		});
		
		$('#gotoRisk2').click(function() {
			mbank.openWindowByLoad('riskAssessment.html','riskAssessment','slide-in-right',{noCheck:false});
		});
		
		$('#turnBack1').click(function() {
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("productMarket"), 'reload', {});
		});
		
		$('#turnBack2').click(function() {
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("productMarket"), 'reload', {});
		});
		
		$('#turnBack3').click(function() {
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("productMarket"), 'reload', {});
		});
	});
});