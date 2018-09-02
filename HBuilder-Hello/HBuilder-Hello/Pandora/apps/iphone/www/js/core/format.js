define(function(require, exports, module) {
	/**
	 * 连续count个当前字符串连接
	 * @param {int} count
	 * @returns {string} 
	 */
	String.prototype.times = function(count) {
		return count < 1 ? '' : new Array(count + 1).join(this);
	}

	/**
	 * 字符串左补0到指定位数
	 * @param {int} width
	 * @returns {string} 
	 */
	String.prototype.leftPadZero = function(width) {
		var pad = width - this.length;
		if (pad > 0) {
			return ("0".times(pad) + this);
		} else {
			return this;
		}
	};

	String.prototype.blank = function() {
		return /^\s*$/.test(this);
	}

	/**
	 * 将日期对象根据指定的格式格式化为字符串
	 * @param {string} format 日期格式
	 * @returns {string}
	 */
	Date.prototype.format = function(format) {
		if (!format) {
			format = "yyyymmdd";
		}
		return format.replace(
			new RegExp(/(yyyy|mm|dd|hh|mi|ss|ms)/gi),
			function(str) {
				switch (str.toLowerCase()) {
					case 'yyyy':
						return this.getFullYear();
					case 'mm':
						return (this.getMonth() + 1).toString().leftPadZero(2);
					case 'dd':
						return this.getDate().toString().leftPadZero(2);
					case 'hh':
						return this.getHours().toString().leftPadZero(2);
					case 'mi':
						return this.getMinutes().toString().leftPadZero(2);
					case 'ss':
						return this.getSeconds().toString().leftPadZero(2);
					case 'ms':
						return this.getMilliseconds().toString().leftPadZero(3);
				}
			}.bind(this)
		);
	};
	exports.removeComma = function(str) {
		return str.replace(new RegExp('\,', ["g"]), '');
	}
	exports.addComma = function(str) {
		if (str.length > 3) {
			var mod = str.length % 3;
			var output = (mod > 0 ? (str.substring(0, mod)) : '');
			for (var i = 0; i < Math.floor(str.length / 3); i++) {
				if ((mod == 0) && (i == 0))
					output += str.substring(mod + 3 * i, mod + 3 * i + 3);
				else
					output += ',' + str.substring(mod + 3 * i, mod + 3 * i + 3);
			}
			return (output);
		} else
			return str;
	}
	exports.prepareCashString = function(cash, dot, digits) {
		if (cash == undefined) cash = '0';
		if (dot == undefined) dot = true;
		if (digits == undefined) digits = 2;

		if (typeof cash !== 'string') {
			cash = cash.toString();
		}
		cash = exports.removeComma(cash);

		//TODO检查是否金额
		// 处理包含正负符号的情况
		var prefix = cash.charAt(0);
		if (prefix == "-" || prefix == "+") {
			return prefix + exports.prepareCashString(cash.substr(1), dot, digits);
		}

		if (cash.indexOf('.') != -1) {
			dot = true; //如果输入串本身包含小数点，则忽略dot参数的设置，认为是真实金额大小
		}
		var integerCash, decimalCash;
		if (!dot) {
			if (cash.length <= digits) {
				cash = cash.leftPadZero(digits + 1);
			}
			integerCash = cash.substring(0, cash.length - digits);
			decimalCash = cash.substring(cash.length - digits);
		} else {
			var dotPos = cash.indexOf('.');
			if (dotPos != -1) {
				integerCash = cash.substring(0, dotPos);
				decimalCash = cash.substring(dotPos + 1);
			} else {
				integerCash = cash;
				decimalCash = '';
			}
			if (integerCash.length == 0)
				integerCash = '0';
			if (decimalCash.length < digits) {
				decimalCash += '0'.times(digits - decimalCash.length);
			} else {
				decimalCash = decimalCash.substring(0, digits); //TODO 考虑四舍五入
			}
		}

		//去掉头部多余的0
		while (integerCash.charAt(0) == '0' && integerCash.length > 1) {
			integerCash = integerCash.substring(1);
		}
		cash = integerCash + '.' + decimalCash;

		return cash;
	}
	exports.parseDate = function(dateString, format) {
		var year = 2000,
			month = 0,
			day = 1,
			hour = 0,
			minute = 0,
			second = 0;
		format = format || "yyyymmdd";
		var matchArray = format.match(new RegExp(/(yyyy|mm|dd|hh|mi|ss|ms)/gi));
		for (var i = 0; i < matchArray.length; i++) {
			var postion = format.indexOf(matchArray[i]);
			switch (matchArray[i]) {
				case "yyyy":
					{
						year = parseInt(dateString.substr(postion, 4), 10);
						break;
					}
				case "mm":
					{
						month = parseInt(dateString.substr(postion, 2), 10) - 1;
						break;
					}
				case "dd":
					{
						day = parseInt(dateString.substr(postion, 2), 10);
						break;
					}
				case "hh":
					{
						hour = parseInt(dateString.substr(postion, 2), 10);
						break;
					}
				case "mi":
					{
						minute = parseInt(dateString.substr(postion, 2), 10);
						break;
					}
				case "ss":
					{
						second = parseInt(dateString.substr(postion, 2), 10);
						break;
					}
			}
		}
		return new Date(year, month, day, hour, minute, second);
	};
	//格式化账户金额 example：1,121,121,111.00
	exports.formatMoney = function(s, n) {
			n = n > 0 && n <= 20 ? n : 2;
			if (s == null || s == "") {
				var extra = ".0";
				for (i = 1; i < n; i++) {
					extra += "0";
				}
				return "0" + extra;
			}
			s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
			var prefix = s.charAt(0);
			if(prefix =="-"){
				s=s.substring(1);
			}else{
				prefix = "";
			}
			var l = s.split(".")[0].split("").reverse(),
				r = s.split(".")[1];
			t = "";
			for (i = 0; i < l.length; i++) {
				t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
			}
			return prefix + t.split("").reverse().join("") + "." + r;
		}
		//格式化日期，把YYYYMMDD转换YYYY-MM-DD或者YYYYMM转换成YYYY-MM
	exports.dataToDate = function(value) {
		var flag = "";
		if (value != null || value != "") {
			if (value.length >= 8) {
				var yyyy = value.substring(0, 4);
				var mm = value.substring(4, 6);
				var dd = value.substring(6, 8);
				flag = yyyy + "-" + mm + "-" + dd;
			} else if (value.length == 6) {
				var yyyy = value.substring(0, 4);
				var mm = value.substring(4, 6);
				flag = yyyy + "-" + mm;
			}
		}
		return flag;
	}
	exports.formatDateTime = function(data, format) {
		var parsedDate = exports.parseDate(data, "yyyymmddhhmiss");
		if (format && typeof outFormat === "string") {
			return parsedDate.format(format);
		} else {
			return parsedDate.format("yyyy-mm-dd  hh:mi:ss");
		}
	}
	exports.formatDate = function(value) {
		var flag = "";
		if (value != null || value != "") {
			var nowYear = value.getFullYear();
			var nowMonth = value.getMonth() + 1;
			var nowDate = value.getDate();
			if (nowMonth < 10) nowMonth = "0" + nowMonth;
			if (nowDate < 10) nowDate = "0" + nowDate;
			flag = nowYear + "-" + nowMonth + "-" + nowDate;
		}
		return flag;
	};
	exports.addDay = function(date,day) {
        var time=date.getTime();
		return new Date(time+day*24*60*60*1000);
	};	
	//格式化账号 example：6666 7777 8888 9999
	exports.toFomatBankNumber = function(BankNo) {
		if (BankNo == "") return;
		var account = new String(BankNo);
		account = account.substring(0, 22); /*帐号的总数, 包括空格在内 */
		if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
			/* 对照格式 */
			if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
					".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
				var accountNumeric = accountChar = "",
					i;
				for (i = 0; i < account.length; i++) {
					accountChar = account.substr(i, 1);
					if (!isNaN(accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
				}
				account = "";
				for (i = 0; i < accountNumeric.length; i++) { /* 可将以下空格改为-,效果也不错 */
					if (i == 4) account = account + " "; /* 帐号第四位数后加空格 */
					if (i == 8) account = account + " "; /* 帐号第八位数后加空格 */
					if (i == 12) account = account + " "; /* 帐号第十二位后数后加空格 */
					if (i == 16) account = account + " "; /* 帐号第十六位后数后加空格 */
					account = account + accountNumeric.substr(i, 1)
				}
			}
		} else {
			account = " " + account.substring(1, 5) + " " + account.substring(6, 10) + " " + account.substring(14, 18) + "-" + account.substring(18, 25);
		}
		return account;
	};
	//格式化姓名，使其格式为张**;
	exports.dealUserNameNoHide = function(cash, dot, digits) {
			if (cash != null && typeof cash !== "string") {
				cash = cash.toString();
			}
			if (cash == '' || cash == null || cash == undefined) {
				return '';
			} else {
				var temp;
				cash = $.trim(cash);
				if (cash.length >= 1) {
					var nameLeng = cash.length;
					var name = cash.substring(0, 1);
					for (var i = 0; i < nameLeng; i++) {
						if (i != (nameLeng - 1)) {
							name += "*";
						}
					}
					temp = name;
				} else {
					temp = cash;
				}
			}
			return temp;
		}
		//格式化手机
	exports.mobileNoHide = function(cash, dot, digits) {
			if (cash != null && typeof cash !== "string") {
				cash = cash.toString();
			}
			if (cash == '' || cash == null || cash == undefined) {
				return '';
			} else {
				var temp;
				cash = $.trim(cash);
				var hideNumber = cash.substring(3, cash.length - 4);
				var star = "";
				for (var i = 0; i < hideNumber.length; i++) {
					star += "*"
				}
				if (cash.length == 11) {
					temp = cash.replace(hideNumber, star);
				} else {
					temp = cash;
				}
			}
			return temp;
		}
		//格式化账号，使其格式为4444********6788;
	exports.dealAccountNoHide  = function(cash, dot, digits) {
		if (cash != null && typeof cash !== "string") {
			cash = cash.toString();
		}
		if (cash == '' || cash == null || cash == undefined) {
			return '';
		} else {
			var temp;
			cash = cash.replace(/(^\s*)|(\s*$)/g, '');
			var hideNumber = cash.substring(4, cash.length - 4);
			var star = "";//统一变为8个*号
			for (var i = 0; i < hideNumber.length; i++) {
				star += "*"
			}
			if (cash.length >= 12) {
				temp = cash.replace(hideNumber, star);
			} else {
				temp = cash;
			}
		}
		return temp;
	}
		//格式化账号，使其格式为4444********6788;中间固定8个*
	exports.dealAccNoWith8Stars  = function(cash, dot, digits) {
		if (cash != null && typeof cash !== "string") {
			cash = cash.toString();
		}
		if (cash == '' || cash == null || cash == undefined) {
			return '';
		} else {
			var temp;
			cash = cash.replace(/(^\s*)|(\s*$)/g, '');
			var hideNumber = cash.substring(4, cash.length - 4);
			var star = "********";//统一变为8个*号
			if (cash.length >= 12) {
				temp = cash.replace(hideNumber, star);
			} else {
				temp = cash;
			}
		}
		return temp;
	}
	////去除特定字符
	exports.ignoreChar = function(string,char) {
		var temp = "";
		string = '' + string;
		splitstring = string.split(char);
		for(i = 0; i < splitstring.length; i++)
		temp += splitstring[i];
		return temp;
	}
	
	//格式化账号，使其格式为4444 **** **** 6788;
	exports.dealAccountHideFour = function(cash, dot, digits) {
		var account;
		if (cash != null && typeof cash !== "string") {
			cash = cash.toString();
		}
		if (cash == '' || cash == null || cash == undefined) {
			return '';
		} else {
			var temp;
			cash = exports.ignoreChar(cash, " ");
			var preFour = cash.substring(0, 4);
			var lastFour = cash.substring(cash.length - 4, cash.length);
			account = preFour + ' **** **** ' + lastFour;
			/*var hideNumber = cash.substring(4, cash.length - 4);
			var star = "";
			for (var i = 0; i < hideNumber.length; i++) {
				star += "*"
			}
			if (cash.length >= 12) {
				temp = cash.replace(hideNumber, star);
			} else {
				temp = cash;
			}

			account = "";
			for (i = 0; i < temp.length; i++) {
				if (i == 4) account = account + " ";
				if (i == 8) account = account + " ";
				if (i == 12) account = account + " ";
				account = account + temp.substr(i, 1);
			}

			if (account.substr(15, 8).length > 4) {
				account = account.substr(0, 15) + account.substr(15, account.length - 19) + " " + account.substr(account.length - 4, 4);
			}*/
		}
		return account;
	}

	//格式化账号，使其格式为4444 *** 6788;
	exports.dealAccountHideThree = function(cash, dot, digits) {
		var account;
		if (cash != null && typeof cash !== "string") {
			cash = cash.toString();
		}
		if (cash == '' || cash == null || cash == undefined) {
			return '';
		} else {
			var temp;
			cash = exports.ignoreChar(cash, " ");
			var preFour = cash.substring(0, 4);
			var lastFour = cash.substring(cash.length - 4, cash.length);
			account = preFour + ' *** ' + lastFour;
		}
		return account;
	}

	exports.dealMoney = function(cash){
		var account;
		if (cash != null && typeof cash !== "string") {
			cash = cash.toString();
		}
		if (cash == '' || cash == null || cash == undefined) {
			return '';
		} else {
			var temp;
			cash = exports.ignoreChar(cash, " ");
			var preFour = cash.substring(0, 4);
			var lastFour = cash.substring(cash.length - 4, cash.length);
			account = preFour + ' **** ' + lastFour;
		}
		return account;
	}

	//格式化身份证号，使其格式为230121********2310;
	exports.dealCardIdNoHide = function(cardId, dot, digits) {
		if (cardId != null && typeof cardId !== "string") {
			cardId = cardId.toString();
		}
		if (cardId == '' || cardId == null || cardId == undefined) {
			return '';
		} else {
			var temp;
			cardId = cardId.replace(/(^\s*)|(\s*$)/g, '');
			var hideNumber = cardId.substring(6, cardId.length - 4);
			var star = "";
			for (var i = 0; i < hideNumber.length; i++) {
				star += "*"
			}
			temp = cardId.replace(hideNumber, star);
		}
		return temp;
	}

	//不带小数点的数字格式化
	exports.toCashWithCommaNoPoint = function(cash, dot, digits) {
		if (cash != null && typeof cash !== "string") {
			cash = cash.toString();
		}
		if (cash == '' || cash == null) {
			return '';
		} else {
			var temp = exports.prepareCashString(cash, dot, digits);

			var dotPos = temp.indexOf('.');
			var integerCash = temp.substring(0, dotPos);

			// 处理包含正负符号的情况
			var prefix = integerCash.charAt(0);
			if (prefix == "-" || prefix == "+") {
				temp = prefix + exports.addComma(integerCash.substring(1));
			} else {
				temp = exports.addComma(integerCash);
			}
			if (temp == "0.00") {
				return '';
			}
			return temp;
		}
	}
	exports.dateRange = function(startDate, endDate) {
		var startDateMinis = Date.parse(startDate);
		var endDateMinis = Date.parse(endDate);
		var minutes = 1000 * 60;
		var hours = minutes * 60;
		var days = hours * 24;
		var dayRange = Math.floor((endDateMinis - startDateMinis)/days);
		return dayRange;
	}
	exports.prevDay = function(currentDate, days) {
		
		return exports.ignoreChar(exports.formatDate(new Date(Date.parse(currentDate)-86400000*parseInt(days))),"-");
	}
	exports.prevMonth = function(currentDate, decMonth) {
		var decMon =parseInt(decMonth) ;
		var month = currentDate.getMonth()+1;
		var day = currentDate.getDate();
		var year = currentDate.getFullYear();
		var monthHasDay = new Array([0],[31],[28],[31],[30],[31],[30],[31],[31],[30],[31],[30],[31]);
		while(decMon >=12){
			decMon -=12;
			year -=1;
		}
		if(month<=decMon){
			year -=1;
			month = 12-(decMon-month);
		}else{
			month -=decMon;
		}
		if((year%4==0 && year%100!=0)||(year%100==0 && year%400==0)){  
			monthHasDay[2] = 29;  
		}
		day = monthHasDay[month] >= day ? day : monthHasDay[month];
		var stringDate = year+''+(month<10 ? "0" + month : month)+''+(day<10 ? "0"+ day : day);
		return stringDate;
	}
});