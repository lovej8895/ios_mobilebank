define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	//获取账单寄送选择
	//var deliver_typeArr = jQuery.param.getParams("DELIVERTYPE");
	//账单寄送方式
	//var deliver_wayArr = jQuery.param.getParams("DELIVERWAY");
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var contextData = plus.webview.currentWebview();
		
		var f_deposit_acct = contextData.f_deposit_acct;//签约账号
		var f_mobile_telno = contextData.f_mobile_telno;//手机号码
		var f_deliver_type = contextData.f_deliver_type;//对账单寄送选择
		var f_deliver_way = contextData.f_deliver_way;//对账单寄送方式
		var f_post_code = contextData.f_post_code;//邮政编码
		var f_address = contextData.f_address;//通讯地址
		var f_email = contextData.f_email;//电子邮箱
		//var f_faxno = contextData.f_faxno;//传真号码

		//如果账户状态为销户不提供变更0正常1销户
//		$("#deposit_acct").text(f_deposit_acct);
		$("#deposit_acct").html(format.dealAccountHideFour(f_deposit_acct));
		$("#deposit_acct").val(f_deposit_acct);
		$("#mobile_telno").val(f_mobile_telno);
		//$("#showdeliver_type").text(jQuery.param.getDisplay("DELIVER_TYPE",f_deliver_type));
		//$("#deliver_type").val(f_deliver_type);
		//f_deliver_way = jQuery.param.getDisplay("RECEIVE_DELIVER_WAY",f_deliver_way);//(后台返回，传真为1000,邮寄0100，email-0010,短信-0001)转换为对应数字
		//$("#showdeliver_way").text(jQuery.param.getDisplay("DELIVER_WAY",f_deliver_way));
		//$("#deliver_way").val(f_deliver_way);
		$("#post_code").val(f_post_code);
		$("#address").val(f_address);
		$("#email").val(f_email);
		//$("#faxno").val(f_faxno);
		if (contextData.f_cust_status == '0') {
			$("#nextButton").removeAttr("disabled",true);
		} else{
			$("#nextButton").attr("disabled",true);
		}
		
		//如果对账单寄送选择为不寄送隐藏其他项
//		if (f_deliver_type!=1) {
//			document.getElementById("changeDeliver_way").style.display = "block";
//			//根据对账单寄送方式显示对应的项
//			if (f_deliver_way =='0') {//传真
//				document.getElementById("faxnoStyle").style.display = "block";
//			}else if(f_deliver_way =='1'){//邮寄
//				
//			}else if(f_deliver_way =='2'){//E-mail
//				document.getElementById("emailStyle").style.display = "block";
//			}
//		}
		/**********对账单寄送选择start************************************************************/
//		var areaPicker1 = new mui.SmartPicker({title:"请选择",fireEvent:"changeEvent1"});
//		areaPicker1.setData(deliver_typeArr);
//		document.getElementById("changeDeliver_type").addEventListener("tap",function(){
//			areaPicker1.show();
//		},false);
//		//点击事件
//		window.addEventListener("changeEvent1",function(event){
//			var showevent1 = event.detail;
//			document.getElementById("showdeliver_type").innerHTML = showevent1.text;
//			document.getElementById("deliver_type").value = showevent1.value;
//			
//			changeDeliverwayStyle(showevent1.value);
//      });
        /**********对账单寄送选择end***************************************************************/
       	/**********对账单寄送方式start************************************************************/
//     	var areaPicker2 = new mui.SmartPicker({title:"请选择",fireEvent:"changeEvent2"});
//		areaPicker2.setData(deliver_wayArr);
//		document.getElementById("changeDeliver_way").addEventListener("tap",function(){
//			areaPicker2.show();
//		},false);
//		//点击事件
//		window.addEventListener("changeEvent2",function(event){
//			var showevent2 = event.detail;
//			document.getElementById("showdeliver_way").innerHTML = showevent2.text;
//			document.getElementById("deliver_way").value = showevent2.value;
//			
//			changeDeliverwaySelect(showevent2.value);
//      });
       	/**********对账单寄送方式end*************************************************************/
