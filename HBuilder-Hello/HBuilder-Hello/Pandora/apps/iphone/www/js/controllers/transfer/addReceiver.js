define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	mui.init();
	var radioType="0";
	var recAccountOpenBank="";
    var recAccountOpenBankName="";
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		$("#link").hide();
		mbank.resizePage('.but_bottom20px');
		$('#submit').on('tap',function(){
			var bankName = $("#bankName").html();
			if(bankName=="请选择开户行"||bankName==""){
				mui.alert("请选择开户行！");
				return false;
			}
			var accountName = $("#accountName").val();
			if(accountName=="请输入姓名"||accountName==""){
				mui.alert("请输入姓名！");
				return false;
			}
			if(accountName.length<2||accountName.length>20){
				mui.alert("姓名长度在2-20位之间");
				return false;
			}
			var regNameC = /[\u4e00-\u9fa5]+/g; //判断中文字符
			var regNameE = /^[a-zA-Z]+$/;
			if(!regNameC.test(accountName)&&!regNameE.test(accountName)){
				mui.alert("姓名格式不正确!");
				return false;
			}
			var accountNum = $("#accountNum").val();
			if(accountNum=="请输入账号"||accountNum==""){
				mui.alert("账号为空或格式不正确!");
				return false;
			}
			if(accountNum.length<6||accountNum.length>32){
				mui.alert("账号长度应为6至32位");
				return false;
			}
			var url = mbank.getApiURL()+'payBookLoad.do';
			var params;
			if(radioType=="0"){
				params = {'payBookChannel':'1',
						'recAccountName':$('#accountName').val(),
						'payBookType':'1',
						'payBookDealFlag':'0',
						'recAccount':$('#accountNum').val(),
						'recAccountOpenBank':'313521006000',
						'recAccountOpenBankName':"湖北银行"
				};
				
			} else if(radioType=="1"){
				params = {'payBookChannel':'1',
						'recAccountName':$('#accountName').val(),
						'payBookType':'2',
						'payBookDealFlag':'0',
						'recAccount':$('#accountNum').val(),
						'recAccountOpenBank':recAccountOpenBank,
						'recAccountOpenBankName':recAccountOpenBankName
				};
			}
//			console.log(recAccountOpenBank+"  "+recAccountOpenBankName);
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		    	var msg = {title:"添加收款人",value:"添加收款人成功"};
				mbank.openWindowByLoad('../transfer/addReceiverResult.html','addReceiverResult','slide-in-right',{params:msg});
		    }
		    function errorCallback(data){
		    	mui.alert(data.em);
		    }
		});
		
		
		$("input[name='radio1']").on("change",function(){
            radioType=$("input[name='radio1']:checked").val();
            if( radioType=="0"){
            	$("#bankName").html("湖北银行");
            	$("#link").hide();
            }else if(radioType=="1"){
            	$("#bankName").html("请选择开户行");
            	$("#link").show();
            }
        });
        
        $("#chooseBank").on('tap',function(){
        	if(radioType=="1"){
        		mbank.openWindowByLoad('../transfer/selectBank.html','selectBank','slide-in-right');
        	}
        });
        window.addEventListener('bankInfo', function(event) {
			var recOpenBank=event.detail;
			recAccountOpenBank=recOpenBank.clearBankNo;
			recAccountOpenBankName=recOpenBank.signBankName;
            $("#bankName").html(recAccountOpenBankName);
            
		});
        
	});
});