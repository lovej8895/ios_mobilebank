/*
 * 实现我的 页面到子页面跳转
 */
define(function(require, exports, module) {
	var doc = document;
	var m= mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');

	var ws = null;
	var wc = null;
	
	m.init();
	m.plusReady(function() {
	    var logoff=document.getElementById("logoff");
		showIcon();
		function showIcon(){
	        var path=localStorage.getItem("userIcon")
	        if( path!=undefined && path!=null && path.length>0 ){
	        	$("#userIcon").attr("src",path);
	        }       	
        }
        window.addEventListener("reloadIcon",function(event){
            reloadIcon();
        });    
        
        var userGide = userInfo.getItem("userGide");
		if (!userGide) {
			userInfo.setItem("userGide", "true");
			var guide = plus.webview.create("../guide/guide_user.html","guide_user",{background:"transparent",zindex:990,popGesture:'none'});
			plus.webview.show(guide);
		}
        
        $("#userIcon").on("tap",function(){
        	if(!localStorage.getItem("session_customerId")){
        		mbank.checkLogon();
        		return false;
        	}
        	plus.nativeUI.actionSheet({cancel:"取消",buttons:[{title:"拍照"},{title:"从相册中选择"}]},
        	    function(e){
        	    	switch(e.index){
        	    		case 1:getImgFromCamera();break;
        	    		case 2:getImgFromGallery();break;
        	    	}
        	    });
        });
        
        
        //拍照
        function getImgFromCamera(){
        	var camera=plus.camera.getCamera();
        	camera.captureImage(function(path){
                resolveLocalFile(path);
        	});
        }
        //相册
        function getImgFromGallery(){
            plus.gallery.pick(function(path){
            	resolveLocalFile(path);
            });
        }
        //解析本地文件
        function resolveLocalFile(path){
     		plus.io.resolveLocalFileSystemURL(path,function(entry){       
                entry.file(function(file){
               	    if( file.size>10*1024*1024 ){
               	    	mui.alert("图片太大，请重新选择！");
               	    	return false;
               	    }else{
               	    	setImg(entry.toLocalURL());
               	    }
               	
                });

    		},function(e){
    			mui.alert("读取照片错误："+e.message);
    		});       	
        }  
        
		function setImg(src) {
			convertImgToBase64(src, function(base64Img) {
				var upImg = base64Img.split(",")[1];
				var reqData = {
					'customerIcon': upImg
				};
	            uploadIcon(reqData);
			});
		} 
		
   
		var img;
		function convertImgToBase64(url, callback, outputFormat) {
			var canvas = document.createElement('CANVAS'),
			ctx = canvas.getContext('2d'),
			img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = function() {
				var width = img.width;
				var height = img.height;
				var scale=width/height;
				width=Math.min(800,width);
				height=width/scale;
				canvas.height = height;
				canvas.width = width;
                EXIF.getData(img,function(){
                	var orientation=EXIF.getTag(this,'Orientation');
                	if( orientation!="" && orientation!=1 ){
                		if( orientation==3 ){//旋转180度
							var d=Math.PI;
							ctx.rotate(d);                	
							ctx.drawImage(img, -width, -height,width,height);                        	
                       }else if( orientation==6 ){//顺时针旋转90度
							var d=Math.PI/2;
							canvas.width=height;
							canvas.height=width;
							ctx.rotate(d);                	
							ctx.drawImage(img, 0, -height,width,height);                        	
                        }else if( orientation==8 ){//逆时针旋转90度
							canvas.width=height;
							canvas.height=width;
							var d=3*Math.PI/2;
							ctx.rotate(d);                	
							ctx.drawImage(img, -width, 0,width,height);  
                        }else{//其他方向角暂不处理
                        	ctx.drawImage(img, 0, 0,width,height);
                        }
                        
                	}else{
                		ctx.drawImage(img, 0, 0,width,height);            
                	}
                	var dataURL = canvas.toDataURL('image/jpeg', 0.3);
					callback.call(this, dataURL);
					canvas = null; 
               	    
                });

			};
		   
		   img.src = url;
							
		}
	
	
	
		//上传文件到服务器
		function uploadIcon(reqData){
			var url = mbank.getApiURL()+'uploadMbUserIcon.do';
	    	mbank.apiSend("post",url,reqData,function(data){
             	if( data.ec=="0" || data.ec=="000"  ){
                    //上传成功
                    mui.toast("上传图像成功");
                    var userIcon='data:image/jpeg;base64,'+reqData.customerIcon;
                    localStorage.setItem("userIcon",userIcon);
                    $("#userIcon").attr("src",userIcon);
             	}else{
             		mui.alert("上传图像失败["+data.em+"]"); 
             	}		    		
	    	},function(data){
	    		mui.alert("上传图像失败！");
	    	},true);	
		}
		
		//下载图像图片
		function downloadIcon() {
			var url = mbank.getApiURL()+'downloadMbUserIcon.do';
	    	mbank.apiSend("post",url,{},function(data){
	    		if( null!=data.customerIcon && data.customerIcon.length>0 ){
			    	var srcshow = 'data:image/jpeg;base64,' + data.customerIcon;
			    	$("#userIcon").attr("src",srcshow);
			    	localStorage.setItem("userIcon",srcshow);	    			
	    		}else{
	    			$("#userIcon").attr("src","../../img/u_head.png");
	    			localStorage.setItem("userIcon","");
	    		}
	    	},function(data){
	    		mui.alert("下载图像失败！");
	    	},true);	
        }
		
		//查询是否有新增票券 有则显示new图标
		allBondsQuery = function(){
			var currentDate = new Date();
			var year = currentDate.getFullYear();
			var month = currentDate.getMonth() + 1 < 10 ? "0" + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1;
			var day = currentDate.getDate() < 10 ? "0" + currentDate.getDate(): currentDate.getDate();
			var dateStr = year.toString()  + month.toString()  + day.toString();
			var customerId = localStorage.getItem("session_mobileNo");//绑定网银客户号改为手机号--modify by 2017-05-15
			var dataNumber = {
				turnPageBeginPos : '1',
				turnPageShowNum : '99999',
				ibiEffectiveDateBegin: dateStr,
				ibiEffectiveDateEnd: dateStr,//有效截止日期为空则显示当前客户所有票券
				ibiCustNo: customerId
			};
			var url = mbank.getApiURL() + 'allBondsQuery.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,false);
			function successCallback(data){
				var allBondsList = data.bondsList;
				if (allBondsList.length == 0) {
					$("#newIco").hide();//隐藏票券New图标
				}else{
					//显示状态 0为不显示在手机端列表上  1为新增(注：新增票券时默认赋值为1)，显示New图标； 2为不显示图标
					for(var i = 0; i < allBondsList.length; i++){
						var status = allBondsList[i].status;
						if(status == 1){
							$("#newIco").show();//客户有票券新增--显示票券New图标
//							console.log("跳出循环")
							break;
						}
					}
				}
			}
			function errorCallback(e){
				$("#newIco").hide();//隐藏票券New图标
		   }
		}
		
		showLogonStatus();
		logoff.addEventListener('tap',function(){
			var url = mbank.getApiURL() + 'userSignOff.do';
			mbank.apiSend('post', url, null ,quitSuccess, quitError, false);
			function quitSuccess(){
				//plus.runtime.quit();
				userInfo.removeItem("session_customerId");
				userInfo.removeItem("iAccountInfo");
				
			    mbank.clearDestinationPage();
				var main_sub = plus.webview.getWebviewById("main_sub");
				mui.fire(main_sub,'logOut',{});
				logoff.style.display="none";
				//plus.webview.getLaunchWebview().setStyle({mask:"none"});
				plus.nativeUI.toast("您已成功退出");
				//var myOwn = plus.webview.getWebviewById("myOwn");
				//mui.fire(myOwn,"reload");
				showLogonStatus();
				mbank.backToIndex(true);
				//self.close();
			}
			
			function quitError(){
				
			}
		});
		
		function showLogonStatus(){
			var isAalive = localStorage.getItem("session_customerId");
			if(isAalive){
				var userName = localStorage.getItem("session_customerNameCN")||'';
				var lastLoginTime = localStorage.getItem("customerLastLogon")||'';
	//			var preMessage = localStorage.getItem("customerMessage");
				var showTime = '';
				if(lastLoginTime){
					showTime = lastLoginTime.substring(0,4)+"-"+lastLoginTime.substring(4,6)+"-"+lastLoginTime.substring(6,8)
					               +"  "+lastLoginTime.substring(8,10)+":"+lastLoginTime.substring(10,12);
				}
				doc.getElementById("userName").setAttribute('class','fz_17');
				doc.getElementById("userName").innerText = userName;
				doc.getElementById("lastLoginTime").innerText = "上次登录   "+showTime;
				
	            downloadIcon();
	            allBondsQuery();//查询是否有新增票券 有则显示new图标
	            
	            logoff.style.display="block";
			}else{
				doc.getElementById("userName").setAttribute('class','fz_15');
				doc.getElementById("userName").innerText = "欢迎使用，点击登录";
				logoff.style.display="none";
				doc.getElementById("userName").addEventListener('tap',function(){
					mbank.checkLogon();
				});
				doc.getElementById("lastLoginTime").innerText = '';
				$("#newIco").hide();//隐藏票券New图标
			}
		}
		
		
		
		//我的理财
		doc.getElementById("myProductQuery").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});
		
		//我的账户
		doc.getElementById("clientHome").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			//mui.alert(noCheck);
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});
		
		//信用卡
		doc.getElementById("creditCarHome").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			//mui.alert(noCheck);
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});
		
		
		
		//快捷菜单
		doc.getElementById("definedMenu").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});
		
		deleteNewIco = function(customerId){
		    var dataNumber = {
				ibiCustNo: customerId,
				status: '2',  //更新客户所有票券展示状态‘IBI_STATUS’改为‘2’ 不展示NEW图标
				liana_notCheckUrl:false
			};
			var url = mbank.getApiURL() + 'changeNewIconStatus.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				
			}
			function errorCallback(e){
				mui.alert(e.em);
			}
		}
		
		//我的票券
		doc.getElementById("myBonds").addEventListener('tap',function(){
			var customerId = localStorage.getItem("session_mobileNo");//绑定网银客户号改为手机号--modify by 2017-05-15
			//登录状态和有票券New图标 执行更新
			if(customerId && !$("#newIco").is(":hidden")){
				deleteNewIco(customerId);
				$("#newIco").hide();//隐藏票券New图标
			}
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});
		//消息
		/*doc.getElementById("messagelist").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			//mui.alert(noCheck);
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});*/
		
		var mySaving = doc.getElementById("mySavings");
		mySaving.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		
		var personalLoan = doc.getElementById("personalLoan");
		personalLoan.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		
		var myPrizes = doc.getElementById("myPrizes");
		myPrizes.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
		
		//日志查询
		var userLog = doc.getElementById("userLog");
		userLog.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
				
		ws = plus.webview.currentWebview();
		ws.addEventListener("maskClick",function(){
//			getPreMessage();
			wc.close("slide-out-right");
		},false);
		
			
		doc.getElementById("myRight").addEventListener('tap',showSide);		
		var backButtonPress = 0;
		mui.back = function(event){
			if(wc){
//				getPreMessage();
				plus.webview.close(wc);
			}else{
				backButtonPress++;
				if (backButtonPress > 1) {
					userInfo.removeItem("sessionId");
					plus.runtime.quit();
				} else {
					plus.nativeUI.toast('再按一次退出应用');
				}
				setTimeout(function() {
					backButtonPress = 0;
				}, 1000);
				return false;
			}
		}
		
	
	
	//登陆、安全退出刷新页面
		window.addEventListener("reload",function(event){
			showLogonStatus();
			
		});		
		
		
	});
	

	function showSide(){
			// 防止快速点击可能导致多次创建
			if(wc){
				return;
			}
			// 开启遮罩
			plus.webview.getLaunchWebview().setStyle({mask:"rgba(0,0,0,0.5)"});
			ws.setStyle({mask:"rgba(0,0,0,0.5)"});
			// 创建侧滑页面
			wc=plus.webview.create("myRight.html","myRight",{background:"transparent",left:"20%",width:"80%",popGesture:"none"});
			plus.webview.hide(wc);
			// 侧滑页面关闭后关闭遮罩
			wc.addEventListener('close',function(){
				plus.webview.getLaunchWebview().setStyle({mask:"none"});
				ws.setStyle({mask:"none"});
				wc=null;
			},false);
			// 侧滑页面加载后显示（避免白屏）
			wc.addEventListener("loaded",function(){
				//wc.show("slide-in-right",200);
				plus.webview.show(wc,"slide-in-right",200);
			},false);
			
			window.addEventListener("hideRight",function(){
				plus.webview.hide(wc);
				plus.webview.getLaunchWebview().setStyle({mask:"none"});
				ws.setStyle({mask:"none"});
				wc=null;
			});
		}
	
});