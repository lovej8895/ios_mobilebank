

Date.prototype.addDay = function(num) {
	this.setDate(this.getDate() + num);
	return this;
}

Date.prototype.addMonth = function(num) {
	var tempDate = this.getDate();
	this.setMonth(this.getMonth() + num);
	if (tempDate != this.getDate())
		this.setDate(0);
	return this;
}

Date.prototype.addYear = function(num) {
	var tempDate = this.getDate();
	this.setYear(this.getYear() + num);
	if (tempDate != this.getDate())
		this.setDate(0);
	return this;
}
Date.prototype.Format = function(formatStr) {
	var str = formatStr;
	var Week = ['日', '一', '二', '三', '四', '五', '六'];

	str = str.replace(/yyyy|YYYY/, this.getFullYear());
	str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

	str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
	str = str.replace(/M/g, (this.getMonth() + 1));

	str = str.replace(/w|W/g, Week[this.getDay()]);

	str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	str = str.replace(/d|D/g, this.getDate());

	str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	str = str.replace(/h|H/g, this.getHours());
	str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	str = str.replace(/m/g, this.getMinutes());

	str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	str = str.replace(/s|S/g, this.getSeconds());

	return str;
}


function HashMap() {
	/** Map ��С **/
	var size = 0;
	/** ���� **/
	var entry = [];

	/** �� **/
	this.put = function(key, value) {
			if (!this.containsKey(key)) {
				size++;
			}
			entry[key] = value;
		}
		/** ȡ **/
	this.get = function(key) {
			return this.containsKey(key) ? entry[key] : null;
		}
		/** ɾ�� **/
	this.remove = function(key) {
			if (this.containsKey(key) && (
				delete entry[key])) {
				size--;
			}
		}
		/** �Ƿ�� Key **/
	this.containsKey = function(key) {
			return (key in entry);
		}
		/** �Ƿ�� Value **/
	this.containsValue = function(value) {
			for (var prop in entry) {
				if (entry[prop] == value) {
					return true;
				}
			}
			return false;
		}
		/** ���� Value **/
	this.values = function() {
			var values = new Array();
			for (var prop in entry) {
				values.push(entry[prop]);
			}
			return values;
		}
		/** ���� Key **/
	this.keys = function() {
			var keys = new Array();
			for (var prop in entry) {
				keys.push(prop);
			}
			return keys;
		}
		/** Map Size **/
	this.size = function() {
			return size;
		}
		/* ��� */
	this.clear = function() {
		size = 0;
		entry = new Object();
	}
	
	this.toJson = function(){
		var jobj = {};
		for (var prop in entry) {
			jobj[ prop ] = entry[ prop ];
		}
		return jobj;
	}
}



String.formatmodel = function(str, model) {
	for (var k in model) {
		var re = new RegExp("{" + k + "}", "g");
		str = str.replace(re, model[k]);
	}
	return str;
};

var base64_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

String.prototype.ToCharArray = function() {
		return this.split("");
	}
	// 倒序
String.prototype.Reverse = function() {
		return this.split("").reverse().join("");
	}
	// 是否包含指定字符
String.prototype.IsContains = function(str) {
		return (this.indexOf(str) > -1);
	}
	// 判断是否为空
String.prototype.IsEmpty = function() {
		return this == "";
	}
	// 判断是否是数字
String.prototype.IsNumeric = function() {
		var tmpFloat = parseFloat(this);
		if (isNaN(tmpFloat))
			return false;
		return true;
	}
	// 判断是否是整数
String.prototype.IsInt = function() {
		if (this == "NaN")
			return false;
		return this == parseInt(this).toString();
	}
	// 合并多个空白为一个空白
String.prototype.resetBlank = function() {
		return this.replace(/s+/g, "");
	}
	// 除去左边空白
String.prototype.LTrim = function() {
		return this.replace(/(^\s*)/g, "");
	}
	// 除去右边空白
String.prototype.RTrim = function() {
		return this.replace(/(\s*$)/g, "");
	}
	// 除去两边空白
String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}
	// 保留数字
String.prototype.getNum = function() {
		return this.replace(/[^d]/g, "");
	}
	// 保留字母
String.prototype.getEn = function() {
		return this.replace(/[^A-Za-z]/g, "");
	}
	// 保留中文
