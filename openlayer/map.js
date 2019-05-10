(function(window, $) {

	var configUrl = window.Config;

	//代理图片url
	function tileLoadFunction(imageTile, src) {
		var proxyUrl = window.Config ? window.Config.proxyUrl : '';
		if(proxyUrl && proxyUrl != "") {
			imageTile.getImage().src = proxyUrl + "?url=" + encodeURIComponent(src);
		} else {
			imageTile.getImage().src = src;
		}
	}

	function TGisMap(containerId) {
		var thas = this;
		var self = thas;
		//绘制对象
		thas.draw = null;

		//多边形图层
		thas.polygonLayer = null;

		//聚集点图层.
		self.clusterFeatureSource = new ol.source.Vector({
			features: []
		});

		self.clusterSource = new ol.source.Cluster({
			//distance: parseInt(distance.value, 10),
			distance:10,
			source: self.clusterFeatureSource
		});

		var styleCache = {};
		self.clusterLayer = new ol.layer.Vector({
			source: self.clusterSource,
			style: function(feature) {
				var features = feature.get('features');
				var size = features.length;
				var style = null;
				if(size > 1) {
					style = styleCache[size];
					if(!style) {
						var _radius = size / 10;
						if(_radius < 8) _radius = 8;
						if(_radius > 15) _radius = 15;

						style = new ol.style.Style({
							image: new ol.style.Circle({
								radius: _radius,
								stroke: new ol.style.Stroke({
									color: '#fff'
								}),
								fill: new ol.style.Fill({
									color: '#3399CC'
								})
							}),
							text: new ol.style.Text({
								text: size.toString(),
								fill: new ol.style.Fill({
									color: '#fff'
								})
							})
						});
						styleCache[size] = style;
					}
				} else {
					style = features[0].getStyle()
				}
				return style;
			}
		});

		//热力图.
		thas.heatmapLayer = new ol.layer.Heatmap({
			radius: 8, //半径大小
			blur: 15, //模糊大小
			shadow: 250, //阴影大小.
			opacity: 0.5,
			source: new ol.source.Vector({
				features: []
			})
		});

		//热力图.
		thas.heatmapLayer2 = new ol.layer.Vector({

			source: new ol.source.Vector({
				features: []
			}),
			visible: false
		});
		//绘点标注图层
		thas.markerLayer = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: []
			})
		});

		//画线图层
		thas.lineLayer = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: []
			})
		});

		//绘制点位相关图层
		thas.relateFeaturesLayer = null;

		thas.gridLayer = new ol.layer.Vector({
			source: new ol.source.Vector(),
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(255, 0, 51, 1)',
					lineDash: [2, 1],
					width: 1
				})
			})
		});

		//不同地图层级对应的底图数据源
		var tileLayerSource1, tileLayerSource2, tileLayerSource3, tileLayerSource4, tileLayerSource5, tileLayerSource6;

		var projection = ol.proj.get('EPSG:4326');
		var projectionExtent = projection.getExtent();
		var size = ol.extent.getWidth(projectionExtent) / 256;
		var resolutions = new Array(22);
		var matrixIds = new Array(22);
		for(var z = 0; z < 22; ++z) {
			resolutions[z] = size / Math.pow(2, z);
			matrixIds[z] = z;
		}
		tileLayerSource1 = new ol.source.WMTS({
			url: configUrl.tileUrl1,
			tileLoadFunction: tileLoadFunction,
			layer: 'vec',
			format: 'tiles',
			tileGrid: new ol.tilegrid.WMTS({
				origin: ol.extent.getTopLeft(projectionExtent),
				resolutions: resolutions,
				matrixIds: matrixIds,
			}),
			matrixSet: "c",
			style: 'default'
		});
		tileLayerSource2 = new ol.source.WMTS({
			url: configUrl.tileUrl2,
			tileLoadFunction: tileLoadFunction,
			layer: 'cva',
			format: 'tiles',
			tileGrid: new ol.tilegrid.WMTS({
				origin: ol.extent.getTopLeft(projectionExtent),
				resolutions: resolutions,
				matrixIds: matrixIds,
			}),
			matrixSet: "c",
			style: 'default'
		});
		tileLayerSource3 = new ol.source.WMTS({
			url: configUrl.tileUrl3,
			tileLoadFunction: tileLoadFunction,
			layer: 'vec',
			format: 'tiles',
			tileGrid: new ol.tilegrid.WMTS({
				origin: ol.extent.getTopLeft(projectionExtent),
				resolutions: resolutions,
				matrixIds: matrixIds,
			}),
			matrixSet: "c",
			style: 'default'
		});
		tileLayerSource4 = new ol.source.WMTS({
			url: configUrl.tileUrl4,
			tileLoadFunction: tileLoadFunction,
			layer: 'cva',
			format: 'tiles',
			tileGrid: new ol.tilegrid.WMTS({
				origin: ol.extent.getTopLeft(projectionExtent),
				resolutions: resolutions,
				matrixIds: matrixIds,
			}),
			matrixSet: "c",
			style: 'default'
		});
		tileLayerSource5 = new ol.source.TileArcGISRest({
			url: configUrl.URL.tileLayerSource5 //"http://10.1.1.28:10050/ArcGIS/rest/services/KQCGMAP1820/MapServer"
		});
		//		tileLayerSource5 = new ol.source.WMTS({
		//			url: configUrl.tileUrl5,
		//			tileLoadFunction: tileLoadFunction,
		//			layer: 'KQEMAP',
		//			format: 'image/png',
		//			tileGrid: new ol.tilegrid.WMTS({
		//				origin: ol.extent.getTopLeft(projectionExtent),
		//				resolutions: resolutions,
		//				matrixIds: matrixIds,
		//			}),
		//			matrixSet: "TileMatrixSet0",
		//			style: 'default'
		//		});
		//		tileLayerSource6 = new ol.source.WMTS({
		//			url: configUrl.tileUrl6,
		//			tileLoadFunction: tileLoadFunction,
		//			layer: 'KQEMAPANNO',
		//			format: 'image/png',
		//			tileGrid: new ol.tilegrid.WMTS({
		//				origin: ol.extent.getTopLeft(projectionExtent),
		//				resolutions: resolutions,
		//				matrixIds: matrixIds,
		//			}),
		//			matrixSet: "TileMatrixSet0",
		//			style: 'default'
		//		});

		thas.map = new ol.Map({
			logo: false,
			layers: [
				new ol.layer.Tile({
					name: "baseVec",
					source: tileLayerSource1
				}),
				new ol.layer.Tile({
					name: "baseCva",
					source: tileLayerSource2
				}),
				thas.gridLayer, //
				thas.heatmapLayer,
				thas.heatmapLayer2,
				thas.lineLayer, //折线图.
				self.clusterLayer, //聚合点.
				thas.markerLayer //点位图.
			],
			target: containerId,
			controls: ol.control.defaults({
				attributionOptions: ({
					collapsible: true
				})
			}),
			view: new ol.View({

				center: [120.48201551754718, 30.086689326561373],
				projection: ol.proj.get("EPSG:4326"),
				zoom: 13,
				minZoom: 5,
				maxZoom: 25
			})
		});
		//		thas.map.getView().fit([120.404376545383, 30.0087014643942, 120.552778678422, 30.1571035974332], thas.map.getSize(), {
		//			nearest: true
		//		});
		//添加全屏控件
		thas.map.addControl(new ol.control.FullScreen());
		//添加地图放大缩小控件
		thas.map.addControl(new ol.control.Zoom());
		//控制不同地图层级时,切换底图数据源
		thas.map.getView().on("change:resolution", function() {
			var zoom = thas.map.getView().getZoom();
			if(!(typeof zoom === 'number' && zoom % 1 === 0)) {
				return;
			}
			if(zoom <= 14) {
				var l1 = thas.map.getLayers().getArray()[0];
				l1.setSource(tileLayerSource1);
				var l2 = thas.map.getLayers().getArray()[1];
				l2.setSource(tileLayerSource2);
			} else if(zoom >= 15 && zoom <= 17) {
				var l1 = thas.map.getLayers().getArray()[0];
				l1.setSource(tileLayerSource3);
				var l2 = thas.map.getLayers().getArray()[1];
				l2.setSource(tileLayerSource4);
			} else {
				var l1 = thas.map.getLayers().getArray()[0];
				l1.setSource(tileLayerSource5);
				var l2 = thas.map.getLayers().getArray()[1];
				l2.setSource(null);
			}

			if(zoom < 16) { //16层级以下显示热力图
				if(thas.heatmapLayer) thas.heatmapLayer.setVisible(true);
				if(thas.heatmapLayer2) thas.heatmapLayer2.setVisible(false);
			} else {
				//16层级以上显示点.
				if(thas.heatmapLayer) thas.heatmapLayer.setVisible(false);
				if(thas.heatmapLayer2) thas.heatmapLayer2.setVisible(true);
			}
		});

		//thas.map.on('')

		thas.map.on('pointermove', function(evt) {
			var feature = thas.map.forEachFeatureAtPixel(evt.pixel,
				function(feature) {
					return feature;
				});
			if(feature) {
				var callback = feature.get('mousemove');

				//				var callback = feature.H.mousemove;
				if(typeof callback == 'function') {
					callback(feature.getProperties(), evt.b);
				} else {
					var temp = feature.get('_route');
					if(temp) {
						windowManager.fire('root', 'route', {
							event: evt,
							feature: feature,
							data: temp
						});
					} else {
						hideTitle();
					}
				}
			} else {
				hideTitle();
			}
		});

		var point_div = document.getElementById("pointanimation");
		var point_overlay = new ol.Overlay({
			element: point_div,
			positioning: 'center-center',
			stopEvent: false
		});

		thas.map.addOverlay(point_overlay);

		function addPointClick(x, y) {
			point_overlay.setPosition([x, y]);

		}

		function removePointClick() {
			point_overlay.setPosition(undefined);
		}

		thas.map.on('click', function(evt) {
			removePointClick();
			var feature = thas.map.forEachFeatureAtPixel(evt.pixel,
				function(feature) {
					return feature;
				});
			if(feature) { //在marker中.
				var coordinates = feature.getGeometry().getCoordinates();
				//var id = feature.H.id;
				var callback = feature.H.click;
				if(typeof callback == 'function') {
					var flg = callback(feature.H, evt.b);
					if(!(flg === false)) addPointClick(coordinates[0], coordinates[1]);
				}

			} else {

				$("#secondary-ul").find('ul').hide();

			}
		});

	}

	function hideTitle() {
		$("#moveTitle").css("display", 'none');
		$("#moveTrackTime").css("display", 'none');
	}

	//移除点.
	TGisMap.prototype.removeMarker = function() {
		var self = this;
		//self.map.removeLayer(self.markerLayer);
		var source = self.markerLayer.getSource();
		source.clear();
		self.markers = [];
	};
	//移除线
	TGisMap.prototype.removeLine = function() {
		var self = this;
		var source = self.lineLayer.getSource();
		source.clear();

	};
	//移除多边形.
	TGisMap.prototype.removePolygon = function() {
		var self = this;
		self.map.removeLayer(self.polygonLayer);
	}

	//移除聚合点数据.
	TGisMap.prototype.removeCluster = function() {
		var self = this;
		self.clusterFeatureSource.clear();
	}

	//移除热力图.
	TGisMap.prototype.removeHeatmap = function() {
		var self = this;
		self.heatmapLayer.getSource().clear();
		self.heatmapLayer2.getSource().clear();
	}

	//移除所有图形
	TGisMap.prototype.removeAll = function() {
		var self = this;
		self.removeMarker();
		self.removeLine();
		self.removePolygon();
		self.removeCluster();
		self.removeHeatmap();
	}

	/**
	 * 轨迹回放功能:
	 * 方法:
	 * init 初始化轨迹回放(显示一开始的状态) (重置)
	 * start(callback)  开始轨迹 callback在结束后执行
	 * pause	暂停  再次调用start继续
	 * dispose 	销毁,
	 * 
	 * 属性:
	 * speed : 速度  整型 数字越大跑的越快,负数往回跑.
	 * @param {Array} lines
	 * @param {Object} options
	 */
	TGisMap.prototype.trackBack = function(lines, options) {
		var self = this;
		options = options || {};
		var ADD_NUMBER = 1000;
		var STATUS_DISPOSE = 0; //销毁状态
		var STATUS_INIT = 1; //初始化状态
		var STATUS_START = 2; //运行状态
		var STATUS_PAUSE = 3; //暂停状态
		var STATUS_END = 4; //结束状态

		function TrackBack(lines, options) {
			var self = this;
			self.speed = options.speed || 10; //轨迹回放速度
			self.maxArea = options.maxArea || null; //[120.47591425853183, 30.071517346875176,120.55788256602695, 30.111729024426445]
			//self.filterDistance = options.filterDistance == undefined ? 5 : options.filterDistance; //筛选点(前后两个点相差小于该距离的移除掉) 单位:米
			self.filterDistance = options.filterDistance || 0;
			self._lineColor = options.lineColor || [237, 212, 0, 0.8]; //线条颜色
			self._lineWidth = options.lineWidth || 6; //线条粗细
			self._imagePath = options.imagePath || 'point.png';
			self._circleRadius = options.circleRadius || 3; //点半径
			self._circleFillColor = options.circleFillColor || 'black'; //点填充颜色
			self._circleColor = options.circleColor || 'white'; //点线条颜色
			self._circleWidth = options.circleWidth || 2; //点线条粗细
			self._allPointShow = options.pointShow || true;
			self._status = STATUS_DISPOSE; //销毁状态
			self.sourceArray = lines;
			self.errMessage = null;
		}

		//销毁
		TrackBack.prototype.dispose = function() {
			var self = this;
			if(self._status == STATUS_DISPOSE) return;
			self._stopAnimation();
			self.callback = undefined;
			oMap.map.removeLayer(self.vectorLayer); //移除
		};

		//初始化
		TrackBack.prototype.init = function() {
			var self = this;
			self.dispose();
			self.errMessage = null;
			self._styles = {
				'route': new ol.style.Style({
					stroke: new ol.style.Stroke({
						width: self._lineWidth,
						color: self._lineColor
					})
				}),
				'point': new ol.style.Style({
					image: new ol.style.Circle({
						radius: self._circleRadius,
						snapToPixel: false,
						fill: new ol.style.Fill({
							color: self._circleFillColor
						}),
						stroke: new ol.style.Stroke({
							color: self._circleColor,
							width: self._circleWidth
						})
					})
				}),
				'icon': new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 1],
						src: self._imagePath
					})
				})
			};

			self.filterArray = filterArray(self.sourceArray, self.filterDistance, self.maxArea); //筛选后的线

			if(self.filterArray.length < 2) {
				self.errMessage = '符合条件的坐标点小于2个';
				return;
			}

			self.routeCoords = calculationPoint(self.filterArray); //增加点位后的线.

			self.routeLength = self.routeCoords.length;

			var route = new ol.geom.LineString(self.filterArray); //轨迹线

			self.index = 0; //当前所在轨迹线点位.

			self.routeFeature = new ol.Feature({ //轨迹线要素
				type: 'route',
				geometry: route
			});

			self.geoMarker = new ol.Feature({ //当前点位置
				type: 'icon',
				geometry: new ol.geom.Point(self.routeCoords[self.index])
			});

			self.startMarker = new ol.Feature({ //起始点
				type: 'point',
				geometry: new ol.geom.Point(self.routeCoords[0])
			});
			self.endMarker = new ol.Feature({ //结束点
				type: 'point',
				geometry: new ol.geom.Point(self.routeCoords[self.routeLength - 1])
			});

			self.vectorLayer = new ol.layer.Vector({
				source: new ol.source.Vector({
					features: [self.routeFeature, self.startMarker, self.endMarker, self.geoMarker]
				}),
				style: function(feature) {
					return self._styles[feature.get('type')];
				}
			});

			if(self._allPointShow) { //显示轨迹点.
				var markers = createFeatures(self.filterArray);
				var source = self.vectorLayer.getSource();
				source.addFeatures(markers);
			}

			oMap.map.addLayer(self.vectorLayer);

			var areaArray = getFixArea(self.filterArray);

			oMap.map.getView().fit(areaArray, oMap.map.getSize(), {
				duration: 1500
			});

			self._status = STATUS_INIT;
		};

		function createFeatures(arr) {
			var markers = [];
			for(var i = 0; i < arr.length; i++) {
				var temp = arr[i];
				var marker = new ol.Feature({
					type: 'point',
					_route: temp,
					geometry: new ol.geom.Point(temp)
				});
				markers.push(marker);
			}
			return markers;
		}

		TrackBack.prototype.start = function(callback) {
			var self = this;
			if(self._status == STATUS_INIT && self.errMessage == null) { //初始化状态
				self.now = new Date().getTime();

				self.callback = callback;

				var source = self.vectorLayer.getSource();

				source.removeFeature(self.geoMarker);

				self._status = STATUS_START;

				oMap.map.on('postcompose', self._moveFeature, self);
			} else if(self._status == STATUS_PAUSE) {
				self._status = STATUS_START;
			}

		};

		TrackBack.prototype.pause = function(callback) {
			var self = this;
			if(self._status == STATUS_START) { //开始状态才能暂停.
				self._status = STATUS_PAUSE;
				return true;
			} else {
				return false;
			}
		};

		TrackBack.prototype._moveFeature = function(event) {
			var self = this;
			var vectorContext = event.vectorContext;
			var frameState = event.frameState;
			if(self._status == STATUS_START) {
				//				var elapsedTime = frameState.time - now;
				self.index += self.speed;

				if(self.index >= self.routeLength || self.index < 0) {
					self.index = self.index < 0 ? 0 : self.routeLength;
					self._stopAnimation();
					return;
				}
				var currentPoint = new ol.geom.Point(self.routeCoords[self.index]);
				self.currentFeature = new ol.Feature(currentPoint);

				vectorContext.drawFeature(self.currentFeature, self._styles.icon);

				oMap.map.render();

			} else if(self._status == STATUS_PAUSE) {
				//暂停
				var currentPoint = new ol.geom.Point(self.routeCoords[self.index]);
				self.currentFeature = new ol.Feature(currentPoint);
				vectorContext.drawFeature(self.currentFeature, self._styles.icon);
				oMap.map.render();

			} else {
				//初始化 or 销毁状态.
			}

		};

		TrackBack.prototype._stopAnimation = function() {
			var self = this;
			if(self._status == STATUS_START) {
				var coord = self.currentFeature.getGeometry().getCoordinates();
				self.geoMarker.getGeometry().setCoordinates(coord);
				var source = self.vectorLayer.getSource();
				source.addFeature(self.geoMarker);
			}

			oMap.map.unByKey('postcompose');

			if(self._status == STATUS_START || self._status == STATUS_PAUSE) {
				self._status = STATUS_END;
				if(typeof self.callback == 'function') self.callback();
			}

			self._status = STATUS_END;

		};

		//筛选点
		function filterArray(xlArr, distance, maxArea) {
			var ar = [];

			if(xlArr.length == 0) return [];
			var p1 = null;
			//var arr = xlArr.slice(0);	//clone	
			//删除异常点的 两点距离如果大于3倍就剔除算法存在缺陷,先不考虑
			var arr = xlArr;

			for(var i = 0; i < arr.length; i++) {
				var point = arr[i];

				if(isInArea(maxArea, point[0], point[1])) {
					if(largeLength(p1, point, distance)) {
						ar.push(point);
						p1 = point;
					}
				}
			}
			return ar;

			//有缺陷.
			function abnormalPoint(p1, p2, p3) {
				var len1 = getLength(p1, p2);
				var len2 = getLength(p2, p3);
				if(len1 * 3 < len2) {
					return false;
				} else {
					return true;
				}

			}

			function getLength(p1, p2) {
				var len = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p2[1], 2));
				return len;
			}

			//判断距离大于要求距离.
			function largeLength(p1, p2, distance) {
				if(p2 == null) return false;
				if(p1 == null) return true;
				//var line = new ol.geom.LineString([p1, p2]);
				//var dis = line.getLength(); //应该可以直接算TODO
				var dis = getLength(p1, p2);

				if(dis >= distance) {
					return true;
				}
				return false;
			}

			//判断在范围内
			function isInArea(area, x, y) {
				if(!area) return true;
				if(area[0] > x || area[1] > y) return false;
				if(area[2] < x || area[3] < y) return false;
				return true;
			}

		}

		//分成N个点.
		function calculationPoint(points) {

			var arr = [];
			arr.push(points[0]);
			for(var i = 1; i < points.length; i++) {
				var p1 = points[i];
				var p2 = points[i - 1];
				var _x = p1[0] - p2[0];
				var _y = p1[1] - p2[1];
				for(var z = 1; z <= ADD_NUMBER; z++) {
					var tempX = p2[0] + _x / ADD_NUMBER * z;
					var tempY = p2[1] + _y / ADD_NUMBER * z;
					arr.push([tempX, tempY]);
				}
			}
			return arr;
		}

		function getDistance(p1, p2) {
			//return((p2[0] - p1[0]) ^ 2 + (p2[1] - p1[1]) ^ 2) ^ 0.5
			return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
		}

		function getFixArea(array) {
			var minx = null;
			var miny = null;
			var maxx = null;
			var maxy = null;
			for(var i = 0; i < array.length; i++) {
				var po = array[i];
				if(minx == null || minx > po[0]) minx = po[0];
				if(miny == null || miny > po[1]) miny = po[1];
				if(maxx == null || maxx < po[0]) maxx = po[0];
				if(maxy == null || maxy < po[1]) maxy = po[1];
			}
			return [minx, miny, maxx, maxy];
		}

		var rst = new TrackBack(lines, options);

		return rst;
	};

	function _createMarker(defaults) {

		var self = this;
		defaults.x = parseFloat(defaults.x);
		defaults.y = parseFloat(defaults.y);
		var obj = {
			geometry: new ol.geom.Point([defaults.x, defaults.y]),
			id: defaults.id || new Date().getTime(),
			click: defaults.click
		};
		for(var name in defaults) {
			if(!(name in obj)) {
				obj[name] = defaults[name];
			}
		}
		var iconFeature = new ol.Feature(obj);
		var iconStyle = _createStyle(defaults);

		iconFeature.setStyle(iconStyle);

		return iconFeature;

	}

	function _createStyle(obj) {
		var iconStyle = null;
		if(obj.src && obj.src != '') {
			iconStyle = new ol.style.Style({
				image: new ol.style.Icon(({
					anchor: [0.5, 0.96],
					anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					src: obj.src,
					//imgSize: [50, 50]
				}))
			});
		} else {
			iconStyle = new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					snapToPixel: false,
					fill: new ol.style.Fill({
						color: '#0082c3'
					}),
					stroke: new ol.style.Stroke({
						color: '#0082c3',
						width: 1
					})
				})
			});
		}
		return iconStyle;
	}

	/**
	 * 画线
	 * @param {Array} lines [[120.49038, 30.0087014643942], [120.50038, 30.0087014643942],[120.51038,30.0087014643942]]
	 */
	TGisMap.prototype.addLine = function(lines, options, vsource) {
		var thas = this;
		var _option = $.extend({
			color: [0, 130, 195, 0.5],
			center: null,
			width: 3
		}, options);

		var feature = new ol.Feature({
			geometry: new ol.geom.LineString(lines)

		});

		feature.setStyle(new ol.style.Style({
			stroke: new ol.style.Stroke({
				width: _option.width,
				color: _option.color
			})
		}));

		var source = vsource == undefined ? thas.lineLayer.getSource() : vsource;

		//source.clear();

		source.addFeature(feature);

		if(_option.center) {
			thas.map.getView().setCenter([_option.center.x, _option.center.y]);
		}

	}

	TGisMap.prototype.addLines = function(lines, options, vsource) {
		var thas = this;
		var _option = $.extend({
			color: [0, 130, 195, 0.5],
			center: null,
			width: 3
		}, options);

		var featureLine = [];

		for(var i = 0; i < lines.length; i++) {
			var line = lines[i];
			var feature = new ol.Feature({
				geometry: new ol.geom.LineString(line)

			});
			feature.setStyle(new ol.style.Style({
				stroke: new ol.style.Stroke({
					width: _option.width,
					color: _option.color
				})
			}));

			featureLine.push(feature);

			var source = vsource == undefined ? thas.lineLayer.getSource() : vsource;

			source.clear();

			source.addFeatures(featureLine);

			if(_option.center) {
				thas.map.getView().setCenter([_option.center.x, _option.center.y]);
			}
		}
	}

	//多边形.
	TGisMap.prototype.addPolygon = function(draws, options) {
		var thas = this;
		var _option = $.extend({
			color: [0, 130, 195, 0.5], //多边形线条颜色
			fillColor: [0, 130, 195, 0.5], //填充颜色
			center: null,
			width: 3
		}, options);
		var polygonFeature = new ol.Feature(new ol.geom.Polygon([draws]));
		polygonFeature.setStyle(new ol.style.Style({
			stroke: new ol.style.Stroke({
				width: _option.width,
				color: _option.color
			}),
			fill: new ol.style.Fill({
				color: _option.fillColor
			})
		}));

		var source = new ol.source.Vector({
			features: [polygonFeature]
		});

		thas.removePolygon();

		thas.polygonLayer = new ol.layer.Vector({
			source: source
		});
		thas.map.addLayer(thas.polygonLayer);
		if(options.center) {
			thas.map.getView().setCenter([options.center.x, options.center.y]);
		}
	}

	//添加标注
	TGisMap.prototype.addMarker = function(opts, source) {
		var defaults = {
			x: 0,
			y: 0,
			//			src: 'images/marker.png',
			click: function(feature) {
				alert(feature.H.id);
			},
			id: new Date().getTime(),
			isCenter: false
		};
		$.extend(defaults, opts);
		var thas = this;

		var iconFeature = _createMarker(defaults);

		var vectorSource = source == undefined ? thas.markerLayer.getSource() : source;

		vectorSource.clear();

		vectorSource.addFeature(iconFeature);

		thas.markers = [iconFeature];

		if(defaults.isCenter == true) {
			thas.map.getView().setCenter([defaults.x, defaults.y]);
		}
	}

	//多个点
	TGisMap.prototype.addMarkers = function(opts, options, source) {
		var obj = null;
		var features = [];
		var _options = $.extend({
			center: null
		}, options);
		for(var i = 0; i < opts.length; i++) {
			var opt = opts[i];
			var defaults = $.extend({
				x: 0,
				y: 0,
				src: null,
				click: function(feature) {
					//alert(feature.H.id);
				},
				id: new Date().getTime(),
			}, opt);
			var iconFeature = _createMarker(defaults);
			features.push(iconFeature);
			if(defaults.isCenter === true) {
				obj = defaults;
			}
		}
		var self = this;
		var vectorSource = source == undefined ? self.markerLayer.getSource() : source;

		vectorSource.clear();
		vectorSource.addFeatures(features);

		self.markers = features;

		if(_options.center) {
			self.map.getView().setCenter([_options.center.x, _options.center.y]);
		} else if(obj) {
			self.map.getView().setCenter([obj.x, obj.y]);
		}
	};
	//热力图.
	TGisMap.prototype.addHeatmapMarkers = function(opts, options) {
		var obj = null;
		var features = []; //热力图.
		var features2 = []; //坐标点图.
		var _options = $.extend({
			center: null
		}, options);
		for(var i = 0; i < opts.length; i++) {
			var opt = opts[i];
			var defaults = $.extend({
				x: 0,
				y: 0,
				src: null,
				click: function(feature) {},
				id: new Date().getTime(),
			}, opt);
			var iconFeature = _createMarker(defaults);
			features2.push(iconFeature);
			if(defaults.isCenter === true) {
				obj = defaults;
			}
			defaults.src = '';
			iconFeature = _createMarker(defaults);
			features.push(iconFeature);

		}
		var self = this;

		var source = self.heatmapLayer.getSource();

		source.clear();
		source.addFeatures(features);

		var source2 = self.heatmapLayer2.getSource();
		source2.clear();
		source2.addFeatures(features2);

		if(_options.center && _options.center.x != null) {
			self.map.getView().setCenter([_options.center.x, _options.center.y]);
		} else if(obj) {
			self.map.getView().setCenter([obj.x, obj.y]);
		}
	}

	TGisMap.prototype.createMarker = _createMarker;

	//聚合点
	TGisMap.prototype.addClusterMarkers = function(opts, options) {
		var obj = null;
		var features = [];
		var _options = $.extend({
			center: null
		}, options);
		for(var i = 0; i < opts.length; i++) {
			var opt = opts[i];
			var defaults = $.extend({
				x: 0,
				y: 0,
				src: null,
				click: function(feature) {},
				id: new Date().getTime(),
			}, opt);
			var iconFeature = _createMarker(defaults);
			features.push(iconFeature);
			if(defaults.isCenter === true) {
				obj = defaults;
			}
		}
		var self = this;

		self.clusterFeatureSource.addFeatures(features);

		//self.clusterSource.clear(); //清空之前的聚集点.
		//self.clusterSource.addFeatures(features);
		if(_options.center && _options.center.x != null) {
			self.map.getView().setCenter([_options.center.x, _options.center.y]);
		} else if(obj) {
			self.map.getView().setCenter([obj.x, obj.y]);
		}
	}

	//添加所有责任网格矢量图层
	TGisMap.prototype.addZRWGLayer = function() {
		var self = this;

		if(!configUrl.gridMapServerUrl || configUrl.gridMapServerUrl == "") {
			return;
		}
		var gridLayer = self.gridLayer;

		self.map.on('pointermove', function(evt) {
			if(evt.dragging) {
				return;
			}
			var pixel = self.map.getEventPixel(evt.originalEvent);
			highlightFeature(pixel);
		});

		gridLayer.getSource().clear();
		var esrijsonFormat = new ol.format.EsriJSON();
		//请求所在的责任网格
		var zrwgLayerUrl = configUrl.gridMapServerUrl + "?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=1%3D1&time=&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
		console.log(zrwgLayerUrl);
		$.ajax({
			url: zrwgLayerUrl,
			dataType: 'jsonp',
			success: function(response) {
				if(response.error) {
					alert(response.error.message + '\n' +
						response.error.details.join('\n'));
				} else {
					var features = esrijsonFormat.readFeatures(response);

					for(var i = 0; i < features.length; i++) {
						var feature = features[i];
						var name = feature.get("网格名称");
						feature.setStyle(new ol.style.Style({
							fill: new ol.style.Fill({
								color: 'rgba(255, 0, 51, 0)'
							}),
							stroke: new ol.style.Stroke({
								color: 'rgba(255, 0, 51, 1)',
								lineDash: [2, 1],
								width: 1
							}),
							text: new ol.style.Text({
								text: name,
								fill: new ol.style.Fill({
									color: 'red'
								})
							})
						}));
					}

					if(features.length > 0) {
						gridLayer.getSource().addFeatures(features);

					}
				}
			}
		});

		var highlightFeature = function(pixel) {
			self.map.getTargetElement().style.cursor = '';
			self.map.getTargetElement().title = '';

			self.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				var gridName = feature.get('网格名称');
				//self.map.getTargetElement().style.cursor = 'pointer';
				//self.map.getTargetElement().title = gridName;
				gridLayer.getSource().forEachFeature(function(f) {
					var name = f.get("网格名称");

					f.setStyle(new ol.style.Style({
						fill: new ol.style.Fill({
							color: 'rgba(255, 0, 51, 0)'
						}),
						stroke: new ol.style.Stroke({
							color: 'rgba(255, 0, 51, 1)',
							lineDash: [2, 1],
							width: 1
						}),
						text: new ol.style.Text({
							text: name,
							fill: new ol.style.Fill({
								color: 'red'
							})
						})
					}));

					var zoom = self.map.getView().getZoom();

					if(zoom <= 17) {
						if(name == gridName) {
							feature.setStyle(new ol.style.Style({
								fill: new ol.style.Fill({
									color: 'rgba(255, 0, 51, 0.2)'
								}),
								stroke: new ol.style.Stroke({
									color: 'rgba(255, 0, 51, 1)',
									lineDash: [2, 1],
									width: 1
								}),
								text: new ol.style.Text({
									text: name,
									fill: new ol.style.Fill({
										color: 'red'
									})
								})
							}));
						}
					}
				});
				//return true 停止循环遍历
				return true;
			}, {
				layerFilter: function(layer) {
					if(layer == gridLayer) {
						return true;
					} else {
						return false;
					}
				}
			});
		};
	}

	window.TGisMap = TGisMap;

})(window, jQuery);