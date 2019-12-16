//var wlogurl="http://192.168.3.233:8080"
var wlogurl="http://www.ekexiu.com:8082";

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
			location.href = "cmp-portal/cmp-workspaces.html"
		} else {
			location.href = "cmp-portal/cmp-settled-reg.html"
		}
	})
	$("#cmpSet3").on("click", function() {
		if(orgid && orgid != "null" && orgid != null) {
			location.href = "/cmp-portal/cmp-workspaces.html"
		} else {
			location.href = "/cmp-portal/cmp-settled-reg.html"
		}
	})
	
	//搜索框跳转页面
	$("#search").on("click", function() {
		var searchContent = $("#searchContent").val();
		setTimeout(function(){location.href = "searchNew.html?searchContent=" + encodeURI(searchContent)},300);
		
	});
	$("#search").on("click", function() {
		var searchContent = $("#searchContent").val().replace(/^\s*|\s*$/,"");
		if(searchContent) {
			wlog("kw", searchContent)
		}
	});
	//enter绑定时间
	$("#searchContent").keydown(function(e) {
		if(e.which == 13) {
			var searchContent = $("#searchContent").val();
			console.log(searchContent);
			location.href = "searchNew.html?searchContent=" + encodeURI(searchContent);
		}
	
	})
	$("#hsearchContent").keydown(function(e) {
		if(e.which == 13) {
			var searchContent = $("#hsearchContent").val();
			if($(this).siblings()[0].id=="searchh") {
				location.href = "/searchNew.html?searchContent=" + encodeURI(searchContent);
				return;
			}
			location.href = "searchNew.html?searchContent=" + encodeURI(searchContent);
		}
	})
	
	$("#hsearch").on("click", function() {
		var searchContent = $("#hsearchContent").val();
		setTimeout(function(){
			location.href = "searchNew.html?searchContent=" + encodeURI(searchContent);
		},300)
		
	});
	$("#searchh").on("click", function() {
		var searchContent = $("#hsearchContent").val();
		setTimeout(function(){
			location.href = "/searchNew.html?searchContent=" + encodeURI(searchContent);
		},300)
		
	});
	$("#hsearch").on("click", function() {
		var searchContent = $("#hsearchContent").val().replace(/^\s*|\s*$/,"");
		if(searchContent) {
			wlog("kw", searchContent)
		}
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
function pageUrl(type,datalist) {
	return ("shtml/"+type+"/"+datalist.createTime.substring(0,8)+"/"+datalist.shareId+".html");
}
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);

	var context = "";
	if(r != null)
		context = r[2];
	reg = null;
	r = null;
	return context == null || context == "" || context == "undefined" ? "" : decodeURI(context);
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
				if(data.data!=0){
					$(".mymessage").find(".badge").text(data.data);
				}else{
					$(".mymessage").find(".badge").text("");
				}
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
			if(data.success){
				if(data.data.unRead!=0){
					$(".myinform").find(".badge").text(data.data.unRead);
				}else{
					$(".myinform").find(".badge").text("");
				}
			}
			
		}
	});
}
//转换格式
function changeTime(dealtime) {
	var s = dealtime;
	//console.log(s);
	if(dealtime.length == 8) {
		var y = s.substr(0, 4);
		var m = s.substr(4, 2);
		var d = s.substr(6, 2);
		var formatTime = y + "-" + m + "-" + d;
		return formatTime;
	} else {
		var y = s.substr(0, 4);
		var m = s.substr(4, 2);
		var d = s.substr(6, 2);
		var h = s.substr(8, 2);
		var minute = s.substr(10, 2);
		var formatTime = y + "-" + m + "-" + d + " " + h + ":" + minute;
		return formatTime;
	}

}
//******过滤特殊字符*******//
function replaceStr(s) {
	var pattern = new RegExp("-");
	var rs = "";
	for(var i = 0; i < s.length; i++) {
		rs = rs + s.substr(i, 1).replace(pattern, '');
	}
	return rs;
}
//**********************//

