define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	var turnPageBeginPos=1;
    var turnPageShowNum=5;
    var turnPageTotalNum=0;
    var choosePickerList=[];
    var choosePicker;
    var choosePickerCity;
    var _choosePickerCity;
    var choosePickerPronvince;
    var choosePickerType;
    var bdAk = "9emQ9UIs8l8NIz8QVsBIqZCpGSzsGKcU";//百度api密钥 key
	var netMark = false;//定位成功标识 true为成功 false为失败
	var timeOut = false;
	var pageBranchesList = [];
    

	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback:pulldownfresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	// 下拉更新
    function pulldownfresh(){
		setTimeout(function() {
//			if(!netMark){
//				下拉重新定位
				netMark = false;
				pageBranchesList.splice(0, pageBranchesList.length);//清空数组
				getBaiduApi();//访问百度api定位
//			}else{
//				plus.nativeUI.showWaiting("加载中...");
//				turnPageBeginPos=1;
//				queryBranches(1);
//			}
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
			mui('#pullrefresh').pullRefresh().refresh(true);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
		}, 800);
    }
	//上拉 翻页功能
   	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#branchesList ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryBranches(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    } 
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();	
		//网点数据定义
		var allBranchesList = [];
		var liveTime = new Date();
		var branchesList = $("#branchesList");
		var	myPosition = "湖北省武汉市江夏区金融港四路";
		//当前位置的经纬度--湖北省武汉市江夏区金融港四路 开发模式设置默认
//		var longt = 114.422278;//当前位置的经度
//		var lat = 30.454481;//到当前位置的纬度；
		var longt = 0;//当前位置的经度
		var lat = 0;//到当前位置的纬度；
		var branchName = '';//网点名称
		var type = '';//网点类型
		var typeShow = '';//网点类型-显示
		var cityName = '';//网点所属城市
		var cityCode = '';//网点所属城市编码
		var provinceCode = '';//网点所属省份编码
		var choProvinceCode = '';//已选网点所属省份编码
		var nearLimit = 0;//距离我的位置范围
		var nearLimitShow = 0;//距离我的位置范围-显示
		var s = 0;//网点与我的实际距离
		var ibwBranchLongt = 0;//传入后台参数 经度偏移范围
		var ibwBranchLat = 0;//传入后台参数 纬度偏移范围
		var minLat = '';//最小纬度
        var maxLat = '';//最大纬度
        var minLng = '';//最小经度
        var maxLng = '';//最大经度
        var actualLength = '';//距离-参数
        var distance = [];
        var provinceList = [];
        var cityList = [];
        var provinceCityList = [];
		var ot = 6000;//延迟   1000 1秒   需要修改
		var alertTitle = "温馨提示";//提示标题
		var alertStr = "";//提示信息
		
		var url = "";
		//加时间参数才能显示
		var curTime = (new Date).getTime();
		url = "http://api.map.baidu.com/getscript?v=2.0&ak="+bdAk+"&services=&t="+curTime;
