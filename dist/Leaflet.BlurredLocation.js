(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
*  Create a Canvas as ImageOverlay to draw the Lat/Lon Graticule,
*  and show the axis tick label on the edge of the map.
*  Author: lanwei@cloudybay.com.tw
*/

L.LatLngGraticule = L.Layer.extend({
    options: {
        showLabel: true,
        opacity: 1,
        weight: 0.8,
        color: '#aaa',
        font: '12px Verdana',
        lngLineCurved: 0,
        latLineCurved: 0,
        zoomInterval: [
            {start: 2, end: 2, interval: 40},
            {start: 3, end: 3, interval: 20},
            {start: 4, end: 4, interval: 10},
            {start: 5, end: 7, interval: 5},
            {start: 8, end: 20, interval: 1}
        ]
    },

    initialize: function (options) {
        L.setOptions(this, options);

        var defaultFontName = 'Verdana';
        var _ff = this.options.font.split(' ');
        if (_ff.length < 2) {
            this.options.font += ' ' + defaultFontName;
        }

        if (!this.options.fontColor) {
            this.options.fontColor = this.options.color;
        }

        if (this.options.zoomInterval) {
            if (this.options.zoomInterval.latitude) {
                this.options.latInterval = this.options.zoomInterval.latitude;
                if (!this.options.zoomInterval.longitude) {
                    this.options.lngInterval = this.options.zoomInterval.latitude;
                }
            }
            if (this.options.zoomInterval.longitude) {
                this.options.lngInterval = this.options.zoomInterval.longitude;
                if (!this.options.zoomInterval.latitude) {
                    this.options.latInterval = this.options.zoomInterval.longitude;
                }
            }
            if (!this.options.latInterval) {
                this.options.latInterval = this.options.zoomInterval;
            }
            if (!this.options.lngInterval) {
                this.options.lngInterval = this.options.zoomInterval;
            }
        }
    },

    onAdd: function (map) {
        this._map = map;

        if (!this._container) {
            this._initCanvas();
        }

        map._panes.overlayPane.appendChild(this._container);

        map.on('viewreset', this._reset, this);
        map.on('move', this._reset, this);
        map.on('moveend', this._reset, this);

// 		if (map.options.zoomAnimation && L.Browser.any3d) {
// 			map.on('zoom', this._animateZoom, this);
// 		}

        this._reset();
    },

    onRemove: function (map) {
        map.getPanes().overlayPane.removeChild(this._container);

        map.off('viewreset', this._reset, this);
        map.off('move', this._reset, this);
        map.off('moveend', this._reset, this);

// 		if (map.options.zoomAnimation) {
// 			map.off('zoom', this._animateZoom, this);
// 		}
    },

    addTo: function (map) {
        map.addLayer(this);
        return this;
    },

    setOpacity: function (opacity) {
        this.options.opacity = opacity;
        this._updateOpacity();
        return this;
    },

    bringToFront: function () {
        if (this._canvas) {
            this._map._panes.overlayPane.appendChild(this._canvas);
        }
        return this;
    },

    bringToBack: function () {
        var pane = this._map._panes.overlayPane;
        if (this._canvas) {
            pane.insertBefore(this._canvas, pane.firstChild);
        }
        return this;
    },

    getAttribution: function () {
        return this.options.attribution;
    },

    _initCanvas: function () {
        this._container = L.DomUtil.create('div', 'leaflet-image-layer');

        this._canvas = L.DomUtil.create('canvas', '');

        if (this._map.options.zoomAnimation && L.Browser.any3d) {
            L.DomUtil.addClass(this._canvas, 'leaflet-zoom-animated');
        } else {
            L.DomUtil.addClass(this._canvas, 'leaflet-zoom-hide');
        }

        this._updateOpacity();

        this._container.appendChild(this._canvas);

        L.extend(this._canvas, {
            onselectstart: L.Util.falseFn,
            onmousemove: L.Util.falseFn,
            onload: L.bind(this._onCanvasLoad, this)
        });
    },

// 	_animateZoom: function (e) {
// 		var map = this._map,
// 			container = this._container,
// 			canvas = this._canvas,
// 			zoom = map.getZoom(),
// 			center = map.getCenter(),
// 			scale = map.getZoomScale(zoom),
// 			nw = map.containerPointToLatLng([0, 0]),
// 			se = map.containerPointToLatLng([canvas.width, canvas.height]),
//
// 			topLeft = map._latLngToNewLayerPoint(nw, zoom, center),
// 			size = map._latLngToNewLayerPoint(se, zoom, center)._subtract(topLeft),
// 			origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));
//
// 		L.DomUtil.setTransform(container, origin, scale);
// 	},

    _reset: function () {
        var container = this._container,
            canvas = this._canvas,
            size = this._map.getSize(),
            lt = this._map.containerPointToLayerPoint([0, 0]);

        L.DomUtil.setPosition(container, lt);

        container.style.width = size.x + 'px';
        container.style.height = size.y + 'px';

        canvas.width  = size.x;
        canvas.height = size.y;
        canvas.style.width  = size.x + 'px';
        canvas.style.height = size.y + 'px';

        this.__calcInterval();

        this.__draw(true);
    },

    _onCanvasLoad: function () {
        this.fire('load');
    },

    _updateOpacity: function () {
        L.DomUtil.setOpacity(this._canvas, this.options.opacity);
    },

    __format_lat: function(lat) {
        if (this.options.latFormatTickLabel) {
            return this.options.latFormatTickLabel(lat);
        }

        // todo: format type of float
        if (lat < 0) {
            return '' + (lat*-1) + 'S';
        }
        else if (lat > 0) {
            return '' + lat + 'N';
        }
        return '' + lat;
    },

    __format_lng: function(lng) {
        if (this.options.lngFormatTickLabel) {
            return this.options.lngFormatTickLabel(lng);
        }

        // todo: format type of float
        if (lng > 180) {
            return '' + (360 - lng) + 'W';
        }
        else if (lng > 0 && lng < 180) {
            return '' + lng + 'E';
        }
        else if (lng < 0 && lng > -180) {
            return '' + (lng*-1) + 'W';
        }
        else if (lng == -180) {
            return '' + (lng*-1);
        }
        else if (lng < -180) {
            return '' + (360 + lng) + 'W';
        }
        return '' + lng;
    },

    __calcInterval: function() {
        var zoom = this._map.getZoom();
        if (this._currZoom != zoom) {
            this._currLngInterval = 0;
            this._currLatInterval = 0;
            this._currZoom = zoom;
        }

        var interv;

        if (!this._currLngInterval) {
            try {
                for (var idx in this.options.lngInterval) {
                    var dict = this.options.lngInterval[idx];
                    if (dict.start <= zoom) {
                        if (dict.end && dict.end >= zoom) {
                            this._currLngInterval = dict.interval;
                            break;
                        }
                    }
                }
            }
            catch(e) {
                this._currLngInterval = 0;
            }
        }

        if (!this._currLatInterval) {
            try {
                for (var idx in this.options.latInterval) {
                    var dict = this.options.latInterval[idx];
                    if (dict.start <= zoom) {
                        if (dict.end && dict.end >= zoom) {
                            this._currLatInterval = dict.interval;
                            break;
                        }
                    }
                }
            }
            catch(e) {
                this._currLatInterval = 0;
            }
        }
    },

    __draw: function(label) {
        function _parse_px_to_int(txt) {
            if (txt.length > 2) {
                if (txt.charAt(txt.length-2) == 'p') {
                    txt = txt.substr(0, txt.length-2);
                }
            }
            try {
                return parseInt(txt, 10);
            }
            catch(e) {}
            return 0;
        };

        var canvas = this._canvas,
            map = this._map,
            curvedLon = this.options.lngLineCurved,
            curvedLat = this.options.latLineCurved;

        if (L.Browser.canvas && map) {
            if (!this._currLngInterval || !this._currLatInterval) {
                this.__calcInterval();
            }

            var latInterval = this._currLatInterval,
                lngInterval = this._currLngInterval;

            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = this.options.weight;
            ctx.strokeStyle = this.options.color;
            ctx.fillStyle = this.options.fontColor;

            if (this.options.font) {
                ctx.font = this.options.font;
            }
            var txtWidth = ctx.measureText('0').width;
            var txtHeight = 12;
            try {
                var _font_size = ctx.font.split(' ')[0];
                txtHeight = _parse_px_to_int(_font_size);
            }
            catch(e) {}

            var ww = canvas.width,
                hh = canvas.height;

            var lt = map.containerPointToLatLng(L.point(0, 0));
            var rt = map.containerPointToLatLng(L.point(ww, 0));
            var rb = map.containerPointToLatLng(L.point(ww, hh));

            var _lat_b = rb.lat,
                _lat_t = lt.lat;
            var _lon_l = lt.lng,
                _lon_r = rt.lng;

            var _point_per_lat = (_lat_t - _lat_b) / (hh * 0.2);
            if (_point_per_lat < 1) { _point_per_lat = 1; }
            if (_lat_b < -90) {
                _lat_b = -90;
            }
            else {
                _lat_b = parseInt(_lat_b - _point_per_lat, 10);
            }

            if (_lat_t > 90) {
                _lat_t = 90;
            }
            else {
                _lat_t = parseInt(_lat_t + _point_per_lat, 10);
            }

            var _point_per_lon = (_lon_r - _lon_l) / (ww * 0.2);
            if (_point_per_lon < 1) { _point_per_lon = 1; }
            if (_lon_l > 0 && _lon_r < 0) {
                _lon_r += 360;
            }
            _lon_r = parseInt(_lon_r + _point_per_lon, 10);
            _lon_l = parseInt(_lon_l - _point_per_lon, 10);

            var ll, latstr, lngstr, _lon_delta = 0.5;
            function __draw_lat_line(self, lat_tick) {
                ll = map.latLngToContainerPoint(L.latLng(lat_tick, _lon_l));
                latstr = self.__format_lat(lat_tick);
                txtWidth = ctx.measureText(latstr).width;

                if (curvedLat) {
                    if (typeof(curvedLat) == 'number') {
                        _lon_delta = curvedLat;
                    }

                    var __lon_left = _lon_l, __lon_right = _lon_r;
                    if (ll.x > 0) {
                        var __lon_left = map.containerPointToLatLng(L.point(0, ll.y));
                        __lon_left = __lon_left.lng - _point_per_lon;
                        ll.x = 0;
                    }
                    var rr = map.latLngToContainerPoint(L.latLng(lat_tick, __lon_right));
                    if (rr.x < ww) {
                        __lon_right = map.containerPointToLatLng(L.point(ww, rr.y));
                        __lon_right = __lon_right.lng + _point_per_lon;
                        if (__lon_left > 0 && __lon_right < 0) {
                            __lon_right += 360;
                        }
                    }

                    ctx.beginPath();
                    ctx.moveTo(ll.x, ll.y);
                    var _prev_p = null;
                    for (var j=__lon_left; j<=__lon_right; j+=_lon_delta) {
                        rr = map.latLngToContainerPoint(L.latLng(lat_tick, j));
                        ctx.lineTo(rr.x, rr.y);

                        if (self.options.showLabel && label && _prev_p != null) {
                            if (_prev_p.x < 0 && rr.x >= 0) {
                                var _s = (rr.x - 0) / (rr.x - _prev_p.x);
                                var _y = rr.y - ((rr.y - _prev_p.y) * _s);
                                ctx.fillText(latstr, 0, _y + (txtHeight/2));
                            }
                            else if (_prev_p.x <= (ww-txtWidth) && rr.x > (ww-txtWidth)) {
                                var _s = (rr.x - ww) / (rr.x - _prev_p.x);
                                var _y = rr.y - ((rr.y - _prev_p.y) * _s);
                                ctx.fillText(latstr, ww-txtWidth, _y + (txtHeight/2)-2);
                            }
                        }

                        _prev_p = {x:rr.x, y:rr.y, lon:j, lat:i};
                    }
                    ctx.stroke();
                }
                else {
                    var __lon_right = _lon_r;
                    var rr = map.latLngToContainerPoint(L.latLng(lat_tick, __lon_right));
                    if (curvedLon) {
                        __lon_right = map.containerPointToLatLng(L.point(0, rr.y));
                        __lon_right = __lon_right.lng;
                        rr = map.latLngToContainerPoint(L.latLng(lat_tick, __lon_right));

                        var __lon_left = map.containerPointToLatLng(L.point(ww, rr.y));
                        __lon_left = __lon_left.lng;
                        ll = map.latLngToContainerPoint(L.latLng(lat_tick, __lon_left));
                    }

                    ctx.beginPath();
                    ctx.moveTo(ll.x+1, ll.y);
                    ctx.lineTo(rr.x-1, rr.y);
                    ctx.stroke();
                    if (self.options.showLabel && label) {
                        var _yy = ll.y + (txtHeight/2)-2;
                        ctx.fillText(latstr, 0, _yy);
                        ctx.fillText(latstr, ww-txtWidth, _yy);
                    }
                }
            };

            if (latInterval > 0) {
                for (var i=latInterval; i<=_lat_t; i+=latInterval) {
                    if (i >= _lat_b) {
                        __draw_lat_line(this, i);
                    }
                }
                for (var i=0; i>=_lat_b; i-=latInterval) {
                    if (i <= _lat_t) {
                        __draw_lat_line(this, i);
                    }
                }
            }

            function __draw_lon_line(self, lon_tick) {
                lngstr = self.__format_lng(lon_tick);
                txtWidth = ctx.measureText(lngstr).width;
                var bb = map.latLngToContainerPoint(L.latLng(_lat_b, lon_tick));

                if (curvedLon) {
                    if (typeof(curvedLon) == 'number') {
                        _lat_delta = curvedLon;
                    }

                    ctx.beginPath();
                    ctx.moveTo(bb.x, bb.y);
                    var _prev_p = null;
                    for (var j=_lat_b; j<_lat_t; j+=_lat_delta) {
                        var tt = map.latLngToContainerPoint(L.latLng(j, lon_tick));
                        ctx.lineTo(tt.x, tt.y);

                        if (self.options.showLabel && label && _prev_p != null) {
                            if (_prev_p.y > 8 && tt.y <= 8) {
                                ctx.fillText(lngstr, tt.x - (txtWidth/2), txtHeight);
                            }
                            else if (_prev_p.y >= hh && tt.y < hh) {
                                ctx.fillText(lngstr, tt.x - (txtWidth/2), hh-2);
                            }
                        }

                        _prev_p = {x:tt.x, y:tt.y, lon:lon_tick, lat:j};
                    }
                    ctx.stroke();
                }
                else {
                    var __lat_top = _lat_t;
                    var tt = map.latLngToContainerPoint(L.latLng(__lat_top, lon_tick));
                    if (curvedLat) {
                        __lat_top = map.containerPointToLatLng(L.point(tt.x, 0));
                        __lat_top = __lat_top.lat;
                        if (__lat_top > 90) { __lat_top = 90; }
                        tt = map.latLngToContainerPoint(L.latLng(__lat_top, lon_tick));

                        var __lat_bottom = map.containerPointToLatLng(L.point(bb.x, hh));
                        __lat_bottom = __lat_bottom.lat;
                        if (__lat_bottom < -90) { __lat_bottom = -90; }
                        bb = map.latLngToContainerPoint(L.latLng(__lat_bottom, lon_tick));
                    }

                    ctx.beginPath();
                    ctx.moveTo(tt.x, tt.y+1);
                    ctx.lineTo(bb.x, bb.y-1);
                    ctx.stroke();

                    if (self.options.showLabel && label) {
                        ctx.fillText(lngstr, tt.x - (txtWidth/2), txtHeight+1);
                        ctx.fillText(lngstr, bb.x - (txtWidth/2), hh-3);
                    }
                }
            };

            if (lngInterval > 0) {
                for (var i=lngInterval; i<=_lon_r; i+=lngInterval) {
                    if (i >= _lon_l) {
                        __draw_lon_line(this, i);
                    }
                }
                for (var i=0; i>=_lon_l; i-=lngInterval) {
                    if (i <= _lon_r) {
                        __draw_lon_line(this, i);
                    }
                }
            }
        }
    }

});

L.latlngGraticule = function (options) {
    return new L.LatLngGraticule(options);
};

},{}],2:[function(require,module,exports){
BlurredLocation = function BlurredLocation(options) {

  var blurredLocation = this;
  var blurred = true;
  var DEFAULT_PRECISION = 6;
  require('leaflet-graticule');

  options = options || {};
  options.location = options.location || {
    lat: 1.0,
    lon: 1.0
  };

  options.zoom = options.zoom || 6;

  options.mapID = options.mapID || 'map'

  options.map = options.map || new L.Map(options.mapID,{})
                                    .setView([options.location.lat, options.location.lon], options.zoom);

  options.pixels = options.pixels || 400;

  options.gridSystem = options.gridSystem || require('./core/gridSystem.js');

  options.Interface = options.Interface || require('./ui/Interface.js');

  gridSystemOptions = options.gridSystemOptions || {};
  gridSystemOptions.map = options.map;
  gridSystemOptions.gridWidthInPixels = gridWidthInPixels;
  gridSystemOptions.getMinimumGridWidth = getMinimumGridWidth;

  gridSystem = options.gridSystem(gridSystemOptions);

  InterfaceOptions = options.InterfaceOptions || {};
  InterfaceOptions.panMap = panMap;
  InterfaceOptions.getPlacenameFromCoordinates = getPlacenameFromCoordinates;
  InterfaceOptions.getLat = getLat;
  InterfaceOptions.getLon = getLon;
  InterfaceOptions.map = options.map;
  InterfaceOptions.getPrecision = getPrecision;

  Interface = options.Interface(InterfaceOptions);

  var tileLayer = L.tileLayer("https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png").addTo(options.map);

  options.map.options.scrollWheelZoom = "center";
  options.map.options.touchZoom = "center";

  // options.map.setView([options.location.lat, options.location.lon], options.zoom);

  function getLat() {
    if(isBlurred())
      return parseFloat(truncateToPrecision(options.map.getCenter().lat, getPrecision()));
    else
      return parseFloat(truncateToPrecision(options.map.getCenter().lat, DEFAULT_PRECISION));
  }

  function getLon() {
    if(isBlurred())
      return parseFloat(truncateToPrecision(options.map.getCenter().lng, getPrecision()));
    else
      return parseFloat(truncateToPrecision(options.map.getCenter().lng, DEFAULT_PRECISION));
  }
  function goTo(lat, lon, zoom) {
    options.map.setView([lat, lon], zoom);
  }

  function setZoom(zoom) {
    options.map.setZoom(zoom);
  }

  function geocodeStringAndPan(string, onComplete) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + string.split(" ").join("+");
    var Blurred = $.ajax({
        async: false,
        url: url
    });
    onComplete = onComplete || function onComplete(geometry) {
      $("#lat").val(geometry.lat);
      $("#lng").val(geometry.lng);

      options.map.setView([geometry.lat, geometry.lng], options.zoom);
    }
    onComplete(Blurred.responseJSON.results[0].geometry.location);
  }

  function getSize() {
    return options.map.getSize();
  }

  function panMapToGeocodedLocation(selector) {
    var input = document.getElementById(selector);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
      setTimeout(function () {
        var str = input.value;
        geocodeStringAndPan(str);
      }, 10);
    });
  };

  function panMap(lat, lng) {
    options.map.panTo(new L.LatLng(lat, lng));
  }

  function getPlacenameFromCoordinates(lat, lng, precision, onResponse) {
      $.ajax({
        url:"https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng,
        success: function(result) {
          if(result.results[0]) {
            var country;
            var fullAddress = result.results[0].formatted_address.split(",");
            for (i in result.results) {
              if(result.results[i].types.indexOf("country") != -1) {
                //If the type of location is a country assign it to thr input box value
                country = result.results[i].formatted_address;
              }
            }
            if (!country) country = fullAddress[fullAddress.length - 1];

            if(precision <= 0) onResponse(country);

            else if(precision == 1) {
              if (fullAddress.length>=2) onResponse(fullAddress[fullAddress.length - 2] + ", " + country);
              else onResponse(country);
            }

            else if(precision >= 2) {
              if (fullAddress.length >= 3) onResponse(fullAddress[fullAddress.length - 3] + ", " + fullAddress[fullAddress.length - 2] + ", " + country);
              else if (fullAddress.length == 2) onResponse(fullAddress[fullAddress.length - 2] + ", " + country);
              else onResponse(country);
            }

            else onResponse(result.results[0].formatted_address);

        }
        else onResponse("Location unavailable");
      }
    });
  }

  function panMapByBrowserGeocode(checkbox) {
    var x = document.getElementById("location");
      if(checkbox.checked == true) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(displayPosition);
        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }

        function displayPosition(position) {
          panMap(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
        }
    }
  }

  function gridWidthInPixels(degrees) {
    var p1 = L.latLng(options.map.getCenter().lat, options.map.getCenter().lng);
    var p2 = L.latLng(p1.lat+degrees, p1.lng+degrees);
    var l1 = options.map.latLngToContainerPoint(p1);
    var l2 = options.map.latLngToContainerPoint(p2);
    return {
      x: Math.abs(l2.x - l1.x),
      y: Math.abs(l2.y - l1.y),
    }
  }

  function getMinimumGridWidth(pixels) {
    var degrees = 100.0, precision = -2;
    while(gridWidthInPixels(degrees).x > pixels) {
      degrees/= 10;
      precision+= 1;
    }
    return {
      precision: precision,
      degrees: degrees,
    }
  }

  function truncateToPrecision(number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
  };

  function getPrecision() {
    return getMinimumGridWidth(options.pixels).precision;
  }

  function getFullLat() {
    return parseFloat(options.map.getCenter().lat);
  }

  function getFullLon() {
    return parseFloat(options.map.getCenter().lng);
  }

  function setBlurred(boolean) {
      if(boolean && !blurred) {
        gridSystem.addGrid();
        blurred = true;
      }
      else if(!boolean) {
        blurred = false;
        gridSystem.removeGrid();
      }
      updateRectangleOnPan();
  }

  function isBlurred() {
    return blurred;
  }

  var rectangle;

  function drawCenterRectangle(bounds) {
    var precision = getPrecision();
    var interval = Math.pow(0.1, precision);
    if (!bounds[1][0]) {
      if (getFullLat() < 0) { bounds[0][0] = -1*interval; bounds[1][0] = 0; }
      else { bounds[1][0] = 1*interval; }
    }
    if (!bounds[1][1]) {
      if (getFullLon() < 0) { bounds[0][1] = -1*interval; bounds[1][1] = 0; }
      else { bounds[1][1] = 1*interval; }
    }
    if (rectangle) rectangle.remove();
    rectangle = L.rectangle(bounds, {color: "#ff0000", weight: 1}).addTo(options.map);
  }

  function updateRectangleOnPan() {
    var precision = getPrecision();
    var interval = Math.pow(10,-precision);
    var bounds = [[getLat(), getLon()], [getLat() + (getLat()/Math.abs(getLat()))*interval, getLon() + (getLon()/Math.abs(getLon()))*interval]];
    if(isBlurred()) {
        drawCenterRectangle(bounds);
        disableCenterMarker();
        enableCenterShade() ; 
    }
    else{
       enableCenterMarker();
       disableCenterShade();
    }
  }


  function setZoomByPrecision(precision) {
    var precisionTable = {'-2': 2, '-1': 3, '0':6, '1':10, '2':13, '3':16};
    setZoom(precisionTable[precision]);
  }

  function enableCenterShade() {
    options.map.on('move', updateRectangleOnPan);
  }

  function disableCenterShade() {
    if(rectangle) rectangle.remove();
    options.map.off('move',updateRectangleOnPan);
  }

  var marker = L.marker([getFullLat(), getFullLon()]);

  function updateMarker() {
    if(marker) marker.remove();
    marker = L.marker([getFullLat(), getFullLon()]).addTo(options.map);
  }

  function enableCenterMarker() {
    updateMarker();
    options.map.on('move', updateMarker);
  }

  function disableCenterMarker() {
    marker.remove();
    options.map.off('move',updateMarker);
  }

    updateRectangleOnPan();

  function geocodeWithBrowser(boolean) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
      goTo(position.coords.latitude, position.coords.longitude,options.zoom);
      });
    }
  }

  function displayLocation() {
    var lat = getLat();
    var lon = getLon();
    alert("Your current location is: " + lat +  ', ' + lon);
  }

  return {
    getLat: getLat,
    getLon: getLon,
    goTo: goTo,
    getSize: getSize,
    gridSystem: gridSystem,
    panMapToGeocodedLocation: panMapToGeocodedLocation,
    getPlacenameFromCoordinates: getPlacenameFromCoordinates,
    panMap: panMap,
    panMapByBrowserGeocode: panMapByBrowserGeocode,
    getMinimumGridWidth: getMinimumGridWidth,
    gridWidthInPixels: gridWidthInPixels,
    getPrecision: getPrecision,
    setZoom: setZoom,
    Interface: Interface,
    getFullLon: getFullLon,
    getFullLat: getFullLat,
    isBlurred: isBlurred,
    setBlurred: setBlurred,
    truncateToPrecision: truncateToPrecision,
    map: options.map,
    updateRectangleOnPan: updateRectangleOnPan,
    setZoomByPrecision: setZoomByPrecision,
    disableCenterShade: disableCenterShade,
    enableCenterShade: enableCenterShade,
    geocodeStringAndPan: geocodeStringAndPan,
    geocodeWithBrowser: geocodeWithBrowser,
    displayLocation: displayLocation,
  }
}

