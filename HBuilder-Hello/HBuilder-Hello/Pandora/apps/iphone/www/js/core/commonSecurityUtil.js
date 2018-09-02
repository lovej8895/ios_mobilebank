define(function(require, exports, module) {
	var m = mui;
	var mbank = require('./bank');
	var passwordUtil = require('./passwordUtil');
	var usbKeyUtil = require('./usbKeyUtil');
	var $ = jQuery;
	
	var CURRENT_CODE = '';
	var REQUEST_DATA = null;
	
	var currentUrl = window.location.href;
	var ACCESS_TO_UKEY = jQuery.param.checkUsbKeyRole(currentUrl);
	
	//初始化安全事件
//	document.addEventListener('plusready',function(){},true);//事件捕获
	exports.initSecurityEvent = function(){
		
		var safeType = localStorage.getItem('session_mastSafe');
		var accountPassword = jQuery('#accountPassword');
		
		var securityElem = jQuery('div[data-security]');
		var isNeedAuth = (securityElem.attr('data-security')||'').split('|').join('|').indexOf('needAuth');
		var isPwdCheck = (securityElem.attr('data-security')||'').split('|').join('|').indexOf('needPassword');
		
		//安全类型对象
		var tabSafeType = jQuery("#mb_trans_safe_type");
		//短信验证码对象
		var smsTypeElem = jQuery("#smsType");
		//音频key对象
		var ukTypeElem = jQuery("#ukType");
		
		
		if(isPwdCheck>=0&&accountPassword&&accountPassword.length!=0){
			
				if(jQuery.param.SOFTPWD_SWITCH){
					accountPassword[0].readOnly="readOnly";
					accountPassword[0].addEventListener('click', function() {
						//开启密码键盘
						passwordUtil.openNumKeyboard('accountPassword',successCallback,null);
						
					},false);
					
					function successCallback(retObj){
							if(document.getElementById('accountPassword')){
								document.getElementById('accountPassword').value = retObj.inputText;
							}
							if(document.getElementById('_accountPassword')){
								document.getElementById('_accountPassword').value = retObj.cipherText;
							}
					}
				}
			}
		
		
		//短信验证码
		if(safeType=='0'&&isNeedAuth>=0){
			exports.bindSMSEvent('sendPassword');
		}
		
		if(safeType=='2'&&isNeedAuth>=0){//usbkey
			//默认显示短信验证码，立即绑定即可
			exports.bindSMSEvent('sendPassword');
			//切换安全类型进行动态显示
			if(ACCESS_TO_UKEY){
				tabSafeType.on('click','input',function(){
					var self = jQuery(this);
					var value = self.val();
					if(value==='0'){//短信认证
						smsTypeElem.show();
						ukTypeElem.hide();
					}
					if(value==='2'){//音频KEY认证
						smsTypeElem.hide();
						ukTypeElem.show();
					}
				});
			}
		}
		
	}
	
	
	/**
	 *  绑定发送短信验证码事件
	 * @param {Object} smsElem
	 */
	exports.bindSMSEvent = function(smsElem){
		var sendPassword = jQuery('#'+smsElem);
			if(sendPassword&&sendPassword.length!=0){
				sendPassword[0].addEventListener('tap',sendPasswordComm)
			}
	}
	
	/**
	 * 初始化安全认证需要的数据
	 * @param {Object} currentCode  交易代码
	 * @param {Object} requestParam	请求数据
	 * 可以支持一个参数 requestParam
	 */
	exports.initSecurityData = function(currentCode,requestParam){
		
		if(arguments.length==1){
			if(typeof arguments[0] !='object'){
				mui.alert('安全认证初始化数据有误');
				return false;
			}
		}
		
		 CURRENT_CODE = currentCode||requestParam['currentCode'];
		 REQUEST_DATA = requestParam||{};
		 //格式化处理金额
		 if(REQUEST_DATA && REQUEST_DATA['payAmount']){
		 	var payAmount = REQUEST_DATA['payAmount'];
		 	if(payAmount.indexOf(',')>0){
		 		REQUEST_DATA['payAmount'] = getSendAmt(payAmount);
		 	}
		 }else if(REQUEST_DATA && REQUEST_DATA['amountRealCharged']){
		 	var amountRealCharged = REQUEST_DATA['amountRealCharged'];
		 	if(amountRealCharged.indexOf(',')>0){
		 		REQUEST_DATA['amountRealCharged'] = getSendAmt(amountRealCharged);
		 	}
		 }
		 exports.initSecurityEvent();
	}
	
	
	/**
	 * 
	 * @param {Object} currentCode   当前交易的交易码  具体字典参考getTransName
	 */
	exports.getSmsContent = function(currentCode){
			var tranMsg = exports.getTransName(currentCode);
			var data = exports.getRequestData();
			var signView = "。";
			if(currentCode == '003030'){
				signView += tranMsg+"（"+jQuery.param.getDisplay('CHARGE_TYPE',data.chargeType)+"/"+data.chargeNo+"），缴费金额"+getShowAmt(data.amountRealCharged)+"元。";
			}if(currentCode == '003031'){
				signView += tranMsg+"（"+jQuery.param.getDisplay('CHARGE_TYPE',data.chargeType)+"/"+data.carNo+"），缴费金额"+getShowAmt(data.amountRealCharged)+"元。";
			}if(currentCode == '003032'){
				signView += tranMsg+"（"+jQuery.param.getDisplay('CHARGE_TYPE',data.chargeType)+"/"+data.userNo+"），缴费金额"+getShowAmt(data.amountRealCharged)+"元。";
			}else if(currentCode == '003008'){
				signView += tranMsg+"（"+jQuery.param.getDisplay('CHARGE_TYPE',data.chargeType)+"/"+data.chargeNo+"），缴费金额"+getShowAmt(data.amountRealCharged)+"元。";
			}else if(currentCode == '002007'){
				signView += tranMsg+"：收款人"+data.recAccountName+"（"+data.recAccount.substring(0,4)+"****"+data.recAccount.substring(data.recAccount.length-4,data.recAccount.length)+"），金额"+getShowAmt(data.payAmount)+"元。";
			}else if(currentCode == "027001"){
				signView += "您正在修改手机银行登录密码，";
			}else if(currentCode == "短信签约交易码"){
				var amount   = jQuery('#payAmount').val();
				var phoneNo=jQuery("#phoneNo").val()?"":("，绑定手机："+jQuery("#phoneNo").val());
				signView += tranMsg+"：账号"+data.accountNo+phoneNo+",最低提醒金额："+amount+"。";
			}else if ( currentCode == "短信解约交易码"){
				var phoneNo=jQuery("#phoneNo").val()?"":("，绑定手机："+jQuery("#phoneNo").val());
				signView += tranMsg+"：账号"+data.accountNo+phoneNo+"。";
			}else if(currentCode == "027005"){
				signView += "您在修改银行卡（尾号"+data.accountNo.substring(data.accountNo.length-4,data.accountNo.length)+"）的交易密码，";
			}else if(currentCode == "009011"){
				signView += "您在修改信用卡（尾号"+data.accountNo.substring(data.accountNo.length-4,data.accountNo.length)+"）的交易密码，";
			} else if(currentCode == "009010"){
				signView += "您在修改信用卡（尾号"+data.accountNo.substring(data.accountNo.length-4,data.accountNo.length)+"）的查询密码，";
			} else if(currentCode == "005011"){
				signView += "您的尾号为"+data.payAccount.substring(data.payAccount.length-4,data.payAccount.length)+"的还款账号正在进行贷款提前还款操作，提前还款金额为"+getShowAmt(data.payAmount)+"元。";
			}else if(currentCode == "贷款还款方式变更交易码"){
				signView += "您正在进行贷款还款方式变更操作。";
			}else if(currentCode == "009003"){
				signView +="您尾号为"+data.payAccount.substring(data.payAccount.length-4,data.payAccount.length)+"的账号正在进行理财产品交易，交易金额为"+getShowAmt(data.payAmount)+"元。"
			      //signView +="您正在进行理财购买操作。请保密并确认本人操作，";
			}else if(currentCode == "009004"){
				signView +="您尾号为"+data.payAccount.substring(data.payAccount.length-4,data.payAccount.length)+"的账号正在进行理财产品赎回交易，赎回份额为"+getShowAmt(data.redemVol)+"元。"
			      //signView +="您正在进行理财购买操作。请保密并确认本人操作，";
			}else if(currentCode == "理财产品赎回交易码"){
				signView +="您的尾号为"+data.payAccount.substring(data.payAccount.length-4,data.payAccount.length)+"账号正在进行理财产品赎回操作。"
			}else if(currentCode =="027002"){
				signView +="您正在进行交易限额修改，";
			}else if(currentCode =="002011"){
				signView +="您正在进行设备绑定，";
			}else if( currentCode=="002008" ){
				signView+=tranMsg+"交易：收款人"+data.recAccountName+"(尾号"+data.recAccount.substring(data.recAccount.length-4,data.recAccount.length)+"),金额"+data.payAmount+"元，";
			}else if( currentCode=="002009" ){
				signView+=tranMsg+"交易：收款人"+data.recAccountName+"(尾号"+data.recAccount.substring(data.recAccount.length-4,data.recAccount.length)+"),金额"+data.payAmount+"元，";
			}else if( currentCode=="002019" ){
				signView+=tranMsg+"交易：收款人"+data.recAccountName+"(尾号"+data.recAccount.substring(data.recAccount.length-4,data.recAccount.length)+"),金额"+data.payAmount+"元，";
			}else if( currentCode=="002020" ){
				signView+=tranMsg+"交易：收款人"+data.recAccountName+"(尾号"+data.recAccount.substring(data.recAccount.length-4,data.recAccount.length)+"),金额"+data.payAmount+"元，";
			}else if(currentCode == "010201"){
				signView +="您的尾号为"+data.f_deposit_acct.substring(data.f_deposit_acct.length-4,data.f_deposit_acct.length)+"的账号正在进行基金产品购买操作，交易金额为"+getShowAmt(data.buyAmount)+"元。"
			}else if(currentCode == "010301"){
				signView +="您的尾号为"+data.f_deposit_acct.substring(data.f_deposit_acct.length-4,data.f_deposit_acct.length)+"的账号正在进行宝类转入操作，交易金额为"+getShowAmt(data.buyAmount)+"元。"
			}else if( currentCode=="010401" ){
				signView +="您尾号为"+data.f_deposit_acct.substring(data.f_deposit_acct.length-4,data.f_deposit_acct.length)+"的账号正在进行基金产品定投开通操作，交易金额为"+getShowAmt(data.f_investamount)+"元。"
			}else if( currentCode=="010402" ){
				signView +="您尾号为"+data.f_deposit_acct.substring(data.f_deposit_acct.length-4,data.f_deposit_acct.length)+"的账号正在进行基金产品定投修改操作，交易金额为"+getShowAmt(data.f_investamount)+"元。"
			}else if( currentCode=="010302" ){
				signView +="您尾号为"+data.f_deposit_acct.substring(data.f_deposit_acct.length-4,data.f_deposit_acct.length)+"的账号正在进行宝类转出操作，转出金额为"+getShowAmt(data.f_applicationvol)+"元。"
			}else if( currentCode=="010202" ){
				signView +="您尾号为"+data.f_deposit_acct.substring(data.f_deposit_acct.length-4,data.f_deposit_acct.length)+"的账号正在进行基金产品赎回操作，赎回份额为"+getShowAmt(data.f_applicationvol)+"份。"
			}else if( currentCode=="010101" ){
				signView +="您尾号为"+data.deposit_acct.substring(data.deposit_acct.length-4,data.deposit_acct.length)+"的账号正在进行基金签约。"
			}else if( currentCode=="010104" ){
				signView +="您尾号为"+data.f_deposit_acct.substring(data.f_deposit_acct.length-4,data.f_deposit_acct.length)+"的账号正在进行基金签约信息变更。"
			}else if( currentCode=="010102" ){
				signView +="您尾号为"+data.deposit_acct.substring(data.deposit_acct.length-4,data.deposit_acct.length)+"的账号正在进行基金宝类签约。"
			}else if( currentCode=="011101" ){
				signView +="您尾号为"+data.accountNo.substring(data.accountNo.length-4,data.accountNo.length)+"的账号正在进行黄金定投开户。"
			}else if( currentCode=="011102" ){
				signView +="您尾号为"+data.accountNo.substring(data.accountNo.length-4,data.accountNo.length)+"的账号正在进行黄金定投销户。"
			}else if( currentCode=="011103" ){
				signView +="您尾号为"+data.accountNo.substring(data.accountNo.length-4,data.accountNo.length)+"的账号正在进行黄金定投签约账户变更。"
			}else if( currentCode=="011201" ){
				signView +="您尾号为"+data.accountNo.substring(data.accountNo.length-4,data.accountNo.length)+"的账号正在进行黄金随时买，购买金额为"+getShowAmt(data.payAmount)+"元。"
			}else if( currentCode=="011301" ){
				signView +="您尾号为"+data.accountNo.substring(data.accountNo.length-4,data.accountNo.length)+"的账号正在进行黄金定投计划买，定投金额为"+getShowAmt(data.payAmount)+"元。"
			}else if( currentCode=="011401" ){
				signView +="您尾号为"+data.accountNo.substring(data.accountNo.length-4,data.accountNo.length)+"的账号正在进行黄金卖金，卖金克重为"+getShowAmt(data.sellWeight)+"克。"
			}else if( currentCode=="011601" ){
				signView +="您尾号为"+data.accountNo.substring(data.accountNo.length-4,data.accountNo.length)+"的账号正在进行黄金提现，提现金额为"+getShowAmt(data.payAmount)+"元。"
			}
			console.log('debug短信内容：'+signView);
			return signView;
	}
	
	
	/**
	 * 获取请求数据
	 */
	exports.getRequestData = function(){
		return REQUEST_DATA;
	}
	
	exports.getCurrentCode = function(){
		return CURRENT_CODE;
	}
	
	/**
	 * 根据交易码获取对应的交易名称
	 * @param {Object} currentCode
	 */
	exports.getTransName = function(currentCode){
		return jQuery.param.getDisplay('TRANS_NAME',currentCode);
	}
	
	
	/**对bank.js中的apiSend方法重写
	 * 获取安全认证因素，送到后台进行安全校验
	 * @param {Object} params  请求到后台的数据
	 * @param {Object} successCallback	当前交易代码
	 */
	exports.apiSend = function(method, url, params, successCallback, errorCallback, wait){
		
			var safeType = localStorage.getItem('session_mastSafe');
			var key = "";
			params = params||{};
			currentCode = exports.getCurrentCode()||params['currentCode'];
			
			var securityElem = jQuery('div[data-security]');
			var isPwdCheck = (securityElem.attr('data-security')||'').split('|').join('|').indexOf('needPassword');
			//安全属性尚未配置密码模块，则不做密码处理
			if(isPwdCheck>=0){
				if(jQuery.param.SOFTPWD_SWITCH){
						if(passwordUtil){
							//检验密码规则
							if(!passwordUtil.checkMatch('accountPassword')){
								mui.alert('请输入合法账户密码');
								return false;
							}
							var accountPassword = jQuery('#_accountPassword').val();
							if(!accountPassword){
								mui.alert('账户密码不能为空');
								return false;
							}
							jQuery.extend(params, {'accountPassword':accountPassword});
						}
					}else{
						//获取密码控件隐藏的密文
						var accountPassword = jQuery('#accountPassword').val();
						if(!accountPassword){
								mui.alert('账户密码不能为空');
								return false;
							}
						jQuery.extend(params, {'accountPassword':accountPassword});
					}
				
			}
			
			var securityElem = jQuery('div[data-security]');
			var isNeedAuth = (securityElem.attr('data-security')||'').split('|').join('|').indexOf('needAuth');
			//短信验证
			if(safeType == '0'&&isNeedAuth>=0){
	    		var smsPassword = jQuery('#smsPassword').val();
	    		if (!smsPassword||smsPassword.length!=6) {
	    			mui.alert('请输入6位短信验证码');
					return false;
				}
	    		jQuery.extend(params, {'smsPassword':smsPassword});
	    		
	    	
	    	}else if (safeType == '1'&&isNeedAuth>=0){//处理TOKEN
	    		
	    		return false;
	    		
	    	}else if(safeType == '2'&&isNeedAuth>=0){//处理USBKEY
	    		key = passwordUtil.getRandomNumber();
	    		var safeTypeChecked = jQuery(':input[name="mb_trans_safe_type"]:checked').val();
	    		
	    		if(safeTypeChecked=='0'&&ACCESS_TO_UKEY){
	    			var smsPassword = jQuery('#smsPassword').val();
		    		if (!smsPassword||smsPassword.length!=6) {
		    			mui.alert('请输入6位短信验证码');
						return false;
					}
		    		jQuery.extend(params, {'smsPassword':smsPassword,'mb_trans_safe_type':'0'});
		    		
	    		}else if(safeTypeChecked=='2'&&ACCESS_TO_UKEY){
	    			if(jQuery.param.SIGNAUTH_SWITCH){
		    			var message = null;
		    			var pin = jQuery('#ukPassword').val();
		    			message = usbKeyUtil.getSignSourceValue(null, jQuery.param.getDisplay('AUTH_FORMAT',currentCode), params,key);
		    			if(!pin||pin.trim().length==0){
			    			mui.alert('请输入音频Ukey密码');//待处理
							return false;
			    		}
		    			jQuery("#confirmButton").attr("disabled",true);
		    			usbKeyUtil.signDataByUsbKey(message,pin,function(result){
							jQuery.extend(params, {'signData':result,'mb_trans_safe_type':'2'});
							mbank.apiSend(method, url, params, successCallback, errorCallback, wait);
						},function(e){
							jQuery("#confirmButton").attr("disabled",false);
							if(e.indexOf("密码") !=-1){
								mui.alert(e.replace(/密码/g,"Ukey密码"));
							}else{
								mui.alert(e);
							}
						});
						
						return false;
	    			}
	    			
	    		}else{
	    			var smsPassword = jQuery('#smsPassword').val();
		    		if (!smsPassword||smsPassword.length!=6) {
		    			mui.alert('请输入6位短信验证码');
						return false;
					}
		    		jQuery.extend(params, {'smsPassword':smsPassword,'mb_trans_safe_type':'0'});
	    		}
	    		
//				var message = null;
//				jQuery.Deferred(function(deffer){
//					if(key){
//						setTimeout(function(){
//							deffer.resolve({key:key});
//						},10)
//					}else{
//						mbank.getPasswordKey({},function(data){
//						deffer.resolve(data);
//					})
//					}
//				}).done(function(data){
//					message = usbKeyUtil.getSignSourceValue(null, jQuery.param.getDisplay('AUTH_FORMAT',currentCode), params,data['key']);
//					var ukeyId = 0;//证书编号
//		    		var pin = '111111a';//证书编号
//		    		if(!pin||pin.length==0){
//		    			mui.alert('请输入6位短信验证码');
//						return false;
//		    		}
//					usbKeyUtil.signDataByUsbKey(ukeyId,message,pin,function(result){
//						var signData = result||'';
//						jQuery.extend(params, {'signData':signData});
//						if(successCallback && typeof successCallback =='function'){
//						successCallback(params);
//					}
//					},null);
//				}).fail(function(xhr){
//					alert('获取密钥失败')
//				});
	    		
	    	} 
	    	mbank.apiSend(method, url, params, successCallback, errorCallback, wait);
	}
	
	exports.getRandomKey = function(){
		return passwordUtil.getRandomNumber();
	}
	exports.unBindSMSEvent = function(){
		var sendPassword = jQuery('#sendPassword');
		sendPassword[0].removeEventListener('tap',sendPasswordComm);
	}
	
	var sendPasswordComm = function(){
		console.log('发送短信...')
		var params = {};
		if(REQUEST_DATA && REQUEST_DATA['recAccount']){
			params['recAccount'] = REQUEST_DATA['recAccount'];
		}
		if(REQUEST_DATA && REQUEST_DATA['payAccount']){
			params['payAccount'] = REQUEST_DATA['payAccount'];
		}
		if(REQUEST_DATA && REQUEST_DATA['payAmount']){
			params['payAmount'] = REQUEST_DATA['payAmount'];
		}
		
		params['id'] = 'sendPassword';
		params['smsContent'] = exports.getSmsContent(CURRENT_CODE);
		mbank.getSmsCode(params);
	}
})