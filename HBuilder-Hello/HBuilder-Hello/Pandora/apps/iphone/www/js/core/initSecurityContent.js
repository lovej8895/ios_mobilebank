(function($,undefined){
		
		//获取当前文件路径，判断当前交易类型
		var currentUrl = window.location.href;
		//需要使用音频key进行安全验证的交易
		var ACCESS_TO_UKEY = jQuery.param.checkUsbKeyRole(currentUrl);
		
		var userSafeType = localStorage.getItem('session_mastSafe');
		if(!userSafeType){
			alert('安全认证交易需登录')
			return false;
		}
		
		var securityElem = jQuery('div[data-security]');
		var securityArray = (securityElem.attr('data-security')||'').split('|');
		if(!securityArray||securityArray.length==0){
			alert('安全认证属性配置有误');
			return false;
		}else{
			for (var s = 0;s<securityArray.length;s++) {
				var v = securityArray[s];
				if(v=='needPassword'){
					securityElem.find('ul').append(createPwdDom());
				}
				if(v=='needAuth'){
					securityElem.find('ul').append(createSecurityDom(userSafeType));
				}
			}
		}
		
		/**
		 * 创建密码输入域
		 */
		function createPwdDom(){
			var pwdElem = jQuery('<li><span class="input_lbg">取款密码</span>'+
								'<input class="input_m14px" type="password"'+  
								'placeholder="请输入卡取款密码" id="accountPassword"/>'+
								'<input type="hidden" id="_accountPassword"></li>');
			return pwdElem;
		}
		
		
		/**
		 *  创建安全认证输入域
		 * @param {Object} safeType
		 */
		function createSecurityDom(safeType){
			var smsElem = jQuery('<li id="smsType"><span class="input_lbg">短信验证码</span>'+
								'<input class="input_m14px" type="number" name="smsPassword" placeholder="请输入验证码" id="smsPassword"/>'+
								'<button class="but_rh28px" id="sendPassword">获取验证码</button></li>');
								
			if(safeType=='0'){//短信验证码
				return smsElem;
			}
			
			if(safeType=='2'){//音频UK
				if(ACCESS_TO_UKEY){
					var safeElem = jQuery('<li style="overflow: hidden;"><div><span class="input_lbg left_fl">安全类型</span>'+
										'<div class="radio_box" id="mb_trans_safe_type"><div class="mui-input-row mui-radio mui-left radio_f_left">'+
										'<label>短信验证码</label><input name="mb_trans_safe_type" value="0" type="radio" checked></div>'+
							            '<div class="mui-input-row mui-radio mui-left radio_f_left"><label>音频Ukey</label>'+
								        '<input name="mb_trans_safe_type" value="2" type="radio"></div></div></div></li>');
					var ukElem = jQuery('<li id="ukType" style="display:none;"><span class="input_lbg">Ukey密码</span>'+
										'<input class="input_m14px" type="password" name="ukPassword" placeholder="请输入音频UKey的密码" id="ukPassword"/>'+
										'<input type="hidden" id="_ukPassword" name="signData"/></li>');
					return safeElem.add(smsElem).add(ukElem);		   
				}else{
					return smsElem;
				}
			}
		}
		
	
})(jQuery)
