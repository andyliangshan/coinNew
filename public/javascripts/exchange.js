/**
 * Created by andy on 18/1/29.
 */
(function ($) {
    // 拼接url
    var $aa = $('.coinTypeNumber a');
    $aa.click(function (e) {
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        var text = $(this).text().trim();
        window.location.search = '?tradeName=' + text;
    });


})(jQuery);