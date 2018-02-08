/**
 * Created by andy on 18/1/29.
 */
(function ($) {
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
    // 拼接url
    var $aa = $('.coinTypeNumber a');
    $aa.click(function (e) {
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        var text = $(this).text().trim();
        window.location.search = '?tradeName=' + text;
    });

    // 点击交易对的时候数据的添加
    var modalId = $('#checkprogram');
    var coinDescCo, coinDescDe;
    $('.rowselData').delegate('.rowrankData', 'click',function () {
        coinDescCo = $(this).find('.coinDesc-co span').text().trim();
        coinDescDe = $(this).find('.coinDesc-de span:eq(0)').text().trim();
        modalId.find('.checkCoin a').text(coinDescCo + ' ' + coinDescDe);
    });
    // 增加自选
    modalId.find('.deleteCoin').click(function (e) {
        e.preventDefault();
        var H5Cookie = getCookie('H5_COOKIE_STG');
        if (!H5Cookie) {
            location.href = '/more';
            return;
        }
        $.ajax({
            url: 'http://39.106.148.255/wechat/attent/add',
            method: 'post',
            data: {
                bourse_name: coinDescDe,
                trade_name: coinDescCo
            },
            async: false,
            dataType: 'jsonp',
            jsonp: 'jsonpCall',
            timeout: 2000,
            success: function (data) {
                console.log(data);
                if (data.success === 1000) {

                }
                modalId.find('.deleteCoin a').text('删除自选');
            },
            error: function (err, data) {
                console.log(err, data.msg);
            }
        });
    });
    // 关闭modal
    modalId.find('.cancelCoin').click(function () {
        modalId.modal('hide');
    });


})(jQuery);