var pageIndex = 1;
var pageSize = 3;
var entryPath = '/mnt/sdcard/eMenu';
var remoteUrl = 'http://218.206.201.27:8088/download/10001/';//'http://35918.cn/dishes/demo/';
var needUpdate = false;
var localMenus = {v:0};
var isLoading = true;

var onDeviceReady = function() {
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);
	document.addEventListener("searchbutton", onSearchKeyDown, false);
	initProfile();
};

var onBackKeyDown = function() {
	if(isLoading)return;
	document.removeEventListener("backbutton", onBackKeyDown, false); // 注销返回键
	// 3秒后重新注册
	var intervalID = window.setInterval(function() {
		window.clearInterval(intervalID);
		document.addEventListener("backbutton", onBackKeyDown, false); // 返回键
	}, 3000);
};

var onMenuKeyDown = function() {
	if(isLoading)return;
	bindSelectedMenu();
};

var onSearchKeyDown = function() {
};

var initProfile = function() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,	function(fileSystem) {
		fileSystem.root.getDirectory("eMenu", {create: true}, function(dirEntry) {
			entryPath = dirEntry.fullPath;
			/*
			 * process mode 1: profile in sdcard
			 * 
			dirEntry.getFile("dishes.json", null, function(fileEntry) {
				fileEntry.file(function(file) {
					var reader = new FileReader();
					reader.onloadend = function(evt) {
						eval("localMenus = " + evt.target.result);
						if(needUpdate){
							updateProfile();
						}
						else{
							initUI();
						}
					};
					reader.readAsText(file);
				}, onLocalProfileError);
			}, onLocalProfileError);
			*/
			/*
			 * process mode 2: profile in localstorage
			 */
			var lsMenus = window.localStorage.getItem("dishes");
			eval("localMenus = " + lsMenus);
			//console.log("get local profile. data is " + localMenus.v);
			if((!localMenus.v)||(needUpdate)){
				showCoverMsg("初次使用？\r\n准备通过网络初始化，请稍候。");
				updateProfile();
			}
			else{
				console.log("load local profile success.");// data is " + JSON.stringify(localMenus));
				initUI();
			}
		}, onLocalProfileError);
	}, onLocalProfileError);
};

var onLocalProfileError = function(e){
	console.log('get sdcard profile error, code is ' + e.code);
	switch(e.code){
	case FileError.NOT_FOUND_ERR://this may be used in sdcard/dishes.json.
		showCoverMsg("初次使用？\r\n准备通过网络初始化，请稍候。(" + e.code + ")");
		updateProfile();
		break;
	default:
		showCoverMsg("文件系统错误(" + e.code + ")，请与厂家联系。");
		isLoading = false;
	}
};

var updateProfile = function(){
	var version = localMenus.v?localMenus.v:0;
	console.log("prepare to get profile from " + remoteUrl);
	$.ajax({
		type:'GET',
		url:remoteUrl + 'dishes.txt',
		data:{v:version},
		dataType:'text',
		async:true,
		success:function(data){
			//console.log('got data: ' + data);
			eval("var remoteMenus = " + data);
			if(remoteMenus.v != version){
				//compare image files
				//download needed
				$.each(remoteMenus.dishes, function(i, d){
					var ft = new FileTransfer();
					var fileName = d.img;
					var dlPath = entryPath + "/" + fileName;
					showCoverMsg("开始下载\"" + d.name + "\"……");
					//console.log("downloading crap to " + dlPath);
					ft.download(remoteUrl + escape(fileName), dlPath,function(e){
						//renderImg(e.fullPath);
						//console.log("download successful.");
					},onImgDownloadError);
				});
				showCoverMsg("下载完成，正在完成配置，请稍候。");
				localMenus = remoteMenus;
				saveNewProfile();
				initUI();
			}
		},
		error:function(xhr, type){
			//alert(xhr);
			showCoverMsg('下载配置文件错误，无法完成初始化，请与厂家联系。(' + type + ')');
			isLoading = false;
			console.log('got an ' + type + ', the data is :' + xhr.readyState);
		}
	});
};

