var pageIndex = 1;
var pageSize = 3;
var dishSelected = [];

var cateTmpl = "<ul>{{#category}}<li><a cid='{{id}}'>{{name}}</a></li>{{/category}}</ul>";
var dishTmpl = "{{#dishes}}<article style='background-image:url(img/{{img}})' data-id='{{id}}'><header><h2>{{name}}</h2></header><section class='des'>{{des}}</section><section class='price' data-p='{{price}}' data-vp='{{vipPrice}}'><ul><li>{{price}}</li><li>{{vipPrice}}</li></ul></section><section class='slt'><a class='sub'>-</a><input type='text' readonly value='{{count}}'/><a class='add'>+</a></section></article>{{/dishes}}";
var sltTmpl = "{{#dishes}}<li>{{name}}<b class='p'>{{price}}/{{vipPrice}}元/份</b><b class='c'>{{count}}份</b><b>{{tp}}/{{tvp}}</b></li>{{/dishes}}";
//var sltTmpl = "<table><thead><tr><th>菜名</th><th>价格</th><th>数量</th><th>小计</th></tr></thead><tbody>{{#dishes}}<tr><td>{{name}}</td><td>{{price}}/{{vipPrice}}</td><td>{{count}}</td><td>{{tp}}/{{tvp}}</td></tr>{{/dishes}}</tbody></table>"

document.addEventListener("deviceready", onDeviceReady, false);

var bindEvent = function () {
    $("footer a:nth-child(1)").bind("click", function () {
        if (pageIndex > 1) pageIndex--;
        bindDishes();
    });
    $("footer a:nth-child(2)").bind("click", bindSelectedMenu);
    $("footer a:nth-child(3)").bind("click", function () {
        if (menus.pages.length > pageIndex) pageIndex++;
        bindDishes();
    });
    $("nav li a").bind("click", bindCategoryDishes); ;

    $("section.slt a.add").live('click', addDish);
    $("section.slt a.sub").live('click', subDish);

    $("#selected button").click(menuClose);
};

var onDeviceReady = function () {
    $("header h1").text(menus.corp.name);
    $("nav").html(Mustache.to_html(cateTmpl, menus));
    bindDishes();
    bindEvent();
};
var bindCategoryDishes = function () {
    var cid = parseInt(this.getAttribute("cid"));
    for (var i in menus.pages) {
        if (menus.pages[i].cateId == cid) {
            pageIndex = parseInt(i) + 1;
            break;
        }
    }
    bindDishes();
};

var bindDishes = function () {
    var page = menus.pages[pageIndex - 1];
    if (!page) return;
    var currentDishes = [];
    for (var j in page.dishes) {
        for (var i in menus.dishes) {
            if (page.dishes[j] == menus.dishes[i].id) {
                var count = 0;
                for (var k in dishSelected) {
                    if (menus.dishes[i].id == dishSelected[k].id) {
                        count = dishSelected[k].count;
                        break;
                    }
                }
                var obj = $.extend({}, menus.dishes[i]);
                obj.count = count;
                currentDishes.push(obj);
                break;
            }
        }
    }
    var cateId = menus.pages[pageIndex - 1].cateId;
    if (cateId) {
        $("body>nav>ul>li").removeClass();
        $("body>nav>ul>li>a").each(function () {
            var cid = parseInt($(this).attr('cid'));
            if (cid == cateId) {
                $(this).parent().addClass('on');
            }
        });
    }
    $("section").html(Mustache.to_html(dishTmpl, { dishes: currentDishes }));
};

var bindSelectedMenu = function () {
    var menuList = [];
    $.each(menus.dishes, function (i, n) {
        $.each(dishSelected, function (j, m) {
            if (n.id == m.id) {
                var obj = $.extend({ count: m.count, tp: n.price * m.count, tvp: n.vipPrice * m.count }, n);
                menuList.push(obj);
            }
        });
    });
    if (menuList.length > 0) {
        $("#selected ol").html(Mustache.to_html(sltTmpl, { dishes: menuList }));
    }
    else {
        $("#selected ol").html("<li>您还未点菜，请点击“返回”点菜</li>");
    }
    menuShow();
};
var menuShow = function () {
    $("#selected").css('top', '100%').show();
    $("#selected").animate({ 'top': 0 }, 1000);
};
var menuClose = function () {
    $("#selected").hide();
};

var subDish = function () {
    var txt = $(this).next();
    var val = parseInt(txt.val());
    if (val > 0) {
        var finalValue = val - 1;
        txt.val(finalValue);
        selectdDish($(this), finalValue);
    }
};
var addDish = function () {
    var txt = $(this).prev();
    var val = parseInt(txt.val());
    var finalValue = val + 1;
    txt.val(finalValue);
    selectdDish($(this), finalValue);
};
var selectdDish = function ($this, count) {
    var dishId = parseInt($this.parent().parent("article").attr('data-id'));
    var isHave = false;
    $.each(dishSelected, function (i, n) {
        if (n.id == dishId) {
            if (count > 0) {
                n.count = count;
            }
            else {
                dishSelected.splice(i, 1);
            }
            isHave = true;
            return false;
        }
    });
    if (!isHave && count > 0) {
        var selected = {};
        selected.id = dishId;
        selected.count = count;
        dishSelected.push(selected);
    }
};