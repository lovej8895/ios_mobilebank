define(function(require, exports, module) {
	var doc = document;
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	//类别
	var typeList = [{'key':'聚会','value':'0'},
					{'key':'会议','value':'1'},
					{'key':'节日','value':'2'},
					{'key':'其他','value':'3'}
					];
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		
		var sessioncustomerId = localStorage.getItem("session_customerId");
		var self = plus.webview.currentWebview(); 
		//获取上一个页面传过来的参数，用于确认是第几条数据
		var getType = self.type;
		var getTopic = self.topic;
		var getDateTime = self.dateTime;
		var getRemark = self.remark;
        var typeText;
        for(i=0;i<typeList.length;i++){
        	if(typeList[i].value==getType){
        		typeText=typeList[i].key;
        	}
        }
	
		
		var allAffairList = [];
		var sessioncustomerId = localStorage.getItem("session_customerId");
		var length = 0;
		var topic = doc.getElementById("topic");
		var type = doc.getElementById("type");
		var dateTime = doc.getElementById("dateTime");
		var remark = doc.getElementById("remark");
		
		type.innerText = typeText;
		topic.innerText = getTopic;
		dateTime.innerText = format.dataToDate(getDateTime);
		remark.innerText = getRemark;
		
		doc.getElementById('delRemind_Success').addEventListener("tap",function(){
			mui.confirm("确认删除？", "提示", ["确认", "取消"], function(e) {	
				if(e.index == 0){
					deleteAffair();
				}
			});
		});
		
		doc.getElementById('affairDetailBack').addEventListener("tap",function(){
			mui.back();
		}, false);
		
		deleteAffair = function(){
			var delParam = {
				affairTime : self.affairTime
			};
			var url =  mbank.getApiURL() + 'ebankDeleteAffair.do';
			
			mbank.apiSend('post', url, delParam, delSuccess, delError, true,false);
			
			
		};
        	
		function delSuccess(){
			//跳转下一页面，如果需要结果页面可注释下面的，放开这段代码
			/*var delBt = doc.getElementById("delRemind_Success");
			var noCheck = delBt.getAttribute("noCheck");
			var path = delBt.getAttribute("path");
			var id = delBt.getAttribute("id");
			mbank.openWindowByLoad(path, id,"slide-in-right",{noCheck:noCheck});*/
			if(plus.webview.getWebviewById('affairRemind')){
				mui.fire(plus.webview.getWebviewById("affairRemind"),"reload",{});
			}
  			mui.alert("删除提醒成功","温馨提示","确认",function(){
				plus.webview.currentWebview().close();
			});
		}
			
		function delError(){
				mui.alert("删除失败");
			}
		
		
	});	
});