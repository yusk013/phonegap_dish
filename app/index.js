var pageIndex = 1;
var pageSize = 3;
var entryPath = "/mnt/sdcard/eMenu";
var menus;
var menus2 = {
    corp: {
        name: '忆江南'
    },
    category: [{ id: 1, name: '招牌菜', pageIndex: 1 }, { id: 2, name: '凉菜', pageIndex: 2 }, { id: 3, name: '热菜', pageIndex: 6 }, { id: 4, name: '主食', pageIndex: 13 }, { id: 5, name: '酒水', pageIndex: 14 }, { id: 6, name: '饮料', pageIndex: 15}],
    dishes: [{
        id: 1,
        name: '鱼香肉丝',
        des: '精品川菜',
        price: 25,
        vipPrice: 23,
        img: 'yxrs.jpg'
    }, {
        id: 2,
        name: '宫保鸡丁',
        des: '精品川菜',
        price: 25,
        vipPrice: 23,
        img: 'gbjd.jpg'
    }, {
        id: 3,
        name: '百合虾仁',
        des: '口感香甜',
        price: 50,
        vipPrice: 48,
        img: 'bhxr.jpg'
    }, {
        id: 4,
        name: '四喜丸子',
        des: '精品丸子',
        price: 36,
        vipPrice: 32,
        img: 'sxwz.jpg'
    }, {
        id: 5,
        name: '卤水拼盘',
        des: '精品凉菜',
        price: 35,
        vipPrice: 32,
        img: 'lspp.jpg'
    }, {
        id: 6,
        name: '千层饼',
        des: '主食',
        price: 18,
        vipPrice: 16,
        img: 'qcb.jpg'
    }, {
        id: 7,
        name: '五粮液国宴酒',
        des: '正品五粮液',
        price: 525,
        vipPrice: 515,
        img: 'wlygy.jpg'
    }, {
        id: 8,
        name: '扇贝',
        des: '新鲜海鲜扇贝',
        price: 89,
        vipPrice: 85,
        img: 'sb.jpg'
    }, {
        id: 9,
        name: 'XO酱小爪鸡杂',
        des: 'XO酱小爪鸡杂',
        price: 25,
        vipPrice: 22,
        img: 'xojxzjz.jpg'
    }, {
        id: 10,
        name: '醋泡双生',
        des: '醋泡双生',
        price: 18,
        vipPrice: 16,
        img: 'cpss.jpg'
    }, {
        id: 11,
        name: '风味泡菜',
        des: '风味泡菜',
        price: 18,
        vipPrice: 16,
        img: 'fwpc.jpg'
    }, {
        id: 12,
        name: '高碑店豆腐丝',
        des: '高碑店豆腐丝',
        price: 18,
        vipPrice: 16,
        img: 'gbddfs.jpg'
    }, {
        id: 13,
        name: '花豆腐干',
        des: '花豆腐干',
        price: 20,
        vipPrice: 18,
        img: 'hdfg.jpg'
    }, {
        id: 14,
        name: '金丝银缕',
        des: '金丝银缕',
        price: 25,
        vipPrice: 22,
        img: 'jsyl.jpg'
    }, {
        id: 15,
        name: '精品凉菜',
        des: '精品凉菜',
        price: 20,
        vipPrice: 18,
        img: 'jplc.jpg'
    }, {
        id: 16,
        name: '苦瓜丝',
        des: '苦瓜丝',
        price: 18,
        vipPrice: 16,
        img: 'kgs.jpg'
    }, {
        id: 17,
        name: '南瓜藤',
        des: '南瓜藤',
        price: 26,
        vipPrice: 24,
        img: 'ngt.jpg'
    }, {
        id: 18,
        name: '田园蔬菜',
        des: '田园蔬菜',
        price: 20,
        vipPrice: 18,
        img: 'tysc.jpg'
    }, {
        id: 19,
        name: '小黄瓜',
        des: '小黄瓜',
        price: 26,
        vipPrice: 24,
        img: 'xhg.jpg'
    }, {
        id: 20,
        name: '叉烧雪鱼炒甜豆',
        des: '叉烧雪鱼炒甜豆',
        price: 30,
        vipPrice: 28,
        img: 'csxyctd.jpg'
    }, {
        id: 21,
        name: '铁板烧茄子',
        des: '铁板烧茄子',
        price: 36,
        vipPrice: 32,
        img: 'tbsqz.jpg'
    }, {
        id: 22,
        name: '芙蓉百合',
        des: '芙蓉百合',
        price: 30,
        vipPrice: 28,
        img: 'frbh.jpg'
    }, {
        id: 23,
        name: '香芒大明虾',
        des: '香芒大明虾',
        price: 28,
        vipPrice: 26,
        img: 'xmdmx.jpg'
    }, {
        id: 24,
        name: '香辣虾',
        des: '香辣虾',
        price: 45,
        vipPrice: 42,
        img: 'xlx.jpg'
    }, {
        id: 25,
        name: '京酱肉丝',
        des: '京酱肉丝',
        price: 36,
        vipPrice: 35,
        img: 'jjrs.jpg'
    }, {
        id: 26,
        name: '粗粮焗排骨',
        des: '粗粮焗排骨',
        price: 52,
        vipPrice: 48,
        img: 'cljpg.jpg'
    }, {
        id: 27,
        name: '虫草花白果煮胜瓜',
        des: '虫草花白果煮胜瓜',
        price: 30,
        vipPrice: 28,
        img: 'cchbgzsg.jpg'
    }, {
        id: 28,
        name: '豉油皇咸肉',
        des: '豉油皇咸肉',
        price: 36,
        vipPrice: 32,
        img: 'qyhxr.jpg'
    }, {
        id: 29,
        name: '深海龙虾',
        des: '深海龙虾',
        price: 60,
        vipPrice: 58,
        img: 'shlx.jpg'
    }, {
        id: 30,
        name: '番茄炒蛋',
        des: '番茄炒蛋',
        price: 18,
        vipPrice: 16,
        img: 'fqcd.jpg'
    }, {
        id: 31,
        name: '干烧明虾',
        des: '干烧明虾',
        price: 46,
        vipPrice: 45,
        img: 'gsmx.jpg'
    }, {
        id: 32,
        name: '叉烧肉',
        des: '叉烧肉',
        price: 40,
        vipPrice: 38,
        img: 'csr.jpg'
    }, {
        id: 33,
        name: '白灼菜心',
        des: '白灼菜心',
        price: 25,
        vipPrice: 22,
        img: 'bzcx.jpg'
    }, {
        id: 34,
        name: '蟹黄',
        des: '蟹黄',
        price: 38,
        vipPrice: 35,
        img: 'xh.jpg'
    }, {
        id: 35,
        name: '虫草花炒爬虾',
        des: '虫草花炒爬虾',
        price: 68,
        vipPrice: 60,
        img: 'cchcpx.jpg'
    }, {
        id: 36,
        name: '芝麻球',
        des: '芝麻球',
        price: 20,
        vipPrice: 18,
        img: 'zmq.jpg'
    }, {
        id: 37,
        name: '葱包烩',
        des: '葱包烩',
        price: 20,
        vipPrice: 18,
        img: 'cbh.jpg'
    }, {
        id: 38,
        name: '烤枣馍片',
        des: '烤枣馍片',
        price: 20,
        vipPrice: 18,
        img: 'kzmp.jpg'
    }, {
        id: 39,
        name: '手抓饼',
        des: '手抓饼',
        price: 20,
        vipPrice: 18,
        img: 'szb.jpg'
    }, {
        id: 40,
        name: '芒果汁',
        des: '芒果汁',
        price: 10,
        vipPrice: 9,
        img: 'mgz.jpg'
    }, {
        id: 41,
        name: '猕猴桃汁',
        des: '猕猴桃汁',
        price: 10,
        vipPrice: 9,
        img: 'mhtz.jpg'
    }, {
        id: 42,
        name: '酸梅汁',
        des: '酸梅汁',
        price: 10,
        vipPrice: 9,
        img: 'smz.jpg'
    }, {
        id: 43,
        name: '珍珠奶茶',
        des: '珍珠奶茶',
        price: 10,
        vipPrice: 9,
        img: 'zznc.jpg'
    }, {
        id: 44,
        name: '白酒S2',
        des: '白酒S2',
        price: 69,
        vipPrice: 65,
        img: 'bjs2.jpg'
    }, {
        id: 45,
        name: '',
        des: '',
        price: 0,
        vipPrice: 0,
        img: '.jpg'
    }],
    pages: [
    { layout: 1, dishes: [23, 5, 25] },
    { layout: 1, dishes: [5, 9, 10] },
    { layout: 1, dishes: [11, 12, 13] },
    { layout: 1, dishes: [14, 15, 16] },
     { layout: 1, dishes: [17, 18, 19] },
     { layout: 1, dishes: [1, 2, 3] },
     { layout: 1, dishes: [4, 8, 20] },
     { layout: 1, dishes: [21, 22, 23] },
     { layout: 1, dishes: [24, 25, 26] },
     { layout: 1, dishes: [27, 28, 29] },
     { layout: 1, dishes: [30, 31, 32] },
     { layout: 1, dishes: [33, 34, 35] },
     { layout: 1, dishes: [36, 37, 38] },
     { layout: 1, dishes: [39, 7, 44] },
     { layout: 1, dishes: [41, 42, 43] },
     { layout: 1, dishes: [40]}]
};
//var dishSelected = [];

