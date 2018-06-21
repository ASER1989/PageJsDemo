/**
 * Created by Lenovo on 2018/3/20.
 */
layui.define(['layer'], function (exports) {
    //do something
    var layer =top.layer|| layui.layer;
    var login = {
        id: "login-layer",
        callback:null,
        show: function (callback) {
            login.callback = callback;

            login.id =layer.open({
                id: "login-layer",
                title: ["途见物业-管理登录", "font-weight:600"],
                type: 2,
                resize: false,
                scrollbar: false,
                closeBtn: 0,
                area: ["330px", "375px"],
                content: "./login.html"
            });
        },
        hide: function () {
            // layer.close(login.id);
            layer.closeAll();
            typeof  login.callback =="function" && login.callback.call();
        }
    };

    exports('login', login);
});