var saveNewProfile = function(){
	window.localStorage.setItem("dishes", JSON.stringify(localMenus));
	console.log("save local profile successful.");
};

var onImgDownloadError = function(e){
	console.log('download image error (' + e.code + ').');
};

var initUI = function() {
	$("header>h1").text(localMenus.corp.name);
	showCoverMsg("初始化成功, 载入菜品.");
	$("nav").html(Mustache.to_html($("#cateTmpl").html(), localMenus));
	var dishesUI = Mustache.to_html($("#dishTmpl").html(), {
		dishes : localMenus.dishes
	});
	$("section").html(
		dishesUI.replace(/\[\[imgFolder\]\]/g, "file://" + entryPath));
	bindDishes();
	bindEvent();
	$("#cover").hide();
	isLoading = false;
};

var showCoverMsg = function(msg) {
	$("#cover a").text(msg);
};

var bindDishes = function() {
	var page = localMenus.pages[pageIndex - 1];
	if (!page)
		return;
	$("section>article").removeClass();
	$.each(page.dishes, function(i) {
		$("section>article[data-id='" + page.dishes[i] + "']").addClass(
				"l_" + page.layout + "_" + i);
	});
	var cateid = 0;
	$.each(localMenus.category, function(i, n) {
		if (pageIndex >= n.pageIndex) {
			cateid = n.id;
		} else {
			return false;
		}
	});
	$("nav li").removeClass();
	$("nav li>a[cid ='" + cateid + "']").parent().addClass('on');
};

var bindEvent = function() {
	$("footer a:nth-child(1)").bind("click", function() {
		if (pageIndex > 1)
			pageIndex--;
		bindDishes();
	});
	$("footer a:nth-child(2)").bind("click", bindSelectedMenu);
	$("footer a:nth-child(3)").bind("click", function() {
		if (localMenus.pages.length > pageIndex)
			pageIndex++;
		bindDishes();
	});
	$("nav li a").bind("click", bindCategoryDishes);
	;

	$("section.slt a").live('click', selectdDish);
	// $("section.slt a.add").live('click', addDish);
	// $("section.slt a.sub").live('click', subDish);

	$("#selected a.close").click(menuClose);
};

var bindCategoryDishes = function() {
	var pi = parseInt(this.getAttribute("data-pi"));
	pageIndex = pi;
	bindDishes();
};


var bindSelectedMenu = function() {
	var menuList = [];
	var total = 0;
	var vtotal = 0;
	$.each(localMenus.dishes, function(i, n) {
		if (n.count > 0) {
			menuList.push(n);
			total += n.price;
			vtotal += n.vipPrice;
		}
	});
	var sltDishTxt = "已点菜品(" + menuList.length + ")";
	$("#selected h2").text(sltDishTxt);
	if (menuList.length > 0) {
		$("#selected div.t").html(Mustache.to_html($("#sltTmpl").html(), {
			dishes : menuList,
			total : total,
			vTotal : vtotal
		}));
	} else {
		$("#selected div.t").html("<tr><th>您还未点菜，请点击“返回”点菜</th>");
	}
	menuShow();
};
var menuShow = function() {
	$("#selected").css('top', '100%').show();
	$("#selected").animate({
		'top' : 0
	}, 1000);
};
var menuClose = function() {
	$("#selected").hide();
};

var selectdDish = function() {
	var dishId = parseInt($(this).parent().parent("article").attr('data-id'));
	var isChk = !$(this).hasClass('chk');
	$(this).toggleClass('chk');
	var count = 0;
	if (isChk) {
		count = 1;
		$(this).text('不要了');
	} else {
		$(this).text('点一个');
	}
	var sltCount = 0;
	$.each(localMenus.dishes, function(i, n) {
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