/*
var cateTmpl = "<ul>{{#category}}<li><a cid='{{id}}'>{{name}}</a></li>{{/category}}</ul>";
var dishTmpl = "{{#dishes}}<article data-id='{{id}}'><header><h2>{{name}}</h2></header><section class='dish' style='background-image:url(img/{{img}})'></section><section class='des'>{{des}}</section><section class='price' data-p='{{price}}' data-vp='{{vipPrice}}'><ul><li>{{price}}</li><li>{{vipPrice}}</li></ul></section><section class='slt'><a class='{{#count}}chk{{/count}}'>{{#count}}不要了{{/count}}{{^count}}点一个{{/count}}</a><!--<a class='sub'>-</a><input type='text' readonly value='{{count}}'/><a class='add'>+</a>--></section></article>{{/dishes}}";
var sltTmpl = "<table><thead><tr><th>菜名</th><th>价格(元)</th><th>数量</th><th>小计(元)</th></tr></thead><tbody>{{#dishes}}<tr><td>{{name}}</td><td>{{price}}/{{vipPrice}}</td><td>{{count}}</td><td>{{price}}/{{vipPrice}}</td></tr>{{/dishes}}</tbody></table><p>总价：{{total}}元</p>"
*/

var onDeviceReady = function () {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory("eMenu", null, function (dirEntry) {
            entryPath = dirEntry.fullPath;
            dirEntry.getFile("dishes.json", null, function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                        eval("menus = " + evt.target.result);
                        initUI();
                    };
                    reader.readAsText(file);
                }, fail);
            }, fail);
        }, fail);
    }, fail);
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("searchbutton", onSearchKeyDown, false);
};

