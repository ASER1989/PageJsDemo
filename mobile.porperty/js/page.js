/**
 * Created by Lenovo on 2018/4/10.
 */
function page(option) {
    var _host = "http://source.gsrunhe.com/propmgt/";
    var _that = {
        init: function () {

        },
        onReady: function () {

        },
        getHost: function () {
            return _host;
        },
        getOpenid: function () {
            return store.get("openid");
        },
        getParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            return r != null ? decodeURIComponent(r[2]) : null;
        },
        tapBind: function () {
            $("body").on("click", "[bind-tap]", function (e) {
                var el = $(this);
                var fn = _that[el.attr("bind-tap")];
                typeof fn == "function" && fn.call(this, e, _that);
            })
        },
        _eventRender: function () {
            var els = $("[data-bind-event]");
            for (var i = 0, el; el = els[i++];) {
                el = $(el);
                var fn = _that[el.attr("data-bind-event")];
                if (el.attr("data-event-type") && typeof fn == "function") {
                    el.off().on(el.attr("data-event-type"), function (e) {
                        _that[$(this).attr("data-bind-event")].call(this, e, _that);
                    });
                    // new (function (el, fn,that) {
                    //     var me = this;
                    //     me.fn = fn;
                    //     el.off().on(el.attr("data-event-type"), function (e) {
                    //         me.fn.call(this, e, that);
                    //     });
                    // })(el, fn,_that);

                }
            }
        },
        //获取用户信息
        onUserReady: function (resp) {

        },
        _onUserReady: function (resp) {
            resp = Object.prototype.toString.call(resp) == "[object String]" ? JSON.parse(resp) : resp;

            var data = resp.obj, checkhouse = store.get("user_checked_house");
            if (data) {
                //utype==1业主==2工程师
                store.set("user_type", data.uType);

                var community = [];
                if (data.uType == "1") {

                    for (var i = 0, item; item = data.communityWxUsers[i++];) {
                        community.push(item.coummnityInfo);
                    }

                    var defhouse = community[0];
                    community.indexOf(JSON.parse(checkhouse)) < 0 && store.set("user_checked_house", JSON.stringify(defhouse));
                }
            }


            typeof _that.onUserReady == "function" && _that.onUserReady(data, community, JSON.parse(store.get("user_checked_house")));
        }
    };


    function init(fn) {
        fn = typeof fn == "function" ? fn : function () {

        };

        // window.location.toString().indexOf("localhost") >= 0 && store.set("openid", 'oBQTCwF5CWrqZBXkJ3UX4w5T4_AA');
        window.location.toString().indexOf("localhost") >= 0 && store.set("openid", 'oBQTCwF5VWrqZeXwJ3UO4w5T4_CY');

        _that.getParam("cmd") == "recache" && store.remove("openid");

        if (_that.getParam("openid") != null && _that.getParam("openid") != '') {
            store.set("openid", _that.getParam("openid"));
        }
        !store.get("openid") && getOpenid();

        $.ajax = function (base) {
            return function (opt) {
                if (opt) {
                    opt.url = opt.islocal == true ? opt.url : _host + opt.url;
                    //openid配置
                    opt.data = opt.data || {};
                    opt.data.openid = store.get("openid");
                }
                if (opt.success) {
                    opt.success = function (successfn) {
                        return function (res) {
                            successfn.call(null, res);
                        }
                    }(opt.success);
                }
                base.call(null, opt);
            }
        }($.ajax);

        store.get("openid") && fn();
    }


    function getOpenid() {
        window.location = _host + "wx/authorized?url=" + window.location;
    }

    function getRD(len) {
        var letter = "aAbBcCdDeEfEgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789";
        var res = [];
        for (var i = 0; i < len; i++) {
            res.push(letter[Math.round(Math.random() * 61)]);
        }
        return res.join("") + "-" + (+new Date());
    }

    function _getUser(callback) {
        callback = typeof callback == "function" ? callback : function () {

        };

        $.ajax({
            url: "wx/getUser",
            data: {openid: store.get("openid")},
            success: callback
        })
    }

    function ready() {
        init(function () {
            if (option) {
                for (var n in option) {
                    if (n.toString().indexOf("_") == 0) {
                        continue;
                    }
                    _that[n] = option[n];
                }
            }
            _that.init();
            _getUser(_that._onUserReady);
            _that.onReady();
            _that.tapBind();
        });
    }

    require(['./js/cache.js', './js/lib/zepto.js', './js/lib/zoom.js','./js/wxconfig.js'], function () {
        var pagezoom = new zoom($);
        pagezoom.calc(ready);
        $(window).on('resize', pagezoom.calc);
    });
}

