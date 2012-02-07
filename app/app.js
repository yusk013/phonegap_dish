var pageIndex = 1;
var entryPath = '/mnt/sdcard/eMenu';
var remoteUrl = 'http://218.206.201.27:8088/download/10001/';// 'http://35918.cn/dishes/demo/';
var needUpdate = false;
var pages = 0;
var mainScroll;
var selectedDishes = "";
var localMenus = { v : 0 };

var isLoading = true;

var onDeviceReady = function() {
	var onBackKeyDown = function() {
		if (isLoading)
			return;
		document.removeEventListener("backbutton", onBackKeyDown, false); // 注销返回键
		// 3秒后重新注册
		var intervalID = window.setInterval(function() {
			window.clearInterval(intervalID);
			document.addEventListener("backbutton", onBackKeyDown, false); // 返回键
		}, 3000);
	};

	var onMenuKeyDown = function() {
		if (isLoading)
			return;
		bindSelectedMenu();
	};

	var onSearchKeyDown = function() {
		$("#mastermode").toggle();
	};
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);
	document.addEventListener("searchbutton", onSearchKeyDown, false);
	initProfile();
};

var onLoadStopped = function() {
	isLoading = false;
	$("#cover .progressBar").removeClass("progressBar");
};

var onResetData = function() {
	if (confirm('清除本地数据后，您会在下次启动电子菜单时从服务器获得最新的数据，是否继续？')) {
		window.localStorage.removeItem('dishes');
		$('#mastermode').hide();
	}
};

var initProfile = function() {
	var onLocalProfileError = function(e) {
		console.log('get sdcard profile error, code is ' + e.code);
		switch (e.code) {
		case FileError.NOT_FOUND_ERR:// this may be used in
			// sdcard/dishes.json.
			showCoverMsg("初次使用？\r\n准备通过网络初始化，请稍候。(" + e.code + ")");
			updateProfile();
			break;
		default:
			showCoverMsg("文件系统错误(" + e.code + ")，请与厂家联系。");
			onLoadStopped();// isLoading = false;
		}
	};

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
			function(fileSystem) {
				fileSystem.root.getDirectory("eMenu", {
					create : true
				}, function(dirEntry) {
					entryPath = dirEntry.fullPath;
					/*
					 * process mode 1: profile in sdcard
					 * 
					 * dirEntry.getFile("dishes.json", null, function(fileEntry) {
					 * fileEntry.file(function(file) { var reader = new
					 * FileReader(); reader.onloadend = function(evt) {
					 * eval("localMenus = " + evt.target.result);
					 * if(needUpdate){ updateProfile(); } else{ initUI(); } };
					 * reader.readAsText(file); }, onLocalProfileError); },
					 * onLocalProfileError);
					 */
					/*
					 * process mode 2: profile in localstorage
					 */
					var lsMenus = window.localStorage.getItem("dishes");
					eval("localMenus = " + lsMenus);
					// console.log("get local profile. data is " +
					// localMenus.v);
					if ((!localMenus) || (needUpdate)) {
						showCoverMsg("初次使用？\r\n准备通过网络初始化，请稍候。");
						updateProfile();
					} else {
						console.log("load local profile success.");// data is "
						// +
						// JSON.stringify(localMenus));
						initUI();
					}
				}, onLocalProfileError);
			}, onLocalProfileError);
};

var updateProfile = function() {
	var version;
	try {
		version = localMenus.v;
	} catch (e) {
		version = 0;
		console.log("get local profile version error(" + e + ").");
	}
	console.log("prepare to get profile from " + remoteUrl);
	$.ajax({
		type : 'GET',
		url : remoteUrl + 'dishes2.txt',
		data : {
			v : version
		},
		dataType : 'text',
		async : true,
		success : function(data) {

			var saveNewProfile = function() {
				window.localStorage.setItem("dishes", JSON
						.stringify(localMenus));
				console.log("save local profile successful.");
			};

			// console.log('got data: ' + data);
			eval("var remoteMenus = " + data);
			if (remoteMenus.v != version) {
				// compare image files
				var i = 0, dishes = remoteMenus.events, f = dishes.length;
				console.log(f + " image file(s) download needed, v = "
						+ remoteMenus.v);

				var onImgDownloadComplate = function() {
					showCoverMsg("下载完成，正在完成配置，请稍候。");
					localMenus = remoteMenus;
					saveNewProfile();
					initUI();
				};
				var onImgDownloadError = function(e) {
					console.log('download image error (' + e.code + ').');
					isDownloadEnded();
				};
				var isDownloadEnded = function() {
					i++;
					// console.log("prepare download " + i + " of " + f + ".");
					if (i >= f) {
						onImgDownloadComplate();
					} else {
						imgDownload();
					}
				};
				var imgDownload = function() {
					var ft = new FileTransfer();
					var d = dishes[i];
					var fileName = d.url;
					var dlPath = entryPath + "/" + fileName;
					showCoverMsg("开始下载菜品照片，请稍候……\r\n(" + (i + 1) + "/" + f
							+ ")");
					// console.log("downloading crap to " + dlPath);
					ft.download(remoteUrl + escape(fileName), dlPath, function(
							e) {
						$('#cover .previewImg').css("background-image",
								'url(' + e.fullPath + ')');
						// console.log("download \"" + dlPath + "\"
						// successful.");
						isDownloadEnded();
					}, onImgDownloadError);
				};

				imgDownload();
			} else {
				console.log("no more new image need download. initUI now.");
				initUI();
			}
		},
		error : function(xhr, type) {
			// alert(xhr);
			showCoverMsg('下载配置文件错误，无法完成初始化，请与厂家联系。(' + type + ')');
			console.log('got an ' + type + ', the data is :' + xhr.readyState);
			onLoadStopped();
		}
	});
};

