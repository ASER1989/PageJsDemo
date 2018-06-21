/**
 * Created by Lenovo on 2018/4/10.
 */
function page(option) {
    var _host = "http://139.129.205.178:8680/";
    var _that = {
        onReady: function () {

        },
        tapBind: function () {
            $("body").on("click", "[bind-tap]", function (e) {
                var el = $(this);
                var fn = _that[el.attr("bind-tap")];
                typeof fn == "function" && fn.call(this, e,_that);
            })
        }
    };


    function init() {

        !store.get("openid") && store.set("openid",getRD(10));

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
    }


    function getRD(len) {
        var letter = "aAbBcCdDeEfEgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789";
        var res=[];
        for (var i = 0; i < len; i++) {
            res.push(letter[Math.round(Math.random() * 61)]);
        }
        return res.join("")+"-"+(+new Date());
    }

    function ready() {
        init();

        if (option) {
            for (var n in option) {
                _that[n] = option[n];
            }
        }
        $("body").addClass("show");
        _that.onReady();
        _that.tapBind();
    }

    require(['./js/cache.js','./js/lib/zepto.js', './js/lib/zoom.js'], function () {
        var pagezoom = new zoom($);
        pagezoom.calc(ready);
        $(window).on('resize', pagezoom.calc);
    });
}