String.prototype.getCn = function() {
		return this.replace(/[^u4e00-u9fa5uf900-ufa2d]/g, "");
	}
	// 获取字节长度
String.prototype.ByteLength = function() {
		return this.replace(/[^\x00-\xff]/g, "aa").length;
	}
	// 从左截取指定长度的字串
String.prototype.left = function(n) {
		return this.slice(0, n);
	}
	// 从右截取指定长度的字串
String.prototype.right = function(n) {
		return this.slice(this.length - n);
	}
	// HTML编码
String.prototype.HTMLEncode = function() {
		var re = this;
		var q1 = [/x26/g, /x3C/g, /x3E/g, /x20/g];
		var q2 = ["&", "<", ">", " "];
		for (var i = 0; i < q1.length; i++)
			re = re.replace(q1[i], q2[i]);
		return re;
	}
	// 获取Unicode
String.prototype.Unicode = function() {
		var tmpArr = [];
		for (var i = 0; i < this.length; i++)
			tmpArr.push("&#" + this.charCodeAt(i) + ";");
		return tmpArr.join("");
	}
	// 指定位置插入字符串
String.prototype.Insert = function(index, str) {
		return this.substring(0, index) + str + this.substr(index);
	}
	/**
	 * 判断字符串是否以指定的字符串开始
	 */
String.prototype.startsWith = function(str) {
		return this.substr(0, str.length) == str;
	}
	/**
	 * 判断字符串是否以指定的字符串开始，忽略大小写
	 */
String.prototype.iStartsWith = function(str) {
		return this.substr(0, str.length).iEquals(str);
	}
	/**
	 * 判断字符串是否以指定的字符串结束
	 */
String.prototype.endsWith = function(str) {
		return this.substr(this.length - str.length) == str;
	}
	/**
	 * 判断字符串是否以指定的字符串结束，忽略大小写
	 */
String.prototype.iEndsWith = function(str) {
		return this.substr(this.length - str.length).iEquals(str);
	}
	/**
	 * 忽略大小写比较字符串 注：不忽略大小写比较用 == 号
	 */
String.prototype.iEquals = function(str) {
		return this.toLowerCase() == str.toLowerCase();
	}
	/**
	 * 比较字符串，根据结果返回 -1, 0, 1
	 */
String.prototype.compareTo = function(str) {
		if (this == str) {
			return 0;
		} else if (this < str) {
			return -1;
		} else {
			return 1;
		}
	}
	/**
	 * 忽略大小写比较字符串，根据结果返回 -1, 0, 1
	 */
String.prototype.iCompareTo = function(str) {
	return this.toLowerCase().compareTo(str.toLowerCase());
}

String.prototype.encode64 = function() {
	var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;
	var input = this.toString();
	do {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output = output + base64_keyStr.charAt(enc1) + base64_keyStr.charAt(enc2) + base64_keyStr.charAt(enc3) + base64_keyStr.charAt(enc4);
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";
	} while (i < input.length);

	return output;
}
String.prototype.StringFormat = function() {
	if (arguments.length == 0)
		return null;
	var str = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var re = new RegExp('\\{' + (i - 1) + '\\}');
		str = str.replace(re, arguments[i]);
	}
	return str;
}
String.prototype.decode64 = function(input) {
	var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;

	if (input.length % 4 != 0) {
		return "";
	}
	var base64test = /[^A-Za-z0-9\+\/\=]/g;
	if (base64test.exec(input)) {
		return "";
	}

	do {
		enc1 = base64_keyStr.indexOf(input.charAt(i++));
		enc2 = base64_keyStr.indexOf(input.charAt(i++));
		enc3 = base64_keyStr.indexOf(input.charAt(i++));
		enc4 = base64_keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output = output + String.fromCharCode(chr1);

		if (enc3 != 64) {
			output += String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output += String.fromCharCode(chr3);
		}

		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";

	} while (i < input.length);

	return output;
}
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
	if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
		return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
	} else {
		return this.replace(reallyDo, replaceWith);
	}
}


window.showMask = function(boolean){
	if(!document.getElementById('layerMaskDiv')){
		return false;
	}
	if(boolean){
		document.getElementById('layerMaskDiv').style.display='block';
	}else{
		document.getElementById('layerMaskDiv').style.display='none';
	}
}

