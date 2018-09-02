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
		/************基金详情页面传入start************/
		var f_deposit_acct = contextData.f_deposit_acct;//签约账号
		var f_tano = contextData.f_tano;//Ta代码		
		
		var f_telno = localStorage.getItem("session_mobileNo");//手机号
		var f_cust_name = localStorage.getItem("session_customerNameCN");//客户名称
		var f_id_type = localStorage.getItem("session_certType");//证件类型
		var f_id_code = localStorage.getItem("session_certNo");//证件号码
		
		/************基金详情页面传入end************/
//		$("#deposit_acct").text(f_deposit_acct);
		$("#deposit_acct").html(format.dealAccountHideFour(f_deposit_acct));
		$("#telno").text(f_telno);
		
		/**********对账单寄送选择start************************************************************/
//		var areaPicker1 = new mui.SmartPicker({title:"请选择",fireEvent:"changeEvent1"});
//		areaPicker1.setData(deliver_typeArr);
//		document.getElementById("changeDeliver_type").addEventListener("tap",function(){
//			areaPicker1.show();
//		},false);
//		//默认不寄送
//		document.getElementById("showdeliver_type").innerText = "不寄送";
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
		
//		function changeDeliverwayStyle(delivertype){
//     		//如果选择不寄送时则不显示其他项
//     		document.getElementById("showdeliver_way").innerText = "请选择";
//     		document.getElementById("deliver_way").value ="";
//     		if (delivertype&&delivertype == '1') {//隐藏
//     			document.getElementById("changeDeliver_way").style.display = "none";
//				document.getElementById("faxnoStyle").style.display = "none";
//				document.getElementById("emailStyle").style.display = "none";
//     			
//     		} else{//显示
//     			document.getElementById("changeDeliver_way").style.display = "block";
//     		}
//     	}
		
//		function changeDeliverwaySelect(selectval){
//			document.getElementById("faxno").value = "";
//			document.getElementById("email").value = "";
       		//根据选择的方式显示输入项
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
		
		$("#nextButton").click(function(){
			//获取页面输入信息
			//var f_deliver_type = $("#deliver_type").val();//对账单寄送选项
			//var f_deliver_way = $("#deliver_way").val();//对账单寄送方式
			var f_post_code = $("#post_code").val();//邮政编码
			var f_address = $("#address").val();//通信地址
			//var f_faxno = $("#faxno").val();//传真号码
			var f_email = $("#email").val();//电子邮箱
			var f_fm_manager = $("#fm_manager").val();//理财经理代码
			
			//验证页面输入信息
//			if (f_deliver_type == '') {
//				mui.alert("请选择对账单寄送选择");
//				return false;
//			}
//			if (f_deliver_type!='1') {
//				if (f_deliver_way == '') {
//					mui.alert("请选择对账单寄送方式");
//					return false;
//				}
//			}
			if(numCheck(f_post_code)||f_post_code<=0||f_post_code.length!=6){
				mui.alert("请输入6位整数的邮政编码");
				return;
			}
			if (f_address == '') {
				mui.alert("请输入通讯地址");
				return false;
			}
			if (f_email == '') {
				mui.alert("请输入电子邮箱");
				return false;
			}
			if (f_email!='') {
				var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				if(!reg.test(f_email)){
					mui.alert("请输入正确的邮箱");
					return false;
				}
			}
//			if (f_deliver_type!='1') {
//				if (f_deliver_way == '') {
//					mui.alert("请选择对账单寄送方式");
//					return false;
//				}
//				if (f_deliver_way&&f_deliver_way == '0') {//选中传真
//					email = "";
//					if (f_faxno == '') {
//						mui.alert("请输入传真号码");
//						return false;
//					}
//					if (f_faxno!='') {
//						var reg = /^(0?\d{2,3}\-)?[1-9]\d{6,7}(\-\d{1,4})?$/;
//						if(!reg.test(f_faxno)){
//							mui.alert("请输入正确的传真号码");
//							return false;
//						}
//					}
//				}else if(f_deliver_way&&(deliver_way == '1' || deliver_way == '3')){//选中邮寄或短信
//					f_faxno = "";
//					f_email = "";
//				}
//				else if(f_deliver_way&&f_deliver_way == '2'){//E-mail
//					f_faxno = "";
//					if (f_email!='') {
//						var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
//						if(!reg.test(f_email)){
//							mui.alert("请输入正确的邮箱");
//							return false;
//						}
//					}
//				}
//			}
			
            f_fm_manager = f_fm_manager.trim();
            if(""!=f_fm_manager){
	            if(numCheck(f_fm_manager)||f_fm_manager<0||f_fm_manager.length>11){
					mui.alert("请输入不超过11位整数的理财经理代码");
					return;
				}
            }
			
			//传入下一页面信息
			var params = {
				deposit_acct:f_deposit_acct,
				telno:f_telno,
				deliver_type:"2",
				deliver_way:"2",
				post_code:f_post_code,
				address:f_address,
				email:f_email,
				fm_manager:f_fm_manager,
				tano:f_tano,
				cust_name:f_cust_name,
				id_type:f_id_type,
				id_code:f_id_code
			};
			//跳转
			mbank.openWindowByLoad('treasureClassSign_Confirm.html','treasureClassSign_Confirm','slide-in-right',params);
		})
		
		//非整数
		function numCheck(num){
			var reg = new RegExp("^[0-9]*$");
			if(reg.test(num)){
				return false;
			}
			return true;
		}
		
		//下一步按钮控制不往上顶
		mbank.resizePage(".btn_bg_f2");
	});
});
