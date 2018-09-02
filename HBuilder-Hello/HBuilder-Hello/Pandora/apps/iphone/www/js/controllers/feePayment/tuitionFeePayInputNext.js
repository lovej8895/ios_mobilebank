define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var userInfo = require('../../core/userInfo');
	
	var self = "";//上个页面传来的数据
    var orderFlowNo = "";//流水号
    var currentAcct = "";//付款账号
    var balance = 0;//账户余额
    var daypayment = "";//限额
    var urlVar = "";//交易地址
    var chargeType = "";
    
    var areaNam = "";//缴费区域
	var areaNo = "";//缴费区域编号
	var unitNam = "";//缴费单位
	var unitNo = "";//缴费单位编号
	var batNo = "";//批次编号
    var batSts = "";//批次状态
	var payNo = "";//缴费编号
	var studNam = "";//姓名
	var eve = "";//校验结果
	var payNum = 0;//缴费项目数
	var feeNo = "";//项目名称
	var Amt = "";//金额
	var feeNam = "";//项目名称
	var SumAmt = 0;//应缴金额
    var FeeMst = '';//缴费标志
    
    var params;//参数集合
    
    var AllRec_FeeNo = [];//缴费项目编号
    var AllRec_Amt = [];//缴费金额
    
    var checkFlag = false;//全选标志
    
	mui.init();//页面初始化
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		//获取当前窗口对象
		self = plus.webview.currentWebview();
		
		areaNam = self.AreaNam;
		areaNo = self.AreaNo;
		unitNam = self.UnitNam;
		unitNo = self.UnitNo;
		batNo = self.BatNo;
		batSts = self.BatSts;
		payNo = self.payNo;
		studNam = self.StudNam;
		eve = self.Eve;
		currentAcct = self.currentAcct;
		balance = self.balance;
		chargeType = self.chargeType;
		
		queryFeeInfo();//查询缴费信息
		function queryFeeInfo(){
			urlVar = mbank.getApiURL()+'003008_search_tuition.do';//交易地址
			//参数
			params = {
				"AreaNo" : areaNo,
				"UnitNo" : unitNo,
				"payNo" : payNo,
				"StudNam" : studNam,
				"BatNo" : batNo,
				"Eve" : eve
			};
			//发送交易
			mbank.apiSend("post",urlVar,params,queryFeeInfoSucFunc,queryFeeInfoFailFunc,true);
			function queryFeeInfoSucFunc(feeInfoData){
				if(feeInfoData.ec == "000"){
					var tutionInfo = feeInfoData.tutionInfo;
					var htmlStr = '';
					//tutionInfo.length=0;
					if(tutionInfo.length>0){
						$("#eventSuc").show();
						$("#buttonSucDiv").show();
						for(var i = 0;i < tutionInfo.length;i++){
							var amt = format.formatMoney(tutionInfo[i].Amt, 2);
							if(tutionInfo[i].FeeMst=="0"){
								htmlStr +='<li class="mui-table-view-cell">'
								+'<div class="fyname">'+tutionInfo[i].FeeNam+'</div>'
								+'<div class="mui-input-row mui-checkbox">'
								+'<label>￥'+amt+'</label>'
								+'<input name="checkbox1" value="'+tutionInfo[i].Amt+'" type="checkbox" checked disabled="disabled"'
								+' FeeNo="'+tutionInfo[i].FeeNo+'" FeeNam="'+tutionInfo[i].FeeNam+'" FeeMst="'+tutionInfo[i].FeeMst+'">'
								+'</div></li>';
							}else{
								htmlStr +='<li class="mui-table-view-cell">'
								+'<div class="fyname">'+tutionInfo[i].FeeNam+'</div>'
								+'<div class="mui-input-row mui-checkbox">'
								+'<label>￥'+amt+'</label>'
								+'<input name="checkbox1" value="'+tutionInfo[i].Amt+'" type="checkbox" FeeNo="'+tutionInfo[i].FeeNo+'" FeeNam="'+tutionInfo[i].FeeNam+'" FeeMst="'+tutionInfo[i].FeeMst+'">'
								+'</div></li>';
							}
						}
						$("#feeInfoUl").html(htmlStr);
						eachChecked();//计算必选项的值
						checkAll();
					}else{
						$("#eventSuc").hide();
						$("#buttonSucDiv").hide();
						
						$("#eventFail").show();
						$("#backFailDiv").show();
					}
				}else{
					mui.alert(feeInfoData.em,"温馨提示");
					$("#eventSuc").hide();
					$("#buttonSucDiv").hide();
					
					$("#eventFail").show();
					$("#backFailDiv").show();
					return;
				}
			}
			
			function queryFeeInfoFailFunc(feeInfoData){
				mui.alert(feeInfoData.em,"温馨提示");
				$("#eventSuc").hide();
				$("#buttonSucDiv").hide();
				
				$("#eventFail").show();
				$("#backFailDiv").show();
				return;
			}
		}
		
		function eachChecked(){
			var temp = 0;
			mui("input[name='checkbox1']:checked").each(function(){ 
                    if(this.value){
                    	temp += parseFloat(this.value);
                    }else{
                    	temp += 0;
                    }
                });
            SumAmt=temp;
            
            if(SumAmt){
            	document.getElementById("moneyAllSpan").innerText = "￥"+format.formatMoney(SumAmt, 2);
            }else{
            	document.getElementById("moneyAllSpan").innerText = "￥0.00";
            }
		}
		
		function checkAll(){
			var checkAll=document.getElementById("checkAll");
			var cbknum=mui("input[name='checkbox1']").length;
			var checkBoxs = mui("input[name='checkbox1']:checked");
            if(cbknum==checkBoxs.length){ 
                checkAll.checked=true;
                checkFlag = true;
                checkAll.disabled=true;
            }else{ 
                checkAll.checked=false; 
                checkFlag = false;
            }
			
			checkAll.addEventListener("change",function(){ 
	                if(this.checked){
	                    mui("input[name='checkbox1']").each(function(){
	                    		this.checked=true;
	                    });
	                    eachChecked();
	                	checkFlag = true;
	                }else{
	                    mui("input[name='checkbox1']").each(function(){
	                    	if($(this).attr("FeeMst")!="0"){
	                    		this.checked=false;
	                    	}else{
	                    		this.checked=true;
	                    	}
	                    });
	                    eachChecked();
	                    checkFlag = false;
	                } 
	            },false);
	        
	        mui(".content_BOXall").on("change","input[name='checkbox1']",function(){
                eachChecked();
                var checkBoxs = mui("input[name='checkbox1']:checked");
                if(cbknum==checkBoxs.length){ 
                    checkAll.checked=true;
                    checkFlag = true;
                }else{ 
                    checkAll.checked=false; 
                    checkFlag = false;
                }
            });
		}
    }); 
    
    function chargeLimitJudge(){
		urlVar = mbank.getApiURL()+'003003_chargeLimitJudge.do';
		mbank.apiSend("post",urlVar,"",chargeLimitJudgeSucFunc,chargeLimitJudgeFailFunc,true);
		function chargeLimitJudgeSucFunc(data1){
			if(data1.ec =="000"){
				var flagVar = 0;
				flagVar = parseFloat(data1.amountLimit)-(parseFloat(data1.daypayment)+parseFloat(SumAmt));
				var payTotal = parseFloat(data1.daypayment)+parseFloat(SumAmt);
				if(flagVar < 0){
					mui.confirm("尊敬的客户,您当天的缴费累计超过了每日缴费限额,是否前往缴费设置页面修改限额?","温馨提示",["确认", "取消"], function(event) {
						if (event.index == 0) {
							AllRec_FeeNo = [];
							AllRec_Amt = [];
							mbank.openWindowByLoad('../feePayment/feePaymentSet.html','feePaymentSet','slide-in-right',"");
						}else{
							
							AllRec_FeeNo = [];
							AllRec_Amt = [];
							return;
						}
					});
				}else{
					daypayment = payTotal;
					if(checkFlag){
						getOrderFlowNo();
					}else{
						mui.confirm("您当前还有缴费项目未选中，缴费之后，无法再次进行缴费,是否继续?","温馨提示",["确认", "取消"], function(event) {
								if (event.index == 0) {
									getOrderFlowNo();
								}else{
									AllRec_FeeNo = [];
									AllRec_Amt = [];
									return;
								}
						});
					}
				}
			}else{
				mui.alert(data1.em,"温馨提示");
				return;
			}
		}
		function chargeLimitJudgeFailFunc(e1){
			mui.alert(e1.em,"温馨提示");
			return;
		}
	}
    	function getOrderFlowNo(){
    		urlVar = mbank.getApiURL()+'GetOrderFlowNo.do';
			mbank.apiSend("post",urlVar,"",getOrderFlowNoSucFunc,getOrderFlowNoFailFunc,true);
			function getOrderFlowNoSucFunc(data2){
				if(data2.ec =="000"){
					orderFlowNo = data2.orderFlowNo;
					params ={
								"chargeType":chargeType,
								"AreaNam" : areaNam,
								"AreaNo" : areaNo,
								"UnitNam" : unitNam,
								"UnitNo" : unitNo,
								"BatNo" : batNo,
								"BatSts" : batSts,
								"payNo" : payNo,
								"StudNam" : studNam,
								"Eve" : eve,
								"AllRec_FeeNo" :AllRec_FeeNo,
								"AllRec_Amt" :AllRec_Amt,
								"sumAmt" : SumAmt,
								"CterNo" :currentAcct,
								"daypayment" : daypayment,
								"orderFlowNo":orderFlowNo,
								"amountRealCharged":SumAmt+"",
								"chargeNo":payNo,
								"accountNo":currentAcct,
								"payAmount" : SumAmt+"",
								"PayNum" :	payNum
							};
						AllRec_FeeNo = [];
						AllRec_Amt = [];
						mbank.openWindowByLoad('../feePayment/tuitionFeePayConfirm.html','tuitionFeePayConfirm','slide-in-right',params);
				}else{
					mui.alert(data2.em,"温馨提示");
					return;
				}
			}
			function getOrderFlowNoFailFunc(e2){
				mui.alert(e2.em,"温馨提示");
				return;
			}
    	}
		document.getElementById("nextBtn").addEventListener("tap",function(){
			var checkBoxs = mui("input[name='checkbox1']:checked");
			payNum = checkBoxs.length;
			/*if(checkBoxs.length>0){
				mui("input[name='checkbox1']:checked").each(function(){ 
					var checkItem = {
						"FeeNo":$(this).attr("FeeNo"),
						"FeeNam":$(this).attr("FeeNam"),
						"Amt":this.value
					};
					AllRec.push(checkItem);
		        });
	        }*/
	       if(checkBoxs.length>0){
				mui("input[name='checkbox1']:checked").each(function(){ 
					AllRec_FeeNo.push($(this).attr("FeeNo"));
					AllRec_Amt.push(this.value);
		        });
	        }
	       	//格式化金额
	       	if(typeof(SumAmt)=="string"){
	       		SumAmt = parseFloat(SumAmt);
	       	}
	       	
			SumAmt = SumAmt.toFixed(2);
			
			
			if(typeof(SumAmt)=="string"){
	       		SumAmt = parseFloat(SumAmt);
	       	}
			
			if(SumAmt<=0){
				mui.alert("请选择缴费项目","温馨提示");
				return;
			}
			
			/*if(typeof(balance)=="string"){
				balance = parseFloat(balance);
			}
			
			balance = balance.toFixed(2);*/
			
			if(typeof(balance)=="string"){
				balance = parseFloat(balance);
			}
			
			if(balance<SumAmt){
				mui.alert("尊敬的客户，您当前的余额不足","温馨提示");
				return;
			}
			
			chargeLimitJudge();
		},false);
		
		document.getElementById("backFail").addEventListener("tap",function(){
			mui.back();
		},false);
		
	});
