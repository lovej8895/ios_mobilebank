/*
 * 已出账单查询结果：
 * 1.信用卡帐号查询
 * 2.根据帐号与时间进行查询
 */
define(function(require, exports, module) {
	var doc = document;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');


	mui.init();
	mui.plusReady(function() {	
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var state = app.getState();
		var self = plus.webview.currentWebview(); 
		var sessioncustomerId = localStorage.getItem("session_customerId");
		
		var type = doc.getElementById("type");
		var points = doc.getElementById("points");
		var deadLine = doc.getElementById("deadLine");
		var showPointList = doc.getElementById("showPointList");
		
		//上送信息
		var certNo = localStorage.getItem("session_certNo");
		var certType = localStorage.getItem("session_certType");
		//接收数据定义
		var pointList = [];
		var currPoint;
		var length;
		var turnPageTotalNum;
		var rlp_type;
		var card_no;
		var avalid_points;
		var loyalty_dura;
		//mui.alert(certNo+"111");
		//mui.alert(certType);
		queryPoints();
		function queryPoints(){
			var url = mbank.getApiURL() + '007081_pointQuery.do';
			var params = {
				certNo:certNo,
				certType:certType,
				
			};
			mbank.apiSend('post', url, params,querySuccess,queryError,false);
		
			function querySuccess(data){
				//mui.alert(data.pointQueryList.length);
				pointList = data.pointQueryList;
				length = pointList.length;
				var showHtml = "";
				//mui.alert(length);
				for(var index=0; index<length; index++){
					currPoint = pointList[index];
					showHtml += '<div class="backbox_tit_bg">';
					showHtml += '<p class="backbox_tit_ico"></p><p class="backbox_tit">查询结果</p>';
					showHtml += '</div>';
					showHtml += '<div class="backbox_th p_lr10px">';
					showHtml += '<ul>';
					showHtml += '<li>';
					showHtml += '<span class="input_lbg">积分类型</span><span class="input_m14px">'+currPoint.rlp_type+'</span>';
					showHtml += '</li>';
					showHtml += '<li>';
					showHtml += '<span class="input_lbg">可用积分</span><span class="input_m14px">'+currPoint.avalid_points+'</span>';
					showHtml += '</li>';
					showHtml += '<li>';
					showHtml += '<span class="input_lbg">积分到期日</span><span class="input_m14px">'+currPoint.loyalty_dura+'</span>';
					showHtml += '</li>';
					showHtml += '</ul>';
					showHtml += '</div>';
					
//					showHtml += '<div class="backbox_tit_bg">';
//					showHtml += '<p class="backbox_tit_ico"></p>';
//					showHtml += '</div>';
//					showHtml += '<div class="backbox_th p_lr10px" >';
//					showHtml += '<ul>';
//					showHtml += '<li class="form-item">';
//					showHtml += '<div class="col-xs-6"><span class="input_m14px">积分类型</span></div>';
//					showHtml += '<span class="input_m14px" >'+currPoint.rlp_type+'</span>';
//					showHtml += '</li>';
//					showHtml += '<li class="form-item">';
//					showHtml += '<div class="col-xs-6"><span class="input_m14px">可用积分</span></div>';
//					showHtml += '<span class="input_m14px">'+currPoint.avalid_points+'</span>';
//					showHtml += '</li>';
//					showHtml += '<li class="form-item">';
//					showHtml += '<div class="col-xs-6"><span class="input_m14px">积分到期日</span></div>';
//					showHtml += '<span class="input_m14px" id="">'+currPoint.loyalty_dura+'</span>';
//					showHtml += '</li>';
//					showHtml += '</ul>';
//					showHtml += '</div>';
				}
				showPointList.innerHTML = showHtml;
			}
			
			function queryError(data){
				/*var errorCode = "19";
				var errorMsg = data.em;
				mbank.openWindowByLoad("creditAction_fail.html", "creditAction_fail","slide-in-right",{errorCode:errorCode,errorMsg:data.em});*/
				plus.nativeUI.toast(data.em);
				//mui.back();
			}
		}
		
		var back = doc.getElementById("pointQueryBack");
		back.addEventListener('tap',function(){
			mui.back();
		});
	});
});