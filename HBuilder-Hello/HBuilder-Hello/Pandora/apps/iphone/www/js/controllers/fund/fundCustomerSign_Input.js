define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

	//获取账单寄送选择
	//var deliver_typeArr = jQuery.param.getParams("DELIVERTYPE");
	//账单寄送方式
	//var deliver_wayArr = jQuery.param.getParams("DELIVERWAY");
	var sex;//性别
	mui.init();//预加载
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式	
		var self = plus.webview.currentWebview();
		var deposit_acct = self.f_deposit_acct;
		var mobileNo = localStorage.getItem("session_mobileNo");//手机号
		$("#deposit_acct").html(format.dealAccountHideFour(deposit_acct));
		$("#mobile_telno").html(mobileNo);
		
		//初始化验证证件类型若为身份证则性别单选禁用，或者其他证件类型放开单选按钮
		var certType = localStorage.getItem("session_certType");//证件类型
		if (certType == '0') {
			var certNo = localStorage.getItem("session_certNo");
			if (certNo.length == '15') {//15位身份证号
				if (certNo.substr(14,1) % 2 == 1) {
					//男
					sex ='1';
				} else{
					//女
					sex ='0';
				}
			}else if(certNo.length == '18'){//18位身份证号
					if (certNo.substr(16,1) % 2 == 1) {
					//男
					sex ='1';
				} else{
					//女
					sex ='0';
				}
			}
			//根据获取的性别选中对应的按钮
			$("input[type=radio][name=f_sex][value="+sex+"]").attr("checked",'checked');
			$("#radio1").attr("disabled",true);
			$("#radio2").attr("disabled",true);
		}
		
		/**********对账单寄送选择start************************************************************/
//		var areaPicker1 = new mui.SmartPicker({title:"请选择",fireEvent:"changeEvent1"});
//		areaPicker1.setData(deliver_typeArr);
//		document.getElementById("changeDeliver_type").addEventListener("tap",function(){
//			areaPicker1.show();
//		},false);
//		//document.getElementById("showdeliver_type").innerText = "请选择";
//		//默认不寄送
//		$("#deliver_type").val("1");
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
//		document.getElementById("showdeliver_way").innerText = "请选择";
//		//点击事件
//		window.addEventListener("changeEvent2",function(event){
//			var showevent2 = event.detail;
//			document.getElementById("showdeliver_way").innerHTML = showevent2.text;
//			document.getElementById("deliver_way").value = showevent2.value;
//			
//			changeDeliverwaySelect(showevent2.value);
//      });
       	/**********对账单寄送方式end*************************************************************/
       	
//     	function changeDeliverwayStyle(delivertype){
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
       	
//     	function changeDeliverwaySelect(selectval){
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
		//协议跳转
		document.getElementById("fundCustomerSign_Agreement").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path,id,"slide-in-right",{noCheck:noCheck});
		});
		//下一步
		$("#nextButton").click(function(){
			//验证输入信息
			var mobile_telno = localStorage.getItem("session_mobileNo");//手机号
			//var deliver_type = $("#deliver_type").val();//对账单寄送选择
			//var deliver_way = $("#deliver_way").val();//对账单寄送方式
			var post_code = ignoreSpaces($("#post_code").val());//邮政编码
			var address = ignoreSpaces($("#address").val());//通讯地址
			//var faxno = ignoreSpaces($("#faxno").val());//传真号码N
			var email = ignoreSpaces($("#email").val());//电子邮箱N
			var f_sex = $("input[name='f_sex']:checked").val();//性别
			
//			if (deliver_type == '') {
//				mui.alert("请选择对账单寄送选择");
//				return false;
//			}
//			if (deliver_type!='1') {
//				if (deliver_way == '') {
//					mui.alert("请选择对账单寄送方式");
//					return false;
//				}
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
					mui.alert("请输入正确的邮箱");
					return false;
				}
			}
			if (!$("#agreeCheck").is(":checked")) {
				mui.alert("请阅读湖北银行证券投资基金投资人权益须知");
				return false;
			}
			
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
////					if (faxno!='') {
////						var reg = /^(0?\d{2,3}\-)?[1-9]\d{6,7}(\-\d{1,4})?$/;
////						if(!reg.test(faxno)){
////							mui.alert("请输入正确的传真号码");
////							return false;
////						}
////					}
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
//							mui.alert("请输入正确的邮箱");
//							return false;
//						}
//					}
//				}
//			}
			var params = {
				deposit_acct:deposit_acct,
				mobile_telno:mobile_telno,
				deliver_type:"2",
				deliver_way:"2",
				post_code:post_code,
				address:address,
				email:email,
				sex:f_sex
			};
			mbank.openWindowByLoad('fundCustomerSign_Confirm.html','fundCustomerSign_Confirm','slide-in-right',params);
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
		mbank.resizePage(".agreement_bg");
	});
});