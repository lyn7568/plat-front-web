
$(document).ready(function() {
	$(".unlogin").show();
	$(".onlogin").hide();

	var footerHeight = $("footer").outerHeight(true);
	$('#container').css("padding-bottom", footerHeight + "px");
	$(".footer_tools").css("bottom", (footerHeight+10) + "px");
	$(window).resize(function() {//窗口大小变更事件
		footerHeight = $("footer").outerHeight(true);
		$('#container').css("padding-bottom", footerHeight + "px");
	});
	//底部企业入驻
	var orgid = $.cookie('orgId');
	$("#cmpSet2").on("click", function() {
		if(orgid && orgid != "null" && orgid != null) {
			location.href = "cmp-portal/cmp-needList.html"
		} else {
			location.href = "cmp-portal/cmp-settled-reg.html"
		}
	})
	$("#cmpSet3").on("click", function() {
		if(orgid && orgid != "null" && orgid != null) {
			location.href = "/cmp-portal/cmp-needList.html"
		} else {
			location.href = "/cmp-portal/cmp-settled-reg.html"
		}
	})
	
	//搜索框跳转页面
	$("#search").on("click", function() {
		var searchContent = $.trim($("#searchContent").val());
		if(searchContent) {
			wlog("kw", searchContent)
			setTimeout(function(){location.href = "searchNew.html?searchContent=" + encodeURI(searchContent)},300);
		}
	});
	//enter绑定时间
	$("#searchContent").keydown(function(e) {
		if(e.which == 13) {
			var searchContent = $.trim($("#searchContent").val());
			if(searchContent)
			location.href = "searchNew.html?searchContent=" + encodeURI(searchContent);
		}
	
	})
	$("#hsearchContent").keydown(function(e) {
		if(e.which == 13) {
			var searchContent = $.trim($("#hsearchContent").val());
			if(!searchContent) {
				return;
			}
			if($(this).siblings()[0].id=="searchh") {
				location.href = "/searchNew.html?searchContent=" + encodeURI(searchContent);
				return;
			}
			location.href = "searchNew.html?searchContent=" + encodeURI(searchContent);
		}
	})
	
	$("#hsearch").on("click", function() {
		var searchContent = $.trim($("#hsearchContent").val());
		if(searchContent) {
			wlog("kw", searchContent)
			setTimeout(function(){
				location.href = "searchNew.html?searchContent=" + encodeURI(searchContent);
			},300)
		}
	});
	$("#searchh").on("click", function() {
		var searchContent = $.trim($("#hsearchContent").val());
		if(searchContent)
		setTimeout(function(){
			location.href = "/searchNew.html?searchContent=" + encodeURI(searchContent);
		},300)
		
	});
	
	/*向下滚动时，header背景变半透明*/
	$(document).scroll(function() {
		var top = $(document).scrollTop();
	
		if(top == 0) {
			$(".navheader").removeClass("navhdown");
		} else {
			$(".navheader").addClass("navhdown");
		}
	
		if(top >= 300) {
			$(".content-left").css({
				"position": "fixed",
				"top": "80px"
			})
		} else {
			$(".content-left").css({
				"position": "static"
			})
		}
	
	});
	/*选择省份*/
	$(document).on("click", "#Province li a", function() {
		var aVal = $(this).text();
		$(this).parent().parent().parent().find('.mr_show').text(aVal);
		$(this).parent().parent().parent().find('input[name=cho_Province]').val(aVal);
	
		if($("#oprovince").text() == "请选择省/直辖市") {
			$("#oprovince").removeClass("mr_select");
			$("#ocity").removeClass("mr_select");
		} else {
			$("#oprovince").addClass("mr_select");
			$("#ocity").removeClass("mr_select");
		}
	});
	/*选择城市填充js	*/
	$(document).on("click", "#City li a", function() {
		var aVal = $(this).text();
		$(this).parent().parent().parent().find('.mr_show').text(aVal);
		$(this).parent().parent().parent().find('input[name=cho_City]').val(aVal);
		if($("#ocity").text() == "请选择城市") {
			$("#ocity").removeClass("mr_select");
		} else {
			$("#ocity").addClass("mr_select");
		}
	});
	/*多行文本框样式(带有限制数字)模拟focus效果*/
	$(".msgContbox textarea").focus(function() {
		$(this).parent().css("border-color", "#ff9900");
	}).blur(function() {
		$(this).parent().css("border-color", "#E5E5E5");
	})
});

var userid;

function exit() {
	$.cookie('userid', null);
	$.cookie('userAuth', null);
	$.cookie('userEmail', null);
	$.cookie('userMobilePhone', null);
	$.cookie('userName', null);
	$.cookie('userType', null);
	location.href = "index.html"
}
function exitStaticize() {
	$.cookie('userid', null,{ path: '/' });
	$.cookie('userAuth', null,{ path: '/' });
	$.cookie('userEmail', null,{ path: '/' });
	$.cookie('userMobilePhone', null,{ path: '/' });
	$.cookie('userName', null,{ path: '/' });
	$.cookie('userType', null,{ path: '/' });
	location.href = "/index.html"
}
function valUser() {
	var userid = $.cookie('userid');
	var userAuth = $.cookie('userAuth');
	if(userid == undefined || userid.length == 0 || userid == "null" || userAuth == false) {
		location.href = "login.html";
	}
}

