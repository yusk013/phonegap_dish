var pageIndex = 1;
var pageSize = 3;

var cateTmpl = "<ul>{{#category}}<li><a href='#c{{id}}' cid='{{id}}'>{{name}}</a></li>{{/category}}</ul>";
var dishTmpl = "{{#dishes}}<article style='background-image:url(img/{{img}})' data-id='{{id}}'><header><h2>{{name}}</h2></header><section class='des'>{{des}}</section><section class='price' data-p='{{price}}' data-vp='{{vipPrice}}'><ul><li>{{price}}</li><li>{{vipPrice}}</li></ul></section></article>{{/dishes}}";
var $ = function (str) {
    return document.querySelector(str);
};
var $a = function (str) {
    return document.querySelectorAll(str);
}
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
    $("footer a:nth-child(1)").addEventListener("click", function () {
        if (pageIndex > 1) pageIndex--;
        bindDishes();
    });
    $("footer a:nth-child(2)").addEventListener("click", function () {
        //        if (pageIndex > 1) pageIndex--;
        //        bindDishes();
    });
    $("footer a:nth-child(3)").addEventListener("click", function () {
        if (menus.pages.length > pageIndex) pageIndex++;
        bindDishes();
    });
    var categoryTabs = $a("nav li a");
    for (var i in categoryTabs) {
        categoryTabs[i].addEventListener("click", bindCategoryDishes);
    }
};

var onDeviceReady = function () {
    $("header h1").innerText = menus.corp.name;
    $("nav").innerHTML = Mustache.to_html(cateTmpl, menus);
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
                currentDishes.push(menus.dishes[i]);
                break;
            }
        }
    }

    $("section").innerHTML = Mustache.to_html(dishTmpl, { dishes: currentDishes });
};