exports.BlurredLocation = BlurredLocation;

},{"./core/gridSystem.js":3,"./ui/Interface.js":4,"leaflet-graticule":1}],3:[function(require,module,exports){
module.exports = function gridSystem(options) {

  var map = options.map || document.getElementById("map") || L.map('map');
  options.cellSize = options.cellSize || { rows:100, cols:100 };

  require('leaflet-graticule');
  // require('../Leaflet.Graticule.js');

  options.graticuleOptions = options.graticuleOptions || {
                 showLabel: true,
                 zoomInterval: [
                   {start: 2, end: 2, interval: 100},
                   {start: 2, end: 5, interval: 10},
                   {start: 5, end: 9, interval: 1},
                   {start: 9, end: 12, interval: 0.1},
                   {start: 12, end: 15, interval: 0.01},
                   {start: 15, end: 20, interval: 0.001},
                 ],
                 opacity: 1,
                 color: '#ff0000',
                 latFormatTickLabel: function(lat) {
                            var decimalPlacesAfterZero = 0;
                            lat = lat.toString();
                            for(i in this.zoomInterval) {
                              if(map.getZoom() >= this.zoomInterval[i].start && map.getZoom() <= this.zoomInterval[i].end && this.zoomInterval[i].interval < 1)
                                decimalPlacesAfterZero = (this.zoomInterval[i].interval + '').split('.')[1].length;
                            }
                            if (lat < 0) {
                                lat = lat * -1;
                                lat = lat.toString();
                                if(lat.indexOf(".") != -1) lat = lat.split('.')[0] + '.' + lat.split('.')[1].slice(0,decimalPlacesAfterZero);
                                return '' + lat + 'S';
                            }
                            else if (lat > 0) {
                                if(lat.indexOf(".") != -1) lat = lat.split('.')[0] + '.' + lat.split('.')[1].slice(0,decimalPlacesAfterZero)
                                return '' + lat + 'N';
                            }
                            return '' + lat;
                          },

                lngFormatTickLabel: function(lng) {
                           var decimalPlacesAfterZero = 0;
                           lng = lng.toString();
                           for(i in this.zoomInterval) {
                             if(map.getZoom() >= this.zoomInterval[i].start && map.getZoom() <= this.zoomInterval[i].end && this.zoomInterval[i].interval < 1)
                               decimalPlacesAfterZero = (this.zoomInterval[i].interval + '').split('.')[1].length;
                           }
                           if (lng > 180) {
                               lng = 360 - lng;
                               lng = lng.toString();
                               if(lng.indexOf(".") != -1) lng = lng.split('.')[0] + '.' + lng.split('.')[1].slice(0,decimalPlacesAfterZero)
                               return '' + lng + 'W';
                           }
                           else if (lng > 0 && lng < 180) {
                             if(lng.indexOf(".") != -1) lng = lng.split('.')[0] + '.' + lng.split('.')[1].slice(0,decimalPlacesAfterZero)
                             return '' + lng + 'E';
                           }
                           else if (lng < 0 && lng > -180) {
                               lng = lng * -1;
                               lng = lng.toString();
                               if(lng.indexOf(".") != -1) lng = lng.split('.')[0] + '.' + lng.split('.')[1].slice(0,decimalPlacesAfterZero)
                               return '' + lng + 'W';
                           }
                           else if (lng == -180) {
                               lng = lng*-1;
                               if(lng.indexOf(".") != -1) lng = lng.split('.')[0] + '.' + lng.split('.')[1].slice(0,decimalPlacesAfterZero)
                               return '' + lng;
                           }
                           else if (lng < -180) {
                               lng  = 360 + lng;
                               if(lng.indexOf(".") != -1) lng = lng.split('.')[0] + '.' + lng.split('.')[1].slice(0,decimalPlacesAfterZero)
                               return '' + lng + 'W';
                           }
                           else if(lng == 0) {
                             return '' + lng;
                           }
                         },
             }


  var layer = L.latlngGraticule(options.graticuleOptions).addTo(map);

  function addGrid() {
     layer = L.latlngGraticule(options.graticuleOptions).addTo(map);
  }

  function removeGrid() {
  layer.remove();
  }

  return {
    removeGrid: removeGrid,
    addGrid: addGrid,
  }
}

},{"leaflet-graticule":1}],4:[function(require,module,exports){
module.exports = function Interface (options) {

    options.latId = options.latId || 'lat';
    options.lngId = options.lngId || 'lng';
    options.placenameInputId = options.placenameInputId || 'placenameInput'; // the placename as input by the user
    options.placenameDisplayId = options.placenameDisplayId || 'placenameDisplay'; // the placename as will be stored/displaye

    function panMapWhenInputsChange() {
      var lat = document.getElementById(options.latId);
      var lng = document.getElementById(options.lngId);

      function panIfValue() {
        if(lat.value && lng.value) {
          options.panMap(lat.value, lng.value);
        };
      }

      $(lat).change(panIfValue);
      $(lng).change(panIfValue);
  }

  panMapWhenInputsChange();


  options.onDrag = options.onDrag || function onDrag() {
    function onPlacenameReturned(result) {

      if($("#"+options.placenameInputId).val()) $("#"+options.placenameDisplayId).val($("#"+options.placenameInputId).val());

      else $("#"+options.placenameDisplayId).val(result);

      }

      options.getPlacenameFromCoordinates(options.getLat(), options.getLon(), options.getPrecision(), onPlacenameReturned);
  }


  options.map.on('move', options.onDrag);

  function updateLatLngInputListeners() {
    $("#"+options.latId).val(options.getLat());
    $("#"+options.lngId).val(options.getLon());
  };

  function enableLatLngInputTruncate() {
    options.map.on('moveend', updateLatLngInputListeners);
  };

  function disableLatLngInputTruncate() {
    options.map.off('moveend', updateLatLngInputListeners);
  };

  enableLatLngInputTruncate()

  return {
    panMapWhenInputsChange: panMapWhenInputsChange,
    onDrag: options.onDrag,
    updateLatLngInputListeners: updateLatLngInputListeners,
    disableLatLngInputTruncate: disableLatLngInputTruncate,
    enableLatLngInputTruncate: enableLatLngInputTruncate,
  }

}

},{}]},{},[2]);
