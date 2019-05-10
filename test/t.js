window.$ = function () {
  function t(e) {
    var n = this,
      r = arguments;
    y(this, t), e = e || {}, this.options = e, this.baseData = {
      accountId: h.default.get("_ggj_aid_") || "0",
      imei: this.getImei(),
      platform: T(w),
      version: A(w)
    }, this.gaData = {
      productIdChain: 0,
      cartProductIdChain: 0
    }, this.begin = new Date, this.exposuredList = [], this.isSlice = !1, this.randomCode4 = E(), this.setExposure = function () {
      n.throttle(n.exposure, 600)()
    }, this.throttle = function (t, e) {
      return function () {
        var i = n,
          o = r,
          a = new Date;
        a - n.begin >= e && (t.apply(i, o), n.begin = a)
      }
    }, this.init()
  }



  return [ t, [{
    key: "init",
    value: function () {
      a(this.gaData, this.getData()), this.dispose(), window.addEventListener("scroll", this.setExposure), h.default.get("sessionId") ? this.oldSessionHandler() : this.newSessionHandler()
    }
  }, {
    key: "oldSessionHandler",
    value: function () {
      a(this.gaData, {
        sessionId: h.default.get("sessionId")
      })
    }
  }, {
    key: "getBridgeSessionId",
    value: function (t) {
      var e = this,
        n = void 0;
      (0, v.bridgeFun)(function () {
        window.WebViewJavascriptBridge.callHandler("getUserInfo", {}, function (r) {
          r = JSON.parse(r), n = r.sessionId || S.call(), h.default.set("sessionId", n), a(e.gaData, {
            sessionId: n
          }), t && t()
        })
      })
    }
  }, {
    key: "newSessionHandler",
    value: function () {
      var t = g(i.default.mark(function t() {
        var e, n;
        return i.default.wrap(function (t) {
          while (1) switch (t.prev = t.next) {
            case 0:
              e = void 0, n = void 0, this.gaData.hasOwnProperty("sessionId") && (n = this.gaData.sessionId), c.default.remove("_ga_data"), this.gaData = {}, _ ? window.WebViewJavascriptBridge || this.getBridgeSessionId() : (e = S.call(), a(this.gaData, {
                sessionId: e
              }), this.start(this.gaData.sessionId, n), h.default.set("sessionId", this.gaData.sessionId));
            case 6:
            case "end":
              return t.stop()
          }
        }, t, this)
      }));

      function e() {
        return t.apply(this, arguments)
      }
      return e
    }()
  }, {
    key: "getImei",
    value: function () {
      var t = c.default.get("_ga_imei");
      return t || (t = S.call(), c.default.set("_ga_imei", t)), t
    }
  }, {
    key: "setGpm",
    value: function (t) {
      return t ? this.gaData.gpm ? this.gaData.gpm + "-" + t : t + "" : this.gaData.gpm
    }
  }, {
    key: "setProdidChain",
    value: function (t) {
      return this.gaData.productIdChain = this.gaData.productIdChain || 0, "0" != this.gaData.productIdChain || t ? "0" == this.gaData.productIdChain ? t + "" : t ? this.gaData.productIdChain + "-" + t : this.gaData.productIdChain : "0"
    }
  }, {
    key: "setCartProdidChain",
    value: function (t) {
      return this.gaData.cartProductIdChain = this.gaData.cartProductIdChain || 0, "0" != this.gaData.cartProductIdChain || t ? "0" == this.gaData.cartProductIdChain ? t + "" : t ? this.gaData.cartProductIdChain + "-" + t : this.gaData.cartProductIdChain : "0"
    }
  }, {
    key: "dataConcat",
    value: function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      this.gaData.targetId = t.targetId, this.gaData.udata = t.udata && encodeURIComponent(t.udata), this.gaData.gpm = this.setGpm(this.gaData.targetType), this.gaData.gpm.split("-").length >= 100 && (this.gaData.gpm = this.gaData.gpm + "-$" + this.randomCode4 + "$", this.isSlice = !0), this.gaData.productIdChain = this.setProdidChain(t.goodsId), this.gaData.cartProductIdChain = this.setCartProdidChain(t.cartGoodsId), this.setData()
    }
  }, {
    key: "setData",
    value: function () {
      "object" === o(this.gaData) && c.default.set("_ga_data", this.gaData)
    }
  }, {
    key: "getData",
    value: function (t) {
      var e = c.default.get("_ga_data");
      return t ? e[t] : e
    }
  }, {
    key: "sign",
    value: function (t) {
      var e = "";
      return delete t["sign"], Object.keys(t).sort().forEach(function (n) {
        t[n] || void 0 !== t[n] ? e = "udata" === n ? e + (n + "=") + decodeURIComponent(t[n]) + "&" : e + (n + "=") + t[n] + "&" : delete t[n]
      }), t.sign = (0, d.default)(e + "gegejia-track-2017").substr(8, 16).toUpperCase(), t
    }
  }, {
    key: "start",
    value: function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "0",
        e = arguments[1],
        n = this.sign(a({}, this.baseData, {
          sessionId: t
        }, {
          oldSessionId: e
        }, {
          os: k()
        }));
      (0, l.Ajax)("get", b + "gegejia-track/track/start/v2", n, function (t) {
        1 === t.status || console.log("埋点start返回失败：" + JSON.stringify(t))
      }, function (t) {
        console.log("埋点start调用失败：" + t)
      })
    }
  }, {
    key: "sendAction",
    value: function (t) {
      var e = this;
      t = this.sign(a({}, t, {
        sessionId: this.gaData.sessionId
      }, {
        requestId: (0, d.default)("" + this.gaData.sessionId + this.gaData.gpm).toLowerCase()
      })), (0, l.Ajax)("get", b + "gegejia-track/track/action/v2", t, function (t) {
        1 === t.status ? e.isSlice && (e.gaData.gpm = "$" + e.randomCode4 + "$", e.isSlice = !1, e.randomCode4 = E()) : console.log("埋点action返回失败：" + JSON.stringify(t))
      }, function (t) {
        console.log("埋点action调用失败：" + t)
      })
    }
  }, {
    key: "action",
    value: function () {
      var t = a({}, this.baseData, this.gaData);
      !this.gaData.sessionId && _ ? this.getBridgeSessionId(this.sendAction.bind(this, t)) : this.sendAction(t)
    }
  }, {
    key: "exposure",
    value: function () {
      if (0 !== document.querySelectorAll("*[data-exposure]").length)
        for (var t = 0; t < document.querySelectorAll("*[data-exposure]").length; t++) {
          var e = document.querySelectorAll("*[data-exposure]")[t],
            n = e.getAttribute("data-exposure") || "0.0.0",
            r = e.getAttribute("data-udata") || void 0;
          if (this.exposuredList.indexOf(e) < 0) {
            var i = e.getBoundingClientRect().top + window.pageYOffset,
              o = document.documentElement.scrollTop;
            if (i + 5 >= o && i < o + window.innerHeight) {
              if (!/^\w+[/.]\w+[/.]\w+$/g.test(n)) return void console.error("data-exposure属性格式错误");
              this.gaData.targetType = n + ".1", this.dataConcat({
                udata: r
              }), this.action(), this.exposuredList.push(e)
            }
          }
        }
    }
  }, {
    key: "click",
    value: function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      t.pageCode = t.pageCode || "0", t.firstModuleId = t.firstModuleId || "0", t.secondModuleId = t.secondModuleId || "0", this.gaData.targetType = t.pageCode + "." + t.firstModuleId + "." + t.secondModuleId + ".2", this.dataConcat(t), this.action()
    }
  }, {
    key: "exposureModule",
    value: function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      t.pageCode = t.pageCode || "0", t.firstModuleId = t.firstModuleId || "0", t.secondModuleId = t.secondModuleId || "0", this.gaData.targetType = t.pageCode + "." + t.firstModuleId + "." + t.secondModuleId + ".1", this.dataConcat(t), this.action()
    }
  }, {
    key: "addCart",
    value: function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      delete this.gaData.targetType, this.dataConcat(t), this.action()
    }
  }, {
    key: "exposureView",
    value: function () {
      this.exposure()
    }
  }, {
    key: "requestId",
    value: function () {
      return (0, d.default)("" + this.gaData.sessionId + this.gaData.gpm).toLowerCase()
    }
  }, {
    key: "sessionId",
    value: function () {
      return this.gaData.sessionId
    }
  }, {
    key: "imei",
    value: function () {
      return this.baseData.imei
    }
  }, {
    key: "dispose",
    value: function () {
      window.removeEventListener("scroll", this.setExposure)
    }
  }]  ]
  
  
  , t


}();