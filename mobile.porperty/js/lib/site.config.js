// /**
//  * Created by Lenovo on 2017/6/21.
//  * 文件仅用于站点信息配置，不做其他特殊处理。
//  * 文件应在其他js代码执行之前进行加载。
//  */
//
// window.htconfig = __config = {
//     // host: "http://139.129.205.178:8099/lovedby/",
//     apihost: "http://139.129.205.178:8099/lovedby/",
//     host: "http://res.lovedby.cn/lovedby/",
//     // apihost: "https://api.lovedby.cn/lovedby/",
//     // host: "http://192.168.3.14/lovedby/",
//     shareHost:"http://www.lovedby.cn/"
// }
//
// window.GetQueryStr = function (name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//     var r = window.location.search.substr(1).match(reg);
//     return r != null ? decodeURIComponent(r[2]) : null;
// }
// window.topage = function (url) {
//     window.location = url;
// }
// function isNumber(n){
//     return !isNaN(parseFloat(n)) && isFinite(n);
// }
// window.eventInit = function (ev) {
//     var clicks = $("[data-click]");
//     bind(clicks, "click");
//     function bind(els, type) {
//         for (var i = 0, el; el = els[i++];) {
//             el = $(el);
//             el.on(type, ev[el.attr("data-" + type)]);
//         }
//     }
// }
// require.libCallback.push(function () {
//     // store.remove("openid");
//     GetQueryStr("cmd")=="recache" && store.remove("openid");
//
//     if (GetQueryStr("openid") != null && GetQueryStr("openid") != '') {
//         store.set("openid", GetQueryStr("openid"));
//     }
//
//     $.ajax = function (base) {
//         return function (opt) {
//             if (opt) {
//                 opt.url = opt.islocal == true ? opt.url : __config.apihost + opt.url;
//                 //openid配置
//                 opt.data = opt.data || {};
//                 opt.data.openid = store.get("openid");
//             }
//             if (opt.success) {
//                 opt.success = function (successfn) {
//                     return function (res) {
//                         successfn.call(null, res);
//                     }
//                 }(opt.success);
//             }
//             base.call(null, opt);
//         }
//     }($.ajax);
//
//     if (!store.get("openid")) {
//         window.location = __config.apihost + "wx/sa/weChatRedirect?url=" + window.location;
//     }
//
// })
//
