define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var f_cust_type = '1';
	mui.init();
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();		
		var accountCardNo = self.currentAcct; //交易账号									
		var f_prodname = self.f_prodname;	 //产品名称			
		var f_prodcode = self.f_prodcode; //产品代码
		var f_prodtype = self.f_prodtype; //产品类型
		var f_tano = self.f_tano;  //TA代码
		var f_avdilvol = self.f_avdilvol; //可用份额
		var f_b24minamt = ""; //单笔赎回最低份额
		var f_b25maxamt = ""; //单笔赎回最高额
		var f_holdmin = ""; //最低持有份额
		var redemptionLot="";
		
		var f_limitvol = "";//快速赎回限额
		var f_usedvol = "";//当日快速赎回已用份额
		var residueLimitvol = "";//当日剩余快速赎回限额
		var f_redeem_flag = $("input[name='redeem_flag']:checked").val();//赎回类型;
		
		//转出信息
		//$("#outInfo").hide();
		
		//刚加载页面时隐藏"全部转出"
		/*if(f_redeem_flag=="0"){
			$("#allSwitchLi").hide();
			$("#avdilvolP").hide();
		}*/
		
		document.getElementById("accountNo").innerHTML = format.dealAccountHideFour(accountCardNo);
		document.getElementById("productName").innerHTML = f_prodname + '(' + f_prodcode + ')';
		
		//通过300049宝类客户资产查询查出当前基金总金额（即可用余额）
		queryBalance();
		function queryBalance(){
			params = {
					"turnPageBeginPos" : "1",
					"turnPageShowNum" : "20",
					"f_deposit_acct" : accountCardNo,
					"f_tano" : f_tano,
					"f_prodcode" : f_prodcode
				};
			urlVar = mbank.getApiURL()+'cashFundCapitalQuery.do';
			mbank.apiSend("post",urlVar,params,cashFundCapitalQuerySuc,cashFundCapitalQueryFail,true);
			function cashFundCapitalQuerySuc(data){
				if(data.ec =="000"){
					if(data.f_cashHoldFundList.length>0){
						f_avdilvol = data.f_cashHoldFundList[0].f_fundvol;//总金额
						f_limitvol = data.f_cashHoldFundList[0].f_limitvol;//快速赎回限额
						f_usedvol = data.f_cashHoldFundList[0].f_usedvol;//当日快速赎回已用份额
						
						residueLimitvol = f_limitvol-f_usedvol;//当日剩余快速赎回限额
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
			document.getElementById("avdilvol").innerHTML = format.formatMoney(f_avdilvol, 2);
			
			document.getElementById("avdilvolSpan").innerHTML = format.formatMoney(f_avdilvol, 2);
			//判断是否为空或者0
			if(f_limitvol){
				document.getElementById("limitvol").innerHTML = format.formatMoney(f_limitvol, 2);
			}else{
				document.getElementById("limitvol").innerHTML = format.formatMoney("0", 2);;
			}
			if(residueLimitvol){
				document.getElementById("residueLimitvol").innerHTML = format.formatMoney(residueLimitvol, 2);
			}else{
				document.getElementById("residueLimitvol").innerHTML = format.formatMoney("0", 2);
			}
		}
		
		
		//$("#putMoney").show();
		//$("#putMoneyAll").hide();
		
		//bookSwitchToggle();
		/*function bookSwitchToggle(){
			$("#bookSwitch").on("toggle",function(){
				if(event.detail.isActive){
					$("#putMoney").hide();
					$("#putMoneyAll").show();
					document.getElementById("redemptionLotAll").innerHTML = format.formatMoney(f_avdilvol, 2);
					flag = false;
				}else{
					$("#putMoney").show();
					$("#putMoneyAll").hide();
					$("#redemptionLot").show();
					redemptionLot=$("#redemptionLot").val();
					flag=true;
				}			
       		}); 
		}*/
		
		var flag=true;
		
		//点击复选框时的联动效果
		//var redemptionLot_0;
		//var redemptionLot_1;
		$("input[name='redeem_flag']").on("change",function(){
            f_redeem_flag=$("input[name='redeem_flag']:checked").val();
            if(f_redeem_flag=="0"){
            	//redemptionLot_1 = $("#redemptionLot").val();
            	/*if(Number(residueLimitvol)<Number(f_avdilvol)){
            		mui.alert("当前转出额度超出今日可快速转出额度，请重新输入");
            		$("#redemptionLot").val("");
            	}*/
            	//$("#redemptionLot").val(redemptionLot_0);
            	$("#redemptionLot").val("");
            	flag = true;
            }else if(f_redeem_flag=="1"){
            	//redemptionLot_0 = $("#redemptionLot").val();
            	//$("#redemptionLot").val(redemptionLot_1);
            	$("#redemptionLot").val("");
            	flag = false;
            }
        });
       
        $("#allSwitchLi").on("click",function(){
        	if(f_redeem_flag=="0"){
        		if(Number(residueLimitvol)<Number(f_avdilvol)){
        			//点击全部转出，将当日剩余快速转出额度赋值给输入框
        			$("#redemptionLot").val(format.formatMoney(residueLimitvol, 2));
        		}else{
        			//点击全部转出，将所有基金额度赋值给输入框
					$("#redemptionLot").val(format.formatMoney(f_avdilvol, 2));
        		}
        	}else if(f_redeem_flag=="1"){
        		//点击全部转出，将所有基金额度赋值给输入框
				$("#redemptionLot").val(format.formatMoney(f_avdilvol, 2));
        	}
			
			/*if(flag){
				if(Number(residueLimitvol)<Number(f_avdilvol)){
            		mui.alert("当前转出额度超出今日可快速转出额度，请重新输入");
            		$("#redemptionLot").val("");
            	}
			}*/
       	});
       
        //格式化金额
        $("#redemptionLot").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#redemptionLot").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
					
		$("#nextButton").click(function(){	
		   		if(f_redeem_flag=="0"){
		    		redemptionLot=format.ignoreChar($("#redemptionLot").val(),',');
					if( ""== redemptionLot || redemptionLot == null){
			    		mui.alert("请输入转出金额！");
			    		return false;
			        }
					if( !isMoney(redemptionLot) || parseFloat(redemptionLot)<=0 ){
		        		mui.alert("请输入正确的转出金额！");
		        		$("#redemptionLot").val("");
		        		return false;
		        	}
					
					f_avdilvol = Number(self.f_avdilvol);
					if(redemptionLot > f_avdilvol){
						mui.alert("转出金额应小于等于可用余额！");
						$("#redemptionLot").val("");
				    	return false;
					}
					
				    residueLimitvol = Number(residueLimitvol);
					if(redemptionLot > residueLimitvol){
						mui.alert("超过快速转出日累计限额"+residueLimitvol+"元，请重新输入或选择普通转出");
						$("#redemptionLot").val("");
			    		return false;
					}
		    	}else if(f_redeem_flag=="1"){
		    		/*if(!flag){				
				    	redemptionLot=format.ignoreChar($("#redemptionLotAll").text(),','); //转出份额
				    	if( ""== redemptionLot || redemptionLot == null ||redemptionLot <= 0 ){
				    		mui.alert("转出金额为0!");
				    		return false;
				        }
		   			}else{*/
		   				redemptionLot=format.ignoreChar($("#redemptionLot").val(),',');
						if( ""== redemptionLot || redemptionLot == null){
				    		mui.alert("请输入转出金额！");
				    		return false;
				        }
						if( !isMoney(redemptionLot) || parseFloat(redemptionLot)<=0 ){
			        		mui.alert("请输入正确的转出金额！");
			        		$("#redemptionLot").val("");
			        		return false;
			        	}
					    f_avdilvol = Number(self.f_avdilvol);
						if(redemptionLot > f_avdilvol){
							mui.alert("转出金额应小于等于可用余额！");
							$("#redemptionLot").val("");
				    		return false;
						}
		   			//}
		    	}
			//console.log(redemptionLot);
			var params = {
				f_deposit_acct : self.currentAcct,
				f_tano : f_tano,
				f_prodname : f_prodname,
				f_prodcode : f_prodcode,				
				f_avdilvol : f_avdilvol,
				f_prodtype : f_prodtype,
				f_applicationvol : redemptionLot,
				payAmount : redemptionLot,
				f_redeem_flag:f_redeem_flag,//赎回类型
				noCheck:false
				};
				//alert(f_redeem_flag);
			mbank.openWindowByLoad('../fund/fundTreasureOutNext.html','fundTreasureOutNext','slide-in-right',params);		
	   });	
	    mbank.resizePage(".btn_bg_f2");
	});
});