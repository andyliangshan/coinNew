/**
 * Created by andy on 18/1/29.
 */
(function ($) {
    var inputkeyNameTag = $('.inputKeyName');
    // 搜索交易对
    inputkeyNameTag.keyup(function () {
        $('#showSearchResult').empty();
        var inputKeyName = $('#inputKeyName').val();
        $.ajax({
            url: 'http://39.106.148.255/wechat/often/data/searchtradename',
            method: 'post',
            data: {
                tradeName: inputKeyName,
            },
            async: false,
            dataType: 'jsonp',
            jsonp: 'jsonpCall',
            timeout: 2000,
            success: function (data) {
                var $li = '';
                if (data.tradename) {
                   for (var i = 0, len = data.tradename.length; i < len; i++ ) {
                       $li += '<li><a href="/search/result?' + data.tradename[i].trade_name + '"  class="coinCont">' + data.tradename[i].trade_name + '</a></li>';
                   }
                   $('#showSearchResult').append($li);
                }
            },
            error: function (err, data) {
                console.log(err, data.msg, '----------');
            }
        });
        // 存储搜索值
        localStorage.setItem('keyWord', inputKeyName);
    });
    inputkeyNameTag.focus(function () {
        var data = localStorage.getItem('keyWord');
        $.ajax({
            url: 'http://39.106.148.255/wechat/often/data/searchtradename',
            method: 'post',
            data: {
                tradeName: data,
            },
            async: false,
            dataType: 'jsonp',
            jsonp: 'jsonpCall',
            timeout: 2000,
            success: function (data) {
                var $li = '';
                if (data.tradename) {
                    for (var i = 0, len = data.tradename.length; i < len; i++ ) {
                        $li += '<li><a href="/search/result?' + data.tradename[i].trade_name + '"  class="coinCont">' + data.tradename[i].trade_name + '</a></li>';
                    }
                    $('#showSearchResult').append($li);
                }
            },
            error: function (err, data) {
                console.log(err, data.msg, '----------');
            }
        });
    });

    $('#search .cancelSearch').click(function () {
        window.history.go(-1);
    });
    // 清空输入内容
    $('.inputkey span').click(function () {
        var daval = localStorage.getItem('keyWord');
        if ($('#inputKeyName').val()) {
            $('#inputKeyName').val('');
        } else  {
            $('#inputKeyName').val(daval);
        }
    });



})(jQuery);