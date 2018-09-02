define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var currentItem = "oneYear";
	var startDate;
	var endDate;
	
	var top1='111px';
	var top2='171px';
    if( mui.os.android ){
    	top1='91px';
    	top2='151px';
    }
	
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
			url:'repaymentPlanList.html',
			id:'repaymentPlanList',
			styles: {
			    top: top1,
			    bottom: '0px'
			}
		}, {
			url:'repaymentPlanList.html',
			id:'repaymentPlanListOther',
			styles: {
			    top: top2,
			    bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		plus.webview.getWebviewById("repaymentPlanList").show();
		plus.webview.getWebviewById("repaymentPlanListOther").hide();
		
		//初始化日期选择框
		initDate = function() {
			var bDate = new Date();
			bDate.setMonth(bDate.getMonth() - 1);
			var eDate = new Date();
			eDate.setMonth(eDate.getMonth() + 3);
			$("#beginDate").html(format.formatDate(bDate));
			$("#endDate").html(format.formatDate(eDate));
		}
		
		initDate();
		
	    $("#menuDiv a").on("tap",function(){
			var id = $(this).attr("id");
			if (currentItem == id) {
				return;
			}
			currentItem = id;
			var child = getShowChild(currentItem);
			setStartAndEndDate(currentItem);
			var params = {
				currentItem: currentItem,
				startDate: startDate,
				endDate: endDate
			};
			mui.fire(child, 'itemId', params);
		});
		
		//选择起始日期
		$("#changeBeginDate").on('tap', function() {
			plus.nativeUI.pickDate( function(e){
				var dStr = format.formatDate(e.date);
				var getBeginDate = dStr.replaceAll("-","");
				var getEndDate = $("#endDate").html().replaceAll("-","");
				if (getBeginDate > getEndDate) {
					mui.alert("起始日期不能大于截止日期！");
					return false;
				}
				$("#beginDate").html(dStr);
				var child = plus.webview.getWebviewById("repaymentPlanListOther");
				var params = {
					currentItem: currentItem,
					startDate: format.parseDate(getBeginDate).format("yyyy/mm/dd"),
					endDate: format.parseDate(getEndDate).format("yyyy/mm/dd")
				};
				mui.fire(child, 'itemId', params);
			});
		});
		
		//选择终止日期
		$("#changeEndDate").on('tap', function() {
			plus.nativeUI.pickDate( function(e){
				var dStr = format.formatDate(e.date);
				var getBeginDate = $("#beginDate").html().replaceAll("-","");
				var getEndDate = dStr.replaceAll("-","");
				if (getBeginDate > getEndDate) {
					mui.alert("起始日期不能大于截止日期！");
					return false;
				}
				$("#endDate").html(dStr);
				var child = plus.webview.getWebviewById("repaymentPlanListOther");
				var params = {
					currentItem: currentItem,
					startDate: format.parseDate(getBeginDate).format("yyyy/mm/dd"),
					endDate: format.parseDate(getEndDate).format("yyyy/mm/dd")
				};
				mui.fire(child, 'itemId', params);
			});
		});
		
		//侧滑切换选项卡
		window.addEventListener("changeItem", function(event){
        	var currentItem = event.detail.currentItem;
        	if (currentItem) {
	        	$("#menuDiv a").removeClass("mui-active");
				$("#" + currentItem).addClass("mui-active");
        	}
        	var child = getShowChild(currentItem);
			setStartAndEndDate(currentItem);
			var params = {
				currentItem: currentItem,
				startDate: startDate,
				endDate: endDate
			};
			mui.fire(child, 'itemId', params);
        });
        
        //获取要展示的子页面
        function getShowChild(currentItem) {
        	var child;
        	if ("other" == currentItem) {
				child = plus.webview.getWebviewById("repaymentPlanListOther");
				plus.webview.getWebviewById("repaymentPlanList").hide();
				plus.webview.getWebviewById("repaymentPlanListOther").show();
				initDate();
				$("#dateArea").show();
			} else {
				child = plus.webview.getWebviewById("repaymentPlanList");
				plus.webview.getWebviewById("repaymentPlanList").show();
				plus.webview.getWebviewById("repaymentPlanListOther").hide();
				$("#dateArea").hide();
			}
			return child;
        }
        
        //设置起止日期
        function setStartAndEndDate(currentItem) {
	    	if(currentItem == "oneYear"){
				var d = new Date();
				var s = d.getFullYear();
				startDate = s + "/01/01";
				endDate = s + "/12/31";
			}
			if(currentItem == "threeYear"){
				var d = new Date();
				var e = d.getFullYear();
				var s = e - 2;
				startDate = s + "/01/01";
				endDate = e + "/12/31";
			}
			if(currentItem == "all"){
				startDate = "0000/00/00";
				endDate = "9999/99/99";
			}
			if(currentItem == "other"){
				startDate = $("#beginDate").html().replaceAll("-","/");
				endDate = $("#endDate").html().replaceAll("-","/");
			}
        }
		
	});
});