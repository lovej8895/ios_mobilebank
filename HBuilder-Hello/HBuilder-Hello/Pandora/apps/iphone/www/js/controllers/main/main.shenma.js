define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	document.getElementById("ad_ifrm").src=mbank.getApiURL()+"APP/views/main/main.html?x="+(new Date()-0); 
	$.init({
		keyEventBind: {
			backbutton: false,
			menubutton: false
		}
	});

	$.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var state = app.getState();
		var scann = document.getElementById("scann");
		var message = document.getElementById("message");
		var announcement = document.getElementById("announcement");//公告
		var question = doc.getElementById('question');
		var riskValue = doc.getElementById('risk')
		var nowDate=0;
		setTimeout(function() {
			//关闭 splash
			plus.navigator.closeSplashscreen();
		}, 600);
		queryBankInfo();

		/*var slider1 = mui("#slider1");	
		slider1.slider({
			interval: 5000
		});*/
		mui(".main_menu_ul").on('tap','a',function(){
		  //获取id
		  var id = this.getAttribute("id");
		  var path=this.getAttribute("path");
		  var title=this.getAttribute("title");
		  var nocheck=this.getAttribute("nosessioncheck");
		  if("true"==nocheck||mbank.checkLogon()){
		  	if(id=="transfer"){
		  		mbank.openWindowByLoad(path,id, "slide-in-right",{titleName:"转账"});
		  	}else{
		  		mbank.openWindowByLoad(path,id, "slide-in-right",{titleName:title});
		  	}
		  }
		   return;
		}) ;
		
		document.getElementById("deposit").addEventListener("tap",function(){
			mbank.openWindowByLoad("../currentAndRegula/currentToRegular.html","currentToRegular","slide-in-right");
		},false);
		scann.addEventListener('click',function(){
			if(mbank.checkLogon()){
		  	 mbank.openWindowByLoad("../plus/barcode_scan.html","barcode_scan", "slide-in-right");
		  }
		},false);
		//监听iframe事件
		window.addEventListener('message',function(e){
			console.log(JSON.stringify(e.data))
		   if("true"==e.data.noCheck||mbank.checkLogon()){
		   	 mbank.openWindowByLoad(e.data.path,e.data.pid,"slide-in-right");
		   }
          
        },false);

			
		function queryBankInfo(){
       	    var url = mbank.getApiURL() + 'queryNoticeInfo.do';

			mbank.apiSend('post', url, {}, queryLogBack, null, false);

			function queryLogBack(d) {
				var tempMesHtml = "";
				var notice=d.iBankNotice;
				var messageFlag = plus.storage.getItem("messageTimeFlag");
				var mTime = plus.storage.getItem("messageTime");
				
				var i;
				for(i=0;i<notice.length;i++){
					if(nowDate<notice[i].messageTime){
						nowDate = notice[i].messageTime;
					}
				}
				if((mTime!=nowDate)&&(messageFlag !=="true")){
					message.innerHTML = notice[0].messageContent;
					show();
				}
			}
       }
		
		//展示公告
		function show(){
			setTimeout(function(){
					jQuery(".pop_bg").css({"height":jQuery(window).height()});
					jQuery(".pop_cont").css({"top":(jQuery(window).height() - jQuery(".pop_cont").height())/2,"left":(jQuery(window).width() - jQuery(".pop_cont").width())/2});
				    jQuery(".pop_bg").fadeIn();
				    jQuery(".pop_cont").fadeIn()
				    jQuery(".pop_cont .close").click(function(){
				    	jQuery(".pop_bg").fadeOut();
				    	jQuery(".pop_cont").fadeOut()
				    });   
				},500)
			plus.storage.setItem("messageTime",nowDate);
			plus.storage.setItem("messageTimeFlag",'true');
		}
		//禁止页面滑动
		var jinzhi=0;
			document.addEventListener("touchmove",function(e){
			if(jinzhi==1){
					e.preventDefault();
					e.stopPropagation();
					}
			},false);
	});
});