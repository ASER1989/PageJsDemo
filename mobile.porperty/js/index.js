/**
 * Created by Lenovo on 2018/4/12.
 */
require(['http://res.wx.qq.com/open/js/jweixin-1.2.0.js','./js/page.js','./js/msg.js','./js/wxconfig.js?v=1', './js/lib/page-move.js'], function () {
    page({

        onReady: function () {
            this.imgWatch(function (surplus) {
                surplus==0 && $("body").removeClass("hide");
                surplus==0 && new move().start();
            });

        },
        toCreatepage:function () {
          window.location="./neworder.html";
        },
        imgWatch:function (callback) {
            var els = $("img");
            var  surplus  = els.length;
            for(var i=0,el;el=els[i++];){
                var img = new Image();
                img.onload=function () {
                    surplus--;
                    typeof callback=="function" && callback.call(null,surplus)
                }
                img.src=$(el).attr("src");
            }
        },
        onUserReady:function (user,house) {
            if(user.uType=="2"){
                window.location="./worklist.html";
                return;
            }

            if(house==null|| house.length==0){
                msg.show("对不起，您未绑定房屋信息！",{autoHide:3000});
                $("#__house_name").html("未绑定");
                return;
            }
            $("#__house_name").html(house[0].communityAddress);
            $(".idx-top-opt").removeClass("hide");
            this._eventRender();
        }
    });
});