//		url = "http://webapi.amap.com/maps?v=1.3&key=e194ac2e17806ca8b45cd7c9f4d6ac49&plugin=AMap.Aoutocomplete&t="+curTime;//高德api
//		url = "https://webapi.amap.com/maps?v=1.3&key=e194ac2e17806ca8b45cd7c9f4d6ac49&plugin=AMap.Aoutocomplete&t="+curTime;
//		var convUrl = "http://developer.baidu.com/map/jsdemo/demo/convertor.js";
//		coor不出现时，默认为百度墨卡托坐标；coor=bd09ll时，返回为百度经纬度坐标；coor=gcj02时，返回为国测局坐标。

		//定位
		getBaiduApi = function(){
			//功能指引
			var settingGuide = userInfo.getItem("brachesGuide");
			if (!settingGuide) {
				userInfo.setItem("brachesGuide", "true");
				var guide = plus.webview.create("../guide/guide_branches.html","guide_branches",{background:"transparent",zindex:998,popGesture:'none'});
				plus.webview.show(guide);
			}
			if(settingGuide){
				plus.nativeUI.showWaiting("定位中...");
			}
			if(mui.os.ios){
				getPos();//引用plus定位
			}else{
				showLocation();//自带定位plus map.showUserLocation
//				getPos();//引用plus定位
			}
//			$.ajax(url, {
//				dataType: 'script', //服务器返回script格式数据
//				timeout: ot, //超时时间设置为6秒；
//				success: function(data) {
//					//服务器返回响应，根据响应结果，分析是否加载成功；
////				console.log('返回信息' + JSON.stringify(data));
//					netMark = true;
//					showBmap();//访问百度api定位定位并查询网点
//				},
//				error: function(xhr, type, errorThrown) {
//					//异常处理；
//					if(!netMark){
//						plus.nativeUI.closeWaiting();
//						var html = '<div class="fail_icon1 suc_top7px"></div>';
//						html += '<p class="fz_15 text_m">无法获取到您的位置信息</p>';
//						$("#showMsgDiv").html(html);
//						$("#pullrefresh").hide();
//						$("#showMsgDiv").show();
//						mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
//						return;
//					}
//				}
//			});
		}
		