var initUI = function() {
	var localURI = function(str) {
		return str.replace(/\[\[imgFolder\]\]/g, "file://" + entryPath);
	};
	// {{#each_with_index records}}
	// <li class="legend_item{{index}}"><span></span>{{Name}}</li>
	// {{/each_with_index}}

	Handlebars.registerHelper("each_with_index", function(array, fn) {
		var buffer = "";
		for ( var i = 0, j = array.length; i < j; i++) {
			var item = array[i];
			// stick an index property onto the item, starting with 1, may make
			// configurable later
			item.index = i + 1;
			// show the inside of the block
			buffer += fn(item);
		}
		// return the finished buffer
		return buffer;
	});

	$("header>h1").text(localMenus.corp.name);
	var tmpl = Handlebars.compile($("#cateTmpl").html());
	$("nav").html(tmpl(localMenus));

	var localDishes = localMenus.dishes;
	pages = localDishes.length;

	showCoverMsg("初始化成功, 载入菜品.");

	var mainViewWrap = $("body>section");

	var mainViewWrapHeight = mainViewWrap.height();
	var initProperty = {
		wrapHeight : mainViewWrapHeight,
		scrollHeight : mainViewWrapHeight * pages
	};
	tmpl = Handlebars.compile($("#initStyleTmpl").html());
	$("#initStyle").html(tmpl(initProperty));

	tmpl = Handlebars.compile(localURI($("#dishTmpl").html()));
	var dishesUI = tmpl({
		dishes : localDishes
	});
	//console.log(dishesUI);
	mainViewWrap.html(dishesUI);

	setTimeout(function() {
		mainScroll = new iScroll('main', {
			snap : 'div.page',
			momentum : false,
			hScrollbar : false,
			vScrollbar : false
		});
	}, 100);

	// bind promotions
	var promo = localMenus.promotion;
	var promotions = [];
	$.each(promo, function(i, p) {
		var promoItem = $.extend(localDishes[p[0] - 1].items[p[1] - 1], {"p": p[0], "i": p[1]});
		promotions.push(promoItem);
	});
	tmpl = Handlebars.compile(localURI($("#promoTmpl").html()));
	var promoUI = tmpl({
		dishes : promotions
	});
	// console.log(promoUI);
	$("#promotion").html(promoUI);
	// bindDishes();
	bindEvent();
	$("#cover").hide();
	onLoadStopped();// isLoading = false;
};

var showCoverMsg = function(msg) {
	$("#cover a").text(msg);
};

/*
 * var bindDishes = function() { var page = localMenus.pages[pageIndex - 1]; if
 * (!page) return; $("article.show section.dish").removeClass("cover");
 * $("section>article").removeClass(); $.each(page.dishes, function(i) {
 * $("section>article[data-id='" + page.dishes[i] + "']").addClass( "l_" +
 * page.layout + "_" + i + " show"); }); setTimeout(function() { $("article.show
 * section.dish").addClass("cover"); }, 200); var cateid = 0;
 * $.each(localMenus.category, function(i, n) { if (pageIndex >= n.pageIndex) {
 * cateid = n.id; } else { return false; } }); $("nav li").removeClass(); $("nav
 * li>a[cid ='" + cateid + "']").parent().addClass('on'); };
 */

var bindEvent = function() {
	$("#promoBtn").click(function() {
		$("#promotion a").each(function(){
			thisPi = "[" + $(this).attr("data-pi") + "]";
			if(selectedDishes.indexOf(thisPi) == -1){
				$(this).removeClass("chk");
			}else{
				$(this).addClass("chk");
			}
		});
		$("#selected").removeClass();
		$("#promotion").toggleClass("front");
	});
	$("#selectBtn").click(function(){
		var listStrLength = selectedDishes.length;
		var currentDishes = [];
		if(listStrLength > 3){
			var dishList = selectedDishes.substring(1, listStrLength -1).split("][");
			$.each(dishList, function(i, pi){
				var dishPos = pi.split("/");
				var dish = $.extend(localMenus.dishes[dishPos[0] - 1].items[dishPos[1] - 1], {"p": dishPos[0], "i": dishPos[1]});
				currentDishes.push(dish);
			});
			var tmpl = Handlebars.compile($("#sltTmpl").html());
			$("#selected").html(tmpl({dishes: currentDishes}));
		}else{
			
		}
		$("#promotion").removeClass();
		$("#selected").toggleClass("front");
	});
	$("nav li a").bind("click", function() {
		$("aside.front").removeClass();
		var pi = parseInt(this.getAttribute("data-pi"));
		mainScroll.scrollToPage(0, pi - 1, 500);
	});
	$("#main section.slt a").click(function() {
		var i = parseInt($(this).closest("article").attr("data-index"));
		var p = parseInt($(this).closest("div.page").attr("data-page"));
		var dishIndex = p + "/" + i;
		if ($(this).hasClass("chk")) {
			$(this).removeClass("chk");
			selectedDishes = selectedDishes.replace("[" + dishIndex + "]", "");
		} else {
			selectedDishes += "[" + dishIndex + "]";
			$(this).addClass("chk");
		}
		console.log("dishes: " + selectedDishes);
		$("#selectBtn").html(selectedDishes.split("/").length - 1);
	});
	$("#promotion section.slt a").click(function(){
		var piData = $(this).attr("data-pi");
		var pi = piData.split("/");
		$("#main div.page[data-page='" + pi[0] + "'] article[data-index='" + pi[1] + "'] a").trigger('click');
		$(this).toggleClass("chk");
	});
};
/*
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
*/
document.addEventListener("deviceready", onDeviceReady, false);