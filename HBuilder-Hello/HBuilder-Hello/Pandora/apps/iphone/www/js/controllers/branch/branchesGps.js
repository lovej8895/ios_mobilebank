define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var bdAk = "9emQ9UIs8l8NIz8QVsBIqZCpGSzsGKcU";//百度api密钥 key
	var gdKey = "c892adb4571e31adcf085646a26eaec5";//高德api密钥 key
	var map;
	var gpsUrl = "";
	var downloadUrl = "";
	var clickStatus = true;//导航按钮 不可连续 触发 true为可导航 false为不可导航 

	m.init();

	m.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var state = app.getState();
		
		var self = plus.webview.currentWebview();
		var servicePoint = self.paramServiceObj; //网点信息
		var myPoint = self.paramMyPoi; //我的位置
		var myLat = self.paramMyLat; //我的位置经度
		var myLng = self.paramMyLng; //我的位置维度
		var bdPoint = ""; //我的位置-百度API
		var bdLat = ""; //我的位置经度-百度API
		var bdLng = ""; //我的位置维度-百度API
		var gdPoint = ""; //我的位置-高德API
		var gdLat = ""; //我的位置经度-高德API
		var gdLng = ""; //我的位置维度-高德API
		var netMark = false;//加载百度api成功标识 true为成功 false为失败
		var ot = 3000;//延迟2000 2秒执行 需要修改
		var mapOptions={
			                minZoom: 3,
			                maxZoom:19,
			                mapType:  BMAP_NORMAL_MAP
			             };
		
		plus.nativeUI.showWaiting("加载中...");
		
		//加时间参数才能显示
		var curTime = (new Date).getTime();
		var url = "http://api.map.baidu.com/getscript?v=2.0&ak="+bdAk+"&services=&t="+curTime;
		var gdurl = "http://webapi.amap.com/maps?v=1.3&key="+gdKey+"&plugin=AMap.Aoutocomplete"
		//访问百度api定位
		getBaiduApi = function(){
			$.ajax(url, {
				dataType: 'script', //服务器返回script格式数据
				timeout: ot, //超时时间设置为6秒；
				success: function(data) {
					//服务器返回响应，根据响应结果，分析是否加载成功；
//					console.log('返回信息' + JSON.stringify(data));
					netMark = true;
					showBranches();
					showBmap();
					plus.nativeUI.closeWaiting();
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					if(!netMark){
						mui.toast("无法获取到您的位置信息");
						showBranches();
						showApiBmap();
						plus.nativeUI.closeWaiting();
					}
				}
			});
		}
		//百度经纬度转换成高德经纬度
		var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
		var bd09togcj02 = function bd09togcj02(bd_lon, bd_lat) {
		    var bd_lon = +bd_lon;
		    var bd_lat = +bd_lat;
		    var x = bd_lon - 0.0065;
		    var y = bd_lat - 0.006;
		    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
		    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
		    var gg_lng = z * Math.cos(theta);
		    var gg_lat = z * Math.sin(theta);
		    gdLat = gg_lat;
			gdLng = gg_lng;
			console.log(gdLng);
			console.log(gdLat);
//		    return [gg_lng, gg_lat]
		};
		
		getBaiduApi();//访问百度api显示地图
		if(mui.os.ios){
			bd09togcj02(myLng, myLat);//百度经纬度转换成高德经纬度
//		    $.ajax(gdurl, {
//				dataType: 'script', //服务器返回script格式数据
//				timeout: ot, //超时时间设置为6秒；
//				success: function(data) {
//					showGdMap();//加载地图，调用浏览器高德api定位服务
//				},
//				error: function(xhr, type, errorThrown) {
//					//异常处理；
//					if(!netMark){
//						console.log("高德定位失败");
//						gdLat = myLat;
//						gdLng = myLng;
//					}
//				}
//			});
		}
		
		//加载本地离线地图--瓦片
		function showApiBmap(){
				//瓦片图放在apiv1.3.min.js文件中设置--5694行
				var map = new BMap.Map("allmap",mapOptions);      // 设置街道图为底图
//				var point = new BMap.Point(116.468278, 39.922965);   // 创建点坐标
				var point = new BMap.Point(114.422278, 30.454481);   // 武汉金融港 创建点坐标
				map.centerAndZoom(point,12);                         // 初始化地图,设置中心点坐标和地图级别。
				
				var opts = {offset: new BMap.Size(150, 5), anchor: BMAP_ANCHOR_TOP_LEFT}    
				//map.addControl(new BMap.NavigationControl({offset: new BMap.Size(10, 90)}));//缩放加减按钮
				map.addControl(new BMap.ScaleControl(opts));//显示比例
		    	var overView = new BMap.OverviewMapControl();
			    var overViewOpen = new BMap.OverviewMapControl({isOpen:false, anchor: BMAP_ANCHOR_TOP_RIGHT});
		        map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT})); //右上角，默认地图控件 //加减号按钮 
		        map.addControl(overView);          //添加默认缩略地图控件 //放大视图   
		        map.addControl(overViewOpen);      //右上角，打开
				
				var myIcon = new BMap.Icon("../../images/api_images/Point.png", new BMap.Size(20,25));
				var marker = new BMap.Marker(point,{icon:myIcon});   // 创建标注
