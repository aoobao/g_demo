!(function() {
	/**
	 * 刮刮卡
	 * @param {Object} opt
	 * el: canvas id
	 * text: 显示文字
	 * textColor: 文字颜色 默认 #000
	 * maskColor: 蒙版颜色 默认 #000
	 * lineWidth: 擦除线条宽度 默认 20
	 * fontStyle: 文字样式 默认 30px Georgia
	 * callback: 用户第一次擦除回调(奖品在第一次擦除的时候获取.)
	 * method
	 * 	setValue: 奖品赋值
	 */
	function MaskShape(opt) {
		if(typeof opt == 'string') opt = {
			el: opt
		};
		this._dom = document.getElementById(opt.el);
		this.ctx = this._dom.getContext('2d');
		this.width = this._dom.width;
		this.height = this._dom.height;
		this._text = opt.text || null;
		this._textColor = opt.textColor || '#000';
		this._maskColor = opt.maskColor || '#000';
		this._lineWidth = opt.lineWidth || 20;
		this._fontStyle = opt.fontStyle || "30px Georgia";
		this.drawArray = [];
		this._callback = opt.callback;
		this._init();
	}

	var p = MaskShape.prototype;

	p._init = function() {
		var canvas = this._dom;
		var self = this;
		var flg = false;
		canvas.onmousedown = function(e) {
			if(self.drawArray.length == 0) {
				if(typeof self._callback == 'function') {
					self._callback.apply(self, [self]);
				}
			}
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;
			var arr = [{
				x: mouseX,
				y: mouseY
			}];
			self.drawArray.push(arr);
			canvas.onmousemove = function(e) {
				var x = e.pageX - this.offsetLeft;
				var y = e.pageY - this.offsetTop;
				arr.push({
					x: x,
					y: y
				});
				self.update();
			};

		};
		canvas.onmouseup = function(e) {
			canvas.onmousemove = null;
		};
		canvas.onmouseout = function(e) {
			flg = false;
			setTimeout(function() {
				if(!flg) canvas.onmousemove = null;
			}, 200);

		};
		canvas.onmouseenter = function(e) {
			flg = true;
		}

		//touch事件
		canvas.addEventListener('touchstart', function(e) {
			_touchstart(e);

		});

		function _touchstart(e) {
			if(self.drawArray.length == 0) {
				if(typeof self._callback == 'function') {
					self._callback.apply(self, [self]);
				}
			}
			var touch = e.targetTouches[0];
			var x = touch.clientX - canvas.offsetLeft;
			var y = touch.clientY - canvas.offsetTop;
			var arr = [{
				x: x,
				y: y
			}];
			self.drawArray.push(arr);
			canvas.addEventListener('touchmove', _touchmove, false);
			canvas.addEventListener('touchend', _touchend, false);

		}

		function _touchmove(e) {
			var touch = e.changedTouches[0];
			var x = touch.clientX - canvas.offsetLeft;
			var y = touch.clientY - canvas.offsetTop;
			var arr = self.drawArray[self.drawArray.length - 1];
			arr.push({
				x: x,
				y: y
			});
			self.update();
		}

		function _touchend(e) {
			canvas.removeEventListener('touchmove', _touchmove);
			canvas.removeEventListener('touchend', _touchend);
		}

		self.update();
	}

	p.update = function() {
		this._drawMask();
		this._clearMask();
		this._updateText();
	}

	p._drawMask = function() {
		var ctx = this.ctx;
		ctx.save();
		ctx.fillStyle = this._maskColor || "#000"; //
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.restore();
	}

	p._clearMask = function() {
		var ctx = this.ctx;
		if(this.drawArray.length == 0) return;
		ctx.save();
		ctx.lineWidth = this._lineWidth;
		ctx.lineCap = "round";
		ctx.globalCompositeOperation = 'destination-out';
		for(var i = 0; i < this.drawArray.length; i++) {
			var arr = this.drawArray[i];
			ctx.beginPath();
			ctx.moveTo(arr[0].x, arr[0].y);
			for(var s = 0; s < arr.length; s++) {
				var temp = arr[s];
				ctx.lineTo(temp.x, temp.y);
			}
			ctx.stroke();
		}

		ctx.restore();
	}

	p._updateText = function() {
		var str = this._text;
		if(!str) return;
		var ctx = this.ctx;
		ctx.save();
		ctx.fillStyle = this._textColor;
		ctx.font = this._fontStyle;
		ctx.globalCompositeOperation = 'destination-over';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(str, this.width / 2, this.height / 2);
		ctx.restore();
	}

	p.setText = function(strText) {
		this._text = strText;
		this.update();
	}

	window.maskShape = function(opt) {
		var mask = new MaskShape(opt);
		return mask;
	};
})();