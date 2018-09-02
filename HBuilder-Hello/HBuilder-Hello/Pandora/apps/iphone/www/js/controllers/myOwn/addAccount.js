define(function(require, exports, module) {
	
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var param = require('../../core/param');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	mui.init();
	mui.plusReady(function() {
		self = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('001003', self);
		plus.screen.lockOrientation("portrait-primary");
		radioType = "0"; //0代表借记卡 1代表信用卡 
		//如果账户类型是信用卡，账户类型单选信用卡
		if (self.showAccType == '6') {
			$("input[name='radio1'][value='1']").attr("checked",true);
			$("#accountTitle").html("信用卡卡号");
			$('#accountPassword').parent().hide();
			$('#cvv2').show();
			$('#account').val('');
			$('#accountPassword').val('');
			radioType = "1";
			$('.box_top15px').show();
		}
		$('#accountName').text(userInfo.get("session_customerNameCN"));
		mbank.resizePage('.btn_bg_f2');
		
		$('#submit').on('tap',function(){
			var account = $("#account").val();
			var pwd = $("#accountPassword").val();
			var cvv2 = $("#pwd").val();
			var searchKey;
			
			
			
			if(radioType=="0"){
				if(account=="请输入账号"||account==""){
					mui.alert("请输入账号");
					return false;
				}
				if(pwd=="请输入密码"||pwd==""){
					mui.alert("请输入密码");
					return false;
				}
				if(account.length<16||account.length>32){
					mui.alert("账号长度为16-32位");
					return false;
				}
				if(pwd.length!=6){
					mui.alert("密码长度为6位");
					return false;
				}
				addAccount();
			} else {
				if(account=="请输入账号"||account==""){
					mui.alert("请输入账号");
					return false;
				}
				if(cvv2=="请输入CVV2码"||cvv2==""){
					mui.alert("请输入CVV2码");
					return false;
				}
				if(account.length<16||account.length>32){
					mui.alert("账号长度为16-32位");
					return false;
				}
				if(cvv2.length!=3){
					mui.alert("请输入信用卡背面签名栏后三位");
					return false;
				}
				addAccount();
			}
			
			
			
			function addAccount(){
				if(radioType=="0"){
					var addUrl = mbank.getApiURL() + '001003_addDebitAccountSubmit.do';
//					alert(commonSecurityUtil.getRandomKey())
					var params = {"accountNo":account,"randomSum":commonSecurityUtil.getRandomKey()};
					commonSecurityUtil.apiSend("post",addUrl,params,function(data){
						var msg = {title:"新增账户",
							value:"新增账户成功!",
							accountNo:account,
							certType:data.certType,
							certNo:data.certNo
						};
						mbank.openWindowByLoad('addAccountOK.html','addAccountOK','slide-in-right',{"params":msg});
					},errorCallback,true);
				} else {
					
					var addUrl = mbank.getApiURL() + '001003_addCreditCardSubmit.do';
					console.log(cvv2);
					var params = {"accountNo":account,"CVV2":cvv2};
					mbank.apiSend("post",addUrl,params,function(data){
						var msg = {title:"新增账户",
							value:"新增信用卡账户成功!",
							accountNo:account,
							certType:data.certType,
							certNo:data.certNo
						};
						mbank.openWindowByLoad('addAccountOK.html','addAccountOK','slide-in-right',{"params":msg});
					},errorCallback,true);
					
				}
			}
			
			
			function errorCallback(data){
				mui.alert(data.em);
			}
			
		});
		
		$("input[name='radio1']").on("change",function(){
            radioType=$("input[name='radio1']:checked").val();
            if( radioType=="0" ){
				$("#accountTitle").html("银行卡卡号");
				$('#accountPassword').parent().show();
				$('#cvv2').hide();
				$('#account').val('');
				$('#pwd').val('');
				$('#account').val('');
				$("#account").attr("placeholder","请输入账号");
				$('.box_top15px').hide();
				/*$('#accountPassword').siblings()[0].innerHTML = '取款密码';
				$('#account').val('');
				$("#accountPassword").val('');
				$("#accountPassword").attr("placeholder","请输入取款密码");*/

            }else if(radioType=="1"){
				$("#accountTitle").html("信用卡卡号");
				$('#accountPassword').parent().hide();
				$('#account').val('');
				$("#account").attr("placeholder","请输入信用卡卡号");
				$('#cvv2').show();
				$('#account').val('');
				$('#accountPassword').val('');
				$('.box_top15px').show();
				/*$('#accountPassword').siblings()[0].innerHTML = 'CVV2';
				$("#pwdTitle").html("CVV2码");
				$('#account').val('');
				$("#accountPassword").val('');
				$("#accountPassword").attr("placeholder","请输入CVV2码");*/
            }
        });
        
        $('#test').on('tap',function(){
        	mbank.openWindowByLoad('clientSet.html','clientSet','slide-in-right');
        });
        
        plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
		
		plus.key.addEventListener('menubutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
		
	});
})