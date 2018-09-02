var regObj = {
	REGEXP_COMMA: new RegExp('\,', ["g"]),
	REGEXP_MONEY: new RegExp(/^[0-9]*\.?[0-9]{0,2}$/),
	"_require": /.+/,
	"_email": /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	"_phone": /(\d{2,5}-\d{7,8}?)/,
	"_mobile": /^1[0-9]{10}$/,
	"_url": /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
	"_idCard": /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/,
	"_currency": /^\d+(\.\d+)?$/,
	"_number": /^\d+$/,
	"_zip": /^[1-9]\d{5}$/,
	"_qq": /^[1-9]\d{4,8}$/,
	"_integer": /^[-\+]?\d+$/,
	"_double": /^[-\+]?\d+(\.\d+)?$/,
	"_english": /^[A-Za-z]+$/,
	"_chinese": /^[\u0391-\uFFE5]+$/,
	"_unSafe": /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
	"_upload": /[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]+/,
	"_date": /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/
}
var AREA_CODE = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
/*
 用途：检查输入字符串是否是手机号格式不带国家区号
 输入：str：字符串
 返回：如果通过验证返回true,否则返回false
 */
function dateLe(startDate, endDate) {
	if(startDate && endDate) {
		startDate = startDate.replace(/-/g, "/");
		endDate = endDate.replace(/-/g, "/");
		var dt1 = new Date(Date.parse(startDate));
		var dt2 = new Date(Date.parse(endDate));
		return(dt1 <= dt2);
	} else {
		return false;
	}
}

function dateLt(startDate, endDate) {
	if(startDate && endDate) {
		startDate = startDate.replace(/-/g, "/");
		endDate = endDate.replace(/-/g, "/");
		var dt1 = new Date(Date.parse(startDate));
		var dt2 = new Date(Date.parse(endDate));
		return(dt1 < dt2);
	} else {
		return false;
	}
}

function dateGt(startDate, endDate) {
	if(startDate && endDate) {
		startDate = startDate.replace(/-/g, "/");
		endDate = endDate.replace(/-/g, "/");
		var dt1 = new Date(Date.parse(startDate));
		var dt2 = new Date(Date.parse(endDate));
		return(dt1 > dt2);
	} else {
		return false;
	}
}

function dateGe(startDate, endDate) {
	if(startDate && endDate) {
		startDate = startDate.replace(/-/g, "/");
		endDate = endDate.replace(/-/g, "/");
		var dt1 = new Date(Date.parse(startDate));
		var dt2 = new Date(Date.parse(endDate));
		return(dt1 >= dt2);
	} else {
		return false;
	}
}

function getLocationHref() {
	return document.location.href;
}

function checkLength(strTemp) {
	var i, sum;
	sum = 0;
	for(i = 0; i < strTemp.length; i++) {
		if((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255)) {
			sum = sum + 1;
		} else {
			sum = sum + 2;
		}
	}
	return sum;
}

function getRandomNumber(min, max) {
	var range = max - min;
	var rand = Math.random();
	return(min + Math.round(rand * range));
}

function isJson(obj) {
	var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return isjson;
}

function strToJson(str) {
	var json = eval('(' + str + ')');
	return json;
};

function checkDate(startDate, endDate) {
	var sDate = new Date(startDate.replace(/\-/g, "\/"));
	var eDate = new Date(endDate.replace(/\-/g, "\/"));
	if(sDate > eDate) {
		return false;
	}
	return true;
}

