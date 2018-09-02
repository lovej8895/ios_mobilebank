define(function(require, exports, module){
	var $ = mui;
	var doc = document;
	var mbank = require('./bank');
	var menuNum = 0;
	
	
	/**
	 * 创建银行所有菜单
	 * @param {Object} context
	 */
	exports.createAllMenuList = function(context,call){
		//获取本地用户设置菜单
		//var bankMenuList =exports.getLocalStorgeMenuData('bankMenu'); //客户已设置的菜单
		var bankMenuList=null;
		mbank.readLocalJsonFile('_www/js/controllers/customMenu/bankMenu.json',callback);
		function callback(data){
			var menuArray = data['bankMenu']||[];//菜单数组
			var menuHtml = exports.createMenuHtml(menuArray,true,bankMenuList); 
			jQuery(context).html(menuHtml);
			call();
			
		}
	}
	
	/**
	 * 创建客户设置的快捷菜单
	 * @param {Object} context
	 */
	exports.createMenuList = function(context){
		var bankMenuList = exports.getLocalStorgeMenuData("bankMenu");
		var menuArray = bankMenuList||[];
		var menuHtml = exports.createMenuHtml(menuArray,false);
		jQuery(context).html(menuHtml);
	}
	
	/**
	 * 
	 * @param {Object} list
	 * @param {Boolean} needTitle
	 */
	exports.createMenuHtml = function(list,needTitle,filterList){
		var randNum = new Date().getTime();
		var templateDiv = jQuery('<div id="drag-template-'+randNum+'"></div>');
		//待处理 data-listidx
		
		for (var i=0; i<list.length;i++) {
			var menuDiv = jQuery('<div class="cust_iconbox div_b_m"></div>');
			var divElem = jQuery('<div class="cust_titbox" ><p class="cust_titico"></p><p class="cust_tit"></p></div>');
			//获取标题
			if(needTitle){
				var title = list[i]['title'];
				divElem.find('p:last').text(title);
				menuDiv.append(divElem);
			}
			
			//获取菜单数组 
			var menuList = list[i]['menuList'];
			var ulElem = jQuery('<ul class="custommenuset_ul cust_w25" data-listidx="'+(menuNum++)+'"></ul>');
			for (var k=0;menuList&&k<menuList.length;k++){
				var menuCode  = menuList[k]['menucode']||'';
				ulElem.attr('menuType',menuCode.substring(0,3));
				//过滤客户已设置菜单
				if(filterList&&filterList[0]&&arrayIsContainsObj(filterList[0]['menuList'],menuList[k])){
					continue;
				}
				
				var liElem = jQuery('<li><a class=""><p class="color_6 fz_12"></p></a></li>');
				var optTag = null;
				if(needTitle){
					optTag= jQuery('<span class="add_ico"></span>');
				}else{
					optTag= jQuery('<span class="delete_ico"></span>');
				}
//				var menuCode  = menuList[k]['menucode']||'';
				var menuSerNo = menuList[k]['menuserno']||'';
				var menuName  = menuList[k]['menuname']||'';
				var menuclass   = menuList[k]['menuclass']||'';
				var path      = menuList[k]['path']||'';
				var noCheck   = menuList[k]['nocheck']||'';
				var id 		  = menuList[k]['id']||'';
				var aElemAttr = {
								id:id,
								menucode:menuCode,
								sortno:menuSerNo,
								path:path,
								nocheck:noCheck
								};
				liElem.find('a').addClass(menuclass).attr(aElemAttr).find('p').text(menuName);
				liElem.append(optTag);
				ulElem.append(liElem);
			
			}
			menuDiv.append(ulElem);
			templateDiv.append(menuDiv);			
			
		}
		//console.log('请求参数:' + templateDiv.html());
		return templateDiv.html();
		
	}
	
	
	/**
	 * 保存用户自定义设置的菜单列表到本地缓存
	 * @param {Object} list
	 */
	exports.saveMenuList = function(key,context){
		console.log('save menu...')
		if(!key||!context){
			return;
		}
		if(localStorage.getItem(key)){
			localStorage.removeItem(key);
		}
		
		var bankMenu = [];
		var menuList = [];
		if(typeof context =='string'){
			var aList = jQuery(context).find('ul>li>a');
			jQuery.each(aList,function(i,obj){
				var menuObj = {};
				var thisObj = jQuery(obj);
				menuObj['menucode']  = obj.getAttribute('menucode')||obj['menucode'];
				menuObj['menuserno']  = obj.getAttribute('sortno')||obj['sortno'];
				menuObj['menuname']  = thisObj.find('p').text()||'';
				menuObj['menuclass'] = obj.getAttribute('class')||thisObj['class'];
				menuObj['path']  	= obj.getAttribute('path')||obj['path'];
				menuObj['nocheck']  = obj.getAttribute('nocheck')||obj['nocheck'];
				menuObj['id']   	= obj.getAttribute('id')||obj['id'];
				menuList.push(menuObj);
			});
		}else if(context.constructor==Array){
			menuList = context[0]&&context[0]['menuList']||[];
		}
		bankMenu.push({"menuList":menuList});
		localStorage.setItem(key,JSON.stringify({'bankMenu':bankMenu}));
	}
	
	/**
	 * 根据key获取localStorage保存的菜单原始格式数据
	 * @param {Object} key
	 */
	exports.getLocalStorgeMenuData = function(key){
		var bankMenuList = localStorage.getItem(key);
		if(!bankMenuList){
			localStorage.setItem(key,JSON.stringify({'bankMenu':exports.getDefaultData()}));
			bankMenuList = localStorage.getItem(key);
		}
		return (JSON.parse(bankMenuList))['bankMenu'];
	}
	
	/**
	 * 
	 * @param {Object} key
	 */
	exports.getMenuArrays = function(key){
		var bankMenuList = localStorage.getItem(key);
		if(!bankMenuList){
			return [];
		}
		
		if(bankMenuList[0]&&bankMenuList[0]['menuList']){
			return bankMenuList[0]['menuList'];
		}
	}
	
	/**
	 * 所有第一次登陆用户默认菜单
	 */
	exports.getDefaultData = function(){
		var list = [{
			"menuList":[
						{
						"menucode": "007001",
						"menuserno": "001",
						"menuname": "我的账户",
						"menuclass": "customer_myOwn",
						"path": "../myOwn/clientHome.html",
						"nocheck": "false",
						"id":"clientHome"
					}, {
						"menucode": "001002",
						"menuserno": "002",
						"menuname": "跨行转账",
						"menuclass": "customer_transfer_inter",
						"path": "../transfer/interTranInput.html",
						"nocheck": "false",
						"id":"interTranInput"
					},{
						"menucode": "005004",
						"menuserno": "004",
						"menuname": "信用卡还款",
						"menuclass": "customer_card_inter",
						"path": "../creditCard/thisInitiativeRefundMenuInfo.html",
						"nocheck": "ture",
						"id":"thisInitiativeRefundMenuInfo"
					}]
		}];
		return list;
	}
	
	exports.removeMenu = function(srcObj,destStr){
		//判断类别
		var menucode = srcObj.find('a').attr('menucode');
		menucode = menucode.substring(0,3);
		var liObj = srcObj;
		var uls = jQuery(destStr).find('ul');
		jQuery.each(uls,function(i,obj){
			var menuType = jQuery(obj).attr('menuType');
			if(menucode==menuType){
				jQuery(obj).append(liObj);
				return;
			}
		});
	}
	
	exports.addMenu = function(srcObj,destStr){
		var liObj = srcObj;
		jQuery(destStr).find('ul').append(liObj);
	}
	
});