//根据用户输入的Email跳转到相应的电子邮箱首页  
var hash = {
	'qq.com': 'http://mail.qq.com',
	'gmail.com': 'http://mail.google.com',
	'sina.com': 'http://mail.sina.com.cn',
	'163.com': 'http://mail.163.com',
	'126.com': 'http://mail.126.com',
	'yeah.net': 'http://www.yeah.net/',
	'sohu.com': 'http://mail.sohu.com/',
	'tom.com': 'http://mail.tom.com/',
	'sogou.com': 'http://mail.sogou.com/',
	'139.com': 'http://mail.10086.cn/',
	'hotmail.com': 'http://www.hotmail.com',
	'live.com': 'http://login.live.com/',
	'live.cn': 'http://login.live.cn/',
	'live.com.cn': 'http://login.live.com.cn',
	'189.com': 'http://webmail16.189.cn/webmail/',
	'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
	'yahoo.cn': 'http://mail.cn.yahoo.com/',
	'eyou.com': 'http://www.eyou.com/',
	'21cn.com': 'http://mail.21cn.com/',
	'188.com': 'http://www.188.com/',
	'ustb.edu.cn': 'http://mail.ustb.edu.cn/',
	'foxmail.coom': 'http://www.foxmail.com'
};
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

//评价字数限制
//字数限制函数
function limitTextCountFn(TextAreaId, countContainerId, count) {
	var curLength = $(TextAreaId).val().length;
	if(curLength > count) {
		var num = $(TextAreaId).val().substr(0, count);
		$(TextAreaId).val(num);

	} else {
		$(countContainerId).text(count - $(TextAreaId).val().length);
	}
};

//咨询申请主题字数限制函数
function titleLimitFontCountFn() {
	var curLength = $("#consultTitle").val().length;

	if(curLength > 20) {
		var num = $("#consultTitle").val().substr(0, 20);
		$("#consultTitle").val(num);
	}

};


/*下拉select选择js	*/
function seleCo(obj){
	var sleTd=$(obj).val();
	if(sleTd==0){
		$(obj).css("color","#999");	
	}else{
		$(obj).css("color","#666");
	}
}


//咨询 专家信息接口函数
function concultProInfo(professorId) {
	$.ajax({
		url: "/ajax/professor/editBaseInfo/" + professorId,
		type: "get",
		data: {
			"id": professorId
		},
		contentType: "application/x-www-form-urlencoded",
		success: function(response) {
			//console.log(response);
			var myData = response["data"];

			$("#professorName").html(myData["name"]);
			if(myData["title"]) {
				$("#professorTitle").html(myData["title"] + ' ');
			}
			if(myData["department"]) {
				$("#profDepartment").html(myData["department"] + ' ');
			}
			if(myData["orgName"]) {
				$("#profOrganization").html(myData["orgName"] + ' ');
			}
			if(myData["address"]) {
				$("#profAdress").html(myData["address"]);
			}
			console.log(myData["consultCount"])
			if(!myData["consultCount"]) {
				$("#starLevel").hide();
			}
			$("#byConsultConut").html(myData["consultCount"]);
			$("#sendConsultBtn").attr("proId", myData["id"]);

			//星级 
			var startConut = parseInt(myData["starLevel"]);
			if(myData["consultCount"]) {
				if(!startConut) {
					$(".evastarbox2").hide();
				}
			}
			for(var i = 0; i < startConut; i++) {
				$("#starLevel .evastar2").eq(i).addClass("addStar");
			}

			//认证
			var oSty = autho(myData.authType, myData.orgAuth, myData.authStatus);
			$("#proModifyN").addClass(oSty.sty);
			$("#proModifyN").attr("title", oSty.title);

			//头像
			if(myData["hasHeadImage"] == 0) {
				$("#prohead").attr("src", "images/default-photo.jpg");
			} else {
				$("#prohead").attr("src", "images/head/" + myData["id"] + "_l.jpg");
			}

		},
		error: function(error) {
			$.MsgBox.Alert("message", "请求数据失败");
		}
	});
};

