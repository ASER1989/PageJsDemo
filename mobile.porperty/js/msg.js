/**
 * Created by Lenovo on 2018/4/20.
 * msg.show(txt,{autoHide:1000,complete:function,afterHide:function})
 * msg.hide(function)
 *
 */
var msg=(function () {
    function CreateMsg() {
        this.msg ="";
        return this;
    }

    CreateMsg.prototype.init=function () {
       this.div = document.createElement("div");
       this.msgBox = document.createElement("div");
       this.div.appendChild(this.msgBox);

       this.msgBox.classList.add("msg-txt");
       this.div.setAttribute('Class','msg-box hide');
       document.body.appendChild(this.div);
    }

    CreateMsg.prototype.show=function (msg,option) {
        option = option || {};

        this.msg=msg;
        this.msgBox.innerHTML=this.msg;
        this.div.classList.remove("hide");

        var _that =this;

        option.autoHide && setTimeout(function(){_that.hide.call(_that,option.afterHide);},option.autoHide);
        typeof option.complete =="function" && option.complete();
    }

    CreateMsg.prototype.hide=function (callback) {
        this.div.classList.add("hide");
        typeof callback =="function" && callback();
    }

    return (function () {
        var instance;
        if(!instance){
            instance = new CreateMsg();
        }
        instance.init();

        return instance;
    })();

})();