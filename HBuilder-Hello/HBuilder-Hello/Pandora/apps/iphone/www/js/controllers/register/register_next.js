define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
    var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var accountPicker;
	var certTypeList = jQuery.param.getParams('CERT_TYPE');
	var certType = null;
	var mobileNo = null;
	$.init();
	$.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		//var queryCertType = doc.getElementById('queryCertType'),
			userName=doc.getElementById("userName"),
		    certType=doc.getElementById("certType"),
		    certNo=doc.getElementById("certNo"),//身份证号
		    showCert=doc.getElementById("showCert"),//身份证显示区域
		    nextBtn=doc.getElementById("next_Btn");//下一步
		    
		var selfview = plus.webview.currentWebview();
		mobileNo = selfview.mobileNo; 
		
	//查询证件类型
//	queryCertType.addEventListener('tap',function(event){
//			getPickerList(certTypeList);
//			
//			accountPicker.show(function(items) {
//			var pickItem=items[0];
//			var ctType=certTypeList[pickItem.value];
//			showCert.innerHTML = ctType;
//			certType.value = pickItem.value;
//		});		
//	},false);
	getPickerList(certTypeList);
	jQuery("#queryCertType").on("tap",function(){
		document.activeElement.blur();
		accountPicker.show();
	});
	window.addEventListener("certType",function(event){
		var pickItem=event.detail;
		showCert.innerHTML = pickItem.text;
		certType.value = pickItem.value;
		if(certType=='0'){
			document.getElementById("certNo").setAttribute("maxlength","18");

		}else{
			document.getElementById("certNo").setAttribute("maxlength","30");
		}
	});
	
	
	certNo.addEventListener('keyup',function(){
		var thv  = this.value;
		if(thv){
			this.value = thv.toUpperCase();
		}
	})
	certNo.addEventListener('blur',function(){
		var thv  = this.value;
		if(thv){
			this.value = thv.toUpperCase();
		}
	})
	
	//提交交易
	nextBtn.addEventListener("tap",function(event){
		if(checkFun()){
			 var params={
			 	userName:userName.value,//用户姓名
			 	certNo:certNo.value,//身份证号
			 	certType:certType.value,
			 	mobileNo:mobileNo,
			 	waitTitle:"正在注册..."
		 	};
			var url = mbank.getApiURL()+'registerConfirm.do';
	    	mbank.apiSend('post',url,params,callBack,failFun,true);
		}
		},false)
	
	
		//成功返回的函数
	function callBack(data){
		$.openWindow({
				url: 'register_confirm.html',
				id: 'register_confirm',
				show: {
					aniShow: 'slide-in-right'
				},
				createNew:true,
				styles: {
					popGesture: 'hide'
				},
				extras: {
					mobileNo:mobileNo,
					userName:userName.value,//用户姓名
					certNo:certNo.value,//身份证号
					certType:certType.value
					
				},
				waiting: {
					autoShow: false
				}
			});
	}
	
	function failFun(data){
		plus.nativeUI.toast("通讯超时，请重新提交")
	}
	
	
	//格式
	function checkFun(){
		var userNameval = userName.value|| '',
			certNoval = certNo.value|| '',
			certTypeval = certType.value|| '';
			
		if(IsEmpty(userNameval)){
			plus.nativeUI.toast("用户姓名不能为空");
			return false;
		}
		
		if(IsEmpty(certNoval)){
			plus.nativeUI.toast("证件号码不能为空");
			return false;
		}
		
		if(!isIDNumber(certNoval)){
			plus.nativeUI.toast("证件号码不合法");
			return false;
		}
		
		
		
		if(IsEmpty(certTypeval)){
			plus.nativeUI.toast("证件类型不能为空");
			return false;
		}
		return true;
		
	}
	
	
	function getPickerList(certList){
			if( certList ){
				certPickerList=[];
				var i=0;
				for( var ct in  certList){
					if(certList.hasOwnProperty(ct)){
						var certType=certList[ct];
						var pickItem={
							value:ct,
							text:certType
						};
						certPickerList.push(pickItem);
						
					}
				}
				accountPicker = new mui.SmartPicker({title:"请选择证件类型",fireEvent:"certType"});
			    accountPicker.setData(certPickerList);	
			}
		}
		
		
		
		mbank.resizePage('.but_bottom20px');
		plus.key.addEventListener('backbutton',function(){
			mui.back();
		})
	});
});