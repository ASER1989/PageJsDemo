/**
 * Created by Lenovo on 2018/4/12.
 */
require(['http://res.wx.qq.com/open/js/jweixin-1.2.0.js','./js/page.js','./js/wxconfig.js?v=1'], function () {
    page({
        onReady: function () {
            $(".card-ctx-ul li").on("click",function () {
                var _url = $(this).attr("data-link");
                console.log(_url)
                window.location = _url;
            })
            wxReady(function (obj) {
                obj.onShare(this,'甘南共青团微信矩阵','甘南共青团系统新媒体微信矩阵','http://invitation.gsrunhe.com/card.html','http://invitation.gsrunhe.com/img/card/share.png');
            });
        }
    });
});