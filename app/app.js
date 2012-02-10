var entryPath = '/mnt/sdcard/eMenu';
var remoteUrl = 'http://218.206.201.27:8088/download/10001/';// 'http://35918.cn/dishes/demo/';
var needUpdate = false;
var mainScroll;
var selectedDishes = "";
var localVersion = 0;
var localMenus = { v : localVersion };
var corpName = "Womobo Inc.";
var miniVersion = 1328667835039;
var viewIndex = 0;

var isLoading = true;

var onDeviceReady = function() {
	var onBackKeyDown = function() {
		if (isLoading)
			return;
		switch (viewIndex) {
		case 1:
			$("#promoBtn").trigger("tap");
			break;
		case 2:
			$("#selectBtn").trigger("tap");
			break;
		default:
			document.removeEventListener("backbutton", onBackKeyDown, false); // 注销返回键
			// 3秒后重新注册
			var intervalID = window.setInterval(function() {
				window.clearInterval(intervalID);
				document.addEventListener("backbutton", onBackKeyDown, false); // 返回键
			}, 3000);
		}
	};

	var onMenuKeyDown = function() {
		if (isLoading)
			return;
		// bindSelectedMenu();
		$("#selectBtn").trigger("tap");
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

					try {
						localVersion = localMenus.v;
					} catch (e) {
						localVersion = 0;
						console.log("get local profile version error(" + e + ").");
					}

					if ((localVersion < miniVersion) || (!localMenus) || (needUpdate)) {
						showCoverMsg("必须联网获取最新数据方能使用。<br>准备通过网络初始化，请稍候……");
						updateProfile();
					} else {
						console.log("load local profile success.");
						initUI();
					}
				}, onLocalProfileError);
			}, onLocalProfileError);
};

var updateProfile = function() {
	console.log("prepare to get profile from " + remoteUrl);
	$.ajax({
		type : 'GET',
		url : remoteUrl + 'dishes2.txt',
		data : {
			v : localVersion
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
			if (remoteMenus.v != localVersion) {
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
					showCoverMsg("开始下载菜品照片，请稍候……<br>(" + (i + 1) + "/" + f
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
	corpName = localMenus.corp.name;
	setTitle();
	var tmpl = Handlebars.compile($("#cateTmpl").html());
	$("nav").html(tmpl(localMenus));

	var localDishes = localMenus.dishes;
	var pages = localDishes.length;

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
	// console.log(dishesUI);
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
		var promoItem = $.extend(localDishes[p[0] - 1].items[p[1] - 1], {
			"p" : p[0],
			"i" : p[1]
		});
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
	$("#cover a").html(msg);
};

var setTitle = function() {
	var title = corpName;
	switch (viewIndex) {
	case 1:
		title = "今日特选";
		break;
	case 2:
		title = "已点菜品";
		break;
	default:
		title = corpName;
	}
	$("header>h1").text(title);
};

var bindEvent = function() {
	$("#promoBtn").tap(function() {
		$("#promotion a").each(function() {
			thisPi = "[" + $(this).attr("data-pi") + "]";
			if (selectedDishes.indexOf(thisPi) == -1) {
				$(this).removeClass("chk");
			} else {
				$(this).addClass("chk");
			}
		});
		$("#selected").removeClass();
		console.log("show promotion");
		$("#promotion").toggleClass("front");
		viewIndex = $("#promotion").hasClass("front") ? 1 : 0;
		setTitle();
	});

	$("#selectBtn").click(function() {
		var noOrderTips = "您还未点菜，选择菜品类别开始点菜，或者看看我们的“今日特选”。";
		var listStrLength = selectedDishes.length;
		var currentDishes = [];
		if (listStrLength > 3) {
			var dishList = selectedDishes.substring(0, listStrLength - 1).split(",");
			$.each(dishList, function(i, pi) {
				var dishPos = pi.split("/");
				if(dishPos.length > 0){
					var p = dishPos[0];
					var i = dishPos[1];
					var d = localMenus.dishes[dishPos[0] - 1].items[dishPos[1] - 1];
					var t = dishPos[2];
					var tp = d.price * t;
					var tvp = d.vipPrice * t;
					var dish = $.extend(d,{"p" : p,"i" : i, "t" : t, "tp": tp, "tvp": tvp});
					currentDishes.push(dish);
				}
			});
			var tmpl = Handlebars.compile($("#sltTmpl").html());
			$("#selected").html(tmpl({
				dishes : currentDishes
			}));

			$("#selected table a").click(function() {
					var piData = $(this).attr("data-pi");
					var pi = piData.split("/");
					$("#main div.page[data-page='" + pi[0] + "'] article[data-index='" + pi[1]+ "'] a").trigger('click');
					$(this).closest("tr").hide();
					if (selectedDishes.length == 0) {
						$("#selected").text(noOrderTips);
					}
				});
		} else {
			$("#selected").text(noOrderTips);
		}
		
		console.log("show order");
		$("#promotion").removeClass();
		$("#selected").toggleClass("front");

		viewIndex = $("#selected").hasClass("front") ? 2 : 0;
		setTitle();
	});

	$("nav li a").bind("click", function() {
		$("aside.front").removeClass();
		var pi = parseInt(this.getAttribute("data-pi"));
		mainScroll.scrollToPage(0, pi - 1, 500);
		viewIndex = 0;
		setTitle();
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
		$("#selectBtn span").html(selectedDishes.split("/").length - 1);
	});
	$("#main section.ob a.o").click(function(){
		$(this).closest("div").addClass("chk");
		var pos = getPos($(this));
		//show big count!;
		orderDishes(pos, 1);
	});
	$("#main section.ob a.d").click(function(){
		$(this).closest("div").removeClass("chk");
		var pos = getPos($(this));
		orderDishes(pos, 0);
	});
	$("#main section.ob a.p").click(function(){
		var pos = getPos($(this));
		//show big count!;
		orderDishes(pos, 1);
	});
	$("#promotion section.slt a").click(
			function() {
				var piData = $(this).attr("data-pi");
				var pi = piData.split("/");
				$(
						"#main div.page[data-page='" + pi[0]
								+ "'] article[data-index='" + pi[1] + "'] a")
						.trigger('click');
				$(this).toggleClass("chk");
			});
};
var getPos = function(el){
	var i = parseInt($(el).closest("article").attr("data-index"));
	var p = parseInt($(el).closest("div.page").attr("data-page"));
	var dishIndex = p + "/" + i;
	return dishIndex;
};
var orderDishes = function(pos, method){
	var exp = pos + "/(.),?";
    var reg = new RegExp(exp, "g");
    var res = reg.exec(selectedDishes);
    var total =  (res == null) ? 0 : parseInt(res[1]);
    total += method;
    if((total < 0) || (method == 0)){
    	total = 0;
    }
    //console.log(pos + " now order " + total);
	switch(total){
	case 0:
		selectedDishes = selectedDishes.replace(reg, "");
		break;
	case 1:
		selectedDishes += pos + "/1,";
		break;
	default:
		selectedDishes = selectedDishes.replace(reg, pos + "/" + total + ",");
	}
	//console.log("Order list now is " + selectedDishes);
	return total;
};

document.addEventListener("deviceready", onDeviceReady, false);