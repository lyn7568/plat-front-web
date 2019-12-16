/*我的关注列表*/
$(function() {
	var userid = $.cookie("userid");
	expertAttention();
	followResources();
	
	$("#fixbtn li").on("click",function(){
		var indexLi=$(this).index();
		$("#fixbtn li").removeClass("liactive");
		$(".attentsCon .attentList").hide();
		$("#fixbtn li").eq(indexLi).addClass("liactive");
		$(".attentsCon .attentList").eq(indexLi).show();
	});
	$("#lookMyAttention").click(function(){
		$("body").css("position","fixed");
		$("#attentCover").fadeIn();
	})
	//关闭按钮
	$("#workclose").click(function(){
		$("#attentCover").fadeOut();
		$("body").css("position","");
	});
	
	/*关注专家*/
	function expertAttention() {
		var data = {
			"professorId": userid,
			"watchType": 1,
			"pageNo": 1,
			"pageSize": 1000
		}
		$.ajax({
			url: "/ajax/watch/qaPro",
			data: data,
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			success: function(data) {
				$("#expert").html("");
				if(data.success && data.data.data != "") {
					var datalist = data.data.data;
					datalistEach(datalist);
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', "服务器链接超时");
			}
		});
	}

	/*关注资源*/
	function followResources() {
		var data = {
			"professorId": userid,
			"watchType": 2,
			"pageNo": 1,
			"pageSize": 1000
		}
		$.ajax({
			url: "/ajax/watch/qaPro",
			data: data,
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			success: function(data) {
				console.log(data);
				$("#resources").html("");
				if(data.success && data.data.data != "") {
					var datalistd = data.data.data;
					ResourcesEach(datalistd);
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', "服务器链接超时");
			}
		});
	}

	/*专家数据遍历*/
	function datalistEach(datalist) {
		$.each(datalist, function(index, item) {
			/*获取头像*/
			//console.log(JSON.stringify(item));
			if(item.professor.hasHeadImage == 1) {
				var img = "/images/head/" + item.professor.id + "_l.jpg";
			} else {
				var img = "../images/default-photo.jpg";
			}

			/*获取研究方向信息*/
			var researchAreas = item.professor.researchAreas;
			//console.log(JSON.stringify(item.professor.researchAreas))
			var rlist = '';
			for(var n = 0; n < researchAreas.length; n++) {
				//console.log(researchAreas[n].caption);
				rlist += '<span>' + researchAreas[n].caption
				if(n < researchAreas.length - 1) {
					rlist += " , "
				}
				rlist += '</span>';
			}
			var arr = [];
			arr[0] = item.professor.title || item.professor.office;
			arr[1] = item.professor.orgName || "";
			if(arr[0]) {
				if(arr[1]) {
					arr[2] = arr[0] + "，" + arr[1]
				} else {
					arr[2] = arr[0];
				}
			} else {
				
				if(arr[1]) {
					arr[2] = arr[1];
				}else{
					arr[2] = "";
				}
			}
			var li = document.createElement('li');
			li.innerHTML = '<a class="proinfor clearfix" target="_blank" href="userInforShow.html?professorId=' + item.professor.id + '">' +
				'<div class="headblock floatL"><img id="proHead" class="headimg userRadius" src="' + img + '"></div>' +
				'<div class="mediaBody" style="padding-top:20px;">' +
				'<p class="h1font"><span class="listtit">' + item.professor.name + '<em class="authiconNew authicon-pro"></em></span></p>' +
				'<p class="listtit2 h2font">'+arr[2]+'</p>' +
				'<p class="ellipsisSty listtit3 h2font">' + rlist + '</p>' +
				'</div></a></li>';

			$("#expert").append(li);

		});
	}

	/*资源数据遍历*/
	function ResourcesEach(datalistd) {
		$.each(datalistd, function(index, item) {
			var oName;
			/*获取头像*/
			if(item.resource.images.length) {
				var img ='/data/resource/' + item.resource.images[0].imageSrc 
			} else {
				var img = "../images/default-resource.jpg";
			}
			if(item.resource.editProfessor) {
				var stl = autho(item.resource.editProfessor.authType,item.resource.editProfessor.orgAuth, item.resource.editProfessor.authStatus);
				oName=item.resource.editProfessor.name;
			}else {
				var stl={};
				stl.sty="";
				stl.title="";
					if(item.resource.organization.authStatus==3) {	
						stl.sty="authicon-com-ok";
						stl.title="认证企业";	
					}
					oName=item.resource.organization.name;
			}
			var li = document.createElement('li');

			li.innerHTML = '<a class="proinfor clearfix" target="_blank"  href="resourceShow.html?resourceId=' + item.resource.resourceId + '">' +
				'<div class="headblock floatL ResImgBox"><img id="proHead" class="resImg" src="' + img + '"></div>' +
				'<div class="mediaBody" style="float:left;width:450px;overflow:hidden;">' +
				'<span class=" ellipsisSty listtit">' + item.resource.resourceName + '</span>' +
				'<p class="ellipsisSty listtit2">用途：' + item.resource.supportedServices + '</p>' +
				'<span class="listtit">' +oName+ '<em class="authiconNew '+stl.sty+'" title="'+stl.title+'"></em></span>' +
				//'<p class="listtit2"><span>' + title + '</span><span>' + office + '</span><span>' + orgName + '</span><span>' + address + '</span></p>' +
				'</div></a></li>';
			$("#resources").append(li);
			

		});
	}
	/*文章列表*/
	function article() {
		var data = {
			"professorId": userid,
			"watchType": 3,
			"pageNo": 1,
			"pageSize": 1000
		}
		$.ajax({
			url: "/ajax/watch/qaPro",
			data: data,
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			success: function(data) {
				if(data.success && data.data.data != "") {
					console.log(data)
					var $info=data.data.data;
					for(var i = 0; i < $info.length; i++) {
						var img='../images/default-artical.jpg';
						var oName,oString,ohref;
						if($info[i].article.articleImg) {
							img="/data/article/"+$info[i].article.articleImg;
						}
						if($info[i].article.articleType==1){
							oName=$info[i].article.professor.name;
							oString='<em class="authiconNew  authicon-pro" title="科袖认证专家"></em>';
							ohref="articalShow.html?articleId="+$info[i].article.articleId;
						}else{
							oName=$info[i].article.organization.name;
							ohref="articalShow.html?articleId="+$info[i].article.articleId;
							if($info[i].article.organization.authStatus==3){
								oString='<em class="authiconNew  authicon-com-ok" title="认证企业"></em>';
							}
						}
						var li = document.createElement('li');
						li.innerHTML = '<a class="proinfor clearfix" target="_blank"  href="'+ohref+'">' +
							'<div class="headblock floatL ResImgBox"><img id="proHead" class="resImg" src="' + img + '"></div>' +
							'<div class="mediaBody">' +
							'<span class="listtit" style="display:block;">' + $info[i].article.articleTitle + '</span>' +
							'<span class="listtit">' + oName+oString+'</span>' +
							'</div></a></li>';
						$("#article").append(li);
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', "服务器链接超时");
			}
		});
	}
	article();
	/*关注专利信息*/
	function patent() {
		var data = {
			"professorId": userid,
			"watchType": 4,
			"pageNo": 1,
			"pageSize": 1000
		}
		$.ajax({
			url: "/ajax/watch/qaPro",
			data: data,
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			success: function(data) {
				console.log(data);
				if(data.success && data.data.data != "") {
					var arr=[];
					for(var i in data.data.data) {
						arr[i]=data.data.data[i].watchObject;
					}
					$.ajax({
						url: "/ajax/ppatent/qm",
						data: {
							id:arr,
						},
						dataType: 'json', //数据格式类型
						type: 'get', //http请求类型
						traditional: true,
						success: function(data) {
							console.log(data);
							if(data.success && data.data != "") {
								var $data=data.data;
								for(var i=0;i<$data.length;i++) {
									var li = document.createElement('li');
								li.innerHTML = '<a class="proinfor clearfix" target="_blank"  href="patentShow.html?patentId='+$data[i].id+'">' +
								'<div class="headblock floatL ResImgBox"><img id="proHead" class="resImg" src="../images/default-patent.jpg"></div>' +
								'<div class="mediaBody">' +
								'<span class="listtit" style="display:block;">'+$data[i].name+'</span>' +
								'<span class="listtit">'+$data[i].authors.substring(0,$data[i].authors.length-1)+'</span>' +
								'<p class="listtit">'+$data[i].reqPerson+'</p>' +
								'</div></a></li>';
								$("#patent").append(li)
								}
							}
						},
						error: function() {
							$.MsgBox.Alert('提示', "服务器链接超时");
						}
					});
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', "服务器链接超时");
			}
		});
	}
	patent();
	/*关注论文信息*/
	function paper() {
		var data = {
			"professorId": userid,
			"watchType": 5,
			"pageNo": 1,
			"pageSize": 1000
		}
		$.ajax({
			url: "/ajax/watch/qaPro",
			data: data,
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			success: function(data) {
				console.log(data);
				if(data.success && data.data.data != "") {
					var arr=[];
					for(var i in data.data.data) {
						arr[i]=data.data.data[i].watchObject;
					}
					$.ajax({
						url: "/ajax/ppaper/qm",
						data: {
							id:arr,
						},
						dataType: 'json', //数据格式类型
						type: 'get', //http请求类型
						traditional: true,
						success: function(data) {
							console.log(data);
							if(data.success && data.data != "") {
								var $data=data.data;
								for(var i=0;i<$data.length;i++) {
									var li = document.createElement('li');
								li.innerHTML = '<a class="proinfor clearfix" target="_blank"  href="paperShow.html?paperId='+$data[i].id+'">' +
								'<div class="headblock floatL ResImgBox"><img id="proHead" class="resImg" src="../images/default-paper.jpg"></div>' +
								'<div class="mediaBody">' +
								'<span class="listtit" style="display:block;">'+$data[i].name+'</span>' +
								'<span class="listtit">'+$data[i].authors.substring(0,$data[i].authors.length-1)+'</span>' +
								'<p class="listtit">'+$data[i].pubDay+'</p>' +
								'</div></a></li>';
								$("#paper").append(li)
								}
							}
						},
						error: function() {
							$.MsgBox.Alert('提示', "服务器链接超时");
						}
					});
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', "服务器链接超时");
			}
		});
	}
	paper();
	/*关注企业信息*/
	function company() {
		var data = {
			"professorId": userid,
			"watchType": 6,
			"pageNo": 1,
			"pageSize": 1000
		}
		$.ajax({
			url: "/ajax/watch/qaPro",
			data: data,
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			success: function(data) {
				console.log(data);
				if(data.success && data.data.data != "") {
					var arr=[];
					for(var i in data.data.data) {
						arr[i]=data.data.data[i].watchObject;
					}
					$.ajax({
						url: "/ajax/org/qm",
						data: {
							id:arr,
						},
						dataType: 'json', //数据格式类型
						type: 'get', //http请求类型
						traditional: true,
						success: function(data) {
							console.log(data);
							if(data.success && data.data != "") {
								var $data=data.data;
								console.log($data);
								for(var i=0;i<$data.length;i++) {
									var li = document.createElement('li');
									
								li.innerHTML = '<a class="proinfor clearfix" target="_blank"  href="">' +
								'<div class="headblock floatL ResImgBox"><img id="proHead" class="resImg" src=""></div>' +
								'<div class="mediaBody">' +
								'<p><span class="listtit">'+$data[i].name+'<em class="authiconNew" title=""></em></span></p>'+
								'<span class="listtit" id="orgTit"></span>' +
								'<span class="listtit" id="orgOther"></span>' +
								'</div></a></li>';
								var $itemlist=$(li);
								$("#company").append($itemlist);
								$itemlist.find("a").attr("href", "cmpInforShow.html?orgId=" + $data[i].id );
									if($data[i].hasOrgLogo) {
										$itemlist.find("#proHead").attr("src", "/images/org/" + $data[i].id + ".jpg" );
									}else{
										$itemlist.find("#proHead").attr("src", "/images/default-icon.jpg" );
									}
									if($data[i].authStatus == 3) {
										$itemlist.find(".authiconNew").addClass("authicon-com-ok").attr("title", "科袖认证企业");;	
									}
									console.log($data[i])
								var orgOther = "";
								
								if($data[i].industry) {
									orgOther = $data[i].industry.replace(/,/gi, " | ");
								}
								$itemlist.find("#orgOther").text(orgOther);
								
								if($data[i].orgType == "2") {
									$itemlist.find("#orgTit").html(orgTypeShow[$data[i].orgType] + "<span style='margin-right:10px;'></span>");
								}
								}
								
							}
						},
						error: function() {
							$.MsgBox.Alert('提示', "服务器链接超时");
						}
					});
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', "服务器链接超时");
			}
		});
	}
	company();
	
	function demands() {
		var data = {
			"professorId": userid,
			"watchType":7,
			"pageNo": 1,
			"pageSize": 1000
		}
		$.ajax({
			url: "/ajax/watch/qaPro",
			data: data,
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			success: function(data) {
				console.log(data);
				if(data.success && data.data.data != "") {
					var arr=[];
					for(var i in data.data.data) {
						arr[i]=data.data.data[i].watchObject;
					}
					$.ajax({
						url: "/ajax/demand/qm",
						data: {
							id:arr,
						},
						dataType: 'json', //数据格式类型
						type: 'get', //http请求类型
						traditional: true,
						success: function(data) {
							console.log(data);
							if(data.success && data.data != "") {
								var $data=data.data;
								console.log($data);
								for(var i=0;i<$data.length;i++) {
									var li = document.createElement('li');
									
									var strCon=''
									strCon+='<a class="proinfor clearfix" target="_blank"  href="../demandShow.html?demandId='+$data[i].id+'">'
									strCon+='<div class="mediaBody">' 
									strCon+='<p class="listtit ellipsisSty">'+$data[i].title+'</p>'
									strCon+='<ul class="showli clearfix h3Font">'
			
									if($data[i].city){ strCon+='<li>所在城市：'+$data[i].city+'</li>' }
									if($data[i].duration!=0){ strCon+='<li>预期时长：'+demandDuration[$data[i].duration]+'</li>' }
									if($data[i].cost!=0){ strCon+='<li>费用预算：'+demandCost[$data[i].cost]+'</li>' }
									if($data[i].invalidDay){ strCon+='<li>有效期至：'+TimeTr($data[i].invalidDay)+'</li>' }
									
									strCon+='</ul>'
									strCon+='</div></a></li>';
									li.innerHTML = strCon
									var $itemlist=$(li);
									$("#demands").append($itemlist);
								}
								
							}
						},
						error: function() {
							$.MsgBox.Alert('提示', "服务器链接超时");
						}
					});
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', "服务器链接超时");
			}
		});
	}
	demands();
})