//		引用plus定位
//	provider参数："system"：表示系统定位模块，支持wgs84坐标系；
//	"baidu"：表示百度定位模块，支持gcj02/bd09/bd09ll坐标系；
//	"amap"：表示高德定位模板，支持gcj02坐标系。
//	默认值按以下优先顺序获取（amap&gt;baidu&gt;system），若指定的provider不存在或无效则返回错误回调。
//	注意：百度/高德定位模块需要配置百度/高德地图相关参数才能正常使用。
		function getPos() {
			plus.geolocation.getCurrentPosition( geoInf, function ( e ) {
				if(!netMark){
					plus.nativeUI.closeWaiting();
					var html = '<div class="fail_icon1 suc_top7px"></div>';
					html += '<p class="fz_15 text_m">无法获取到您的位置信息</p>';
					$("#showMsgDiv").html(html);
					$("#pullrefresh").hide();
					$("#showMsgDiv").show();
					mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
					return;
				}
			},{provider:'baidu'},{timeout:ot},{geocode:true});//geocode:true解析地址，false不解析地址
			setTimeout(function(){
				if(!netMark){
					timeOut = true;
					plus.nativeUI.closeWaiting();
					var html = '<div class="fail_icon1 suc_top7px"></div>';
					html += '<p class="fz_15 text_m">无法获取到您的位置信息</p>';
					$("#showMsgDiv").html(html);
					$("#pullrefresh").hide();
					$("#showMsgDiv").show();
					mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
					return;
				}
			},ot)
		}
		//getCurrentPosition定位
		function geoInf( position ) {
			if(timeOut){
				return;
			}
			timeOut = false;
			netMark = true;
//			console.log('返回信息' + JSON.stringify(position));
			myPosition = position.addresses;
			var codns = position.coords;//获取地理坐标信息；
			lat = codns.latitude;//获取到当前位置的纬度；
			longt = codns.longitude;//获取到当前位置的经度
			console.log('坐标类型===== :' + position.coordsType);
			console.log('地址===== :' + myPosition);
			console.log('lat===== :' + lat);
			console.log('longt===== :' + longt);
			turnPageBeginPos = 1;
			queryBranches(1);//查询网点信息
		}
		
		//map.showUserLocation无需网络或GPS定位且比较精确--但ios设备会卡机
		function showLocation(){
//			通过mui.plusReady【表示页面加载事件】调用hbuilder提供的map.showUserLocation
			var map =new plus.maps.Map("allmap");
			map.showUserLocation( true );
			setTimeout(function(){
				if(!netMark){
					timeOut = true;
					plus.nativeUI.closeWaiting();
					var html = '<div class="fail_icon1 suc_top7px"></div>';
					html += '<p class="fz_15 text_m">无法获取到您的位置信息</p>';
					$("#showMsgDiv").html(html);
					$("#pullrefresh").hide();
					$("#showMsgDiv").show();
					mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
					return;
				}
			},ot)
			map.getUserLocation(function(state,position){
				if(0==state){
					if(timeOut){
						return;
					}
					timeOut = false;
					netMark = true;
					lat = position.getLat();
					longt = position.getLng();
					console.log('lat===== :' + lat);
					console.log('longt===== :' + longt);
					turnPageBeginPos = 1;
					queryBranches(1);//查询网点信息
				}else{
					netMark = false;
					//当前位置的经纬度--武汉市
					plus.nativeUI.closeWaiting();
					var html = '<div class="fail_icon1 suc_top7px"></div>';
					html += '<p class="fz_15 text_m">无法获取到您的位置信息</p>';
					$("#showMsgDiv").html(html);
					$("#pullrefresh").hide();
					$("#showMsgDiv").show();
					mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
					return;
				}
			});
        }
		
		//百度api定位--GPS未开时定位不准
		function showBmap(){
//			通过mui.plusReady【表示页面加载事件】调用hbuilder提供的百度定位
			var map = new BMap.Map("allmap");
			var geolocation = new BMap.Geolocation();
			var geoc = new BMap.Geocoder();
			geolocation.getCurrentPosition(function(r) {
				if(this.getStatus() == BMAP_STATUS_SUCCESS) {
					geoc.getLocation(r.point, function(rs) {
						var addComp = rs.addressComponents;
						myPosition = addComp.province + addComp.city + addComp.district + addComp.street; // + addComp.streetNumber;
						console.log('当前位置===== :' + myPosition);
					});
					geoInfo(r.point);
				} else {
					netMark = false;
					//当前位置的经纬度--武汉市
					plus.nativeUI.closeWaiting();
					var html = '<div class="fail_icon1 suc_top7px"></div>';
					html += '<p class="fz_15 text_m">无法获取到您的位置信息</p>';
					$("#showMsgDiv").html(html);
					$("#pullrefresh").hide();
					$("#showMsgDiv").show();
					mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
					return;
				}
			}, {
				// 指示浏览器获取高精度的位置，默认为false  
		        enableHighAccuracy: true,  
		        // 指定获取地理位置的超时时间，默认不限时，单位为毫秒  
		        timeout: ot,  
		        // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。  
		        maximumAge: 3000 
			});
        }
		//获取当前位置经纬度 并查询网点列表
		function geoInfo(position) {
			lat = position.lat;
			longt = position.lng;
			console.log('lat===== :' + lat);
			console.log('longt===== :' + longt);
			turnPageBeginPos = 1;
			queryBranches(1);//查询网点信息
		}
		
		var EARTH_RADIUS = 6378137.0;    //单位M
	    var PI = Math.PI;
	    function getRad(d){
	        return d*PI/180.0;
	    }
	    
	    /**
	     * 根据两点间经纬度计算距离
	     * caculate the great circle distance
	     */
	    function getGreatCircleDistance(lat1,lng1,lat2,lng2){
	        var radLat1 = getRad(lat1);
	        var radLat2 = getRad(lat2);
	        var a = radLat1 - radLat2;
	        var b = getRad(lng1) - getRad(lng2);
	        var l = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
	        l = l*EARTH_RADIUS;
	        l = Math.round(l*10000)/10000.0;
	        return l;
	    }
	    
		/// <summary>
        /// 根据提供的经度和纬度、以及半径，取得此半径内的最大最小经纬度
        /// </summary>
        /// <param name="lat">纬度</param>
        /// <param name="lon">经度</param>
        /// <param name="raidus">半径(米)</param>
        /// <returns></returns>
        function GetAround(lat,lon,raidus)
        {
            var latitude = lat;
            var longitude = lon;
            var degree = (24901 * 1609) / 360.0;
            var raidusMile = raidus;
            var dpmLat = 1 / degree;
            var radiusLat = dpmLat * raidusMile;
            minLat = latitude - radiusLat;
            maxLat = latitude + radiusLat;
            var mpdLng = degree * Math.cos(latitude * (PI / 180));
            var dpmLng = 1 / mpdLng;
            var radiusLng = dpmLng * raidusMile;
            minLng = longitude - radiusLng;
            maxLng = longitude + radiusLng;
//          return maxLng;
        }
		