function loginStatus() {
	userid = $.cookie('userid');
	userAuth = $.cookie('userAuth');
	authentication = $.cookie('authentication');
	if(userid && userid != "null" && userid != null) {
		if(userAuth == "false" && authentication == "null") {
			location.href = "loginInviteFirst.html";
		}
		if(userAuth == "true" && authentication == "null") {
			location.href = "fillinfo-select.html";
		}
		if(userAuth == "true" && authentication != "null") {
			$(".onlogin").show();
			$(".unlogin").hide();
			$(".portrait-p").attr("src", "/images/head/" + userid + "_m.jpg");
			$(".portrait-p").load(function() { //判断图片是否加载，加载不成功默认有默认的图像									
				})
				.error(function() {
					$(".portrait-p").attr("src", "/images/default-photo.jpg");
				});
			unReadedCount(userid);
			unInformCount(userid)
		}
		$(".portrait-p").on("click",function(){
			location.href="userInforShow.html?professorId="+userid;
		})
		$(".onlogin").on("click",".goMyInf",function(){
			$(this).attr("href","userInforShow.html?professorId="+userid)
		})
	} else {
		$(".unlogin").show();
		$(".onlogin").hide();
	}
}
function loginYesOrNo() {
	userid = $.cookie('userid');
	userAuth = $.cookie('userAuth');
	authentication = $.cookie('authentication');
	if(userid && userid != "null" && userid != null) {
		if(userAuth == "false" && authentication == "null") {
			location.href = "/loginInviteFirst.html";
		}
		if(userAuth == "true" && authentication == "null") {
			location.href = "/fillinfo-select.html";
		}
		if(userAuth == "true" && authentication != "null") {
			$(".onlogin").show();
			$(".unlogin").hide();
			$(".portrait-p").attr("src", "/images/head/" + userid + "_m.jpg");
			$(".portrait-p").load(function() { //判断图片是否加载，加载不成功默认有默认的图像									
				})
				.error(function() {
					$(".portrait-p").attr("src", "/images/default-photo.jpg");
				});
			unReadedCount(userid);
		}
		$(".portrait-p").on("click",function(){
			location.href="/userInforShow.html?professorId="+userid;
		})
		$(".onlogin").on("click",".goMyInf",function(){
			$(this).attr("href","/userInforShow.html?professorId="+userid)
		})
	} else {
		$(".unlogin").show();
		$(".onlogin").hide();
	}
}
function unReadedCount(id){//查询指定用户的未读消息数量
	$.ajax({
		type:"get",
		url:"/ajax/webMsg/unReadedCount",
		async:true,
		data:{"id":id},
		success:function(data){
			console.log(data)
			if(data.success){
				platMessageTotal(id,data.data)
			}
			
		}
	});
}
function unInformCount(id){//查询指定用户的未读通知数量
	$.ajax({
		type:"get",
		url:"/ajax/notify/idx",
		async:true,
		data:{"id":id},
		success:function(data){
			console.log(data)
			if(data.success && data.data){
				if(data.data.unRead!=0){
					$(".myinform").find(".badge").text(data.data.unRead);
				}else{
					$(".myinform").find(".badge").text("");
				}
			}
			
		}
	});
}

function platMessageTotal(id,num) {
	$.ajax({
		url: "/ajax/platform/msg/unread",
		type: "GET",
		timeout: 10000,
		dataType: "json",
		traditional:true,
		data:{
			provider: id
		},
		success: function(data) {
			console.log(data)
			if(data.success) {
			  if(data.data) {
				  console.log(data.data +num)
				if(data.data + num !=0){
					$(".mymessage").find(".badge").text(data.data + num);
				}else{
					$(".mymessage").find(".badge").text("");
				}
			  }                        
			}
		},
		error: function() {
			$.MsgBox.Alert('提示', '链接服务器超时')
		}
	})
}
//轮播滚动函数
function Carousel(inde, num, show, childcount, obj, next, prev) {
	var tapnum = 0; //按钮可点击次数
	if(childcount > num) {
		next.css("display", "block");
		prev.css("display", "none");
	} else {
		next.css("display", "none");
		prev.css("display", "none");
	}
	next.click(function() {
		if(!obj.is(":animated")) {
			if(num < childcount) {
				tapnum++;
				prev.css("display", "block");
				if(tapnum == childcount - show) {
					next.css("display", "none");

				}
				num++;
				obj.animate({
					left: "-=212px"
				}, 600);
			}
		}
	});
	prev.click(function() {

		if(!obj.is(":animated")) {
			if(num > inde) {
				tapnum--;
				next.css("display", "block");
				if(tapnum == 0) {
					prev.css("display", "none");
				}
				num--;
				obj.animate({
					left: "+=212px"
				}, 600);
			}
		}
	});
}

