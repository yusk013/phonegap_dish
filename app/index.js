var pageIndex = 1;
var pageSize = 3;
var entryPath = "/mnt/sdcard/eMenu";
var menus;
//var dishSelected = [];

/*
var cateTmpl = "<ul>{{#category}}<li><a cid='{{id}}'>{{name}}</a></li>{{/category}}</ul>";
var dishTmpl = "{{#dishes}}<article data-id='{{id}}'><header><h2>{{name}}</h2></header><section class='dish' style='background-image:url(img/{{img}})'></section><section class='des'>{{des}}</section><section class='price' data-p='{{price}}' data-vp='{{vipPrice}}'><ul><li>{{price}}</li><li>{{vipPrice}}</li></ul></section><section class='slt'><a class='{{#count}}chk{{/count}}'>{{#count}}不要了{{/count}}{{^count}}点一个{{/count}}</a><!--<a class='sub'>-</a><input type='text' readonly value='{{count}}'/><a class='add'>+</a>--></section></article>{{/dishes}}";
var sltTmpl = "<table><thead><tr><th>菜名</th><th>价格(元)</th><th>数量</th><th>小计(元)</th></tr></thead><tbody>{{#dishes}}<tr><td>{{name}}</td><td>{{price}}/{{vipPrice}}</td><td>{{count}}</td><td>{{price}}/{{vipPrice}}</td></tr>{{/dishes}}</tbody></table><p>总价：{{total}}元</p>"
*/

var onDeviceReady = function () {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
		fileSystem.root.getDirectory("eMenu", null, function(dirEntry){
			entryPath = dirEntry.fullPath;
			dirEntry.getFile("dishes.json", null, function(fileEntry){
				fileEntry.file(function(file){
					var reader = new FileReader();
					reader.onloadend = function(evt) {
						eval("menus = " + evt.target.result);
						initUI();
					};
					reader.readAsText(file);
				}, fail);
			}, fail);
		}, fail); 
	}, fail);
};

var fail = function(error) {
	console.log(error.code);
	alert("error:" + error.code);
};

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

    $("section.slt a").live('click', selectdDish);
    //$("section.slt a.add").live('click', addDish);
    //$("section.slt a.sub").live('click', subDish);

    $("#selected a.close").click(menuClose);
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

var initUI = function(){
	$("header h1").text(menus.corp.name);
	$("nav").html(Mustache.to_html($("#cateTmpl").html(), menus));
	var dishesUI = Mustache.to_html($("#dishTmpl").html(), {dishes: menus.dishes});
	$("section").html(dishesUI.replace(/\[\[imgFolder\]\]/g, "file://" + entryPath));
	bindDishes();
	bindEvent();
}

var bindDishes = function () {
    var page = menus.pages[pageIndex - 1];
    if (!page) return;
	$("section>article").hide();
	$.each(page.dishes, function(i){
		$("section>article[data-id='" + page.dishes[i] + "']").show();
	});
	/*
    var currentDishes = [];
    for (var j in page.dishes) {
        for (var i in menus.dishes) {
            if (page.dishes[j] == menus.dishes[i].id) {
                currentDishes.push(menus.dishes[i]);
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
	*/
};

var bindSelectedMenu = function () {
    var menuList = [];
    /*
    $.each(menus.dishes, function (i, n) {
    $.each(dishSelected, function (j, m) {
    if (n.id == m.id) {
    var obj = $.extend({ count: m.count, tp: n.price * m.count, tvp: n.vipPrice * m.count }, n);
    menuList.push(obj);
    }
    });
    });*/
    var total = 0;
    var vtotal = 0;
    $.each(menus.dishes, function (i, n) {
        if (n.count > 0) {
            menuList.push(n);
            total += n.price;
            vtotal += n.vipPrice;
        }
    });
    var sltDishTxt = "已点菜品(" + menuList.length + ")";
    $("#selected h2").text(sltDishTxt);
    if (menuList.length > 0) {
        $("#selected div.t").html(Mustache.to_html($("#sltTmpl").html(), { dishes: menuList, total: total, vTotal: vtotal }));
    }
    else {
        $("#selected div.t").html("<tr><th>您还未点菜，请点击“返回”点菜</th>");
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

var selectdDish = function () {
    var dishId = parseInt($(this).parent().parent("article").attr('data-id'));
    var isChk = !$(this).hasClass('chk');
    $(this).toggleClass('chk');
    var count = 0;
    if (isChk) {
        count = 1;
        $(this).text('不要了');
    }
    else {
        $(this).text('点一个');
    }
    var sltCount = 0;
    $.each(menus.dishes, function (i, n) {
        if (n.id == dishId) {
            n.count = count;
        }
        if (n.count > 0) {
            sltCount++;
        }
    });
    var sltDishTxt = "已点菜品(" + sltCount + ")";
    $("footer a").eq(1).text(sltDishTxt);
};

document.addEventListener("deviceready", onDeviceReady, false);

/*
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
var sltDishTxt = "已点菜品(" + dishSelected.length + ")";
    
$("footer a").eq(1).text(sltDishTxt);
};
*/
