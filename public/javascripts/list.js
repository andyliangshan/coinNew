/**
 * Created by andy on 18/1/29.
 */
var orderTypeProgram = 'ASC';
var showCountProgram = 10;
var newstrProgram = '';
var newClassName = 'upbtn';

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

// 截取字符串每隔四位
function formatNum(str) {
    var newStr = parseInt(str).toString();
    if (newStr.length > 4 && newStr.length < 9) {
        return newStr.substring(-1, (newStr.length - 4)) + '万';
    } else if (newStr.length >= 9) {
        return newStr.substring(-1, (newStr.length - 8)) + '亿';
    } else {
        return newStr;
    }
}
// 保留两位小数
function fomatFloat(src, pos) {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

$(function () {
    // 点击最新价排序
    var globalNewPriceIndex = sessionStorage.getItem('globalNewPriceIndex');
    var globalNewZbfIndex = sessionStorage.getItem('globalNewZbfIndex');
    var globalClassName = sessionStorage.getItem('globalClassName') || 'upbtn';

    if (parseInt(globalClassName) == 'downbtn') {
        $('#newprice').find('span').removeClass('downbtn').addClass(globalClassName);
    } else {
        $('#newprice').find('span').removeClass('upbtn').addClass(globalClassName);
    }

    $('#newprice').click(function () {
        if (parseInt(globalNewPriceIndex) == 1) {
            globalNewPriceIndex = 2;
            globalClassName = 'upbtn';
            window.location.search = 'orderType=ASC';
            sessionStorage.setItem('globalNewPriceIndex', 2);
            sessionStorage.setItem('globalClassName', 'upbtn');
        } else {
            globalNewPriceIndex = 1;
            globalClassName = 'downbtn';
            window.location.search = 'orderType=DESC';
            sessionStorage.setItem('globalNewPriceIndex', 1);
            sessionStorage.setItem('globalClassName', 'downbtn');
        }
        return false;
    });

    $('#priceBif').click(function () {
        $('#data2').empty();
        if (parseInt(globalNewZbfIndex) % 2 === 0) {
            globalNewZbfIndex = 1;
            orderTypeProgram = 'ASC';
            sessionStorage.setItem('globalNewZbfIndex', 1);
            newClassName = 'upbtn';
            sessionStorage.setItem('newClassName', 'upbtn');
            $(this).find('span').addClass(sessionStorage.getItem('newClassName')).removeClass('downbtn');
        } else {
            globalNewZbfIndex = 0;
            orderTypeProgram = 'DESC';
            sessionStorage.setItem('globalNewZbfIndex', 0);
            newClassName = 'downbtn';
            sessionStorage.setItem('newClassName', 'downbtn');
            $(this).find('span').addClass(sessionStorage.getItem('newClassName')).removeClass('upbtn');
        }
        pullUpActionProgram();
        return false;
    });

    $('.ownlist').click(function () {
        sessionStorage.setItem('globalNewPriceIndex', 1);
        sessionStorage.setItem('globalClassName', 'upbtn');
    });
    $('.myprogramlist').one('click', function () {
        showCountProgram = 10;
        $.ajax({
            url: 'http://39.106.148.255/wechat/often/data/list/?',
            method: 'post',
            data: {
                currentPageForApp: 1,
                showCount: showCountProgram,
                orderField: 'ltsz_usd',
                orderType: orderTypeProgram
            },
            async: false,
            cache: true,
            dataType: 'jsonp',
            jsonp: 'jsonpCall',
            timeout: 2000,
            success: function (data) {
                if (data.success === 1000) {
                    for (var i = 0, len = data.pagedata.length; i < len; i++) {
                        newstrProgram += listconentProgram(data.pagedata[i]);
                    }
                    $('#data2').append(newstrProgram);
                }
            },
            error: function (err, data) {
                console.log(err, data.msg);
            }
        });
    });
    // 增删改查
    var $cell = $('.rowrankData');
    var tradeName, coinDescCo;
    var checkprogramGlobal = $('#checkprogram');
    $('.rowlist').delegate($cell, 'click', function (e) {
        var that = $(e.target);
        if ($(e.target).attr('class') !== 'rowrankData') {
            that = $(e.target).parents('.rowrankData');
        }
        tradeName = that.find('.coinDesc-co span').text();
        coinDescCo = that.find('.coinDesc-de span:eq(0)').text();
        var text = tradeName + ' ' + coinDescCo;
        checkprogramGlobal.find('.checkCoin a').html(text);
        // 查看项目信息
        checkprogramGlobal.find('.checkprogram a').attr('href', '/detail?tradeName=' + tradeName);
    });
    // 取消项目
    $('.cancelCoin').click(function () {
        $(this).parents('#checkprogram').modal('hide');
    });
    // 添加关注项目
    var modalId = $('#checkprogram');
    modalId.find('.deleteCoin').click(function (e) {
        e.preventDefault();
        var H5Cookie = JSON.parse(getCookie('H5COOKIE_SIGLE'));
        console.log(H5Cookie);
        if (!H5Cookie.cookie) {
            location.href = '/more';
            return;
        }
        $.ajax({
            url: 'http://39.106.148.255/wechat/attent/add',
            method: 'post',
            data: {
                name: H5Cookie.base_info.userName,
                bourse_name: tradeName,
                trade_name: coinDescCo
            },
            async: false,
            dataType: 'jsonp',
            jsonp: 'jsonpCall',
            timeout: 2000,
            success: function (data) {
                console.log(data);
                // if (data.success === 3000) {
                //     alert('请登录');
                //     location.href = '/more';
                //     return;
                // }
                modalId.find('.deleteCoin a').text('删除自选');
            },
            error: function (err, data) {
                console.log(err, data.msg);
            }
        });
    });

});
var showCount = 10;
var orderType = window.location.search.split('=')[1];
var newstr = '';

// dom数据加载
function listconent(coinBase) {
    var bizf = parseInt(coinBase.ltsz_usd) >= 650 ? 'red' : 'blue';
    return '<div class="rowrankData row" data-toggle="modal" data-target="#checkprogram"> ' +
        '<div class="coinDesc col-xs-5"> ' +
        '<div class="coinDesc-co"><span>' + coinBase.name_zh.split('-')[0] + '</span>' + (coinBase.name_zh.split('-')[1] ? ('/' + coinBase.name_zh.split('-')[1]) : '') + '</div> ' +
        '<div class="coinDesc-de"><span>' + coinBase.name + '</span><span>成交量' + formatNum(coinBase.cje_cny) + '</span></div> ' +
        '</div> <div class="coinPrice col-xs-3">¥' + fomatFloat(coinBase.jg_cny, 2) + '</div> ' +
        '<div class="coinMarketPrice col-xs-4  ' + bizf +'"><span>' + formatNum(coinBase.jg_cny) + '</span></div> ' +
        '</div>';
}
function listconentProgram(coinBase) {
    var bizf = coinBase.biZf >= 0 ? 'red' : 'blue';
    return '<div class="rowrankData row" data-toggle="modal" data-target="#checkprogram"> ' +
        '<div class="coinDesc-rank col-xs-2">' + coinBase.ordernum + '</div> ' +
        '<div class="coinDesc col-xs-4"> ' +
        '<div class="coinDesc-co"><span>' + coinBase.name_zh.split('-')[0] + '</span>' + (coinBase.name_zh.split('-')[1] ? ('/' + coinBase.name_zh.split('-')[1]) : '') + '</div> ' +
        '<div class="coinDesc-de"><span>' + coinBase.name + '</span><span>成交量¥' + formatNum(coinBase.cje_cny) + '</span></div> ' +
        '</div> <div class="coinPrice col-xs-3">¥' + fomatFloat(coinBase.jg_cny, 2) + '</div> ' +
        '<div class="coinMarketPrice col-xs-3  ' + bizf +'"><span>' + fomatFloat(coinBase.biZf, 2) + '%</span></div> ' +
        '</div>';
}
/**
 *实现滚动效果
 */
$(function () {
    var clientH = $(window).height();//屏幕高度
    var h = $(document).height() - $(window).scrollTop();
    var timer = null;
    var wrapper = $('#wrapper');
    var pullUp = $("#myScrollbar .pullUp");
    wrapper.on('touchmove', function () {
        var scrollH = $(document).height();
        h = scrollH - $(this).scrollTop();
        if (clientH >= h) {
            pullUp.show();
            timer = setTimeout(function () {
                pullUp.html("松开加载");
            }, 1000);
        } else if (clientH >= h - $(".more").height()) {
            pullUp.html("加载更多");
            pullUp.hide();
        }
    });
    //记录开始按下到松开的时间
    var startTime, endTime;
    wrapper.on('touchstart', function (event) {
        startTime = new Date().getTime();
        pullUp.html("加载更多");
    });
    wrapper.on('touchend', function (event) {
        h = $(document).height() - $(window).scrollTop();
        pullUpAction();
        if (clientH >= h) {
            endTime = new Date().getTime();
            if (endTime - startTime > 500) {
                pullUp.show();
                pullUp.html("加载中...");
            } else {
                clearTimeout(timer);
                pullUp.html("加载更多");
                pullUp.hide();
            }
        } else {
            clearTimeout(timer);
            pullUp.html("加载更多");
            pullUp.hide();
        }
    });
});
function pullUpAction() {
    setTimeout(function () {
        $.ajax({
            url: 'http://39.106.148.255/wechat/often/data/list/?',
            method: 'post',
            data: {
                currentPageForApp: 1,
                showCount: showCount,
                orderField: 'ltsz_usd',
                orderType: orderType
            },
            async: false,
            cache: true,
            dataType: 'jsonp',
            jsonp: 'jsonpCall',
            timeout: 2000,
            success: function (data) {
                if (data.success === 1000) {
                    for (var i = 0, len = data.pagedata.length; i < len; i++) {
                        newstr += listconent(data.pagedata[i]);
                    }
                    $('#data1').append(newstr);
                }
                showCount += 10;
            },
            error: function (err, data) {
                console.log(err, data.msg);
            }
        });
    }, 100);
}
//初始化绑定iScroll控件
pullUpAction();
$(function () {
    var clientH = $(window).height();//屏幕高度
    var h = $(document).height() - $(window).scrollTop();
    var timer = null;
    var wrapper = $('#wrapper1');
    var pullUp = $("#myScrollbar1 .pullUp");
    var pageNum = 10;
    wrapper.on('touchmove', function () {
        var scrollH = $(document).height();
        h = scrollH - $(this).scrollTop();
        if (clientH >= h) {
            pullUp.show();
            timer = setTimeout(function () {
                pullUp.html("");
            }, 1000);
        } else if (clientH >= h - $(".more").height()) {
            pullUp.html("");
            pullUp.hide();
        }
    });
    //记录开始按下到松开的时间
    var startTime, endTime;
    wrapper.on('touchstart', function (event) {
        startTime = new Date().getTime();
        pullUp.html("");
    });
    wrapper.on('touchend', function (event) {
        h = $(document).height() - $(window).scrollTop();
        if (clientH >= h) {
            endTime = new Date().getTime();
            if (endTime - startTime > 1000) {
                pageNum += 10;
                pullUpActionProgram(pageNum);
                pullUp.show();
                pullUp.html("");
            } else {
                clearTimeout(timer);
                pullUp.html("");
                pullUp.hide();
            }
        } else {
            clearTimeout(timer);
            pullUp.html("");
            pullUp.hide();
        }
    });
});
function pullUpActionProgram(showCountProgram = 10) {
    setTimeout(function () {
        $.ajax({
            url: 'http://39.106.148.255/wechat/often/data/list/?',
            method: 'post',
            data: {
                currentPageForApp: 1,
                showCount: showCountProgram,
                orderField: 'ltsz_usd',
                orderType: orderTypeProgram
            },
            async: false,
            cache: true,
            dataType: 'jsonp',
            jsonp: 'jsonpCall',
            timeout: 2000,
            success: function (data) {
                if (data.success === 1000) {
                    for (var i = 0, len = data.pagedata.length; i < len; i++) {
                        newstrProgram += listconentProgram(data.pagedata[i]);
                    }
                    $('#data2').append(newstrProgram);
                }
            },
            error: function (err, data) {
                console.log(err, data.msg);
            }
        });
    }, 100);
}

$(function () {
    // // 点击交易对的时候数据的添加
    // var modalId = $('#checkprogram');
    // var coinDescCo, coinDescDe;
    // $('.rowlist').delegate('.rowrankData', 'click',function () {
    //     coinDescCo = $(this).find('.coinDesc-co span').text().trim();
    //     coinDescDe = $(this).find('.coinDesc-de span:eq(0)').text().trim();
    //     modalId.find('.checkCoin a').text(coinDescCo + ' ' + coinDescDe);
    // });

});