function parseURL() {
	var url = document.baseURI || document.URL;
	url = decodeURI(url);
	var parse = url.match(/^(([a-z]+):\/\/)?([^\/\?#]+)\/*([^\?#]*)\??([^#]*)#?(\w*)$/i);
	var query = parse[5];
	var arrtmp = query.split("&");
	var queryMap = new HashMap();
	for(i = 0; i < arrtmp.length; i++) {
		num = arrtmp[i].indexOf("=");
		if(num > 0) {
			name = arrtmp[i].substring(0, num);
			value = arrtmp[i].substr(num + 1);
			queryMap.put(name, value);
		}
	}
	return queryMap;
}

/*
 用途：检查输入字符串是否为空或者全部都是空格
 输入：str
 返回：如果全是空返回true,否则返回false
 */
function isNull(str) {
	if(str == "") {
		return true;
	}
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
};

/*
 用途：检查输入字符串是否有特殊字符
 输入：str
 返回：如果有返回true,否则返回false
 */
function isSpecialChar(str) {
	//var re = new RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
	var re = new RegExp(/[\u4E00-\u9FA5]{2,4}/);
	return re.test(str);
};
/*
 用途：检查输入对象的值是否符合整数格式
 输入：str 输入的字符串
 返回：如果通过验证返回true,否则返回false
 */
function isInteger(str) {
	var regu = /^[-]{0,1}[0-9]{1,}$/;
	return regu.test(str);
};

/*
 用途：检查输入字符串是否符合正整数格式
 输入：s：字符串
 返回：如果通过验证返回true,否则返回false
 */
function isNumber(s) {
	var regu = "^[0-9]+$";
	var re = new RegExp(regu);
	if(s.search(re) != -1) {
		return true;
	} else {
		return false;
	}
};

/*
 用途：检查输入字符串是否是带小数的数字格式,可以是负数
 输入：str：字符串
 返回：如果通过验证返回true,否则返回false
 */
function isDecimal(str) {
	if(isInteger(str)) {
		return true;
	}
	var re = /^[-]{0,1}(\d+)[\.]+(\d+)$/;
	if(re.test(str)) {
		if(RegExp.$1 == 0 && RegExp.$2 == 0) {
			return false;
		}
		return true;
	} else {
		return false;
	}
};
/*
 用途：检查输入字符串是否是手机号格式不带国家区号
 输入：str：字符串
 返回：如果通过验证返回true,否则返回false
 */
function isMobile(s) {
	return(regObj._mobile.test(s));
}
/**
 * 检查字符串是否为合法的身份证号码
 * @param {string} s 字符串
 * @returns {boolean} 是否为合法身份证号码
 */
function isIDNumber(s) {
	// 检查长度是否合法
	switch(s.length) {
		case 15:
		case 18:
			{
				break;
			}
		default:
			{
				return false;
			}
	}
	// 检查是否为数字
	var testInt = (s.length == 15) ? s : s.substr(0, 17);
	if(!isInteger(testInt)) {
		return false;
	}
	// 检查区域代码是否合法
	var areaCode = parseInt(s.substr(0, 2));
	if(!AREA_CODE[areaCode]) {
		return false;
	}
	// 检查校验位是否合法
	if(s.length == 18) {
		var testNumber = (parseInt(s.charAt(0)) + parseInt(s.charAt(10))) * 7 +
			(parseInt(s.charAt(1)) + parseInt(s.charAt(11))) * 9 +
			(parseInt(s.charAt(2)) + parseInt(s.charAt(12))) * 10 +
			(parseInt(s.charAt(3)) + parseInt(s.charAt(13))) * 5 +
			(parseInt(s.charAt(4)) + parseInt(s.charAt(14))) * 8 +
			(parseInt(s.charAt(5)) + parseInt(s.charAt(15))) * 4 +
			(parseInt(s.charAt(6)) + parseInt(s.charAt(16))) * 2 +
			parseInt(s.charAt(7)) * 1 +
			parseInt(s.charAt(8)) * 6 +
			parseInt(s.charAt(9)) * 3;
		if(s.charAt(17) != "10x98765432".charAt(testNumber % 11) && s.charAt(17) != "10X98765432".charAt(testNumber % 11)) {
			return false;
		}
	}
	return true;
}
/*
 * @desc：格式化，如果为0.则返回0.00
 * @par：
 * address：预格式化的地址，
 * @return：
 * 返回格式化后的字符串
 */
function toCashWithCommaReturn0(cash, dot, digits) {
	if(cash != null && typeof cash !== "string") {
		cash = cash.toString();
	}
	if(cash == '' || cash == null) {
		return '';
	} else {
		var temp = prepareCashString(cash, dot, digits);

		var dotPos = temp.indexOf('.');
		var integerCash = temp.substring(0, dotPos);
		var decimalCash = temp.substring(dotPos + 1);

		// 处理包含正负符号的情况
		var prefix = integerCash.charAt(0);
		if(prefix == "-" || prefix == "+") {
			temp = prefix + addComma(integerCash.substring(1)) + '.' + decimalCash;
		} else {
			temp = addComma(integerCash) + '.' + decimalCash;
		}
		return temp;
	}
}
/*
 * @desc：格式化金额字符串
 * @par：
 * address：预格式化的地址，
 * @return：
 * 返回格式化后的字符串
 */
function prepareCashString(cash, dot, digits) {
	if(cash == undefined) cash = '0';
	if(dot == undefined) dot = true;
	if(digits == undefined) digits = 2;

	if(typeof cash !== 'string') {
		cash = cash.toString();
	}
	cash = removeComma(cash);

	//TODO检查是否金额
	// 处理包含正负符号的情况
	var prefix = cash.charAt(0);
	if(prefix == "-" || prefix == "+") {
		return prefix + prepareCashString(cash.substr(1), dot, digits);
	}

	if(cash.indexOf('.') != -1) {
		dot = true; //如果输入串本身包含小数点，则忽略dot参数的设置，认为是真实金额大小
	}
	var integerCash, decimalCash;
	if(!dot) {
		if(cash.length <= digits) {
			cash = cash.leftPadZero(digits + 1);
		}
		integerCash = cash.substring(0, cash.length - digits);
		decimalCash = cash.substring(cash.length - digits);
	} else {
		var dotPos = cash.indexOf('.');
		if(dotPos != -1) {
			integerCash = cash.substring(0, dotPos);
			decimalCash = cash.substring(dotPos + 1);
		} else {
			integerCash = cash;
			decimalCash = '';
		}
		if(integerCash.length == 0)
			integerCash = '0';
		if(decimalCash.length < digits) {
			decimalCash += '0'.times(digits - decimalCash.length);
		} else {
			decimalCash = decimalCash.substring(0, digits); //TODO 考虑四舍五入
		}
	}

	//去掉头部多余的0
	while(integerCash.charAt(0) == '0' && integerCash.length > 1) {
		integerCash = integerCash.substring(1);
	}
	cash = integerCash + '.' + decimalCash;

	return cash;
}
/*
 * @desc：格式化字符串，添加逗号
 * @par：
 * str：预格式化的字符串，
 * @return：
 * 返回格式化后的字符串
 */
function addComma(str) {
			if(IsEmpty(str)){
				return '';
			}
			var subStr='';
			var index=str.indexOf(".");
			if(index != -1){
				subStr=str.substring(index);
				str=str.substring(0,index);
			}
			if (str.length > 3) {
				var mod = str.length % 3;
				var output = (mod > 0 ? (str.substring(0,mod)) : '');
				for (var i=0 ; i < Math.floor(str.length / 3); i++) {
					if ((mod == 0) && (i == 0))
						output += str.substring(mod+ 3 * i, mod + 3 * i + 3);
					else
						output += ',' + str.substring(mod + 3 * i, mod + 3 * i + 3);
				}
				return (output+subStr);
			}
			else 
				return str+subStr;
		}
/*
 * @desc：格式化字符串，删除逗号
 * @par：
 * str：预格式化的字符串，
 * @return：
 * 返回格式化后的字符串
 */
function removeComma(str) {
	return str.replace(regObj.REGEXP_COMMA, '');
}

/**
 * 检查字符串是否为合法的金额
 * @param {string} s 字符串
 * @returns {boolean} 是否为合法金额
 */
function isMoney(s) {
	return(regObj.REGEXP_MONEY.test(s));
}
function isValidMoney(s) {
	if(s == null || s == undefined || s == "" || s.length == 0){
		return false;
	}
	if(s.length>18){
		return false;
	}
	if(parseFloat(s)<=0){
		return false;
	}
	if(!(regObj.REGEXP_MONEY.test(s))){
		return false;
	}
	return true;
}
//判断字符串是否为数字和字母组合     //判断正整数 /^[1-9]+[0-9]*]*$/  
function checkRate(nubmer) {
	var re = /^[0-9a-zA-Z]*$/g;
	if(!re.test(nubmer)) {
		return false;
	} else {
		return true;
	}
}
//判断字符串是否为英文
function isEnglish(str) {
	var re = /^[A-Za-z]+$/g;
	if(!re.test(str)) {
		return false;
	} else {
		return true;
	}
}

function dealAccountNoHide(cash, dot, digits) {
	if(cash != null && typeof cash !== "string") {
		cash = cash.toString();
	}
	if(cash == '' || cash == null || cash == undefined) {
		return '';
	} else {
		var temp;
		cash = $.trim(cash);
		if(cash.length >= 12) {
			temp = cash.substring(0, 4) + "********" + cash.substring(cash.length - 4, cash.length);
		} else {
			temp = cash;
		}
	}
	return temp;
}

/**
 *  比较数组是否相同
 * @param {Object} array1
 * @param {Object} array2
 */
function compArray(array1, array2) {
	if((array1 && typeof array1 === "object" && array1.constructor === Array) && (array2 && typeof array2 === "object" && array2.constructor === Array)) {
		if(array1.length == array2.length) {
			for(var i = 0; i < array1.length; i++) {
				var ggg = compObj(array1[i], array2[i]);
				if(!ggg) {
					return false;
				}

			}

		} else {
			return false;
		}
	} else {
		throw new Error("argunment is  error ;");
	}
	return true;
};

/**
 * 比较两个对象是否相等，不包含原形上的属性计较
 * @param {Object} obj1
 * @param {Object} obj2
 */
function compareObj(obj1, obj2) {
	if((obj1 && typeof obj1 === "object") && ((obj2 && typeof obj2 === "object"))) {
		var count1 = propertyLength(obj1);
		var count2 = propertyLength(obj2);
		if(count1 == count2) {
			for(var ob in obj1) {
				if(obj1.hasOwnProperty(ob) && obj2.hasOwnProperty(ob)) {

					if(obj1[ob].constructor == Array && obj2[ob].constructor == Array) //如果属性是数组
					{
						if(!compArray(obj1[ob], obj2[ob])) {
							return false;
						};
					} else if(typeof obj1[ob] === "string" && typeof obj2[ob] === "string") //纯属性
					{
						if(obj1[ob] !== obj2[ob]) {
							return false;
						}
					} else if(typeof obj1[ob] === "object" && typeof obj2[ob] === "object") //属性是对象
					{
						if(!compObj(obj1[ob], obj2[ob])) {
							return false;
						};
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
	}

	return true;
};
/**
 * 获得对象上的属性个数，不包含对象原形上的属性
 * @param {Object} obj
 */
function propertyLength(obj) {
	var count = 0;
	if(obj && typeof obj === "object") {
		for(var ooo in obj) {
			if(obj.hasOwnProperty(ooo)) {
				count++;
			}
		}
		return count;
	} else {
		throw new Error("argunment can not be null;");
	}

};

/**
 * 判断数组中是否包含相同对象元素
 * @param {Object} arry
 * @param {Object} obj
 */
function arrayIsContainsObj(arry,obj){
	if(arry.constructor!=Array){
		return false;
	}
	if(!arry||!obj){
		return false;
	}
	for(var i=0;i<arry.length;i++){
		if(compareObj(arry[i],obj)){
			return true;
		}else{
			continue;
		}
	}
	return false;
}

/**
 * 判断数据是否为空 null/undefined, "", "null", "   "
 * @param {Object} v
 */
function IsEmpty(v){
	if(!v){
		return true;
	}else{
		if(v.toLowerCase()=='null'||v.toLowerCase()=='undefined'){
			return true;
		}
		if(v.replace(/\s+/ig,'').length==0){
			return true;
		}
		
		return false;
	}
}

/**
 *  格式化金额，显示为英文金额格式
 * @param {String} amt  如：12345.89
 * @return {String}  12,345.89
 */
function getShowAmt(amt){
	amt=getSendAmt(amt);
	if(IsEmpty(amt)){
		return "";
	}
	return addComma(amt);
}

/**
 * 反格式化金额为正常数字格式
 * @param {String} amt 123,889.92
 * @return  123889.92
 */
function getSendAmt(amt){
	if(IsEmpty(amt)){
		return null;
	}
	return removeComma(toCashWithCommaReturn0(amt));
}



function getJsonByUrl(url) {
	var parse = url.match(/^(([a-z]+):\/\/)?([^\/\?#]+)\/*([^\?#]*)\??([^#]*)#?(\w*)$/i);
	var query = parse[5];
	var arrtmp = query.split("&");
	var queryMap = new HashMap();
	for(i = 0; i < arrtmp.length; i++) {
		num = arrtmp[i].indexOf("=");
		if(num > 0) {
			name = arrtmp[i].substring(0, num);
			value = arrtmp[i].substr(num + 1);
			queryMap.put(name, value);
		}
	}
	return queryMap;
}