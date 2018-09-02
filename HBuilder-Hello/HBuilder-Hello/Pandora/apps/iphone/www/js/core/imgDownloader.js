/*
 * 封装html5+下载网络资源(支持http/https)
 * 读取本地缓存资源
 * 删除本地缓存资源
 * 参考：http://ask.dcloud.net.cn/article/256
 * 
 * 后续进行下载缓存队列管理封装
 * 参考：http://ask.dcloud.net.cn/article/524
 */
define(function(require, exports, module) {

	var taskQueue = new Array();
	var isStartTask = false;

	/**
	 * @param {Object} options    
	 * @param {String} elemId       图片对象id
	 * @param {String} remoteUrl    网络资源地址
	 * @param {String} defaultUrl   默认加载图片
	 * @param {String} bizType      业务类型，便于资源进行分类，默认为空
	 * @param {Object} reqData      请求资源上送的数据
	 * @param {Object} procFun      下载过程回调函数
	 * @param {Object} beforeFun    下载前回调函数
	 * @param {Object} successFun   下载成功回调函数
	 * @param {Object} params       
	 * 
	 */
	exports.loadImageRes = function(options,callback) {

		if(!options) {
			return;
		}
		if(!options.remoteUrl) {
			return;
		}

		var filename = options.remoteUrl.substring(options.remoteUrl.lastIndexOf("/") + 1, options.remoteUrl.length);
		var localpath = "_downloads/" + (options.bizType ? options.bizType + "/" : "") + filename;
		options.localpath = localpath;
		options.callback = callback ||mui.noop;

		//检查图片是否在本地
		if(window.plus) {
			plus.io.resolveLocalFileSystemURL(localpath, function(entry) {
				console.log("图片存在,直接设置=" + localpath);
				//如果文件存在,则直接设置本地图片
				callback && callback(options);
			}, function(e) {
				console.log("图片不存在,联网下载=" + localpath);
				//如果文件不存在,联网下载图片
				taskQueue.push(options);
				if(!isStartTask) {
					isStartTask = true;
					startDownloaderTask();
				}
			})
		}

	}

	/**
	 * 本地缓存图片  直接显示
	 * @param {Object} options
	 */
	function setImgFromLocal(options) {
		console.log("本地路径=localpath=" + options.localpath)
		//本地相对路径("_downloads/logo.jpg")
		//转成SD卡绝对路径("/storage/emulated/0/Android/data/io.dcloud.HBuilder/.HBuilder/downloads/logo.jpg");
		var absolutePath = plus.io.convertLocalFileSystemURL(options.localpath);
		var img = new Image();
		img.onload = function() {
			document.getElementById(options.elemId).src = absolutePath;
		}
		img.onerror = function() {
			document.getElementById(options.elemId).src = plus.io.convertLocalFileSystemURL(options.defaultUrl);
		}

		img.src = absolutePath;

	}

	/**
	 * 网络资源图片下载，下载展示
	 * 下载失败显示默认图片
	 * @param {Object} localpath
	 */
	function startDownloaderTask() {

		if(taskQueue.length == 0) {
			isStartTask = false;
			return;
		}
		var optionsQueue = taskQueue.shift(); //从下载任务队列中取出一个任务

		//下载之前，设置默认图片
		//document.getElementById(imgId).src = plus.io.convertLocalFileSystemURL(defaultUrl);
		var options = {
			method: "GET",
			filename: optionsQueue.localpath,
			priority: "10",
			data: optionsQueue.reqData
		};
		//		downloader = plus.downloader.createDownload(remoteUrl,options,function(task,status){});//这种方法无法监听中间状态
		var downloader = plus.downloader.createDownload(optionsQueue.remoteUrl, options);

		downloader.addEventListener('statechanged', function(task, status) {

			switch(task.state) {
				case 1: // 开始下载
					optionsQueue.beforeFun && optionsQueue.beforeFun();
					break;
				case 2: // 已连接到服务器
					break;
				case 3: // 已接收到数据
					optionsQueue.procFun && optionsQueue.procFun(task.downloadedSize, task.totalSize);
					break;
				case 4: // 下载完成
					if(status == 200) {
						optionsQueue.successFun && optionsQueue.successFun(optionsQueue.params);
						console.log("下载成功=" + task.filename);
						optionsQueue.callback && optionsQueue.callback(options);
//						if(task.filename) {
//							exports.delFile(task.filename);
//						}
					} else {
						console.log("下载失败=" + status + "==" + optionsQueue.localpath);
						task.abort(); //文档描述:取消下载,删除临时文件;(但经测试临时文件没有删除,故使用delFile()方法删除);
						if(!optionsQueue.localpath) {
							exports.delFile(optionsQueue.localpath);
						}
					}
					startDownloaderTask();
					break;
			}
		})

		downloader.start();
	}

	/**
	 * 删除指定文件
	 * @param {Object} localpath
	 */
	exports.delFile = function(localpath,callback,errorback) {
		plus.io.resolveLocalFileSystemURL(localpath, function(entry) {
			entry.remove(function() {
				console.log("文件删除成功==" + localpath);
				callback && callback();
			}, function() {
				console.log("文件删除失败=" + localpath);
				errorback && errorback();
			})
		},function(){
			errorback && errorback();
		})
	}
	

	/**
	 * 删除指定目录所有文件
	 */
	exports.delAllFiles = function(dir,callback,errorback) {
		plus.io.resolveLocalFileSystemURL(dir, function(dirEntry) {
			dirEntry.removeRecursively(function() {
				console.log(dir + "目录下文件清空完成")
				callback && callback();
			}, function() {
				console.log(dir + "目录下文件清空失败")
				errorback && errorback();
			})
		}, function() {
			console.log(dir + "目录读取失败")
			callback && callback();
		})
	}
	
	/**
	 * 获取指定目录下所有文件的路径数组
	 * @param {Object} dir
	 */
	exports.getAllDownloadedFile = function(dir,callback,errorback){
		var filePath = [];
		if(!dir)return;
		
		if(window.plus){
			plus.io.resolveLocalFileSystemURL(dir , function(entry){
				
				var dirObj = entry.createReader();
				dirObj.readEntries(function(dirFiles){
					for (var i= 0,len = dirFiles.length ; i < len ; i++) {
						console.log("目录"+dir+"下的文件："+dirFiles[i].fullPath)
						filePath.push(dirFiles[i].fullPath);//保存文件绝对路径
					}
					callback && callback(filePath);
					
				})
			},function(){
				errorback && errorback();
			})
		}
	}
	
	/**
	 * 指定目录中随机获取一个文件路径
	 * @param {Object} dir
	 * var rand = Math.floor(Math.random()*10)%len;
			console.log("随机文件路径："+fileArry[rand])
	 */
	exports.getOneRandomFileInDir = function(dir,callback,errorback){
		var filePath = [];
		if(!dir)return;
		
		if(window.plus){
			plus.io.resolveLocalFileSystemURL(dir , function(entry){
				
				var dirObj = entry.createReader();
				dirObj.readEntries(function(dirFiles){
					for (var i= 0,len = dirFiles.length ; i < len ; i++) {
						console.log("目录"+dir+"下的文件："+dirFiles[i].fullPath)
						filePath.push(dirFiles[i].fullPath);//保存文件绝对路径
					}
					
					var rand = Math.floor(Math.random()*10)%filePath.length;
					
					callback && callback(filePath[rand]);
					
				})
			},function(){
				errorback && errorback();
			})
		}
	}
	
	
	/**
	 * 比较广告版本
	 * @param {Object} nowVersion
	 */
	exports.compareAdVersion = function(nowVersion){
		
		if(!nowVersion){
			return true;
		}
		
		if(window.plus){
			var oldversion = plus.storage.getItem("ADVERTS_VERSION");
			if(!oldversion){
				oldversion = 0;
			}
			if(+nowVersion > +oldversion){
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * 更新广告版本信息
	 * @param {Object} nowVersion
	 */
	exports.updateAdVersion = function(nowVersion){
		if(window.plus){
			plus.storage.setItem("ADVERTS_VERSION",nowVersion);
		}
	}
	
	
	/**
	 * 将广告地址与对应的链接地址插入到缓存
	 * @param {Object} key
	 * @param {Object} value
	 */
	exports.insertLinkAddr = function(key,value){
		if(window.plus){
			var infolist = plus.storage.getItem("ADVERTS_ADDRESS_INFOLIST");
			if(!infolist){
				infolist = {};
			}else{
				infolist = JSON.parse(infolist);
			}
			infolist[ key ] = value;
			plus.storage.setItem("ADVERTS_ADDRESS_INFOLIST",JSON.stringify(infolist));
		}
	}
	
	/**
	 * 根据广告地址名称 获取广告详情链接
	 * @param {Object} link
	 */
	exports.selectLinkAddr = function(link){
		if(!link){
			return "";
		}
		if(window.plus){
			var infolist = plus.storage.getItem("ADVERTS_ADDRESS_INFOLIST");
			console.log("infolist:"+infolist)
			if(!infolist){
				return "";
			}else{
				infolist = JSON.parse(infolist);
				return infolist[ link ];
			}
		}
		
		return "";
	}
	
})