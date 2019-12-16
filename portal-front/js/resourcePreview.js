$(document).ready(function() {
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	$(".jqzoom").imagezoom();
	$("#thumblist").on("click", "li a", function() {
		$(this).parents("li").addClass("tb-selected").siblings().removeClass("tb-selected");
		$(".jqzoom").attr('src', $(this).find("img").attr("src"));
		$(".jqzoom").attr('rel', $(this).find("img").attr("src"));
	});
	$('.shareWeixin').hover(function() {
		$('.shareCode').stop(true, false).fadeToggle();
	});
	var resourceId = GetQueryString("resourceId");
	var professorId = "";
	getRecourceMe();
	/*获取资源信息*/
	function getRecourceMe() {
		$.ajax({
			"url": "/ajax/resource/queryOne",
			"type": "GET",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					resourceHtml(data.data);
					var resourceName = data.data.resourceName + "-科袖网";
					window.setTimeout(function() {
						document.title = resourceName;
					}, 500);
				}
			},
			"data": {
				"resourceId": resourceId
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*合作备注及性能参数存储换行格式*/
	function outHTML(selecter) {
		var getValue = selecter;
		var aa = "";
		if(getValue) {
			var endValue = ((getValue.replace(/<(.+?)>/gi, "&lt;$1&gt;")).replace(/ /gi, "&nbsp;")).replace(/\n/gi, "|");
			var cc = endValue.split("|");
			for(var i = 0; i < cc.length; i++) {
				aa += cc[i] + '<br/>'
			}
		}
		return aa;
	}
	/*处理资源html代码*/
	function resourceHtml($da) {
		$("#resourceName").text($da.resourceName); //名字
		$("#application").text($da.supportedServices); //应用用途
		if($da.editProfessor) {
			$("#person").show();
			if($da.orgName) { //所属机构
				$("#organizationName").text($da.orgName).parents("li").show();
			}
			$("#nameS").text($da.editProfessor.name); //"office": "", //职位 "title": "", //职称
			if($da.editProfessor.title) {
				$("#titleOffice").text($da.editProfessor.title);
			} else {
				if($da.editProfessor.office) {
					$("#titleOffice").text($da.editProfessor.office);
				}
			}
			if($da.editProfessor.orgName) {
				$("#orgType").text($da.editProfessor.orgName);
			}
			professorId = $da.editProfessor.id;
			var professorFlag = autho($da.editProfessor.authType, $da.editProfessor.orgAuth, $da.editProfessor.authStatus);
			$("#authFlag").addClass(professorFlag.sty).attr("title", professorFlag.title);
			if($da.editProfessor.hasHeadImage == 1) {
				$("#headImg").css("background-image", 'url(/images/head/' + $da.editProfessor.id + '_l.jpg)');
			}
		}else {
			$("#enterprise,#resPerson").show();
			if($da.organization.hasOrgLogo) {
				$("#companyImg").attr("src", "/images/org/" + $da.organization.id + ".jpg");
			}else{
				$("#companyImg").attr("src", "/images/default-icon.jpg");
			}
			if($da.organization.authStatus==3){
				$("#QauthFlag").addClass("authicon-com-ok").attr("title", "认证企业");	
			}
			$("#Qname").text($da.organization.name);
			if($da.organization.industry) {
				$("#Qindustry").text($da.organization.industry.replace(/,/gi, " | "));
			}
		}
		if($da.spec) { //厂商型号
			$("#modelNumber").text($da.spec).parents("li").show();
		}
		if($da.parameter) { //性能参数
			$("#performancePa").html(outHTML($da.parameter)).parents("li").show();
		}
		if($da.cooperationNotes) { //合作备注
			$("#remarkContent").html(outHTML($da.cooperationNotes)).parents("li").show();
		}
		if($da.pageViews>0){
			$("#pageView").html($da.pageViews)
		}
		if($da.subject) {
			var oSub = $da.subject.split(",");
			var oSt = "";
			for(var i = 0; i < oSub.length; i++) {
				oSt += '<li><p class="h2Font">' + oSub[i] + '</p></li>'
			}
			$(".tagList").html(oSt);
		}
		if($da.descp) { //编辑器
			$("#descp").html($da.descp).parents("li").show();
		}
		//return;
		if($da.images.length) {
			$("#firstFigure").attr({
				"src": "/data/resource/" + $da.images[0].imageSrc,
				"rel": "/data/resource/" + $da.images[0].imageSrc
			}).parent().attr("href", "/data/resource/" + $da.images[0].imageSrc);
			var arr = "";
			for(var i = 0; i < $da.images.length; i++) {
				if($da.images[i] == $da.images[0]) {
					var oString = '<li class="tb-selected">' +
						'<div class="tb-pic tb-s66">' +
						'<a href="javascript:void(0);">' +
						'<img src="/data/resource/' + $da.images[i].imageSrc + '"/>' +
						'</a>' +
						'</div>' +
						'</li>'
				} else {
					var oString = '<li >' +
						'<div class="tb-pic tb-s66">' +
						'<a href="javascript:void(0);">' +
						'<img src="/data/resource/' + $da.images[i].imageSrc + '"/>' +
						'</a>' +
						'</div>' +
						'</li>'
				}

				arr += oString;
			}
			$("#thumblist").html(arr);
		}

	}
	

	selUse();
	function selUse() {
		$.ajax({
			url: "/ajax/resource/qaLinkman",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async:true,
			data: {
				"resourceId": resourceId,
			},
			success: function(data, textState) {
				console.log(data)
				if(data.success) {
					unauthUser(data.data);
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	function unauthUser($res) {
	var osting=""
	for(var i = 0; i < $res.length; i++) {
		var img;
		var styC="";
		var oClass = autho($res[i].professor.authType, $res[i].professor.orgAuth, $res[i].professor.authStatus);
		var oTitle="";
		if($res[i].professor.title) {
			oTitle=$res[i].professor.title;
		}else{
			if($res[i].professor.office) {
				oTitle=$res[i].professor.office;
			}
		}
		if($res[i].professor.hasHeadImage) {
				img = "/images/head/" + $res[i].professor.id + "_l.jpg";
			} else {
				img = "../images/default-photo.jpg"
			}
		var oSt = '<li>'
		oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url('+img+');"></div>'
		oSt += '<div class = "madiaInfo">'
		oSt += '<p class = "ellipsisSty">'
		oSt += '<span class = "h1Font" id="name">'+$res[i].professor.name+'</span><em class="authicon '+oClass.sty+'" title="'+oClass.title+'"></em >'
		oSt += '</p>'
		oSt += '<p class="h2Font ellipsisSty">'+oTitle+'</p>'
		oSt += '</div>'
		oSt += '<div class="'+styC+'" flag=1></div>'
		oSt += '</li>'
		osting+=oSt;
	}
	$("#expertli").html(osting);
}
})