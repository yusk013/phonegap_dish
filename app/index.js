var pageIndex = 1;
var pageSize = 3;
var dishSelected = [];

var cateTmpl = "<ul>{{#category}}<li><a cid='{{id}}'>{{name}}</a></li>{{/category}}</ul>";
var dishTmpl = "{{#dishes}}<article style='background-image:url(img/{{img}})' data-id='{{id}}'><header><h2>{{name}}</h2></header><section class='des'>{{des}}</section><section class='price' data-p='{{price}}' data-vp='{{vipPrice}}'><ul><li>{{price}}</li><li>{{vipPrice}}</li></ul></section><section class='slt'><button class='sub'>-</button><input type='text' value='{{count}}'/><button class='add'>+</button></section></article>{{/dishes}}";
var sltTmpl = "<ol>{{#dishes}}{{#count}}<li>{{name}}<b class='p'>{{price}}元/份</b><b class='c'>{{count}}份</b></li>{{/dishes}}</ol>";
//var $ = function (str) {
//    return document.querySelector(str);
//};
//var $a = function (str) {
//    return document.querySelectorAll(str);
//}
Array.prototype.contains = function (key) {
    for (var i in this) {
        if (this[i] == key) {
            return true;
        }
    }
    return false;
};


document.addEventListener("deviceready", onDeviceReady, false);

var bindEvent = function () {
    $("footer a:nth-child(1)").bind("click", function () {
        if (pageIndex > 1) pageIndex--;
        bindDishes();
    });
    $("footer a:nth-child(2)").bind("click", function () {
        $("#selected").slideDown();
        
    });
    $("footer a:nth-child(3)").bind("click", function () {
        if (menus.pages.length > pageIndex) pageIndex++;
        bindDishes();
    });
    $("nav li a").bind("click", bindCategoryDishes); ;

    $("section.slt button.add").live('click', addDish);
    $("section.slt button.sub").live('click', subDish);
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
                var obj = menus.dishes[i];
                obj.count = count;
                currentDishes.push(obj);
                break;
            }
        }
    }
    $("section").html(Mustache.to_html(dishTmpl, { dishes: currentDishes }));
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