//发送咨询
function sendConsultHandler(professorId) {

	var professorId = professorId;
	var consult_type = $(".clicknow").text(); //咨询类型
	var consult_title = $("#consultTitle").val(); //咨询主题
	var consult_content = $("#consultcontent").val(); //咨询内容
	var consultStr = {
		"consultType": consult_type,
		"consultTitle": consult_title,
		"consultContant": consult_content,
		"professorId": professorId,
		"consultantId": userid
	};

	if(consult_type == '' || consult_title == '' || consult_content == '') {
		$.MsgBox.Alert("消息提醒", "请填写完整");
	};
	if(consult_type == '') {
		$.MsgBox.Alert("消息提醒", "请选择联系目的");
	}
	if(consult_title == '') {
		$.MsgBox.Alert("消息提醒", "请填写咨询目的");
	}
	if(consult_content == '') {
		$.MsgBox.Alert("消息提醒", "请填写咨询内容");
	}

	if(userid && userid != null && userid != "null" && consult_type != '' &&
		consult_title != '' && consult_content != ''
	) {

		$.ajax({
			"url": "/ajax/consult",
			"type": "post",
			//传值：咨询类型、主题、内容、专家id、申请人id
			"data": consultStr,
			"contentType": "application/x-www-form-urlencoded",
			"dataType": "json",
			"success": function(response) {
				console.log(response);
			},
			"error": function() {
				$.MsgBox.Alert("消息提醒", "咨询申请失败");
			},

			"complete": function() {
				//$(".consultapply").remove();
				$(".blackcover").remove();
				$("body").css("position", "");
				$.MsgBox.Alert("消息提醒", "咨询申请成功");
				$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
			},
		});
	}

};

/*标志*/
function autho() {
	if(arguments[0] == 1) {
		return {
			"sty": "authicon-pro",
			"title": "科袖认证专家"
		}
	} else {
		if(arguments[1] == 1) {
			return {
				"sty": "authicon-staff-ok",
				"title": "企业认证员工"
			}
		} else {
			if(arguments[2] == 3) {
				return {
					"sty": "authicon-real",
					"title": "实名认证用户"
				}
			} else {
				return {
					"sty": "e",
					"title": " "
				}
			}
		}
	}
}


