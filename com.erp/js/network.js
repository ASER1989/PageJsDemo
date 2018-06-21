/**
 * Created by Lenovo on 2018/3/20.
 */
layui.define(['login', 'layer'], function (exports) {
    //do something
    var login = window.parent.loginCtrl || window.loginCtrl || layui.login(top.layer || layui.layer);
    var _Error = {
        "-1004": function (data, callback) {
            login.show(callback);
        }
        // ,
        // '-1002':function (data,callback) {
        //     // callback.call(null, data);
        // },
        // "onError":function (data,callback) {
        //     top.layer.alert(data.msg);
        // }
    }
    var _that = {
        apihost: "http://139.129.205.178:8680/",

        fliter: function (data, callback, onerror) {
            var fn = _Error[data.code];
            // if(fn==null && data.code<0){
            //     fn=_Error["onError"];
            // }
            fn != null && fn.call(null, data, onerror);
            fn == null && callback.call(null, data);

        }

    }

    var network = function ($) {
        function ajaxReady($) {
            $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});


            $.ajax = (function (ajax) {

                return function (opt) {
                    if (!opt.islocal) {
                        opt.url = opt.url.indexOf("http") == 0 ? opt.url : _that.apihost + opt.url;
                    }
                    opt.success = (function (success) {
                        return function (data) {
                            _that.fliter(data, success, function () {
                                $.ajax(opt);
                            });
                        }
                    })(opt.success);

                    ajax(opt);
                }
            })($.ajax);
        }

        ajaxReady($);
        return {
            apihost: _that.apihost
        }

    }

    exports('network', network);
});