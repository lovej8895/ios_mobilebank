define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var top='0px';
	if(!mui.os.android ){
    	top='20px';
    }
	var params;//参数列表
	var urlVar;//交易地址
	
	var areaNam = "宜昌市";//地区名称
	var areaNo = "5260";//地区编号
	var unitNam  = "";//单位名称
	var unitNo = "";//单位代码
	var UnitRW = "";//是否非税(预留)
	var CtmNo = "";//维护机构号(预留)
	var batNo = "";//批次编号
    var batSts = "";//批次状态
    var payNo = "";//缴费编号
	
	var tutionBatch = [];//批次集合
	var turnPageBeginPos = 1;//起始页
    var turnPageShowNum = 10;//每页条数
    var turnPageTotalNum;//总条数
    var currentPage = '0';//0城市；1学校
	var inputS = document.getElementById("schoolKey");
	
	//点击弹出缴费批次选择框
	var BatNoPickerList = null; 
	//页面初始化
	//允许侧滑
	mui.init({
                swipeBack: false
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
        //点击城市名弹出右侧的菜单
        document.getElementById('offCanvasShowLi').addEventListener('tap', function() {
            offCanvasWrapper.offCanvas().refresh();
            offCanvasWrapper.offCanvas('show');//显示隐藏内容
            currentPage = '0';//判断入口标志
            areaInit();//加载地区数据
            $("#offCanvasSideScroll").show();
            $("#offCanvasSideScroll_school").hide();
            inputS.blur();
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
        
        //点击返回箭头隐藏菜单
        document.getElementById('offCanvasHide').addEventListener('tap', function() {
            offCanvasWrapper.offCanvas().refresh();
            offCanvasWrapper.offCanvas('close');
            inputS.blur();
        });
        
        //点击返回箭头隐藏菜单
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
		areaInit();
		mui("#AreaNamUL").on("tap","li",function(){
			areaNam = $(this).html();
			$("#offCanvasShow").html(areaNam);
			areaNo =  $(this).attr("AreaNo");
			$("#offCanvasSideScroll").hide();
			currentPage = '1';
			schoolinit();
			$("#offCanvasSideScroll_school").show();
			inputS.blur();
		});
		
		 //点击搜索按钮
        document.getElementById('searchSchool').addEventListener('tap', function() {
           unitNam = $("#schoolKey").val().trim();//去空
           unitNam = removeAllSpace(unitNam);
           inputS.value = unitNam;
           schoolinit();
           inputS.blur();
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
				BatNoPickerList = null;
				document.getElementById("batNoPicker").innerText = "" ;
				
				return;
			}
		}
		
		mui("#UnitNamUL").on("tap","li",function(){
			unitNam = $(this).html();
			$("#schoolPicker").html(unitNam);
			unitNo =  $(this).attr("UnitNo");
			tutionBatch = [];
			queryBatNo();//查询批次
			offCanvasWrapper.offCanvas('close');
			inputS.blur();
			unitNam="";
		});
		
		function queryBatNo(){
			tutionBatch=[];
			batNo = "";
			urlVar = mbank.getApiURL()+'003008_batch_tuition.do';//交易地址
			//参数
			params = {
				"AreaNo" : areaNo,
				"UnitNo" : unitNo
			};
			//发送交易
			mbank.apiSend("post",urlVar,params,queryBatNoFunc,queryBatNoFailFunc,true);
			function queryBatNoFunc(dataBatNo){
				if(dataBatNo.ec == "000"){
					var tutionBatchA = dataBatNo.tutionBatch;
					for(var i=0;i<tutionBatchA.length;i++){
						var pickItem = {
							"value":tutionBatchA[i].BatSts,
							"text":tutionBatchA[i].BatNo
						};
						tutionBatch.push(pickItem);
					}
					BatNoInit();
				}else{
					mui.alert(dataBatNo.em,"温馨提示");
					return;
				}
			}
			function queryBatNoFailFunc(e){
				mui.alert(e.em,"温馨提示");
				return;
			}
		}
		
		//点击弹出缴费批次选择框
		function BatNoInit(){
			BatNoPickerList=new mui.SmartPicker({title:"请选择缴费批次",fireEvent:"batNoEvent"});
			BatNoPickerList.setData(tutionBatch);
			document.getElementById("batNoPicker").innerText = "请选择缴费批次" ;
		}
		
		document.getElementById("batNoLi").addEventListener("tap",function(){
				if(BatNoPickerList != null){
					BatNoPickerList.show();
				}else{
					mui.alert("请先选择缴费单位","温馨提示");
				}
			},false);
			
		//选择项的点击事件
		window.addEventListener("batNoEvent",function(event){
			batNo = event.detail.text;
			batSts = event.detail.value;
			document.getElementById("batNoPicker").innerText = event.detail.text;
        });
		
		//下拉刷新
		pulldownfresh = function(pullRefreshElVal,selfVal){
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
		
		//上拉加载
		pullupRefresh = function(pullRefreshElVal,selfVal){
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
		
		document.getElementById("queryBtn").addEventListener("tap",function(){
			payNo = document.getElementById("payNoInput").value.trim();//缴费编号
			payNo = removeAllSpace(payNo);
			document.getElementById("payNoInput").value = payNo;
			payNo = payNo.toUpperCase();
			if(areaNo == null || areaNo =="" || areaNo == undefined){
				mui.alert("请选择缴费地区","温馨提示");
				return;
			}
			
			if(unitNo == null || unitNo =="" || unitNo == undefined){
				mui.alert("请选择缴费单位","温馨提示");
				return;
			}
			
			if(batNo == null || batNo =="" || batNo == undefined){
				mui.alert("请选择缴费批次","温馨提示");
				return;
			}
			
			if(payNo == null || payNo =="" || payNo == undefined){
				mui.alert("请输入正确的缴费编号","温馨提示");
				return;
			}
			params = {
				"AreaNam": areaNam,
				"AreaNo" : areaNo,
				"UnitNam" : unitNam,
				"UnitNo" : unitNo,
				"BatNo" : batNo,
				"BatSts" : batSts,
				"payNo" : payNo
			};
			mbank.openWindowByLoad('../feePayment/tuitionPayHistoryList.html','tuitionPayHistoryList','slide-in-right',params);
			
		},false);
		
		mbank.resizePage(".btn_bg_f2");
		
	});
});