//时间显示规则
function commenTime(startTime) {
	var nowTimg = new Date();
	var startdate = new Date();
	startdate.setFullYear(parseInt(startTime.substring(0, 4)));
	startdate.setMonth(parseInt(startTime.substring(4, 6)) - 1);
	startdate.setDate(parseInt(startTime.substring(6, 8)));
	startdate.setHours(parseInt(startTime.substring(8, 10)));
	startdate.setMinutes(parseInt(startTime.substring(10, 12)));
	startdate.setSeconds(parseInt(startTime.substring(12, 14)));
	var date3 = nowTimg.getTime() - startdate.getTime(); //时间差的毫秒数
	var hours = parseInt((date3 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = parseInt((date3 % (1000 * 60 * 60)) / (1000 * 60));
	if(date3 < 60000) {
		return "刚刚";
	} else if(date3 >= 60000 && date3 < 3600000) {
		return minutes + "分钟前";
	} else if(date3 >= 3600000 && date3 < 86400000) {
		return hours + "小时前";
	} else if(date3 >= 86400000) {

		if(nowTimg.getFullYear() == startTime.substring(0, 4)) {

			return startTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + startTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + startTime.substring(8, 10) + ":" + startTime.substring(10, 12);
		} else {

			return startTime.substring(0, 4) + "年" + startTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + startTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + startTime.substring(8, 10) + ":" + startTime.substring(10, 12);
		}
	}
}
/*时间转换*/
function TimeTr(dealtime) {
	var myDate = new Date();
	var s = dealtime;
	var y = s.substr(0, 4);
	var m = s.substr(4, 2);
	var d = s.substr(6, 2);
	var h = s.substr(8, 2);
	var minute = s.substr(10, 2);
	var formatTime;
	if(s.length <= 6) {
		formatTime = y + "年" + m.replace(/\b(0+)/gi, "") + "月";
	} else if(s.length > 6 && s.length <= 8) {
		formatTime = m.replace(/\b(0+)/gi, "") + "月" + d.replace(/\b(0+)/gi, "") + "日 ";
		if(y != myDate.getFullYear()) {
			formatTime = y + "年" + m.replace(/\b(0+)/gi, "") + "月" + d.replace(/\b(0+)/gi, "") + "日 ";
		}
	} else {
		formatTime = m.replace(/\b(0+)/gi, "") + "月" + d.replace(/\b(0+)/gi, "") + "日 " + h + ":" + minute;
		if(y != myDate.getFullYear()) {
			formatTime = y + "年" + m.replace(/\b(0+)/gi, "") + "月" + d.replace(/\b(0+)/gi, "") + "日 " + h + ":" + minute;
		}
	}
	return formatTime;
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
				if(num == "1" || num == "6") { //已关注专家
					$(that).addClass("attenedSpan");
					$(that).text("已关注");
				} else { //已收藏资源或文章
					$(that).removeClass("icon-collect");
					$(that).addClass("icon-collected");
				}
			} else {
				if(num == "1" || num == "6") { //关注专家
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

function leaveMsgCount(id,type, $str) {//查看留言数
	$.ajax({
		"url":"/ajax/leavemsg/count",
		"type": "GET",
		"dataType": "json",
		"data": {
			sid:id,
			stype: type
		},
		"success": function(data) {
			if(data.success) {
				if(data.data > 0) {
					$str.find(".leaveMsgCount").html("留言 " + data.data);
					$str.find(".leaveMsgCount2").html(data.data);
				}
			}
		}
	});
}
//企业规模
var orgSizeShow = {
	'1': '50人以内',
	'2': '50-100人',
	'3': '100-200人',
	'4': '200-500人',
	'5': '500-1000人',
	'6': '1000人以上'
}
//企业类型
var orgTypeShow = {
	"2": "上市企业",
	"3": "外资企业",
	"4": "合资企业",
	"5": "独资企业",
	"6": "个体经营",
	"7": "政府机构",
	"8": "公益组织",
	"9": "协会学会",
	"10": "新闻媒体",
	"11": "教育机构",
	"undefined":""
}
//学位
var eduDegree = {
	"1": "博士",
	"2": "硕士",
	"3": "学士",
	"4": "大专",
	"5": "其他"
}
//栏目
var columnType = {
	"1":{
		fullName:"个人原创",
		shortName:"原创"
	},
	"2":{
		fullName:"企业原创",
		shortName:"原创"
	},
	"3":{
		fullName:"科研",
		shortName:"科研"
	},
	"4":{
		fullName:"智库",
		shortName:"智库"
	},
	"5":{
		fullName:"检测",
		shortName:"检测"
	},
	"6":{
		fullName:"会议",
		shortName:"会议"
	},
	"7":{
		fullName:"企业",
		shortName:"企业"
	},
	"8":{
		fullName:"招聘",
		shortName:"招聘"
	},
	"9":{
		fullName:"新闻",
		shortName:"新闻"
	},
	"10":{
		fullName:"问答",
		shortName:"问答"
	}
}
//需求的费用预算
var demandCost = {
	'1': '1万元以内',
	'2': '1-5万元',
	'3': '5-10万元',
	'4': '10-20万元',
	'5': '20-50万元',
	'6': '50万元以上'
}
//需求的预期时长
var demandDuration = {
	'1': '1个月内',
	'2': '1-3个月',
	'3': '3-6个月',
	'4': '6-12个月',
	'5': '1年以上'
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
function hotKey(sel, num) {

	$(sel).bind({
		paste: function(e) {
			var pastedText;
			if (window.clipboardData  &&  window.clipboardData.getData)  {  // IE
				pastedText  = $(this).val() +  window.clipboardData.getData('Text');          
			} 
			else  {            
				pastedText  = $(this).val() +  e.originalEvent.clipboardData.getData('Text'); //e.clipboardData.getData('text/plain');
			}
			$(this).val(pastedText);

			var $this = $(this);
			setTimeout(function() {
				if($this.val().trim()) {
					$this.siblings("button").show();
				} else {
					$this.siblings("button").hide();
				}
			}, 1);
			e.preventDefault();
		},
		cut: function(e) {
			var $this = $(this);
			setTimeout(function() {
				if($this.val().trim()) {
					$this.siblings("button").show();
				} else {
					$this.siblings("button").hide();
				}
			}, 1);
		},
		blur: function() {
			var $this = $(this);
			setTimeout(function() {
				$this.siblings(".keydrop").hide();
			}, 500)
		},
		focus: function() {
			$(this).siblings(".keydrop").show();
		},
		keyup: function(e) {
			 var ti=$(this).val();
			 var $t=this;
			 $t.comr=ti;
			 var $this=$(this);
			if($(this).val().trim()) {
				$(this).siblings("button").show();
				var lNum = $.trim($(this).val()).length;
				if(0 < lNum) {
					setTimeout(function(){
						if( ti===$t.comr && ti!== $t.comrEnd) {
							var tt=ti;
							$t.comrEnd=tt;
					$("#addKeyword").show();
					$.ajax({
						"url": "/ajax/dataDict/qaHotKey",
						"type": "GET",
						"success": function(data) {
							console.log(data);
							if(data.success) {
								if($t.comrEnd==tt) {
									if(data.data.length == 0) {
										$this.siblings(".keydrop").addClass("displayNone");
										$this.siblings(".keydrop").find("ul").html("");
									} else {
										$this.siblings(".keydrop").removeClass("displayNone");
										var oSr = "";
										for(var i = 0; i < Math.min(data.data.length,5); i++) {
											oSr += '<li>' + data.data[i].caption + '<div class="closeThis"></div></li>';
										}
										$this.siblings(".keydrop").find("ul").html(oSr);
									}
								}	
							} else {
								$this.siblings(".keydrop").addClass("displayNone");
								$this.siblings(".keydrop").find("ul").html("");
							}
						},
						"data": {
							"key": $this.val()
						},
						dataType: "json",
						'error': function() {
							$.MsgBox.Alert('提示', '服务器连接超时！');
						}
					});
					}
					},500);
				}
			} else {
				$(this).siblings("button").hide();
				$(this).siblings(".keydrop").addClass("displayNone");
				$(this).siblings(".keydrop").find("ul").html("");
			}
		}
	})
	$(".keydrop").on("click", "li", function() {
		var oValue = $(this).text();
		var oJudge = $(this).parents(".col-w-12").siblings().find("ul.ulspace li");
		var addNum = $(this).parents(".keydrop").siblings("input").attr("data-num");

		for(var i = 0; i < oJudge.length; i++) {
			if(oValue == oJudge[i].innerText) {
				$.MsgBox.Alert('提示', '添加内容不能重复');
				return;
			}
		}
		$(this).parents(".col-w-12").siblings().find("ul.ulspace").append('<li>' + oValue + '<div class="closeThis"></div></li>');
		$(this).parents(".keydrop").siblings("input").val("");
		$(this).parents(".keydrop").siblings("button").hide();
		if(oJudge.length == addNum - 1) {
			$(this).parents(".keydrop").siblings("input").val("");
			$(this).parents(".col-w-12").hide();
		}
		$(this).parent("ul").html("")
	})
	if(num == 1) {
		return;
	} else {
		/*添加*/
		$(".addButton").siblings("input").keypress(function(){
			var e = event || window.event;
			if(e.keyCode == 13) {
				var oValue = $(this).val().trim();
				var oJudge = $(this).parent().siblings().find("ul.ulspace li");
				var addContent = $(this).attr("data-pro");
				var addNum = $(this).attr("data-num");
				var addfontSizeNum = $(this).attr("data-fontSizeN");
				if(!oValue) {
					$.MsgBox.Alert('提示', '请先填写内容');
					return;
				}
				if(oValue.length > addfontSizeNum) {
					$.MsgBox.Alert('提示', addContent);
					return;
				}
				for(var i = 0; i < oJudge.length; i++) {
					if(oValue == oJudge[i].innerText) {
						$.MsgBox.Alert('提示', '添加内容不能重复');
						return;
					}
				}
				$(this).parent().siblings().find("ul.ulspace").append('<li>' + oValue + '<div class="closeThis"></div></li>');
				$(this).siblings(".addButton").hide();
				$(this).val("");
				if(oJudge.length == addNum - 1) {
					$(this).val("").parents(".col-w-12").hide();
				}
				$(this).siblings(".keydrop").find("ul").html("");
			}
		})
		$(".addButton").click(function() {
			var oValue = $(this).siblings("input").val().trim();
			var oJudge = $(this).parent().siblings().find("ul.ulspace li");
			var addContent = $(this).siblings("input").attr("data-pro");
			var addNum = $(this).siblings("input").attr("data-num");
			var addfontSizeNum = $(this).siblings("input").attr("data-fontSizeN");
			if(!oValue) {
				$.MsgBox.Alert('提示', '请先填写内容');
				return;
			}
			if(oValue.length > addfontSizeNum) {
				$.MsgBox.Alert('提示', addContent);
				return;
			}
			for(var i = 0; i < oJudge.length; i++) {
				if(oValue == oJudge[i].innerText) {
					$.MsgBox.Alert('提示', '添加内容不能重复');
					return;
				}
			}
			$(this).parent().siblings().find("ul.ulspace").append('<li>' + oValue + '<div class="closeThis"></div></li>');
			$(this).hide();
			$(this).siblings("input").val("");
			if(oJudge.length == addNum - 1) {
				$(this).val("").parents(".col-w-12").hide();
			}
			$(this).siblings(".keydrop").find("ul").html("");
		})
	}

}

//带有限制字数的多行文本框
function limitObj(obj,maxNum){
	$(obj).bind({
		paste: function(e) {
			if($(this).val().length==""){
				$(this).parent().siblings(".btnModel").attr("disabled", true);
			}else{
				$(this).parent().siblings(".btnModel").attr("disabled", false);
			}
			var pastedText;
			if (window.clipboardData  &&  window.clipboardData.getData)  {  // IE
				pastedText  = $(this).val() +  window.clipboardData.getData('Text');          
			} 
			else  {            
				pastedText  = $(this).val() +  e.originalEvent.clipboardData.getData('Text'); //e.clipboardData.getData('text/plain');
			}
			$(this).val(pastedText);
			setTimeout(function() {
				$(this).siblings().find("em").text($(obj).val().length);
			}, 1);
			e.preventDefault();
		},
		cut: function(e) {
			if($(this).val().length==""){
				$(this).parent().siblings(".btnModel").attr("disabled", true);
			}else{
				$(this).parent().siblings(".btnModel").attr("disabled", false);
			}
			setTimeout(function() {
				$(obj).siblings().find("em").text($(obj).val().length);
			}, 1);
		},
		keyup: function(e) {
			if($(this).val().length==""){
				$(this).parent().siblings(".btnModel").attr("disabled", true);
			}else{
				$(this).parent().siblings(".btnModel").attr("disabled", false);
			}
			if($(this).val().length > maxNum) {
				$(obj).val($(obj).val().substring(0, maxNum));
				e.preventDefault();
			}
			setTimeout(function() {
				$(obj).siblings().find("em").text($(obj).val().length);
			}, 1);
		}
	});
}


var r64 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "-", "_"];
		var d64 = {
			"0": 0,
			"1": 1,
			"2": 2,
			"3": 3,
			"4": 4,
			"5": 5,
			"6": 6,
			"7": 7,
			"8": 8,
			"9": 9,
			"A": 10,
			"B": 11,
			"C": 12,
			"D": 13,
			"E": 14,
			"F": 15,
			"G": 16,
			"H": 17,
			"I": 18,
			"J": 19,
			"K": 20,
			"L": 21,
			"M": 22,
			"N": 23,
			"O": 24,
			"P": 25,
			"Q": 26,
			"R": 27,
			"S": 28,
			"T": 29,
			"U": 30,
			"V": 31,
			"W": 32,
			"X": 33,
			"Y": 34,
			"Z": 35,
			"a": 36,
			"b": 37,
			"c": 38,
			"d": 39,
			"e": 40,
			"f": 41,
			"g": 42,
			"h": 43,
			"i": 44,
			"j": 45,
			"k": 46,
			"l": 47,
			"m": 48,
			"n": 49,
			"o": 50,
			"p": 51,
			"q": 52,
			"r": 53,
			"s": 54,
			"t": 55,
			"u": 56,
			"v": 57,
			"w": 58,
			"x": 59,
			"y": 60,
			"z": 61,
			"-": 62,
			"_": 63
		};
		function s16to64(s) {
			var out, idx, n1, n2, n3;
			idx = s.length - 1;
			out = "";
			while(idx >= 0) {
				n1 = d64[s.charAt(idx--)];
				if(idx < 0) {
					out = r64[n1] + out;
					break;
				}
				n2 = d64[s.charAt(idx--)];
				if(idx < 0) {
					out = r64[(n2 >>> 2)] + r64[((n2 & 0x3) << 4) + n1] + out;
					break;
				}
				n3 = d64[s.charAt(idx--)];
				out = r64[(n2 >>> 2) + (n3 << 2)] + r64[((n2 & 0x3) << 4) + n1] + out;
			}
			return out;
		}

		function s64to16(s) {
			var out, idx, n1, n2;
			idx = s.length - 1;
			out = "";
			while(idx >= 0) {
				n1 = d64[s.charAt(idx--)];
				if(idx < 0) {
					out = r64[n1 >>> 4] + r64[n1 & 0xF] + out;
					break;
				}
				n2 = d64[s.charAt(idx--)];
				out = r64[(n2 >>> 2)] + r64[(n1 >>> 4) + ((n2 & 0x3) << 2)] + r64[n1 & 0xF] + out;
			}
			if(out.length>32) {
				return out.substring(1);
			}
			return out;
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

var currentdate;
function getNowFormatDate(num) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var getHours = date.getHours();
    var getMinutes = date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (getMinutes >= 0 && getMinutes <= 9) {
        getMinutes = "0" + getMinutes;
    }
     if (getHours >= 0 && getHours <= 9) {
        getHours = "0" + getHours;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + getHours + seperator2 + getMinutes
    if(num==1){
    	currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    }
    
           
    return currentdate;
}
function wlog(dt, id, src) {
	var src = src || "1";
	
    var $img=$("<img src='"+wlogurl+"/log/img?__lt="+dt+"&src="+src+"&id="+id+"&_t="+(new Date().getTime())+"' style='display:none;' ></img>");
    $img.appendTo($("body"));
    
    setTimeout(function(){
    	$img.remove();
    },5000);
    	
//	$.ajax({
//		url: "http://www.ekexiu.com:8082/log/jsonp/log",
//		data: {
//			"id": id,
//			"src": src,
//			"__lt": dt,
//		},
//		success:function(data) {
//		},
//		dataType: "jsonp"
//	});
}

//广告相关操作
function addscript(that){
	var script=document.createElement("script");  
	script.setAttribute("type", "text/javascript");  
	var srclink= "https://www.ekexiu.com/data/inc/ad/"+ that +".js?r=" + new Date().getTime();
	script.setAttribute("src", srclink);  
	var heads = document.getElementsByTagName("head");  
	if(heads.length){  
	    heads[0].appendChild(script);  
	}else{
		document.documentElement.appendChild(script);
	}
}
$(document).ready(function(){
	//处理点击事件，需要打开原生浏览器
	$("body").on("click","a.advertsub",function(){
		var adId = this.getAttribute('data-id');
		console.log(adId)
		wlog("ad", adId ,"1");
		return true;	
	})
})

function adScroll(){
	//不随滚动条滚动的固定层广告代码
	function thisS() {
		var scrollHeight = $(document).height();
		var windowHeight = $(window).innerHeight();
		var footerHeight = $("footer").outerHeight(true);
		var containH = $("#container").outerHeight(true)-footerHeight
		var objHeight= $("#scroll-fixed-ad").outerHeight();
		var scroTop = document.body.scrollTop || document.documentElement.scrollTop;
		(scroTop-objHeight+offTop) < containH ? (scroTop > offTop ? 
			(scroObj.attr('class',"div1 div2"), c && (scroObj.style.top = scroTop - offTop + "px")) :scroObj.attr('class',"div1")):
					(scroObj.attr('class',"div1 div3"),scroObj.css("bottom",windowHeight + scroTop + footerHeight+ 10 - scrollHeight))
//	console.log(containH+"***"+(scroTop+offTop-objHeight))
	console.log(scroTop+"&&&&&"+offTop+"&&&"+objHeight)
	}
	var scroObj = $("#scroll-fixed-ad");
	var offTop= scroObj.offset().top + 40;
	if(scroObj == undefined) return !1;
	var c;
	c = window.ActiveXObject && !window.XMLHttpRequest;
	if(!c || !0) window.onscroll =function(){
		var d;
		if(d) return;
		d = setTimeout(function() {
			thisS.call(this), d = undefined
		}, 150)
	}
}
