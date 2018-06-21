/**
 * Created by Lenovo on 2017/8/9.
 */
function wxReady(callback){
    var commonObj={
        onShare:function (wx,title,desc,link,img){
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: link, // 分享链接
                desc: desc,
                imgUrl: img, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: img, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        }
    };

    $.ajax({
        url: "http://source.gsrunhe.com/propmgt/wx/getConfig",
        islocal:true,
        data: {requrl: window.location.href},
        success: function (data) {
            data = JSON.parse(data);
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'onVoicePlayEnd',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ]
            });
            wx.ready(function () {
                // commonObj.onShare(wx,'2018甘南州中小企业财税及管理高峰论坛诚邀您参与','财税互联 共赢未来','http://invitation.gsrunhe.com/','http://invitation.gsrunhe.com/img/share.png');
                typeof callback=="function" && callback.call(wx,commonObj);
            });
            wx.error(function(res){
                // console.log(res);
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });

        }
    });
}
