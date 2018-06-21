/**
 * Created by Lenovo on 2017/8/29.
 *

 */

// var imguper = new imgUper({
//                    onComplete:function (data) {
//
//                    },
//                    onFail:function () {
//
//                    }
//                })
// imguper.UpladFile(files,url,name)

require(['./js/lib/exif.js'], function () {
});
function imgUper(option) {

    var _that = this, _option = option;
    _option.onComplete = typeof _option.onComplete == "function" ? _option.onComplete : function () {

    }
    /*
     三个参数
     file：一个是文件(类型是图片格式)，
     w：一个是文件压缩的后宽度，宽度越小，字节越小
     objDiv：一个是容器或者回调函数
     photoCompress()
     */
    var Orientation = null;

    function photoCompress(file, w, objDiv) {
        Orientation = null;
        EXIF.getData(file, function () {
            // alert(EXIF.pretty(this));
            EXIF.getAllTags(this);
            //alert(EXIF.getTag(this, 'Orientation'));
            Orientation = EXIF.getTag(this, 'Orientation');
            //return;
        });

        var ready = new FileReader();
        /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
        ready.readAsDataURL(file);
        ready.onload = function () {
            var re = this.result;
            //canvasDataURL(re, w, objDiv)
            getImgData(re, Orientation, objDiv)
        }
    }

    // param {string} img 图片的base64
    // param {int} dir exif获取的方向信息
    // param {function} next 回调方法，返回校正方向后的base64
    function getImgData(img, dir, next) {
        var image = new Image();
        image.onload = function () {
            var degree = 0, drawWidth, drawHeight, width, height;
            drawWidth = this.naturalWidth;
            drawHeight = this.naturalHeight;
            //以下改变一下图片大小
            var maxSide = Math.max(drawWidth, drawHeight);
            if (maxSide > 1024) {
                var minSide = Math.min(drawWidth, drawHeight);
                minSide = minSide / maxSide * 1024;
                maxSide = 1024;
                if (drawWidth > drawHeight) {
                    drawWidth = maxSide;
                    drawHeight = minSide;
                } else {
                    drawWidth = minSide;
                    drawHeight = maxSide;
                }
            }
            var canvas = document.createElement('canvas');
            canvas.width = width = drawWidth;
            canvas.height = height = drawHeight;
            var context = canvas.getContext('2d');
            //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
            switch (dir) {
                //iphone横屏拍摄，此时home键在左侧
                case 3:
                    degree = 180;
                    drawWidth = -width;
                    drawHeight = -height;
                    break;
                //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
                case 6:
                    canvas.width = height;
                    canvas.height = width;
                    degree = 90;
                    drawWidth = width;
                    drawHeight = -height;
                    break;
                //iphone竖屏拍摄，此时home键在上方
                case 8:
                    canvas.width = height;
                    canvas.height = width;
                    degree = 270;
                    drawWidth = -width;
                    drawHeight = height;
                    break;
            }
            //使用canvas旋转校正
            context.rotate(degree * Math.PI / 180);
            context.drawImage(this, 0, 0, drawWidth, drawHeight);
            //返回校正图片
            next(canvas.toDataURL("image/jpeg", .8));
        }
        image.src = img;
    }

    function canvasDataURL(path, obj, callback) {
        var img = new Image();
        img.src = path;
        img.onload = function () {
            var that = this;
            // 默认按比例压缩
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || (w / scale);
            var quality = 0.7;  // 默认图片质量为0.7
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            if (Orientation != "" && Orientation != 1 && Orientation != undefined) {
                var width = that.naturalWidth;
                var height = that.naturalHeight;
                switch (Orientation) {
                    case 6://需要顺时针90度旋转
                        debugger
                        //h = w * scale;
                        canvas.width = w;
                        canvas.height = h;
                        ctx.rotate(90 * Math.PI / 180);
                        ctx.drawImage(that, 0, that.height, that.width, that.height);
                        //ctx.drawImage(that, 0, -h,width,height );
                        break;
                    case 8://需要逆时针90度旋转
                        canvas.width = h;
                        canvas.height = w;
                        ctx.rotate(-90 * Math.PI / 180);
                        ctx.drawImage(that, -w, 0);
                        break;
                    case 3://需要180度旋转
                        ctx.rotate(180 * Math.PI / 180);
                        ctx.drawImage(that, -w, -h);
                        break;
                }
            } else {
                // 创建属性节点
                var anw = document.createAttribute("width");
                anw.nodeValue = w;
                var anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(that, 0, 0, w, h);
            }


            // 图像质量
            if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                quality = obj.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/jpeg', quality);
            // 回调函数返回base64的值
            callback(base64);
        }
    }

    /**
     * 将以base64的图片url数据转换为Blob
     *urlData
     * 用url方式表示的base64图片数据
     */
    //function convertBase64UrlToBlob(urlData) {
    //    var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
    //        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    //    while (n--) {
    //        u8arr[n] = bstr.charCodeAt(n);
    //    }
    //    return new Blob([u8arr], { type: mime });
    //}


    function convertBase64UrlToBlob(dataurl) {
        var arr = dataurl.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];// 结果：   image/png
        // console.log("arr[0]====" + JSON.stringify(arr[0]));//   "data:image/png;base64"
        // console.log("arr[0].match(/:(.*?);/)====" + arr[0].match(/:(.*?);/));// :image/png;,image/png
        // console.log("arr[0].match(/:(.*?);/)[1]====" + arr[0].match(/:(.*?);/)[1]);//   image/png
        var bstr = atob(arr[1].replace(/\s/g, ''));
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});//值，类型
    }

    var xhr;
    //上传文件方法
    _that.UpladFile = function UpladFile(files, url, name) {
        name = name || 'file';
        files = Object.prototype.toString.call(files) == "[object Array]" ? files : [files];

        // var files = document.getElementById("file").files; // js 获取文件对象
        if (files.length == 0) {
            return;
        }

        // var url = "/image/upload"; // 接收上传文件的后台地址

        var form = new FormData(), queue = files.length; // FormData 对象

        function appendReqData(n, f, c) {
            if (c) {
                form.append(n, f, c);
            } else {
                form.append(n, f)
            }

            queue--;
            queue == 0 && requestSend();
        }

        function requestSend() {
            xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
            xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
            xhr.onload = _that._onComplete; //请求完成
            xhr.onerror = _that.onUploadFailed; //请求失败

            xhr.upload.onprogress = _that.onProgress;//【上传进度调用方法实现】
            xhr.upload.onloadstart = function () {//上传开始执行方法
                ot = +new Date();   //设置上传开始时间
                oloaded = 0;//设置上传开始时，以上传的文件大小为0
            };

            xhr.send(form); //开始上传，发送form数据
        }

        for (var i = 0, fileObj; fileObj = files[i++];) {
            if (fileObj.size / 1024 > 900) { //大于900kb，进行压缩上传
                photoCompress(fileObj, {
                    quality: 1,
                    width: 640
                }, function (base64Codes) {
                    //console.log("压缩后：" + base.length / 1024 + " " + base);
                    var bl = convertBase64UrlToBlob(base64Codes);
                    appendReqData(name, bl, "file_" + Date.parse(new Date()) + ".jpg");
                    //form.append("file", bl, "file_" + Date.parse(new Date()) + ".jpg"); // 文件对象

                });
            } else { //小于等于1M 原图上传
                appendReqData(name, fileObj); // 文件对象
            }
        }


    }

    //上传成功响应
    _that._onComplete = function (evt, b, c) {
        //服务断接收完文件返回的结果


        var data = JSON.parse(evt.target.responseText);
        typeof _option.onComplete == "function" && _option.onComplete(data);

    }

    //上传失败
    _that.onUploadFailed = function (evt) {
        typeof _option.onFail == "function" && _option.onFail(evt);

        // alert("上传失败！");
    }

    //取消上传
    function cancleUploadFile() {
        xhr.abort();
    }

    //上传进度实现方法，上传过程中会频繁调用该方法
    _that.onProgress = function (evt) {
        //var progressBar = document.getElementById("progressBar");
        //var percentageDiv = document.getElementById("percentage");
        //// event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
        //if (evt.lengthComputable) {//
        //    progressBar.max = evt.total;
        //    progressBar.value = evt.loaded;
        //    percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
        //}
        // var time = document.getElementById("time");
        // var nt = new Date().getTime();//获取当前时间
        // var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
        // ot = new Date().getTime(); //重新赋值时间，用于下次计算
        // var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b
        // oloaded = evt.loaded;//重新赋值已上传文件大小，用以下次计算
        // //上传速度计算
        // var speed = perload / pertime;//单位b/s
        // var bspeed = speed;
        // var units = 'b/s';//单位名称
        // if (speed / 1024 > 1) {
        //     speed = speed / 1024;
        //     units = 'k/s';
        // }
        // if (speed / 1024 > 1) {
        //     speed = speed / 1024;
        //     units = 'M/s';
        // }
        // speed = speed.toFixed(1);
        // //剩余时间
        // var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
        // time.innerHTML = '速度：' + speed + units + '，剩余时间：' + resttime + 's';
        // if (bspeed == 0) time.innerHTML = '上传已取消';
    }

    return {
        UpladFile: _that.UpladFile
    }
    // });
}