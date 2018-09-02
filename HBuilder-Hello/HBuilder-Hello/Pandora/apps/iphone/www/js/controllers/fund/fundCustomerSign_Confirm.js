define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	
	var searchkeyTemp;//搜索关键字
	var publickeyTemp;//密码公钥
	
//	var accountOpenNode;//账户核心开户网点
//	var accountOpenNodeName;//账户核心开户网点名称
	var bank_cust_code;
	var card_subbrch_code;
	var cust_name;
	var id_type;
	var id_code;
	var sex;
	

	mui.init();//预加载
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var contextData = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('010101',contextData);
		
		//获取session数据
		var customerNameCN = localStorage.getItem("session_customerNameCN");//客户中文名称
		var sessioncertType = localStorage.getItem("session_certType");//证件类型
		var sessioncertNo = localStorage.getItem("session_certNo");//证件号码
		
		var deposit_acct = contextData.deposit_acct;
		var mobile_telno = contextData.mobile_telno;
		var deliver_type = contextData.deliver_type;
		var deliver_way = contextData.deliver_way;
		var showfsex = contextData.sex;
		var post_code = contextData.post_code;
		var address = contextData.address;
		var faxno = contextData.faxno;
		var email = contextData.email;
		$("#deposit_acct").text(format.dealAccountHideFour(deposit_acct));
		$("#mobile_telno").text(mobile_telno);
		//$("#deliver_type").text(jQuery.param.getDisplay("DELIVER_TYPE",deliver_type));
		$("#showfsex").text(jQuery.param.getDisplay("DISPLAYSEX",showfsex));
		$("#post_code").text(post_code);
		$("#address").text(address);
		$("#email").text(email);
		
//		if (deliver_type&&deliver_type!='1') {
//			document.getElementById("showdeliver_way").style.display = "block";
//			$("#deliver_way").text(jQuery.param.getDisplay("DELIVER_WAY",deliver_way));
//			if (deliver_way&&deliver_way == '0') {
//				document.getElementById("showfaxno").style.display = "block";
//				$("#faxno").text(faxno);
//				
//			}else if(deliver_way&&deliver_way == '1'){
//				//document.getElementById("showaddress").style.display = "block";
//				//document.getElementById("showpost_code").style.display = "block";
//				//$("#post_code").text(post_code);
//				//$("#address").text(address);
//			}else if(deliver_way&&deliver_way == '2'){
//				document.getElementById("showemail").style.display = "block";
//				$("#email").text(email);
//			}
//		}
		
		//查询个人客户信息
		//无需调用专门的接口进行查询
		/*queryPersonalInfo();
		function queryPersonalInfo(){
			var sessioncustomerId = localStorage.getItem("session_customerId");
			var params1 = {
				f_deposit_acct:deposit_acct,
				customerId:sessioncustomerId
			};
			var url1 = mbank.getApiURL() + 'queryPersonAccInfo.do';
			mbank.apiSend("post",url1,params1,successCallback,errorCallback,false);
			function successCallback(data){
				accountOpenNode = data.accountOpenNode;
				accountOpenNodeName = data.accountOpenNodeName;
			}
			function errorCallback(e){}
		}*/
		//下一步
		$("#confirmButton").click(function(){		
			var params2 = {
				f_deposit_acct:deposit_acct,//银行结算账号
				f_cust_type:"1",//客户类型
				f_open_busi:"3",//所属系统编号
//				f_card_subbrch_code:accountOpenNode,//开卡网点
				f_cust_name:customerNameCN,//客户名称
				f_id_type:sessioncertType,//证件类型
				f_id_code:sessioncertNo,//证件号码
				f_sex:showfsex,//性别
				f_mobile_telno:mobile_telno,//手机号码
				f_post_code:post_code,//邮政编码
				f_email:email,//电子邮箱
				f_address:address,//通信地址
				f_deliver_type:deliver_type,//对账单寄送选择
				f_deliver_way:deliver_way//对账单寄送方式
			};
			var url2 = mbank.getApiURL()+'customerSigningSubmit.do';
		    commonSecurityUtil.apiSend("post",url2,params2,successCallback,errorCallback,true);
		    var successFlag = false;//签约成功标识 true为成功
		    function successCallback(data){
		    	successFlag = true;
		    	var params2 = {
					f_deposit_acct:deposit_acct,//银行结算账号
					successFlag:successFlag//签约成功标识 true为成功
				};
		        mbank.openWindowByLoad('../fund/fundCustomerSign_Result.html','fundCustomerSign_Result','slide-in-right',params2);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	//验证码或账户密码错误
		    	if (data.ec == 'EBLN001055' || data.ec == 'SM04') {
		    		mui.alert(errorMsg);
		    	} else{
		    		successFlag = false;
			    	var params2 = {
						f_deposit_acct:deposit_acct,//银行结算账号
						errorMsg:errorMsg,//返回错误信息
						successFlag:successFlag//签约成功标识 true为成功
					};
			    	mbank.openWindowByLoad('../fund/fundCustomerSign_Result.html','fundCustomerSign_Result','slide-in-right',params2);
		    	}
		    }	
		});
		//下一步按钮控制不往上顶
		mbank.resizePage(".btn_bg_f2");
	});
});