/*判断是否收藏资源文章或者是否关注专家*/
function ifcollectionAbout(watchObject, sel,num) {
	var that=sel;
	$.ajax('/ajax/watch/hasWatch', {
		data: {
			"professorId": userid,
			"watchObject": watchObject
		},
		dataType: 'json', //数据格式类型
		type: 'get', //http请求类型
		timeout: 10000,
		async: false,
		success: function(data) {
			if(data.success && data.data != null) {
				if(num == "1" || num == "6" || num == "13") { //已关注专家
					$(that).addClass("attenedSpan");
					$(that).text("已关注");
				} else { //已收藏资源或文章
					$(that).removeClass("icon-collect");
					$(that).addClass("icon-collected");
				}
			} else {
				if(num == "1" || num == "6" || num == "13") { //关注专家
					$(that).removeClass("attenedSpan");
					$(that).text("关注");
				} else { //收藏资源或文章
					$(that).addClass("icon-collect");
					$(that).removeClass("icon-collected");//
				}
			}
		},
		error: function(data) {
			$.MsgBox.Alert('提示', "服务器链接超时");
		}
	});
}
/*收藏资源、文章或者关注专家*/
function collectionAbout(watchObject,sel, num) {
	var that=sel;
	$.ajax('/ajax/watch', {
		data: {
			"professorId": userid,
			"watchObject": watchObject,
			"watchType": num,
			"uname":$.cookie("userName")
		},
		dataType: 'json', //数据格式类型
		type: 'POST', //http请求类型
		timeout: 10000,
		async: false,
		success: function(data) {
			if(data.success) {
				console.log(data)
				if(num == "1" || num == "6") {
					$(that).addClass("attenedSpan");
					$(that).text("已关注");
				} else {
					$(that).removeClass("icon-collect");
					$(that).addClass("icon-collected");
				}
			}
		},
		error: function(data) {
			$.MsgBox.Alert('提示', "服务器链接超时");
		}
	});
}


/*取消收藏资源、文章或者取消关注专家*/
function cancelCollectionAbout(watchObject,sel,num) {
	var that=sel;
	$.ajax({
		url: '/ajax/watch/delete',
		data: {
			professorId: userid,
			watchObject: watchObject
		},
		dataType: 'json', //数据格式类型
		type: 'post', //http请求类型
		timeout: 10000,
		async: true,
		success: function(data) {
			console.log(data.success)
			if(num == "1" || num == "6") { //关注专家
				$(that).removeClass("attenedSpan");
				$(that).text("关注");
			} else { //收藏资源或文章
				$(that).addClass("icon-collect");
				$(that).removeClass("icon-collected");
			}
		},
		error: function(data) {
			$.MsgBox.Alert('提示', "服务器链接超时");
		}
	});
}



//反馈意见成功
function backSuccessed(){
	$(".correctCon").val("");
	$(".correctSubmit").attr("disabled",true);
	$(".correctSubmit").parents(".correctBlock").fadeOut();
	$.MsgBox.Alert('提示', '感谢您的反馈，我们马上处理。');
	$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
}
function suImg() {
	$("#mb_msgicon").css("background", 'url("/images/sign_icon_chenggong_nor.png") 0% 0% / contain');
	$("#mb_ico").css("background",'url(/images/sign_icon_guanbi_nor.png) center center no-repeat');
}

//发现上方轮播
var bannerRotate = {// banner rotating
	_time: 3000,
	_i: 0,
	_interval: null,
	_navId: "#slide-tab",
	_navBox: "#slide-list",
	bannerShow: function() {
		$(this._navId).find("li").removeClass("slide-tab-item-active");
		$(this._navId).find("li:eq("+this._i+")").addClass("slide-tab-item-active");
		
		$(this._navBox).find("li").removeClass("slide-item-active");
		$(this._navBox).find("li:eq("+this._i+")").addClass("slide-item-active");
	},
	bannerStart:function() {
		var _this = this;
		_this._interval = setInterval(function() {
			if(_this._i >= 4) {
				_this._i = 0;
			}
			else {
				_this._i++;
			}
			_this.bannerShow();
		}, _this._time);
	},
	bannerInit: function() {
		var _this = this;
		_this.bannerStart();
		
		$(_this._navId).find("li").bind("mouseover", function() {
			clearInterval(_this._interval);
			_this._i = $(this).index();
			_this.bannerShow();
			_this.bannerStart();
		});
	}
};

$(document).ready(function(){
	//处理点击事件，需要打开原生浏览器
	$("body").on("click","a.advertsub",function(){
		var adId = this.getAttribute('data-id');
		console.log(adId)
		wlog("ad", adId ,"1");
		return true;
	})
})

