/**
 * Created by Lenovo on 2018/4/12.
 */
require(['http://res.wx.qq.com/open/js/jweixin-1.2.0.js','./js/page.js','./js/wxconfig.js?v=1', './js/lib/swiper.animate.min.js', './js/lib/swiper.min.js'], function () {
    page({
        isSubmit:false,
        onReady: function () {
            $("body").removeClass("show");

            var img = new Image();
            img.onload=function () {
                $("body").addClass("show");
                var mySwiper = new Swiper('.swiper-container', {
                    on: {
                        init: function () {
                            swiperAnimateCache(this); //隐藏动画元素
                            swiperAnimate(this); //初始化完成开始动画
                            $(".finger").removeClass("hide");
                            setTimeout(function () {
                                $(".finger").addClass("hide");
                            },3600);
                        },
                        slideChangeTransitionEnd: function () {
                            swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
                        }
                    }
                });
                wxReady(function () {
                    var audio = document.getElementById('musicAudio');

                    try {
                        WeixinJSBridge.invoke('getNetworkType', {}, function (res) {
                            audio.play();
                        });
                    } catch (e) {

                    }
                });

            }
            img.src="./img/bg.png";

            store.get(store.get("openid")) && $(".page-eight").hide();



//                document.body.ontouchmove = function (e) {
//                    e.preventDefault();
//                };
//


        },
        onSave: function (e,_that) {

            if(store.get(store.get("openid"))){
                window.location.reload();
                return;
            }
            if(_that.isSubmit){
                return;
            }

            var form = $(".page-eight .form").find("input");
            var input = [], radio = [],reqData={};
            for (var i = 0, item; item = form[i++];) {
                item.type == "radio" ? radio.push(item) : input.push(item);
            }

            for(var i=0,item;item=input[i++];){
                if(item.value==""){
                    alert("请完善回执信息！")
                    return;
                }
                reqData[item.name]=item.value;
            }

            reqData.room = radio[0].checked?radio[0].value:radio[1].value;

            _that.isSubmit == true;
            $.ajax({
                url:"assets/pub/save",
                type:"POST",
                data:reqData,
                success:function(resp){
                    resp = JSON.parse(resp);

                    if(resp.code>0){
                        store.set(store.get("openid"),true);
                        alert("操作成功！");
                        window.location.reload();
                        return;
                    }
                    alert(resp.msg);
                    _that.isSubmit = false;
                }
            })

        }
    });
});