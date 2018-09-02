define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	
	mui.init();//预加载
	mui.plusReady(function(){//页面初始化
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();
		var certType = self.certType;
		var certNo = self.certNo;
		var temp = "2";
		
		var rateList = [];
		var length;
		
		var rateListShow = document.getElementById("rateList");
		var userName;
		var cardType;
		var cardName;
		var status;
		var CC_basic_supp_ind;
		var applyDate;
		//信用卡办卡进度查询
		creditCardAppSearch();
		function creditCardAppSearch(){
			var url = mbank.getApiURL() + 'creditCardAppSearch.do';
			mbank.apiSend('get', url, {certType:certType,certNo:certNo,temp:temp},
							querySuccess, queryError, false);
			
			function querySuccess(data){
				rateList = data.creditCardAppSearchList;
				length = rateList.length;
				makeList();
			}
			function queryError(data){
				/*var errorCode = "2";
				var errorMsg = "查询失败,请稍候再试！" 
				mbank.openWindowByLoad("creditAction_fail.html","creditAction_fail","slide-in-right",{errorCode:errorCode,errorMsg:errorMsg});*/
				mui.alert(data.em,'提示',['确定'],function(e){
					if( e.index==0 ){
						plus.webview.currentWebview().close();
					}
				});
			}
		}
		
		
		
		function makeList(){
			var rateListHtml = "";
			for(var index=0; index<length; index++){
				userName = rateList[index].userName;
				cardType = rateList[index].cardType;
				cardName = rateList[index].cardName;
				status = rateList[index].status;
				CC_basic_supp_ind = rateList[index].CC_basic_supp_ind;
				applyDate = rateList[index].applyDate;
				rateListHtml += '<div class="backbox_tit_bg">';
				rateListHtml += '<p class="backbox_tit_ico"></p><p class="backbox_tit">查询结果</p>';
				rateListHtml += '</div>';
				rateListHtml += '<div class="backbox_th p_lr10px">';
				rateListHtml += '<ul>';
				rateListHtml += '<li>';
				rateListHtml += '<span class="input_lbg">姓名：</span>';
				rateListHtml += '<span class="input_m14px" >'+userName+'</span>';
				rateListHtml += '</li>';
				rateListHtml += '<li>';
				rateListHtml += '<span class="input_lbg">卡种：</span>';
				rateListHtml += '<span class="input_m14px">'+cardType+'</span>';
				rateListHtml += '</li>';
				rateListHtml += '<li>';
				rateListHtml += '<span class="input_lbg">卡名称</span>';
				rateListHtml += '<span class="input_m14px">'+cardName+'</span>';
				rateListHtml += '</li>';
				rateListHtml += '<li>';
				rateListHtml += '<span class="input_lbg">进度</span>';
				rateListHtml += '<span class="input_m14px">'+status+'</span>';
				rateListHtml += '</li>';
				rateListHtml += '<li>';
				rateListHtml += '<span class="input_lbg">主附卡标志</span>';
				rateListHtml += '<span class="input_m14px">'+CC_basic_supp_ind+'</span>';
				rateListHtml += '</li>';
				rateListHtml += '<li>';
				rateListHtml += '<span class="input_lbg">申请日期</span>';
				rateListHtml += '<span class="input_m14px">'+applyDate.substring(0,4)+"年"+applyDate.substring(4,6)+"月"+applyDate.substring(6,8)+"日"+'</span>';
				rateListHtml += '</li>';
				rateListHtml += '</ul>';
				rateListHtml += '</div>';
			}
			rateListShow.innerHTML = rateListHtml;
		}
		
		
		
	});
});