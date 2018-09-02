/*
 * 修改账单页面js
 */
define(function(require, exports, module) {
	
	var doc = document;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	
	var cardType = "2";//用于查询信用卡
	var sendWay = doc.getElementById("sendWay");//寄送方式
	var paper = doc.getElementById("paper");//纸质账单
	var electronic = doc.getElementById("electronic");//电子账单
	var chooseWay = doc.getElementById("chooseWay");//选择方式，用于区分纸质与邮箱显示
	var changeBt = doc.getElementById("abc");//按钮--div
	var accountConfirm = doc.getElementById("accountConfirm");//按钮
	
	//信用卡列表
	var iAccountInfoList = [];
	var accountPickerList=[];
	var cardList = [];
	var length;
	var currCredit;
	
	//显示数据
	var cardNo;
	var ckCardNo = "";
	var ckCardNoError = "";
	var province = doc.getElementById("province");
	var provinceShow = doc.getElementById("provinceShow");
	var addressShow = doc.getElementById("addressShow");
	var postalcode = doc.getElementById("postalcode");
	var email = doc.getElementById("email");
	var reckType;
	
	//修改数据
	var proChange;
	var cityChange;
	var areaCodeChange;
	var addressChange;
	var zipCodeChange;
	mui.init();
	
	mui.plusReady(function() {
		mbank.resizePage("#abc");
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var state = app.getState();
		var self = plus.webview.currentWebview();
		cardList = self.cardList;
		sendWay.innerText = "纸质账单";
		queryCreditCardAccount();//查询用户信用卡下挂账户列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"6");
			function allCardBack(data){
				iAccountInfoList = data;
				console.log(iAccountInfoList)
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if (length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
					$("#cardNo").val(currentAcct);
					cardNo = currentAcct;
					queryBillInfo(cardNo);
				}
				//queryCridetSign(currentAcct);
			}
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
				accountPicker = new mui.SmartPicker({title:"请选择信用卡",fireEvent:"payAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changecardNo").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();			
		});

        window.addEventListener("payAccount",function(event){
                var param=event.detail;			
				currentAcct=iAccountInfoList[param.value];
				$("#cardNoShow").html(format.dealAccountHideFour(currentAcct.accountNo));     
        		$("#cardNo").val(currentAcct.accountNo);
        		cardNo = $("#cardNo").val();
        		queryBillInfo(cardNo);
        });
		
		
		function queryBillInfo(card){
			mbank.showWaiting();
			var url = mbank.getApiURL() + 'billInfoQuery.do';
			mbank.apiSend('post',url, {cardNo:card}, querySuccess, queryError, false);
			
			function querySuccess(data){
				if( "LT" == data.reckType){
					sendWay.innerText = "纸质账单";
					doc.getElementById("paper").style.display = "block";
					doc.getElementById("electronic").style.display = "none";
					changeBt.style.display="none";
				}else if("EM" == data.rechType){
					sendWay.innerText = "电子账单";
					doc.getElementById("paper").style.display = "none";
					doc.getElementById("electronic").style.display = "block";
					changeBt.style.display="block";
				}
				if(data.province+data.city+data.areaCode != 0){
					provinceShow.innerText = data.province+data.city+data.areaCode;
					proChange = data.province;
					cityChange = data.city;
					areaCodeChange = data.areaCode;
				}
				if(data.adress != 0){
					addressShow.innerText = data.adress;
					addressChange = data.adress;
				}
				if(data.zipCode != 0){
					postalcode.innerText = data.zipCode;
					zipCodeChange = data.zipCode;
				}
				$("#email").val(data.mailAddr);
				ckCardNo  = card;
				mbank.closeWaiting();
			}
			
			function queryError(e){
				nativeUI.toast(e.em);
				ckCardNo  = "";
				ckCardNoError  = e.em;
				mbank.closeWaiting();
			}
		}
		
		//账单寄送方式默认为纸质，可选电子账单
		//sendWay.innerText = "纸质账单";
		//paper.style.display="none";
		//对省市区初始化
		//addressInit("province","city","areaCode","","","");
		
		chooseWay.addEventListener('tap',function(){
			//{title:"纸质账单"}, 
			var bts=[{title:"纸质账单"},{title:"电子账单"}];
			plus.nativeUI.actionSheet({title:"账单寄送方式",cancel:"取消",buttons:bts},
				function(e){
					if(e.index>0){
						sendWay.innerText = bts[e.index-1].title;
					}
					//sendWay.innerText = ((e.index>0)?bts[e.index-1].title:"");
					//mui.alert(sendWay.innerText);
					if("纸质账单" == sendWay.innerText){
						electronic.style.display="none";
						paper.style.display="block";
						changeBt.style.display="none";
					}else if("电子账单" == sendWay.innerText){
						electronic.style.display="block";
						paper.style.display="none";
						changeBt.style.display="block";
					}
				}
			);
		});
		
		accountConfirm.addEventListener('tap',function(){
//			mui.alert(email.value);
			if("电子账单" == sendWay.innerText){
//				rechType = "LE";//纸质账单的标识为'LE' 电子账单的标识为'EM' modify by 2017-5-9 
				var rechType = "EM";
				/*mui.alert(cardNo+" "+rechType+" "+email.innerText
						+" "+1+" "+province.innerText+" "+city.innerText
						+" "+section.innerText+" "+address.innerText+" "
						+postalcode.innerText);*/
				if(checkEmail(email.value) && checkCardNo(cardNo))	{
					var noCheck = this.getAttribute("noCheck");
					var id = this.getAttribute("id");
					var path = this.getAttribute("path");
					mbank.openWindowByLoad(path, id, "slide-in-right",
					{
						cardNo:cardNo,
						changeList:'00000000',
						reckType:rechType,
						mailAddr:email.value,
						billDate:'',
						province:proChange,
						city:cityChange,
						areaCode:areaCodeChange,
						address:addressChange,
						zipCode:zipCodeChange,
						noCheck:noCheck
					});
				}else{
					return false;
					
				}
			}else{
				nativeUI.toast("纸质账单只能到柜面修改");
			}
		});
		
		function checkEmail(str){
			var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			if(!reg.test(str)){
				nativeUI.toast("请输入正确的邮箱");
				return false;
			}else{
				return true;
			}
			return false;
		}
		
		function checkCardNo(card){
			if(""==card||null==card){	
				nativeUI.toast("请选择信用卡");
				return false;
			}
			if(""==ckCardNo||null==ckCardNo){	
//				mui.alert(ckCardNoError);
				nativeUI.toast(ckCardNoError);
				return false;
			}
			return true;
		}
		
		/*var frontView = plus.webview.getWebviewById("billManager");
		mui.back = function(){
			plus.webview.close(frontView);
			plus.webview.close(self);
		}
		
		//右滑
		window.addEventListener("swiperight",function(e){
	    	plus.webview.getWebviewById("limitHistory").show();
	    	mui.fire(plus.webview.getWebviewById("billManager"),"changeMenu",{pageId:"limitHistory"});
	    });*/
	});
});