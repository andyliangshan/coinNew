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
        $('.stage .label').addClass('cons');
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

//删除cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 60 * 60 * 1000);
    document.cookie = "username=" + name + ";expires=" + exp.toGMTString() + ";path=/";
}

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
        },
        error: function (err, data) {
            console.log(err, data.msg);
        }
    });
    // 发送验证码
    var globalYzm = null;
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
            return;
        }
        var timeout = 60;
        var ccPhone = setInterval(function () {
            --timeout;
            $btn.text(timeout + 's后获取');
            if (timeout <= 0) {
                clearInterval(ccPhone);
                $btn.removeAttr('disabled');
                $btn.text('获取验证码');
            }
        }, 1000);
        $.ajax({
            url: 'http://39.106.148.255/wechat' + resultCode,
            method: 'post',
            crossDomain: true,
            data: {
                mobilePhone: phone,
            },
            dataType: 'jsonp',
            timeout: 2000,
            jsonp: 'jsonpCall',
            success: function (data) {
                console.log(JSON.stringify(data), '--------------------');
                if (data.success !== 1000) {
                    alertDaner.parent().fadeIn(500);
                    alertDaner.text(data.msg);
                    setTimeout(function () {
                        alertDaner.parent().fadeOut(500);
                    }, 2000);
                    return;
                }
                globalYzm = data.success;
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
            return;
        }
        if (!inputYzm && inputYzm.length !== 4) {
            alertDaner.parent().fadeIn(500);
            alertDaner.text('验证码有误');
            setTimeout(function () {
                alertDaner.parent().fadeOut(500);
            }, 2000);
            return;
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
                console.log(data);
                removeClick($self);
                if (globalYzm === 1000 && data.success === 1000) {
                    $('#login').modal('hide');
                    $('#loginSuccess').modal('show');
                    document.cookie = "username=" + data.base_info.userName;
                    location.reload();
                } else {
                    alertDaner.parent().fadeIn(500);
                    alertDaner.text('别闹，验证码输错了');
                    setTimeout(function () {
                        alertDaner.parent().fadeOut(500);
                    }, 2000);
                    return false;
                }
            },
            error: function (err, data) {
                removeClick($self);
                console.log(err, data.msg);
            }
        });
    });

    // 退出登录
    var resetName = $('#hiddenVal').val();
    $('#logoutBtn').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'http://39.106.148.255/wechat/shop/login/out',
            method: 'post',
            data: null,
            async: false,
            dataType: 'jsonp',
            jsonp: 'jsonpCall',
            timeout: 2000,
            success: function (data) {
                console.log(data);
                if (data.success === 1000) {
                    delCookie(resetName);
                }
            },
            error: function (err, data) {
                console.log(err, data.msg);
            }
        });
    });
})(jQuery);