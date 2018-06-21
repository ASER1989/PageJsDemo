/**
 * Created by Lenovo on 2018/3/20.
 */
layui.define([], function (exports) {
    //do something
    function Login(layer) {
        this.layer = layer;
        this.id;
        this.uncode=(+new Date());
        this.callback = null;


        return this;
    }

    Login.prototype.show = function (callback) {
        this.callback = callback;

        this.id = this.layer.open({
            title: ["途见ERP-管理登录", "font-weight:600"],
            type: 2,
            resize: false,
            scrollbar: false,
            closeBtn: 0,
            area: ["330px", "375px"],
            content: "./login.html"
        });
        console.log(this.id, this.uncode);
    }
    Login.prototype.hide = function () {
        console.log(this.id, this.uncode)
        // this.layer.close(this.id);
        this.layer.closeAll();
        typeof  this.callback == "function" && this.callback.call();
    }


    var loginProxy = (function () {
        var _login;
        return function (layer) {
            if (!_login) {
                _login = new Login(layer);
                console.log(_login)
            }
            return _login;
        }
    })();

    exports('login', loginProxy);
});