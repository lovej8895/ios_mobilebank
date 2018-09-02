define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var top='0px';
	if(!mui.os.android ){
    	top='20px';
    }
	
	var chargeType = "000000010021010";//交易类型码
	var params;//参数列表
	var urlVar;//交易地址
	
	var areaNam = "宜昌市";//地区名称
	var areaNo = "5260";//地区编号
	var unitNam  = "";//单位名称
	var unitNo = "";//单位代码
	var UnitRW = "";//是否非税(预留)
	var CtmNo = "";//维护机构号(预留)
	
	var turnPageBeginPos = 1;//起始页
    var turnPageShowNum = 10;//每页条数
    var turnPageTotalNum;//总条数
    var currentPage = '0';//0城市；1学校
	
	var inputS = document.getElementById("schoolKey");
	//页面初始化
	//允许侧滑
	mui.init({
				swipeBack: false,
			});
	//进页面加载
	mui.plusReady(function() {
		//屏幕方向
		plus.screen.lockOrientation("portrait-primary");
	    //侧滑容器父节点
        var offCanvasWrapper = mui('#offCanvasWrapper');
         //主界面容器
        var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
         //菜单容器
        var offCanvasSide = document.getElementById("offCanvasSide");
        offCanvasSide.style.top=top;
         //Android暂不支持整体移动动画
         //IOS的整体移动动画
        /*if (!mui.os.android) {
            document.getElementById("move-togger").classList.remove('mui-hidden');
            var spans = document.querySelectorAll('.android-only');
            for (var i = 0, len = spans.length; i < len; i++) {
                spans[i].style.display = "none";
            }
        }*/
        
        //点击城市名弹出右侧的菜单
        document.getElementById('offCanvasShowLi').addEventListener('tap', function() {
            offCanvasWrapper.offCanvas().refresh();
            offCanvasWrapper.offCanvas('show');//显示隐藏内容
            currentPage = '0';//判断入口标志
            areaInit();//加载地区数据
            $("#offCanvasSideScroll").show();
            inputS.blur();
            $("#offCanvasSideScroll_school").hide();
        });
        
        //点击缴费单位弹出右侧的菜单
        document.getElementById('changeArea').addEventListener('tap', function() {
            offCanvasWrapper.offCanvas().refresh();
            offCanvasWrapper.offCanvas('show');
            schoolinit();
            currentPage = '1';
            $("#offCanvasSideScroll").hide();
            $("#offCanvasSideScroll_school").show();
        });
        
        //点击缴费地区返回箭头隐藏菜单
        document.getElementById('offCanvasHide').addEventListener('tap', function() {
            offCanvasWrapper.offCanvas().refresh();
            offCanvasWrapper.offCanvas('close');
            inputS.blur();
        });
        
        //点击缴费单位返回箭头隐藏菜单
        document.getElementById('offCanvasHide_school').addEventListener('tap', function() {
            offCanvasWrapper.offCanvas().refresh();
            offCanvasWrapper.offCanvas('close');
            inputS.blur();
        });
        
         //主界面和侧滑菜单界面均支持区域滚动；
        mui('#offCanvasSideScroll').scroll();
        mui('#offCanvasContentScroll').scroll();
        
        mui('#offCanvasSideScroll_school').scroll();
        
         //实现ios平台的侧滑关闭页面；
        if (mui.os.plus && mui.os.ios) {
            offCanvasWrapper[0].addEventListener('shown', function(e) { //菜单显示完成事件
                plus.webview.currentWebview().setStyle({
                    'popGesture': 'none'
                });
            });
            offCanvasWrapper[0].addEventListener('hidden', function(e) { //菜单关闭完成事件
                plus.webview.currentWebview().setStyle({
                    'popGesture': 'close'
                });
            });
        }
        
		checkChargeStatus();
		
		//检查是否开通了缴费功能
		function checkChargeStatus(){
			urlVar = mbank.getApiURL()+'003005_checkStatus.do';
			mbank.apiSend("post",urlVar,"",checkStatusSucFunc,checkStatusFailFunc,true);
			function checkStatusSucFunc(data){
				if(data.ec == "000"){
					var checkStatus = data.status;
					if (checkStatus == '0' || checkStatus == null || checkStatus == undefined || checkStatus =="") {
						mui.alert("您尚未开通缴费功能，请前往开通页面!","温馨提示","确认",function(){
							params = {
								"intoFlag":"1"
							};
							mbank.openWindowByLoad('../feePayment/feePaymentSet.html','feePaymentSet','slide-in-right',"");
						});
					}
					areaInit();
				}else{
					mui.toast(data.em);
					plus.webview.currentWebview().close();
				}
			}
			function checkStatusFailFunc(e){
				mui.toast(e.em);
				plus.webview.currentWebview().close();
			}
		}
		
		areaInit = function(){
			//地区参数，默认为空
			params = {
				"turnPageBeginPos" : turnPageBeginPos,
				"turnPageShowNum" : turnPageShowNum
			};
			urlVar = mbank.getApiURL()+'003008_city_tuition.do';//查询城市
			mbank.apiSend("post",urlVar,params,searchAreaSucFunc,searchAreaFailFunc,true);
			function searchAreaSucFunc(dataArea){
				if(dataArea.ec =="000"){
					var areaList = dataArea.AllRec;
					if( turnPageBeginPos==1 ){
			       		jQuery("#AreaNamUL").empty();
			    	}
					turnPageTotalNum = dataArea.turnPageTotalNum;
					var str = '';
					for(var i=0;i<areaList.length;i++){
						str+='<li class="mui-table-view-cell" AreaNo = "'+areaList[i].AreaNo+'">'+areaList[i].AreaNam+'</li>';
					}
					jQuery("#AreaNamUL").append(str);
//					$("#AreaNamUL").html(str);
				}else{
					mui.alert(dataArea.em,"温馨提示");
					return;
				}
			}
			function searchAreaFailFunc(e1){
				//mui.alert(e1.em,"温馨提示");
				mui.alert("服务器连接失败，请稍后重试!","温馨提示");
				return;
			}
		}
		
		mui("#AreaNamUL").on("tap","li",function(){
			areaNam = $(this).html();
			$("#offCanvasShow").html(areaNam);
			areaNo =  $(this).attr("AreaNo");
			$("#offCanvasSideScroll").hide();
			currentPage = '1';
			schoolinit();
			$("#offCanvasSideScroll_school").show();
		});
		
		 //点击搜索按钮
        document.getElementById('searchSchool').addEventListener('tap', function() {
	        unitNam = inputS.value.trim();//去空
	        unitNam = removeAllSpace(unitNam);
	        inputS.value = unitNam;
	        schoolinit();
	        inputS.blur();//失焦事件
	        unitNam="";
        });
		
		//去除空格
		function removeAllSpace(str){
			return str.replace(/\s|\xA0/g,"");
		}
		
		
		schoolinit = function(){
			params = {
				"AreaNo" :areaNo,
				"UnitNam" :unitNam
			};
			
			urlVar = mbank.getApiURL()+'003008_school_tuition.do';//查询城市
			mbank.apiSend("post",urlVar,params,searchSchoolSucFunc,searchSchoolFailFunc,true);
			function searchSchoolSucFunc(dataSchool){
				if(dataSchool.ec =="000"){
					$("#searchFailDiv").hide();
					$("#UnitNamUL").show();
					var unitNamList = dataSchool.tutionSchool;
					var str='';
					for(var i=0;i<unitNamList.length;i++){
						str+='<li class="mui-table-view-cell" UnitNo="'+unitNamList[i].UnitNo+'">'+unitNamList[i].UnitNam+'</li>';
					}
					$("#UnitNamUL").html(str);
				}else{
					mui.alert(dataSchool.em,"温馨提示");
					$("#searchFailDiv").show();
					$("#UnitNamUL").hide();
					return;
				}
			}	
			
			function searchSchoolFailFunc(e1){
				mui.alert(e1.em,"温馨提示");
				$("#searchFailDiv").show();
				$("#UnitNamUL").hide();
				
				$("#schoolPicker").html("");
				unitNo = "";
				
				return;
			}
		}
		
		document.getElementById("chargeSet").addEventListener("tap",function(){
			mbank.openWindowByLoad('../feePayment/feePaymentSet.html','feePaymentSet','slide-in-right',"");
		},false);
		
		document.getElementById("chargeHistoryQuery").addEventListener("tap",function(){
			mbank.openWindowByLoad('../feePayment/tuitionPayHistoryQuery.html','tuitionPayHistoryQuery','slide-in-right',"");
		},false);
		
		mui("#UnitNamUL").on("tap","li",function(){
			unitNam = $(this).html();
			$("#schoolPicker").html(unitNam);
			unitNo =  $(this).attr("UnitNo");
			params = {
				"chargeType":chargeType,
				"areaNam":areaNam,
				"areaNo":areaNo,
				"unitNam":unitNam,
				"unitNo":unitNo
			};
			
			inputS.blur();//失焦事件
			//延时加载下一页
			setTimeout(function(){
				mbank.openWindowByLoad('../feePayment/tuitionFeePayInput.html','tuitionFeePayInput','slide-in-right',params);
				//offCanvasWrapper.offCanvas('close');
			},10);
			unitNam="";
		});
		
		pulldownfresh = function(pullRefreshElVal,selfVal){//下拉刷新
			setTimeout(function(){
				turnPageBeginPos=1;
				/*if(currentPage =='0'){
					areaInit();
				}else{
					schoolinit();
				}*/
				selfVal.endPulldownToRefresh();
				selfVal.endPullupToRefresh();
			},1000);
			selfVal.refresh(true);
		}
		pullupRefresh = function(pullRefreshElVal,selfVal){//上拉加载
			setTimeout(function(){
				var currentNum;
				if(currentPage =='0'){
					currentNum = jQuery('#AreaNamUL li').length;
				}else{
					currentNum = jQuery('#UnitNamUL li').length;
				}
				if(currentNum >= turnPageTotalNum) {
					selfVal.endPullupToRefresh(true);
					setTimeout(function(){
						selfVal.disablePullupToRefresh();
						setTimeout(function(){
							selfVal.enablePullupToRefresh();
						},1000);
					},2000);
					return;
				}
				turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
				/*if(currentPage =='0'){
					areaInit();
				}else{
					schoolinit();
				}*/
				selfVal.endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
			},1000);
		}
	});
});