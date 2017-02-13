! function(window, doc, $) {
	function Waterfall(elem, opt) {
		this.elem = elem;
		this.opt = $.extend(true,{}, Waterfall.DEFAULTS, opt || {});
	};
	Waterfall.DEFAULTS = {
		num: 4,
		refreshNum:10,
		scrollRefresh:true
	};
	Waterfall.prototype = {
		sortItem: function(){
			var _this = this;
			var itemArr = _this.getAllItem();
			_this.currentNum = itemArr.length;//当前wf-m-item的数量
			_this.setPosition(itemArr);
			if(_this.opt.scrollRefresh){
				$(window).bind("scroll",function(){
					_this.refreshFn();
				});
			}			
		},
		getAllItem: function(){
			var _this = this;
			return _this.elem.children(".wf-m-item");
		},
		setPosition: function(itemArr){
			var _this = this;
			var colsArr=[];
			var itemW = _this.elem.outerWidth()/_this.opt.num;
			_this.elem.children(".wf-m-item").css({"width":itemW+"px"});
			for (var i=0; i<itemArr.length; i++) {
				var items = $(itemArr[i]);
				var x,y;			
				if(i+1 > _this.opt.num){
					var itemH = items.outerHeight();
					var min = Math.min.apply(null,colsArr);
					y = min;
					for(var j = 0; j<colsArr.length; j++) {
						if(colsArr[j] == min){
							x = j * itemW;							
							colsArr[j] += itemH;
							break;
						}
					}
					items.css({"position":"absolute","top":y,"left":x});
				}else{					
					colsArr.push(items.outerHeight());
				}
				
			}
			_this.colsH = colsArr;
		},
		imgeLoad:function(items,harr){
			var img = new Image();
			var src = items.find("img").attr("src");
			img.onload = function(){
				harr.push(items.outerHeight());
			}
			img.src = src;
			img=null;
		},
		refreshFn:function(){
			var _this = this;
			var wh = $(window).outerHeight();
			var dH = $(document).outerHeight();
			var sH = $(document).scrollTop();	
			if(sH+wh > dH-10){
				var insertElem = _this.elem;
				var html = "";
				for (var i = 0; i<_this.opt.refreshNum; i++) {
					html += "<div class='wf-m-item'>"+
								"<p class='wf-m-picbox'>"+
									"<img src='images/image_"+(i+1)+".jpg' width='100%' />"+
								"</p></div>";
								
				}
				insertElem.append(html);
				var newItemsArr = [];
				var itemArr = _this.getAllItem();
				for (var j = _this.currentNum; j<itemArr.length; j++){
					newItemsArr.push(itemArr[j]);
				}
				_this.currentNum = itemArr.length;
				_this.refresh_layout(newItemsArr);
			}
		},
		refresh_layout:function(itemArr){
			var _this = this;
			var colsArr=_this.colsH;
			var itemW = _this.elem.outerWidth()/_this.opt.num;
			_this.elem.children(".wf-m-item").css({"width":itemW+"px"});
			//debugger;
			for (var i=0; i<itemArr.length; i++) {
				var items = $(itemArr[i]);
				var x,y;			
				var itemH = items.outerHeight();
				var min = Math.min.apply(null,colsArr);
				//debugger;
				y = min;
				for(var j = 0; j<colsArr.length; j++) {
					if(colsArr[j] == min){
						x = j * itemW;							
						colsArr[j] += itemH;
						break;
					}
				}
				items.css({"position":"absolute","top":y,"left":x});
			}
			_this.colsH = colsArr;
		}
	}
	Waterfall.init = function(elem, opt) {
		var _this = new Waterfall(elem, opt);
		_this.sortItem();
		return;
	}
	$.fn.waterfall = function(opt) {
		var elem = $(this);
		return Waterfall.init(elem, opt);
	}
	
	
}(window, document, jQuery);