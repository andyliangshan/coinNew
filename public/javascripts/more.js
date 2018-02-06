/**
 * Created by andy on 18/1/29.
 */
(function ($) {
    var MOBILE_REG = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
    var EMAIL_REG = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    var WECHAT_REG = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;

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
    // 反馈建议表单提交
    $('#submitformMore').click(function (e) {
        e.preventDefault();
        var username = getCookie('username');
        if (username) {
            var textarea = $('.textarea').val();
            var phone = $('[name="phone"]').val();
            var email = $('[name="email"]').val();
            var weixin = $('[name="weixin"]').val();
            var alertDaner = $('.alertDaner span');
            if (!textarea) {
                alertDaner.parent().fadeIn(500);
                alertDaner.text('反馈意见不能为空');
                setTimeout(function () {
                    alertDaner.parent().fadeOut(500);
                }, 2000);
                return;
            } else {}

            if (weixin && !WECHAT_REG.test(weixin)) {
                alertDaner.parent().fadeIn(500);
                alertDaner.text('微信号有误');
                setTimeout(function () {
                    alertDaner.parent().fadeOut(500);
                }, 2000);
                return;
            } else {}

            if (phone && !MOBILE_REG.test(phone)) {
                alertDaner.parent().fadeIn(500);
                alertDaner.text('手机号有误');
                setTimeout(function () {
                    alertDaner.parent().fadeOut(500);
                }, 2000);
                return;
            } else {}

            if (email && !EMAIL_REG.test(email)) {
                alertDaner.parent().fadeIn(500);
                alertDaner.text('邮箱有误');
                setTimeout(function () {
                    alertDaner.parent().fadeOut(500);
                }, 2000);
                return;
            } else {}

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
                url: 'http://39.106.148.255/wechat/user/feedback/add',
                method: 'post',
                data: {
                    feedbackContent: textarea,
                    mobilePhone: phone,
                    wechatNum: weixin,
                    qq: email
                },
                async: false,
                dataType: 'jsonp',
                jsonp: 'jsonpCall',
                timeout: 2000,
                success: function (data) {
                    console.log(data);
                    removeClick($self);
                    if (data.success === 1000) {
                        $('#suggestSuccess').modal('show');
                    }
                },
                error: function (err, data) {
                    removeClick($self);
                    console.log(err, data.msg);
                }
            });
        } else {
            window.location.href = '/more';
            return false;
        }
    });

    // 返回上一页面
    $('.backtoPage').click(function (e) {
        e.preventDefault();
        window.history.go(-1);
    });

})(jQuery);