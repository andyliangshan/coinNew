/**
 * Created by andy on 18/1/30.
 */
// 拖动滑块验证
var oBtn = document.getElementById('btn');
var oW, oLeft;
var oSlider = document.getElementById('slider');
var oTrack = document.getElementById('track');
var oIcon = document.getElementById('icon');
var oSpinner = document.getElementById('spinner');
var label = document.querySelector('.stage .label');
var flag = 1;
var MOBILE_REG = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;

//设置自定义过期时间cookie
function setCookie(name, value, time) {
    var msec = getMsec(time); //获取毫秒
    var exp = new Date();
    exp.setTime(exp.getTime() + msec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//将字符串时间转换为毫秒,1秒=1000毫秒
function getMsec(str) {
    var timeNum = str.substring(0, str.length - 1) * 1; //时间数量
    var timeStr = str.substring(str.length - 1, str.length); //时间单位前缀，如h表示小时
    if (timeStr == "s") { //20s表示20秒
        return timeNum * 1000;
    }
    else if (timeStr == "h") { //12h表示12小时
        return timeNum * 60 * 60 * 1000;
    }
    else if (timeStr == "d") {
        return timeNum * 24 * 60 * 60 * 1000;
    } //30d表示30天
}

//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"); //正则匹配
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }
    else {
        return null;
    }
}

oBtn.addEventListener('touchstart', function (e) {
    if (flag == 1) {
        console.log(e);
        var touches = e.touches[0];
        oW = touches.clientX - oBtn.offsetLeft;
        oBtn.className = "button";
        oTrack.className = "track";
    }

}, false);

oBtn.addEventListener('touchmove', function (e) {
    if (flag == 1) {
        var touches = e.touches[0];
        oLeft = touches.clientX - oW;
        if (oLeft < 0) {
            oLeft = 0;
        } else if (oLeft > document.documentElement.clientWidth - oBtn.offsetWidth - 49) {
            oLeft = (document.documentElement.clientWidth - oBtn.offsetWidth - 49);
        }
        oBtn.style.left = oLeft + "px";
        oTrack.style.width = oLeft + 'px';
    }

}, false);

oBtn.addEventListener('touchend', function () {
    if (oLeft >= (oSlider.clientWidth - oBtn.clientWidth)) {
        oBtn.style.left = (document.documentElement.clientWidth - oBtn.offsetWidth - 49);
        oTrack.style.width = (document.documentElement.clientWidth - oBtn.offsetWidth - 49);
        oIcon.style.display = 'none';
        oSpinner.style.display = 'block';
        label.innerHTML = '验证成功';
        label.style.color = '#fff !important';
        oBtn.style.background = '#fff';
        flag = 0;
        var sendButton = $('#sendButton');
        sendButton.css({'color': '#c3970c', 'background': '#fff'});
        sendButton.removeAttr('disabled');
    } else {
        oBtn.style.left = 0;
        oTrack.style.width = 0;
    }
    oBtn.className = "button-on";
    oTrack.className = "track-on";
}, false);

(function ($) {
    // 获取发送验证码地址
    var resultCode = null;
    $.ajax({
        url: 'http://39.106.148.255/wechat/login/check',
        method: 'post',
        data: null,
        async: false,
        dataType: 'jsonp',
        jsonp: 'jsonpCall',
        timeout: 2000,
        success: function (data) {
            resultCode = data.randMethod;
            console.log(resultCode, '2122======233223');
        },
        error: function (err, data) {
            console.log(err, data.msg);
        }
    });
    // 发送验证码
    $('#sendButton').click(function (e) {
        e.preventDefault();
        var phone = $('[name="inputPhone"]').val();
        var alertDaner = $('.alertDaner span');
        var $btn = $('#sendButton');
        if (!phone && !MOBILE_REG.test(phone)) {
            alertDaner.parent().fadeIn(500);
            alertDaner.text('手机号有误');
            setTimeout(function () {
                alertDaner.parent().fadeOut(500);
            }, 2000);
        }
        $.ajax({
            url: 'http://39.106.148.255/wechat' + resultCode,
            method: 'post',
            crossDomain: true,
            data: {
                mobilePhone: phone,
            },
            dataType: 'json',
            timeout: 2000,
            success: function (data) {
                if (data.success === 1000) {
                    var timeout = 60;
                    var ccPhone = setInterval(function () {
                        --timeout;
                        $btn.text(timeout + 's后获取');
                        if (timeout <= 0) {
                            clearInterval(ccPhone);
                            $btn.removeAttr('disabled');
                            $btn.text('发送验证码');
                        }
                    }, 1000);
                }
                console.log(data.success, '======');
            },
            error: function (err, data) {
                $btn.removeAttr('disabled', 'disabled');
                console.log(err, data.msg, '/////////');
            }
        });
    });


    // 登录提交表单
    $('#loginButton').click(function (e) {
        e.preventDefault();
        var phone = $('[name="inputPhone"]').val();
        var inputYzm = $('[name="inputYzm"]').val();
        var alertDaner = $('.alertDaner span');
        if (!phone && !MOBILE_REG.test(phone)) {
            alertDaner.parent().fadeIn(500);
            alertDaner.text('手机号有误');
            setTimeout(function () {
                alertDaner.parent().fadeOut(500);
            }, 2000);
        }
        if (!inputYzm && inputYzm.length !== 4) {
            alertDaner.parent().fadeIn(500);
            alertDaner.text('验证码有误');
            setTimeout(function () {
                alertDaner.parent().fadeOut(500);
            }, 2000);
        }
        //防止重复提交表单
        var $self = $(this);
        if ($.isAbroadClick) {
            return;
        }
        $.isAbroadClick = true;
        $self.button('loading');
        var removeClick = function(ele) {
            setTimeout(function() {
                ele.button('reset');
                $.isAbroadClick = false;
            },1000);
        };
        $.ajax({
            url: 'http://39.106.148.255/wechat/login/in',
            method: 'post',
            data: {
                mobilePhone: phone,
                vCode: inputYzm,
            },
            async: false,
            dataType: 'jsonp',
            jsonp: 'jsonpCall',
            timeout: 2000,
            success: function (data) {
                removeClick($self);
                console.log(data.success);
            },
            error: function (err, data) {
                removeClick($self);
                console.log(err, data.msg);
            }
        });

    });

})(jQuery);