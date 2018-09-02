define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	//绑定账号列表
	var iAccountInfoList = [];
	//当前选定的付款账号
	var payAccount;
	//当前选定的收款账号
	var recAccount;
	//是否预约交易，默认非预约
	var scheduleFlag="0";	
	var payAccountPicker;
	var recAccountPicker;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		$("#bookDate").html(format.formatDate(format.addDay(new Date(),1)));
		queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if( length==1 ){
					mui.alert("您只下挂了一张借记卡，不能做注册账户互转业务！",'','',function(e){
						if( e.index==0 ){
							plus.webview.currentWebview().close();
						}
					});
					
				}else if(length >1) {
					payAccount = iAccountInfoList[0];
					$("#accountNo").html(format.dealAccountHideFour(payAccount.accountNo));
					qureyBalance();
					recAccount=iAccountInfoList[1];
					$("#recAccNo").html(format.dealAccountHideFour(recAccount.accountNo));
					$("#recName").html(userInfo.getSessionData("session_customerNameCN"));
				}
				
			}
		}
        
		function qureyBalance(){
			myAcctInfo.getAccBalance(payAccount.accountNo,"true",function(data){
				$("#balance").html(format.formatMoney(data.balanceAvailable));
				if(  isMoney(data.creditUseLimit) && parseFloat(data.creditUseLimit)!=0  ){
					$("#creditUseLimit").html(format.formatMoney(data.creditUseLimit));
					$("#creditUseLimitLi").show();
				}else{
					$("#creditUseLimitLi").hide();
					$("#creditUseLimit").html("0.00");
				}
			});			
		}
        
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value:i,
						text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}

				
				payAccountPicker = new mui.SmartPicker({title:"请选择付款账号",fireEvent:"payAccount"});
			    payAccountPicker.setData(accountPickerList);
				recAccountPicker = new mui.SmartPicker({title:"请选择收款账号",fireEvent:"recAccount"});
			    recAccountPicker.setData(accountPickerList,1);				    
			}
		}

		$("#changePayAccount").on("tap",function(){
			document.activeElement.blur();
			payAccountPicker.show();	

		});
		
        window.addEventListener("payAccount",function(event){
                var param=event.detail;
				payAccount=iAccountInfoList[param.value];				
				$("#accountNo").html(format.dealAccountHideFour(payAccount.accountNo));
				qureyBalance();
				if( payAccount.accountNo==recAccount.accountNo ){
				    if( payAccount.accountNo==iAccountInfoList[0].accountNo ){
						recAccount=iAccountInfoList[1];
					    recAccountPicker.setSelectedIndex(1);
					}else{
						recAccount=iAccountInfoList[0];
						recAccountPicker.setSelectedIndex(0);
					}
					$("#recAccNo").html(format.dealAccountHideFour(recAccount.accountNo));					
				}            
        });		

 		$("#changeRecAccount").on("tap",function(){
 			document.activeElement.blur();
			recAccountPicker.show();	
		});	

        window.addEventListener("recAccount",function(event){
                var param=event.detail;
				recAccount=iAccountInfoList[param.value];			
				$("#recAccNo").html(format.dealAccountHideFour(recAccount.accountNo));
				if( payAccount.accountNo==recAccount.accountNo ){
					if( recAccount.accountNo==iAccountInfoList[0].accountNo ){
						payAccount=iAccountInfoList[1];
					    payAccountPicker.setSelectedIndex(1);
					}else{
						payAccount=iAccountInfoList[0];
						payAccountPicker.setSelectedIndex(0);
					}
					$("#accountNo").html(format.dealAccountHideFour(payAccount.accountNo));
					qureyBalance();					
				}          
        });	
		
 		$("#tranAmt").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#tranAmt").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
 
        $("#bookSwitch").on("toggle",function(event){
            if(event.detail.isActive){
            	scheduleFlag="1";
            	$(".bookLi").show();
	            var specifyType=$("input[name='specifyType']:checked").val();
	            if( specifyType=="0" ){
	            	$("#notPeriodLi").show();
	            	$("#periodLi").hide();
	            	$("#transTimesLi").hide();
	            }else{
	            	$("#notPeriodLi").hide();
	              	$("#periodLi").show();
	            	$("#transTimesLi").show();          	
	            } 
            }else{
            	scheduleFlag="0";
            	$(".bookLi").hide();
            	$("#periodLi").hide();
            	$("#transTimesLi").hide();
            }
        });
        
        $("input[name='specifyType']").on("change",function(){
            var specifyType=$("input[name='specifyType']:checked").val();
            if( specifyType=="0" ){
            	$("#notPeriodLi").show();
            	$("#periodLi").hide();
            	$("#transTimesLi").hide();
            }else{
            	$("#notPeriodLi").hide();
              	$("#periodLi").show();
            	$("#transTimesLi").show();          	
            }
        });
 
        $("#pickDate").on("tap",function(){
			plus.nativeUI.pickDate( function(e){
				var bookDate=e.date;
                $("#bookDate").html(format.formatDate(bookDate));
		    },function(e){
			    
			});	
        });
 
        $("#transPeriod").on("change",function(){
        	var transPeriod=$("#transPeriod").val();
        	if( "0"==transPeriod ){
        		$("#transweekDay").hide();
        		$("#transMonthDay").hide();
        	}else if( "1"==transPeriod ){
        		$("#transweekDay").show();
        		$("#transMonthDay").hide();
        	}else{
          		$("#transweekDay").hide();
        		$("#transMonthDay").show();      		
        	}
        });
 
        //是否短信通知收款人标识
        var isNoticeRec=false;
        $("#smsNoticeSwitch").on("toggle",function(event){
            if(event.detail.isActive){
            	isNoticeRec=true;
            	$("#smsNoticeLi").show();
            }else{
            	isNoticeRec=false;
            	$("#smsNoticeLi").hide();
            }
        });
 
	    $("#nextButton").on("tap",function(){	
	    	if( payAccount.accountNo==recAccount.accountNo ){
	    		mui.alert("收款账号与付款账号不能为同一个账号！");
	    		return false;
	    	}
	    	
            var tranAmt=$("#tranAmt").val();
            if( ""==tranAmt ){
            	mui.alert("请输入转账金额！");
            	return false;
            }else{
            	tranAmt=format.ignoreChar($("#tranAmt").val(),',');
            	var balance=format.ignoreChar($("#balance").html(),',');
            	var creditUseLimit=format.ignoreChar($("#creditUseLimit").html(),',');
            	if( !isMoney(tranAmt) || parseFloat(tranAmt)<=0 ){
            		mui.alert("请输入正确的转账金额！");
            		return false;
            	}
            	if( parseFloat(tranAmt)>(parseFloat(balance)+parseFloat(creditUseLimit)) ){
            		mui.alert("可用余额不足!");
            		return false;
            	}
            }
            if( scheduleFlag=="1" ){
            	var bookDate=$("#bookDate").html();
            	if( ""==bookDate ){
            		mui.alert("请选择预约转账日期！");
            		return false;
            	}else{
            		var nowDate=format.formatDate(new Date());
            		if( bookDate<=nowDate ){
            			mui.alert("预约转账日期应晚于今天！");
            			return false;
            		}
            	}
            	var specifyType=$("input[name='specifyType']:checked").val();
            	if( specifyType="1" ){//周期性预约
            		var transTimes=$("#transTimes").val();
            		if( !isInteger(transTimes) || parseInt(transTimes)<=0 ){
            			mui.alert("请输入正确的转账次数！");
            			return false;
            		}
            	}            	
            }
            if( isNoticeRec ){
            	var recMobile=$("#recMobile").val();
            	if( ""==recMobile ){
            		mui.alert("请输入收款人手机！");
            		return false;
            	}
            	if( !isMobile(recMobile) ){
            		mui.alert("您输入的手机号码格式不正确！");
            		return false;
            	}            	
            }
	    	var payRem=$("#payRem").val();
            if( payRem!="" && payRem.length>20 ){
	    		mui.alert("您输入的附言不能超过20个字符！");
	    		return false;
	    	}
	    	var notePhone="";
	    	if( isNoticeRec ){
	    		notePhone=$("#recMobile").val();
	    		if( ""==notePhone ){
	    			mui.alert("请输入收款人手机号码！");
	    			return false;
	    		}
	    	}
	    	var payAmount=format.ignoreChar($("#tranAmt").val(),',');
	    	
	    	var params={
	    		payAccount:payAccount.accountNo,
	    		recAccount:recAccount.accountNo,
	    		recAccountName:$("#recName").html(),
	    		payAmount:payAmount,
	    		specifyType:$("input[name='specifyType']:checked").val(),
	    		scheduleFlag:scheduleFlag,
	    		transPeriod:$("#transPeriod").val(),
	    		transweekDay:$("#transweekDay").val(),
	    		transMonthDay:$("#transMonthDay").val(),
	    		transTimes:$("#transTimes").val(),
	    		specifyDate:$("#bookDate").html(),
	    		specifyCycleTime:$("#specifyCycleTime").val(),
	    		specifyDateTime:$("#specifyDateTime").val(),
	    		notePhone:notePhone,
	    		transferType:"0",
	    		transferChannel:"1",
	    		accountStat:payAccount.accountStat,
	    		payRem:$("#payRem").val()
	    	};
	    	var url = mbank.getApiURL()+'innerTransfer_confirm.do';
	    	mbank.apiSend("post",url,params,successCallback,errorCallback,true);
	    	function successCallback(data){
		        mbank.openWindowByLoad('../transfer/sameTranConfirm.html','sameTranConfirm','slide-in-right',data);
		    }
	    	function errorCallback(data){
		    	dealFail(data);
		    } 	    	
	    });
	    
        function dealFail(data){
            mui.alert(data.em);
        }  
      
        window.addEventListener("reload",function(event){
            qureyBalance();
        });

        mbank.resizePage(".btn_bg_f2");

	});

});