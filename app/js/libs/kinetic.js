/**
 * KineticJS JavaScript Framework v4.4.3
 * http://www.kineticjs.com/
 * Copyright 2013, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Apr 14 2013
 *
 * Copyright (C) 2011 - 2013 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Kinetic = {};
(function () {
  Kinetic.version = "4.4.3";
  Kinetic.Filters = {};
  Kinetic.DD = {};
  Kinetic.Global = {
    stages: [],
    idCounter: 0,
    ids: {},
    names: {},
    shapes: {},
    isDragging: function () {
      var a = Kinetic.DD;
      return a ? a.isDragging : !1
    },
    isDragReady: function () {
      var a = Kinetic.DD;
      return a ? !! a.node : !1
    },
    warn: function (a) {
      window.console && console.warn && console.warn("Kinetic warning: " + a)
    },
    extend: function (a, c) {
      for (var b in c.prototype) b in a.prototype || (a.prototype[b] = c.prototype[b])
    },
    _addId: function (a, c) {
      void 0 !== c && (this.ids[c] = a)
    },
    _removeId: function (a) {
      void 0 !==
        a && delete this.ids[a]
    },
    _addName: function (a, c) {
      void 0 !== c && (void 0 === this.names[c] && (this.names[c] = []), this.names[c].push(a))
    },
    _removeName: function (a, c) {
      if (void 0 !== a) {
        var b = this.names[a];
        if (void 0 !== b) {
          for (var f = 0; f < b.length; f++) b[f]._id === c && b.splice(f, 1);
          0 === b.length && delete this.names[a]
        }
      }
    }
  }
})();
(function (a, c) {
  "object" == typeof exports ? module.exports = c() : "function" == typeof define && define.amd ? define(c) : a.returnExports = c()
})(this, function () {
  return Kinetic
});
(function () {
  var a = Math.PI / 180,
    c = 180 / Math.PI;
  Kinetic.Type = {
    _isElement: function (b) {
      return !!b && 1 == b.nodeType
    },
    _isFunction: function (b) {
      return !(!b || !b.constructor || !b.call || !b.apply)
    },
    _isObject: function (b) {
      return !!b && b.constructor == Object
    },
    _isArray: function (b) {
      return "[object Array]" == Object.prototype.toString.call(b)
    },
    _isNumber: function (b) {
      return "[object Number]" == Object.prototype.toString.call(b)
    },
    _isString: function (b) {
      return "[object String]" == Object.prototype.toString.call(b)
    },
    _hasMethods: function (b) {
      var f = [],
        c;
      for (c in b) this._isFunction(b[c]) && f.push(c);
      return 0 < f.length
    },
    _isInDocument: function (b) {
      for (; b = b.parentNode;) if (b == document) return !0;
      return !1
    },
    _getXY: function (b) {
      if (this._isNumber(b)) return {
        x: b,
        y: b
      };
      if (this._isArray(b)) if (1 === b.length) {
        b = b[0];
        if (this._isNumber(b)) return {
          x: b,
          y: b
        };
        if (this._isArray(b)) return {
          x: b[0],
          y: b[1]
        };
        if (this._isObject(b)) return b
      } else {
        if (2 <= b.length) return {
          x: b[0],
          y: b[1]
        }
      } else if (this._isObject(b)) return b;
      return null
    },
    _getSize: function (b) {
      if (this._isNumber(b)) return {
        width: b,
        height: b
      };
      if (this._isArray(b)) if (1 === b.length) {
        b = b[0];
        if (this._isNumber(b)) return {
          width: b,
          height: b
        };
        if (this._isArray(b)) {
          if (4 <= b.length) return {
            width: b[2],
            height: b[3]
          };
          if (2 <= b.length) return {
            width: b[0],
            height: b[1]
          }
        } else if (this._isObject(b)) return b
      } else {
        if (4 <= b.length) return {
          width: b[2],
          height: b[3]
        };
        if (2 <= b.length) return {
          width: b[0],
          height: b[1]
        }
      } else if (this._isObject(b)) return b;
      return null
    },
    _getPoints: function (b) {
      if (void 0 === b) return [];
      if (this._isArray(b[0])) {
        for (var f = [], c = 0; c < b.length; c++) f.push({
          x: b[c][0],
          y: b[c][1]
        });
        return f
      }
      if (this._isObject(b[0])) return b;
      f = [];
      for (c = 0; c < b.length; c += 2) f.push({
        x: b[c],
        y: b[c + 1]
      });
      return f
    },
    _getImage: function (b, c) {
      var a, e, g, h;
      b ? this._isElement(b) ? c(b) : this._isString(b) ? (a = new Image, a.onload = function () {
        c(a)
      }, a.src = b) : b.data ? (e = document.createElement("canvas"), e.width = b.width, e.height = b.height, g = e.getContext("2d"), g.putImageData(b, 0, 0), h = e.toDataURL(), a = new Image, a.onload = function () {
        c(a)
      }, a.src = h) : c(null) : c(null)
    },
    _rgbToHex: function (b, c, a) {
      return (16777216 + (b << 16) + (c <<
        8) + a).toString(16).slice(1)
    },
    _hexToRgb: function (b) {
      b = parseInt(b, 16);
      return {
        r: b >> 16 & 255,
        g: b >> 8 & 255,
        b: b & 255
      }
    },
    _getRandomColorKey: function () {
      for (var b = (16777215 * Math.random() << 0).toString(16); 6 > b.length;) b = "0" + b;
      return b
    },
    _merge: function (b, c) {
      var a = this._clone(c),
        e;
      for (e in b) this._isObject(b[e]) ? a[e] = this._merge(b[e], a[e]) : a[e] = b[e];
      return a
    },
    _clone: function (b) {
      var c = {}, a;
      for (a in b) this._isObject(b[a]) ? c[a] = this._clone(b[a]) : c[a] = b[a];
      return c
    },
    _degToRad: function (b) {
      return b * a
    },
    _radToDeg: function (b) {
      return b *
        c
    },
    _capitalize: function (b) {
      return b.charAt(0).toUpperCase() + b.slice(1)
    }
  }
})();
(function () {
  var a = document.createElement("canvas").getContext("2d"),
    c = (window.devicePixelRatio || 1) / (a.webkitBackingStorePixelRatio || a.mozBackingStorePixelRatio || a.msBackingStorePixelRatio || a.oBackingStorePixelRatio || a.backingStorePixelRatio || 1);
  Kinetic.Canvas = function (b) {
    this.init(b)
  };
  Kinetic.Canvas.prototype = {
    init: function (b) {
      b = b || {};
      var a = b.width || 0,
        d = b.height || 0,
        e = b.contextType || "2d";
      this.pixelRatio = b.pixelRatio || c;
      this.width = a;
      this.height = d;
      this.element = document.createElement("canvas");
      this.element.style.padding =
        0;
      this.element.style.margin = 0;
      this.element.style.border = 0;
      this.element.style.background = "transparent";
      this.context = this.element.getContext(e);
      this.setSize(a, d)
    },
    getElement: function () {
      return this.element
    },
    getContext: function () {
      return this.context
    },
    setWidth: function (b) {
      this.width = b;
      this.element.width = b * this.pixelRatio;
      this.element.style.width = b + "px"
    },
    setHeight: function (b) {
      this.height = b;
      this.element.height = b * this.pixelRatio;
      this.element.style.height = b + "px"
    },
    getWidth: function () {
      return this.width
    },
    getHeight: function () {
      return this.height
    },
    setSize: function (b, c) {
      this.setWidth(b);
      this.setHeight(c)
    }
  };
  Kinetic.Canvas2D = function (b) {
    Kinetic.Canvas.call(this, b)
  };
  Kinetic.Canvas2D.prototype = {
    clear: function () {
      var b = this.getContext(),
        c = this.getElement();
      b.clearRect(0, 0, c.width, c.height)
    },
    toDataURL: function (b, c) {
      try {
        return this.element.toDataURL(b, c)
      } catch (a) {
        try {
          return this.element.toDataURL()
        } catch (e) {
          return Kinetic.Global.warn("Unable to get data URL. " + e.message), ""
        }
      }
    },
    fill: function (b) {
      b.getFillEnabled() && this._fill(b)
    },
    stroke: function (b) {
      b.getStrokeEnabled() &&
      this._stroke(b)
    },
    fillStroke: function (b) {
      var c = b.getFillEnabled();
      c && this._fill(b);
      b.getStrokeEnabled() && this._stroke(b, b.hasShadow() && b.hasFill() && c)
    },
    applyShadow: function (b, c) {
      var a = this.context;
      a.save();
      this._applyShadow(b);
      c();
      a.restore();
      c()
    },
    _applyLineCap: function (b) {
      (b = b.getLineCap()) && (this.context.lineCap = b)
    },
    _applyOpacity: function (b) {
      b = b.getAbsoluteOpacity();
      1 !== b && (this.context.globalAlpha = b)
    },
    _applyLineJoin: function (b) {
      (b = b.getLineJoin()) && (this.context.lineJoin = b)
    },
    _applyAncestorTransforms: function (b) {
      var c =
        this.context;
      b._eachAncestorReverse(function (b) {
        b = b.getTransform().getMatrix();
        c.transform(b[0], b[1], b[2], b[3], b[4], b[5])
      }, !0)
    },
    _clip: function (b) {
      var c = this.getContext();
      c.save();
      this._applyAncestorTransforms(b);
      c.beginPath();
      b.getClipFunc()(this);
      c.clip();
      c.setTransform(1, 0, 0, 1, 0, 0)
    }
  };
  Kinetic.Global.extend(Kinetic.Canvas2D, Kinetic.Canvas);
  Kinetic.SceneCanvas = function (b) {
    Kinetic.Canvas2D.call(this, b)
  };
  Kinetic.SceneCanvas.prototype = {
    setWidth: function (b) {
      var c = this.pixelRatio;
      Kinetic.Canvas.prototype.setWidth.call(this,
        b);
      this.context.scale(c, c)
    },
    setHeight: function (b) {
      var c = this.pixelRatio;
      Kinetic.Canvas.prototype.setHeight.call(this, b);
      this.context.scale(c, c)
    },
    _fillColor: function (b) {
      var c = this.context,
        a = b.getFill();
      c.fillStyle = a;
      b._fillFunc(c)
    },
    _fillPattern: function (b) {
      var c = this.context,
        a = b.getFillPatternImage(),
        e = b.getFillPatternX(),
        g = b.getFillPatternY(),
        h = b.getFillPatternScale(),
        j = b.getFillPatternRotation(),
        k = b.getFillPatternOffset();
      b = b.getFillPatternRepeat();
      (e || g) && c.translate(e || 0, g || 0);
      j && c.rotate(j);
      h &&
      c.scale(h.x, h.y);
      k && c.translate(-1 * k.x, -1 * k.y);
      c.fillStyle = c.createPattern(a, b || "repeat");
      c.fill()
    },
    _fillLinearGradient: function (b) {
      var c = this.context,
        a = b.getFillLinearGradientStartPoint(),
        e = b.getFillLinearGradientEndPoint();
      b = b.getFillLinearGradientColorStops();
      a = c.createLinearGradient(a.x, a.y, e.x, e.y);
      for (e = 0; e < b.length; e += 2) a.addColorStop(b[e], b[e + 1]);
      c.fillStyle = a;
      c.fill()
    },
    _fillRadialGradient: function (b) {
      var c = this.context,
        a = b.getFillRadialGradientStartPoint(),
        e = b.getFillRadialGradientEndPoint(),
        g = b.getFillRadialGradientStartRadius(),
        h = b.getFillRadialGradientEndRadius();
      b = b.getFillRadialGradientColorStops();
      a = c.createRadialGradient(a.x, a.y, g, e.x, e.y, h);
      for (e = 0; e < b.length; e += 2) a.addColorStop(b[e], b[e + 1]);
      c.fillStyle = a;
      c.fill()
    },
    _fill: function (b, c) {
      var a = this.context,
        e = b.getFill(),
        g = b.getFillPatternImage(),
        h = b.getFillLinearGradientStartPoint(),
        j = b.getFillRadialGradientStartPoint(),
        k = b.getFillPriority();
      a.save();
      !c && b.hasShadow() && this._applyShadow(b);
      e && "color" === k ? this._fillColor(b) : g && "pattern" ===
        k ? this._fillPattern(b) : h && "linear-gradient" === k ? this._fillLinearGradient(b) : j && "radial-gradient" === k ? this._fillRadialGradient(b) : e ? this._fillColor(b) : g ? this._fillPattern(b) : h ? this._fillLinearGradient(b) : j && this._fillRadialGradient(b);
      a.restore();
      !c && b.hasShadow() && this._fill(b, !0)
    },
    _stroke: function (b, c) {
      var a = this.context,
        e = b.getStroke(),
        g = b.getStrokeWidth(),
        h = b.getDashArray();
      if (e || g) a.save(), b.getStrokeScaleEnabled() || a.setTransform(1, 0, 0, 1, 0, 0), this._applyLineCap(b), h && b.getDashArrayEnabled() &&
        (a.setLineDash ? a.setLineDash(h) : "mozDash" in a ? a.mozDash = h : "webkitLineDash" in a && (a.webkitLineDash = h)), !c && b.hasShadow() && this._applyShadow(b), a.lineWidth = g || 2, a.strokeStyle = e || "black", b._strokeFunc(a), a.restore(), !c && b.hasShadow() && this._stroke(b, !0)
    },
    _applyShadow: function (b) {
      var c = this.context;
      if (b.hasShadow() && b.getShadowEnabled()) {
        var a = b.getAbsoluteOpacity(),
          e = b.getShadowColor() || "black",
          g = b.getShadowBlur() || 5,
          h = b.getShadowOffset() || {
            x: 0,
            y: 0
          };
        b.getShadowOpacity() && (c.globalAlpha = b.getShadowOpacity() *
          a);
        c.shadowColor = e;
        c.shadowBlur = g;
        c.shadowOffsetX = h.x;
        c.shadowOffsetY = h.y
      }
    }
  };
  Kinetic.Global.extend(Kinetic.SceneCanvas, Kinetic.Canvas2D);
  Kinetic.HitCanvas = function (b) {
    Kinetic.Canvas2D.call(this, b)
  };
  Kinetic.HitCanvas.prototype = {
    _fill: function (b) {
      var c = this.context;
      c.save();
      c.fillStyle = "#" + b.colorKey;
      b._fillFuncHit(c);
      c.restore()
    },
    _stroke: function (b) {
      var c = this.context,
        a = b.getStroke(),
        e = b.getStrokeWidth();
      if (a || e) this._applyLineCap(b), c.save(), c.lineWidth = e || 2, c.strokeStyle = "#" + b.colorKey, b._strokeFuncHit(c),
        c.restore()
    }
  };
  Kinetic.Global.extend(Kinetic.HitCanvas, Kinetic.Canvas2D)
})();
(function () {
  Kinetic.Tween = function (a, c, b, f, d) {
    this._listeners = [];
    this.addListener(this);
    this.propFunc = a;
    this._pos = this.begin = b;
    this.setDuration(d);
    this.isPlaying = !1;
    this.prevPos = this.prevTime = this._change = 0;
    this.looping = !1;
    this._finish = this._startTime = this._position = this._time = 0;
    this.name = "";
    this.func = c;
    this.setFinish(f)
  };
  Kinetic.Tween.prototype = {
    setTime: function (a) {
      this.prevTime = this._time;
      a > this.getDuration() ? this.looping ? (this.rewind(a - this._duration), this.update(), this.broadcastMessage("onLooped", {
        target: this,
        type: "onLooped"
      })) : (this._time = this._duration, this.update(), this.stop(), this.broadcastMessage("onFinished", {
        target: this,
        type: "onFinished"
      })) : 0 > a ? (this.rewind(), this.update()) : (this._time = a, this.update())
    },
    getTime: function () {
      return this._time
    },
    setDuration: function (a) {
      this._duration = null === a || 0 >= a ? 1E5 : a
    },
    getDuration: function () {
      return this._duration
    },
    setPosition: function (a) {
      this.prevPos = this._pos;
      this.propFunc(a);
      this._pos = a;
      this.broadcastMessage("onChanged", {
        target: this,
        type: "onChanged"
      })
    },
    getPosition: function (a) {
      return void 0 === a && (a = this._time), this.func(a, this.begin, this._change, this._duration)
    },
    setFinish: function (a) {
      this._change = a - this.begin
    },
    getFinish: function () {
      return this.begin + this._change
    },
    start: function () {
      this.rewind();
      this.startEnterFrame();
      this.broadcastMessage("onStarted", {
        target: this,
        type: "onStarted"
      })
    },
    rewind: function (a) {
      this.stop();
      this._time = void 0 === a ? 0 : a;
      this.fixTime();
      this.update()
    },
    fforward: function () {
      this._time = this._duration;
      this.fixTime();
      this.update()
    },
    update: function () {
      this.setPosition(this.getPosition(this._time))
    },
    startEnterFrame: function () {
      this.stopEnterFrame();
      this.isPlaying = !0;
      this.onEnterFrame()
    },
    onEnterFrame: function () {
      this.isPlaying && this.nextFrame()
    },
    nextFrame: function () {
      this.setTime((this.getTimer() - this._startTime) / 1E3)
    },
    stop: function () {
      this.stopEnterFrame();
      this.broadcastMessage("onStopped", {
        target: this,
        type: "onStopped"
      })
    },
    stopEnterFrame: function () {
      this.isPlaying = !1
    },
    continueTo: function (a, c) {
      this.begin = this._pos;
      this.setFinish(a);
      void 0 !== this._duration && this.setDuration(c);
      this.start()
    },
    resume: function () {
      this.fixTime();
      this.startEnterFrame();
      this.broadcastMessage("onResumed", {
        target: this,
        type: "onResumed"
      })
    },
    yoyo: function () {
      this.continueTo(this.begin, this._time)
    },
    addListener: function (a) {
      return this.removeListener(a), this._listeners.push(a)
    },
    removeListener: function (a) {
      for (var c = this._listeners, b = c.length; b--;) if (c[b] == a) return c.splice(b, 1), !0;
      return !1
    },
    broadcastMessage: function () {
      for (var a = [], c = 0; c < arguments.length; c++) a.push(arguments[c]);
      for (var b = a.shift(), f = this._listeners, d = f.length, c = 0; c < d; c++) f[c][b] && f[c][b].apply(f[c],
        a)
    },
    fixTime: function () {
      this._startTime = this.getTimer() - 1E3 * this._time
    },
    getTimer: function () {
      return (new Date).getTime() - this._time
    }
  };
  Kinetic.Tweens = {
    "back-ease-in": function (a, c, b, f) {
      return b * (a /= f) * a * (2.70158 * a - 1.70158) + c
    },
    "back-ease-out": function (a, c, b, f) {
      return b * ((a = a / f - 1) * a * (2.70158 * a + 1.70158) + 1) + c
    },
    "back-ease-in-out": function (a, c, b, f) {
      var d = 1.70158;
      return 1 > (a /= f / 2) ? b / 2 * a * a * (((d *= 1.525) + 1) * a - d) + c : b / 2 * ((a -= 2) * a * (((d *= 1.525) + 1) * a + d) + 2) + c
    },
    "elastic-ease-in": function (a, c, b, f, d, e) {
      var g = 0;
      return 0 ===
        a ? c : 1 == (a /= f) ? c + b : (e || (e = 0.3 * f), !d || d < Math.abs(b) ? (d = b, g = e / 4) : g = e / (2 * Math.PI) * Math.asin(b / d), -(d * Math.pow(2, 10 * (a -= 1)) * Math.sin(2 * (a * f - g) * Math.PI / e)) + c)
    },
    "elastic-ease-out": function (a, c, b, f, d, e) {
      var g = 0;
      return 0 === a ? c : 1 == (a /= f) ? c + b : (e || (e = 0.3 * f), !d || d < Math.abs(b) ? (d = b, g = e / 4) : g = e / (2 * Math.PI) * Math.asin(b / d), d * Math.pow(2, -10 * a) * Math.sin(2 * (a * f - g) * Math.PI / e) + b + c)
    },
    "elastic-ease-in-out": function (a, c, b, f, d, e) {
      var g = 0;
      return 0 === a ? c : 2 == (a /= f / 2) ? c + b : (e || (e = 1.5 * 0.3 * f), !d || d < Math.abs(b) ? (d = b, g = e / 4) : g = e / (2 *
        Math.PI) * Math.asin(b / d), 1 > a ? -0.5 * d * Math.pow(2, 10 * (a -= 1)) * Math.sin(2 * (a * f - g) * Math.PI / e) + c : 0.5 * d * Math.pow(2, -10 * (a -= 1)) * Math.sin(2 * (a * f - g) * Math.PI / e) + b + c)
    },
    "bounce-ease-out": function (a, c, b, f) {
      return (a /= f) < 1 / 2.75 ? 7.5625 * b * a * a + c : a < 2 / 2.75 ? b * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + c : a < 2.5 / 2.75 ? b * (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) + c : b * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + c
    },
    "bounce-ease-in": function (a, c, b, f) {
      return b - Kinetic.Tweens["bounce-ease-out"](f - a, 0, b, f) + c
    },
    "bounce-ease-in-out": function (a, c, b, f) {
      return a < f / 2 ?
        0.5 * Kinetic.Tweens["bounce-ease-in"](2 * a, 0, b, f) + c : 0.5 * Kinetic.Tweens["bounce-ease-out"](2 * a - f, 0, b, f) + 0.5 * b + c
    },
    "ease-in": function (a, c, b, f) {
      return b * (a /= f) * a + c
    },
    "ease-out": function (a, c, b, f) {
      return -b * (a /= f) * (a - 2) + c
    },
    "ease-in-out": function (a, c, b, f) {
      return 1 > (a /= f / 2) ? b / 2 * a * a + c : -b / 2 * (--a * (a - 2) - 1) + c
    },
    "strong-ease-in": function (a, c, b, f) {
      return b * (a /= f) * a * a * a * a + c
    },
    "strong-ease-out": function (a, c, b, f) {
      return b * ((a = a / f - 1) * a * a * a * a + 1) + c
    },
    "strong-ease-in-out": function (a, c, b, f) {
      return 1 > (a /= f / 2) ? b / 2 * a * a * a * a * a + c : b /
        2 * ((a -= 2) * a * a * a * a + 2) + c
    },
    linear: function (a, c, b, f) {
      return b * a / f + c
    }
  }
})();
(function () {
  Kinetic.Transform = function () {
    this.m = [1, 0, 0, 1, 0, 0]
  };
  Kinetic.Transform.prototype = {
    translate: function (a, c) {
      this.m[4] += this.m[0] * a + this.m[2] * c;
      this.m[5] += this.m[1] * a + this.m[3] * c
    },
    scale: function (a, c) {
      this.m[0] *= a;
      this.m[1] *= a;
      this.m[2] *= c;
      this.m[3] *= c
    },
    rotate: function (a) {
      var c = Math.cos(a);
      a = Math.sin(a);
      var b = this.m[1] * c + this.m[3] * a,
        f = this.m[0] * -a + this.m[2] * c,
        d = this.m[1] * -a + this.m[3] * c;
      this.m[0] = this.m[0] * c + this.m[2] * a;
      this.m[1] = b;
      this.m[2] = f;
      this.m[3] = d
    },
    getTranslation: function () {
      return {
        x: this.m[4],
        y: this.m[5]
      }
    },
    multiply: function (a) {
      var c = this.m[1] * a.m[0] + this.m[3] * a.m[1],
        b = this.m[0] * a.m[2] + this.m[2] * a.m[3],
        f = this.m[1] * a.m[2] + this.m[3] * a.m[3],
        d = this.m[0] * a.m[4] + this.m[2] * a.m[5] + this.m[4],
        e = this.m[1] * a.m[4] + this.m[3] * a.m[5] + this.m[5];
      this.m[0] = this.m[0] * a.m[0] + this.m[2] * a.m[1];
      this.m[1] = c;
      this.m[2] = b;
      this.m[3] = f;
      this.m[4] = d;
      this.m[5] = e
    },
    invert: function () {
      var a = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]),
        c = -this.m[1] * a,
        b = -this.m[2] * a,
        f = this.m[0] * a,
        d = a * (this.m[2] * this.m[5] - this.m[3] * this.m[4]),
        e = a * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
      this.m[0] = this.m[3] * a;
      this.m[1] = c;
      this.m[2] = b;
      this.m[3] = f;
      this.m[4] = d;
      this.m[5] = e
    },
    getMatrix: function () {
      return this.m
    }
  }
})();
(function () {
  Kinetic.Collection = function () {
    var a = [].slice.call(arguments),
      c = a.length,
      b = 0;
    for (this.length = c; b < c; b++) this[b] = a[b];
    return this
  };
  Kinetic.Collection.prototype = [];
  Kinetic.Collection.prototype.each = function (a) {
    for (var c = 0; c < this.length; c++) a(this[c], c)
  };
  Kinetic.Collection.mapMethods = function (a) {
    var c = a.length,
      b;
    for (b = 0; b < c; b++)(function (b) {
      var c = a[b];
      Kinetic.Collection.prototype[c] = function () {
        var b = this.length,
          a;
        args = [].slice.call(arguments);
        for (a = 0; a < b; a++) this[a][c].apply(this[a], args)
      }
    })(b)
  }
})();
(function () {
  Kinetic.Filters.Grayscale = function (a) {
    a = a.data;
    for (var c = 0; c < a.length; c += 4) {
      var b = 0.34 * a[c] + 0.5 * a[c + 1] + 0.16 * a[c + 2];
      a[c] = b;
      a[c + 1] = b;
      a[c + 2] = b
    }
  }
})();
(function () {
  Kinetic.Filters.Brighten = function (a, c) {
    for (var b = c.val || 0, f = a.data, d = 0; d < f.length; d += 4) f[d] += b, f[d + 1] += b, f[d + 2] += b
  }
})();
(function () {
  Kinetic.Filters.Invert = function (a) {
    a = a.data;
    for (var c = 0; c < a.length; c += 4) a[c] = 255 - a[c], a[c + 1] = 255 - a[c + 1], a[c + 2] = 255 - a[c + 2]
  }
})();
(function (a) {
  function c() {
    this.a = this.b = this.g = this.r = 0;
    this.next = null
  }
  var b = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374,
      367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312,
      310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259
    ],
    f = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
    ];
  a = a || {};
  a.Filters = a.Filters || {};
  a.Filters.Blur = function (a, e) {
    var g = e.radius,
      g = g | 0,
      h = a.data,
      j = a.width,
      k = a.height,
      n, p, l, m, q, y, s, v, u, r, B, A, F, G, C, D,
      H, I, J, K, L, x, z;
    n = g + g + 1;
    var Q = j - 1,
      R = k - 1,
      E = g + 1,
      M = E * (E + 1) / 2,
      P = new c,
      w = P;
    z = l = null;
    var N = b[g],
      O = f[g];
    for (l = 1; l < n; l++) if (w = w.next = new c, l == E) var S = w;
    w.next = P;
    for (p = y = q = 0; p < k; p++) {
      C = D = H = I = s = v = u = r = 0;
      B = E * (J = h[q]);
      A = E * (K = h[q + 1]);
      F = E * (L = h[q + 2]);
      G = E * (x = h[q + 3]);
      s += M * J;
      v += M * K;
      u += M * L;
      r += M * x;
      w = P;
      for (l = 0; l < E; l++) w.r = J, w.g = K, w.b = L, w.a = x, w = w.next;
      for (l = 1; l < E; l++) m = q + ((Q < l ? Q : l) << 2), s += (w.r = J = h[m]) * (z = E - l), v += (w.g = K = h[m + 1]) * z, u += (w.b = L = h[m + 2]) * z, r += (w.a = x = h[m + 3]) * z, C += J, D += K, H += L, I += x, w = w.next;
      l = P;
      z = S;
      for (n = 0; n < j; n++) h[q +
        3] = x = r * N >> O, 0 != x ? (x = 255 / x, h[q] = (s * N >> O) * x, h[q + 1] = (v * N >> O) * x, h[q + 2] = (u * N >> O) * x) : h[q] = h[q + 1] = h[q + 2] = 0, s -= B, v -= A, u -= F, r -= G, B -= l.r, A -= l.g, F -= l.b, G -= l.a, m = y + ((m = n + g + 1) < Q ? m : Q) << 2, C += l.r = h[m], D += l.g = h[m + 1], H += l.b = h[m + 2], I += l.a = h[m + 3], s += C, v += D, u += H, r += I, l = l.next, B += J = z.r, A += K = z.g, F += L = z.b, G += x = z.a, C -= J, D -= K, H -= L, I -= x, z = z.next, q += 4;
      y += j
    }
    for (n = 0; n < j; n++) {
      D = H = I = C = v = u = r = s = 0;
      q = n << 2;
      B = E * (J = h[q]);
      A = E * (K = h[q + 1]);
      F = E * (L = h[q + 2]);
      G = E * (x = h[q + 3]);
      s += M * J;
      v += M * K;
      u += M * L;
      r += M * x;
      w = P;
      for (l = 0; l < E; l++) w.r = J, w.g = K, w.b = L, w.a =
        x, w = w.next;
      m = j;
      for (l = 1; l <= g; l++) q = m + n << 2, s += (w.r = J = h[q]) * (z = E - l), v += (w.g = K = h[q + 1]) * z, u += (w.b = L = h[q + 2]) * z, r += (w.a = x = h[q + 3]) * z, C += J, D += K, H += L, I += x, w = w.next, l < R && (m += j);
      q = n;
      l = P;
      z = S;
      for (p = 0; p < k; p++) m = q << 2, h[m + 3] = x = r * N >> O, 0 < x ? (x = 255 / x, h[m] = (s * N >> O) * x, h[m + 1] = (v * N >> O) * x, h[m + 2] = (u * N >> O) * x) : h[m] = h[m + 1] = h[m + 2] = 0, s -= B, v -= A, u -= F, r -= G, B -= l.r, A -= l.g, F -= l.b, G -= l.a, m = n + ((m = p + E) < R ? m : R) * j << 2, s += C += l.r = h[m], v += D += l.g = h[m + 1], u += H += l.b = h[m + 2], r += I += l.a = h[m + 3], l = l.next, B += J = z.r, A += K = z.g, F += L = z.b, G += x = z.a, C -= J, D -= K, H -=
        L, I -= x, z = z.next, q += j
    }
  };
  window.Kinetic = a
})(Kinetic);
(function (a) {
  function c(b, c, a) {
    c = 4 * (a * b.width + c);
    a = [];
    return a.push(b.data[c++], b.data[c++], b.data[c++], b.data[c++]), a
  }
  function b(b, c) {
    return Math.sqrt(Math.pow(b[0] - c[0], 2) + Math.pow(b[1] - c[1], 2) + Math.pow(b[2] - c[2], 2))
  }
  a = a || {};
  a.Filters = a.Filters || {};
  a.Filters.Mask = function (a, d) {
    var e;
    var g = c(a, 0, 0),
      h = c(a, a.width - 1, 0),
      j = c(a, 0, a.height - 1),
      k = c(a, a.width - 1, a.height - 1);
    e = d && d.threshold ? d.threshold : 10;
    if (b(g, h) < e && b(h, k) < e && b(k, j) < e && b(j, g) < e) {
      g = [h, g, k, j];
      h = [0, 0, 0];
      for (j = 0; j < g.length; j++) h[0] += g[j][0],
        h[1] += g[j][1], h[2] += g[j][2];
      g = (h[0] /= g.length, h[1] /= g.length, h[2] /= g.length, h);
      h = [];
      for (j = 0; j < a.width * a.height; j++) k = b(g, [a.data[4 * j], a.data[4 * j + 1], a.data[4 * j + 2]]), h[j] = k < e ? 0 : 255;
      e = h
    } else e = void 0; if (e) {
      for (var g = a.width, h = a.height, j = [1, 1, 1, 1, 0, 1, 1, 1, 1], k = Math.round(Math.sqrt(j.length)), n = Math.floor(k / 2), p = [], l = 0; l < h; l++) for (var m = 0; m < g; m++) {
        for (var q = l * g + m, y = 0, s = 0; s < k; s++) for (var v = 0; v < k; v++) {
          var u = l + s - n,
            r = m + v - n;
          0 <= u && (u < h && 0 <= r && r < g) && (y += e[u * g + r] * j[s * k + v])
        }
        p[q] = 2040 === y ? 255 : 0
      }
      e = p;
      g = a.width;
      h = a.height;
      j = [1, 1, 1, 1, 1, 1, 1, 1, 1];
      k = Math.round(Math.sqrt(j.length));
      n = Math.floor(k / 2);
      p = [];
      for (l = 0; l < h; l++) for (m = 0; m < g; m++) {
        q = l * g + m;
        for (s = y = 0; s < k; s++) for (v = 0; v < k; v++) u = l + s - n, r = m + v - n, 0 <= u && (u < h && 0 <= r && r < g) && (y += e[u * g + r] * j[s * k + v]);
        p[q] = 1020 <= y ? 255 : 0
      }
      e = p;
      g = a.width;
      h = a.height;
      j = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
      k = Math.round(Math.sqrt(j.length));
      n = Math.floor(k / 2);
      p = [];
      for (l = 0; l < h; l++) for (m = 0; m < g; m++) {
        q = l * g + m;
        for (s = y = 0; s < k; s++) for (v = 0; v < k; v++) u = l + s - n, r = m + v - n, 0 <= u && (u < h && 0 <= r && r < g) && (y += e[u * g + r] * j[s * k + v]);
        p[q] =
          y
      }
      e = p;
      for (g = 0; g < a.width * a.height; g++) a.data[4 * g + 3] = e[g]
    }
    return a
  };
  window.Kinetic = a
})(Kinetic);
(function () {
  var a = "Shape";
  Kinetic.Node = function (c) {
    this._nodeInit(c)
  };
  Kinetic.Node.prototype = {
    _nodeInit: function (c) {
      this._id = Kinetic.Global.idCounter++;
      this.eventListeners = {};
      this.setAttrs(c)
    },
    on: function (c, b) {
      var a = c.split(" "),
        d = a.length,
        e, g, h;
      for (e = 0; e < d; e++) g = a[e], h = g.split("."), g = h[0], h = 1 < h.length ? h[1] : "", this.eventListeners[g] || (this.eventListeners[g] = []), this.eventListeners[g].push({
        name: h,
        handler: b
      });
      return this
    },
    off: function (c) {
      c = c.split(" ");
      var b = c.length,
        a, d, e, g;
      for (a = 0; a < b; a++) if (e = d =
        c[a], e = e.split("."), g = e[0], 1 < e.length) if (g) this.eventListeners[g] && this._off(g, e[1]);
      else for (d in this.eventListeners) this._off(d, e[1]);
      else delete this.eventListeners[g];
      return this
    },
    remove: function () {
      var c = this.getParent();
      c && c.children && (c.children.splice(this.index, 1), c._setChildrenIndices());
      delete this.parent
    },
    destroy: function () {
      this.getParent();
      this.getStage();
      for (var c = Kinetic.Global; this.children && 0 < this.children.length;) this.children[0].destroy();
      c._removeId(this.getId());
      c._removeName(this.getName(),
        this._id);
      this.trans && this.trans.stop();
      this.remove()
    },
    getAttr: function (c) {
      return this["get" + Kinetic.Type._capitalize(c)]()
    },
    getAttrs: function () {
      return this.attrs || {}
    },
    createAttrs: function () {
      void 0 === this.attrs && (this.attrs = {})
    },
    setAttrs: function (c) {
      var b, a;
      if (c) for (b in c) a = "set" + Kinetic.Type._capitalize(b), Kinetic.Type._isFunction(this[a]) ? this[a](c[b]) : this.setAttr(b, c[b])
    },
    getVisible: function () {
      var a = this.attrs.visible,
        b = this.getParent();
      return void 0 === a && (a = !0), a && b && !b.getVisible() ? !1 : a
    },
    getListening: function () {
      var a =
          this.attrs.listening,
        b = this.getParent();
      return void 0 === a && (a = !0), a && b && !b.getListening() ? !1 : a
    },
    show: function () {
      this.setVisible(!0)
    },
    hide: function () {
      this.setVisible(!1)
    },
    getZIndex: function () {
      return this.index || 0
    },
    getAbsoluteZIndex: function () {
      function c(k) {
        e = [];
        g = k.length;
        for (h = 0; h < g; h++) j = k[h], d++, j.nodeType !== a && (e = e.concat(j.getChildren())), j._id === f._id && (h = g);
        0 < e.length && e[0].getLevel() <= b && c(e)
      }
      var b = this.getLevel();
      this.getStage();
      var f = this,
        d = 0,
        e, g, h, j;
      return "Stage" !== f.nodeType && c(f.getStage().getChildren()),
        d
    },
    getLevel: function () {
      for (var a = 0, b = this.parent; b;) a++, b = b.parent;
      return a
    },
    setPosition: function () {
      var a = Kinetic.Type._getXY([].slice.call(arguments));
      this.setAttr("x", a.x);
      this.setAttr("y", a.y)
    },
    getPosition: function () {
      return {
        x: this.getX(),
        y: this.getY()
      }
    },
    getAbsolutePosition: function () {
      var a = this.getAbsoluteTransform(),
        b = this.getOffset();
      return a.translate(b.x, b.y), a.getTranslation()
    },
    setAbsolutePosition: function () {
      var a = Kinetic.Type._getXY([].slice.call(arguments)),
        b = this._clearTransform(),
        f;
      this.attrs.x =
        b.x;
      this.attrs.y = b.y;
      delete b.x;
      delete b.y;
      f = this.getAbsoluteTransform();
      f.invert();
      f.translate(a.x, a.y);
      a = {
        x: this.attrs.x + f.getTranslation().x,
        y: this.attrs.y + f.getTranslation().y
      };
      this.setPosition(a.x, a.y);
      this._setTransform(b)
    },
    move: function () {
      var a = Kinetic.Type._getXY([].slice.call(arguments)),
        b = this.getX(),
        f = this.getY();
      void 0 !== a.x && (b += a.x);
      void 0 !== a.y && (f += a.y);
      this.setPosition(b, f)
    },
    _eachAncestorReverse: function (a, b) {
      var f = [],
        d = this.getParent(),
        e;
      for (b && f.unshift(this); d;) f.unshift(d), d =
        d.parent;
      d = f.length;
      for (e = 0; e < d; e++) a(f[e])
    },
    rotate: function (a) {
      this.setRotation(this.getRotation() + a)
    },
    rotateDeg: function (a) {
      this.setRotation(this.getRotation() + Kinetic.Type._degToRad(a))
    },
    moveToTop: function () {
      return this.parent.children.splice(this.index, 1), this.parent.children.push(this), this.parent._setChildrenIndices(), !0
    },
    moveUp: function () {
      var a = this.index,
        b = this.parent.getChildren().length;
      if (a < b - 1) return this.parent.children.splice(a, 1), this.parent.children.splice(a + 1, 0, this), this.parent._setChildrenIndices(), !0
    },
    moveDown: function () {
      var a = this.index;
      if (0 < a) return this.parent.children.splice(a, 1), this.parent.children.splice(a - 1, 0, this), this.parent._setChildrenIndices(), !0
    },
    moveToBottom: function () {
      var a = this.index;
      if (0 < a) return this.parent.children.splice(a, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices(), !0
    },
    setZIndex: function (a) {
      this.parent.children.splice(this.index, 1);
      this.parent.children.splice(a, 0, this);
      this.parent._setChildrenIndices()
    },
    getAbsoluteOpacity: function () {
      var a = this.getOpacity();
      return this.getParent() && (a *= this.getParent().getAbsoluteOpacity()), a
    },
    moveTo: function (a) {
      Kinetic.Node.prototype.remove.call(this);
      a.add(this)
    },
    toObject: function () {
      var a = Kinetic.Type,
        b = {}, f = this.getAttrs(),
        d, e;
      b.attrs = {};
      for (d in f) e = f[d], !a._isFunction(e) && !a._isElement(e) && (!a._isObject(e) || !a._hasMethods(e)) && (b.attrs[d] = e);
      return b.nodeType = this.nodeType, b.shapeType = this.shapeType, b
    },
    toJSON: function () {
      return JSON.stringify(this.toObject())
    },
    getParent: function () {
      return this.parent
    },
    getLayer: function () {
      return this.getParent().getLayer()
    },
    getStage: function () {
      return this.getParent() ? this.getParent().getStage() : void 0
    },
    fire: function (a, b, f) {
      f ? this._executeHandlers(a, b || {}) : this._handleEvent(a, b || {})
    },
    getAbsoluteTransform: function () {
      var a = new Kinetic.Transform,
        b;
      return this._eachAncestorReverse(function (f) {
        b = f.getTransform();
        a.multiply(b)
      }, !0), a
    },
    getTransform: function () {
      var a = new Kinetic.Transform,
        b = this.getX(),
        f = this.getY(),
        d = this.getRotation(),
        e = this.getScale(),
        g = e.x,
        e = e.y,
        h = this.getOffset(),
        j = h.x,
        h = h.y;
      return (0 !== b || 0 !== f) && a.translate(b,
        f), 0 !== d && a.rotate(d), (1 !== g || 1 !== e) && a.scale(g, e), (0 !== j || 0 !== h) && a.translate(-1 * j, -1 * h), a
    },
    clone: function (a) {
      var b = new Kinetic[this.shapeType || this.nodeType](this.attrs),
        f, d, e, g, h;
      for (f in this.eventListeners) {
        d = this.eventListeners[f];
        e = d.length;
        for (g = 0; g < e; g++) h = d[g], 0 > h.name.indexOf("kinetic") && (b.eventListeners[f] || (b.eventListeners[f] = []), b.eventListeners[f].push(h))
      }
      return b.setAttrs(a), b
    },
    toDataURL: function (a) {
      a = a || {};
      var b = a.mimeType || null,
        f = a.quality || null,
        d = this.getStage(),
        e = a.x || 0,
        g = a.y ||
          0;
      a = new Kinetic.SceneCanvas({
        width: a.width || d.getWidth(),
        height: a.height || d.getHeight(),
        pixelRatio: 1
      });
      d = a.getContext();
      return d.save(), (e || g) && d.translate(-1 * e, -1 * g), this.drawScene(a), d.restore(), a.toDataURL(b, f)
    },
    toImage: function (a) {
      Kinetic.Type._getImage(this.toDataURL(a), function (b) {
        a.callback(b)
      })
    },
    setSize: function () {
      var a = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
      this.setWidth(a.width);
      this.setHeight(a.height)
    },
    getSize: function () {
      return {
        width: this.getWidth(),
        height: this.getHeight()
      }
    },
    getWidth: function () {
      return this.attrs.width || 0
    },
    getHeight: function () {
      return this.attrs.height || 0
    },
    _get: function (a) {
      return this.nodeType === a ? [this] : []
    },
    _off: function (a, b) {
      var f = this.eventListeners[a],
        d;
      for (d = 0; d < f.length; d++) if (f[d].name === b) {
        f.splice(d, 1);
        if (0 === f.length) {
          delete this.eventListeners[a];
          break
        }
        d--
      }
    },
    _clearTransform: function () {
      var a = this.getScale(),
        b = this.getOffset(),
        a = {
          x: this.getX(),
          y: this.getY(),
          rotation: this.getRotation(),
          scale: {
            x: a.x,
            y: a.y
          },
          offset: {
            x: b.x,
            y: b.y
          }
        };
      return this.attrs.x =
        0, this.attrs.y = 0, this.attrs.rotation = 0, this.attrs.scale = {
        x: 1,
        y: 1
      }, this.attrs.offset = {
        x: 0,
        y: 0
      }, a
    },
    _setTransform: function (a) {
      for (var b in a) this.attrs[b] = a[b]
    },
    _fireBeforeChangeEvent: function (a, b, f) {
      this._handleEvent("before" + Kinetic.Type._capitalize(a) + "Change", {
        oldVal: b,
        newVal: f
      })
    },
    _fireChangeEvent: function (a, b, f) {
      this._handleEvent(a + "Change", {
        oldVal: b,
        newVal: f
      })
    },
    setId: function (a) {
      var b = this.getId();
      this.getStage();
      var f = Kinetic.Global;
      f._removeId(b);
      f._addId(this, a);
      this.setAttr("id", a)
    },
    setName: function (a) {
      var b =
        this.getName();
      this.getStage();
      var f = Kinetic.Global;
      f._removeName(b, this._id);
      f._addName(this, a);
      this.setAttr("name", a)
    },
    getNodeType: function () {
      return this.nodeType
    },
    setAttr: function (a, b) {
      var f;
      void 0 !== b && (f = this.attrs[a], this._fireBeforeChangeEvent(a, f, b), this.attrs[a] = b, this._fireChangeEvent(a, f, b))
    },
    _handleEvent: function (c, b, f) {
      b && this.nodeType === a && (b.targetNode = this);
      this.getStage();
      var d = !0;
      "mouseenter" === c && f && this._id === f._id ? d = !1 : "mouseleave" === c && f && this._id === f._id && (d = !1);
      d && (this._executeHandlers(c,
        b), b && !b.cancelBubble && this.parent && (f && f.parent ? this._handleEvent.call(this.parent, c, b, f.parent) : this._handleEvent.call(this.parent, c, b)))
    },
    _executeHandlers: function (a, b) {
      var f = this.eventListeners[a],
        d, e;
      if (f) {
        d = f.length;
        for (e = 0; e < d; e++) f[e].handler.apply(this, [b])
      }
    },
    draw: function () {
      var a = {
        node: this
      };
      this.fire("beforeDraw", a);
      this.drawScene();
      this.drawHit();
      this.fire("draw", a)
    },
    shouldDrawHit: function () {
      return this.isVisible() && this.isListening() && !Kinetic.Global.isDragging()
    }
  };
  Kinetic.Node.addGetterSetter = function (a, b, f) {
    this.addGetter(a, b, f);
    this.addSetter(a, b)
  };
  Kinetic.Node.addPointGetterSetter = function (a, b, f) {
    this.addGetter(a, b, f);
    this.addPointSetter(a, b)
  };
  Kinetic.Node.addRotationGetterSetter = function (a, b, f) {
    this.addRotationGetter(a, b, f);
    this.addRotationSetter(a, b)
  };
  Kinetic.Node.addSetter = function (a, b) {
    var f = "set" + Kinetic.Type._capitalize(b);
    a.prototype[f] = function (a) {
      this.setAttr(b, a)
    }
  };
  Kinetic.Node.addPointSetter = function (a, b) {
    var f = "set" + Kinetic.Type._capitalize(b);
    a.prototype[f] = function () {
      var a =
        Kinetic.Type._getXY([].slice.call(arguments));
      this.attrs[b] || (this.attrs[b] = {
        x: 1,
        y: 1
      });
      a && void 0 === a.x && (a.x = this.attrs[b].x);
      a && void 0 === a.y && (a.y = this.attrs[b].y);
      this.setAttr(b, a)
    }
  };
  Kinetic.Node.addRotationSetter = function (a, b) {
    var f = "set" + Kinetic.Type._capitalize(b);
    a.prototype[f] = function (a) {
      this.setAttr(b, a)
    };
    a.prototype[f + "Deg"] = function (a) {
      this.setAttr(b, Kinetic.Type._degToRad(a))
    }
  };
  Kinetic.Node.addGetter = function (a, b, f) {
    var d = "get" + Kinetic.Type._capitalize(b);
    a.prototype[d] = function () {
      var a =
        this.attrs[b];
      return void 0 === a && (a = f), a
    }
  };
  Kinetic.Node.addRotationGetter = function (a, b, f) {
    var d = "get" + Kinetic.Type._capitalize(b);
    a.prototype[d] = function () {
      var a = this.attrs[b];
      return void 0 === a && (a = f), a
    };
    a.prototype[d + "Deg"] = function () {
      var a = this.attrs[b];
      return void 0 === a && (a = f), Kinetic.Type._radToDeg(a)
    }
  };
  Kinetic.Node.create = function (a, b) {
    return this._createNode(JSON.parse(a), b)
  };
  Kinetic.Node._createNode = function (c, b) {
    var f, d, e;
    c.nodeType === a ? void 0 === c.shapeType ? f = a : f = c.shapeType : f = c.nodeType;
    b && (c.attrs.container = b);
    f = new Kinetic[f](c.attrs);
    if (c.children) {
      d = c.children.length;
      for (e = 0; e < d; e++) f.add(this._createNode(c.children[e]))
    }
    return f
  };
  Kinetic.Node.addGetterSetter(Kinetic.Node, "x", 0);
  Kinetic.Node.addGetterSetter(Kinetic.Node, "y", 0);
  Kinetic.Node.addGetterSetter(Kinetic.Node, "opacity", 1);
  Kinetic.Node.addGetter(Kinetic.Node, "name");
  Kinetic.Node.addGetter(Kinetic.Node, "id");
  Kinetic.Node.addRotationGetterSetter(Kinetic.Node, "rotation", 0);
  Kinetic.Node.addPointGetterSetter(Kinetic.Node,
    "scale", {
      x: 1,
      y: 1
    });
  Kinetic.Node.addPointGetterSetter(Kinetic.Node, "offset", {
    x: 0,
    y: 0
  });
  Kinetic.Node.addSetter(Kinetic.Node, "width");
  Kinetic.Node.addSetter(Kinetic.Node, "height");
  Kinetic.Node.addSetter(Kinetic.Node, "listening");
  Kinetic.Node.addSetter(Kinetic.Node, "visible");
  Kinetic.Node.prototype.isListening = Kinetic.Node.prototype.getListening;
  Kinetic.Node.prototype.isVisible = Kinetic.Node.prototype.getVisible;
  Kinetic.Collection.mapMethods(["on", "off"])
})();
(function () {
  Kinetic.Animation = function (a, b) {
    this.func = a;
    this.node = b;
    this.id = Kinetic.Animation.animIdCounter++;
    this.frame = {
      time: 0,
      timeDiff: 0,
      lastTime: (new Date).getTime()
    }
  };
  Kinetic.Animation.prototype = {
    isRunning: function () {
      for (var a = Kinetic.Animation.animations, b = 0; b < a.length; b++) if (a[b].id === this.id) return !0;
      return !1
    },
    start: function () {
      this.stop();
      this.frame.timeDiff = 0;
      this.frame.lastTime = (new Date).getTime();
      Kinetic.Animation._addAnimation(this)
    },
    stop: function () {
      Kinetic.Animation._removeAnimation(this)
    },
    _updateFrameObject: function (a) {
      this.frame.timeDiff = a - this.frame.lastTime;
      this.frame.lastTime = a;
      this.frame.time += this.frame.timeDiff;
      this.frame.frameRate = 1E3 / this.frame.timeDiff
    }
  };
  Kinetic.Animation.animations = [];
  Kinetic.Animation.animIdCounter = 0;
  Kinetic.Animation.animRunning = !1;
  Kinetic.Animation.fixedRequestAnimFrame = function (a) {
    window.setTimeout(a, 1E3 / 60)
  };
  Kinetic.Animation._addAnimation = function (a) {
    this.animations.push(a);
    this._handleAnimation()
  };
  Kinetic.Animation._removeAnimation = function (a) {
    a =
      a.id;
    for (var b = this.animations, f = b.length, d = 0; d < f; d++) if (b[d].id === a) {
      this.animations.splice(d, 1);
      break
    }
  };
  Kinetic.Animation._runFrames = function () {
    for (var a = {}, b = this.animations, f = 0; f < b.length; f++) {
      var d = b[f],
        e = d.node,
        g = d.func;
      d._updateFrameObject((new Date).getTime());
      e && void 0 !== e._id && (a[e._id] = e);
      g && g(d.frame)
    }
    for (var h in a) a[h].draw()
  };
  Kinetic.Animation._animationLoop = function () {
    var a = this;
    0 < this.animations.length ? (this._runFrames(), Kinetic.Animation.requestAnimFrame(function () {
      a._animationLoop()
    })) :
      this.animRunning = !1
  };
  Kinetic.Animation._handleAnimation = function () {
    this.animRunning || (this.animRunning = !0, this._animationLoop())
  };
  RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || Kinetic.Animation.fixedRequestAnimFrame;
  Kinetic.Animation.requestAnimFrame = function (a) {
    (Kinetic.DD && Kinetic.DD.isDragging ? this.fixedRequestAnimFrame : RAF)(a)
  };
  var a = Kinetic.Node.prototype.moveTo;
  Kinetic.Node.prototype.moveTo = function (c) {
    a.call(this, c)
  }
})();
(function () {
  Kinetic.DD = {
    anim: new Kinetic.Animation,
    isDragging: !1,
    offset: {
      x: 0,
      y: 0
    },
    node: null,
    _drag: function (a) {
      var c = Kinetic.DD,
        d = c.node;
      if (d) {
        var e = d.getStage().getPointerPosition(),
          g = d.getDragBoundFunc(),
          e = {
            x: e.x - c.offset.x,
            y: e.y - c.offset.y
          };
        void 0 !== g && (e = g.call(d, e, a));
        d.setAbsolutePosition(e);
        c.isDragging || (c.isDragging = !0, d._handleEvent("dragstart", a));
        d._handleEvent("dragmove", a)
      }
    },
    _endDragBefore: function (a) {
      var c = Kinetic.DD,
        d = c.node,
        e;
      d && (e = d.getLayer(), c.anim.stop(), c.isDragging && (c.isDragging = !1, a && (a.dragEndNode = d)), delete c.node, (e || d).draw())
    },
    _endDragAfter: function (a) {
      a = a || {};
      var c = a.dragEndNode;
      a && c && c._handleEvent("dragend", a)
    }
  };
  Kinetic.Node.prototype.startDrag = function () {
    var a = Kinetic.DD,
      c = this.getStage(),
      d = this.getLayer(),
      c = c.getPointerPosition();
    this.getTransform().getTranslation();
    var e = this.getAbsolutePosition(),
      d = d || this;
    c && (a.node && a.node.stopDrag(), a.node = this, a.offset.x = c.x - e.x, a.offset.y = c.y - e.y, a.anim.node = d, a.anim.start())
  };
  Kinetic.Node.prototype.stopDrag = function () {
    var a =
        Kinetic.DD,
      c = {};
    a._endDragBefore(c);
    a._endDragAfter(c)
  };
  Kinetic.Node.prototype.setDraggable = function (a) {
    this.setAttr("draggable", a);
    this._dragChange()
  };
  var a = Kinetic.Node.prototype.destroy;
  Kinetic.Node.prototype.destroy = function () {
    var b = Kinetic.DD;
    b.node && b.node._id === this._id && this.stopDrag();
    a.call(this)
  };
  Kinetic.Node.prototype.isDragging = function () {
    var a = Kinetic.DD;
    return a.node && a.node._id === this._id && a.isDragging
  };
  Kinetic.Node.prototype._listenDrag = function () {
    this._dragCleanup();
    var a = this;
    this.on("mousedown.kinetic touchstart.kinetic", function (c) {
      Kinetic.DD.node || a.startDrag(c)
    })
  };
  Kinetic.Node.prototype._dragChange = function () {
    if (this.attrs.draggable) this._listenDrag();
    else {
      this._dragCleanup();
      var a = this.getStage(),
        c = Kinetic.DD;
      a && c.node && c.node._id === this._id && c.node.stopDrag()
    }
  };
  Kinetic.Node.prototype._dragCleanup = function () {
    this.off("mousedown.kinetic");
    this.off("touchstart.kinetic")
  };
  Kinetic.Node.addGetterSetter(Kinetic.Node, "dragBoundFunc");
  Kinetic.Node.addGetterSetter(Kinetic.Node, "dragOnTop", !0);
  Kinetic.Node.addGetter(Kinetic.Node,
    "draggable", !1);
  Kinetic.Node.prototype.isDraggable = Kinetic.Node.prototype.getDraggable;
  var c = document.getElementsByTagName("html")[0];
  c.addEventListener("mouseup", Kinetic.DD._endDragBefore, !0);
  c.addEventListener("touchend", Kinetic.DD._endDragBefore, !0);
  c.addEventListener("mouseup", Kinetic.DD._endDragAfter, !1);
  c.addEventListener("touchend", Kinetic.DD._endDragAfter, !1)
})();
(function () {
  function a(a, b, f, d, e, g) {
    return new Kinetic.Tween(function (d) {
      a[b] = d
    }, f, d, e, g)
  }
  Kinetic.Transition = function (c, b) {
    var f = Kinetic.Tweens[b.easing || "linear"],
      d = b.duration || 0,
      e = null,
      g = 0,
      g = {};
    this.tweens = [];
    this.attrs = {};
    this.node = c;
    for (var h in b) "duration" !== h && "easing" !== h && "callback" !== h && (e = b[h], g = c.getAttr(h), Kinetic.Type._isObject(g) ? (configValX = e.x, configValY = e.y, this.attrs[h] = {}, void 0 !== configValX && this.tweens.push(a(this.attrs[h], "x", f, g.x, configValX, d)), void 0 !== configValY && this.tweens.push(a(this.attrs[h],
      "y", f, g.y, configValY, d))) : this.tweens.push(a(this.attrs, h, f, c.getAttr(h), e, d)));
    g = this.tweens.length - 1;
    this.tweens[g].onStarted = function () {};
    this.tweens[g].onStopped = function () {
      c.transAnim.stop()
    };
    this.tweens[g].onResumed = function () {
      c.transAnim.start()
    };
    this.tweens[g].onLooped = function () {};
    this.tweens[g].onChanged = function () {};
    this.tweens[g].onFinished = function () {
      var a = {}, d;
      for (d in b) "duration" !== d && "easing" !== d && "callback" !== d && (a[d] = b[d]);
      c.transAnim.stop();
      c.setAttrs(a);
      b.callback && b.callback.call(c)
    }
  };
  Kinetic.Transition.prototype = {
    start: function () {
      for (var a = 0; a < this.tweens.length; a++) this.tweens[a].start()
    },
    stop: function () {
      for (var a = 0; a < this.tweens.length; a++) this.tweens[a].stop()
    },
    resume: function () {
      for (var a = 0; a < this.tweens.length; a++) this.tweens[a].resume()
    },
    _onEnterFrame: function () {
      for (var a = 0; a < this.tweens.length; a++) this.tweens[a].onEnterFrame();
      this.node.setAttrs(this.attrs)
    },
    _add: function (a) {
      this.tweens.push(a)
    }
  };
  Kinetic.Node.prototype.transitionTo = function (a) {
    var b = new Kinetic.Transition(this,
      a);
    return this.transAnim || (this.transAnim = new Kinetic.Animation), this.transAnim.func = function () {
      b._onEnterFrame()
    }, this.transAnim.node = "Stage" === this.nodeType ? this : this.getLayer(), b.start(), this.transAnim.start(), this.trans = b, b
  }
})();
(function () {
  Kinetic.Container = function (a) {
    this._containerInit(a)
  };
  Kinetic.Container.prototype = {
    _containerInit: function (a) {
      this.children = [];
      Kinetic.Node.call(this, a)
    },
    getChildren: function () {
      return this.children
    },
    removeChildren: function () {
      for (; 0 < this.children.length;) this.children[0].remove()
    },
    add: function (a) {
      var c = this.children;
      return a.index = c.length, a.parent = this, c.push(a), this
    },
    get: function (a) {
      var c = new Kinetic.Collection;
      if ("#" === a.charAt(0))(a = this._getNodeById(a.slice(1))) && c.push(a);
      else if ("." ===
        a.charAt(0)) a = this._getNodesByName(a.slice(1)), Kinetic.Collection.apply(c, a);
      else {
        for (var b = [], f = this.getChildren(), d = f.length, e = 0; e < d; e++) b = b.concat(f[e]._get(a));
        Kinetic.Collection.apply(c, b)
      }
      return c
    },
    _getNodeById: function (a) {
      this.getStage();
      a = Kinetic.Global.ids[a];
      return void 0 !== a && this.isAncestorOf(a) ? a : null
    },
    _getNodesByName: function (a) {
      return this._getDescendants(Kinetic.Global.names[a] || [])
    },
    _get: function (a) {
      for (var c = Kinetic.Node.prototype._get.call(this, a), b = this.getChildren(), f = b.length,
             d = 0; d < f; d++) c = c.concat(b[d]._get(a));
      return c
    },
    toObject: function () {
      var a = Kinetic.Node.prototype.toObject.call(this);
      a.children = [];
      for (var c = this.getChildren(), b = c.length, f = 0; f < b; f++) a.children.push(c[f].toObject());
      return a
    },
    _getDescendants: function (a) {
      for (var c = [], b = a.length, f = 0; f < b; f++) {
        var d = a[f];
        this.isAncestorOf(d) && c.push(d)
      }
      return c
    },
    isAncestorOf: function (a) {
      for (a = a.getParent(); a;) {
        if (a._id === this._id) return !0;
        a = a.getParent()
      }
      return !1
    },
    clone: function (a) {
      a = Kinetic.Node.prototype.clone.call(this,
        a);
      for (var c in this.children) a.add(this.children[c].clone());
      return a
    },
    getIntersections: function () {
      for (var a = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)), c = [], b = this.get("Shape"), f = b.length, d = 0; d < f; d++) {
        var e = b[d];
        e.isVisible() && e.intersects(a) && c.push(e)
      }
      return c
    },
    _setChildrenIndices: function () {
      for (var a = this.children, c = a.length, b = 0; b < c; b++) a[b].index = b
    },
    drawScene: function (a) {
      var c = this.getLayer(),
        b = !! this.getClipFunc();
      this.getStage();
      var f;
      !a && c && (a = c.getCanvas());
      if (this.isVisible()) {
        b &&
        a._clip(this);
        c = this.children;
        f = c.length;
        for (var d = 0; d < f; d++) c[d].drawScene(a);
        b && a.getContext().restore()
      }
    },
    drawHit: function () {
      var a = !! this.getClipFunc() && "Stage" !== this.nodeType,
        c = 0,
        b = 0,
        f = [],
        d;
      if (this.shouldDrawHit()) {
        a && (d = this.getLayer().hitCanvas, d._clip(this));
        f = this.children;
        b = f.length;
        for (c = 0; c < b; c++) f[c].drawHit();
        a && d.getContext().restore()
      }
    }
  };
  Kinetic.Global.extend(Kinetic.Container, Kinetic.Node);
  Kinetic.Node.addGetterSetter(Kinetic.Container, "clipFunc")
})();
(function () {
  function a(a) {
    a.fill()
  }
  function c(a) {
    a.stroke()
  }
  function b(a) {
    a.fill()
  }
  function f(a) {
    a.stroke()
  }
  Kinetic.Shape = function (a) {
    this._initShape(a)
  };
  Kinetic.Shape.prototype = {
    _initShape: function (d) {
      this.nodeType = "Shape";
      this._fillFunc = a;
      this._strokeFunc = c;
      this._fillFuncHit = b;
      this._strokeFuncHit = f;
      for (var e = Kinetic.Global.shapes, g; !(g = Kinetic.Type._getRandomColorKey()) || g in e;);
      this.colorKey = g;
      e[g] = this;
      this.createAttrs();
      Kinetic.Node.call(this, d)
    },
    getContext: function () {
      return this.getLayer().getContext()
    },
    getCanvas: function () {
      return this.getLayer().getCanvas()
    },
    hasShadow: function () {
      return !(!this.getShadowColor() && !this.getShadowBlur() && !this.getShadowOffset())
    },
    hasFill: function () {
      return !(!this.getFill() && !this.getFillPatternImage() && !this.getFillLinearGradientStartPoint() && !this.getFillRadialGradientStartPoint())
    },
    _get: function (a) {
      return this.nodeType === a || this.shapeType === a ? [this] : []
    },
    intersects: function () {
      var a = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)),
        b = this.getStage().hitCanvas;
      b.clear();
      this.drawScene(b);
      return 0 < b.context.getImageData(a.x | 0, a.y | 0, 1, 1).data[3]
    },
    enableFill: function () {
      this.setAttr("fillEnabled", !0)
    },
    disableFill: function () {
      this.setAttr("fillEnabled", !1)
    },
    enableStroke: function () {
      this.setAttr("strokeEnabled", !0)
    },
    disableStroke: function () {
      this.setAttr("strokeEnabled", !1)
    },
    enableStrokeScale: function () {
      this.setAttr("strokeScaleEnabled", !0)
    },
    disableStrokeScale: function () {
      this.setAttr("strokeScaleEnabled", !1)
    },
    enableShadow: function () {
      this.setAttr("shadowEnabled", !0)
    },
    disableShadow: function () {
      this.setAttr("shadowEnabled", !1)
    },
    enableDashArray: function () {
      this.setAttr("dashArrayEnabled", !0)
    },
    disableDashArray: function () {
      this.setAttr("dashArrayEnabled", !1)
    },
    getShapeType: function () {
      return this.shapeType
    },
    destroy: function () {
      Kinetic.Node.prototype.destroy.call(this);
      delete Kinetic.Global.shapes[this.colorKey]
    },
    drawScene: function (a) {
      var b = this.getAttrs().drawFunc;
      a = a || this.getLayer().getCanvas();
      var c = a.getContext();
      b && this.isVisible() && (c.save(), a._applyOpacity(this),
        a._applyLineJoin(this), a._applyAncestorTransforms(this), b.call(this, a), c.restore())
    },
    drawHit: function () {
      var a = this.getAttrs(),
        a = a.drawHitFunc || a.drawFunc,
        b = this.getLayer().hitCanvas,
        c = b.getContext();
      a && this.shouldDrawHit() && (c.save(), b._applyLineJoin(this), b._applyAncestorTransforms(this), a.call(this, b), c.restore())
    },
    _setDrawFuncs: function () {
      !this.attrs.drawFunc && this.drawFunc && this.setDrawFunc(this.drawFunc);
      !this.attrs.drawHitFunc && this.drawHitFunc && this.setDrawHitFunc(this.drawHitFunc)
    }
  };
  Kinetic.Global.extend(Kinetic.Shape,
    Kinetic.Node);
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "stroke");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "lineJoin");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "lineCap");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "strokeWidth");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "drawFunc");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "drawHitFunc");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "dashArray");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "shadowColor");
  Kinetic.Node.addGetterSetter(Kinetic.Shape,
    "shadowBlur");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "shadowOpacity");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillPatternImage");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "fill");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillPatternX");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillPatternY");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillLinearGradientColorStops");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillRadialGradientStartRadius");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillRadialGradientEndRadius");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillRadialGradientColorStops");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillPatternRepeat");
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillEnabled", !0);
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "strokeEnabled", !0);
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "shadowEnabled", !0);
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "dashArrayEnabled", !0);
  Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillPriority", "color");
  Kinetic.Node.addGetterSetter(Kinetic.Shape,
    "strokeScaleEnabled", !0);
  Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillPatternOffset");
  Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillPatternScale");
  Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillLinearGradientStartPoint");
  Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillLinearGradientEndPoint");
  Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillRadialGradientStartPoint");
  Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillRadialGradientEndPoint");
  Kinetic.Node.addPointGetterSetter(Kinetic.Shape,
    "shadowOffset");
  Kinetic.Node.addRotationGetterSetter(Kinetic.Shape, "fillPatternRotation", 0)
})();
(function () {
  function a(a, c) {
    a.content.addEventListener(c, function (d) {
      a["_" + c](d)
    }, !1)
  }
  var c = "mouseout",
    c = "mouseout";
  TOUCHEND = "touchend";
  TAP = "tap";
  DBL_TAP = "dbltap";
  TOUCHMOVE = "touchmove";
  DIV = "div";
  RELATIVE = "relative";
  INLINE_BLOCK = "inline-block";
  KINETICJS_CONTENT = "kineticjs-content";
  SPACE = " ";
  CONTAINER = "container";
  EVENTS = ["mousedown", "mousemove", "mouseup", c, "touchstart", TOUCHMOVE, TOUCHEND];
  eventsLength = EVENTS.length;
  Kinetic.Stage = function (a) {
    this._initStage(a)
  };
  Kinetic.Stage.prototype = {
    _initStage: function (a) {
      this.createAttrs();
      Kinetic.Container.call(this, a);
      this.nodeType = "Stage";
      this.dblClickWindow = 400;
      this._id = Kinetic.Global.idCounter++;
      this._buildDOM();
      this._bindContentEvents();
      Kinetic.Global.stages.push(this)
    },
    setContainer: function (a) {
      "string" === typeof a && (a = document.getElementById(a));
      this.setAttr(CONTAINER, a)
    },
    draw: function () {
      var a = this.getChildren(),
        c = a.length,
        d, e;
      for (d = 0; d < c; d++) e = a[d], e.getClearBeforeDraw() && (e.getCanvas().clear(), e.getHitCanvas().clear());
      Kinetic.Node.prototype.draw.call(this)
    },
    setHeight: function (a) {
      Kinetic.Node.prototype.setHeight.call(this,
        a);
      this._resizeDOM()
    },
    setWidth: function (a) {
      Kinetic.Node.prototype.setWidth.call(this, a);
      this._resizeDOM()
    },
    clear: function () {
      var a = this.children,
        c = a.length,
        d;
      for (d = 0; d < c; d++) a[d].clear()
    },
    remove: function () {
      var a = this.content;
      Kinetic.Node.prototype.remove.call(this);
      a && Kinetic.Type._isInDocument(a) && this.getContainer().removeChild(a)
    },
    getMousePosition: function () {
      return this.mousePos
    },
    getTouchPosition: function () {
      return this.touchPos
    },
    getPointerPosition: function () {
      return this.getTouchPosition() || this.getMousePosition()
    },
    getStage: function () {
      return this
    },
    getContent: function () {
      return this.content
    },
    toDataURL: function (a) {
      function c(g) {
        var h = n[g].toDataURL(),
          m = new Image;
        m.onload = function () {
          k.drawImage(m, 0, 0);
          g < n.length - 1 ? c(g + 1) : a.callback(j.toDataURL(d, e))
        };
        m.src = h
      }
      a = a || {};
      var d = a.mimeType || null,
        e = a.quality || null,
        g = a.x || 0,
        h = a.y || 0,
        j = new Kinetic.SceneCanvas({
          width: a.width || this.getWidth(),
          height: a.height || this.getHeight(),
          pixelRatio: 1
        }),
        k = j.getContext(),
        n = this.children;
      (g || h) && k.translate(-1 * g, -1 * h);
      c(0)
    },
    toImage: function (a) {
      var c =
        a.callback;
      a.callback = function (a) {
        Kinetic.Type._getImage(a, function (a) {
          c(a)
        })
      };
      this.toDataURL(a)
    },
    getIntersection: function () {
      var a = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)),
        c = this.getChildren(),
        d, e;
      for (d = c.length - 1; 0 <= d; d--) if (e = c[d].getIntersection(a)) return e;
      return null
    },
    _resizeDOM: function () {
      if (this.content) {
        var a = this.getWidth(),
          c = this.getHeight(),
          d = this.getChildren(),
          e = d.length,
          g;
        this.content.style.width = a + "px";
        this.content.style.height = c + "px";
        this.bufferCanvas.setSize(a, c,
          1);
        this.hitCanvas.setSize(a, c);
        for (g = 0; g < e; g++) layer = d[g], layer.getCanvas().setSize(a, c), layer.hitCanvas.setSize(a, c), layer.draw()
      }
    },
    add: function (a) {
      return Kinetic.Container.prototype.add.call(this, a), a.canvas.setSize(this.attrs.width, this.attrs.height), a.hitCanvas.setSize(this.attrs.width, this.attrs.height), a.draw(), this.content.appendChild(a.canvas.element), this
    },
    getParent: function () {
      return null
    },
    getLayer: function () {
      return null
    },
    _setPointerPosition: function (a) {
      a || (a = window.event);
      this._setMousePosition(a);
      this._setTouchPosition(a)
    },
    _bindContentEvents: function () {
      var b;
      for (b = 0; b < eventsLength; b++) a(this, EVENTS[b])
    },
    _mouseout: function (a) {
      this._setPointerPosition(a);
      var f = Kinetic.Global,
        d = this.targetShape;
      d && !f.isDragging() && (d._handleEvent(c, a), d._handleEvent("mouseleave", a), this.targetShape = null);
      this.mousePos = void 0
    },
    _mousemove: function (a) {
      this._setPointerPosition(a);
      var f = Kinetic.Global,
        d = Kinetic.DD,
        e = this.getIntersection(this.getPointerPosition()),
        g;
      e ? (g = e.shape, g && (!f.isDragging() && 255 === e.pixel[3] &&
        (!this.targetShape || this.targetShape._id !== g._id) ? (this.targetShape && (this.targetShape._handleEvent(c, a, g), this.targetShape._handleEvent("mouseleave", a, g)), g._handleEvent("mouseover", a, this.targetShape), g._handleEvent("mouseenter", a, this.targetShape), this.targetShape = g) : g._handleEvent("mousemove", a))) : this.targetShape && !f.isDragging() && (this.targetShape._handleEvent(c, a), this.targetShape._handleEvent("mouseleave", a), this.targetShape = null);
      d && d._drag(a)
    },
    _mousedown: function (a) {
      this._setPointerPosition(a);
      var c = Kinetic.Global,
        d = this.getIntersection(this.getPointerPosition()),
        e;
      d && d.shape && (e = d.shape, this.clickStart = !0, this.clickStartShape = e, e._handleEvent("mousedown", a));
      this.isDraggable() && !c.isDragReady() && this.startDrag(a)
    },
    _mouseup: function (a) {
      this._setPointerPosition(a);
      var c = this,
        d = Kinetic.Global,
        e = this.getIntersection(this.getPointerPosition()),
        g;
      e && e.shape && (g = e.shape, g._handleEvent("mouseup", a), this.clickStart && !d.isDragging() && g._id === this.clickStartShape._id && (g._handleEvent("click", a),
        this.inDoubleClickWindow && g._handleEvent("dblclick", a), this.inDoubleClickWindow = !0, setTimeout(function () {
        c.inDoubleClickWindow = !1
      }, this.dblClickWindow)));
      this.clickStart = !1
    },
    _touchstart: function (a) {
      this._setPointerPosition(a);
      var c = Kinetic.Global,
        d = this.getIntersection(this.getPointerPosition()),
        e;
      a.preventDefault();
      d && d.shape && (e = d.shape, this.tapStart = !0, this.tapStartShape = e, e._handleEvent("touchstart", a));
      this.isDraggable() && !c.isDragReady() && this.startDrag(a)
    },
    _touchend: function (a) {
      this._setPointerPosition(a);
      var c = this,
        d = Kinetic.Global,
        e = this.getIntersection(this.getPointerPosition()),
        g;
      e && e.shape && (g = e.shape, g._handleEvent(TOUCHEND, a), this.tapStart && !d.isDragging() && g._id === this.tapStartShape._id && (g._handleEvent(TAP, a), this.inDoubleClickWindow && g._handleEvent(DBL_TAP, a), this.inDoubleClickWindow = !0, setTimeout(function () {
        c.inDoubleClickWindow = !1
      }, this.dblClickWindow)));
      this.tapStart = !1
    },
    _touchmove: function (a) {
      this._setPointerPosition(a);
      var c = Kinetic.DD,
        d = this.getIntersection(this.getPointerPosition()),
        e;
      a.preventDefault();
      d && d.shape && (e = d.shape, e._handleEvent(TOUCHMOVE, a));
      c && c._drag(a)
    },
    _setMousePosition: function (a) {
      var c = a.clientX - this._getContentPosition().left;
      a = a.clientY - this._getContentPosition().top;
      this.mousePos = {
        x: c,
        y: a
      }
    },
    _setTouchPosition: function (a) {
      var c, d, e;
      void 0 !== a.touches && 1 === a.touches.length && (c = a.touches[0], d = c.clientX - this._getContentPosition().left, e = c.clientY - this._getContentPosition().top, this.touchPos = {
        x: d,
        y: e
      })
    },
    _getContentPosition: function () {
      var a = this.content.getBoundingClientRect();
      return {
        top: a.top,
        left: a.left
      }
    },
    _buildDOM: function () {
      this.content = document.createElement(DIV);
      this.content.style.position = RELATIVE;
      this.content.style.display = INLINE_BLOCK;
      this.content.className = KINETICJS_CONTENT;
      this.attrs.container.appendChild(this.content);
      this.bufferCanvas = new Kinetic.SceneCanvas;
      this.hitCanvas = new Kinetic.HitCanvas;
      this._resizeDOM()
    },
    _onContent: function (a, c) {
      var d = a.split(SPACE),
        e = d.length,
        g, h;
      for (g = 0; g < e; g++) h = d[g], this.content.addEventListener(h, c, !1)
    }
  };
  Kinetic.Global.extend(Kinetic.Stage,
    Kinetic.Container);
  Kinetic.Node.addGetter(Kinetic.Stage, "container")
})();
(function () {
  Kinetic.Layer = function (a) {
    this._initLayer(a)
  };
  Kinetic.Layer.prototype = {
    _initLayer: function (a) {
      this.nodeType = "Layer";
      this.createAttrs();
      Kinetic.Container.call(this, a);
      this.canvas = new Kinetic.SceneCanvas;
      this.canvas.getElement().style.position = "absolute";
      this.hitCanvas = new Kinetic.HitCanvas
    },
    getIntersection: function () {
      var a = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)),
        c, b;
      if (this.isVisible() && this.isListening()) {
        a = this.hitCanvas.context.getImageData(a.x | 0, a.y | 0, 1, 1).data;
        if (255 ===
          a[3]) return c = Kinetic.Type._rgbToHex(a[0], a[1], a[2]), b = Kinetic.Global.shapes[c], {
          shape: b,
          pixel: a
        };
        if (0 < a[0] || 0 < a[1] || 0 < a[2] || 0 < a[3]) return {
          pixel: a
        }
      }
      return null
    },
    drawScene: function (a) {
      a = a || this.getCanvas();
      this.getClearBeforeDraw() && a.clear();
      Kinetic.Container.prototype.drawScene.call(this, a)
    },
    drawHit: function () {
      var a = this.getLayer();
      a && a.getClearBeforeDraw() && a.getHitCanvas().clear();
      Kinetic.Container.prototype.drawHit.call(this)
    },
    getCanvas: function () {
      return this.canvas
    },
    getHitCanvas: function () {
      return this.hitCanvas
    },
    getContext: function () {
      return this.getCanvas().getContext()
    },
    clear: function () {
      this.getCanvas().clear()
    },
    setVisible: function (a) {
      Kinetic.Node.prototype.setVisible.call(this, a);
      a ? (this.getCanvas().element.style.display = "block", this.hitCanvas.element.style.display = "block") : (this.getCanvas().element.style.display = "none", this.hitCanvas.element.style.display = "none")
    },
    setZIndex: function (a) {
      Kinetic.Node.prototype.setZIndex.call(this, a);
      var c = this.getStage();
      c && (c.content.removeChild(this.getCanvas().element),
        a < c.getChildren().length - 1 ? c.content.insertBefore(this.getCanvas().element, c.getChildren()[a + 1].getCanvas().element) : c.content.appendChild(this.getCanvas().element))
    },
    moveToTop: function () {
      Kinetic.Node.prototype.moveToTop.call(this);
      var a = this.getStage();
      a && (a.content.removeChild(this.getCanvas().element), a.content.appendChild(this.getCanvas().element))
    },
    moveUp: function () {
      if (Kinetic.Node.prototype.moveUp.call(this)) {
        var a = this.getStage();
        a && (a.content.removeChild(this.getCanvas().element), this.index <
          a.getChildren().length - 1 ? a.content.insertBefore(this.getCanvas().element, a.getChildren()[this.index + 1].getCanvas().element) : a.content.appendChild(this.getCanvas().element))
      }
    },
    moveDown: function () {
      if (Kinetic.Node.prototype.moveDown.call(this)) {
        var a = this.getStage();
        if (a) {
          var c = a.getChildren();
          a.content.removeChild(this.getCanvas().element);
          a.content.insertBefore(this.getCanvas().element, c[this.index + 1].getCanvas().element)
        }
      }
    },
    moveToBottom: function () {
      if (Kinetic.Node.prototype.moveToBottom.call(this)) {
        var a =
          this.getStage();
        if (a) {
          var c = a.getChildren();
          a.content.removeChild(this.getCanvas().element);
          a.content.insertBefore(this.getCanvas().element, c[1].getCanvas().element)
        }
      }
    },
    getLayer: function () {
      return this
    },
    remove: function () {
      var a = this.getStage(),
        c = this.getCanvas(),
        b = c.element;
      Kinetic.Node.prototype.remove.call(this);
      a && c && Kinetic.Type._isInDocument(b) && a.content.removeChild(b)
    }
  };
  Kinetic.Global.extend(Kinetic.Layer, Kinetic.Container);
  Kinetic.Node.addGetterSetter(Kinetic.Layer, "clearBeforeDraw", !0)
})();
(function () {
  Kinetic.Group = function (a) {
    this._initGroup(a)
  };
  Kinetic.Group.prototype = {
    _initGroup: function (a) {
      this.nodeType = "Group";
      this.createAttrs();
      Kinetic.Container.call(this, a)
    }
  };
  Kinetic.Global.extend(Kinetic.Group, Kinetic.Container)
})();
(function () {
  Kinetic.Rect = function (a) {
    this._initRect(a)
  };
  Kinetic.Rect.prototype = {
    _initRect: function (a) {
      this.createAttrs();
      Kinetic.Shape.call(this, a);
      this.shapeType = "Rect";
      this._setDrawFuncs()
    },
    drawFunc: function (a) {
      var c = a.getContext(),
        b = this.getCornerRadius(),
        f = this.getWidth(),
        d = this.getHeight();
      c.beginPath();
      b ? (c.moveTo(b, 0), c.lineTo(f - b, 0), c.arc(f - b, b, b, 3 * Math.PI / 2, 0, !1), c.lineTo(f, d - b), c.arc(f - b, d - b, b, 0, Math.PI / 2, !1), c.lineTo(b, d), c.arc(b, d - b, b, Math.PI / 2, Math.PI, !1), c.lineTo(0, b), c.arc(b, b, b, Math.PI,
        3 * Math.PI / 2, !1)) : c.rect(0, 0, f, d);
      c.closePath();
      a.fillStroke(this)
    }
  };
  Kinetic.Global.extend(Kinetic.Rect, Kinetic.Shape);
  Kinetic.Node.addGetterSetter(Kinetic.Rect, "cornerRadius", 0)
})();
(function () {
  Kinetic.Circle = function (a) {
    this._initCircle(a)
  };
  Kinetic.Circle.prototype = {
    _initCircle: function (a) {
      this.createAttrs();
      Kinetic.Shape.call(this, a);
      this.shapeType = "Circle";
      this._setDrawFuncs()
    },
    drawFunc: function (a) {
      var c = a.getContext();
      c.beginPath();
      c.arc(0, 0, this.getRadius(), 0, 2 * Math.PI, !0);
      c.closePath();
      a.fillStroke(this)
    },
    getWidth: function () {
      return 2 * this.getRadius()
    },
    getHeight: function () {
      return 2 * this.getRadius()
    },
    setWidth: function (a) {
      Kinetic.Node.prototype.setWidth.call(this, a);
      this.setRadius(a /
        2)
    },
    setHeight: function (a) {
      Kinetic.Node.prototype.setHeight.call(this, a);
      this.setRadius(a / 2)
    }
  };
  Kinetic.Global.extend(Kinetic.Circle, Kinetic.Shape);
  Kinetic.Node.addGetterSetter(Kinetic.Circle, "radius", 0)
})();
(function () {
  Kinetic.Wedge = function (a) {
    this._initWedge(a)
  };
  Kinetic.Wedge.prototype = {
    _initWedge: function (a) {
      this.createAttrs();
      Kinetic.Shape.call(this, a);
      this.shapeType = "Wedge";
      this._setDrawFuncs()
    },
    drawFunc: function (a) {
      var c = a.getContext();
      c.beginPath();
      c.arc(0, 0, this.getRadius(), 0, this.getAngle(), this.getClockwise());
      c.lineTo(0, 0);
      c.closePath();
      a.fillStroke(this)
    },
    setAngleDeg: function (a) {
      this.setAngle(Kinetic.Type._degToRad(a))
    },
    getAngleDeg: function () {
      return Kinetic.Type._radToDeg(this.getAngle())
    }
  };
  Kinetic.Global.extend(Kinetic.Wedge, Kinetic.Shape);
  Kinetic.Node.addGetterSetter(Kinetic.Wedge, "radius", 0);
  Kinetic.Node.addGetterSetter(Kinetic.Wedge, "angle", 0);
  Kinetic.Node.addGetterSetter(Kinetic.Wedge, "clockwise", !1)
})();
(function () {
  Kinetic.Ellipse = function (a) {
    this._initEllipse(a)
  };
  Kinetic.Ellipse.prototype = {
    _initEllipse: function (a) {
      this.createAttrs();
      Kinetic.Shape.call(this, a);
      this.shapeType = "Ellipse";
      this._setDrawFuncs()
    },
    drawFunc: function (a) {
      var c = a.getContext(),
        b = this.getRadius();
      c.beginPath();
      c.save();
      b.x !== b.y && c.scale(1, b.y / b.x);
      c.arc(0, 0, b.x, 0, 2 * Math.PI, !0);
      c.restore();
      c.closePath();
      a.fillStroke(this)
    },
    getWidth: function () {
      return 2 * this.getRadius().x
    },
    getHeight: function () {
      return 2 * this.getRadius().y
    },
    setWidth: function (a) {
      Kinetic.Node.prototype.setWidth.call(this,
        a);
      this.setRadius({
        x: a / 2
      })
    },
    setHeight: function (a) {
      Kinetic.Node.prototype.setHeight.call(this, a);
      this.setRadius({
        y: a / 2
      })
    }
  };
  Kinetic.Global.extend(Kinetic.Ellipse, Kinetic.Shape);
  Kinetic.Node.addPointGetterSetter(Kinetic.Ellipse, "radius", {
    x: 0,
    y: 0
  })
})();
(function () {
  Kinetic.Image = function (a) {
    this._initImage(a)
  };
  Kinetic.Image.prototype = {
    _initImage: function (a) {
      Kinetic.Shape.call(this, a);
      this.shapeType = "Image";
      this._setDrawFuncs()
    },
    drawFunc: function (a) {
      var c = this.getWidth(),
        b = this.getHeight(),
        f, d = this,
        e = a.getContext(),
        g = this.getImage(),
        h = this.getCrop(),
        j, k, n, p;
      e.beginPath();
      e.rect(0, 0, c, b);
      e.closePath();
      a.fillStroke(this);
      g && (h ? (j = h.x || 0, k = h.y || 0, n = h.width || 0, p = h.height || 0, f = [g, j, k, n, p, 0, 0, c, b]) : f = [g, 0, 0, c, b], this.hasShadow() ? a.applyShadow(this, function () {
        d._drawImage(e,
          f)
      }) : this._drawImage(e, f))
    },
    drawHitFunc: function (a) {
      var c = this.getWidth(),
        b = this.getHeight(),
        f = this.imageHitRegion,
        d = a.getContext();
      f ? (d.drawImage(f, 0, 0, c, b), d.beginPath(), d.rect(0, 0, c, b), d.closePath(), a.stroke(this)) : (d.beginPath(), d.rect(0, 0, c, b), d.closePath(), a.fillStroke(this))
    },
    applyFilter: function (a, c, b) {
      var f = this.getImage(),
        d = new Kinetic.Canvas({
          width: f.width,
          height: f.height
        }),
        e = d.getContext(),
        g = this;
      e.drawImage(f, 0, 0);
      try {
        var h = e.getImageData(0, 0, d.getWidth(), d.getHeight());
        a(h, c);
        Kinetic.Type._getImage(h, function (a) {
          g.setImage(a);
          b && b()
        })
      } catch (j) {
        Kinetic.Global.warn("Unable to apply filter. " + j.message)
      }
    },
    setCrop: function () {
      var a = [].slice.call(arguments),
        c = Kinetic.Type._getXY(a),
        a = Kinetic.Type._getSize(a),
        c = Kinetic.Type._merge(c, a);
      this.setAttr("crop", Kinetic.Type._merge(c, this.getCrop()))
    },
    createImageHitRegion: function (a) {
      var c = this,
        b = this.getWidth(),
        f = this.getHeight(),
        d = (new Kinetic.Canvas({
          width: b,
          height: f
        })).getContext(),
        e = this.getImage(),
        g, h, j, k, n;
      d.drawImage(e, 0, 0);
      try {
        g = d.getImageData(0, 0,
          b, f);
        h = g.data;
        j = Kinetic.Type._hexToRgb(this.colorKey);
        k = 0;
        for (n = h.length; k < n; k += 4) 0 < h[k + 3] && (h[k] = j.r, h[k + 1] = j.g, h[k + 2] = j.b);
        Kinetic.Type._getImage(g, function (b) {
          c.imageHitRegion = b;
          a && a()
        })
      } catch (p) {
        Kinetic.Global.warn("Unable to create image hit region. " + p.message)
      }
    },
    clearImageHitRegion: function () {
      delete this.imageHitRegion
    },
    getWidth: function () {
      var a = this.getImage();
      return this.attrs.width || (a ? a.width : 0)
    },
    getHeight: function () {
      var a = this.getImage();
      return this.attrs.height || (a ? a.height : 0)
    },
    _drawImage: function (a,
                          c) {
      5 === c.length ? a.drawImage(c[0], c[1], c[2], c[3], c[4]) : 9 === c.length && a.drawImage(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8])
    }
  };
  Kinetic.Global.extend(Kinetic.Image, Kinetic.Shape);
  Kinetic.Node.addGetterSetter(Kinetic.Image, "image");
  Kinetic.Node.addGetter(Kinetic.Image, "crop")
})();
(function () {
  Kinetic.Polygon = function (a) {
    this._initPolygon(a)
  };
  Kinetic.Polygon.prototype = {
    _initPolygon: function (a) {
      this.createAttrs();
      Kinetic.Shape.call(this, a);
      this.shapeType = "Polygon";
      this._setDrawFuncs()
    },
    drawFunc: function (a) {
      var c = a.getContext(),
        b = this.getPoints(),
        f = b.length;
      c.beginPath();
      c.moveTo(b[0].x, b[0].y);
      for (var d = 1; d < f; d++) c.lineTo(b[d].x, b[d].y);
      c.closePath();
      a.fillStroke(this)
    },
    setPoints: function (a) {
      this.setAttr("points", Kinetic.Type._getPoints(a))
    },
    getPoints: function () {
      return this.attrs.points || []
    }
  };
  Kinetic.Global.extend(Kinetic.Polygon, Kinetic.Shape)
})();
(function () {
  function a(a) {
    a.fillText(this.partialText, 0, 0)
  }
  function c(a) {
    a.strokeText(this.partialText, 0, 0)
  }
  var b = "fontFamily fontSize fontStyle padding align lineHeight text width height wrap".split(" "),
    f = b.length,
    d = document.createElement("canvas").getContext("2d");
  Kinetic.Text = function (a) {
    this._initText(a)
  };
  Kinetic.Text.prototype = {
    _initText: function (d) {
      this.createAttrs();
      this.attrs.width = "auto";
      this.attrs.height = "auto";
      Kinetic.Shape.call(this, d);
      this.shapeType = "text";
      this._fillFunc = a;
      this._strokeFunc =
        c;
      this.shapeType = "Text";
      this._setDrawFuncs();
      for (d = 0; d < f; d++) this.on(b[d] + "Change.kinetic", this._setTextData);
      this._setTextData()
    },
    drawFunc: function (a) {
      var b = a.getContext(),
        c = this.getPadding();
      this.getFontStyle();
      this.getFontSize();
      this.getFontFamily();
      var d = this.getTextHeight(),
        f = this.getLineHeight() * d,
        n = this.textArr,
        p = n.length,
        l = this.getWidth();
      b.font = this._getContextFont();
      b.textBaseline = "middle";
      b.textAlign = "left";
      b.save();
      b.translate(c, 0);
      b.translate(0, c + d / 2);
      for (d = 0; d < p; d++) {
        var m = n[d],
          q = m.text,
          m = m.width;
        b.save();
        "right" === this.getAlign() ? b.translate(l - m - 2 * c, 0) : "center" === this.getAlign() && b.translate((l - m - 2 * c) / 2, 0);
        this.partialText = q;
        a.fillStroke(this);
        b.restore();
        b.translate(0, f)
      }
      b.restore()
    },
    drawHitFunc: function (a) {
      var b = a.getContext(),
        c = this.getWidth(),
        d = this.getHeight();
      b.beginPath();
      b.rect(0, 0, c, d);
      b.closePath();
      a.fillStroke(this)
    },
    setText: function (a) {
      a = Kinetic.Type._isString(a) ? a : a.toString();
      this.setAttr("text", a)
    },
    getWidth: function () {
      return "auto" === this.attrs.width ? this.getTextWidth() +
        2 * this.getPadding() : this.attrs.width
    },
    getHeight: function () {
      return "auto" === this.attrs.height ? this.getTextHeight() * this.textArr.length * this.getLineHeight() + 2 * this.getPadding() : this.attrs.height
    },
    getTextWidth: function () {
      return this.textWidth
    },
    getTextHeight: function () {
      return this.textHeight
    },
    _getTextSize: function (a) {
      var b = this.getFontSize(),
        c;
      return d.save(), d.font = this._getContextFont(), c = d.measureText(a), d.restore(), {
        width: c.width,
        height: parseInt(b, 10)
      }
    },
    _getContextFont: function () {
      return this.getFontStyle() +
        " " + this.getFontSize() + "px " + this.getFontFamily()
    },
    _addTextLine: function (a, b) {
      return this.textArr.push({
        text: a,
        width: b
      })
    },
    _getTextWidth: function (a) {
      return d.measureText(a).width
    },
    _setTextData: function () {
      var a = this.getText().split("\n"),
        b = +this.getFontSize(),
        c = 0,
        f = this.getLineHeight() * b,
        k = this.attrs.width,
        n = this.attrs.height,
        p = "auto" !== k,
        l = "auto" !== n,
        m = this.getPadding(),
        k = k - 2 * m,
        n = n - 2 * m,
        m = 0,
        q = this.getWrap(),
        y = "none" !== q,
        q = "char" !== q && y;
      this.textArr = [];
      d.save();
      d.font = this.getFontStyle() + " " + b + "px " +
        this.getFontFamily();
      for (var s = 0, v = a.length; s < v; ++s) {
        var u = a[s],
          r = this._getTextWidth(u);
        if (p && r > k) for (; 0 < u.length;) {
          for (var r = 0, B = u.length, A = "", F = 0; r < B;) {
            var G = r + B >>> 1,
              C = u.slice(0, G + 1),
              D = this._getTextWidth(C);
            D <= k ? (r = G + 1, A = C, F = D) : B = G
          }
          if (!A) break;
          q && (B = Math.max(A.lastIndexOf(" "), A.lastIndexOf("-")) + 1, 0 < B && (r = B, A = A.slice(0, r), F = this._getTextWidth(A)));
          this._addTextLine(A, F);
          m += f;
          if (!y || l && m + f > n) break;
          u = u.slice(r);
          if (0 < u.length && (r = this._getTextWidth(u), r <= k)) {
            this._addTextLine(u, r);
            m += f;
            break
          }
        } else this._addTextLine(u,
          r), m += f, c = Math.max(c, r); if (l && m + f > n) break
      }
      d.restore();
      this.textHeight = b;
      this.textWidth = c
    }
  };
  Kinetic.Global.extend(Kinetic.Text, Kinetic.Shape);
  Kinetic.Node.addGetterSetter(Kinetic.Text, "fontFamily", "Calibri");
  Kinetic.Node.addGetterSetter(Kinetic.Text, "fontSize", 12);
  Kinetic.Node.addGetterSetter(Kinetic.Text, "fontStyle", "normal");
  Kinetic.Node.addGetterSetter(Kinetic.Text, "padding", 0);
  Kinetic.Node.addGetterSetter(Kinetic.Text, "align", "left");
  Kinetic.Node.addGetterSetter(Kinetic.Text, "lineHeight", 1);
  Kinetic.Node.addGetterSetter(Kinetic.Text,
    "wrap", "word");
  Kinetic.Node.addGetter(Kinetic.Text, "text", "");
  Kinetic.Node.addSetter(Kinetic.Text, "width");
  Kinetic.Node.addSetter(Kinetic.Text, "height")
})();
(function () {
  Kinetic.Line = function (a) {
    this._initLine(a)
  };
  Kinetic.Line.prototype = {
    _initLine: function (a) {
      this.createAttrs();
      Kinetic.Shape.call(this, a);
      this.shapeType = "Line";
      this._setDrawFuncs()
    },
    drawFunc: function (a) {
      var c = this.getPoints(),
        b = c.length,
        f = a.getContext();
      f.beginPath();
      f.moveTo(c[0].x, c[0].y);
      for (var d = 1; d < b; d++) {
        var e = c[d];
        f.lineTo(e.x, e.y)
      }
      a.stroke(this)
    },
    setPoints: function (a) {
      this.setAttr("points", Kinetic.Type._getPoints(a))
    },
    getPoints: function () {
      return this.attrs.points || []
    }
  };
  Kinetic.Global.extend(Kinetic.Line,
    Kinetic.Shape)
})();
(function () {
  Kinetic.Spline = function (a) {
    this._initSpline(a)
  };
  Kinetic.Spline._getControlPoints = function (a, c, b, f) {
    var d = a.x;
    a = a.y;
    var e = c.x;
    c = c.y;
    var g = b.x;
    b = b.y;
    var h = Math.sqrt(Math.pow(e - d, 2) + Math.pow(c - a, 2)),
      j = Math.sqrt(Math.pow(g - e, 2) + Math.pow(b - c, 2)),
      k = f * h / (h + j);
    f = f * j / (h + j);
    return [{
      x: e - k * (g - d),
      y: c - k * (b - a)
    }, {
      x: e + f * (g - d),
      y: c + f * (b - a)
    }]
  };
  Kinetic.Spline.prototype = {
    _initSpline: function (a) {
      this.createAttrs();
      Kinetic.Line.call(this, a);
      this.shapeType = "Spline"
    },
    drawFunc: function (a) {
      var c = this.getPoints(),
        b = c.length,
        f = a.getContext(),
        d = this.getTension();
      f.beginPath();
      f.moveTo(c[0].x, c[0].y);
      if (0 !== d && 2 < b) {
        var e = this.allPoints,
          g = e.length;
        f.quadraticCurveTo(e[0].x, e[0].y, e[1].x, e[1].y);
        for (d = 2; d < g - 1;) f.bezierCurveTo(e[d].x, e[d++].y, e[d].x, e[d++].y, e[d].x, e[d++].y);
        f.quadraticCurveTo(e[g - 1].x, e[g - 1].y, c[b - 1].x, c[b - 1].y)
      } else for (d = 1; d < b; d++) e = c[d], f.lineTo(e.x, e.y);
      a.stroke(this)
    },
    setPoints: function (a) {
      Kinetic.Line.prototype.setPoints.call(this, a);
      this._setAllPoints()
    },
    setTension: function (a) {
      this.setAttr("tension",
        a);
      this._setAllPoints()
    },
    _setAllPoints: function () {
      for (var a = this.getPoints(), c = a.length, b = this.getTension(), f = [], d = 1; d < c - 1; d++) {
        var e = Kinetic.Spline._getControlPoints(a[d - 1], a[d], a[d + 1], b);
        f.push(e[0]);
        f.push(a[d]);
        f.push(e[1])
      }
      this.allPoints = f
    }
  };
  Kinetic.Global.extend(Kinetic.Spline, Kinetic.Line);
  Kinetic.Node.addGetter(Kinetic.Spline, "tension", 1)
})();
(function () {
  Kinetic.Blob = function (a) {
    this._initBlob(a)
  };
  Kinetic.Blob.prototype = {
    _initBlob: function (a) {
      Kinetic.Spline.call(this, a);
      this.shapeType = "Blob"
    },
    drawFunc: function (a) {
      var c = this.getPoints(),
        b = c.length,
        f = a.getContext(),
        d = this.getTension();
      f.beginPath();
      f.moveTo(c[0].x, c[0].y);
      if (0 !== d && 2 < b) {
        c = this.allPoints;
        b = c.length;
        for (d = 0; d < b - 1;) f.bezierCurveTo(c[d].x, c[d++].y, c[d].x, c[d++].y, c[d].x, c[d++].y)
      } else for (d = 1; d < b; d++) {
        var e = c[d];
        f.lineTo(e.x, e.y)
      }
      f.closePath();
      a.fillStroke(this)
    },
    _setAllPoints: function () {
      var a =
          this.getPoints(),
        c = a.length,
        b = this.getTension(),
        f = Kinetic.Spline._getControlPoints(a[c - 1], a[0], a[1], b),
        b = Kinetic.Spline._getControlPoints(a[c - 2], a[c - 1], a[0], b);
      Kinetic.Spline.prototype._setAllPoints.call(this);
      this.allPoints.unshift(f[1]);
      this.allPoints.push(b[0]);
      this.allPoints.push(a[c - 1]);
      this.allPoints.push(b[1]);
      this.allPoints.push(f[0]);
      this.allPoints.push(a[0])
    }
  };
  Kinetic.Global.extend(Kinetic.Blob, Kinetic.Spline)
})();
(function () {
  Kinetic.Sprite = function (a) {
    this._initSprite(a)
  };
  Kinetic.Sprite.prototype = {
    _initSprite: function (a) {
      this.createAttrs();
      Kinetic.Shape.call(this, a);
      this.shapeType = "Sprite";
      this._setDrawFuncs();
      this.anim = new Kinetic.Animation;
      var c = this;
      this.on("animationChange", function () {
        c.setIndex(0)
      })
    },
    drawFunc: function (a) {
      var c = this.getAnimation(),
        b = this.getIndex(),
        c = this.getAnimations()[c][b];
      a = a.getContext();
      (b = this.getImage()) && a.drawImage(b, c.x, c.y, c.width, c.height, 0, 0, c.width, c.height)
    },
    drawHitFunc: function (a) {
      var c =
          this.getAnimation(),
        b = this.getIndex(),
        c = this.getAnimations()[c][b],
        b = a.getContext();
      b.beginPath();
      b.rect(0, 0, c.width, c.height);
      b.closePath();
      a.fill(this)
    },
    start: function () {
      var a = this,
        c = this.getLayer();
      this.anim.node = c;
      this.interval = setInterval(function () {
        var b = a.getIndex();
        a._updateIndex();
        a.afterFrameFunc && b === a.afterFrameIndex && (a.afterFrameFunc(), delete a.afterFrameFunc, delete a.afterFrameIndex)
      }, 1E3 / this.getFrameRate());
      this.anim.start()
    },
    stop: function () {
      this.anim.stop();
      clearInterval(this.interval)
    },
    afterFrame: function (a, c) {
      this.afterFrameIndex = a;
      this.afterFrameFunc = c
    },
    _updateIndex: function () {
      var a = this.getIndex(),
        c = this.getAnimation(),
        c = this.getAnimations()[c].length;
      a < c - 1 ? this.setIndex(a + 1) : this.setIndex(0)
    }
  };
  Kinetic.Global.extend(Kinetic.Sprite, Kinetic.Shape);
  Kinetic.Node.addGetterSetter(Kinetic.Sprite, "animation");
  Kinetic.Node.addGetterSetter(Kinetic.Sprite, "animations");
  Kinetic.Node.addGetterSetter(Kinetic.Sprite, "image");
  Kinetic.Node.addGetterSetter(Kinetic.Sprite, "index", 0);
  Kinetic.Node.addGetterSetter(Kinetic.Sprite,
    "frameRate", 17)
})();
(function () {
  Kinetic.Path = function (a) {
    this._initPath(a)
  };
  Kinetic.Path.prototype = {
    _initPath: function (a) {
      this.dataArray = [];
      var c = this;
      Kinetic.Shape.call(this, a);
      this.shapeType = "Path";
      this._setDrawFuncs();
      this.dataArray = Kinetic.Path.parsePathData(this.getData());
      this.on("dataChange", function () {
        c.dataArray = Kinetic.Path.parsePathData(this.getData())
      })
    },
    drawFunc: function (a) {
      var c = this.dataArray,
        b = a.getContext();
      b.beginPath();
      for (var f = 0; f < c.length; f++) {
        var d = c[f].points;
        switch (c[f].command) {
          case "L":
            b.lineTo(d[0], d[1]);
            break;
          case "M":
            b.moveTo(d[0], d[1]);
            break;
          case "C":
            b.bezierCurveTo(d[0], d[1], d[2], d[3], d[4], d[5]);
            break;
          case "Q":
            b.quadraticCurveTo(d[0], d[1], d[2], d[3]);
            break;
          case "A":
            var e = d[0],
              g = d[1],
              h = d[2],
              j = d[3],
              k = d[4],
              n = d[5],
              p = d[6],
              d = d[7],
              l = h > j ? h : j,
              m = h > j ? 1 : h / j,
              h = h > j ? j / h : 1;
            b.translate(e, g);
            b.rotate(p);
            b.scale(m, h);
            b.arc(0, 0, l, k, k + n, 1 - d);
            b.scale(1 / m, 1 / h);
            b.rotate(-p);
            b.translate(-e, -g);
            break;
          case "z":
            b.closePath()
        }
      }
      a.fillStroke(this)
    }
  };
  Kinetic.Global.extend(Kinetic.Path, Kinetic.Shape);
  Kinetic.Path.getLineLength = function (a, c, b, f) {
    return Math.sqrt((b - a) * (b - a) + (f - c) * (f - c))
  };
  Kinetic.Path.getPointOnLine = function (a, c, b, f, d, e, g) {
    void 0 === e && (e = c);
    void 0 === g && (g = b);
    var h = (d - b) / (f - c + 1E-8),
      j = Math.sqrt(a * a / (1 + h * h));
    f < c && (j *= -1);
    var k = h * j;
    if ((g - b) / (e - c + 1E-8) === h) c = {
      x: e + j,
      y: g + k
    };
    else {
      k = this.getLineLength(c, b, f, d);
      if (1E-8 > k) return;
      j = ((e - c) * (f - c) + (g - b) * (d - b)) / (k * k);
      k = c + j * (f - c);
      b += j * (d - b);
      e = this.getLineLength(e, g, k, b);
      a = Math.sqrt(a * a - e * e);
      j = Math.sqrt(a * a / (1 + h * h));
      f < c && (j *= -1);
      c = {
        x: k + j,
        y: b + h * j
      }
    }
    return c
  };
  Kinetic.Path.getPointOnCubicBezier = function (a, c, b, f, d, e, g, h, j) {
    return {
      x: h * a * a * a + e * 3 * a * a * (1 - a) + f * 3 * a * (1 - a) * (1 - a) + c * (1 - a) * (1 - a) * (1 - a),
      y: j * a * a * a + g * 3 * a * a * (1 - a) + d * 3 * a * (1 - a) * (1 - a) + b * (1 - a) * (1 - a) * (1 - a)
    }
  };
  Kinetic.Path.getPointOnQuadraticBezier = function (a, c, b, f, d, e, g) {
    return {
      x: e * a * a + f * 2 * a * (1 - a) + c * (1 - a) * (1 - a),
      y: g * a * a + d * 2 * a * (1 - a) + b * (1 - a) * (1 - a)
    }
  };
  Kinetic.Path.getPointOnEllipticalArc = function (a, c, b, f, d, e) {
    var g = Math.cos(e);
    e = Math.sin(e);
    b *= Math.cos(d);
    f *= Math.sin(d);
    return {
      x: a + (b * g - f * e),
      y: c + (b * e + f * g)
    }
  };
  Kinetic.Path.parsePathData = function (a) {
    if (!a) return [];
    var c, b = "mMlLvVhHzZcCqQtTsSaA".split("");
    c = a.replace(RegExp(" ", "g"), ",");
    for (a = 0; a < b.length; a++) c = c.replace(RegExp(b[a], "g"), "|" + b[a]);
    b = c.split("|");
    c = [];
    var f = 0,
      d = 0;
    for (a = 1; a < b.length; a++) {
      var e = b[a],
        g = e.charAt(0),
        e = e.slice(1),
        e = e.replace(RegExp(",-", "g"), "-"),
        e = e.replace(RegExp("-", "g"), ",-"),
        e = e.replace(RegExp("e,-", "g"), "e-"),
        e = e.split(",");
      0 < e.length && "" === e[0] && e.shift();
      for (var h = 0; h < e.length; h++) e[h] = parseFloat(e[h]);
      for (; 0 < e.length && !isNaN(e[0]);) {
        var j = null,
          k = [],
          h = f,
          n = d;
        switch (g) {
          case "l":
            f +=
              e.shift();
            d += e.shift();
            j = "L";
            k.push(f, d);
            break;
          case "L":
            f = e.shift();
            d = e.shift();
            k.push(f, d);
            break;
          case "m":
            f += e.shift();
            d += e.shift();
            j = "M";
            k.push(f, d);
            g = "l";
            break;
          case "M":
            f = e.shift();
            d = e.shift();
            j = "M";
            k.push(f, d);
            g = "L";
            break;
          case "h":
            f += e.shift();
            j = "L";
            k.push(f, d);
            break;
          case "H":
            f = e.shift();
            j = "L";
            k.push(f, d);
            break;
          case "v":
            d += e.shift();
            j = "L";
            k.push(f, d);
            break;
          case "V":
            d = e.shift();
            j = "L";
            k.push(f, d);
            break;
          case "C":
            k.push(e.shift(), e.shift(), e.shift(), e.shift());
            f = e.shift();
            d = e.shift();
            k.push(f, d);
            break;
          case "c":
            k.push(f + e.shift(), d + e.shift(), f + e.shift(), d + e.shift());
            f += e.shift();
            d += e.shift();
            j = "C";
            k.push(f, d);
            break;
          case "S":
            var p = f,
              l = d,
              j = c[c.length - 1];
            "C" === j.command && (p = f + (f - j.points[2]), l = d + (d - j.points[3]));
            k.push(p, l, e.shift(), e.shift());
            f = e.shift();
            d = e.shift();
            j = "C";
            k.push(f, d);
            break;
          case "s":
            p = f;
            l = d;
            j = c[c.length - 1];
            "C" === j.command && (p = f + (f - j.points[2]), l = d + (d - j.points[3]));
            k.push(p, l, f + e.shift(), d + e.shift());
            f += e.shift();
            d += e.shift();
            j = "C";
            k.push(f, d);
            break;
          case "Q":
            k.push(e.shift(),
              e.shift());
            f = e.shift();
            d = e.shift();
            k.push(f, d);
            break;
          case "q":
            k.push(f + e.shift(), d + e.shift());
            f += e.shift();
            d += e.shift();
            j = "Q";
            k.push(f, d);
            break;
          case "T":
            p = f;
            l = d;
            j = c[c.length - 1];
            "Q" === j.command && (p = f + (f - j.points[0]), l = d + (d - j.points[1]));
            f = e.shift();
            d = e.shift();
            j = "Q";
            k.push(p, l, f, d);
            break;
          case "t":
            p = f;
            l = d;
            j = c[c.length - 1];
            "Q" === j.command && (p = f + (f - j.points[0]), l = d + (d - j.points[1]));
            f += e.shift();
            d += e.shift();
            j = "Q";
            k.push(p, l, f, d);
            break;
          case "A":
            var k = e.shift(),
              p = e.shift(),
              l = e.shift(),
              m = e.shift(),
              q = e.shift(),
              y = f,
              s = d,
              f = e.shift(),
              d = e.shift(),
              j = "A",
              k = this.convertEndpointToCenterParameterization(y, s, f, d, m, q, k, p, l);
            break;
          case "a":
            k = e.shift(), p = e.shift(), l = e.shift(), m = e.shift(), q = e.shift(), y = f, s = d, f += e.shift(), d += e.shift(), j = "A", k = this.convertEndpointToCenterParameterization(y, s, f, d, m, q, k, p, l)
        }
        c.push({
          command: j || g,
          points: k,
          start: {
            x: h,
            y: n
          },
          pathLength: this.calcLength(h, n, j || g, k)
        })
      }("z" === g || "Z" === g) && c.push({
        command: "z",
        points: [],
        start: void 0,
        pathLength: 0
      })
    }
    return c
  };
  Kinetic.Path.calcLength = function (a, c, b, f) {
    var d,
      e, g = Kinetic.Path;
    switch (b) {
      case "L":
        return g.getLineLength(a, c, f[0], f[1]);
      case "C":
        b = 0;
        d = g.getPointOnCubicBezier(0, a, c, f[0], f[1], f[2], f[3], f[4], f[5]);
        for (t = 0.01; 1 >= t; t += 0.01) e = g.getPointOnCubicBezier(t, a, c, f[0], f[1], f[2], f[3], f[4], f[5]), b += g.getLineLength(d.x, d.y, e.x, e.y), d = e;
        return b;
      case "Q":
        b = 0;
        d = g.getPointOnQuadraticBezier(0, a, c, f[0], f[1], f[2], f[3]);
        for (t = 0.01; 1 >= t; t += 0.01) e = g.getPointOnQuadraticBezier(t, a, c, f[0], f[1], f[2], f[3]), b += g.getLineLength(d.x, d.y, e.x, e.y), d = e;
        return b;
      case "A":
        b = 0;
        a =
          f[4];
        c = f[5];
        var h = f[4] + c,
          j = Math.PI / 180;
        Math.abs(a - h) < j && (j = Math.abs(a - h));
        d = g.getPointOnEllipticalArc(f[0], f[1], f[2], f[3], a, 0);
        if (0 > c) for (t = a - j; t > h; t -= j) e = g.getPointOnEllipticalArc(f[0], f[1], f[2], f[3], t, 0), b += g.getLineLength(d.x, d.y, e.x, e.y), d = e;
        else for (t = a + j; t < h; t += j) e = g.getPointOnEllipticalArc(f[0], f[1], f[2], f[3], t, 0), b += g.getLineLength(d.x, d.y, e.x, e.y), d = e;
        return e = g.getPointOnEllipticalArc(f[0], f[1], f[2], f[3], h, 0), b += g.getLineLength(d.x, d.y, e.x, e.y), b
    }
    return 0
  };
  Kinetic.Path.convertEndpointToCenterParameterization = function (a, c, b, f, d, e, g, h, j) {
    j *= Math.PI / 180;
    var k = Math.cos(j) * (a - b) / 2 + Math.sin(j) * (c - f) / 2,
      n = -1 * Math.sin(j) * (a - b) / 2 + Math.cos(j) * (c - f) / 2,
      p = k * k / (g * g) + n * n / (h * h);
    1 < p && (g *= Math.sqrt(p), h *= Math.sqrt(p));
    p = Math.sqrt((g * g * h * h - g * g * n * n - h * h * k * k) / (g * g * n * n + h * h * k * k));
    d == e && (p *= -1);
    isNaN(p) && (p = 0);
    d = p * g * n / h;
    p = p * -h * k / g;
    a = (a + b) / 2 + Math.cos(j) * d - Math.sin(j) * p;
    c = (c + f) / 2 + Math.sin(j) * d + Math.cos(j) * p;
    var l = function (a, b) {
      return (a[0] * b[0] + a[1] * b[1]) / (Math.sqrt(a[0] * a[0] + a[1] * a[1]) * Math.sqrt(b[0] * b[0] + b[1] * b[1]))
    }, m = function (a,
                     b) {
      return (a[0] * b[1] < a[1] * b[0] ? -1 : 1) * Math.acos(l(a, b))
    };
    f = m([1, 0], [(k - d) / g, (n - p) / h]);
    b = [(k - d) / g, (n - p) / h];
    k = [(-1 * k - d) / g, (-1 * n - p) / h];
    n = m(b, k);
    return -1 >= l(b, k) && (n = Math.PI), 1 <= l(b, k) && (n = 0), 0 === e && 0 < n && (n -= 2 * Math.PI), 1 == e && 0 > n && (n += 2 * Math.PI), [a, c, g, h, f, n, j, e]
  };
  Kinetic.Node.addGetterSetter(Kinetic.Path, "data")
})();
(function () {
  function a(a) {
    a.fillText(this.partialText, 0, 0)
  }
  function c(a) {
    a.strokeText(this.partialText, 0, 0)
  }
  Kinetic.TextPath = function (a) {
    this._initTextPath(a)
  };
  Kinetic.TextPath.prototype = {
    _initTextPath: function (b) {
      var f = this;
      this.createAttrs();
      this.dummyCanvas = document.createElement("canvas");
      this.dataArray = [];
      Kinetic.Shape.call(this, b);
      this._fillFunc = a;
      this._strokeFunc = c;
      this.shapeType = "TextPath";
      this._setDrawFuncs();
      this.dataArray = Kinetic.Path.parsePathData(this.attrs.data);
      this.on("dataChange", function () {
        f.dataArray = Kinetic.Path.parsePathData(this.attrs.data)
      });
      b = ["text", "textStroke", "textStrokeWidth"];
      for (var d = 0; d < b.length; d++) this.on(b[d] + "Change", f._setTextData);
      f._setTextData()
    },
    drawFunc: function (a) {
      var c = a.getContext();
      c.font = this._getContextFont();
      c.textBaseline = "middle";
      c.textAlign = "left";
      c.save();
      for (var d = this.glyphInfo, e = 0; e < d.length; e++) {
        c.save();
        var g = d[e].p0;
        parseFloat(this.attrs.fontSize);
        c.translate(g.x, g.y);
        c.rotate(d[e].rotation);
        this.partialText = d[e].text;
        a.fillStroke(this);
        c.restore()
      }
      c.restore()
    },
    getTextWidth: function () {
      return this.textWidth
    },
    getTextHeight: function () {
      return this.textHeight
    },
    setText: function (a) {
      Kinetic.Text.prototype.setText.call(this, a)
    },
    _getTextSize: function (a) {
      var c = this.dummyCanvas.getContext("2d");
      c.save();
      c.font = this._getContextFont();
      a = c.measureText(a);
      return c.restore(), {
        width: a.width,
        height: parseInt(this.attrs.fontSize, 10)
      }
    },
    _setTextData: function () {
      var a = this._getTextSize(this.attrs.text);
      this.textWidth = a.width;
      this.textHeight = a.height;
      this.glyphInfo = [];
      for (var a = this.attrs.text.split(""), c, d, e, g = -1, h = 0, j = 0; j < a.length; j++) {
        a: {
          var k = this._getTextSize(a[j]).width,
            n = 0,
            p = 0;
          for (d = void 0; 0.01 < Math.abs(k - n) / k && 25 > p;) {
            p++;
            for (var l = n; void 0 === e;) {
              b: {
                h = 0;
                e = this.dataArray;
                for (var m = g + 1; m < e.length; m++) {
                  if (0 < e[m].pathLength) {
                    e = (g = m, e[m]);
                    break b
                  }
                  "M" == e[m].command && (c = {
                    x: e[m].points[0],
                    y: e[m].points[1]
                  })
                }
                e = {}
              }
              e && l + e.pathLength < k && (l += e.pathLength, e = void 0)
            }
            if (e === {} || void 0 === c) break a;
            l = !1;
            switch (e.command) {
              case "L":
                Kinetic.Path.getLineLength(c.x, c.y, e.points[0],
                  e.points[1]) > k ? d = Kinetic.Path.getPointOnLine(k, c.x, c.y, e.points[0], e.points[1], c.x, c.y) : e = void 0;
                break;
              case "A":
                d = e.points[4];
                var m = e.points[5],
                  q = e.points[4] + m;
                0 === h ? h = d + 1E-8 : k > n ? h += Math.PI / 180 * m / Math.abs(m) : h -= Math.PI / 360 * m / Math.abs(m);
                Math.abs(h) > Math.abs(q) && (h = q, l = !0);
                d = Kinetic.Path.getPointOnEllipticalArc(e.points[0], e.points[1], e.points[2], e.points[3], h, e.points[6]);
                break;
              case "C":
                0 === h ? k > e.pathLength ? h = 1E-8 : h = k / e.pathLength : k > n ? h += (k - n) / e.pathLength : h -= (n - k) / e.pathLength;
                1 < h && (h = 1, l = !0);
                d =
                  Kinetic.Path.getPointOnCubicBezier(h, e.start.x, e.start.y, e.points[0], e.points[1], e.points[2], e.points[3], e.points[4], e.points[5]);
                break;
              case "Q":
                0 === h ? h = k / e.pathLength : k > n ? h += (k - n) / e.pathLength : h -= (n - k) / e.pathLength, 1 < h && (h = 1, l = !0), d = Kinetic.Path.getPointOnQuadraticBezier(h, e.start.x, e.start.y, e.points[0], e.points[1], e.points[2], e.points[3])
            }
            void 0 !== d && (n = Kinetic.Path.getLineLength(c.x, c.y, d.x, d.y));
            l && (e = void 0)
          }
        }
        if (void 0 === c || void 0 === d) break;
        k = Kinetic.Path.getLineLength(c.x, c.y, d.x, d.y);
        k = Kinetic.Path.getPointOnLine(0 +
          k / 2, c.x, c.y, d.x, d.y);
        n = Math.atan2(d.y - c.y, d.x - c.x);
        this.glyphInfo.push({
          transposeX: k.x,
          transposeY: k.y,
          text: a[j],
          rotation: n,
          p0: c,
          p1: d
        });
        c = d
      }
    }
  };
  Kinetic.TextPath.prototype._getContextFont = Kinetic.Text.prototype._getContextFont;
  Kinetic.Global.extend(Kinetic.TextPath, Kinetic.Shape);
  Kinetic.Node.addGetterSetter(Kinetic.TextPath, "fontFamily", "Calibri");
  Kinetic.Node.addGetterSetter(Kinetic.TextPath, "fontSize", 12);
  Kinetic.Node.addGetterSetter(Kinetic.TextPath, "fontStyle", "normal");
  Kinetic.Node.addGetter(Kinetic.TextPath,
    "text", "")
})();
(function () {
  Kinetic.RegularPolygon = function (a) {
    this._initRegularPolygon(a)
  };
  Kinetic.RegularPolygon.prototype = {
    _initRegularPolygon: function (a) {
      this.createAttrs();
      Kinetic.Shape.call(this, a);
      this.shapeType = "RegularPolygon";
      this._setDrawFuncs()
    },
    drawFunc: function (a) {
      var c = a.getContext(),
        b = this.attrs.sides,
        f = this.attrs.radius;
      c.beginPath();
      c.moveTo(0, 0 - f);
      for (var d = 1; d < b; d++) {
        var e = f * Math.sin(2 * d * Math.PI / b),
          g = -1 * f * Math.cos(2 * d * Math.PI / b);
        c.lineTo(e, g)
      }
      c.closePath();
      a.fillStroke(this)
    }
  };
  Kinetic.Global.extend(Kinetic.RegularPolygon,
    Kinetic.Shape);
  Kinetic.Node.addGetterSetter(Kinetic.RegularPolygon, "radius", 0);
  Kinetic.Node.addGetterSetter(Kinetic.RegularPolygon, "sides", 0)
})();
(function () {
  Kinetic.Star = function (a) {
    this._initStar(a)
  };
  Kinetic.Star.prototype = {
    _initStar: function (a) {
      this.createAttrs();
      Kinetic.Shape.call(this, a);
      this.shapeType = "Star";
      this._setDrawFuncs()
    },
    drawFunc: function (a) {
      var c = a.getContext(),
        b = this.attrs.innerRadius,
        f = this.attrs.outerRadius,
        d = this.attrs.numPoints;
      c.beginPath();
      c.moveTo(0, 0 - this.attrs.outerRadius);
      for (var e = 1; e < 2 * d; e++) {
        var g = 0 === e % 2 ? f : b,
          h = g * Math.sin(e * Math.PI / d),
          g = -1 * g * Math.cos(e * Math.PI / d);
        c.lineTo(h, g)
      }
      c.closePath();
      a.fillStroke(this)
    }
  };
  Kinetic.Global.extend(Kinetic.Star, Kinetic.Shape);
  Kinetic.Node.addGetterSetter(Kinetic.Star, "numPoints", 0);
  Kinetic.Node.addGetterSetter(Kinetic.Star, "innerRadius", 0);
  Kinetic.Node.addGetterSetter(Kinetic.Star, "outerRadius", 0)
})();
(function () {
  var a = "fontFamily fontSize fontStyle padding lineHeight text".split(" "),
    c = a.length;
  Kinetic.Label = function (a) {
    this._initLabel(a)
  };
  Kinetic.Label.prototype = {
    _initLabel: function (b) {
      var f = this,
        d = null;
      this.innerGroup = new Kinetic.Group;
      this.createAttrs();
      Kinetic.Group.call(this, b);
      d = new Kinetic.Text(b.text);
      this.setText(d);
      this.setRect(new Kinetic.LabelRect(b.rect));
      this.innerGroup.add(this.getRect());
      this.innerGroup.add(d);
      this.add(this.innerGroup);
      this._setGroupOffset();
      for (b = 0; b < c; b++) d.on(a[b] +
        "Change.kinetic", function () {
        f._setGroupOffset()
      })
    },
    getWidth: function () {
      return this.getText().getWidth()
    },
    getHeight: function () {
      return this.getText().getHeight()
    },
    _setGroupOffset: function () {
      var a = this.getText(),
        c = a.getWidth(),
        a = a.getHeight(),
        d = this.getRect(),
        e = d.getPointerDirection(),
        g = d.getPointerWidth(),
        d = d.getPointerHeight(),
        h = 0,
        j = 0;
      switch (e) {
        case "up":
          h = c / 2;
          j = -1 * d;
          break;
        case "right":
          h = c + g;
          j = a / 2;
          break;
        case "down":
          h = c / 2;
          j = a + d;
          break;
        case "left":
          h = -1 * g, j = a / 2
      }
      this.setOffset({
        x: h,
        y: j
      })
    }
  };
  Kinetic.Global.extend(Kinetic.Label,
    Kinetic.Group);
  Kinetic.Node.addGetterSetter(Kinetic.Label, "text");
  Kinetic.Node.addGetterSetter(Kinetic.Label, "rect");
  Kinetic.LabelRect = function (a) {
    this._initLabelRect(a)
  };
  Kinetic.LabelRect.prototype = {
    _initLabelRect: function (a) {
      this.createAttrs();
      Kinetic.Shape.call(this, a);
      this.shapeType = "LabelRect";
      this._setDrawFuncs()
    },
    drawFunc: function (a) {
      var c = this.getParent().getParent(),
        d = a.getContext(),
        e = c.getWidth(),
        c = c.getHeight(),
        g = this.getPointerDirection(),
        h = this.getPointerWidth(),
        j = this.getPointerHeight();
      this.getCornerRadius();
      d.beginPath();
      d.moveTo(0, 0);
      "up" === g && (d.lineTo((e - h) / 2, 0), d.lineTo(e / 2, -1 * j), d.lineTo((e + h) / 2, 0));
      d.lineTo(e, 0);
      "right" === g && (d.lineTo(e, (c - j) / 2), d.lineTo(e + h, c / 2), d.lineTo(e, (c + j) / 2));
      d.lineTo(e, c);
      "down" === g && (d.lineTo((e + h) / 2, c), d.lineTo(e / 2, c + j), d.lineTo((e - h) / 2, c));
      d.lineTo(0, c);
      "left" === g && (d.lineTo(0, (c + j) / 2), d.lineTo(-1 * h, c / 2), d.lineTo(0, (c - j) / 2));
      d.closePath();
      a.fillStroke(this)
    }
  };
  Kinetic.Global.extend(Kinetic.LabelRect, Kinetic.Shape);
  Kinetic.Node.addGetterSetter(Kinetic.LabelRect,
    "pointerDirection", "none");
  Kinetic.Node.addGetterSetter(Kinetic.LabelRect, "pointerWidth", 0);
  Kinetic.Node.addGetterSetter(Kinetic.LabelRect, "pointerHeight", 0);
  Kinetic.Node.addGetterSetter(Kinetic.LabelRect, "cornerRadius", 0)
})();