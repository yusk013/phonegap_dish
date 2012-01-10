var cateTmpl = "<ul>{{#category}}<li><a href='#c{{id}}'>{{name}}</a></li>{{/category}}</ul>";
var dishTmpl = "{{#dishes}}<article style='background-image:url(img/{{img}})' data-id='{{id}}'><header><h2>{{name}}</h2></header><section class='des'>{{des}}</section><section class='price' data-p='{{price}}' data-vp='{{vipPrice}}'><ul><li>{{price}}</li><li>{{vipPrice}}</li></ul></section></article>{{/dishes}}";
var $ = function (str) {
    return document.querySelector(str);
};
var $a = function (str) {
    return document.querySelectorAll(str);
}

document.addEventListener("deviceready", onDeviceReady, false);

var onDeviceReady = function () {
    $("header h1").innerText = menus.corp.name;
    $("nav").innerHTML = Mustache.to_html(cateTmpl, menus);
    bindDishes(1);
};

var bindDishes = function (pages) {
    if (!pages) pages = 1;
    var all = menus.dishes.length;
    var start = (pages - 1) * 3;
    var end = start + 3;
    var currentDishes = menus.dishes.slice(start, end);
    $("section").innerHTML = Mustache.to_html(dishTmpl, { dishes: currentDishes });
};