/**
 * Created by Lenovo on 2018/3/20.
 */
layui.define([], function (exports) {
    var url = {
        getparam:function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            return r != null ? decodeURIComponent(r[2]) : null;
        }

    };

    exports('url', url);
});