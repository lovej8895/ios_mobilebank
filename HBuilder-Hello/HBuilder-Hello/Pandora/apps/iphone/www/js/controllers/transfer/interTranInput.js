define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	//绑定账号列表
	var iAccountInfoList = [];
	var accountPickerList=[];
    var accountPicker;
	//当前选定的付款账号
	var payAccount;
	//当前选定的开户行
    var recAccountOpenBank="";
    var recAccountOpenBankName="";
	//是否预约交易，默认非预约
	var scheduleFlag="0";
	var doubtAccFlowNo="";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        
        if( self.recAccount && self.recAccountOpenBank && self.recAccountOpenBankName && self.recAccountName ){
            recAccountOpenBank=self.recAccountOpenBank;
	        recAccountOpenBankName=self.recAccountOpenBankName;
            $("#recAccountOpenBankName").html(self.recAccountOpenBankName);
            $("#recAccNo").val(self.recAccount);
            $("#recName").val(self.recAccountName);        	
        }
        
        $("#bookDate").html(format.formatDate(format.addDay(new Date(),1)));
		queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					payAccount= iAccountInfoList[0];
					$("#accountNo").html(format.dealAccountHideFour(payAccount.accountNo));
					qureyBalance();
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
				accountPicker = new mui.SmartPicker({title:"请选择付款账号",fireEvent:"payAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}		
		$("#changeAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();	
		});

        window.addEventListener("payAccount",function(event){
                var param=event.detail;		
				payAccount=iAccountInfoList[param.value];
				$("#accountNo").html(format.dealAccountHideFour(payAccount.accountNo));
				qureyBalance();      
        });	

        $("input[name='transferType']").on("change",function(){
            var transferType=$("input[name='transferType']:checked").val();
            if( transferType=="2" ){
                $("#bookSwitchLi").hide();
                $(".bookLi").hide();
            }else{
                $("#bookSwitchLi").show();
                if(scheduleFlag=="1"){
                	$(".bookLi").show();
                }else{
                	$(".bookLi").hide();
                }
                      	
            }
        });

        //常用收款人
        $("#commonPayee").on("tap",function(){
        	mbank.openWindowByLoad('commonPayee.html','commonPayee','slide-in-right',{payBookType:"2"});
        });
        
        window.addEventListener("selectPayBook",function(event){
            var payBook=event.detail;
            recAccountOpenBank=payBook.recAccountOpenBank;
	        recAccountOpenBankName=payBook.recAccountOpenBankName;
            $("#recAccountOpenBankName").html(payBook.recAccountOpenBankName);
            $("#recAccNo").val(payBook.recAccount);
            $("#recName").val(payBook.recAccountName);
        });
         
/*		$("#selectBank").on("tap", function() {
			var transferType=$("input[name='transferType']:checked").val();
			mbank.openWindowByLoad('selectBank.html','selectBank','slide-in-right',{payBookType:transferType});
		});*/

		//自定义开户行选择事件
		window.addEventListener('bankInfo', function(event) {
			var recOpenBank=event.detail;
			recAccountOpenBank=recOpenBank.clearBankNo;
			recAccountOpenBankName=recOpenBank.signBankName;
            $("#recAccountOpenBankName").html(recAccountOpenBankName);
            
		});
  
  		$("#selectBank").on("tap", function() {
  			var transferType=$("input[name='transferType']:checked").val();
            mbank.openWindowByLoad('hotBank.html','hotBank','slide-in-right',{transferType:transferType});
		});
		//自定义热点银行行选择事件
		window.addEventListener('hotBank', function(event) {
			var recOpenBank=event.detail;
			recAccountOpenBank=recOpenBank.clearBankNo;
			recAccountOpenBankName=recOpenBank.signBankName;
            $("#recAccountOpenBankName").html(recAccountOpenBankName);
            
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
            }else{
            	scheduleFlag="0";
            	$(".bookLi").hide();
            }
        });
        
        $("#pickDate").on("tap",function(){
			plus.nativeUI.pickDate( function(e){
				var bookDate=e.date;
                $("#bookDate").html(format.formatDate(bookDate));
		    },function(e){
			    
			});	
        });       
        
        //是否通知收款人
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
 
		function recAccountCheck(recAccNo){
			if( recAccNo== '' ){
				mui.alert("请输入收款账号！");
				return false;
			}
			var p = /[^\x00-\xff]/g;
			if( p.test(recAccNo) ){
				mui.alert('收款账号不能有中文字符!');
				return false;
			}else if( recAccNo.indexOf(" ")>=0 ){
				mui.alert('收款账号不能有空格!');
				return false;
			}else if(recAccNo.length>32 || recAccNo.length<4){
				mui.alert('收款账号长度应为4至32位!');
				return false;
			}else{
				return true;
			}
		}
 
 
	    $("#nextButton").on("tap",function(){
	    	var transferType=$("input[name='transferType']:checked").val();
	    	if(""==recAccountOpenBank){
	    		mui.alert("请选择开户行！");
	    		return false;
	    	}
	    	var recAccNo=$("#recAccNo").val();
	    	if( !recAccountCheck(recAccNo) ){
	    		return false;
	    	}
	    	if( payAccount.accountNo==recAccNo ){
	    		mui.alert("收款账号与付款账号不能为同一个账号！");
	    		return false;
	    	}	    	
	    	var recName=$("#recName").val();
	    	if( ""==recName ){
	    		mui.alert("请输入收款姓名！");
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
            		mui.alert("请输入正确的金额！");
            		return false;
            	}
            	if( parseFloat(tranAmt)>(parseFloat(balance)+parseFloat(creditUseLimit)) ){
            		mui.alert("可用余额不足!");
            		return false;
            	}
            }
            if( scheduleFlag=="1" && transferType!="2" ){
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
            	var recMobile=$("#recMobile").val();
            	if( ""==recMobile ){
            		mui.alert("请输入收款人手机！");
            		return false;
            	}else{
            		notePhone=$("#recMobile").val();
            	}
	    	}
	    	
            //涉案账户判断
            var url = mbank.getApiURL()+'checkAndRecordDoubtInfo.do';
            var param={
            	payAmount:format.ignoreChar(tranAmt,','),
            	payRem:payRem,
            	recAccountOpenBank:recAccountOpenBank,
            	recAccountOpenBankName:recAccountOpenBankName,
            	payAccount:payAccount.accountNo,
            	currentBusinessCode:"002009",
            	transferChannel:"2",
            	recAccount:$("#recAccNo").val(),
            	recAccountName:$("#recName").val(),
            	notePhone:notePhone,
            	newPayUse:"跨行转账"
            	
            };
			mbank.apiSend("post",url,param,function(data){
				var doubtAccFlag=data.doubtAccFlag;
				if( doubtAccFlag=="1" ){
					mui.alert("收款账户为涉案账户，根据监管要求不得向其转账汇款");
					return false;
				}else if( doubtAccFlag=="2" ){
					doubtAccFlowNo=data.doubtAccFlowNo;
					mui.confirm("收款账户可疑，谨防诈骗！请您确认是否继续转账？","提示",["确认","取消"], function(e) {
						if (e.index == 0) {
							checkUnionSts();
						}
					});
				}else{
					checkUnionSts();
				}
						
			},function(data){
				dealFail(data);
			},true);		    	
	    	
	    	//判断收款行是否加入超级网银
	    	function checkUnionSts(){
	    		var transferType=$("input[name='transferType']:checked").val();
	            //转账方式为实时判断收款行是否加入超级网银
	    		if( "2"==transferType ){
	    			var url = mbank.getApiURL()+'queryUnionSts.do';
	    			mbank.apiSend("post",url,{clearBankNo:recAccountOpenBank},function(data){
	    				if( data.state=="0" ){
	    					mui.alert("此账户尚未开通超级网银，您可以选择普通/大额转账类型。");
	    					return false;
	    				}else{
	    					tranConfirm();
	    				}
	    			},function(data){
	    				dealFail(data);
	    			},true);
	    		}else{
	    			tranConfirm();
	    		}
	    	}
	    	
            function tranConfirm(){
	 	    	var payAmount=format.ignoreChar($("#tranAmt").val(),',');
		    	var params={
		    		payAccount:payAccount.accountNo,
		    		recAccount:$("#recAccNo").val(),
		    		recAccountName:$("#recName").val(),
	            	recAccountOpenBank:recAccountOpenBank,
	            	recAccountOpenBankName:recAccountOpenBankName,
		    		transferType:transferType,
		    		payAmount:payAmount,
		    		payRem:$("#payRem").val(),
		    	    notePhone:notePhone,
		    	    scheduleFlag:transferType=="2"?"0":scheduleFlag,
		    	    specifyDate:format.ignoreChar($("#bookDate").html(),"-"),
		    	    accountStat:payAccount.accountStat,
		    	    specifyDateTime:$("#specifyDateTime").val(),
		    	    doubtAccFlowNo:doubtAccFlowNo
		    	    
		    	};
	
		    	var url = mbank.getApiURL()+'showExternalTransferConfirm.do';
		    	mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    	function successCallback(data){
			        mbank.openWindowByLoad('../transfer/interTranConfirm.html','interTranConfirm','slide-in-right',data);
			    }
		    	function errorCallback(data){
			    	dealFail(data);
			    }           	
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