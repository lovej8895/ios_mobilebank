define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	
	var accountOpenNode;//账户核心开户网点
	var accountOpenNodeName;//账户核心开户网点名称
	var searchkeyTemp;//搜索关键字
	var publickeyTemp;//密码公钥
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var contextData = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('010102',contextData);
		
		var f_deposit_acct = contextData.deposit_acct;
		var f_telno = contextData.telno;
		var f_deliver_type = contextData.deliver_type;
		var f_deliver_way = contextData.deliver_way;
		var f_post_code = contextData.post_code;
		var f_address = contextData.address;
		var f_faxno = contextData.faxno;
		var f_email = contextData.email;
		var f_fm_manager = contextData.fm_manager;
		var f_tano = contextData.tano;		
		var f_cust_name = contextData.cust_name;
		var f_id_type = contextData.id_type;
		var f_id_code = contextData.id_code;
		
		$("#deposit_acct").text(f_deposit_acct);
		$("#f_telno").text(f_telno);
		//$("#deliver_type").text(jQuery.param.getDisplay("DELIVER_TYPE",f_deliver_type));
		$("#post_code").text(f_post_code);
		$("#address").text(f_address);
		$("#email").text(f_email);
		if (f_fm_manager!="" && f_fm_manager!=null) {
			$("#fm_manager").text(f_fm_manager);
			document.getElementById("showfmmanager").style.display = "block";
		}
		
		//如果对账单寄送选择为不寄送隐藏其他项
//		if (f_deliver_type!=1) {
//			$("#deliver_way").text(jQuery.param.getDisplay("DELIVER_WAY",f_deliver_way));
//			document.getElementById("showdeliver_way").style.display = "block";			
//			//根据对账单寄送方式显示对应的项
//			if (f_deliver_way =='0') {//传真
//				$("#faxno").text(f_faxno);
//				document.getElementById("faxnoStyle").style.display = "block";
//			}else if(f_deliver_way =='1'){//邮寄
//				
//			}else if(f_deliver_way =='2'){//E-mail
//				$("#email").text(f_email);
//				document.getElementById("emailStyle").style.display = "block";
//			}
//		}
		//查询个人客户信息
		queryPersonalInfo();
		function queryPersonalInfo(){
			var sessioncustomerId = localStorage.getItem("session_customerId");
			var params1 = {
				f_deposit_acct:f_deposit_acct,
				customerId:sessioncustomerId
			};
			var url1 = mbank.getApiURL() + 'queryPersonAccInfo.do';
			mbank.apiSend("post",url1,params1,successCallback,errorCallback,false);
			function successCallback(data){
				accountOpenNode = data.accountOpenNode;
				accountOpenNodeName = data.accountOpenNodeName;
			}
			function errorCallback(e){}
		}
		//下一步
		$("#confirmButton").click(function(){
			
			//上上页面传入f_cust_name、f_id_type、f_id_code、f_distributorcode、f_tano
			//测试暂时赋值
			var params ={
				f_cust_type:"1",
				f_cust_name:f_cust_name,
				f_id_type:f_id_type,
				f_id_code:f_id_code,
				f_reg_subbrch_code:accountOpenNode,
				f_distributorcode:"948",
				f_tano:f_tano,
				f_deposit_acct:f_deposit_acct,
				f_mobile_telno:f_telno,
				f_fm_manager:f_fm_manager,
				f_deliver_type:f_deliver_type,
				f_deliver_way:f_deliver_way,
				f_email:f_email,
				f_post_code:f_post_code,
				f_address:f_address
			};
			var url = mbank.getApiURL()+'treasureClassSignSubmit.do';
		    commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);
		    var successFlag = false;//签约成功标识 true为成功
		    function successCallback(data){
		    	successFlag = true;
		    	var params2 = {
					f_deposit_acct:f_deposit_acct,
					successFlag:successFlag
				};
		        mbank.openWindowByLoad('../fund/treasureClassSign_Result.html','treasureClassSign_Result','slide-in-right',params2);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	//验证码或账户密码错误
		    	if (data.ec == 'EBLN001055' || data.ec == 'SM04') {
		    		mui.alert(errorMsg);
		    	} else{
		    		successFlag = false;
			    	var params2 = {
						f_deposit_acct:f_deposit_acct,
						errorMsg:errorMsg,
						successFlag:successFlag
					};
			    	mbank.openWindowByLoad('../fund/treasureClassSign_Result.html','treasureClassSign_Result','slide-in-right',params2);
		    	}	    	
		    }	
		});
		
		//下一步按钮控制不往上顶
		mbank.resizePage(".btn_bg_f2");
	});
});
