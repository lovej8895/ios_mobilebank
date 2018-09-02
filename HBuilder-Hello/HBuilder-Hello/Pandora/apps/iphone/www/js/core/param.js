
/**
 * jQuery param - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 *
 */
 
(function( $, undefined ) {
	
	$.param = $.param || {};
	
	$.extend( $.param, {
		RUNTIME_ENVIROMENT:true, //运行的环境，true：生产环境，false:测试环境 ，目前只用于广告图片地址切换
		
		SOFTPWD_SWITCH:true,//密码键盘开关
		
		SIGNAUTH_SWITCH:true,//安全认证控件开关
		
		ADD_SWITCH:false,//是否开启广告页面
		
		QRCODE_APPID:"MBBK",//二维码支付上送应用ID:appId
		
		BANK_LOGO: {
		'102':'102.png',//'中国工商银行'  ,
		'103':'103.png',//'中国农业银行'  ,
		'104':'104.png',//'中国银行'  ,
		'105':'105.png',//'中国建设银行'  ,
		'301':'301.png',//'交通银行'  ,
		'302':'302.png',//'中信实业银行'  ,
		'303':'303.png',//'中国光大银行'  ,
		'304':'304.png',//'华夏银行'  ,
		'305':'305.png',//'中国民生银行'  ,
		'306':'306.png',//'广东发展银行'  ,
		'308':'308.png',//'招商银行'  ,
		'309':'309.png',//'兴业银行'  ,
		'310':'310.png',//'上海浦东发展银行'  ,
		'401':'401.png',//'城市信用合作社'  ,
		'402':'402.png',//'农村信用合作社'  ,
		'403':'403.png',//'国家邮政局邮政储汇' ,
		'783':'783.png'//'平安银行有限责任公司'  ,
	    },
	     		
		BUSINESS_CODE:{
			'20' : '认购',
			'22' : '申购',
			'24' : '赎回',
			'25' : '预约赎回',
			'26' : '一步转托管',
			'27' : '转托管转日',
			'28' : '转托管转出',
			'29' : '分红方式变更',
			'36' : '转换',
			'39' : '定期定额申购',
			'59' : '定投开通',
			'60' : '定投终止',
			'61' : '定投修改',
			'64' : '定投暂停',
			'65' : '定投恢复',
			'98' : '快速赎回',
			'142': '强行赎回',
			'143' : '权益分派',
			'144' : '强行调增',
			'145' : '强行调减',
			'C1' : '交易撤单'			
		},
		
		LARGE_REDEMPTION_FLAG:{
			'0' : '取消',			
			'1' : '顺延'
		},
		DIVIDEND_METHOD:{
			'0' : '红利再投',			
			'1' : '现金分红'
		},
		TRANSFER_TYPE:{
			'0' : '普通',
			'1' : '大额',
			'2' : '实时'
		},
		CURRENCY_TYPE: {
			'01' : '人民币',
			'156' : '人民币'
		},	
		TRANSFER_DEPOSIT_TYPE: {
			"00" : "活期存款",
			"016" : "教育储蓄",
			"020" : "整存整取",
			"040" : "零存整取",
			"019" : "通知存款",
			"092" : "活期存款",
			"011" : "活期存款",
			"013" : "活期存款",
			"041" : "大额存单",
			"016" : "教育储蓄"
			
		},
		SAVING_PERIOD_TYPE:{
			'0':'活期',
			'3':'三个月',
			'6':'六个月',
			'12':'一年',
			'24':'两年'	,
			'36':'三年',
			'60':'五年',
			"1" : "一天",
			"7" : "七天",
			"72":"六年"	
		},	
		SAVING_PERIOD_TYPE2:{
			'00':'活期',
			'03':'三个月',
			'06':'六个月',
			'12':'一年',
			'24':'两年'	,
			'36':'三年',
			'60':'五年',
			"01" : "一天",
			"07" : "七天"
		},		
		TRANSFER_SAVE_TYPE: {
			"0" : "否",
			"1" : "是",
			"3" : "——"
		},		
		ACCOUNTNO_STATEBANK_TYPE: {
			'0': '正常',
			'1': '注销',
			'2': '久悬户'
		},	
		DRAW_TYPE: {
			"0" : "销户支取",
			"1" : "立即支取",
			"2" : "预约支取"
		},
		DRAW_FLAG: {
			"0" : "销户支取",
			"1" : "部分支取"
		},
		SAVING_PERIOD: {
			"03" : "三个月",
			"06" : "六个月",
			"12" : "一年",
			"24" : "两年",
			"36" : "三年",
			"60" : "五年"
		},		
		NOTIFY_DEPOSIT_TYPE: {
			"01" : "一天",
			"07" : "七天"
		},	
		//主附卡标识
		BASIC_SUPPIND : {
			'B':"主卡",
			'S':"附属卡"
		},
		//智能通知存款签约状态
		SIGN_SUCCESS_FLAG: {
			'0': '已签约',
			'1': '未签约'
		},	
		INTEL_SIGN_FLAG:{
			'0':"签约",
			'1':"解约"
		},		
		CHARGEAREA_TYPE:{
			"01":"武汉市",
			"02":"宜昌市",
			"03":"五峰县",
			"05":"黄石市"
		},
		CHARGE_TYPE:{
		"000000010008010" : "水费",
		"000000010020010" : "电费",
		"000000010006010" : "手机话费",
		"000000010007010" : "中国电信费",
		"000000010018010" : "中燃燃气费",
		"000000010019010" : "ETC费",
		"000000010021010" : "学费"
		},
		AREA_CODE:{
			"E52000000" : "省内其他地区",
			"52000000" : "武汉市",
			"52000001" : "大冶市",
			"52000002" : "公安县",
			"5200014201" : "移动",
			"5200024201" : "联通",
			"5200034201" : "电信",
			"01":"武汉市",
			"02":"宜昌市",
			"03":"五峰县",
			"05":"黄石市"
		},
		PAY_TYPE:{
			"D4" : "水费",
			"D1" : "电费",
			"I1" : "手机话费"
		},
		TRAN_CHANNEL: {
			'M':'中间业务',
			'A':'自动',
			'1':'柜面',
			'3':'ATM',
			'C':'信用卡',
			'D':'他代本D',
			'I':'网银',
			'J':'手机银行',
			'E':'电话银行',
			'K':'ATM',
			'X':'IC卡',
			'Y':'银联',
			'7':'他代本7',
			'L':'信贷',
			'Q':'信贷',
			'S':'短信',
			'2':'其他',
			'W':'其他'
		},
		CARD_STATE:{
			'0': '正常',
			'1': '挂失',
			'4': '冻结',
			'5': '注销'
		},
		TRANSFER_RESULT: {
			"90" : "交易成功",
			"99" : "交易失败",
			"95" : "部分成功",
			"50" : "银行处理中",
			"51" : "交易处理中",
			"60" : "预约处理中",
			"61" : "预约被撤销",
			"70" : "落地处理中",
			"71" : "落地拒绝"
		},
		LOAN_FLAG:{
			'1':'+',
			'0': '-',
			'CRDT':'-', 
			'DBIT':'+',
			'C':'+',
			'D':'-'
		},
		CHANNEL_ALL_TYPE:{
			"1":	"柜面",
			"3":	"ATM九通卡和银联卡",
			"C":   "ATM信用卡",
			"D":  "兴业银银",
			"I" :  "网银",
			"E":  "电话银行",
			"K":  "ATM通用",
			"X":   "IC卡来账及本代他",
			"Y":  "银联他代本&本代他",
			"7":  "九通卡他代本",
			"L":  "新信贷(对私)",
			"Q":"新信贷(对公)",
			"S" :  "短信"
		},
		SCHENULE_STATE_RESULT:{
			"60" : "预约处理中",
			"61" : "预约被撤销",
			"90" : "预约完成",
			"99" : "预约完成",
			"50" : "预约处理中",
			"70" : "预约完成",
			"71" : "预约完成"
		},
		DESPOSIT_TYPE_NEW:{
			"041" : "大额存单",
			"010" : "个人支票账户",
			"011" : "个人结算账户",
			"012" : "活期存单户",
			"013" : "活期存折户",
			"015" : "定活两便",
			"016" : "教育储蓄",
			"017" : "记名式定活两便",
			"019" : "通知存款",
			"020" : "整存整取",
			"030" : "存本取息",
			"040" : "零存整取",
			"050" : "零存零取",
			"051" : "特色通知存款",
			"071" : "一年期大额定期储蓄存款",
			"081" : "现钞活期",
			"082" : "现汇活期",
			"092" : "-",
			"093" : "理财卡",
			"094" : "社保卡",
			"095" : "交管联名卡",
			"098" : "活一本通账户",
			"099" : "定一本通账户",
			"375" : "-"
		},
		SIGN_FLAG:{
			'0':"网上签约",
		    '1':"柜台签约"
		},
		CERT_TYPE: {
			   '0': '二代身份证',
			   '1': '军官证',
			   '2': '解放军文职干部证',
			   '3': '警官证',
			   '4': '解放军士兵证',
			   '5': '户口簿',
			   '6': '(港、澳)回乡证、通行证、',
			   '7': '（台）通行证、其他有效旅行证',
			   '8': '（外国）护照',
			   '9': '（中国）护照',
			   'A': '武警士兵证',
			   'B': '军事院校学员证',
			   'C': '军官退休证',
			   'D': '文职干部退休证',
			   'E': '离退休干部荣誉证',
			   'b': '临时身份证',
			   'c':	'村民委员会证明',
			   'd':	'学生证',
			   'e':	'澳门通行证',
			   'f':	'外国人永久居留证',
			   'g':	'边民出入境通行证',
			   'F': '其他'
		},
	//基金模块新增枚举值开始
		DELIVER_TYPE:{
			'1': '不寄送',
			'2': '按月',
			'3': '按季',
			'4': '半年',
			'5': '一年'
		},
		//证件类型对应信用卡证件类型
		CERT_TYPE_CREDIT: {
			   '0': '01',
			   '1': '04',
			   '2': '04',
			   '3': '04',
			   '4': '04',
			   '5': '户口簿',
			   '6': '03',
			   '7': '03',
			   '8': '（外国）护照',
			   '9': '（中国）护照',
			   'A': '04',
			   'B': '军事院校学员证',
			   'C': '军官退休证',
			   'D': '文职干部退休证',
			   'E': '离退休干部荣誉证',
			   'F': '05'
		},
		//账单寄送方式:0-传真,1-邮寄,2-email,3-短信(在后台会进行处理，传真会转换为1000,邮寄0100，email-0010,短信-0001)
		RECEIVE_DELIVER_WAY:{
			'1000': '0',
			'0100': '1',
			'0010': '2',
			'0001': '3'
		},
		DELIVER_WAY:{
			'0': '传真',
			'1': '邮寄',
			'2': 'E-mail',
			'3': '短信'
		},
		FUND_PRODTYPE:{
			'11': '股票型',
			'12': '货币市场型',
			'13': '短期理财型',
			'14': '债券型',
			'15': '指数型',
			'16': 'QDII',
			'17': '混合型',
			'18': '保本型',
			'19': 'FOF',
			'20': '基金专户',
			'21': '信托计划',
			'22': 'LOF',
			'30': '其他类型',
			'91': '宝类'
		},
		//基金费率时间分段区间
		FUND_RATETIMESLICE:{
			'0': '年',
			'1': '月',
			'2': '日'
		},
		//投资周期与定投间隔合并在一个下拉框 20170615 investcycle investcyclevalue
		//value规则第一位 “0”表示月  “1”表示周    第二位数值表示定投间隔
		INVEST_CYCLE_MODE:[
			{"value":'11',"text":"每周"},
			{"value":'12',"text":"每两周"},
			{"value":'13',"text":"每三周"},
			{"value":'01',"text":"每月"},
			{"value":'02',"text":"每两月"},
			{"value":'03',"text":"每三月"},
			{"value":'04',"text":"每四月"}
		],
		//显示投资周期与定投间隔
		SHOW_INVEST_CYCLE_MODE:{
			"11":"每周",
			"12":"每两周",
			"13":"每三周",
			"01":"每月",
			"02":"每两月",
			"03":"每三月",
			"04":"每四月"
		},
		//投资周期investcycle
		INVEST_CYCLE:[
			{"value":0,"text":"月"},
			{"value":1,"text":"周"}
		],
		//定投时间-月f_investday
		INVESTDAY_MONTH:[
			{"value":1,"text":"1日"},
			{"value":2,"text":"2日"},
			{"value":3,"text":"3日"},
			{"value":4,"text":"4日"},
			{"value":5,"text":"5日"},
			{"value":6,"text":"6日"},
			{"value":7,"text":"7日"},
			{"value":8,"text":"8日"},
			{"value":9,"text":"9日"},
			{"value":10,"text":"10日"},
			{"value":11,"text":"11日"},
			{"value":12,"text":"12日"},
			{"value":13,"text":"13日"},
			{"value":14,"text":"14日"},
			{"value":15,"text":"15日"},
			{"value":16,"text":"16日"},
			{"value":17,"text":"17日"},
			{"value":18,"text":"18日"},
			{"value":19,"text":"19日"},
			{"value":20,"text":"20日"},
			{"value":21,"text":"21日"},
			{"value":22,"text":"22日"},
			{"value":23,"text":"23日"},
			{"value":24,"text":"24日"},
			{"value":25,"text":"25日"},
			{"value":26,"text":"26日"},
			{"value":27,"text":"27日"},
			{"value":28,"text":"28日"}
		],
		//定投时间-周f_investday
		INVESTDAY_WEEK:[
			{"value":1,"text":"星期一"},
			{"value":2,"text":"星期二"},
			{"value":3,"text":"星期三"},
			{"value":4,"text":"星期四"},
			{"value":5,"text":"星期五"}
		],
		//得到1-10数字对应的中文
		GET_NUBERTOCN:{
			'1':'一',
			'2':'二',
			'3':'三',
			'4':'四',
			'5':'五'	,
			'6':'六',
			'7':'七',
			'8':'八',
			'9':'九',
			'10':'十'	
		},
		//定投协议状态：0-已撤销，1-正常，2-暂停；investstatus
		INVEST_STATUS:{
			'0':'已撤销',
			'1':'正常',
			'2':'暂停'
		},
		//交易渠道：1-银行柜台 2-网银 3-手机银行 4-直销柜台 5-移动营销 6-呼叫中心
		ACCEPT_METHOD:{
			'1':'银行柜台',
			'2':'网银',
			'3':'手机银行',
			'4':'直销柜台',
			'5':'移动营销',
			'6':'呼叫中心'	
		},
		//得到基金风险等级
		FUND_RISK_LEVEL:{
			'01':'低风险产品',
			'02':'中低风险产品',
			'03':'中等风险产品',
			'04':'中高风险产品',
			'05':'高风险产品'
		},
		//得到基金-客户风险等级
		RISK_LEVEL:{
			'01':'谨慎型',
			'02':'稳健型',
			'03':'平衡型',
			'04':'进取型',
			'05':'激进型'
		},
		//性别
		DISPLAYSEX:{
			'0' : '女',
			'1' : '男'
		},
		//定投模式f_investmode
		INVESTMODE:[
			{"value":0,"text":"按后续投资金额不变"},
			{"value":1,"text":"按递增金额扣款"}
		],
		//终止条件f_investtime
		INVESTTIME:[
			{"value":999999999,"text":"无"},
			{"value":0,"text":"成功扣款期数"},
			{"value":1,"text":"累计扣款金额"}
		],
		//显示终止条件f_investtime
		SHOW_INVESTTIME:{
			'999999999':'无',
			'0':'成功扣款期数',
			'1':'累计扣款金额'
		},
		//分红方式
		BONUSWAY:[
			{"value":0,"text":"红利再投"},
			{"value":1,"text":"现金分红"}
		],
		//巨额赎回
		LARGEREDEMPTION:[
			{"value":0,"text":"取消"},
			{"value":1,"text":"顺延"}
		],
		//账单寄送选择
		DELIVERTYPE:[
			{"value":1,"text":"不寄送"},
			{"value":2,"text":"按月"},
			{"value":3,"text":"按季"},
			{"value":4,"text":"半年"},
			{"value":5,"text":"一年"}
		],
		//账单寄送方式
		DELIVERWAY:[
			{"value":0,"text":"传真"},
			{"value":1,"text":"邮寄"},
			{"value":2,"text":"E-mail"},
			{"value":3,"text":"短信"}
		],
		//基金交易类型
		TRANSFER_LIST:
					[{text:"全部",value:""},
					{text:"认购",value:"20"},
					{text:"申购",value:"22"},
					{text:"赎回",value:"24"},
//				    {text:"预约赎回",value:"25"},
//				    {text:"一步转托管",value:"26"},
//				    {text:"转托管转入",value:"27"},
//					{text:"转托管转出",value:"28"},
//					{text:"分红方式变更",value:"29"},
//					{text:"转换",value:"36"},
					{text:"定期定额申购",value:"39"},
//					{text:"定投开通",value:"59"},
//					{text:"定投终止",value:"60"},
//					{text:"定投修改",value:"61"},
//					{text:"定投暂停",value:"64"},
//					{text:"定投恢复",value:"65"},
					{text:"快速赎回",value:"98"},
//					{text:"权益分派",value:"143"},
					{text:"交易撤单",value:"C1"}],
		//基金交易状态
		FUND_TRANS_STATUS:{
			'01':'未上送',
			'02':'已上送',
			'03':'确认接受',
			'04':'确认成功',
			'05':'确认失败',
			'06':'已撤销',
			'07':'部分确认',
			'08':'申请失败',
			'99':'超时可疑账'
		},
		FCURRENCY_TYPE: {
			'156' : '人民币'
		},	
		//基金转入转出
		FUND_BUSNISSCODE:{
			'22':'转入',
			'98':'快速转出',
			'24':'普通转出'
		},
		//基金模块新增枚举值结束
		//资金归集新增枚举值开始
		//归集方式-collectStyle
		COLLECT_STYLE:[
			{"value":1,"text":"固定金额"},
			{"value":0,"text":"保留余额"}
		],
		//显示归集方式-collectStyle
		SHOW_COLLSTYLE:{
			"0":"保留金额",
			"1":"固定金额"
		},
		//归集周期-collectCircle
		COLLECT_CIRCLE:[
//			{"value":0,"text":"请选择归集周期"},
			{"value":1,"text":"每日"},
			{"value":2,"text":"每周"},
			{"value":3,"text":"每月"}
		],
		//显示归集周期-collectCircle
		SHOW_PROCIRCLE:{
			"1":"每日",
			"2":"每周",
			"3":"每月"
		},
		//周期执行日-月circleDAY
		CIRCLEDAY_MONTH:[
			{"value":1,"text":"1日"},
			{"value":2,"text":"2日"},
			{"value":3,"text":"3日"},
			{"value":4,"text":"4日"},
			{"value":5,"text":"5日"},
			{"value":6,"text":"6日"},
			{"value":7,"text":"7日"},
			{"value":8,"text":"8日"},
			{"value":9,"text":"9日"},
			{"value":10,"text":"10日"},
			{"value":11,"text":"11日"},
			{"value":12,"text":"12日"},
			{"value":13,"text":"13日"},
			{"value":14,"text":"14日"},
			{"value":15,"text":"15日"},
			{"value":16,"text":"16日"},
			{"value":17,"text":"17日"},
			{"value":18,"text":"18日"},
			{"value":19,"text":"19日"},
			{"value":20,"text":"20日"},
			{"value":21,"text":"21日"},
			{"value":22,"text":"22日"},
			{"value":23,"text":"23日"},
			{"value":24,"text":"24日"},
			{"value":25,"text":"25日"},
			{"value":26,"text":"26日"},
			{"value":27,"text":"27日"},
			{"value":28,"text":"28日"},
			{"value":29,"text":"29日"},
			{"value":30,"text":"30日"},
			{"value":31,"text":"31日"}
		],
		//周期执行日-周circleDAY
		CIRCLEDAY_WEEK:[
			{"value":1,"text":"星期日"},
			{"value":2,"text":"星期一"},
			{"value":3,"text":"星期二"},
			{"value":4,"text":"星期三"},
			{"value":5,"text":"星期四"},
			{"value":6,"text":"星期五"},
			{"value":7,"text":"星期六"}
		],
		//显示周期执行日-周circleDAY
		SHOW_DATAPLAN:{
			"1":"星期日",
			"2":"星期一",
			"3":"星期二",
			"4":"星期三",
			"5":"星期四",
			"6":"星期五",
			"7":"星期六"
		},
		//协议期限-protocolDuring
		PROTOCOL_DURING:[
			{"value":1,"text":"一个月"},
			{"value":2,"text":"二个月"},
			{"value":3,"text":"三个月"},
			{"value":6,"text":"六个月"},
			{"value":12,"text":"十二个月"}
		],
		//显示协议期限-protocolDuring
		SHOW_PRODURING:{
			"0":"永久期限",
			"1":"一个月",
			"2":"两个月",
			"3":"三个月",
			"6":"六个月",
			"12":"十二个月"
		},
		//资金归集新增枚举值结束
		//各自开发人员维护自己对应的交易码与交易名称  
		TRANS_NAME: {
			   '001001': '登陆',
			   '002002': '账户查询',
			   '002008': '行内转账',//测试demo使用中
			   '002009': '跨行转账',
			   '002019': '注册账户互转',
			   '002020': '手机号转账',
			   '003008': '自助缴费',
			   '003030': '自助缴费',
			   '003031': '自助缴费',
			   '003032': '自助缴费',
			   '007051': '本行主动还款',
			   '009003': '理财产品购买',
			   '009006': '理财赎回',
			   '005011': '提前还款',
			   '005012': '还款方式变更',
			   '007053': '跨行主动还款',
               '007078': '预借现金',
               '002010': '无卡预约取款',
               '001003':'增加账户',
               '027002':'限额设置',
               '002011': '设备绑定',
               '027001':'登录密码修改',
               '027005':'账户密码修改',
               '010101': '基金签约',
               '010104': '签约信息变更',
               '010102': '宝类签约',
               '009010': '查询密码修改',
               '010001': '二维码支付签解约',
               '011101': '黄金定投开户',
               '011102': '黄金定投销户',
               '011103': '黄金定投签约账户变更',
               '011201': '黄金随时买',
               '011301': '黄金定投计划买',
               '011401': '黄金卖金',
               '011601': '黄金提现'
		},
		AUTH_FORMAT: {
			   '001001': '付款账号#payAccount|收款账号#recAccount|收款户名#recAccountName',
			   '002002': '付款账号#payAccount|收款账号#recAccount|收款户名#recAccountName',
			   '002008': '付款账号#payAccount|收款账号#recAccount|收款户名#recAccountName|付款金额#payAmount#元|#recAccountOpenBank|#trsFeeAmount',//测试demo使用中
			   '002009': '付款账号#payAccount|收款账号#recAccount|收款户名#recAccountName|付款金额#payAmount#元|#recAccountOpenBank|#trsFeeAmount',
			   '002019': '付款账号#payAccount|收款账号#recAccount|收款户名#recAccountName|付款金额#payAmount#元|#recAccountOpenBank|#trsFeeAmount',
			   '002020': '付款账号#payAccount|收款账号#recAccount|收款户名#recAccountName|付款金额#payAmount#元|#recAccountOpenBank|#trsFeeAmount',
			   '003008': '付款账户#accountNo|缴费金额#amountRealCharged#元|用户编号#chargeNo|网银流水#orderFlowNo',
			   '003030': '付款账户#accountNo|缴费金额#amountRealCharged#元|用户编号#chargeNo|网银流水#orderFlowNo',
			   '003031': '付款账户#accountNo|缴费金额#amountRealCharged#元|用户编号#chargeNo|网银流水#orderFlowNo',
			   '003032': '付款账户#accountNo|缴费金额#amountRealCharged#元|用户编号#chargeNo|网银流水#orderFlowNo',
			   '007051': '付款账号#payAccount|收款账号#recAccount|还款金额#payAmount#元',
			   '009003': '付款账户#payAccount|购买金额#payAmount#元|客户号#cstno',
			   '009006': '赎回账号#payAccount|赎回份额#redemVol|客户号#customerNo',
			   '005011': '还款账号#payAccount|提前还款本息#payAmount#元',
			   '005012': '原来还款方式#oldType|新还款方式#newType',
			   '007053': '付款账号#payAccount|收款账号#recAccount|还款金额#payAmount#元',
               '007078': '付款账号#payAccount|收款账号#recAccount|还款金额#payAmount#元',
 			   '001003': '账号#account',
 			   '028002':'修改信用卡查询密码',
               '027002': '账号#account',
               '027001': '确定修改网银登陆密码',
               '027005': '修改密码的账号#accountNo',
               '010101': '账号#f_deposit_acct',
               '010104': '账号#f_deposit_acct',
               '010105': '账号#f_new_deposit_acct',
               '010401': '账号#f_deposit_acct|金额#f_investamount',
               '010402': '账号#f_deposit_acct|金额#f_investamount',
               '010102': '账号#f_deposit_acct',
               '010201': '付款账号#f_deposit_acct|交易金额#f_applicationamount',
               '010301': '付款账号#f_deposit_acct|交易金额#f_applicationamount',
               '009010': '信用卡查询密码修改',
               '009011':'修改信用卡交易密码',
               '010001': '账号#accountNo',
               '028006':  '付款账号#accNo|付款金额#txnAmt',
               '011101': '账户#accountNo',
               '011102': '账户#accountNo|定投账户#goldAipNo',
               '011103': '新账户#accountNo|旧账户#goldSignAcct|定投账户#goldAipNo',
               '011201': '账户#accountNo|交易金额#payAmount#元|定投账户#goldAipNo',
               '011301': '账户#accountNo|定投金额#payAmount#元|定投账户#goldAipNo',
               '011401': '账户#accountNo|交易克重#sellWeight#克|定投账户#goldAipNo',
               '011601': '账户#accountNo|交易金额#payAmount#元|定投账户#goldAipNo'
		},
		COMMON_USER:[
				'innerTranInput',
				'interTranInput',
				'sameTranInput',
				'mobileTranInput',
				'scheduleDetail',
				'drawWithoutCard',
				'transferDetail',
				'limitSet',
				'chinaGasFeePayQuery',
				'electricityFeePayQuery',
				'etcFeePayQuery',
				'phoneFeePayInput',
				'telecomFeePayQuery',
				'waterFeePayQuery',
				'feePaymentSet',
				'accountPwdUpdateInput',
				'creditCardActivation_Input',
				'limitApply',
				'accountMaintain',
				'thisInitiativeRefund_Input',
				'thisAppointRefund_Input',
				'otherInitiativeRefund_Input',
				'otherAppointRefund_Input',
				'billInstalment_Input',
				'dealInstalment_Input_Menu',
				'drawTransfer_Input',
				'thirdPay_Input',
				'noPasswordLimitSet_Input_Menu',
				'barcode_scan',
				'scannedQRCode',
				'scannedQRc2c'
		],
		ACCESSTO_UKEY:[
		        'mobileTranConfirm.html',
		        'interTranConfirm.html',
		        'innerTranConfirm.html'
		],
		//优惠类型
		COMMODITY_TYPE:{
			'DD01':'随机立减',
			'CP01':'抵金券'
		},
		//中奖等级
		RAFFLE_LEVEL:{
			'1':'一等奖',
			'2':'二等奖',
			'3':'三等奖',
			'4':'四等奖',
			'5':'五等奖',
			'6':'六等奖',
			'7':'七等奖',
			'8':'八等奖'
		},	
		//黄金定投周期
		INVEST_PERIOD:{
			1:"按月买",
			2:"按日买",
			4:"按周买"
		},
		GOLD_INVEST_WEEK:{
			"01":"星期一",
			"02":"星期二",
			"03":"星期三",
			"04":"星期四",
			"05":"星期五"
		},
		//黄金定投日期
		GOLD_INVESTDAY_MONTH:{         
			"01":"每月1日",
			"02":"每月2日",
			"03":"每月3日",
			"04":"每月4日",
			"05":"每月5日",
			"06":"每月6日",
			"07":"每月7日",
			"08":"每月8日",
			"09":"每月9日",
			"10":"每月10日",
			"11":"每月11日",
			"12":"每月12日",
			"13":"每月13日",
			"14":"每月14日",
			"15":"每月15日",
			"16":"每月16日",
			"17":"每月17日",
			"18":"每月18日",
			"19":"每月19日",
			"20":"每月20日",
			"21":"每月21日",
			"22":"每月22日",
			"23":"每月23日",
			"24":"每月24日",
			"25":"每月25日",
			"26":"每月26日",
			"27":"每月27日",
			"28":"每月28日"
		},
		//黄金定投购买类型
		GOLD_BUY_TYPE:{         
			"01":"计划买",
			"02":"随时买"
		},
		//买金状态
		GOLD_BUY_STATE:{         
			"00":"待处理",
			"01":"处理中",
			"10":"交易成功",
			"11":"交易拒绝",
			"99":"交易失败"
		},
		//买金状态
		GOLD_PLAN_STATE:{         
			"1":"申请",
			"2":"生效",
			"3":"暂停",
			"4":"终止"
		},
		GOLD_ACCT_STATE:{
			"1":"正常",
			"2":"挂失",
			"3":"已冻结",
			"4":"已注销",
			"5":"已结息",
			"6":"预开户"
		},
		GOLD_ORDER_TYPE:{         
			"01":"充值",
			"02":"提现"
		},
		GOLD_CHARGE_STATE:{         
			"00":"待处理",
			"01":"已发送到资金平台",
			"10":"交易成功",
			"11":"交易拒绝",
			"99":"交易失败"
		},
		PB_LARGEDEPOSIT_PERIOD:{         
			"01":"1个月",
			"03":"3个月",
			"06":"6个月",
			"09":"9个月",
			"12":"1年",
			"18":"18个月",
			"24":"2年",
			"36":"3年",
			"60":"5年"
		},
		PB_LARGEDEPOSIT_RATEMODE:{         
			"01":"到期一次性付清"
		},
		PB_LARGEDEPOSIT_RATETYPE:{         
			"01":"浮动利率",
			"02":"固定利率"
		},
		PB_LARGEDEPOSIT_WITHDRAW:{         
			"0":"不支持",
			"1":"支持"
		},
		PB_LARGEDEPOSIT_ISATTORN:{         
			"0":"不支持",
			"1":"支持"
		},
		PB_LARGEDEPOSIT_ISLIMIT:{         
			"0":"否",
			"1":"是"
		},

		getSelectList: function(appName){
			var list = [];
			var map =$.param[ appName ];
			if ( !map ) {
				mui.alert( "param: " + appName + " not defined!");
				return null;
			}
			for(var key in map){
				var value = map[key];
				var item ={
					"value" : key,
					"text" :value
				};
				list.push(item);
			}
			return list;
		},
		getBankLogo: function(ucode){
			var picpath="";
			if(ucode){
			    picpath=$.param.BANK_LOGO[ucode.substr(0,3)+''];
			}
			if(!picpath){
				picpath="default_logo.png";
			}
			return picpath;
		},
		getCardState:function(code){
			var state = "";
			var allState = $.param.CARD_STATE;
			for(var key in allState){
				if(key==code){
					state=allState[code];
				}
			}
			return state;
		},
		getUserType:function(appName,appValue){
			var userType = "";
			if(appName=='AREA_CODE'){
				var areacode = $.param.AREA_CODE;
				for(var key in areacode){
					if(key==appValue){
						userType=areacode[appValue];
					}
				}
			}
			if(appName=='PAY_TYPE'){
				userType = $.param.PAY_TYPE[appValue];
			}
			if(appName=='TRANS_RESULT'){
				userType = $.param.TRANSFER_RESULT[appValue];
			}
			if(appName=='LOAN_FLAG'){
				userType = $.param.LOAN_FLAG[appValue];
			}
			if(appName=='CHANNEL_ALL_TYPE'){
				userType = $.param.CHANNEL_ALL_TYPE[appValue];
			}
			if(appName=='SCHENULE_STATE_RESULT'){
				userType = $.param.SCHENULE_STATE_RESULT[appValue];
			}
			if(appName=='DESPOSIT_TYPE_NEW'){
				userType = $.param.DESPOSIT_TYPE_NEW[appValue];
			}
			if(appName=='SIGN_FLAG'){
				userType = $.param.SIGN_FLAG[appValue];
			}
			return userType;
		},
		getSelect: function( appName, selectCode, filter, blankSelect ) {
			var html = "";
			var map =null;
			if(typeof(appName)==='string'){
				map =$.param[ appName ];
			}else{
				map=appName;
			}
			
			if ( !map ) {
				mui.alert( "param: " + appName + " not defined!");
				return null;
			}
			if(blankSelect)
				html += "<option value=\"\">请选择</option>";
			
			for(var key in map){
				var value = map[key];
				if(filter) {
					if(filter.include(key))
						continue;
				}
				if ( selectCode && selectCode == key ) {
					html += "<option value=\""+key+"\" areaName=\""+value+"\" selected=\"selected\">"+value+"</option>";
				}
				else {
					html += "<option value=\""+key+"\" areaName=\""+value+"\">"+value+"</option>";
				}
			}
			return html;
		},	
		/**
		 * 根据类型名称 和id获取value
		 * @param appName 类型名称
		 * @param appValue 类型id
		 * @returns
		 */
		getDisplay: function( appName, appValue ){
		
		    var map =null;
			
			if(typeof(appName)==='string'){
				map =$.param[ appName ];
			}else{
				map=appName;
			}
			if ( !map ) {
			
				return null;
			}
			appValue=$.trim(appValue);
			if(map[appValue]==undefined||map[appValue]=='undefined'){
				return appValue;
			}
			
			return map[appValue];
		},

		translateSysFlag:function(errorCode){
			var errorTran=errorCode.substring(0,6);
			var errorList=$.param[ 'ERRCODE_SYS_FLAG' ];
			
			for(var key in errorList){
				if(key==errorTran){
					var sys= this.getDisplay('ERRCODE_SYS_FLAG',errorTran);
					
					return sys+'▪'+errorCode.substring(6);
				}
				
			}
			
			return errorCode;
		},
		trim: function(input){
			return input.replace(/(^\s*)|(\s*$)/g, "");
		},
		isEmpty: function(input){
			if( input==null ||  this.trim(input).length == 0 || input == 'null')
				return true;
			else
				return false;
			
		},
		getParams: function(key){
			if(this.isEmpty(key)){
				return {};
			}
			return $.param[ key ]
		},
		/**
		 * 根据url地址代码 获取具体地址
		 * @param UrlKey url地址代码
		 * @returns   
		 */
		getReMoteUrl: function(UrlKey){
			var URLValue = "";
			UrlKey=$.trim(UrlKey);
			if(UrlKey == "REMOTE_URL_ADDR"){
				if(this.RUNTIME_ENVIROMENT){
					URLValue="https://ebank.hubeibank.cn:446/";//生产配置
				}else{ 
					URLValue="http://192.168.10.162:8090/";//测试环境
				}
			}
			return URLValue;
		},
		/**
		 * 根据url地址代码 获取在线客服具体地址
		 * @param UrlKey url地址代码
		 * @returns   
		 */
		getOnlineAgentUrl: function(UrlKey){
			var URLValue = "";
			UrlKey=$.trim(UrlKey);
			if(UrlKey == "ONLINEAGENT_URL_ADDR"){
				if(this.RUNTIME_ENVIROMENT){
					URLValue="https://ebank.hubeibank.cn/CCOnline/";//生产配置
				}else{ 
					URLValue="http://192.168.52.119:9090/CCOnline/";//测试环境
				}
			}
			return URLValue;
		},
		checkUsbKeyRole: function(url){
			if(!url){
				return false;
			}
			
			if(!this.ACCESSTO_UKEY || this.ACCESSTO_UKEY.length==0){
				return false;
			}
			
			for (var i=0 ; i<this.ACCESSTO_UKEY.length; i++) {
				if(url.indexOf(this.ACCESSTO_UKEY[i])!=-1){
					return true;
				}
			}
			
			return false;
		},
		//唤起APP配置参数，第三方支付与卡密验证...
		AWAKE_APP_PARAMS:{
			"01":["checkacctpwd","../views/checkacctpwd/checkacctpwd.html"],//校验卡密
			"02":["b2cpayment","../views/b2cpayment/b2cpayment.html"]   //支付
		}
	});
	
})(jQuery)