var fail = function (error) {
    console.log(error.code);
    //alert("error:" + error.code);
    showInitErrMsg("初始化失败(" + error.code + "), 请与厂家联系.")
};

var showInitErrMsg = function (msg) {
    $("#cover a").text(msg);
}

var onBackKeyDown = function () {
    document.removeEventListener("backbutton", onBackKeyDown, false); //注销返回键
    //3秒后重新注册
    var intervalID = window.setInterval(function () {
        window.clearInterval(intervalID);
        document.addEventListener("backbutton", onBackKeyDown, false); //返回键
    }, 3000);
}

var onMenuKeyDown = function () {
    bindSelectedMenu();
}

var onSearchKeyDown = function () {

}

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
    /*
    var cid = parseInt(this.getAttribute("cid"));
    for (var i in menus.pages) {
    if (menus.pages[i].cateId == cid) {
    pageIndex = parseInt(i) + 1;
    break;
    }
    }
    */
    var pi = parseInt(this.getAttribute("data-pi"));
    pageIndex = pi;
    bindDishes();
};

var initUI = function () {
    if (menus == undefined) {
        menus = menus2;
    }
    $("header>h1").text(menus.corp.name);
    showInitErrMsg("初始化成功, 载入菜品.");
    $("nav").html(Mustache.to_html($("#cateTmpl").html(), menus));
    var dishesUI = Mustache.to_html($("#dishTmpl").html(), { dishes: menus.dishes });
    $("section").html(dishesUI.replace(/\[\[imgFolder\]\]/g, "file://" + entryPath));
    bindDishes();
    bindEvent();
    $("#cover").hide();
}

var bindDishes = function () {
    var page = menus.pages[pageIndex - 1];
    if (!page) return;
    $("section>article").removeClass();
    $.each(page.dishes, function (i) {
        $("section>article[data-id='" + page.dishes[i] + "']").addClass("l_" + page.layout + "_" + i);
    });
    var cateid = 0;
    $.each(menus.category, function (i, n) {
        if (pageIndex >= n.pageIndex) {
            cateid = n.id;
        } else {
            return false;
        }
    });
    $("nav li").removeClass();
    $("nav li>a[cid ='" + cateid + "']").parent().addClass('on');
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
