define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var iAccountInfoList = [];
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var self = plus.webview.currentWebview();
		var allBondsList = self.paramStr;
		var ibiBondsNo = allBondsList.ibiBondsNo;//票券编号
		var ibiBranchNo = allBondsList.ibiBranchNo;//批次号
		var ibiBondsType = allBondsList.ibiBondsType;//票券类型（1、满减券；2抵用券；3、兑换券）
		var ibiBondsSize = allBondsList.ibiBondsSize;//票券面额
		var ibiBondsUnit = allBondsList.ibiBondsUnit;//票券单位
//		var ibiBondsSizeShow =allBondsList.ibiBondsSizeShow;
		var ibiBrokerNo = allBondsList.ibiBrokerNo;//券商编号
		var ibiBrokerId = allBondsList.ibiBrokerId;//券商信息id（关联IM_MOBILE_BANK_BROKER_INFO表）
		var ibiEffectiveDateBegin = allBondsList.ibiEffectiveDateBegin;//有效期（yyyymmdd）开始
		var ibiEffectiveDateEnd = allBondsList.ibiEffectiveDateEnd;//有效期（yyyymmdd）截止日期
		var ibiUpdateDate = allBondsList.ibiUpdateDate;//票券更新时间
		var ibiProvideNo = allBondsList.ibiProvideNo;//发放票券人工号 
		var ibiProvideDate = allBondsList.ibiProvideDate;//发放时间
		var ibiCustNo = allBondsList.ibiCustNo;//网银客户号（用于票券和用户的绑定）
					
		var ibiBrokerName = allBondsList.ibiBrokerName;//券商名称 
		var ibiBondsTitle = allBondsList.ibiBondsTitle;//票券标题（列表展示用）
		var ibiBondsDesc = allBondsList.ibiBondsDesc;//票券描述（列表展示用）
		var ibibrokerLogoAdd = allBondsList.ibibrokerLogoAdd;//券商logo地址 
		var ibiBrokerAdd = allBondsList.ibiBrokerAdd;//票券使用地址
		var ibiBondsDetailTitle1 = allBondsList.ibiBondsDetailTitle1;//票券详细情况标题（详情页面用）
		var ibiBondsDetailDesc1 = allBondsList.ibiBondsDetailDesc1;//票券详细情况描述（详情页面用） 
		var ibiBondsDetailTitle2 = allBondsList.ibiBondsDetailTitle2;//票券详细情况标题（详情页面用）
		var ibiBondsDetailDesc2 = allBondsList.ibiBondsDetailDesc2;//票券详细情况描述（详情页面用）
		var ibiBondsDetailTitle3 = allBondsList.ibiBondsDetailTitle3;//票券详细情况标题 （详情页面用）
		var ibiBondsDetailDesc3 = allBondsList.ibiBondsDetailDesc3;//票券详细情况描述（详情页面用）
		
		var ibibrokerLogoAddUrl = jQuery.param.getReMoteUrl("REMOTE_URL_ADDR")+"perbank/mbank/img/"+ibibrokerLogoAdd;
		
		ibiEffectiveDateBegin = format.dataToDate(ibiEffectiveDateBegin);//格式化日期，把YYYYMMDD转换YYYY-MM-DD
		ibiEffectiveDateEnd = format.dataToDate(ibiEffectiveDateEnd);//格式化日期，把YYYYMMDD转换YYYY-MM-DD
					
		var ibiBondsSizeShow;
		var ibiBondsTypeShow;
		   
			if(ibiBondsUnit != '元'){
				ibiBondsSizeShow = ibiBondsSize + ibiBondsUnit;
			}else{
				ibiBondsSizeShow = '¥' + ibiBondsSize;
				ibiBondsTypeShow = ibiBondsType;
			}
		
		document.getElementById("ibibrokerLogoAddUrl").src = ibibrokerLogoAddUrl;
		document.getElementById("ibiBondsType").innerHTML = ibiBondsTypeShow;
		document.getElementById("ibiEffectiveDateBegin").innerHTML = ibiEffectiveDateBegin;
		document.getElementById("ibiEffectiveDateEnd").innerHTML = ibiEffectiveDateEnd;
		document.getElementById("ibiBrokerName").innerHTML = ibiBrokerName;
		document.getElementById("ibiBondsNo").innerHTML = "票券编号："+ibiBondsNo;
		
		if((ibiBondsDetailTitle1 == '' || ibiBondsDetailTitle1 == null) && (ibiBondsDetailTitle2 == '' || ibiBondsDetailTitle2 == null) && (ibiBondsDetailTitle3 == '' || ibiBondsDetailTitle3 == null) ){
			document.getElementById("title_ul").style.display = "block";
		}
		
		if(ibiBondsDetailTitle1 == '' || ibiBondsDetailTitle1 == null){
			document.getElementById("title1").style.display = 'none';
		}else{
			document.getElementById("title1").style.display = 'block';
			document.getElementById("ibiBondsDetailTitle1").innerHTML = ibiBondsDetailTitle1;
			document.getElementById("ibiBondsDetailDesc1").innerHTML =dataReplace(ibiBondsDetailDesc1);
		}
		if(ibiBondsDetailTitle2 == '' || ibiBondsDetailTitle2 == null){
			document.getElementById("title2").style.display = 'none';
		}else{
			document.getElementById("title2").style.display = 'block';
			document.getElementById("ibiBondsDetailTitle2").innerHTML = ibiBondsDetailTitle2;
			document.getElementById("ibiBondsDetailDesc2").innerHTML = dataReplace(ibiBondsDetailDesc2);
		}
		if(ibiBondsDetailTitle3 == '' || ibiBondsDetailTitle3 == null){
			document.getElementById("title3").style.display = 'none';
		}else{
			document.getElementById("title3").style.display = 'block';
			document.getElementById("ibiBondsDetailTitle3").innerHTML = ibiBondsDetailTitle3;
			document.getElementById("ibiBondsDetailDesc3").innerHTML = dataReplace(ibiBondsDetailDesc3);
		}
//		document.getElementById("ibiBondsSize").innerHTML = ibiBondsSize + ibiBondsUnit;
		document.getElementById("ibiBondsSize").innerHTML = ibiBondsSizeShow;
	});
	
	function dataReplace(content){
			var flag=true;
			while(flag){
				content=content.replace("|","<br />");
				var index=content.indexOf("|");
				if(index == -1)
				{
			  		flag=false;	
				}
			}
			return content;
		} 
});