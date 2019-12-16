$(document).ready(function() {
	var resourceId=GetQueryString("id");
	if(resourceId) {
		$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
		getRecourceMe();
	}
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	var temp = [];
	var hbur,hburEnd;
	ue = UE.getEditor('editor', {});
	/*获取资源信息*/
	function getRecourceMe() {
			$.ajax({
					"url": "/ajax/resResult/qo",
					"type": "GET",
					"success": function(data) {
						console.log(data);
						if(data.success) {
							$("#uploadDd").siblings().remove();
							$("#fileList").append("<dd></dd><dd></dd>");
							temp=[];
							resourceHtml(data.data);
							proList(resourceId)
						}
					},
					"data": {
						"id":resourceId
					},
					dataType: "json",
					'error':function() {
						$.MsgBox.Alert('提示', '服务器连接超时！');
					}
				});
	}
	function proList(par) {
		$.ajax({
			"url": "/ajax/resResult/researcher",
			"type": "GET",
			"data": {
				id: par
			},
			"success": function(data) {
				if(data.success) {
					var $da = data.data
					if($da) {
						var oSt1 = ''
						for(var i=0;i<$da.length;i++){
							oSt1+='<li data-id="'+$da[i].professorId+'">'+$da[i].name+'<div class="closeThis"></div></li>'
						}
						$("#keyWordlist2").html(oSt1);
					}else{
						$("#keyWordlist2").html("");
					}
				}
			},
			"data": {
				"id":resourceId
			},
			dataType: "json",
			'error':function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	function orgname(par) {
		$.ajax({
			"url": "ajax/org/"+par,
			"type": "GET",
			"success": function(data) {
				if(data.success) {
					$('#organizationName').val(data.data.name)
					org.id = par
				}
			},
			"data": {
				"id":resourceId
			},
			dataType: "json",
			'error':function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*处理资源html代码*/
	function resourceHtml($da) {
		$("#resourceName").val($da.name);//名字
		if($da.orgId) {//所属机构
			orgname($da.orgId)
		}
		if($da.descp) {//所属机构
			$("#descp").val($da.descp);
		}
		if($da.applyDescp) {//厂商型号
			$("#applyDescp").val($da.applyDescp);
		}
		if($da.prospect) {//性能参数
			$("#prospect").val($da.prospect);
		}
		if($da.indicator) {//合作备注
			$("#indicator").val($da.indicator);
		}
		if($da.benefit) {//合作备注
			$("#benefit").val($da.benefit);
		}
		if($da.department) {//合作备注
			$("#department").val($da.department);
		}
		if($da.industry) {
			var oSub=$da.industry.split(",");
			var oSt="";
			for(var i=0;i<oSub.length;i++){
				oSt+='<li>'+oSub[i]+'<div class="closeThis"></div></li>'
			}
			$("#keyWordlist").html(oSt);
			if(oSub.length>4){
				$("#KeyWord").parent().addClass("displayNone");
			}
		}else{
			$("#keyWordlist").html("");
		}
		if($da.subject) {
			var oSub1=$da.subject.split(",");
			var oSt1="";
			for(var i=0;i<oSub1.length;i++){
				oSt1+='<li>'+oSub1[i]+'<div class="closeThis"></div></li>'
			}
			$("#keyWordlist1").html(oSt1);
			if(oSub1.length>4){
				$("#KeyWord1").parent().addClass("displayNone");
			}
		}else{
			$("#keyWordlist1").html("");
		}
		if($da.pic.split(',').length) {
			console.log($da.pic)
			var arr=[];
			for(var i=0;i<$da.pic.split(',').length;i++) {
				var oString='<dd>' +
					'<div class="imgItem">'+
						'<img src="'+"/data/researchResult"+$da.pic.split(",")[i]+'"/>' +
					'</div>'+
					'<div class="file-panel">' +
						'<span class="cancel" flag=1></span>' +
					'</div>' +
				'</dd>'
				arr[i]=oString;
				temp[i] = $da.pic.split(",")[i];
			}
		$("#fileList dd").eq(2).remove();
			if($da.pic.split(",").length==1) {
				$("#fileList").prepend(arr[0]);
			}else if($da.pic.split(",").length==2) {
				$("#fileList dd").eq(1).remove();
				$("#fileList").prepend(arr[1]);
				$("#fileList").prepend(arr[0]);
			}else if($da.pic.split(",").length==3) {
				$("#fileList dd").eq(1).remove();
				$("#fileList").prepend(arr[2]);
				$("#fileList").prepend(arr[1]);
				$("#fileList").prepend(arr[0]);
			}
			
				
			
		}
	}
	var uploader = WebUploader.create({
		auto: true,
		fileNumLimit: 3,
		swf: '../js/webuploader/Uploader.swf',
		server: '../ajax/resResult/upload',
		fileSingleSizeLimit: 2 * 1024 * 1024,
		pick: {
			id: "#filePicker",
			multiple: false
		},
		accept: {
			title: 'Images',
			extensions: 'jpg,jpeg,png',
			mimeTypes: 'image/jpg,image/png,image/jpeg'
		}

	});

	// 当有文件添加进来的时候
	uploader.on('fileQueued', function(file) {
		fileId = file.id;
		var $len = $("#fileList").find("img").length;
		if($len == 0 || $len == 1) {
			var oRemove = $("#fileList").find("dd");
			oRemove.eq(oRemove.length - 1).remove();
		} 
		var $li = $(
				'<dd>' +
					'<div class="imgItem" id="' + file.id + '">'+
						'<img />' +
					'</div>'+
				//'<div class="info">' + file.name + '</div>' +
				'</dd>'
			),
			$btns = $('<div class="file-panel">' +
				'<span class="cancel"></span>' +
				'</div>').appendTo($li),
			$img = $li.find('img');
		var $list = $("#fileList");
		if($len == 1) {
			$list.find("dd").eq(0).after($li)
		} else if($len == 2) {
			$list.find("dd").eq(1).after($li)
		} else {
			$list.prepend($li);
		}

		// 创建缩略图
		// 如果为非图片文件，可以不用调用此方法。
		// thumbnailWidth x thumbnailHeight 为 100 x 100
		uploader.makeThumb(file, function(error, src) {
			if(error) {
				$img.replaceWith('<span>不能预览</span>');
				return;
			}
			$img.attr('src', src);
		}, 1, 1);
		/*$li.on('mouseenter', function() {
			$btns.stop().animate({
				height: 30
			});
		});

		$li.on('mouseleave', function() {
			$btns.stop().animate({
				height: 0
			});
		});*/

	});
	uploader.onError = function(code) {
		console.log(code)
		$.MsgBox.Alert('提示', '请上传jpg、jpeg、png格式的图片，大小不超过2M')
	};
	uploader.on('uploadSuccess', function(file, data) {
		console.log(data)
		if(data.success) {
				uploader.removeFile(fileId);
				temp.push(data.data[0].uri);
		}else{
			$.MsgBox.Alert('提示', '只支持jpeg/jpg/png格式的图片');
		}
	});
	/*删除图片*/
	$("#fileList").on("click", ".cancel", function() {
		var flag=$(this).attr("flag");
		var oNum=$(this).parents("dd").index();
		temp.splice(oNum, 1);
		$(this).parent().parent().remove();
		var $len = $("#fileList").find("img").length;
		if($len != 2) {
			$("#fileList").append("<dd></dd>")
		}
		
	});
	/*资源名称*/
	$("#resourceName").bind({
		focus: function() {
			$("#resourceNamePrompt").show();
		},
		blur: function() {
			$("#resourceNamePrompt").hide();
		},
		keyup: function() {
			if($(this).val().length > 50) {
				$(this).val($(this).val().substr(0, 50));
			}
		}
	})
	hotKey(".oinput");
	//校验关键字
	$("#KeyWord,#KeyWord1").on({
		focus: function() {
			$(this).parents('.form-item').find('.frmconmsg').text("最多可添加20个关键词，每个关键词15字以内");
		},
		blur: function() {
			$(this).parents('.form-item').find('.frmconmsg').text("");
		}
	})
	$("#keyWordlist,#keyWordlist1").on("click", ".closeThis", function() {
		$(this).parent().remove();
		var liNum = $("#keyWordlist").find("li").length;
		if(liNum < 20) {
			$("#keyWordlist").parents(".keyResult").siblings("div.col-w-12").show();
		}
	})
	
	$("#keyWordlist2").on("click", ".closeThis", function() {
		$(this).parent().remove();
	})
	hotKey1(".oinput1");
	$(".keydrop1").on("click", "li", function() {
		var oValue = $(this).text();
		var oJudge = $(this).parents(".col-w-12").siblings().find("ul.ulspace li");
		var addNum = $(this).parents(".keydrop1").siblings("input").attr("data-num");
		for(var i = 0; i < oJudge.length; i++) {
			if(oValue == oJudge[i].innerText) {
				$.MsgBox.Alert('提示', '添加内容不能重复');
				return;
			}
		}
		$(this).parents(".col-w-12").siblings().find("ul.ulspace").append('<li data-id="' + $(this).attr('data-id') + '">' + oValue + '<div class="closeThis"></div></li>');
		$(this).parents(".keydrop1").siblings("input").val("");
		$(this).parents(".keydrop1").siblings("button").hide();
		if(oJudge.length == addNum - 1) {
			$(this).parents(".keydrop1").siblings("input").val("");
			$(this).parents(".col-w-12").hide();
		}
		$(this).parent("ul").html("")
	})
	function hotKey1(sel, num) {
		$(sel).bind({
			paste: function(e) {
				var pastedText;
				if (window.clipboardData  &&  window.clipboardData.getData)  {  // IE
					pastedText  = $(this).val() +  window.clipboardData.getData('Text');          
				}else{            
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
							"url": "/ajax/professor/qaByName",
							"type": "GET",
							data: {
								name: ti,
								total: 3
							},
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
												oSr += '<li data-id="' + data.data[i].id + '">' + data.data[i].name + '<div class="closeThis"></div></li>';
											}
											$this.siblings(".keydrop1").find("ul").html(oSr);
										}
									}	
								} else {
									$this.siblings(".keydrop").addClass("displayNone");
									$this.siblings(".keydrop").find("ul").html("");
								}
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
	}
	/*所属机构*/
	var org = {
		id: '',
		name: ''
	}
	$("#organizationName").bind({
		focus: function() {
			$("#organization").show();
			$("#departmentList").show();
		},
		blur: function() {
			$("#organization").hide();
			if (org.name != $("#organizationName").val()) {
				$("#organizationName").val('')
				org.id =""
			}
			setTimeout(function(){
				$("#departmentList").hide();
			},100)
		},
		keyup: function() {
			if($(this).val().length > 50) {
				$(this).val($(this).val().substr(0, 50));
			} else if(0 < $(this).val().length < 50) {
					$.ajax({
					"url": "/ajax/org/querylimit",
					"type": "GET",
					"success": function(data) {
						console.log(data);
						if(data.success) {
							if(data.data==null) {
								$("#departmentList ul").html("");
							}else{
								addHtml(data.data);
							}
						}
					},
					"data": {
						name:$(this).val(),
						rows: 3
					},
					dataType: "json",
					'error':function() {
						$.MsgBox.Alert('提示', '服务器连接超时！');
					}
			});
			}
		}
	})
	
	function addHtml($html) {
		var i=0;
		var oSum="";
		for( i in $html) {
			var oImg="";
			if($html[i].hasOrgLogo) {
				oImg="/images/org/" + $html[i].id + ".jpg"
			}else{
				oImg="../images/default-icon.jpg"
			}
			oSum+='<li class="orgList"><img src="'+oImg+'" class="floatL" /><p class="h2Font floatL" data-id="'+$html[i].id+'">'+$html[i].name+'</p></li>'
		}
		
		$("#departmentList ul").html(oSum);
	}
	$("#departmentList ul").on("click","li",function(){
		$("#organizationName").val($(this).find("p").text());
		org = {
			id: $(this).find("p").attr('data-id'),
			name: $(this).find("p").text(),
		}
		$("#departmentList ul").html("");
	})
	/*厂商型号*/
	$("#modelNumber").bind({
		focus: function() {
			$("#model").show();
		},
		blur: function() {
			$("#model").hide();
		},
		keyup: function() {
			if($(this).val().length > 50) {
				$(this).val($(this).val().substr(0, 50));
			}
		}

	});
	/*应用用途*/
	limitObj("#descp",2000)
	/*性能参数*/
	limitObj("#applyDescp",2000)
	/*合作备注*/
	limitObj("#advantage",2000)
	/*应用用途*/
	limitObj("#indicator",2000)
	/*性能参数*/
	limitObj("#prospect",2000)
	/*合作备注*/
	limitObj("#benefit",2000)
	/*发布*/
	$(".goFabu").click(function(){
		if($(this).hasClass("disableLi")){
			return;
		}
		var  oYes=term();
		if(oYes==0) {
			return;
		}
		$.MsgBox.Confirm("提示", "确认发布该非专利成果？",ajsPost);
	})
	/*预览*/
	$("#oPreview").click(function(){
		if($(this).hasClass("disableLi")){
			return;
		}
		var  oYes=term();
		if(oYes==0) {
			return;
		}
		ajsPost("/ajax/resResult/draft",1);
	})
	/*存草稿*/
	$("#oDraft").click(function(){
		if($(this).hasClass("disableLi")){
			return;
		}
		var  oYes=term();
		if(oYes==0) {
			return;
		}
		if (resourceId) {
			ajsPost("/ajax/resResult/draft/update",2);
		} else {
			ajsPost("/ajax/resResult/draft",2);
		}
		
	})
	/*删除*/
	$("#operateBlocko").on("click",".deleteResource",function(){
		$.MsgBox.Confirm("提示", "确认删除该非专利成果？",deleResource);
	})
	/*删除函数*/
	function deleResource() {
			$.ajax({
					"url": "/ajax/resResult/delete",
					"type": "POST",
					"success": function(data) {
						console.log(data)
						if(data.success) {							
								location.href="resourceList.html"						
						}
					},
					"data": {"resourceId":resourceId},
					"beforeSend": function() { /*console.log(this.data)*/ },
					"contentType": "application/x-www-form-urlencoded",
					dataType: "json"
				});
	}
	/*条件是否匹配*/
	function term(){
		var $len = $("#fileList").find("img").length;
		var reName=$("#resourceName").val();
		var oIndustry=$("#application").val();
		if($len==0) {
			$.MsgBox.Alert('提示', '请上传非专利成果图片。');
			return 0;
		}
		if(reName=="") {
			$.MsgBox.Alert('提示', '请输入非专利成果名称。');
			return 0;
		}
		
	}
	/*发布函数*/
	function ajsPost(pa1,pa2) {
		var industrys = $("#keyWordlist li");
		var industryAll = "";
		if(industrys.size() > 0) {
			for(var i = 0; i < industrys.size(); i++) {
				industryAll += industrys[i].innerText.trim();
				industryAll += ',';
			};
			industryAll = industryAll.substring(0, industryAll.length - 1);
		}
		var industrys1 = $("#keyWordlist1 li");
		var industryAll1 = "";
		if(industrys1.size() > 0) {
			for(var i = 0; i < industrys1.size(); i++) {
				industryAll1 += industrys1[i].innerText.trim();
				industryAll1 += ',';
			};
			industryAll1 = industryAll1.substring(0, industryAll1.length - 1);
		}
		var industrys2 = $("#keyWordlist2 li");
		var researcher = [];
		if(industrys2.size() > 0) {
			for(var i = 0; i < industrys2.size(); i++) {
				var iD = $("#keyWordlist2 li").eq(i).attr('data-id');
				if (iD) {
					researcher.push(iD+","+industrys2[i].innerText.trim())
				} else {
					researcher.push("################################,"+industrys2[i].innerText.trim())
				}
				
			
			};
		}
		$(".operateBlock").find("li").addClass("disableLi");
		var oUrl="/ajax/resResult/publish";
		if(pa1) {
				oUrl=pa1
		} else {
			if (resourceId) {
				oUrl="/ajax/resResult/publish/update"
			} 
		}
		var $data = {
			name: $("#resourceName").val(),
			orgId: org.id,
			department: $('#department').val(),
			subject: industryAll1,
			industry: industryAll,
			descp: $('#descp').val(),
			applyDescp: $('#applyDescp').val(),
			prospect: $('#prospect').val(),
			indicator: $('#indicator').val(),
			advantage: $('#advantage').val(),
			benefit: $('#benefit').val(),
			pic: temp.join(','),
			creator: userid,
			platform: false,
			console: false,
			professor: true,
			researchers:researcher
		};
			if(resourceId) {
				$data.id=resourceId;
			}
			$.ajax({
					"url": oUrl,
					"type": "POST",
					"complete":function(){
						$(".operateBlock").find("li").removeClass("disableLi");
					},
					"success": function(data) {
						console.log(data)
						if(data.success) {
							if(pa2==1) {
								if (!resourceId)
								resourceId=data.data;
								$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
								window.open("unPatentpreview.html?id="+data.data);
								getRecourceMe();
								//弹出预览
							}else if(pa2==2) {
							$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
							if (!resourceId)
							resourceId=data.data;
							$.MsgBox.Alert('提示', '非专利成果已保存草稿。');
							$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
							getRecourceMe();
							}else{
								$.MsgBox.Alert("提示", "非专利成果发布成功！", function articalList() {
									location.href = "unPatentList.html";
								});
								$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
								
							}
							
						}else{
							if(data.code==90) {
								$.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
							}
						}
					},
					"data": $data,
					"beforeSend": function() { /*console.log(this.data)*/ },
					"contentType": "application/x-www-form-urlencoded",
					"traditional":true,
					dataType: "json"
			});
	}
})