//		getBaiduApi();//访问百度api定位
		
		//网点名称搜索
		$("#searchButton").on("tap",function(){
			branchName = $("#branchName").val();
			resetPullRefresh();
		});
		//我的附近下拉框
		$("#nearLimit_a").on("tap",function(){
			getPickerList('1');
			document.activeElement.blur();
			choosePicker.show();	
		});
		window.addEventListener("pickArea",function(event){
                var pickItem=event.detail;
				$("#nearLimit").html(pickItem.text);
				$("#neraLimit").css("color","#D61B60");
				nearLimit = pickItem.value;
				nearLimitShow = pickItem.text;
				resetPullRefresh();
        });
		//区域下拉框
		$("#cityName_a").on("tap",function(){
			document.activeElement.blur();
//			getPickerList('2');//城市列表
//			choosePickerCity.show();
			if(provinceList.length == 0){//没有省份记录时查询后台
				queryProvince();//查询下拉省份及城市
			}else{
				getPickerList('4');//省份列表
				choosePickerPronvince.show();
			}
		});
		window.addEventListener("pickCity",function(event){
                var pickItem=event.detail;
				$("#cityName").html(pickItem.text);
				$("#cityCode").val(pickItem.value);
				$("#cityName").css("color","#D61B60");
				choProvinceCode = provinceCode;//选择时
				choosePickerCity = _choosePickerCity;
				if(pickItem.value == ""){
					cityName = '';
					cityCode = '';
				}else{
					cityCode = pickItem.value;
					cityName = pickItem.text;
				}
				resetPullRefresh();
       	});
		window.addEventListener("pickProvince",function(event){
				var pickItem=event.detail;
				provinceCode = pickItem.value;
                getPickerList("2");
                if (choProvinceCode != provinceCode) {
					//所选省份不同时重新格式化
				    _choosePickerCity = new mui.SmartPicker({title:"请选择城市",fireEvent:"pickCity"});
					_choosePickerCity.setData(choosePickerList);
					_choosePickerCity.show();
				}else{
//					choosePickerCity = new mui.SmartPicker({title:"请选择城市",fireEvent:"pickCity"});
					choosePickerCity.setData(choosePickerList);
					choosePickerCity.show();
				}
				document.activeElement.blur();
       	});
		//网点类型下拉框
		$("#type_a").on("tap",function(){
			getPickerList(3);
			document.activeElement.blur();
			choosePickerType.show();	
		});	
		window.addEventListener("pickType",function(event){
                var pickItem=event.detail;
				$("#type").html(pickItem.text);
				$("#type").css("color","#D61B60");
				type = pickItem.value;
				typeShow = pickItem.text;
				
				resetPullRefresh();
       	});
       
		choosePicker = new mui.SmartPicker({title:"请选择",fireEvent:"pickArea"});
		choosePickerCity = new mui.SmartPicker({title:"请选择城市",fireEvent:"pickCity"});
		choosePickerPronvince = new mui.SmartPicker({title:"请选择省份",fireEvent:"pickProvince"});
		choosePickerType = new mui.SmartPicker({title:"请选择网点类型",fireEvent:"pickType"});
		function getPickerList(flag){
			choosePickerList=[];
			if(flag=='1'){
				for( var i=0;i<6;i++ ){
					var dataTxt;
					if(i == 0){
						dataTxt = '我的附近';
					}else if(i == 1){
						dataTxt = '1000米';
					}else if(i == 2){
						dataTxt = '2000米';
					}else if(i == 3){
						dataTxt = '3000米';
					}else if(i == 4){
						dataTxt = '4000米';
					}else if(i == 5){
						dataTxt = '5000米';
					}
					var pickItem={
						value:i,
						text:dataTxt
					};
					choosePickerList.push(pickItem);
				}
				choosePicker.setData(choosePickerList);
			}else if(flag=='2'){
				var pickItem = [];
					pickItem.splice(0, pickItem.length);//清空数组
					pickItem={
						value: "",
						text: "全部区域"
					};
				if(provinceList.length > 0){
					choosePickerList.push(pickItem);
					for(var i = 0;i < provinceList.length; i++){
						if(provinceCityList[i].length > 0){
							for(var j = 0;j < provinceCityList[i].length; j++){
								if (provinceCityList[i][j].provinceCode == provinceCode) {
									pickItem={
										value: provinceCityList[i][j].cityCode,
										text: provinceCityList[i][j].cityName
									};
									choosePickerList.push(pickItem);
								}
							}
						}
					}
				}
			}else if(flag=='3'){
				for( var i=0;i<4;i++ ){
					var dataTxt;
					if(i == 0){
						dataTxt = '全部';
					}else if(i == 1){
						dataTxt = 'ATM';
					}else if(i == 2){
						dataTxt = '银行网点';
					}else if(i == 3){
						dataTxt = '社区银行';
					}
					var pickItem={
						value:i,
						text:dataTxt
					};
					choosePickerList.push(pickItem);
				}
				choosePickerType.setData(choosePickerList);
			}else if(flag=='4'){
				if(provinceList.length > 0){
					for(var i = 0;i < provinceList.length; i++){
						var pickItem={
							value: provinceList[i].provinceCode,
							text: provinceList[i].provinceName
						};
						choosePickerList.push(pickItem);
					}
					choosePickerPronvince.setData(choosePickerList);
//					choosePickerPronvince.setDataTwo(choosePickerList);
				}
			}
		}
        
		//查询省份
        queryProvince = function(){
        	var url = mbank.getApiURL() + 'branchProvinceQuery.do';
			var params = {
				provinceId: '',
				provinceCode: '',
				provinceName: '',
				liana_notCheckUrl:false
			};
			mbank.apiSend('post', url, params, querySuccess, queryError, true);
			
			function querySuccess(data){
				provinceList = data.cityList;
				if(provinceList.length > 0){
					getPickerList('4');//省份列表
					choosePickerPronvince.show();
				}
				if(provinceList.length > 0){
					for(var i = 0;i < provinceList.length; i++){
						queryCity(provinceList[i].provinceCode, i);
					}
				}
			}
			function queryError(e){
				mui.toast("获取区域下拉列表失败！")
			}
			plus.nativeUI.closeWaiting();
        }
        //查询城市
        queryCity = function(provinceCode, j){
        	var url = mbank.getApiURL() + 'branchCityQuery.do';
			var params = {
				provinceId: '',
				provinceCode: provinceCode,
				provinceName: '',
				cityId: '',
				cityCode: '',
				cityName: '',
				liana_notCheckUrl:false
			};
			mbank.apiSend('post', url, params, querySuccess, queryError, false);
			
			function querySuccess(data){
				cityList = data.cityList;
				provinceCityList[j] = data.cityList;
			}
			function queryError(e){
				
			}
        }
        
		//初始化查询网点数据
		queryBranches = function(beginPos){
//			if( turnPageBeginPos == 1 ){
//				$("#branchesList").empty();
//			}
			cityName = $("#cityName").text();
			if($("#cityCode").val() == "-1" || $("#cityCode").val() == ""){
				cityCode = "";
			}else{
				cityCode = $("#cityCode").val();
			}
			if(nearLimit == 0) {
				//查询我的附近所有--初始化
		//		GetAround(lat, longt, 0);
				minLat='';//最小纬度
			    maxLat='';//最大纬度
			    minLng='';//最小经度
			    maxLng='';//最大经度
			    actualLength = '';
			}else{
				GetAround(lat, longt, nearLimitShow.substr(0, nearLimitShow.length-1));
				actualLength = nearLimitShow.substr(0, nearLimitShow.length-1)/100000;
			}
			if(type == 0){
					type = '';
					typeShow = '';
			}
			branchName = $("#branchName").val();
			var url = mbank.getApiURL() + 'branchesQuery.do';
			var params = {
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum,
				ibwBranchName: branchName,
				ibwBranchLongt: longt,
				ibwBranchLat: lat,
				ibwBranchType: type,
				minLat: minLat,
				minLng: minLng,
				maxLat: maxLat,
				maxLng: maxLng,
				actualLength: actualLength,
				cityCode: cityCode,
				liana_notCheckUrl:false
				//查询的条件
			};
			mbank.apiSend('post', url, params, querySuccess, queryError, false);
			
			function querySuccess(data){
				$("#pullrefresh").show();
				$("#showMsgDiv").hide();
				mui('#pullrefresh').pullRefresh().setStopped(false);//放开上下拉
				turnPageTotalNum = data.turnPageTotalNum;
				if( beginPos == 1 ){
		       	   	$("#branchesList").empty();
		       	}
				allBranchesList = data.branchesList;
				if (allBranchesList.length == 0) {
					plus.nativeUI.closeWaiting();
					var html = '<div class="fail_icon1 suc_top7px"></div>';
					html += '<p class="fz_15 text_m">没有查询到网点记录！</p>';
					$("#showMsgDiv").html(html);
					$("#pullrefresh").hide();
					$("#showMsgDiv").show();
					mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
					return;
				}
				var branchesListHtml = "";
				for(var i = 0; i < allBranchesList.length; i++){
					var ibwBranchType = "ATM";
					var detailTyoe = "详情";
					var ibwBranchNameShow = allBranchesList[i].ibwBranchName;
					if(allBranchesList[i].ibwBranchName.length > 12){
						ibwBranchNameShow = allBranchesList[i].ibwBranchName.substr(0,12) +'...';
					}
					var ibwBranchAddressShow = allBranchesList[i].ibwBranchAddress;
					if(allBranchesList[i].ibwBranchAddress.length > 15){
						ibwBranchAddressShow = allBranchesList[i].ibwBranchAddress.substr(0,15) +'...';
					}
					if(allBranchesList[i].ibwBranchType == 2){
						ibwBranchType = "营业厅";
//						detailTyoe = "业务办理";
					}else if(allBranchesList[i].ibwBranchType == 3){
						ibwBranchType = "社区银行";
//						detailTyoe = "业务办理";
					}else{
						ibwBranchType = "ATM";
						detailTyoe = "详情";
					}
					
					//计算当前网点与我的位置之间的距离
					distance = getGreatCircleDistance(lat, longt, allBranchesList[i].ibwBranchLat, allBranchesList[i].ibwBranchLongt);
					//格式化距离且保留一位小数
					if(distance > 1000){
			        	distance = Math.round(distance)/1000;
			        	distance = format.formatMoney(distance, 1);
			        	distance = distance + 'km';
			        }else{
			        	distance = format.formatMoney(distance, 1);
			        	distance = distance +'m';
			        }
					//翻页功能 数据处理
					var index = beginPos - 1 + i;
					pageBranchesList[index] = allBranchesList[i];
					pageBranchesList[index].distance = distance;
					
					branchesListHtml += '<ul class="backbox_one m_top10px ove_hid">';
					branchesListHtml +=	'<li id="branchesDetail" class="liDetail" index=' + index + '><p class="bra_tit fz_15">' + ibwBranchNameShow;
					branchesListHtml += '<span class="bra_tit_icon">' + ibwBranchType + '</span></p>';
					branchesListHtml += '<p class="distance_nb fz_15">' + distance + '</p><a class="link_rbg link_t30px" style="color: #539BFF;"></a></li>';
					branchesListHtml += '<li class="liDetail money_box" index=' + index + '><p class="pub_li_left m_left10px color_9">' + ibwBranchAddressShow + '</p>';
//					branchesListHtml += '<p class="pub_li_right_branch m_right10px" style="color: #539BFF;">' + detailTyoe + '</p></li>';
					branchesListHtml += '</li>';
					branchesListHtml += '<li class="pub_btnbox"><a index=' + index + ' class="aBranchesGps bra_word1"><span class="pub_btnicon pub_btnimg1"></span>导航</a>';
					if(pageBranchesList[index].ibwBranchPhone != ''){
						branchesListHtml += '<a id="ibwBranchPhone" index=' + index + '  class="aDail bra_word1"><span class="pub_btnicon pub_btnimg2"></span>电话</a></li></ul>';
					}else{
						branchesListHtml += '<p id="ibwBranchPhone" class="pub_btnbox_p bra_word2"><span class="pub_btnicon pub_btnimg2_1"></span>电话</p></li></ul>';
					}
				}
				$("#branchesList").append(branchesListHtml);
				
				//传递参数到父页面
				var parent = self.parent();
				var params = {
					pageBranchesList: pageBranchesList,
					myPosition: myPosition,
					lat: lat,
					longt: longt
				};
				mui.fire(parent, "getParam", params);
				
				//详情
				$(".liDetail").off().on('tap', function(){
					var index = $(this).attr("index");
					getDetail(index);
				});
				//跳转到每个网点的位置
				$(".aBranchesGps").off().on('tap', function(){
					var index = $(this).attr("index");
					goPoint(index);
				});
				
				$(".aDail").off().on('tap', function(){
					var index = $(this).attr("index");
					dail(index);	
				});
				plus.nativeUI.closeWaiting();
			}
			
			function queryError(e){
				turnPageTotalNum = 0;
				plus.nativeUI.closeWaiting();
		    	var html = '<div class="suc_top7px"></div>';
//		    	html = '<div class="fail_icon1 suc_top7px"></div>';
				html += '<p class="fz_15 text_m">' + e.em + '</p>';
				$("#showMsgDiv").html(html);
				$("#pullrefresh").hide();
				$("#showMsgDiv").show();
				mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
			}
			
			//传递参数到父页面
				var parent = self.parent();
				var params = {
					pageBranchesList: pageBranchesList,
					myPosition: myPosition,
					lat: lat,
					longt: longt
				};
				mui.fire(parent, "getParam", params);
//				plus.nativeUI.closeWaiting();
		};
			
		getBaiduApi();//访问百度api定位
		
		getDetail = function (i){
			mbank.openWindowByLoad(
					"branchesDetail.html",
					"branchesDetail",
					"slide-in-right",
					{
				        allBranchesList : pageBranchesList[i],
				        paramMyPoi: myPosition,//当前位置
						paramMyLat: lat,//当前位置纬度
						paramMyLng: longt, //当前位置经度
				        noCheck : "true"
				    }
				);
		}
		
		goPoint = function(index) {
			var param = {
				paramServiceObj: pageBranchesList[index],//当前网点
				paramMyPoi: myPosition,//当前位置
				paramMyLat: lat,//当前位置纬度
				paramMyLng: longt, //当前位置经度
				noCheck : "true"
			};
			mbank.openWindowByLoad("branchesGps.html", "branchesGps", "slide-in-right", param);
		};
		
		dail = function (i){
			mui.confirm("您确定要拨打电话：" + pageBranchesList[i].ibwBranchPhone + " 吗？","提示",["确定", "取消"], function(e) {
					if (e.index == 0) {
		                plus.device.dial( pageBranchesList[i].ibwBranchPhone, false );
		            }
		        }
		    )
		}
		//刷新列表
		window.addEventListener("itemId", function(event) {
			$("#branchesList").empty();
			resetPullRefresh();
		});
		//父页面--非原生弹出框
		window.addEventListener("muiAlert", function(event) {
			var data = event.detail.data;
			mui.alert(data);
		});
		
		function resetPullRefresh() {
			pageBranchesList.splice(0, pageBranchesList.length);//清空数组
			//条件查询时若网络连接错误，定位失败重新定位
			if(!netMark){
				getBaiduApi();//访问百度api定位
			}else{
				plus.nativeUI.showWaiting("加载中...");
				turnPageBeginPos=1;
				queryBranches(turnPageBeginPos);
			}
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().refresh(true);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			mui('#pullrefresh').pullRefresh().refresh(true);
			mui('#pullrefresh').pullRefresh().scrollTo(0,0);//跳到列表上端 解决ios不能自动跳到列表上端问题
		}
	});
});