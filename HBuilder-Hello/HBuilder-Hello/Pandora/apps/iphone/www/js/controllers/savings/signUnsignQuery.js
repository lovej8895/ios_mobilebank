define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	//绑定账号列表
	var iAccountInfoList = [];
	var accountPickerList=[];
    var accountPicker;
	//当前选定账号
	var currentAcct="";
	mui.init();
	var beginDate="";
    var endDate="";	


	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();		
		queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
				}
			}
		}
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value:i,
						text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择账号",fireEvent:"pickAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changeAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();	
		});	
        window.addEventListener("pickAccount",function(event){
                var pickItem=event.detail;			
				currentAcct=iAccountInfoList[pickItem.value].accountNo;
				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
        });	

        $("input[name='timeRadio']").on("change",function(){
        	var timeRadio=$("input[name='timeRadio']:checked").val();
        	if( timeRadio=="2" ){
        		$("#beginDateLi").show();
        		$("#endDateLi").show();
        	}else{
        		$("#beginDateLi").hide();
        		$("#endDateLi").hide();        		
        	}
        });
        
        $("#beginDateLi").on("tap",function(){
			plus.nativeUI.pickDate( function(e){
				beginDate=format.formatDate(e.date);
                $("#beginDate").html(beginDate);
		    },function(e){
			    
			});	
        });        
		
        $("#endDateLi").on("tap",function(){
			plus.nativeUI.pickDate( function(e){
				endDate=format.formatDate(e.date);
                $("#endDate").html(endDate);
		    },function(e){
			    
			});	
        }); 		
		
		$("#queryButton").on("tap",function(){
			var timeRadio=$("input[name='timeRadio']:checked").val();
			var nowDate=new Date();
			if( timeRadio=="0" ){
        	    endDate=format.formatDate(nowDate);
        	    beginDate=format.formatDate(format.addDay(nowDate,-7));
        	}
			if( timeRadio=="1" ){
        	    endDate=format.formatDate(nowDate);
        	    beginDate=format.formatDate(format.addDay(nowDate,-30));
        	}
        	if( timeRadio=="2" ){
        		if( $("#beginDate").html()=="请选择开始日期" ){
        			mui.alert("请选择开始日期！");
        			return false;
        		}
         		if( $("#endDate").html()=="请选择结束日期" ){
        			mui.alert("请选择结束日期！");
        			return false;
        		} 
        		if( beginDate>endDate ){
        			mui.alert("开始日期不能大于结束日期");
        			return false;
        		}
        		if( beginDate>format.formatDate(nowDate) ){
        			mui.alert("开始日期不能晚于当前日期");
        			return false;
        		}
        	}

			var param={
				accountNo:currentAcct,
				beginDate:beginDate,
				endDate:endDate
			};
			mbank.openWindowByLoad('../savings/signUnsignList.html','signUnsignList','slide-in-right',param);
		});

	});

});
