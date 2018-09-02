define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	
	var cst_certNo = localStorage.getItem("session_certNo");//证件号码
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    var iAccountInfoList = [];
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
	function pulldownfresh(){
		setTimeout(function() {
			turnPageBeginPos=1;
			queryCustomerInfoList(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = jQuery('#detail li').length;
			if(currentNum >= turnPageTotalNum) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryCustomerInfoList(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
		}, 800);
	}
	queryCustomerInfoList = function(pagebogVar){
			var params ={
				f_cust_type:"1",
				f_id_code:cst_certNo,
				turnPageBeginPos:pagebogVar,
				turnPageShowNum:turnPageShowNum
			};
			var url = mbank.getApiURL() + 'queryCustSignInfo.do';
			mbank.apiSend("post",url,params,successCallback,errorCallback,false);
			function successCallback(data){
				var tempMesHtml ="";
				var dataVal ="";
				turnPageTotalNum = data.turnPageTotalNum;
				if( pagebogVar == 1 ){
			       	$("#detail").empty();
			       	if( turnPageTotalNum=='0' ){
			       		plus.nativeUI.closeWaiting();//关闭系统等待对话框
						$("#showMsgDiv").empty();
						$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
					    $("#showMsgDiv").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
					    $("#showMsgDiv").show();
			       		$("#pullRefresh").hide();
					    mui('#pullRefresh').pullRefresh().setStopped(true);//禁止上下拉
		       	   }
			   }
				var isExit = false;//基金账户是否在个人账号列表中存在
				for (var i = 0; i < data.f_iCustSignInfoList.length; i++) {
					var currObj = data.f_iCustSignInfoList[i];
					isExit = false;
					for(var j = 0;j<iAccountInfoList.length;j++){
							if(currObj.f_deposit_acct == iAccountInfoList[j].accountNo){
							isExit = true;
						}
					}
					if (currObj.f_cust_status == '0' && (currObj.f_open_busin_yeb == 5 || currObj.f_open_busin == 3)&& isExit &&(currObj.f_sign_status ==1 || currObj.f_sign_status ==3)) {
						dataVal = currObj.f_cust_name+"&"+currObj.f_cust_type+"&"+currObj.f_id_type+"&"+currObj.f_id_code+"&"+currObj.f_telno+"&"+currObj.f_mobile_telno+"&"+currObj.f_post_code+"&"+currObj.f_email+"&"+currObj.f_address+"&"+currObj.f_investor_birthday+"&"+currObj.f_sex+"&"+currObj.f_risk_end_date+"&"+currObj.f_open_busin+"&"+currObj.f_open_busin_yeb+"&"+currObj.f_sign_status+"&"+currObj.f_cust_risk+"&"+currObj.f_deposit_acct+"&"+currObj.f_cust_status+"&"+currObj.f_deliver_type+"&"+currObj.f_deliver_way+"&"+currObj.f_faxno;
						tempMesHtml += '<li signAccInfo="'+dataVal+'">';
						tempMesHtml += '<p class="color_6">签约账号</p>';
						tempMesHtml += '<p class="fz_15">'+format.dealAccountHideFour(currObj.f_deposit_acct)+'</p>';
						tempMesHtml += '<div class="content_rbox">';
						if (currObj.f_cust_status == '0') {
							tempMesHtml += '<p class="color_6">正常</p>';
						}else if(currObj.f_cust_status == '1'){
							tempMesHtml += '<p class="color_6">销户</p>';
						}
						tempMesHtml += '<p class="fz_12 color_9">状态</p>';
						tempMesHtml += '</div>';
						tempMesHtml += '<a class="link_rbg2"></a>';
						tempMesHtml += '</li>';
					
					}
				}
				$("#detail").append(tempMesHtml);
				plus.nativeUI.closeWaiting();
				
				//点击账户跳转到一下页
				$("ul li").on("tap",function(){
					var signAccInfo=$(this).attr("signAccInfo");
					
					var showf_cust_name = signAccInfo.split("&")[0];
					var showf_cust_type = signAccInfo.split("&")[1];
					var showf_id_type = signAccInfo.split("&")[2];
					var showf_id_code = signAccInfo.split("&")[3];
					var showf_telno = signAccInfo.split("&")[4];
					var showf_mobile_telno = signAccInfo.split("&")[5];
					var showf_post_code = signAccInfo.split("&")[6];
					var showf_email = signAccInfo.split("&")[7];
					var showf_address = signAccInfo.split("&")[8];
					var showf_investor_birthday = signAccInfo.split("&")[9];
					var showf_sex = signAccInfo.split("&")[10];
					var showf_risk_end_date = signAccInfo.split("&")[11];
					var showf_open_busin = signAccInfo.split("&")[12];
					var showf_open_busin_yeb = signAccInfo.split("&")[13];
					var showf_sign_status = signAccInfo.split("&")[14];
					var showf_cust_risk = signAccInfo.split("&")[15];
					var showf_deposit_acct = signAccInfo.split("&")[16];
					var showf_cust_status = signAccInfo.split("&")[17];
					var showf_deliver_type = signAccInfo.split("&")[18];
					var showf_deliver_way = signAccInfo.split("&")[19];
					var f_faxno = signAccInfo.split("&")[20];
					
					var params1 = {
						f_cust_name: showf_cust_name,
						f_cust_type: showf_cust_type,
						f_id_type: showf_id_type,
						f_id_code: showf_id_code,
						f_telno: showf_telno,
						f_mobile_telno: showf_mobile_telno,
						f_post_code: showf_post_code,
						f_email: showf_email,
						f_address: showf_address,
						f_investor_birthday: showf_investor_birthday,
						f_sex: showf_sex,
						f_risk_end_date: showf_risk_end_date,
						f_open_busin: showf_open_busin,
						f_open_busin_yeb: showf_open_busin_yeb,
						f_sign_status: showf_sign_status,
						f_cust_risk: showf_cust_risk,
						f_deposit_acct: showf_deposit_acct,
						f_cust_status: showf_cust_status,
						f_deliver_type: showf_deliver_type,
						f_deliver_way: showf_deliver_way,
						f_faxno: f_faxno
					};
					mbank.openWindowByLoad('../fund/signInfoChange_Input.html','signInfoChange_Input','slide-in-right',params1);
				});
			}
			function errorCallback(e){
				$("#detail").empty();
	    		$("#showMsgDiv").empty();
				plus.nativeUI.closeWaiting();
				if (e.ec == "3112") {
					$("#showMsgDiv").append('<p class="fz_15 text_m">未获取到客户签约信息 </p>');
				} else{
					$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
			    	$("#showMsgDiv").append('<p class="fz_15 text_m">' + e.em + ' </p>');
				}
			    $("#showMsgDiv").show();
			    $("#pullRefresh").hide();
			    mui('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
				//mui.alert(e.em);
				//return;
			}
		}
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		plus.nativeUI.showWaiting("加载中...");
//		if( mui.os.android ){
//  		$("#pullrefresh").attr("style","margin-top: 40px");
//  	}

		queryDefaultAcct();
		//获取绑定账号列表
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				var length = data.length;
				if(length > 0) {
					iAccountInfoList = data;
				}
			}
		}
		//查询签约客户信息
		queryCustomerInfoList(1);
		
	});
});
