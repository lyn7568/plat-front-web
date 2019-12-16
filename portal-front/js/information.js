$(function() {
	loginStatus(); //判断个人是否登录
	//1获取数据
	var authSD, osty, opName, orgName,osyp,ofl=false;
	var userid = $.cookie("userid");
	if(userid) {
		//获取数据，填充页面
		getInfo(userid);
	} else {
		location.href = "login.html";
		return;
	}
	$("#downResume").attr("href","/pdf/professor?id="+userid+"&_dl=1");
	var a = new Date();
	
	$('.dateBtn').datetimepicker({
		language: 'ch',
		weekStart: 0,
		todayBtn: 1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
	});
	function getInfo(InfoId) {
		$.get("/ajax/professor/editInfo/" + InfoId, function($data) {
			if($data.success) {
				console.log($data)
				var $info = $data.data;
				authSD = $info.orgAuth;
				if($info) {
					//展示专家的信息
					if($info.hasHeadImage) {
						$("#proHead").css("background-image", "url(/images/head/" + $info.id + "_l.jpg)");
					}
					$("#proName").text($info.name);
					var oStyS = autho($info.authType, $info.orgAuth, $info.authStatus);
					osyp=oStyS.sty
					if(oStyS.sty == "e") {
						osty = "e";
						$("#name").replaceWith('<input type="text" class="frmcontype" placeholder="请填写您的姓名" id="name" value="' + $info.name + '">')
						opName = $info.name;
					}
					$("#proAuth").addClass(oStyS.sty);
					$("#proAuth").attr("title", oStyS.title);
					if($info.address) {
						$("#proAddress").html($info.address);
					}
					var proOther = "";
					if($info.orgName) {
						orgName = $info.orgName||"";
						if($info.department) {
							if($info.office) {
								proOther = $info.orgName + "，" + $info.department + "，" + $info.office
							} else {
								proOther = $info.orgName + "，" + $info.department
							}
						} else {
							if($info.office) {
								proOther = $info.orgName + "，" + $info.office
							} else {
								proOther = $info.orgName
							}
						}
					} else {
						orgName = $info.orgName||"";
						if($info.department) {
							if($info.office) {
								proOther = $info.department + "，" + $info.office
							} else {
								proOther = $info.department
							}
						} else {
							if($info.office) {
								proOther = $info.office
							}
						}
					}
					$("#proOther").text(proOther);
					var llqtitle = $info.name + "-" + proOther.replace(/，/gi, "-") + "-科袖网"; //修改浏览器title信息
					if($info.title) {
						$("#proTit").html($info.title + "<span style='margin-right:10px;'></span>");
						llqtitle = $info.name + "-" + $info.title + "-" + proOther.replace(/，/gi, "-") + "-科袖网";
					}
					document.title = llqtitle;

					if($info.email) {
						$("#mail").text("联系邮箱：" + $info.email);
						$("#moileMail").val($info.email);
					}
					if($info.phone) {
						$("#phone").text("联系电话：" + $info.phone);
						$("#mobilePhone").val($info.phone);
					}
					$("#descpS").text($info.descp);
					//编辑显示专家信息到保存数据
					$("#name").text($info.name);
					if($info.sex == 1){
	                    document.getElementsByName('sex')[0].checked='checked';
	                }else{
	                    document.getElementsByName('sex')[1].checked='checked';
	                }
					$("#birthTime").val($info.birthday);
					$("#title").val($info.title);
					$("#orgName").val($info.orgName);
					$("#department").val($info.department);
					$("#officeRevise").val($info.office);
					//省
					if(!$info.province) {
						$("#Province .mr_show").text("请选择省/直辖市");
					} else {
						$("#Province .mr_show").text($info.province);
						$("#Province input[name=cho_Province]").val($info.province)
					}
					//市
					if(!$info.address) {
						$("#City .mr_show").text("请选择城市");
					} else {
						$("#City .mr_show").text($info.address);
						$("#City input[name=cho_City]").val($info.address)
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
					//研究方向						
					if($info.researchAreas.length) {
						researchAreaShow($info.researchAreas, $info.editResearchAreaLogs);
					}
					//展示专家的行业							
					if($info.industry) {
						industryShow($info.industry);
					}
					//教育背景
					if($info.edus) {
						eduBgShow($info.edus);
					}
					//社会兼职
					if($info.jobs) {
						timeJobShow($info.jobs);
					}
					//项目经历
					if($info.projects) {
						projectShow($info.projects)
					}
					//荣誉及奖项
					if($info.honors) {
						honorShow($info.honors);
					}
					//yearAdd();
					$(".StopMonth").next(".mr_calendar_ym").find(".mr_year li:first-child").before('<li class="ymli">至今</li>');
					$("#eduUl").find(".full_year li:first-child").before('<li class="ymli">至今</li>');
					//month();

				}
			}
		});
	}
	hotKey(".oinput"); //
	//////////////////基本信息增删改查相关开始//////////////
	//头像旁保存
	$("#saveProfessor").on("click", function() {
		var Str1 = trim($("#title").val()); //职称
		var Str2 = trim($("#officeRevise").val()); //职位
		var Str3 = trim($("#orgName").val()); //所在机构
		var Str4 = trim($("#department").val()); //所在部门
		if(osty=="e") {
			if($("#name").val().trim()=='') {
				$.MsgBox.Alert("提示", "姓名不能为空");
				return;
			}else if($("#name").val().trim().length>10) {
				$.MsgBox.Alert("提示", "姓名不得超过10个字");
				return;
			}
		}
		if(Str1.length > 20) {
			$.MsgBox.Alert("提示", "职称不得超过20个字");
			return;
		}
		if(Str2.length > 20) {
			$.MsgBox.Alert("提示", "职位不得超过20个字");
			return;
		}
		if(Str3.length > 50) {
			$.MsgBox.Alert("提示", "所在机构不得超过50个字");
			return;
		}
		if(Str4.length > 20) {
			$.MsgBox.Alert("提示", "所在部门不得超过20个字");
			return;
		}

		var loginName = $("#mobilePhone").val();
		if(trim(loginName)) {
			if(loginName.length > 50) {
				$.MsgBox.Alert('提示', '联系电话不得超过50个字');
				return;
			}
		}
		var mail = $("#moileMail").val();
		if(mail.trim()) {
			if(mail.length > 50) {
				$.MsgBox.Alert('提示', '联系邮箱不得超过50个字');
				return;
			}
			if(mail.trim().indexOf("@") == -1) {
				$.MsgBox.Alert('提示', '联系邮箱格式有误，请检查后重新填写');
				return;
			}
		}
		if($("#Province input[name=cho_Province]").val() != "请选择省/直辖市" && $("#City input[name=cho_City]").val() == "请选择城市") {
			$.MsgBox.Alert('提示', '请选择您所在的城市');
				return;
		}
		
		console.log(orgName);
		console.log($("#orgName").val())
		if(orgName != $("#orgName").val()) {
			if(authSD == 1) {
				$.MsgBox.Confirm("提示", "您修改了所在机构，将失去认证员工身份，不再是企业的联系人，确定修改？", function() {
					ofl=true
					setTimeout(function() {
						if(osty == "e") {
							if($("#name").val() != opName) {
								$.MsgBox.Confirm("提示", "您修改了姓名，您的专利和论文将取消关联，确定修改？", personUpdata);
							}
						}else{
							personUpdata();
						}
					}, 100)

				});
			} else {
				if(osty == "e") {
					if($("#name").val() != opName) {
						$.MsgBox.Confirm("提示", "您修改了姓名，您的专利和论文将取消关联，确定修改？", personUpdata);
					}else {
						personUpdata();
					}
				}else{
					personUpdata();
				};
			}
		} else {
			if(osty == "e") {
				if($("#name").val() != opName) {
					$.MsgBox.Confirm("提示", "您修改了姓名，您的专利和论文将取消关联，确定修改？", personUpdata);
				}else{
					personUpdata();
				}
			}else{
				personUpdata();
			}
		}
	});

	function personUpdata() {
		var $data = {};
		$data.name = (osty == "e") ? $("#name").val() : $("#name").text();
		$data.orgName = $("#orgName").val();
		$data.title = $("#title").val();
		$data.department = $("#department").val();
		$data.office = $("#officeRevise").val();
		$data.phone = $("#mobilePhone").val();
		$data.email = $("#moileMail").val();
		$data.sex=$("input[name='sex']:checked").val();
		$data.birthday=$("#birthTime").val();
		if($("#Province input[name=cho_Province]").val() != "请选择省/直辖市") {
			$data.province = $("#Province input[name=cho_Province]").val(); //省
		}
		if($("#City input[name=cho_City]").val() != "请选择城市") {
			$data.address = $("#City input[name=cho_City]").val(); //市
		}
		var userid = $.cookie("userid");
		if(userid) {
			$data.id = userid;
		}
		$.ajax({
			"url": "../ajax/professor",
			"type": userid ? "PUT" : "POST",
			"success": function(rdata) {
				if(rdata.success) {
					if(userid) {
						$.get("/ajax/professor/editInfo/" + userid, function($data) {
							if($data.success) {
								var $info = $data.data;
								if(osyp=="authicon-staff-ok")  {
									if(ofl) {
										$("#proAuth")[0].className="authiconNew e";
										$("#proAuth").attr("title","")
									}
								}
								$("#proName").text($info.name);
								authSD = $info.orgAuth;
								opName = $info.name;
								if($info) {
									//展示专家的信息
									$(".reInfoBlock").find(".modifybox").hide();
									$(".reInfoBlock").find(".coninfocon").show();

									if($info.phone) {
										$("#phone").text("联系电话:" + $info.phone);
										$("#mobilePhone").val($info.phone);
									} else {
										$("#phone").text("");
										$("#mobilePhone").val("");
									}
									if($info.email) {
										$("#mail").text("联系邮箱:" + $info.email);
										$("#moileMail").val($info.email);
									} else {
										$("#mail").text("");
										$("#moileMail").val("");
									}
									if($info.title) {
										$("#proTit").html($info.title + "<span style='margin-right:10px;'></span>");
									} else {
										$("#proTit").html("")
									}
									if($info.address) {
										$("#proAddress").html($info.address + "<span style='margin-right:10px;'></span>");
									} else {
										$("#proAddress").html('')
									}
									var proOther = "";
									if($info.orgName) {
										if($info.department) {
											if($info.office) {
												proOther = $info.orgName + "，" + $info.department + "，" + $info.office
											} else {
												proOther = $info.orgName + "，" + $info.department
											}
										} else {
											if($info.office) {
												proOther = $info.orgName + "，" + $info.office
											} else {
												proOther = $info.orgName
											}
										}
									} else {
										if($info.department) {
											if($info.office) {
												proOther = $info.department + "，" + $info.office
											} else {
												proOther = $info.department
											}
										} else {
											if($info.office) {
												proOther = $info.office
											}
										}
									}
									$("#proOther").text(proOther);
									//显示专家信息到保存数据
									if(osty == "e") {
										$("#name").val($info.name);
									} else {
										$("#name").text($info.name);
									}
									$("#title").val($info.title);
									orgName = $info.orgName
									$("#orgName").val($info.orgName);
									$("#department").val($info.department);
									$("#officeRevise").val($info.office);
									//省
									if(!$info.province) {
										$("#Province .mr_show").text("请选择省/直辖市");
									} else {
										$("#Province .mr_show").text("");
										$("#Province input[name=cho_Province]").val($info.province);
										$("#Province .mr_show").text($info.province);
									}

									//市
									if(!$info.address) {
										$("#City .mr_show").text("请选择城市");
									} else {
										$("#City .mr_show").text("");
										$("#City input[name=cho_City]").val($info.address);
										$("#City .mr_show").text($info.address);
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

								}
							}

						})
					} else {
						location.href = "information.html?id=" + rdata.data;
					}
				} else {
					$.MsgBox.Alert("提示", rdata.msg);
				}
			},
			"data": userid ? JSON.stringify($data) : $data,
			"contentType": userid ? "application/json" : "application/x-www-form-urlencoded",
			dataType: "json"
		});
	}
	//////////////////基本信息增删改查相关结束//////////////

	//////////////////个人简介增删改查相关开始//////////////
	limitObj("#descp", 500)
	//个人简介保存
	$("#saveDescp").on("click", function() {
		$.ajax({
			"url": "../ajax/professor/descp",
			"type": "POST",
			"data": {
				"id": userid,
				"descp": $("#descp").val()
			},
			"contentType": "application/x-www-form-urlencoded",
			"success": function($data) {
				//debugger;;
				if($data.success) {
					$(".coninfocon").css("display", "block");
					$(".modifybox").css("display", "none");
					$("#descpS").text($("#descp").val());
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		})
	})
	//////////////////个人简介增删改查相关结束//////////////

	//////////////////学术领域增删改查相关开始//////////////
	//填充学术领域
	var subjectShow = function(data) {
		$("#subjectShow").html("");
		$("#subjectList").html("");
		if(data != undefined && data.length != 0) {
			var subs=strToAry(data)
			if(subs.length > 0) {
				for(var i = 0; i < subs.length; i++) {
					$("#subjectList").append('<li>' + subs[i] + '<div class="closeThis"></div></li>');
					$("#subjectShow").append('<li>' + subs[i] + '</li>');
				};
			}
			if($("#subjectShow").find("li").length >= 20) {
				$("#subjectList").parents(".keyResult").siblings("div.col-w-12").hide();
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
	//学术领域保存
	$("#subjectSave").on("click", function() {
		$(this).parents(".modifybox").hide();
		var subjects = $("#subjectList li");
		var subjectAll = "";
		if(subjects.size() > 0) {
			for(var i = 0; i < subjects.size(); i++) {
				subjectAll += subjects[i].innerText;
				subjectAll += ',';
			};
			subjectAll = subjectAll.substring(0, subjectAll.length - 1);
		}
		$.ajax({
			"url": "/ajax/professor/subject",
			"type": "POST",
			"data": {
				"id": userid,
				"subject": subjectAll
			},
			"contentType": "application/x-www-form-urlencoded",
			"success": function($data) {
				if($data.success) {
					$("#subject").val("");
					$("#subjectShow").empty();
					$("#subjectList").empty();
					$(".coninfocon").css("display", "block");
					subjectShow(subjectAll);
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		});
	})
	//////////////////学术领域增删改查相关结束//////////////

	//////////////////应用行业增删改查相关开始//////////////
	//填充应用行业
	var industryShow = function(data) {
		$("#industryList").html("");
		$("#industryShow").html("");
		if(data != undefined && data.length != 0) {
			var subs=strToAry(data)
			if(subs.length > 0) {
				for(var i = 0; i < subs.length; i++) {
					$("#industryList").append('<li>' + subs[i] + '<div class="closeThis"></div></li>');
					$("#industryShow").append("<li><div class='h4tit'>" + subs[i] + "</div></li>");

				};
			}
			if($("#industryShow").find("li").length >= 20) {
				$("#industryList").parents(".keyResult").siblings("div.col-w-12").hide();
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
	//应用行业保存
	$("#industrySave").on("click", function() {
		$(this).parents(".modifybox").hide();
		var industrys = $("#industryList li");
		var industryAll = "";
		if(industrys.size() > 0) {
			for(var i = 0; i < industrys.size(); i++) {
				industryAll += industrys[i].innerText;
				industryAll += ',';
			};
			industryAll = industryAll.substring(0, industryAll.length - 1);
		}
		$.ajax({
			"url": "/ajax/professor/industry",
			"type": "POST",
			"data": {
				"id": userid,
				"industry": industryAll
			},
			"contentType": "application/x-www-form-urlencoded",
			"success": function($data) {
				if($data.success) {
					$("#industry").val("");
					$("#industryShow").empty();
					$("#industryList").empty();
					$(".indu").css("display", "none");
					$(".coninfocon").css("display", "block");
					industryShow(industryAll);
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		});
	})
	//////////////////应用行业增删改查相关结束//////////////

	//////////////////研究方向增删改查相关开始//////////////
	//填充研究方向
	var researchAreaShow = function($datas, $datarecords) {
		$("#researchAreaShow").html("");
		$("#researchAreaList").html("");
		if($datas != undefined && $datas.length != 0) {
			$("#researchAreaList").empty();
			for(var i = 0; i < $datas.length; ++i) {
				var $data = $datas[i];
				var $photos = [];
				//获取头像					
				if($datarecords.length > 0) {
					$photos = getRecords($datarecords, $data.caption);
				}
				var showDiv = '<li><div class="favorBox" caption="' + $data.caption + '"><span class="like">' + $data.count + '</span>' + $data.caption + '</div><div class="favorCount" caption="' + $data.caption + '">';
				if($photos.length < 6) {
					for(var j = 0; j < $photos.length; ++j) {
						if($photos[j].img) {
							showDiv += '<span class="like-people" style="background-image: url(../images/head/' + $photos[j].id + '_s.jpg);"></span>';
						} else {
							showDiv += '<span class="like-people" style="background-image: url(../images/default-photo.jpg);"></span>';
						}
					}
				} else {
					for(var j = $photos.length - 5; j < $photos.length; ++j) {
						if($photos[j].img) {
							showDiv += '<span class="like-people" style="background-image: url(../images/head/' + $photos[j].id + '_s.jpg);"></span>';
						} else {
							showDiv += '<span class="like-people" style="background-image: url(../images/default-photo.jpg);"></span>';
						}
					}
					showDiv += '<span class="like-people like-more"></span>';
				}
				showDiv += "</div></li>";

				$("#researchAreaShow").append(showDiv);
				$("#researchAreaList").append("<li class='yjlist'><div><span class='like'>" + $data.count + "</span><span class='ra'>" + $data.caption + "</span><span class='closeThis'></span></div></li>");

			}
			if($("#researchAreaShow").find("li").length >= 10) {
				$("#researchAreaList").parents(".keyResult").siblings("div.col-w-12").hide();
			}
		}
	}
	//判断点赞的用户是否有头像
	var getRecords = function($researchAreaLogs, caption) {
		var ret = [];
		var t = 0;
		for(var i = 0; i < $researchAreaLogs.length; i++) {
			if(caption == $researchAreaLogs[i].caption) {
				ret[t] = {
					id: $researchAreaLogs[i].opreteProfessorId,
					img: $researchAreaLogs[i].hasHeadImage
				}
				t++;
			}
		}
		return ret;
	}
	hotKey(".oinputM", 1);
	//研究方向添加
	$("#researchAreaAdd").click(function() {
		var researchArea = $("#researchArea").val();
		if(!researchArea) {
			$.MsgBox.Alert("提示", "内容不能为空");
			return;
		}
		if(researchArea.length > 30) {
			$.MsgBox.Alert("提示", "研究方向不得超过30个字");
			return;
		}
		var inV = $("#researchAreaList .ra");
		for(var i = 0; i < inV.length; i++) {
			if(inV[i].innerText == researchArea) {
				$.MsgBox.Alert("提示", "不能添加重复内容");
				return;
			}
		}
		if(inV.length == 9) {
			$("#researchAreaList").parents(".keyResult").siblings("div.col-w-12").hide();
		}

		$("#researchAreaList").append("<li class='yjlist'><div><span class='like'>0</span><span class='ra'>" + researchArea + "</span><span class='closeThis'></span></div></li>");
		$("#researchArea").val("");
	});
	$("#researchAreaAdd").siblings("input").keypress(function(){
		var e = event || window.event;
		if(e.keyCode == 13) {
			var researchArea = $("#researchArea").val();
			if(!researchArea) {
				$.MsgBox.Alert("提示", "内容不能为空");
				return;
			}
			if(researchArea.length > 30) {
				$.MsgBox.Alert("提示", "研究方向不得超过30个字");
				return;
			}
			var inV = $("#researchAreaList .ra");
			for(var i = 0; i < inV.length; i++) {
				if(inV[i].innerText == researchArea) {
					$.MsgBox.Alert("提示", "不能添加重复内容");
					return;
				}
			}
			if(inV.length == 9) {
				$("#researchAreaList").parents(".keyResult").siblings("div.col-w-12").hide();
			}
	
			$("#researchAreaList").append("<li class='yjlist'><div><span class='like'>0</span><span class='ra'>" + researchArea + "</span><span class='closeThis'></span></div></li>");
			$("#researchArea").val("");
		}
	})
	//研究方向删除
	$("#researchAreaList").on("click", ".closeThis", function() {
		$(this).parents(".yjlist").remove();
		var liNum = $("#researchAreaList").find("li").length;
		if(liNum < 10) {
			$("#researchAreaList").parents(".keyResult").siblings("div.col-w-12").show();
		}
	})
	//研究方向保存
	$("#researchAreaSave").on("click", function() {
		$(this).parents(".modifybox").hide();
		var $data = [];
		var researchAreas = $("#researchAreaList .yjlist .ra");
		if(researchAreas.length > 0) {
			for(var i = 0; i < researchAreas.length; i++) {
				var $rd = {};
				$rd.professorId = userid;
				$rd.caption = researchAreas[i].innerText;
				$data[i] = $rd;
			}
		}
		var $has = $data.length > 0;
		$.ajax({
			"url": $has ? "../ajax/researchArea" : "../ajax/researchArea/" + userid,
			"type": $has ? "PUT" : "DELETE",
			"data": $has ? JSON.stringify($data) : null,
			"contentType": $has ? "application/json" : "application/x-www-form-urlencoded",
			"success": function($data) {
				if($data.success) {
					$.get("/ajax/professor/info/" + userid, function($data) {
						if($data.success) {
							$("#researchAreaShow").empty("");
							$("#researchAreaShow").parents(".coninfocon").show();
							$("#researchAreaList").parents(".modifybox").hide();
							researchAreaShow($data.data.researchAreas, $data.data.editResearchAreaLogs);
						}
					});

				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		});
	})
	//////////////////研究方向增删改查相关结束//////////////

	//////////////////教育背景增删改查相关开始//////////////
	//填充教育背景
	var eduBgShow = function(data) {
		$("#eduUl").html("");
		eduFil("#eduUl");
		if(data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				var college = "",
					major = "",
					degree = ""
				if(data[i].college) {
					college = ' - ' + data[i].college
				} else {
					data[i].college = "";
				}
				if(data[i].major) {
					major = ' - ' + data[i].major
				} else {
					data[i].major = "";
				}
				if(data[i].degree) {
					degree = ' - ' + data[i].degree
					if(data[i].degree == 0) {

						degree = ""
					}
				} else {
					data[i].degree = 0;
				}
				var timebiye = "";
				if(data[i].year) {
					if(trim(data[i].year) == "至今") {
						timebiye = data[i].year;
					} else {
						timebiye = data[i].year + '年';
					}
				} else {
					timebiye = "";
					data[i].year = "";
				}

				var string = '<li>'
				string += '<div class="showBx"> <div class="h4Font h4tit">'
				string += data[i].school + college + major + degree
				string += '<small class="h6Font">' + timebiye + '</small><em class="btnClick exitlist">编辑</em></div></div>'
				string += '<div class="modifybox"><ul class="cmpFrmList">'
				string += '<li><span class="col-w-2 lableSpan"><span class="requiredcon">* </span>学校名称：</span><div class="col-w-10">'
				string += '<input type="text" class="frmcontype school" placeholder="请填写就读的学校" value="' + data[i].school + '" /><input type="hidden" class="eduId" value="' + data[i].id + '"></div></li>'
				string += '<li><span class="col-w-2 lableSpan">院系名称：</span><div class="col-w-10">'
				string += '<input type="text" class="frmcontype college" placeholder="请填写就读的院系" value="' + data[i].college + '" /></div></li>'
				string += '<li><span class="col-w-2 lableSpan">专业名称：</span><div class="col-w-10">'
				string += '<input type="text" class="frmcontype major" placeholder="请填写就读的专业" value="' + data[i].major + '" /></div></li>'
				string += '<li><span class="col-w-2 lableSpan">学位：</span><div class="col-w-5"><em class="mr_sj"></em>'
				string += '<select class="frmcontype mr_btn" onchange="seleCo(this)">'
				string += '<option value="0">请选择获得的学位</option>'
				string += '<option value="博士">博士</option>'
				string += '<option value="硕士">硕士</option>'
				string += '<option value="学士">学士</option>'
				string += '<option value="大专">大专</option>'
				string += '<option value="其他">其他</option>'
				string += '</select></div></li>'
				string += '<li><span class="col-w-2 lableSpan">毕业时间：</span><div class="col-w-9"><form action="" class="col-w-12" name="formT">'
				string += '<div class="col-w-5" style="position:relative"><em class="mr_sj"></em><input type="text" class="date-btn frmcontype year" flag="1" placeholder="请选择毕业时间" value="' + data[i].year + '" readonly />'
				string += '<div class="mr_calendar_ym clearfix"><ul class="full_year"></ul></div></div>'
				string += '</form></div></li>'
				string += '<li class="saveBtn"><span class="col-w-2">&nbsp;</span><div class="col-w-10">'
				string += '<button type="button" class="frmcontype btnModel saveGo">保存</button>'
				string += '<button type="button" class="frmcontype btnModel btnCancel cancelList">取消</button>'
				string += '<button type="button" class="frmcontype btnModel fontLink">删除本条</button></div></li>'
				string += '</ul></div><li>';
				var $string = $(string)
				$("#eduUl").append($string);
				if(data[i].degree != 0 || data[i].degree != "") {
					$string.find(".mr_btn").css("color", "#666");
				}
				$string.find(".mr_btn").val(data[i].degree);
				yearAdd();
				month();
				$(".full_year li:first-child").before('<li class="yearli">至今</li>');
			}

		}
	}
	//教育背景填充函数
	var eduFil = function(select) {
		var string = '<li class="listnone1" style="display:none;"><div class="modifybox" style="display:block;"><ul class="cmpFrmList">'
		string += '<li><span class="col-w-2 lableSpan"><span class="requiredcon">* </span>学校名称：</span><div class="col-w-10">'
		string += '<input type="text" class="frmcontype school" placeholder="请填写就读的学校" /><input type="hidden" class="eduId"></div></li>'
		string += '<li><span class="col-w-2 lableSpan">院系名称：</span><div class="col-w-10">'
		string += '<input type="text" class="frmcontype college" placeholder="请填写就读的院系" /></div></li>'
		string += '<li><span class="col-w-2 lableSpan">专业名称：</span><div class="col-w-10">'
		string += '<input type="text" class="frmcontype major" placeholder="请填写就读的专业" /></div></li>'
		string += '<li><span class="col-w-2 lableSpan">学位：</span><div class="col-w-5"><em class="mr_sj"></em>'
		string += '<select class="frmcontype mr_btn" onchange="seleCo(this)">'
		string += '<option value="0">请选择获得的学位</option>'
		string += '<option value="博士">博士</option>'
		string += '<option value="硕士">硕士</option>'
		string += '<option value="学士">学士</option>'
		string += '<option value="大专">大专</option>'
		string += '<option value="其他">其他</option>'
		string += '</select></div></li>'
		string += '<li><span class="col-w-2 lableSpan">毕业时间：</span><div class="col-w-9"><form action="" class="col-w-12" name="formT">'
		string += '<div class="col-w-5" style="position:relative"><em class="mr_sj"></em><input type="text" class="date-btn frmcontype year" flag="1" placeholder="请选择毕业时间" readonly/>'
		string += '<div class="mr_calendar_ym clearfix"><ul class="full_year"></ul></div></div>'
		string += '</form></div></li>'
		string += '<li class="saveBtn"><span class="col-w-2">&nbsp;</span><div class="col-w-10">'
		string += '<button type="button" class="frmcontype btnModel saveGo">保存</button>'
		string += '<button type="button" class="frmcontype btnModel btnCancel cancelO">取消</button></div></li>'
		string += '</ul></div><li>';
		$("" + select + "").prepend(string);
	}
	var eduThis = ""
	$("#eduUl").on("click", ".fontLink", function() { //编辑各个列表中的删除
		eduThis = $(this).parents(".modifybox").find(".eduId").val();
		$.MsgBox.Confirm("提示", "确认删除该教育背景？", delEdu);
	});
	//教育背景，对已经添加的背景删除
	var delEdu = function() {
		$.ajax({
			"url": "/ajax/edu/" + eduThis,
			"type": "DELETE",
			"success": function($data) {
				if($data.success) {
					$.get("/ajax/professor/info/" + userid, function($data) {
						if($data.success) {
							$("#eduUl").empty("");
							eduBgShow($data.data.edus);
						}
					});
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		});
	}
	//教育背景保存
	$("#eduUl").on("click", ".saveGo", function() {
		var length = trim($(this).parents(".modifybox").find(".school").val());
		var length2 = trim($(this).parents(".modifybox").find(".college").val());
		var length3 = trim($(this).parents(".modifybox").find(".major").val());

		if(!length) {
			$.MsgBox.Alert("提示", "请填写学校名称");
			return;
		}
		if(length.length > 50) {
			$.MsgBox.Alert("提示", "学校名称不得超过50个字");
			return;
		}
		if(length2.length > 20) {
			$.MsgBox.Alert("提示", "院系名称不得超过20个字");
			return;
		}
		if(length3.length > 20) {
			$.MsgBox.Alert("提示", "专业名称不得超过20个字");
			return;
		}

		var $data = {};
		var $id = $(this).parents(".modifybox").find(".eduId").val();
		if($id) {
			$data.id = $id;
		}
		$data.professorId = userid;
		$data.year = $(this).parents(".modifybox").find(".year").val();
		$data.school = $(this).parents(".modifybox").find(".school").val();
		$data.college = $(this).parents(".modifybox").find(".college").val();
		$data.major = $(this).parents(".modifybox").find(".major").val();
		if($(this).parents(".modifybox").find(".mr_btn").val() != 0) {
			$data.degree = $(this).parents(".modifybox").find(".mr_btn").val();
		}

		$.ajax({
			"url": "/ajax/edu",
			"type": $id ? "PUT" : "POST",
			"data": $id ? JSON.stringify($data) : $data,
			"contentType": $id ? "application/json" : "application/x-www-form-urlencoded",
			"success": function($data) {
				if($data.success) {
					$.get("/ajax/professor/info/" + userid, function($data) {
						if($data.success) {
							$("#eduUl").empty("");
							eduBgShow($data.data.edus);
						}
					});
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		});
	})
	//////////////////教育背景增删改查相关结束///////////////

	//////////////////工作经历增删改查相关开始///////////////
	//填充工作经历
	var timeJobShow = function(data) {
		$("#timeJobShow").html("");
		jobFil("#timeJobShow");
		if(data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				var sDate = "",
					sDateV = "";
				var eDate = "",
					eDateV = "";
				if(data[i].department) {
					var dep = " - " + data[i].department;
					var depart = data[i].department;
				} else {
					var dep = "";
					var depart = ""
				}
				if(data[i].startMonth) {
					sDate = data[i].startMonth.substr(0, 4) + "年" + data[i].startMonth.substr(4, 6) + "月";
					sDateV = data[i].startMonth.substr(0, 4) + "-" + data[i].startMonth.substr(4, 6);
					if(data[i].stopMonth) {
						eDate = data[i].stopMonth.substr(0, 4) + "年" + data[i].stopMonth.substr(4, 6) + "月";
						eDateV = data[i].stopMonth.substr(0, 4) + "-" + data[i].stopMonth.substr(4, 6);
					} else {
						eDate = "至今";
						eDateV = "至今";
					}
				}
				var string = '<li>'
				string += ' <div class="showBx"><div class="h4Font h4tit">' + data[i].company + dep + ' - ' + data[i].title + '<small class="h6Font">';
				string += sDate;
				if(eDate) string += (" - " + eDate);
				string += '</small><em class="btnClick exitlist">编辑</em></div></div>';
				string += '<div class="modifybox"><ul class="cmpFrmList">'
				string += '<li><span class="col-w-2 lableSpan"><span class="requiredcon">* </span>机构名称：</span><div class="col-w-10">'
				string += '<input type="text" class="frmcontype jobCompany" placeholder="请填写就职的机构" value="' + data[i].company + '" /><input type="hidden" class="jobId" value="' + data[i].id + '"></div></li>'
				string += '<li><span class="col-w-2 lableSpan">所在部门：</span><div class="col-w-10">'
				string += '<input type="text" class="frmcontype jobdepartment" placeholder="请填写就职的部门" value="' + depart + '" /></div></li>'
				string += '<li><span class="col-w-2 lableSpan"><span class="requiredcon">* </span>职位：</span><div class="col-w-10">'
				string += '<input type="text" class="frmcontype jobTitle" placeholder="请填写担任的职位" value="' + data[i].title + '" /></div></li>'
				string += '<li><span class="col-w-2 lableSpan">任职时间：</span><div class="col-w-9"><form action="" class="col-w-12" name="formT">'
				string += '<div class="col-w-5" style="position:relative"><input type="text" class="date-btn frmcontype StartMonth" flag="2" difference="1" placeholder="请选择起始时间" readonly value="' + sDateV + '" />'
				string += '<div class="mr_calendar_ym clearfix"><ul class="mr_year"></ul><ul class="mr_month"></ul></div></div>'
				string += '<div class="col-w-1 alignCenter">至</div>'
				string += '<div class="col-w-5" style="position:relative"><input type="text" class="date-btn frmcontype StopMonth" flag="2" difference="2" placeholder="请选择结束时间" readonly value="' + eDateV + '" />'
				string += '<div class="mr_calendar_ym clearfix"><ul class="mr_year"></ul><ul class="mr_month"></ul></div></div>'
				string += '</form></div></li>'
				string += '<li class="saveBtn"><span class="col-w-2">&nbsp;</span><div class="col-w-10">'
				string += '<button type="button" class="frmcontype btnModel saveGo">保存</button>'
				string += '<button type="button" class="frmcontype btnModel btnCancel cancelList">取消</button>'
				string += '<button type="button" class="frmcontype btnModel fontLink">删除本条</button></div></li>'
				string += '</ul></div><li>';
				$("#timeJobShow").append(string);
				yearAdd();
				month();
			}
		}
	}
	var jobFil = function(select) {
		var string = '<li class="listnone1" style="display:none;"><div class="modifybox" style="display:block;"><ul class="cmpFrmList">'
		string += '<li><span class="col-w-2 lableSpan"><span class="requiredcon">* </span>机构名称：</span><div class="col-w-10">'
		string += '<input type="text" class="frmcontype jobCompany" placeholder="请填写就职的机构" /><input type="hidden" class="jobId"></div></li>'
		string += '<li><span class="col-w-2 lableSpan">所在部门：</span><div class="col-w-10">'
		string += '<input type="text" class="frmcontype jobdepartment" placeholder="请填写就职的部门" /></div></li>'
		string += '<li><span class="col-w-2 lableSpan"><span class="requiredcon">* </span>职位：</span><div class="col-w-10">'
		string += '<input type="text" class="frmcontype jobTitle" placeholder="请填写担任的职位" /></div></li>'
		string += '<li><span class="col-w-2 lableSpan">任职时间：</span><div class="col-w-9"><form action="" class="col-w-12" name="formT">'
		string += '<div class="col-w-5" style="position:relative"><input type="text" class="date-btn frmcontype StartMonth" flag="2" difference="1" placeholder="请选择起始时间" readonly />'
		string += '<div class="mr_calendar_ym clearfix"><ul class="mr_year"></ul><ul class="mr_month"></ul></div></div>'
		string += '<div class="col-w-1 alignCenter">至</div>'
		string += '<div class="col-w-5" style="position:relative"><input type="text" class="date-btn frmcontype StopMonth" flag="2" difference="2" placeholder="请选择结束时间" readonly />'
		string += '<div class="mr_calendar_ym clearfix"><ul class="mr_year"> </ul><ul class="mr_month"></ul></div></div>'
		string += '</form></div></li>'
		string += '<li class="saveBtn"><span class="col-w-2">&nbsp;</span><div class="col-w-10">'
		string += '<button type="button" class="frmcontype btnModel saveGo">保存</button>'
		string += '<button type="button" class="frmcontype btnModel btnCancel cancelO">取消</button></div></li>'
		string += '</ul></div><li>';
		$("" + select + "").prepend(string);
	}
	var jobThis = ""
	$("#timeJobShow").on("click", ".fontLink", function() { //编辑各个列表中的删除
		jobThis = $(this).parents(".modifybox").find(".jobId").val();
		$.MsgBox.Confirm("提示", "确认删除该工作经历？", delTimeJob);
	});
	//社会兼职，对添加的兼职删除
	var delTimeJob = function() {
		$.ajax({
			"url": "/ajax/job/" + jobThis,
			"type": "DELETE",
			"success": function($data) {
				if($data.success) {
					$.get("/ajax/professor/info/" + userid, function($data) {
						if($data.success) {
							$("#timeJobShow").empty("");
							timeJobShow($data.data.jobs);
						}
					});
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		});
	}
	//社会兼职保存	
	$("#timeJobShow").on("click", ".saveGo", function() {
		var length1 = trim($(this).parents(".modifybox").find(".jobCompany").val());
		var length2 = trim($(this).parents(".modifybox").find(".jobTitle").val());
		var length3 = trim($(this).parents(".modifybox").find(".StartMonth").val());
		var length4 = trim($(this).parents(".modifybox").find(".StopMonth").val());
		var length5 = trim($(this).parents(".modifybox").find(".jobdepartment").val());

		if(length1.length > 50) {
			$.MsgBox.Alert("提示", "机构名称不得超过50个字");
			return;
		}
		if(length5.length > 20) {
			$.MsgBox.Alert("提示", "部门名称不得超过20个字");
			return;
		}

		if(!length3 && length4) {
			$.MsgBox.Alert("提示", "请选择工作的开始时间");
			return;
		} else if(length3 && !length4) {
			$.MsgBox.Alert("提示", "请选择工作的结束时间");
			return;
		}
		if(!length1 && length2) {
			$.MsgBox.Alert("提示", "请填写机构名称");
			return;
		} else if(length1 && !length2) {
			$.MsgBox.Alert("提示", "请填写职位");
			return;
		} else if(!length1 && !length2) {
			$.MsgBox.Alert("提示", "请填写机构名称和职位");
			return;
		}
		var $data = {};
		var $id = $(this).parents(".modifybox").find(".jobId").val();
		if($id) {
			$data.id = $id;
		}
		$data.professorId = userid;
		$data.company = $(this).parents(".modifybox").find(".jobCompany").val();
		$data.department = $(this).parents(".modifybox").find(".jobdepartment").val();
		var s = $(this).parents(".modifybox").find(".StartMonth").val();
		var st = $(this).parents(".modifybox").find(".StopMonth").val();
		if(s) {
			$data.startMonth = s.substr(0, 4) + s.substr(5, 6);
		}
		if(st) {
			if(st == "至今") {} else {
				$data.stopMonth = st.substr(0, 4) + st.substr(5, 6);
			}
		}
		$data.title = $(this).parents(".modifybox").find(".jobTitle").val();
		$.ajax({
			"url": "/ajax/job",
			"type": $id ? "PUT" : "POST",
			"data": $id ? JSON.stringify($data) : $data,
			"contentType": $id ? "application/json" : "application/x-www-form-urlencoded",
			beforeSend: function() {
				//console.log(this.data)
			},
			"success": function($data) {
				if($data.success) {

					$.get("/ajax/professor/info/" + userid, function($data) {
						if($data.success) {
							$("#timeJobShow").empty("");
							timeJobShow($data.data.jobs);
						}
					});
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		});
	})
	//////////////////工作经历增删改查相关结束///////////////	

	//////////////////项目经历增删改查相关开始///////////////
	//填充项目经历
	var projectShow = function(data) {
		$("#projectShow").html("");
		projectFil("#projectShow")
		if(data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				if(!data[i].descp) {
					data[i].descp = "";
				}
				var sDate = "",
					sDateV = "";
				var eDate = "",
					eDateV = "";
				if(data[i].startMonth) {
					sDate = data[i].startMonth.substr(0, 4) + "年" + data[i].startMonth.substr(4, 6) + "月";
					sDateV = data[i].startMonth.substr(0, 4) + "-" + data[i].startMonth.substr(4, 6);
					if(data[i].stopMonth) {
						eDate = data[i].stopMonth.substr(0, 4) + "年" + data[i].stopMonth.substr(4, 6) + "月";
						eDateV = data[i].stopMonth.substr(0, 4) + "-" + data[i].stopMonth.substr(4, 6);
					} else {
						eDate = "至今";
						eDateV = "至今";
					}
				}

				var stringHtml = '<li>';
				stringHtml += '<div class="showBx"><div class="h4Font h4tit">' + data[i].name + '<small class="h6Font">'
				stringHtml += sDate;
				if(eDate) stringHtml += (" - " + eDate);
				stringHtml += '</small><em class="btnClick exitlist">编辑</em></div>';
				stringHtml += '<div class="h5Font">' + data[i].descp + '</div>';
				stringHtml += '</div>';
				stringHtml += '<div class="modifybox"><ul class="cmpFrmList">'
				stringHtml += '<li><span class="col-w-2 lableSpan"><span class="requiredcon">* </span>项目名称：</span><div class="col-w-10">'
				stringHtml += '<input type="text" class="frmcontype projectName" placeholder="请填写项目名称" value="' + data[i].name + '" /><input type="hidden" class="projectId"  value="' + data[i].id + '"></div></li>'
				stringHtml += '<li><span class="col-w-2 lableSpan">项目时间：</span><div class="col-w-9"><form action="" class="col-w-12" name="formT">'
				stringHtml += '<div class="col-w-5" style="position:relative"><input type="text" class="date-btn frmcontype project StartMonth" flag="2" difference="1" placeholder="请选择起始时间" readonly value="' + sDateV + '" />'
				stringHtml += '<div class="mr_calendar_ym clearfix"><ul class="mr_year"></ul><ul class="mr_month"></ul></div></div>'
				stringHtml += '<div class="col-w-1 alignCenter">至</div>'
				stringHtml += '<div class="col-w-5" style="position:relative"><input type="text" class="date-btn frmcontype project StopMonth" flag="2" difference="2" placeholder="请选择结束时间" readonly value="' + eDateV + '" />'
				stringHtml += '<div class="mr_calendar_ym clearfix"><ul class="mr_year"> </ul><ul class="mr_month"></ul></div></div>'
				stringHtml += '</form></div></li>'
				stringHtml += '<li><span class="col-w-2 lableSpan">项目描述：</span><div class="col-w-10">'
				stringHtml += '<div class="msgContbox"><textarea class="frmcontype msgCont projectDescp" placeholder="请填写项目描述">' + data[i].descp + '</textarea><span class="msgconNum"><em class="limitNum">' + data[i].descp.length + '</em>/200</span></div></div></li>'
				stringHtml += '<li class="saveBtn"><span class="col-w-2">&nbsp;</span><div class="col-w-10">'
				stringHtml += '<button type="button" class="frmcontype btnModel saveGo">保存</button>'
				stringHtml += '<button type="button" class="frmcontype btnModel btnCancel cancelList">取消</button>'
				stringHtml += '<button type="button" class="frmcontype btnModel fontLink">删除本条</button></div></li>'
				var $stringHtml = $(stringHtml);
				$("#projectShow").append($stringHtml);
				limitObj($stringHtml.find(".projectDescp"), 200)
				yearAdd();
				month();
			}
		}
	}
	//项目经历添加填充
	var projectFil = function(select) {
		var string = '<li class="listnone1" style="display:none;"><div class="modifybox" style="display:block;"><ul class="cmpFrmList">'
		string += '<li><span class="col-w-2 lableSpan"><span class="requiredcon">* </span>项目名称：</span><div class="col-w-10">'
		string += '<input type="text" class="frmcontype projectName" placeholder="请填写项目名称" /><input type="hidden" class="projectId"></div></li>'
		string += '<li><span class="col-w-2 lableSpan">项目时间：</span><div class="col-w-9"><form action="" class="col-w-12" name="formT">'
		string += '<div class="col-w-5" style="position:relative"><input type="text" class="date-btn frmcontype project StartMonth" flag="2" difference="1" readonly placeholder="请选择起始时间" />'
		string += '<div class="mr_calendar_ym clearfix"><ul class="mr_year"></ul><ul class="mr_month"></ul></div></div>'
		string += '<div class="col-w-1 alignCenter">至</div>'
		string += '<div class="col-w-5" style="position:relative"><input type="text" class="date-btn frmcontype project StopMonth" flag="2" difference="2" readonly placeholder="请选择结束时间" />'
		string += '<div class="mr_calendar_ym clearfix"><ul class="mr_year"> </ul><ul class="mr_month"></ul></div></div>'
		string += '</form></div></li>'
		string += '<li><span class="col-w-2 lableSpan">项目描述：</span><div class="col-w-10">'
		string += '<div class="msgContbox"><textarea class="frmcontype msgCont projectDescp" placeholder="请填写项目描述"></textarea><span class="msgconNum"><em class="limitNum">0</em>/200</span></div></div></li>'
		string += '<li class="saveBtn"><span class="col-w-2">&nbsp;</span><div class="col-w-10">'
		string += '<button type="button" class="frmcontype btnModel saveGo">保存</button>'
		string += '<button type="button" class="frmcontype btnModel btnCancel cancelO">取消</button></div></li>'
		string += '</ul></div><li>';
		var $ostr = $(string);
		$("" + select + "").prepend($ostr);
		limitObj($ostr.find(".projectDescp"), 200)
	}
	var projectThis = ""
	$("#projectShow").on("click", ".fontLink", function() { //编辑各个列表中的删除
		projectThis = $(this).parents(".modifybox").find(".projectId").val();
		$.MsgBox.Confirm("提示", "确认删除该项目经历？", delProject);
	});
	//项目经历，对添加的项目删除
	var delProject = function() {
		$.ajax({
			"url": "/ajax/project/" + projectThis,
			"type": "DELETE",
			"success": function($data) {
				if($data.success) {
					$.get("/ajax/professor/info/" + userid, function($data) {
						if($data.success) {
							$("#projectShow").empty("");
							projectShow($data.data.projects);
						}
					});
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		});
	}

	//项目经历保存		
	$("#projectShow").on("click", ".saveGo", function() {
		var length = trim($(this).parents(".modifybox").find(".projectName").val());
		var length1 = trim($(this).parents(".modifybox").find(".StartMonth").val());
		var length2 = trim($(this).parents(".modifybox").find(".StopMonth").val());
		var lengthDescp = trim($(this).parents(".modifybox").find(".projectDescp").val());

		//		if(lengthDescp.length>200){$.MsgBox.Alert("提示", "项目描述不得超过200个字");return;}
		if(!length) {
			$.MsgBox.Alert("提示", "请填写项目名称");
			return;
		}
		if(length.length > 50) {
			$.MsgBox.Alert("提示", "项目名称不得超过50个字");
			return;
		}

		if(length1 && !length2) {
			$.MsgBox.Alert("提示", "没有选结束时间");
			return;
		}
		if(!length1 && length2) {
			$.MsgBox.Alert("提示", "没有选开始时间");
			return;
		}
		var $data = {};
		var $id = $(this).parents(".modifybox").find(".projectId").val();
		if($id) {
			$data.id = $id;
		}
		$data.professorId = userid;
		var s = $(this).parents(".modifybox").find(".StartMonth").val();
		var st = $(this).parents(".modifybox").find(".StopMonth").val();
		if(s) {
			$data.startMonth = s.substr(0, 4) + s.substr(5, 6);
		}
		if(st) {
			if(st == "至今") {} else {
				$data.stopMonth = st.substr(0, 4) + st.substr(5, 6);
			}
		}

		$data.name = $(this).parents(".modifybox").find(".projectName").val()
		$data.descp = $(this).parents(".modifybox").find(".projectDescp").val()
		$.ajax({
			"url": "../ajax/project",
			"type": $id ? "PUT" : "POST",
			"data": $id ? JSON.stringify($data) : $data,
			"contentType": $id ? "application/json" : "application/x-www-form-urlencoded",
			"success": function($data) {
				if($data.success) {
					$.get("/ajax/professor/info/" + userid, function($data) {
						if($data.success) {
							$("#projectShow").empty("");
							projectShow($data.data.projects);
							//							yearAdd();
							//							month();
						}
					});
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		});
	})
	//////////////////项目经历增删改查相关结束///////////////

	//////////////////荣誉奖项增删改查相关开始///////////////
	var honorShow = function(data) {
		$("#honorShow").html("");
		hounerFil("#honorShow");
		if(data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				var timeho = "";
				if(data[i].year) {
					timeho = data[i].year + '年';
				} else {
					data[i].year = "";
				}
				if(!data[i].descp) {
					data[i].descp = "";
				}
				var stringHtml = '<li>';
				stringHtml += '<div class="showBx"><div class="h4Font h4tit">' + data[i].name + '<small class="h6Font">' + timeho + '</small><em class="btnClick exitlist">编辑</em></div>';
				stringHtml += '<div class="h5Font">' + data[i].descp + '</div>';
				stringHtml += '</div>';
				stringHtml += '<div class="modifybox"><ul class="cmpFrmList">'
				stringHtml += '<li><span class="col-w-2 lableSpan"><span class="requiredcon">* </span>奖项名称：</span><div class="col-w-10">'
				stringHtml += '<input type="text" class="frmcontype honorName" placeholder="请填写奖项名称" value="' + data[i].name + '" /><input type="hidden" class="honorId"  value="' + data[i].id + '"></div></li>'
				stringHtml += '<li><span class="col-w-2 lableSpan">获奖时间：</span><div class="col-w-9"><form action="" class="col-w-12" name="formT">'
				stringHtml += '<div class="col-w-5" style="position:relative"><input type="text" class="date-btn frmcontype project honorYear" placeholder="请填写奖项时间" readonly flag="1" value="' + data[i].year + '" />'
				stringHtml += '<div class="mr_calendar_ym clearfix"><ul class="full_year"></ul></div></div>'
				stringHtml += '</form></div></li>'
				stringHtml += '<li><span class="col-w-2 lableSpan">获奖描述：</span><div class="col-w-10">'
				stringHtml += '<div class="msgContbox"><textarea class="frmcontype msgCont honorDescp" placeholder="请填写获奖描述">' + data[i].descp + '</textarea><span class="msgconNum"><em class="limitNum">' + data[i].descp.length + '</em>/200</span></div></div></li>'
				stringHtml += '<li class="saveBtn"><span class="col-w-2">&nbsp;</span><div class="col-w-10">'
				stringHtml += '<button type="button" class="frmcontype btnModel saveGo">保存</button>'
				stringHtml += '<button type="button" class="frmcontype btnModel btnCancel cancelList">取消</button>'
				stringHtml += '<button type="button" class="frmcontype btnModel fontLink">删除本条</button></div></li>'
				var $stringHtml = $(stringHtml)
				$("#honorShow").append($stringHtml);
				yearAdd();
				limitObj($stringHtml.find(".honorDescp"), 200)
			}
		}
	}
	var hounerFil = function(select) {
		var string = '<li class="listnone1" style="display:none;"><div class="modifybox" style="display:block;"><ul class="cmpFrmList">'
		string += '<li><span class="col-w-2 lableSpan"><span class="requiredcon">* </span>奖项名称：</span><div class="col-w-10">'
		string += '<input type="text" class="frmcontype honorName" placeholder="请填写奖项名称" /><input type="hidden" class="honorId"></div></li>'
		string += '<li><span class="col-w-2 lableSpan">获奖时间：</span><div class="col-w-9"><form action="" class="col-w-12" name="formT">'
		string += '<div class="col-w-5" style="position:relative"><input type="text" class="date-btn frmcontype honorYear" flag="1" readonly placeholder="请选择获奖时间" />'
		string += '<div class="mr_calendar_ym clearfix"><ul class="full_year"></ul></div></div>'
		string += '</form></div></li>'
		string += '<li><span class="col-w-2 lableSpan">获奖描述：</span><div class="col-w-10">'
		string += '<div class="msgContbox"><textarea class="frmcontype msgCont honorDescp" placeholder="请填写获奖描述"></textarea><span class="msgconNum"><em class="limitNum">0</em>/200</span></div></div></li>'
		string += '<li class="saveBtn"><span class="col-w-2">&nbsp;</span><div class="col-w-10">'
		string += '<button type="button" class="frmcontype btnModel saveGo">保存</button>'
		string += '<button type="button" class="frmcontype btnModel btnCancel cancelO">取消</button></div></li>'
		string += '</ul></div><li>';
		var $ostr = $(string);
		$("" + select + "").prepend($ostr);
		limitObj($ostr.find(".honorDescp"), 200)

	}
	var honorThis = ""
	$("#honorShow").on("click", ".fontLink", function() {
		honorThis = $(this).parents(".modifybox").find(".honorId").val();
		$.MsgBox.Confirm("提示", "确认删除该荣誉奖项？", delHonor);
	});
	var delHonor = function() { //荣誉及奖项 ，对添加的专利删除
		$.ajax({
			"url": "/ajax/honor/" + honorThis,
			"type": "DELETE",
			"success": function($data) {
				if($data.success) {
					$.get("/ajax/professor/info/" + userid, function($data) {
						if($data.success) {
							$("#honorShow").empty("");
							honorShow($data.data.honors);
						}
					});
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		});
	}

	//荣誉及奖项保存
	$("#honorShow").on("click", ".saveGo", function() {
		var length = trim($(this).parents(".modifybox").find(".honorName").val());
		var lengthDescp = trim($(this).parents(".modifybox").find(".honorDescp").val());

		if(!length) {
			$.MsgBox.Alert("提示", "请填写奖项名称");
			return;
		}
		if(length.length > 50) {
			$.MsgBox.Alert("提示", "奖项名称不得超过50个字");
			return;
		}
		//		if(lengthDescp.length>200){$.MsgBox.Alert("提示", "获奖描述不得超过200个字");return;}
		var $data = {};
		var $id = $(this).parents(".modifybox").find(".honorId").val();
		if($id) {
			$data.id = $id;
		}
		$data.professorId = userid;
		$data.year = $(this).parents(".modifybox").find(".honorYear").val();
		$data.name = $(this).parents(".modifybox").find(".honorName").val();
		$data.descp = $(this).parents(".modifybox").find(".honorDescp").val();
		console.log($data.descp);
		$.ajax({
			"url": "../ajax/honor",
			"type": $id ? "PUT" : "POST",
			"data": $id ? JSON.stringify($data) : $data,
			"contentType": $id ? "application/json" : "application/x-www-form-urlencoded",
			"success": function($data) {
				if($data.success) {
					$.get("/ajax/professor/info/" + userid, function($data) {
						if($data.success) {
							$("#honorShow").empty("");
							honorShow($data.data.honors);
							//yearAdd();
						}
					});
				} else {
					$.MsgBox.Alert("提示", $data.msg);
				}
			}
		});
	})
	//////////////////荣誉奖项增删改查相关结束///////////////

	//////////////////相关操作按钮///////////////
	//用户基本信息编辑
	$(".headconBox").on("click", ".proEdit", function() {
		$(this).parents(".reInfoBlock").find(".modifybox").show();
		$(this).parents(".reInfoBlock").find(".coninfocon").hide();
		$(".head-left").css("top", "100px");
		//点击取消的操作
		$(".btnCancel").click(function() {
			$(".head-left").css("top", "");
			$(this).parents(".reInfoBlock").find(".coninfocon").show();
			$(this).parents(".reInfoBlock").find(".modifybox").hide();
			getInfo(userid);

		});
	});
	//获取点击那个编辑
	$(".leftconBox").on("click", ".edit", function() {
		$(this).parents(".coninfobox").find(".modifybox").show();
		$(this).parents(".coninfobox").find(".coninfocon").hide();
		//点击取消的操作
		$(".btnCancel").click(function() {
			$(this).parents(".coninfobox").find(".modifybox").hide();
			$(this).parents(".coninfobox").find(".coninfocon").show();
			getInfo(userid);

		});
	});
	$(".addedit").on("click", function() { //点击添加按钮
		$(this).parents(".coninfobox").find(".listnone1").toggle(100);
		$(this).parents(".coninfobox").find(".showBx").show();
		$(this).parents(".coninfobox").find(".showBx + .modifybox").hide();
		$(this).parents(".coninfobox").find(".listnone1").find(".frmcontype").val("");
		$(this).parents(".coninfobox").find(".listnone1").find(".mr_btn").val("0");
	});
	$(".coninfobox").on("click", ".cancelO", function() { //添加模块的取消
		$(this).parents(".listnone1").toggle(100);
	});
	$(".coninfobox").on("click", ".exitlist", function() { //编辑列表模块
		$(this).parents(".showBx").hide().siblings(".modifybox").show();
		$(this).parents("li").siblings().find(".showBx").show().siblings(".modifybox").hide();
	});
	$(".coninfobox").on("click", ".cancelList", function() { //编辑各个列表中的取消
		$(this).parents(".modifybox").hide();
		$(this).parents(".modifybox").siblings(".showBx").show();
		getInfo(userid);
	});
	//点击查看自己的主页
	$("#showMyself").click(function() {
		$(this).attr("href", "userInforShow.html?professorId=" + userid);
	})

	function trim(str) { //删除左右两端的空格			　　
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}
})
