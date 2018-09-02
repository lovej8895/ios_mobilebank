define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var iAccountInfoList = [];
	var currentAcct="";
	var accountPickerList=[];
    var accountPicker;
    var bonusRadio=null;//分红方式单选按钮值
    var bonusList = [];
    var f_prodcode='';//产品代码
    var f_prodname='';//产品名称
    var f_prodtype='';//产品类型
    var f_status =1;//产品状态 0：可转入，可转出 1：只可转入 2：只可转出 3：不可转换
	var f_buyplanflag=1;//是否可定投 0：否，1：是
	var f_risklevel='01';//风险等级 '01'-低风险，'02'-中低风险'03'-中风险，'04'-中高风险'05'-高风险
    var f_dividend='';//默认分红方式 0-红利再投 1-现金分红
    var f_dividstatus='';//分红方式是否可以变更 0-不可变更，1-可变更
    var newShareType='';//分红方式
    var f_currencytype='';//币种
    var f_tano='';
    var addAmount = '';//递增金额
    
    var firstBuyPoint=0;//首次购买起点
    var addBuyPoint=0;//追加购买起点
	var	fstmaxamt;//首次购买最高额
	var	conmaxamt;//追加最高额 
    
    var cst_certNo = localStorage.getItem("session_certNo");//证件号码
    
    
	mui.init();
	mui.plusReady(function() {		
		plus.screen.lockOrientation("portrait-primary");//竖屏
		var self = plus.webview.currentWebview();
		f_tano = self.f_tano;
		f_prodcode = self.f_prodcode;
		f_prodtype = self.f_prodtype;
		var param = {
			"turnPageBeginPos" : "1",
			"turnPageShowNum" : "1",
			"f_prodcode" : f_prodcode,
			"f_tano" : f_tano,
			"f_prodtype" : f_prodtype,
			"f_cust_type" : "1"
		};
		var url = mbank.getApiURL() + 'fund_ProductSearch.do';
		mbank.apiSend('post',url,param,successCallback,errorCallback,false);
		function successCallback(data){
			if(data.ec == "000"){
				f_prodname = data.f_iProductInfo[0].f_prodname;
				f_status = data.f_iProductInfo[0].f_status;
				if(f_status == "1"){
					firstBuyPoint=data.f_iProductInfo[0].f_b20fstminamt;//首次购买起点
    				addBuyPoint=data.f_iProductInfo[0].f_b20conminamt;//追加购买起点
    				addAmount = data.f_iProductInfo[0].f_b20stepunit;//递增金额
    				fstmaxamt = data.f_iProductInfo[0].f_b20fstmaxamt;//首次购买最高额
    				conmaxamt = data.f_iProductInfo[0].f_b20conmaxamt;//追加最高额
					$("#firstBuyPoint").html(format.formatMoney(data.f_iProductInfo[0].f_b20fstminamt)+"元");
					$("#addBuyPoint").html(format.formatMoney(data.f_iProductInfo[0].f_b20conminamt)+"元");
					$("#addAmount").html(format.formatMoney(data.f_iProductInfo[0].f_b20stepunit)+"元");
					$("#fundType").html("基金认购");
					$("#fundTypeInfo").html("基金认购信息");
					$("#des").html("认购信息");
				}else if(f_status == "0" || f_status == "2" || f_status == "3" ||f_status == "6"){
					firstBuyPoint=data.f_iProductInfo[0].f_b22fstminamt;//首次购买起点
    				addBuyPoint=data.f_iProductInfo[0].f_b22conminamt;//追加购买起点
    				addAmount = data.f_iProductInfo[0].f_b22stepunit;//递增金额
    				fstmaxamt = data.f_iProductInfo[0].f_b22fstmaxamt;//首次购买最高额
    				conmaxamt = data.f_iProductInfo[0].f_b22conmaxamt;//追加最高额
					$("#firstBuyPoint").html(format.formatMoney(data.f_iProductInfo[0].f_b22fstminamt)+"元");
					$("#addBuyPoint").html(format.formatMoney(data.f_iProductInfo[0].f_b22conminamt)+"元");
					$("#addAmount").html(format.formatMoney(data.f_iProductInfo[0].f_b22stepunit)+"元");
					$("#fundType").html("基金申购");
					$("#fundTypeInfo").html("基金申购信息");
					$("#des").html("申购信息");
				}
				f_prodcode = data.f_iProductInfo[0].f_prodcode;
				f_prodname = data.f_iProductInfo[0].f_prodname
				$("#prodName").html(f_prodname+"("+f_prodcode+")");
				f_currencytype = data.f_iProductInfo[0].f_currencytype;
				f_risklevel = data.f_iProductInfo[0].f_risklevel;
				f_dividend = data.f_iProductInfo[0].f_dividend;
				f_dividstatus = data.f_iProductInfo[0].f_dividstatus;
				if(f_dividstatus=='0'){
					newShareType = f_dividend;
				}else if(f_dividend!=''){
					$("#bonusWayLi").css("display","block");
					bonusList = jQuery.param.getParams('BONUSWAY');	//得到分红方式
					newShareType=f_dividend;
					$("#bonusWay").html($.param.getDisplay("DIVIDEND_METHOD",f_dividend));
					bonusInit();
				}else{
					$("#bonusWayLi").css("display","block");
					bonusList = jQuery.param.getParams('BONUSWAY');	//得到分红方式	
					bonusInit();
				}
				document.getElementById('submit').removeAttribute("disabled");
			}else{
				mui.alert(data.em);
			}
		}
		function errorCallback(data){
			mui.alert(data.em);
		}
		
		queryDefaultAcct();//加载相关信息
		function queryDefaultAcct(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				var length = iAccountInfoList.length;
				if(length>0){
					accountPickerList = [];
					for(var i=0;i<length;i++){
						var account = iAccountInfoList[i];
						var pickItem = {
						    value :i,
						    text:account.accountNo
						};
						accountPickerList.push(pickItem);
					}
				}
				accountInit();
				if(length > 0){
					if(self.payAccount){
						currentAcct =self.payAccount;
					}else{
						currentAcct = iAccountInfoList[0].accountNo;
//						currentAcct = "请选择";
					}
					if(currentAcct!="请选择"){
						$("#accountNo").html(format.dealAccountHideFour(currentAcct));
						queryBalance(currentAcct);
					}
				}
			}
		}

		function accountInit(){
			var accountPicker = new mui.SmartPicker({title:"请选择交易账号",fireEvent:"accountNo"});
			accountPicker.setData(accountPickerList);
			document.getElementById("changeAccount").addEventListener("tap",function(){
				accountPicker.show();
			},false);
		}
		
		function queryBalance(currentAcct){
			myAcctInfo.getAccBalance(currentAcct,"true",function(data){
				$("#balance").html(format.formatMoney(data.balanceAvailable)+"元");
			});
		}
		//添加账号监听事件
		window.addEventListener("accountNo",function(event){
			var param =event.detail;
			currentAcct = iAccountInfoList[param.value].accountNo;
			$("#accountNo").html(format.dealAccountHideFour(currentAcct));
			queryBalance(currentAcct);
		});
		
		function bonusInit(){
			var bonusWay = new mui.SmartPicker({title:"请选择分红方式",fireEvent:"bonusWay"});
			bonusWay.setData(bonusList);
			document.getElementById("bonusWayLi").addEventListener("tap",function(){
				bonusWay.show();
			},false);
		}
		
		//添加分红方式监听事件
		window.addEventListener("bonusWay",function(event){
           	var param=event.detail;
            bonusRadio = param.value;
            newShareType = param.value;
			$("#bonusWay").html(param.text);
        });	
	        
		//点击下一步按钮发送交易
		document.getElementById("submit").addEventListener('tap',function(){
			if(currentAcct=="请选择"){
				mui.alert("请选择交易账户！");
				return false;
			}
			if( ""==newShareType || newShareType == null ){
	    		mui.alert("请选择分红方式！");
	    		return false;
	        }
			var buyAmount=$("#buyAmount").val();
            if( ""==buyAmount ){
            	mui.alert("请输入购买金额！");
            	return false;
            }else{
            	buyAmount=format.ignoreChar($("#buyAmount").val(),',');
            	var balance=format.ignoreChar($("#balance").html(),',');
            	if( !isMoney(buyAmount) || parseFloat(buyAmount)<=0 ){
            		mui.alert("请输入正确的购买金额！");
            		return false;
            	}
            	if( parseFloat(buyAmount)>(parseFloat(balance))){
            		mui.alert("可用余额不足!");
            		return false;
            	}
            	if(addAmount!=0){
            		if(buyAmount%addAmount!=0){
	            		mui.alert("输入的金额不满足递增金额["+addAmount+"]的整数倍!");
	            		return false;
	            	}
            	}
            }
			
			var fianceManagerCode = $("#fianceManagerCode").val();
            fianceManagerCode = fianceManagerCode.trim();
            if(""!=fianceManagerCode){
	            if(numCheck(fianceManagerCode)||fianceManagerCode<0||fianceManagerCode.length>11){
					mui.alert("请输入不超过11位整数的理财经理代码");
					return;
				}
            }
			var param = {
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "1",
				f_cust_type:"1",
				f_deposit_acct:currentAcct
			};
			var url = mbank.getApiURL() + 'queryCustSignInfo.do';
			mbank.apiSend('post',url,param,successCallback,errorCallback,false);
			function successCallback(data){
				if(data.ec == "000"){
					var currObj = data.f_iCustSignInfoList;
					if(currObj.length==0){
//						mui.alert("查询不到该卡号的客户信息");
						mui.confirm("您尚未签约基金系统，是否前往签约？","温馨提示",["确定", "取消"], function(event) {	
				            if(event.index == 0){
				            	var params = {
				            		f_deposit_acct:currentAcct,
			            			f_tano : f_tano
				            	}
				                mbank.openWindowByLoad("../fund/fundCustomerSign_Input.html","fundCustomerSign_Input", "slide-in-right",params);
				            }
				        });
				        return false;
					}else{
						var custStatus = currObj[0].f_cust_status;
						var signStatus = currObj[0].f_sign_status;
						var f_open_busin = currObj[0].f_open_busin;
						var endDate = currObj[0].f_risk_end_date;
						var f_cust_risk = currObj[0].f_cust_risk;
						if(custStatus!='0'){
							mui.confirm("您的基金账户已销户，是否前往签约？","温馨提示",["确定", "取消"], function(event) {	
					            if(event.index == 0){
					            	var params = {
					            		f_deposit_acct:currentAcct,
				            			f_tano : f_tano
					            	}
					                mbank.openWindowByLoad("../fund/fundCustomerSign_Input.html","fundCustomerSign_Input", "slide-in-right",params);
					            }
					        });
					        return false;
						}
						if((signStatus!='1'&&signStatus!='3')||(f_open_busin!='3')){
							mui.confirm("您尚未签约基金系统，是否前往签约？","温馨提示",["确定", "取消"], function(event) {	
					            if(event.index == 0){
					            	var params = {
					            		f_deposit_acct:currentAcct,
				            			f_tano : f_tano
					            	}
					                mbank.openWindowByLoad("../fund/fundCustomerSign_Input.html","fundCustomerSign_Input", "slide-in-right",params);
					            }
					        });
					        return false;
						}
						//是否做过风险等级评估 校验
						f_cust_risk = f_cust_risk.trim();//去除空格
						if(f_cust_risk == "" ||f_cust_risk == "null"|| f_cust_risk == null || f_cust_risk == undefined ){
							mui.confirm("您尚未进行风险评估,是否进行风险评估？","温馨提示",["确定", "取消"], function(e) {
								if (e.index == 0) {
									riskshow();
						        }
						  	});
						  	return;
						}
						//风险评估是否过期校验
						var nowDate=(new Date()).format("yyyyMMdd");
						if(parseInt(endDate)<parseInt(nowDate)){
							mui.confirm("您的风险评估已过期,是否进行风险评估？","温馨提示",["确定", "取消"], function(event) {	
					            if(event.index == 0){
					            	riskshow();
					            }
					        });
					        return false;
						}
						
						//风险等级 校验
						//客户风险等级 01保守型 02安稳型 03稳健型 04成长型 05积极型
						//基金风险等级 '01'-低风险，'02'-中低风险'03'-中风险，'04'-中高风险'05'-高风险
						if(parseInt(f_cust_risk) < parseInt(f_risklevel)){
							mui.confirm("您购买的基金产品投资风险大于您的风险承受能力，是否重新进行风险评估？","温馨提示",["确定", "取消"], function(e) {
								if (e.index == 0) {
									riskshow();
						        }
						  	});
						  	return;
						}
						
						var param = {
							"f_deposit_acct":currentAcct,
							"f_prodcode" : f_prodcode,
						    "f_tano" : f_tano,
						};
						var url = mbank.getApiURL() + 'isFirstFundBuy.do';
						mbank.apiSend('post',url,param,isFirstFundBuySuc,isFirstFundBuyErr,false);
						function isFirstFundBuySuc(data){
							if(data.ec=='000'){
								var f_isFirstBuy = data.f_isFirstBuy;
								if(f_isFirstBuy=='0'){
									if(parseFloat(buyAmount)<parseFloat(firstBuyPoint)){
										mui.alert("首次购买"+firstBuyPoint+"元起，请重新输入购买金额");
										return false;
									}
									if(fstmaxamt!=""){
										if(parseFloat(buyAmount)>parseFloat(fstmaxamt)){
											mui.alert("首次购买不能超过"+fstmaxamt+"元，请重新输入购买金额");
											return false;
										}
									}
								}else{
									if(parseFloat(buyAmount)<parseFloat(addBuyPoint)){
										mui.alert("追加购买"+addBuyPoint+"元起，请重新输入购买金额");
										return false;
									}
									if(conmaxamt!=""){
										if(parseFloat(buyAmount)>parseFloat(conmaxamt)){
											mui.alert("追加购买不能超过"+conmaxamt+"元，请重新输入购买金额");
											return false;
										}
									}
								}
								var params = {
					        		f_deposit_acct :currentAcct,
					        		f_prodcode : f_prodcode,
					        		f_prodtype : f_prodtype,
					        		f_prodname : f_prodname,
					        		f_currencytype : f_currencytype,
					        		buyAmount : buyAmount,
					        		payAmount : buyAmount,
					        		f_dividend : newShareType,
					        		f_status : f_status,
					        		f_tano : f_tano,
					        		firstBuyPoint : firstBuyPoint,
					        		addBuyPoint : addBuyPoint,
					        		fianceManagerCode : $("#fianceManagerCode").val()
					        	}
					            mbank.openWindowByLoad("../fund/fundBuyConfirm.html","fundBuyConfirm", "slide-in-right",params);
							}else{
								mui.alert(data.em);
								return false;
							}
						}
						function isFirstFundBuyErr(e){
							mui.alert(e.em);
							return false;
						}
					}
				}else{
					mui.alert(data.em);
				}
			}
			function errorCallback(data){
				mui.alert(data.em);
			}

		});
		
		function numCheck(num){
			var reg = new RegExp("^[0-9]*$");
			if(reg.test(num)){
				return false;
			}
			return true;
		}
		
		//格式化金额
        $("#buyAmount").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#buyAmount").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});

		function riskshow(){
			var params = {
        		accountNo:currentAcct
        	};
            mbank.openWindowByLoad("../fund/fundRiskAssessment.html","fundRiskAssessment", "slide-in-right",params);
		}
		mbank.resizePage(".btn_bg_f2");
	});
});