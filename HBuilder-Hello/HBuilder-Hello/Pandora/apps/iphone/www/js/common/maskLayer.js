(function($,doc,window){
	"use strict"
	
	var MaskLayer = function(options){
		this.options = options;
		this.init(options);
	}
	
	
	MaskLayer.prototype = {
		constructor:MaskLayer,
		
		init: function(){
			this.createHtml();
			this.initEvent();
			if(this.options.initShow){
				this.showMask();
			}
			var _this = this;
			this._touchmove = function(e){
					if(e.target!=_this._content[0]){
						e.preventDefault();
//						e.stopPropagation();
//						e.stopImmediatePropagation();
					}
					
			};
		},
		showMask:function(){
			document.addEventListener('touchmove',this._touchmove,true); 
//			document.getElementById('showAdDes').addEventListener('touchmove',this._touchmove,false);
			if(this.options.multiPage&&window.plus){ 
				var index = plus.webview.getLaunchWebview();
//				var main_sub = plus.webview.getWebviewById('main_sub');
//				index.setStyle({mask:"rgba(0,0,0,0.5)"});
				index.evalJS('showMask('+true+')');
			}
			this._alertDiv.css('top',this.getScrollPos()+'px');
			this._maskDiv.show();
			this._alertDiv.show();
		},
		hideMask:function(){
			document.removeEventListener('touchmove',this._touchmove,true);
			this._maskDiv.hide();
			this._alertDiv.hide();
			if(this.options.multiPage&&window.plus){
				var index = plus.webview.getLaunchWebview();
//				var main_sub = plus.webview.getWebviewById('main_sub');
//				index.setStyle({mask:"none"});
				index.evalJS('showMask('+false+')'); 
			}
		},
		createHtml:function(){
			var maskDiv = $('<div class="pickernew_bg" id="maskLayer" style="display: none;"></div>');//遮罩
			var alertDiv = $('<div class="banner_picker_bg" style="border-radius: 20px;line-height:25px"></div>');//弹出框
			var header = $('<p class="picker_title fz_16"></p>');//标题
			var content = $('<p class="picker_cont fz_14" id="showAdDes"></p>');//内容
			var closeDiv = $('<div class="picker_btnbox"><a><span id="closeNews">关闭</span></a></div>');//尾部
			alertDiv.append(header);
			if(this.options.title){
				header.text(this.options.title);
				alertDiv.append(header);
			}
			content.html(this.options.content);
			alertDiv.append(content);
			alertDiv.append(closeDiv);
//			maskDiv.append(alertDiv);
			var screenH = this.getScreenH();
			var windowH = this.getWindowH();
			var docH    = this.getDocumentH();
			maskDiv.css('height',docH+'px');
			var alertH = screenH*Number(this.options.maskHeightRatio);
			alertDiv.css('height',alertH);
			content.css('height',screenH*Number(this.options.contentHeightRatio)*Number(this.options.maskHeightRatio));
//			content.css('height',150);
			
			$(doc.body).append(alertDiv);
			$(doc.body).append(maskDiv);
			this._maskDiv  =  maskDiv;
			this._alertDiv = alertDiv;
			this._content = content;
		},
		initEvent:function(){
			var alertDiv = this._alertDiv;
			var this_ = this;
			//使用click不使用tab， 苹果存在透点的问题
			alertDiv.find('.picker_btnbox').on('click','a',function(e){
				this_.hideMask();
				this_.options.closeFun();
			});
		},
		getScreenH:function(){
			if(this.options.multiPage){
				if(window.plus){
					return plus.screen.resolutionWidth;
				}else{
					return screen.availHeight-52;//减去底部高度，避免遮罩出现滚动条
				}
			}else{
				if(window.plus){
					return plus.screen.resolutionWidth;
				}else{
					return screen.availHeight;
				}
			}
		},
		getDocumentH:function(){
			var h = $(document).height();
			var outH = $(document).outerHeight();
			return outH==h?h:outH;
		},
		getWindowH:function(){
			return $(window).height();
		},
		getScrollPos:function(){
			var scrollPos=0;
			if(window.pageYOffset){
				scrollPos = window.pageYOffset;
			}else if(document.compatMode&&document.compatMode!='BackCompat'){
				scrollPos = document.documentElement.scrollTop;
			}else if(document.body){
				scrollPos = document.body.scrollTop;
			}
			return scrollPos;
			
		},
		getDomHeight:function(obj){
			if(obj&&obj.length!=0){
				var h = obj.css('height');
				if(h){
					var n = h.substring(0,h.indexOf('px'));
					return Number(n);
				}
			}else{
				alert('DOM对象为空');
				return 0;
			}
		}
	}
	
	$.maskLayer = function(options){
		options = $.extend({},$.maskLayer.defaultsOptions, typeof options=='object'&&options);
		if($.data(doc.body,'maskLayer')){
			return $.data(doc.body,'maskLayer');
		}else{
			$.data(doc.body,'maskLayer',new MaskLayer(options))
			return $.data(doc.body,'maskLayer');
		}
	}
	
	$.maskLayer.defaultsOptions = {
		initShow:false,//对象初始化是否显示遮罩
		multiPage:true,//是否为多页面模式，即存在首页
		title:'',
		content:"请输入内容",
		maskHeightRatio:0.6,
		contentHeightRatio:0.3,
		closeFun:$.noop
	}
	
})(jQuery,document,window)
