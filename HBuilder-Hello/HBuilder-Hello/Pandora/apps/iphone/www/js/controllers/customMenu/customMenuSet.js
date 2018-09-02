define(function(require, exports, module){
	var $ = mui;
	var jq = jQuery;
	var doc = document;
	var mbank 	 = require('../../core/bank');
	var menu 	 = require('../../core/bankMenu');
	var nativeUI = require('../../core/nativeUI');
	var userInfo = require('../../core/userInfo');
	
	var minMenuNum = 3;
	var maxMenuNum = 15;
	
	var customMenuArea = document.getElementById('customMenuArea');
	var allMenuArea = document.getElementById('allMenuArea');
	var user_tap_area= document.getElementById('tap-menu-operation');
	mui.init({
	  gestureConfig:{
	   tap: true, //默认为true
	   doubletap: true, //默认为false
	   longtap: true, //默认为false
	   swipe: true, //默认为true
	   drag: true //默认为true
	  },
	  keyEventBind: {
			backbutton: false,
			menubutton: false
	 }
	})
	$.plusReady(function(){
		//功能指引
		var settingGuide = userInfo.getItem("settingGuide");
		if (!settingGuide) {
			userInfo.setItem("settingGuide", "true");
			var guide = plus.webview.create("../guide/guide_setting.html","guide_setting",{background:"transparent",zindex:998,popGesture:'none'});
			plus.webview.show(guide);
		}
		
		//初始化客户已经设置的菜单
		menu.createMenuList('#customMenuArea');
		//初始化系统所有菜单，过滤已设置菜单
		menu.createAllMenuList('#allMenuArea',addAllMenuLink);
		//console.log(allMenuArea.innerHTML);
		
		//客户设置的菜单添加链接
		var customSetA = customMenuArea.getElementsByTagName('a');
		addCustomLink();
		function addCustomLink(){
			customSetA = customMenuArea.getElementsByTagName('a');
			for(var i=0;i<customSetA.length;i++){
				customSetA[i].addEventListener('tap',function(){
					var divElm = jQuery("#tap-menu-operation div");
					var isEdit = divElm.hasClass('menu-active');
					var path=this.getAttribute('path');
					var id=this.getAttribute('id');
					var nocheck=this.getAttribute('noCheck');
					var params={
						nocheck:nocheck
					}
					if(isEdit){
						mbank.openWindowByLoad(path,id,'slide-in-right',params);
					}
				})
			}
		}
		
		//所有的菜单添加链接
		function addAllMenuLink()
		{
			var allMenuA = allMenuArea.getElementsByTagName('a');
			for(var i=0;i<allMenuA.length;i++){
				allMenuA[i].addEventListener('tap',function(){
					var divElm = jQuery("#tap-menu-operation div");
					var isEdit = divElm.hasClass('menu-active');
					if(isEdit){
						var path=this.getAttribute('path');
						var id=this.getAttribute('id');
						var nocheck=this.getAttribute('noCheck');
						var params={
							nocheck:nocheck
						}
						mbank.openWindowByLoad(path,id,'slide-in-right',params);
					}
				})	
			}
		}	
		
		//统一绑定tab事件
//		mbank.bindTagToMenuPath('.content_BOXall');

		//开启长按事件
		bindLongTap();
		
		//点击切换"编辑+完成"区域
		user_tap_area.addEventListener('tap',function(){
			//menu-active
			var divElm = jQuery(this).find('div');
			var spanElm = divElm.find('span');
			var isEdit = divElm.hasClass('menu-active');
			divElm.toggleClass('menu-active');
			
			
			//删除菜单遍历显示区域
			var lis = customMenuArea.getElementsByTagName('li');
			for (var i=0;i<lis.length;i++) {
				if(isEdit){
					lis[i].getElementsByTagName('span')[0].className='delete_ico menu-active';
				}else{
					lis[i].getElementsByTagName('span')[0].className='delete_ico';
				}
			}
			
			//增加菜单遍历显示区域
			
		    var allLis = allMenuArea.getElementsByTagName('li');
			for (var k=0;k<allLis.length;k++) {
				if(isEdit){
					var setFlag = false;
					for(var j=0;j<lis.length;j++){
						if(allLis[k].getElementsByTagName('a')[0].getAttribute('id')==lis[j].getElementsByTagName('a')[0].getAttribute('id'))
					    {
					    	allLis[k].getElementsByTagName('span')[0].className='yes_ico menu-active';
					    	setFlag = true;
					    	break;
					    }
					}
					if(!setFlag){
						allLis[k].getElementsByTagName('span')[0].className='add_ico menu-active';
					}
				}else{
					allLis[k].getElementsByTagName('span')[0].className='add_ico';
				}
			}
			
			if(isEdit){
				spanElm.text('完成');
				unbindLongTap()
				startDragMenu();
//				bindAddTapFunc();
			}else{
				spanElm.text('编辑');
				bindLongTap();
				stopDragMenu();
//				unbindAddTapFunc();
				menu.saveMenuList('bankMenu','#customMenuArea');
				mui.fire(plus.webview.getWebviewById('main_sub'),'reloadMenu',{})
			}
			
		},false);
		
		function longTapCallback(e){
			var divElm = jQuery(user_tap_area).find('div');
			var spanElm = divElm.find('span');
			if(divElm.hasClass('menu-active')){
				spanElm.text('完成');
			}else{
				spanElm.text('编辑');
			}
			divElm.toggleClass('menu-active');
			var lis = customMenuArea.getElementsByTagName('li');
			for (var i=0;i<lis.length;i++) {
				lis[i].getElementsByTagName('span')[0].className='delete_ico menu-active';
			}
			var allLis = allMenuArea.getElementsByTagName('li');
			for (var k=0;k<allLis.length;k++) {
				allLis[k].getElementsByTagName('span')[0].className='add_ico menu-active';
			}
			startDragMenu();
		}
		
		
		//绑定长按事件
		function bindLongTap(elem){
			var menuElems = [];
			if(elem){
				menuElems.push(elem);
			}else{
				menuElems = customMenuArea.getElementsByTagName('a');
			}
			for (var a=0;a<menuElems.length;a++) {
				menuElems[a].addEventListener('longtap',longTapCallback,false);
			}
		}
		
		//取消长按事件
		function unbindLongTap(elem){
			var menuElems = [];
			if(elem){
				menuElems.push(elem);
			}else{
				menuElems = customMenuArea.getElementsByTagName('a');
			}
			for (var a=0;a<menuElems.length;a++) {
				menuElems[a].removeEventListener('longtap',longTapCallback,false)
			}
		
		}
		
//		function addTapCallback(e){
			//取消一些事件,只考虑tap事件
//			if(e.type.toUpperCase()=='TAP'){
//				if(e.target.nodeName.toUpperCase()=='A'){
//					alert(jQuery(this).parent()[0].nodeName)
//					jQuery(customMenuArea).children('ul').append(jQuery(this).parent());
//				}
//				if(e.target.nodeName.toUpperCase()=='SPAN'){
//					alert(jQuery(this).parent()[0].nodeName)
//					jQuery(customMenuArea).children('ul').append(jQuery(this).parent());
//				}
//			}
//		}
		
//		function bindAddTapFunc(elem){
//			var menus = [];
//			if(elem){
//				menus.push(elem);
//			}else{
//				menus = allMenuArea.getElementsByTagName('a');
//			}
//			for (var m=0;m<menus.length;m++) {
//				menus[m].addEventListener('tap',addTapCallback,false);
//				menus[m].nextSibling.addEventListener('tap',addTapCallback,false);
//			}
//		}
		
//		function unbindAddTapFunc(elem){
//			var menus = [];
//			if(elem){
//				menus.push(elem);
//			}else{
//				menus = allMenuArea.getElementsByTagName('a');
//			}
//			for (var m=0;m<menus.length;m++) {
//				menus[m].removeEventListener('tap',addTapCallback,false);
//				menus[m].nextSibling.removeEventListener('tap',addTapCallback,false);
//			}
//		}
		
		
	function startDragMenu(){
		jQuery("#customMenuArea ul").dragsort('destroy');
		jQuery("#customMenuArea ul").dragsort({ 
			dragSelector: "a",
			dragBetween: true, 
			bindEvent: tapDropItem, 
			muiObj: $, 
			placeHolderTemplate: '<li class="placeHolder"><a ><p class="color_6 fz_12"></p></a></li>'
			
		});
			
		//下面菜单绑定tap 动态增加到上面区域
		jQuery(allMenuArea).on('tap','a',function(){
			var custMenu = jQuery("#customMenuArea ul");
			var nowNum = custMenu.children('li').length;
			if(nowNum>=maxMenuNum){
				plus.nativeUI.toast('最多可新增'+maxMenuNum+'个菜单');
				return;
			}
			if(jQuery(this).parent().find('span').attr("class") !='yes_ico menu-active'){
				var li = jQuery(this).parent().find('span').removeClass('add_ico menu-active').addClass('delete_ico menu-active').end();
				var liClone = jQuery(li).clone('true');
				jQuery(this).parent().find('span').removeClass('delete_ico menu-active').addClass('yes_ico menu-active');
				custMenu.append(liClone);
				addCustomLink();
			}else{
				return;
			}
		})
		jQuery(allMenuArea).on('tap','span',function(){
			var custMenu = jQuery("#customMenuArea ul");
			
			var nowNum = custMenu.children('li').length;
			if(nowNum>=maxMenuNum){
				plus.nativeUI.toast('最多可新增'+maxMenuNum+'个菜单');
				return;
			}
			if(jQuery(this).attr("class") !='yes_ico menu-active'){
				var li = jQuery(this).removeClass('add_ico menu-active').addClass('delete_ico menu-active').parent();
				var liClone = jQuery(li).clone();
				jQuery(this).removeClass('delete_ico menu-active').addClass('yes_ico menu-active');
				custMenu.append(liClone);
				addCustomLink();
			}else{
				return;
			}
		})
		
	}
	
	function tapDropItem(item){

		//判断最少保留三个菜单
		if(item){
			var nowNum = item.siblings('li').length;
			if(nowNum<minMenuNum){
				plus.nativeUI.toast('请至少保留'+minMenuNum+'个菜单');
				return;
			}
		}
		
		var allMenu = jQuery(allMenuArea);
		var uls = allMenu.find('ul');
		var aElm = item.find('a');
		var menuType = aElm.attr('menucode')&&aElm.attr('menucode').substring(0,3);
		var menuCode = aElm.attr('menucode');
		jQuery.each(uls,function(i,obj){
			var mt = obj.getAttribute('menuType')||obj['menuType'];
			if(mt==menuType){
				var allMenA = jQuery(this).find('a');
				for(var j =0;j<allMenA.length;j++){
					if(allMenA[j].getAttribute('menucode')==menuCode){
						jQuery(allMenA[j]).parent().find('span').removeClass('yes_ico menu-active').addClass('add_ico menu-active');
						jQuery(item).parent().find(item).remove();
					}
				}
//				item.find('span').removeClass('delete_ico').addClass('add_ico menu-active');
//				jQuery(obj).append(item);
				return false;
			}
		});
	}
	
	function stopDragMenu(){
		jQuery("#customMenuArea ul").dragsort('destroy');
		//下面菜单绑定tap 动态增加到上面区域
		jQuery(allMenuArea).off('tap');
	}
		
		
		
		
	plus.key.addEventListener('backbutton',function(){
		mui.back();
	})
	})
	
})