//				map.addOverlay(marker);                              // 加载标注
//				marker.enableDragging();
				
				map.addEventListener("mousemove",function(e)
				{
				   ReinforcePC.getCoordinate(e.point.lng,e.point.lat);
				
				 });
				
			}
		
		//加载网点信息
		function showBranches(){
			var ibwBranchNameShow = servicePoint.ibwBranchName;
			if(servicePoint.ibwBranchName.length > 12){
				ibwBranchNameShow = servicePoint.ibwBranchName.substr(0,12) +'...';
			}
			var ibwBranchAddressShow = servicePoint.ibwBranchAddress;
			if(servicePoint.ibwBranchAddress.length > 15){
				ibwBranchAddressShow = servicePoint.ibwBranchAddress.substr(0,15) +'...';
			}
			var ibwBranchType = "ATM";
			if(servicePoint.ibwBranchType == 2){
				ibwBranchType = "营业厅";
			}else if(servicePoint.ibwBranchType == 3){
				ibwBranchType = "社区银行";
			}else{
				ibwBranchType = "ATM";
			}
			
			var html_title = '<ul class="backbox_one ove_hid">';
				html_title += '<li><p class="bra_tit fz_15">' + ibwBranchNameShow;
				html_title += '<span class="bra_tit_icon">' + ibwBranchType + '</span></p>';
				html_title += '<p class="distance_nb fz_15">' + servicePoint.distance + '</p></li></a>';
				html_title += '<li class="money_box"><p class="pub_li_left m_left10px color_9">' + ibwBranchAddressShow + '</p></li>';
				html_title += '<li class="pub_btnbox"><a id="goThere" onCheck="true" class="bra_word1"><span class="pub_btnicon pub_btnimg1"></span>导航</a>';
				if(servicePoint.ibwBranchPhone != ''){
					html_title += '<a id="ibwBranchPhone" onclick="dail()" onCheck="true" class="bra_word1"><span class="pub_btnicon pub_btnimg2"></span>电话</a></li></ul>';
				}else{
					html_title += '<p id="ibwBranchPhone" class="pub_btnbox_p bra_word2"><span class="pub_btnicon pub_btnimg2_1"></span>电话</p></li></ul>';
				}
			$("#bankTitle_div").html(html_title);
			
			goThere = doc.getElementById("goThere"); //到这去 
//			默认打开百度地图导航 未安装百度地图则打开高德地图
			goThere.addEventListener("tap", function() {
				if(clickStatus){
					clickStatus = false;
					plus.nativeUI.showWaiting("导航...");
					if(mui.os.ios){
//						gpsUrl = "baidumap://map/direction?origin="+myLat+","+myLng+
//							"&destination="+servicePoint.ibwBranchLat+","+servicePoint.ibwBranchLongt+
//							"&mode=driving&src=webapp.navi.yourCompanyName.yourAppName";//app百度地图导航--ios
						gpsUrl = "baidumap://map/direction?"+
							"destination="+servicePoint.ibwBranchLat+","+servicePoint.ibwBranchLongt+
							"&mode=driving&src=webapp.navi.yourCompanyName.yourAppName";//app百度地图导航--ios--不设当前位置坐标
					}else{	
//						gpsUrl = "bdapp://map/direction?origin="+myLat+","+myLng+
//							"&destination="+servicePoint.ibwBranchLat+","+servicePoint.ibwBranchLongt+
//							"&mode=driving&region="+myPoint;//百度地图App导航--android
						gpsUrl = "bdapp://map/direction?"+
							"destination="+servicePoint.ibwBranchLat+","+servicePoint.ibwBranchLongt+
							"&mode=driving&region="+myPoint;//百度地图App导航--android--不设当前位置坐标
					}
					openBMap(gpsUrl); 
				}
			}, false);
		}
		
		//加载成功时显示地图
		function showBmap(){
			// 百度地图API功能,在地图上添加标记
			map = new BMap.Map("allmap");
			myPoi = new BMap.Point(myLng, myLat);//我的位置
			map.centerAndZoom(myPoi, 12);//初始化地图，设置中心点坐标和地图级别
			var mIcon = new BMap.Icon("../../images/myLocation.svg", new BMap.Size(18, 30));//我的位置图标
			var mMarker = new BMap.Marker(myPoi, {icon: mIcon});
			map.addOverlay(mMarker);
//			var mLicontent="<p>我的位置:"+myPoint+"</p><br>";    
			var mLicontent="<p>我的位置</p><br>";    
			var mInfoWindow = new BMap.InfoWindow(mLicontent); 
//			mMarker.openInfoWindow(mInfoWindow);//显示我的位置
//			mMarker.addEventListener('click',function(){  
//		        mMarker.openInfoWindow(mInfoWindow);
//		        map.centerAndZoom(myPoi, 12);//初始化地图，设置中心点坐标和地图级别
//		    }); 
		    var labelbaidu = new BMap.Label("我的位置", { offset: new BMap.Size(20, -10) });
		    labelbaidu.setStyle({
		    	color: "green",
		    	border: "1",
		    	textAlign: "center",
		    	cursor: "pointer"
		    });
            mMarker.setLabel(labelbaidu); //添加百度标注  
			
			var poi = new BMap.Point(servicePoint.ibwBranchLongt, servicePoint.ibwBranchLat);
			var icon = new BMap.Icon("../../images/bankPoint.svg", new BMap.Size(18, 30));//我的位置图标
			var marker = new BMap.Marker(poi, {icon: icon});
//			marker.enableDragging(); //marker可拖拽
			map.addOverlay(marker); //在地图中添加marker
	//		map.centerAndZoom("湖北省武汉市江夏区金融港四路", 19);//初始化地图，设置中心点坐标和地图级别  
			
			var opts = {offset: new BMap.Size(150, 5), anchor: BMAP_ANCHOR_TOP_LEFT}    
			map.addControl(new BMap.ScaleControl(opts));//显示比例
	    	var overView = new BMap.OverviewMapControl();
		    var overViewOpen = new BMap.OverviewMapControl({isOpen:false, anchor: BMAP_ANCHOR_TOP_RIGHT});
	        map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT})); //右上角，默认地图控件 //加减号按钮 
	        map.addControl(overView);          //添加默认缩略地图控件 //放大视图   
	        map.addControl(overViewOpen);      //右上角，打开
			
			//点击银行标记触发事件
			var bankLabel = new BMap.Label(servicePoint.ibwBranchName, { offset: new BMap.Size(20, -10) });
		    bankLabel.setStyle({
		    	color: "blue",
		    	border: "1",
		    	textAlign: "center",
		    	cursor: "pointer"
		    });
