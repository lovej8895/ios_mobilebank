/**
 * 弹出选择列表插件
 */

(function($, document) {

	//定义弹出选择器类
	var SmartPicker = $.SmartPicker = $.Class.extend({
		//构造函数
		init: function(options) {
			var self = this;
			self.options = options || {};
            self.sharew=null;
            //遮罩页
            self.ws=null;
            //调用页
            self.opener=null;
            self.loaded=false;
            self.selectedItems=[];
            self._createListPicker();
		},
		_createListPicker: function() {
			var self = this;
	
			
		},
		closeMask:function(){
			var self=this;
			self.ws.setStyle({
				mask: "none"
			});
			self.sharew.hide();
	   },
		//填充数据
		setData: function(data,defaultSelectIndex) {
			var self = this;
			var defaultIndex=0;
			if( defaultSelectIndex ){
				defaultIndex=defaultSelectIndex;
			}
			data = data || [];
			if( window.plus ){
				var maxHight=256;
				var length=data.length;
				var divHight = length*48+56;
				if(divHight>maxHight){
					divHight=maxHight;
				}
				var top = plus.display.resolutionHeight - divHight;
				var href = "../myOwn/pickerList.html";
				var currentView=plus.webview.currentWebview()
				self.opener =currentView ;
				if(currentView.parent()!=null){
					self.ws=currentView.parent();
				}else{
					self.ws=currentView;
				}
				// 点击关闭遮罩层
		        self.ws.addEventListener("maskClick", function(){
				    self.ws.setStyle({
						mask: "none"
					});
				    self.sharew.hide();
		        }, false);
		        if( self.sharew==null ){
			 		self.sharew = plus.webview.create(href, "pickerList", {
						width: '100%',
						height: divHight,
						bottom:'0px',
						scrollIndicator: 'none',
						scalable: false,
						popGesture: 'none'
					}, {
						params: {
							"acctlist": data,
							"defaultIndex":defaultIndex,
							"options":self.options,
							"pageId": self.ws.id,
							"openerId": self.opener.id
						}
					});	
					self.sharew.addEventListener("loaded", function() { 
                        self.loaded=true;
				    }, false);
		        }
		        
			}
		
		},
		//获取选中的项（数组）
		getSelectedItems: function() {

		},
		setSelectedIndex: function(index){
			var self=this;
			$.fire(self.sharew,"setSelectedIndex",{index:index}); 
		},
		getPickerStatus: function() {
            var self=this;
            return self.loaded
		},		
		//显示
		show: function(callback) {
			var self=this;
            self.sharew.show('slide-in-bottom', 50);
            self.ws.setStyle({
				mask: "rgba(0,0,0,0.5)"
			});
		},
		//隐藏
		hide: function() {


		},
		dispose: function() {
			var self = this;
			self.hide();

		}
	});

})(mui, document);