$(function() {
	loginStatus(); //判断个人是否登录
	var subjectAll="", industryAll="";
	var userid = $.cookie("userid");
	var tId = GetQueryString("id");
	if(userid) {
		getInfo();
	} else {
		location.href = "login.html";
		return;
	}
	
	function getInfo() {
		$.get("/ajax/team/qo",{
			id: tId
		}, function($data) {
			if($data.success) {
				var $info = $data.data;
				if($info) {
					var llqtitle = $info.name + "-科袖网";
					document.title = llqtitle;
					$("#name").val($info.name);
					$("#orgName").val($info.orgName);
					//省
					if(!$info.province) {
						$("#Province .mr_show").text("请选择省/直辖市");
					} else {
						$("#Province .mr_show").text($info.province);
						$("#Province input[name=cho_Province]").val($info.province)
					}
					//市
					if(!$info.city) {
						$("#City .mr_show").text("请选择城市");
					} else {
						$("#City .mr_show").text($info.city);
						$("#City input[name=cho_City]").val($info.city)
					}
					//省份城市颜色
					if($("#oprovince").text() == "请选择省/直辖市") {
						$("#oprovince").removeClass("mr_select");
					} else {
						$("#oprovince").addClass("mr_select");
					}
					if($("#ocity").text() == "请选择城市") {
						$("#ocity").removeClass("mr_select");
					} else {
						$("#ocity").addClass("mr_select");
					}
					$("#descp").val($info.descp);
					$("#descp").siblings().find("em").text($("#descp").val().length);

					if($info.subject) {
						subjectShow($info.subject);
					}
					//展示专家的行业							
					if($info.industry) {
						industryShow($info.industry);
					}

				}
			}
		});
	}

	hotKey(".oinput");
	limitObj("#descp", 2000)


	//////////////////学术领域增删改查相关开始//////////////
	//填充学术领域
	var subjectShow = function(data) {
		$("#subjectList").html("");
		if(data != undefined && data.length != 0) {
			var subs=strToAry(data)
			if(subs.length > 0) {
				for(var i = 0; i < subs.length; i++) {
					$("#subjectList").append('<li>' + subs[i] + '<div class="closeThis"></div></li>');
				};
			}
		}
	}

	//学术领域删除
	$("#subjectList").on("click", ".closeThis", function() {
		$(this).parent().remove();
		var liNum = $("#subjectList").find("li").length;
		if(liNum < 20) {
			$("#subjectList").parents(".keyResult").siblings("div.col-w-12").show();
		}
	})
	//////////////////学术领域增删改查相关结束//////////////

	//////////////////应用行业增删改查相关开始//////////////
	//填充应用行业
	var industryShow = function(data) {
		$("#industryList").html("");
		if(data != undefined && data.length != 0) {
			var subs=strToAry(data)
			if(subs.length > 0) {
				for(var i = 0; i < subs.length; i++) {
					$("#industryList").append('<li>' + subs[i] + '<div class="closeThis"></div></li>');

				};
			}
		}
	}

	//应用行业删除
	$("#industryList").on("click", ".closeThis", function() {
		$(this).parent().remove();
		var liNum = $("#industryList").find("li").length;
		if(liNum < 20) {
			$("#industryList").parents(".keyResult").siblings("div.col-w-12").show();
		}
	})

	//////////////////应用行业增删改查相关结束//////////////

	//////////////////相关操作按钮///////////////
	$("#saveTeam").on("click", function() {
		var Str2 = trim($("#name").val());
		var Str3 = trim($("#orgName").val());

		if(Str2.trim()=='') {
			$.MsgBox.Alert("提示", "团队名称不能为空");
			return;
		}else if(Str2.trim().length>50) {
			$.MsgBox.Alert("提示", "团队名称不得超过50个字");
			return;
		}
		if(Str3.length > 50) {
			$.MsgBox.Alert("提示", "所属机构不得超过50个字");
			return;
		}

		if($("#Province input[name=cho_Province]").val() != "请选择省/直辖市" && $("#City input[name=cho_City]").val() == "请选择城市") {
			$.MsgBox.Alert('提示', '请选择您所在的城市');
				return;
		}
		var subjects = $("#subjectList li");
		if(subjects.length > 0) {
			for(var i = 0; i < subjects.length; i++) {
				subjectAll += subjects[i].innerText;
				subjectAll += ',';
			};
			subjectAll = subjectAll.substring(0, subjectAll.length - 1);
		}
		var industrys = $("#industryList li");
		if(industrys.length > 0) {
			for(var i = 0; i < industrys.length; i++) {
				industryAll += industrys[i].innerText;
				industryAll += ',';
			};
			industryAll = industryAll.substring(0, industryAll.length - 1);
		}
		$.ajax({
			"url": "/ajax/team/update",
			"type": "POST",
			"data": {
				id: tId,
				name: Str2,
				orgName: Str3,
				province: $('#oprovince').text(),
				city: $('#ocity').text(),
				subject: subjectAll,
				industry: industryAll,
				descp: $("#descp").val()
			},
			"contentType": "application/x-www-form-urlencoded",
			"success": function($data) {
				if($data.success) {
					$.MsgBox.Alert("提示","团队信息已经修改成功");
					$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
					location.href="teamList.html"
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		})
		
	});
	//点击查看
	$("#showMyself").click(function() {
		$(this).attr("href", "teamInfoShow.html?id=" + tId);
	})
	$("#deleteTeam").on('click',function() {
		$.MsgBox.Confirm("提示", "确认删除该团队？", function() {
			$.ajax({
				"url": "/ajax/team/delete",
				"type": "POST",
				"dataType": "json",
				"data": {
					"id": tId
				},
				"success": function($data) {
					if($data.success) {
						location.href="teamList.html"
					}
				}
			})
		})
	})


	function trim(str) { //删除左右两端的空格			　　
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}
})