//		    marker.setLabel(bankLabel); //添加百度标注 
		    
//	      	var licontent="<p>"+servicePoint.ibwBranchName+"</p><br>";    
//			var opts = {   
//				width : 30,  
//				height: 5, 
//			};           
//			var  infoWindow = new BMap.InfoWindow(licontent, opts); 
//			marker.openInfoWindow(infoWindow);//显示目标位置
			marker.addEventListener('click',function(){ 
//				marker.openInfoWindow(infoWindow);
//				map.centerAndZoom(poi, 12);//初始化地图，设置中心点坐标和地图级别
				var curlabel = marker.getLabel();
			    if(curlabel){//如果已设置标签
				    curlabel.setContent("");//设置标签内容为空
				    curlabel.setStyle({borderWidth: "0px"});//设置标签边框宽度为0
			    }else{
					marker.setLabel(bankLabel); //添加百度标注
			    }
			}); 
			//点击银行标记触发事件
//			marker.addEventListener('click',function(pt){ 
//	      		setInputPoint(pt.target.getPosition());
//			}); 
//			map.addEventListener("click",
//		    function(c) {
//		        var b = c.point;
//		        if (c.overlay && c.overlay instanceof BMap.Marker) {
//		            b = c.overlay.point
//		            setInputPoint(b)
//		        }
//		    });
		    
		    function setInputPoint(a) {
			    if(a.lng == servicePoint.ibwBranchLongt && a.lat == servicePoint.ibwBranchLat){
			    	poi = new BMap.Point(servicePoint.ibwBranchLongt, servicePoint.ibwBranchLat);
					var mks = new BMap.Marker(poi);
	        		map.addOverlay(mks);//标出银行所在地
			    	var licontent="<p>"+servicePoint.ibwBranchName+"</p><br>";    
					var opts = {   
					   	width : 30,  
					    height: 5,  
					};           
					var  infoWindow = new BMap.InfoWindow(licontent, opts);    
					mks.openInfoWindow(infoWindow); 
					mks.addEventListener('click',function(){ 
						mks.openInfoWindow(infoWindow); 
					}); 
				}
			}
		}
		
		//		2017-04-14--调用hbuilder提供高德API定位
		var gdmap, gdgeolocation;
		//加载地图，调用浏览器定位服务
		function showGdMap() {
			gdmap = new AMap.Map('container', {
				resizeEnable: true,
				timeout: 10000 //超过10秒后停止定位，默认：无穷大
//				maximumAge: 0, //定位结果缓存0毫秒，默认：0
//				convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
//				showButton: true, //显示定位按钮，默认：true
//				buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角 'RB'右下角
//				buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
//				showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
//				showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
//				panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
//				zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			});
			gdmap.plugin('AMap.Geolocation', function() {
				gdgeolocation = new AMap.Geolocation({
					enableHighAccuracy: true //是否使用高精度定位，默认:true
				});
				gdmap.addControl(gdgeolocation);
				gdgeolocation.getCurrentPosition();
				AMap.event.addListener(gdgeolocation, 'complete', onComplete); //返回定位信息
				AMap.event.addListener(gdgeolocation, 'error', onError); //返回定位出错信息
			});
		}
		//解析定位结果
		function onComplete(data) {
			gdLng = data.position.getLng();
			gdLat = data.position.getLat();
			console.log(gdLng);
			console.log(gdLat);
			if(data.addressComponent) {
				var addComp = data.addressComponent;
				gdPoint = addComp.province + addComp.city + addComp.district + addComp.street; // + addComp.streetNumber;
				console.log('城市--当前位置===== :' + gdPoint);
				//		        		console.log(data.formattedAddress);
			}
			if(data.accuracy) {
				console.log(data.accuracy);
			} //如为IP精确定位结果则没有精度信息
		}
		//解析定位错误信息
		function onError(data) {
			console.log("高德定位失败");
		}
		
		dail = function (){
			mui.confirm("您确定要拨打电话：" + servicePoint.ibwBranchPhone + " 吗？","提示",["确定", "取消"], function(e) {
						if (e.index == 0) {
		                	plus.device.dial( servicePoint.ibwBranchPhone, false );
		            	}
		        	}
		    	)
		}
 	
 		//判断是否安装百度地图APP 启动百度地图导航
		function openBMap(gpsUrl) {
			gpsUrl = encodeURI(gpsUrl);//解码Url ios不识别url
			plus.runtime.openURL(gpsUrl, function(e) {
				//打不开百度地图或未安装百度地图
				if(mui.os.ios){
//					gpsUrl = "iosamap://viewMap?sourceApplication=高德地图&poiname="+servicePoint.ibwBranchAddress+
//						"&lat="+servicePoint.ibwBranchGdLat+"&lon="+servicePoint.ibwBranchGdLongt+"&dev=0&style=2";//高德地图--ios--viewMap进入预导航页面
					gpsUrl = "iosamap://navi?sourceApplication=HelloH5&poiname="+servicePoint.ibwBranchName+
						"&lat="+servicePoint.ibwBranchGdLat+"&lon="+servicePoint.ibwBranchGdLongt+"&dev=0&style=2";//高德地图--ios--navi直接进入导航功能
				}else{	
					gpsUrl = "androidamap://navi?sourceApplication=HelloH5&poiname="+servicePoint.ibwBranchName+
						"&lat="+servicePoint.ibwBranchGdLat+"&lon="+servicePoint.ibwBranchGdLongt+"&dev=0&style=2";//高德地图android--navi直接进入导航功能
				}
				openBMap_gd(gpsUrl);
			});
			//延迟 设置导航按钮为状态true 
			setTimeout(function () { 
			    plus.nativeUI.closeWaiting();
			  	clickStatus = true;
		  	}, 3000)
		}
		
		//判断是否安装高德地图APP //启动高德地图导航
		function openBMap_gd(gpsUrl) {
			gpsUrl = encodeURI(gpsUrl);//解码Url ios不识别url
			plus.runtime.openURL(gpsUrl, function(e) {
				plus.nativeUI.closeWaiting();
				if(mui.os.ios){			//调用ios系统地图--高德地图
					// 设置目标位置坐标点和其实位置坐标点
					var dst = new plus.maps.Point(servicePoint.ibwBranchGdLongt, servicePoint.ibwBranchGdLat); //目标位置
					var src = new plus.maps.Point(gdLng, gdLat); // 我的位置
					// 调用系统地图显示 
					plus.maps.openSysMap( dst, servicePoint.ibwBranchName, src );
				} else{
					mui.toast('未安装百度或高德地图app');
				}
			});
		}

	});
});