/**
 * Created by andy on 18/1/29.
 */
$(function () {
    var arr = [];
    // 模糊查询
    // $("#inputKeyName").autocomplete({
    //     target: $('#showSearchResult'),
    //     source: arr,
    //     link: '/search?term=',
    //     minLength: 1
    // });

   // 增删改查
    var $cell = $('.rowrankData');
    $cell.click(function () {
        var that = $(this);
        var text = that.find('.coinDesc-co span').text() + ' ' +  that.find('.coinDesc-de span:eq(0)').text();
        $('#checkprogram').find('.checkCoin a').html(text);
    });
   // 取消项目
    $('.cancelCoin').click(function () {
        $(this).parents('#checkprogram').modal('hide');
    });
   // 删除项目


});