//      function changeDeliverwayStyle(delivertype){
//     		//如果选择不寄送时则不显示其他项
//     		document.getElementById("showdeliver_way").innerText = "请选择";
//     		document.getElementById("deliver_way").value ="";
//     		if (delivertype&&delivertype == '1') {//隐藏
//     			document.getElementById("changeDeliver_way").style.display = "none";
//				document.getElementById("faxnoStyle").style.display = "none";
//				document.getElementById("emailStyle").style.display = "none";
//     		} else{//显示
//     			document.getElementById("changeDeliver_way").style.display = "block";
//     			document.getElementById("faxnoStyle").style.display = "none";
//				document.getElementById("emailStyle").style.display = "none";
//     		}
//     	}
//		
//		function changeDeliverwaySelect(selectval){
//     		//根据选择的方式显示输入项
//     		if (selectval&&selectval == '0') {
//				document.getElementById("faxnoStyle").style.display = "block";
//				document.getElementById("emailStyle").style.display = "none";
//     		}else if(selectval&&selectval == '1'){
//				document.getElementById("faxnoStyle").style.display = "none";
//				document.getElementById("emailStyle").style.display = "none";
//     		}else if(selectval&&selectval == '2'){
//				document.getElementById("faxnoStyle").style.display = "none";
//				document.getElementById("emailStyle").style.display = "block";
//     		}else if(selectval&&selectval == '3'){
//				document.getElementById("faxnoStyle").style.display = "none";
//				document.getElementById("emailStyle").style.display = "none";
//     		}
//     	}
		
		//变更继续下一步确认页面
		$("#nextButton").click(function(){
			//验证输入信息
			var deposit_acct = $("#deposit_acct").val();//签约账号
			var mobile_telno = ignoreSpaces($("#mobile_telno").val());//手机号码
			//var deliver_type = $("#deliver_type").val();//对账单寄送选择
			//var deliver_way = $("#deliver_way").val();//对账单寄送方式
			var post_code = ignoreSpaces($("#post_code").val());//邮政编码
			var address = ignoreSpaces($("#address").val());//通讯地址
			//var faxno = ignoreSpaces($("#faxno").val());//传真号码
			var email = ignoreSpaces($("#email").val());//电子邮箱
			
			if (mobile_telno == '') {
				mui.alert("请输入手机号码");
				return false;
			}
			console.log(mobile_telno)
			if(numCheck(mobile_telno)||mobile_telno<=0||mobile_telno.length!=11){
				mui.alert("请输入11位整数的手机号码");
				return;
			}
//			if (deliver_type == '') {
//				mui.alert("请选择对账单寄送选择");
//				return false;
//			}
			if (post_code == '') {
				mui.alert("请输入邮政编码");
				return false;
			}
			if(numCheck(post_code)||post_code<=0||post_code.length!=6){
				mui.alert("请输入6位整数的邮政编码");
				return;
			}
			if (address == '') {
				mui.alert("请输入通讯地址");
				return false;
			}
			if (email == '') {
				mui.alert("请输入电子邮箱");
				return false;
			}
			if (email!='') {
				var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				if(!reg.test(email)){
					mui.alert("请输入正确的电子邮箱");
					return false;
				}
			}
			
			//不等于不寄送时
//			if (deliver_type!='1') {
//				if (deliver_way == '') {
//					mui.alert("请选择对账单寄送方式");
//					return false;
//				}
//				if(deliver_way&&deliver_way == '0'){//传真
//					email = "";
//					if (faxno == '') {
//						mui.alert("请输入传真号码");
//						return false;
//					}
//					if (faxno!='') {
//						var reg = /^(0?\d{2,3}\-)?[1-9]\d{6,7}(\-\d{1,4})?$/;
//						if(!reg.test(faxno)){
//							mui.alert("请输入正确的传真号码");
//							return false;
//						}
//					}
//				}else if (deliver_way&&(deliver_way == '1' || deliver_way == '3')) {//选中邮寄或短信
//					faxno = "";
//					email = "";
//				}else if(deliver_way&&deliver_way == '2'){//E-mail
//					faxno = "";
//					if (email == '') {
//						mui.alert("请输入电子邮箱");
//						return false;
//					}
//					if (email!='') {
//						var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
//						if(!reg.test(email)){
//							mui.alert("请输入正确的电子邮箱");
//							return false;
//						}
//					}
//				}
//			}
			
			//跳转到确认页面
			var params = {
				f_deposit_acct:deposit_acct,
				f_mobile_telno:mobile_telno,
				f_deliver_type:f_deliver_type,
				f_deliver_way:f_deliver_way,
				f_post_code:post_code,
				f_address:address,
				f_email:email,
				f_cust_name:contextData.f_cust_name,
				f_sex:contextData.f_sex,
				f_id_type:contextData.f_id_type,
				f_id_code:contextData.f_id_code,
				f_cust_type:contextData.f_cust_type
			};
			mbank.openWindowByLoad('../fund/signInfoChange_Confirm.html','signInfoChange_Confirm','slide-in-right',params);
		});
		
		//非整数
		function numCheck(num){
			var reg = new RegExp("^[0-9]*$");
			if(reg.test(num)){
				return false;
			}
			return true;
		}
		
		//去除空格
		function ignoreSpaces(string) {
			var temp = "";
			string = '' + string;
			splitstring = string.split(" ");
			for (i = 0; i < splitstring.length; i++)
				temp += splitstring[i];
			return temp;
		}
		//下一步按钮控制不往上顶
		mbank.resizePage(".btn_bg_f2");
	});
});
