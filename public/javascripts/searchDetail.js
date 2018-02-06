/**
 * Created by andy on 18/2/5.
 */
(function ($) {
    var urlSource = window.location.href;
    var courceKey = $('#scourceKey');
    var hrefLinkVal;
    if (urlSource.indexOf('?') && urlSource.split('?')[1]) {
        hrefLinkVal = urlSource.split('?')[1];
    }
    // 带过去搜索原来的原始值
    courceKey.val(hrefLinkVal);

    // 返回上一页
    $('#resultList').delegate('.inputkey', 'click', function () {
        window.history.back();
    });
    
    
})(jQuery);

