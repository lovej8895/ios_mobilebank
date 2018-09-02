define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	
	var searchkeyTemp;//搜索关键字
	var publickeyTemp;//密码公钥
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var contextData = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('010104',contextData);
		
		var f_deposit_acct = contextData.f_deposit_acct;//签约账号
		var f_mobile_telno = contextData.f_mobile_telno;//手机号码
		var f_deliver_type = contextData.f_deliver_type;//对账单寄送选择
		var f_deliver_way = contextData.f_deliver_way;//对账单寄送方式
		var f_post_code = contextData.f_post_code;//邮政编码
		var f_address = contextData.f_address;//
		var f_faxno = contextData.f_faxno;//传真号码
		var f_email = contextData.f_email;//电子邮箱

		$("#deposit_acct").text(format.dealAccountHideFour(f_deposit_acct));
		$("#mobile_telno").text(f_mobile_telno);
		//$("#deliver_type").text(jQuery.param.getDisplay("DELIVER_TYPE",f_deliver_type));
		$("#post_code").text(f_post_code);
		$("#address").text(f_address);
		$("#email").text(f_email);
		
		//如果对账单寄送选择为不寄送隐藏其他项
//		if (f_deliver_type!=1) {
//			$("#deliver_way").text(jQuery.param.getDisplay("DELIVER_WAY",f_deliver_way));
//			document.getElementById("showdeliver_way").style.display = "block";			
//			//根据对账单寄送方式显示对应的项
//			if (f_deliver_way =='0') {//传真
//				$("#faxno").text(f_faxno);
//				document.getElementById("faxnoStyle").style.display = "block";
//			}else if(f_deliver_way =='1'){//邮寄
//				$("#post_code").text(f_post_code);
//				$("#address").text(f_address);
//				//document.getElementById("showpost_code").style.display = "block";
//				//document.getElementById("showaddress").style.display = "block";				
//			}else if(f_deliver_way =='2'){//E-mail
//				$("#email").text(f_email);
//				document.getElementById("emailStyle").style.display = "block";
//			}
//		}
		
		//下一步
		$("#confirmButton").click(function(){		
			var params = {
				f_cust_name:contextData.f_cust_name,
				f_sex:contextData.f_sex,
				f_id_type:contextData.f_id_type,
				f_id_code:contextData.f_id_code,
				f_cust_type:contextData.f_cust_type,
				f_deposit_acct:f_deposit_acct,
				f_mobile_telno:f_mobile_telno,
				f_deliver_type:f_deliver_type,
				f_deliver_way:f_deliver_way,
				f_post_code:f_post_code,
				f_address:f_address,
				f_email:f_email,
				f_open_busi:"3"
			};
			var url = mbank.getApiURL()+'customerSigningInfoUpdate.do';
		    commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../fund/signInfoChange_Result.html','signInfoChange_Result','slide-in-right',params);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	mui.alert(errorMsg);
		    }	
		});
		//下一步按钮控制不往上顶
		mbank.resizePage(".btn_bg_f2");
	});
});
