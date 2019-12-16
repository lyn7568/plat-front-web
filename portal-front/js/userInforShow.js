$(function() {
	loginStatus();//判断个人是否登录
	var userid = $.cookie("userid");
	var professorId = GetQueryString("professorId");
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
	 	location.href="http://" + window.location.host + "/e/p.html?id="+professorId;
	}
	var oArray=[];
	function subjectShow(data) {
		if(data != undefined && data.length != 0) {
			var subs=strToAry(data)
			if(subs.length > 0) {
				for(var i = 0; i < subs.length; i++) {
					$("#subjectShow").append("<li>" + subs[i] + "</li>");
				};
			}
		}
	}
	function researchAreaShow(dataStrs, dataStrrecords) {
		if(dataStrs != undefined && dataStrs.length != 0) {
			var html = [];
			for(var i = 0; i < dataStrs.length; ++i) {
				var dataStr = dataStrs[i];
				var $photos = [];
				//获取头像					
				if(dataStrrecords.length > 0) {
					$photos = getRecords(dataStrrecords, dataStr.caption);
				}
				var isAgree = -1;
				for(var j = 0; j < $photos.length; j++) {
					if(userid == $photos[j].id)
						isAgree++;
				}
				oArray[i]=dataStr.caption;
				if(professorId != userid) {
					if(isAgree) {
						var showDiv = '<li><div class="favorBox" caption="'+ dataStr.caption +'"><span class="like">'+ dataStr.count +'</span>'+ dataStr.caption +'</div><span class="plus" data-pid="'+ dataStr.professorId +'" data-caption="'+ i + '" data-isagree="' + isAgree + '"></span><div class="favorCount" caption="'+ dataStr.caption +'">';
					} else {
						var showDiv = '<li><div class="favorBox" caption="'+ dataStr.caption +'"><span class="like">'+ dataStr.count +'</span>'+ dataStr.caption +'</div><span class="plus" style="background-position-y:-26px" data-pid="'+ dataStr.professorId +'" data-caption="'+ i + '" data-isagree="' + isAgree + '"></span><div class="favorCount" caption="'+ dataStr.caption +'">';
					}
				} else {
					var showDiv = '<li><div class="favorBox" caption="'+ dataStr.caption +'"><span class="like">'+ dataStr.count +'</span>'+ dataStr.caption +'</div><div class="favorCount" caption="'+ dataStr.caption +'">';
				}
				if($photos.length < 6) {
					for(var j = 0; j < $photos.length; ++j) {
						if($photos[j].img) {
							showDiv += '<span class="like-people" style="background-image: url(../images/head/'+ $photos[j].id +'_s.jpg);"></span>';
						} else {
							showDiv += '<span class="like-people" style="background-image: url(../images/default-photo.jpg);"></span>';
						}
					}
				} else {
					for(var j = $photos.length - 5; j < $photos.length; ++j) {
						if($photos[j].img) {
							showDiv +='<span class="like-people" style="background-image: url(../images/head/'+ $photos[j].id +'_s.jpg);"></span>';
						} else {
							showDiv += '<span class="like-people" style="background-image: url(../images/default-photo.jpg);"></span>';
						}
					}
					showDiv += '<span class="like-people like-more"></span>';
				}
				showDiv += "</div></li>";
				html.push(showDiv);
			}
			document.getElementById("researchAreaShow").innerHTML = html.join('');
		}
	}
	function industryShow(data) {
		if(data != undefined && data.length != 0) {
			var subs=strToAry(data)
			if(subs.length > 0) {
				for(var i = 0; i < subs.length; i++) {
					$("#industryShow").append("<li><div class='h4tit'>" + subs[i] + "</div></li>");
				};
			}
		}
	}
	function projectShow(data) {
		if(data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				if(!data[i].descp) {
					data[i].descp = "";
				}
				var sDate = "";
				var eDate = "";
				if(data[i].startMonth) {
					sDate = data[i].startMonth.substr(0, 4) + "年" + data[i].startMonth.substr(4, 6) + "月";
					sDateV = data[i].startMonth.substr(0, 4) + "-" + data[i].startMonth.substr(4, 6);
					if(data[i].stopMonth) {
						eDate =" - "+ data[i].stopMonth.substr(0, 4) + "年" + data[i].stopMonth.substr(4, 6) + "月";
					} else {
						eDate = " - "+ "至今";
					}
				}
				var projectHtml = '<li>';
				projectHtml += '<div class="h4Font h4tit">' + data[i].name + '<small class="h6Font">' + sDate + eDate + '</small></div>';
				projectHtml += '<div class="h5Font">' + data[i].descp + '</div>';
				projectHtml += '</li>';

				$("#projectShow").append(projectHtml);
			}
		}
	}
	function honorShow(data) {
		if(data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				var timeho="";
				if(data[i].year){
					timeho = data[i].year+'年';
				}else{
					data[i].year="";
				}
				if(!data[i].descp) {
					data[i].descp = "";
				}
				var honorHtml = '<li>';
				honorHtml += '<div class="h4Font h4tit">' + data[i].name + '<small class="h6Font">' + timeho + '</small></div>';
				honorHtml += '<div class="h5Font">' + data[i].descp + '</div>';
				honorHtml += '</li>';
				$("#honorShow").append(honorHtml);
			}
		}
	}
	function timeJobShow(data) {
		if(data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				if(data[i].department) {
					var dep = " - " + data[i].department;
				} else {
					var dep = ""
				}
				var sDate = "";
				var eDate = "";
				if(data[i].startMonth) {
					sDate = data[i].startMonth.substr(0, 4) + "年" + data[i].startMonth.substr(4, 6) + "月";
					sDateV = data[i].startMonth.substr(0, 4) + "-" + data[i].startMonth.substr(4, 6);
					if(data[i].stopMonth) {
						eDate =" - "+ data[i].stopMonth.substr(0, 4) + "年" + data[i].stopMonth.substr(4, 6) + "月";
					} else {
						eDate = " - "+ "至今";
					}
				}
				var JobHtml = '<li>';
				JobHtml += '<div class="h4Font h4tit">' + data[i].company + dep + ' - ' + data[i].title + '<small class="h6Font">' + sDate + eDate + '</small></div>';
				JobHtml += '</li>';
				$("#timeJobShow").append(JobHtml);
			}
		}
	}
	function eduBgShow(data) {
		if(data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				var college="",major="",degree=""
				if(data[i].college){
					college =' - ' + data[i].college
				}else{
					data[i].college="";
				}
				if(data[i].major){
					major =' - ' + data[i].major
				}else{
					data[i].major="";
				}
				if(data[i].degree){
				    degree =' - ' + data[i].degree
				     if(data[i].degree==0){
				     	degree =""
				     }
				}else{
					data[i].degree="";
				}
				var timebiye="";
				if(data[i].year){
					if(data[i].year.trim()=="至今"){
						timebiye=data[i].year;
					}else{
						timebiye=data[i].year+'年';
					}
				}else{
					timebiye="";
				}
				
				var showHtml = '<li><div class="h4Font h4tit">'
				showHtml += data[i].school + college + major + degree;
				showHtml +='<small class="h6Font">' + timebiye + '</small></div></li>';
				$("#eduBgShow").append(showHtml);
			}
		}
	}
	//判断点赞的用户是否有头像
	function getRecords($researchAreaLogs, caption) {
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
	function openAttend(){//打开收藏与关注
		$(".mainNavUl li.rightbtn").addClass("liNow").siblings().removeClass("liNow");
		$(".navconBox .moreBu").show();
		$(".wendaNav").hide();
		$("#item8user").show().siblings().hide();
		$(".moreBuUl li.attentType").eq(0).addClass("liNow").siblings().removeClass("liNow");
		$("#item8drop1").show().siblings().hide();
		watchO={
			watchTime:"",
			watchObjId:"",
		};
		var pa=$(".moreNavUl.moreBuUl>li.liNow").attr("rel")
		$("#"+pa).find("ul").html("")
		$("#"+pa).find(".js-load-more").show();
		collectSorts(1,true);
	}
	function researchAlert(cap){
		$.ajax({
			"url": "/ajax/researchAreaLog/ql",
			"type": "get",
			"data": {
				"professorId": professorId,
				"caption": cap,
				"rows": 1000
			},
			"success": function(data) {
				if(data.success) {
					console.log(data)
					$("#areaCon").html("");
					var $info = data.data;
					$("#subArea").text(cap);
					$(".resAreaCover").fadeIn();
					$(".resAreaTip").addClass("displayNone")
					$(".resAreaCon").show()
					if($info.length == 0) {
						$(".resAreaCon").hide();
						$(".resAreaTip").removeClass("displayNone")
						return;
					}
					var arr=[];
					for(var i in $info) {
						arr[i]=$info[i].opreteProfessorId;
					}
					detailPro(arr,"areaCon");
				}
			}
		});
	}

	var rows = 20,
		pageNo = 1,
		dataO = {
			artPublishTime:"",
			artShareId:"",
			
			resPublishTime:"",
			resShareId:"",
			
			serModifyTime: "",
			serId: "",
			
			patTime:"",
			patId:"",
			
			parTime:"",
			parId:"",
			
			AnsTime:"",
			AnsId:"",
			
			QuTime:"",
			QuId:"",
		},
		watchO={
			beiTime:"",
			beiProId:"",
			
			watchTime:"",
			watchObjId:"",
			
			WATime:"",
			WAId:"",
			
			WQTime:"",
			WQId:"",
		};
	var oAjax = function(url, dataS, otype, oFun,beforeFun,completeFun) {
			$.ajax({
				url:url,
				dataType: 'json',
				type: otype,
				data: dataS,
				traditional: true,
				beforeSend: beforeFun,
				success: function(res) {
					if(res.success) {
						oFun(res)
					}
				},
				complete:completeFun
	            
			});
		},	
		insertNodata = function (targetE,newStr) {
            var parent = document.getElementById(targetE).parentNode;
            var kong = document.createElement("div");
            kong.className = "con-kong";
            kong.innerHTML ='<div class="picbox picNull"></div>'+
			            '<div class="txtbox">暂时没有符合该搜索条件的内容</div>'
            if(newStr){
            	kong.querySelector(".txtbox").innerHTML = newStr;
            }
            if (parent.firstChild.className == "con-kong") {
                return
            } else {
                parent.insertBefore(kong,parent.firstChild);
            }

        },
        removeNodata = function (targetE) {
            var parent = document.getElementById(targetE).parentNode;
            if (parent.firstChild.className == "con-kong") {
                parent.removeChild(parent.firstChild);
            } else {
                return
            }
        },
       	getUserInfo=function() {
       		oAjax("/ajax/professor/info/"+ professorId,{}, "get", function(data){
				var $info = data.data;
				if($info.hasHeadImage){
					$("#proHead").css("background-image","url(/images/head/"+ $info.id +"_l.jpg)");
				}
				$("#proName").text($info.name);
				var oStyS=autho($info.authType,$info.orgAuth,$info.authStatus);
				$("#proAuth").addClass(oStyS.sty); $("#proAuth").attr("title",oStyS.title);
				if($info.address){
					$("#proAddress").html($info.address + "<span style='margin-right:10px;'></span>");
				}
				var proOther="";
				if($info.orgName){
					if($info.department){
						if($info.office){
							proOther = $info.orgName + "，" + $info.department + "，" + $info.office
						}else{
							proOther = $info.orgName + "，" + $info.department
						}
					}else{
						if($info.office){
							proOther = $info.orgName +"，" + $info.office
						}else{
							proOther = $info.orgName
						}
					}
				}else{
					if($info.department){
						if($info.office){
							proOther =  $info.department + "，" + $info.office
						}else{
							proOther =  $info.department
						}
					}else{
						if($info.office){
							proOther = $info.office
						}
					}
				}
				$("#proOther").text(proOther);
				var llqtitle=$info.name + "-" + proOther.replace(/，/gi,"-") + "-科袖网";//修改浏览器title信息
				if($info.title){
					$("#proTit").html($info.title + "<span style='margin-right:10px;'></span>");
					llqtitle = $info.name + "-" + $info.title + "-" + proOther.replace(/，/gi,"-") + "-科袖网";
				}
				document.title = llqtitle;
				
				//主页浏览量
				$("#viewNums").text($info.pageViews);
				//个人简介
				if($info.descp) {
					$("#descpS").parents(".coninfobox").removeClass("displayNone");
					$("#item1user>.nodatabox").addClass("displayNone");
					$("#descpS").text($info.descp);
				}
				//学术领域					
				if($info.subject) {
					$("#subjectShow").parents(".coninfobox").removeClass("displayNone");
					$("#item1user>.nodatabox").addClass("displayNone");
					subjectShow($info.subject);
				}
				//研究方向
				if($info.researchAreas.length) {
					$("#researchAreaShow").parents(".coninfobox").removeClass("displayNone");
					$("#item1user>.nodatabox").addClass("displayNone");
					researchAreaShow($info.researchAreas, $info.editResearchAreaLogs);
				}
				//行业领域	
				if($info.industry) {
					$("#industryShow").parents(".coninfobox").removeClass("displayNone");
					$("#item1user>.nodatabox").addClass("displayNone");
					industryShow($info.industry);
				}
				//教育背景					
				if($info.edus.length) {
					eduBgShow($info.edus);
				} else {
					$("#eduBgShow").parents(".coninfobox").hide();
				}
				//兼职
				if($info.jobs.length) {
					timeJobShow($info.jobs);
				} else {
					$("#timeJobShow").parents(".coninfobox").hide();
				}
				//项目
				if($info.projects.length) {
					projectShow($info.projects)
				} else {
					$("#projectShow").parents(".coninfobox").hide();
				}
				//荣誉
				if($info.honors.length) {
					honorShow($info.honors);
				} else {
					$("#honorShow").parents(".coninfobox").hide();
				}
				
				if($info.honors.length == 0 && $info.projects.length == 0 && $info.jobs.length == 0 && $info.edus.length == 0){
					$("#item7user>.nodatabox").show();
					$("#item7user>.nodatabox").find(".noContip").text("用户尚未完善详细资料")
				}
				
				var weibotitle = $info.name;
				var weibourl = window.location.href;
				var weibopic ="http://"+window.location.host+"/images/head/"+ $info.id +"_l.jpg";
				$("#weibo").attr("href","http://service.weibo.com/share/share.php?appkey=3677230589&title="+weibotitle+"&url="+weibourl+"&pic="+weibopic+"&ralateUid=6242830109&searchPic=false&style=simple");
			});
		},
		teamListVal=function(isbind) {
			var aimId="proTeam",aimIdF="showTeam",newStr="用户暂无专家团队"
			oAjax("/ajax/team/myTeam",{
				professor: professorId,
				status: 3,
				pageSize: rows,
				pageNo: pageNo
			}, "get", function(res){
				var $info = res.data.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					if(userid!=professorId){
						$("#"+aimIdF).parents(".conItem").removeClass("displayNone");
					}
			
					for(var i = 0; i < $info.length; i++) {
						var itemlist = '<li>';
							itemlist += '<a target="_blank" href="teamInfoShow.html?id='+$info[i].id+'" class="flexCenter urlgo" style="min-height:60px;">';
							itemlist += '<div class="madiaInfo" style="padding-left:0">';
							itemlist += '<p class="h1Font ellipsisSty-2">'+$info[i].name+' <small> 团队人数 <span class="teamMembers"></span>人</small></p>';
							itemlist += '<div class="h2Font clearfix">';
							itemlist += '<span>' + $info[i].city + '</span>';
							itemlist += ' <span>' + $info[i].orgName + '</span>'
							itemlist += '</div></div>';
							itemlist += '</a></li>';
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						teamProCount($info[i].id, $itemlist)
						if(isbind && i < 5 && userid!=professorId){
							var $itemlist = $(itemlist);
							$("#"+aimIdF).append($itemlist);
							teamProCount($info[i].id, $itemlist)
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
						pageNo++
						teamListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
       	demandListVal=function(isbind) {
			oAjax("/ajax/demand/pq",{
				"state":[1],
				"uid":professorId,
				"pageSize":5
			}, "get", function(data){
				var $info = data.data.data;
				if($info.length > 0){
					$("#showDemand").parents(".coninfobox").removeClass("displayNone");
					$("#item1user>.nodatabox").addClass("displayNone");
					for(var i = 0; i < $info.length; i++) {
						var liStr=$("<li></li>").appendTo("#showDemand");
						var $data=$info[i];
						var sowU="";
						if($data.pageViews!=0){
							sowU='<li><span>浏览量 '+$data.pageViews +'</span></li>'
						}
						var strCon='';
							strCon+='<a class="" target="_blank" href="demandShow.html?demandId='+$data.id+'" class="madiaInfo">'
							strCon+='<p class="h1Font ellipsisSty">'+ $data.title +'</p>'
							strCon+='<ul class="showliTop h3Font clearfix">'
							strCon+='<li><span>发布于 '+TimeTr($data.createTime)+'</span></li>'
							strCon+= sowU
							strCon+='</ul>'
							strCon+='<p class="h2Font ellipsisSty-2">'+$data.descp+'</p>'
							strCon+='<ul class="showli clearfix h3Font">'
							
							if($data.city){ strCon+='<li>所在城市：'+$data.city+'</li>' }
							if($data.duration!=0){ strCon+='<li>预计周期：'+demandDuration[$data.duration]+'</li>' }
							if($data.cost!=0){ strCon+='<li>费用预算：'+demandCost[$data.cost]+'</li>' }
							if($data.invalidDay){ strCon+='<li>有效期至：'+TimeTr($data.invalidDay)+'</li>' }
							
							strCon+='</ul>'
							strCon+='</a>'
						$(strCon).appendTo(liStr);
					}
				}else{
					$("#showDemand").parents(".needinfobox").addClass("displayNone");
				}
			})
		},
        articalListVal=function(isbind){
			var aimId="proArticel",aimIdF="showArticle",newStr="用户尚未发布任何文章"
			oAjax("/ajax/article/publish",{
				"category": "1",
				"owner":professorId,
				"publishTime":dataO.artPublishTime,
				"shareId": dataO.artShareId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					$("#"+aimIdF).parents(".coninfobox").removeClass("displayNone");
					dataO.artPublishTime = $info[$info.length - 1].publishTime;
					dataO.artShareId = $info[$info.length - 1].shareId;
			
					for(var i = 0; i < $info.length; i++) {
						var sowU="",hasImg="/images/default-artical.jpg"
						if($info[i].articleImg) {
							hasImg="/data/article/" + $info[i].articleImg
						}
						if($info[i].pageViews!=0){
							if($info[i].articleAgree!=0){
								sowU='<li><span>阅读量 '+$info[i].pageViews+'</span></li><li><span>赞 '+$info[i].articleAgree+'</span></li>'
							}else{
								sowU='<li><span>阅读量 '+$info[i].pageViews+'</span></li>'
							}
						}
						var itemlist = '<li>';
							itemlist += '<a href="/'+pageUrl('a',$info[i])+'" class="flexCenter urlgo">';
							itemlist += '<div class="madiaHead artHead" style="background-image:url(' + hasImg + ')"></div>';
							itemlist += '<div class="madiaInfo">';
							itemlist += '<p class="h1Font ellipsisSty-2">'+$info[i].articleTitle+'</p>';
							itemlist += '<ul class="h2Font clearfix">';
							itemlist += '<li><span class="time">' + commenTime($info[i].publishTime) + '</span></li>';
							itemlist += sowU
							itemlist += '<li><span class="leaveMsgCount"></span></li>';
							itemlist += '</ul></div>';
							itemlist += '</a></li>';
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						leaveMsgCount($info[i].articleId,1,$itemlist);
						
						if(isbind && i==0){
							var $itemlist = $(itemlist);
							$("#"+aimIdF).append($itemlist);
							leaveMsgCount($info[0].articleId,1,$itemlist);
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	articalListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		resourceListVal=function(isbind){
			var aimId="proResource",aimIdF="showResource",newStr="用户尚未发布任何资源"
			oAjax("/ajax/resource/publish",{
				"category": "1",
				"owner":professorId,
				"publishTime":dataO.resPublishTime,
				"shareId": dataO.resShareId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					$("#"+aimIdF).parents(".form-item").removeClass("displayNone");
					$("#"+aimIdF).parents(".coninfobox").show();
					dataO.resPublishTime = $info[$info.length - 1].publishTime;
					dataO.resShareId = $info[$info.length - 1].shareId;
			
					for(var i = 0; i < $info.length; i++) {
						var hasImg='/images/default-resource.jpg'
						if($info[i].images.length) {
							hasImg="/data/resource/" + $info[i].images[0].imageSrc
						}
						
						var itemlist = '<li>';
							itemlist += '<a href="resourceShow.html?resourceId=' + $info[i].resourceId + '" class="flexCenter urlgo">';
							itemlist += '<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>';
							itemlist += '<div class="madiaInfo"><p class="h1Font ellipsisSty-2">' + $info[i].resourceName + '</p><p class="h2Font ellipsisSty">用途：' + $info[i].supportedServices + '</p></div>';
							itemlist += '</a></li>';
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						
						if(isbind && i==0){
							var $itemlist = $(itemlist);
							$("#"+aimIdF).append($itemlist);
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	resourceListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		serviceListVal=function(isbind){
			var aimId="proService",aimIdF="showService",newStr="用户尚未发布任何服务"
			oAjax("/ajax/ware/publish",{
				"category":"1",
				"owner":professorId,
				"modifyTime":dataO.serModifyTime,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					$("#"+aimIdF).parents(".form-item").removeClass("displayNone");
					$("#"+aimIdF).parents(".coninfobox").show();
					dataO.serModifyTime = $info[$info.length - 1].modifyTime;
			
					for(var i = 0; i < $info.length; i++) {
						var cnt="", hasImg="../images/default-service.jpg";
						if($info[i].cnt) {
							cnt = "内容：" + $info[i].cnt
						}
						if($info[i].images) {
							var subs = strToAry($info[i].images)
							if(subs.length > 0) {
								hasImg="/data/ware" + subs[0]
							}
						}
						var itemlist = '<li>';
							itemlist += '<a href="sevriceShow.html?sevriceId=' + $info[i].id + '" class="flexCenter urlgo">';
							itemlist += '<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>';
							itemlist += '<div class="madiaInfo"><p class="h1Font ellipsisSty-2">' + $info[i].name + '</p><p class="h2Font ellipsisSty">' + cnt+ '</p></div>';
							itemlist += '</a></li>';
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						
						if(isbind && i==0){
							var $itemlist = $(itemlist);
							$("#"+aimIdF).append($itemlist);
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	serviceListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		unPatentListVal=function(isbind) {
			var aimId="proUnPatent",newStr="用户尚未参与任何非专利成果的研究"
			oAjax("/ajax/resResult/pq/researcher",{
				id: professorId,
				status: ['1'],
				pageSize: rows,
				pageNo: pageNo
			}, "get", function(res){
				var $info = res.data.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					for(var i = 0; i < $info.length; i++) {
						var resIM='<div class="madiaHead patentHead"></div>'
						if ($info[i].pic) {
							var src = '/data/researchResult' + $info[i].pic.split(",")[0]
							resIM = '<div class="madiaHead patentHead" style="background-image:url('+ src +')"></div>';
						}
						var itemlist = '<li>';
							itemlist += '<a target="_blank" href="unPatentShow.html?id='+$info[i].id+'" class="flexCenter urlgo">';
							itemlist += resIM
							itemlist += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ $info[i].name +'</p>';
							itemlist += '<p class="h2Font ellipsisSty displayNone">研究者：<span class="researchers"></span></p>';
							if ($info[i].orgId){
								itemlist += '<p class="h2Font ellipsisSty">所属机构：<span class="resOrgName"></span></p>';
							}
							itemlist += '</div>';
							itemlist += '</a></li>';
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						queryResearcher($info[i].id, $itemlist)
						if ($info[i].orgId) {
							queryReseOrgName($info[i].orgId, $itemlist)
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
						pageNo++
						unPatentListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		patentListVal=function(isbind){
			var aimId="proPatent",aimIdF="showPatent",newStr="用户尚未发布任何专利"
			oAjax("/ajax/ppatent/professor",{
				"owner":professorId,
				"assTime":dataO.patTime,
				"id":dataO.patId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					$("#"+aimIdF).parents(".form-item").removeClass("displayNone");
					$("#"+aimIdF).parents(".coninfobox").show();
					dataO.patTime = $info[$info.length - 1].assTime;
					dataO.patId = $info[$info.length - 1].id;
			
					for(var i = 0; i < $info.length; i++) {
						var dataStr= $info
						if(!dataStr[i].reqPerson){
								dataStr[i].reqPerson="";
							}
						var strAdd = '';
							strAdd += '<li><a  target="_blank" href="/'+ pageUrl("pt",dataStr[i]) +'" class="flexCenter urlgo">';
							strAdd += '<div class="madiaHead patentHead"></div>';
							strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr[i].name +'</p>';
							strAdd += '<p class="h2Font ellipsisSty">发明人：'+ dataStr[i].authors.substring(0, dataStr[i].authors.length - 1) +'</p>';
							strAdd += '<p class="h2Font ellipsisSty">申请人：'+ dataStr[i].reqPerson +'</p>';
							strAdd += '</div>';
							strAdd += '</a></li>';
						var $itemlist = $(strAdd);
						$("#"+aimId).append($itemlist)
						
						if(isbind && i==0){
							var $itemlist = $(strAdd);
							$("#"+aimIdF).append($itemlist);
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	patentListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		paperListVal=function(isbind){
			var aimId="proPaper",aimIdF="showPaper",newStr="用户尚未发布任何论文"
			oAjax("/ajax/ppaper/professor",{
				"owner":professorId,
				"assTime":dataO.parTime,
				"id":dataO.parId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					$("#"+aimIdF).parents(".form-item").removeClass("displayNone");
					$("#"+aimIdF).parents(".coninfobox").show();
					dataO.parTime = $info[$info.length - 1].assTime;
					dataO.parId = $info[$info.length - 1].id;
			
					for(var i = 0; i < $info.length; i++) {
						var dataStr= $info
						var moreInf=""
						if(!dataStr[i].cn4periodical){
							dataStr[i].cn4periodical="";
						}
						if(!dataStr[i].en4periodical){
							dataStr[i].en4periodical="";
						}
						if(!dataStr[i].pubDay){
							dataStr[i].pubDay="";
						}
						moreInf = dataStr[i].cn4periodical+ " " +dataStr[i].en4periodical+ " " +dataStr[i].pubDay
							
						var strAdd = '';
							strAdd += '<li><a  target="_blank" href="/'+ pageUrl("pp",dataStr[i]) +'" class="flexCenter urlgo">';
							strAdd += '<div class="madiaHead paperHead"></div>';
							strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr[i].name +'</p>';
							strAdd += '<p class="h2Font ellipsisSty">作者：'+ dataStr[i].authors.substring(0, dataStr[i].authors.length - 1) +'</p>';
							strAdd += '<p class="h2Font ellipsisSty">期刊：'+ moreInf +'</p>';
							strAdd += '</div>';
							strAdd += '</a></li>';
						var $itemlist = $(strAdd);
						$("#"+aimId).append($itemlist)
						
						if(isbind && i==0){
							var $itemlist = $(strAdd);
							$("#"+aimIdF).append($itemlist);
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	paperListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		answerListVal=function(isbind){//获取问答
        	var aimId="proA",aimIdF="showAnswer",newStr="用户尚未任何回答"
			oAjax("/ajax/question/answer/bySelf",{
				"time":dataO.AnsTime,
                "id":dataO.AnsId,
                "uid":professorId,
                "rows":rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					$("#"+aimIdF).parents(".form-item").removeClass("displayNone");
					$("#"+aimIdF).parents(".coninfobox").show();
					dataO.AnsTime = $info[$info.length - 1].createTime;
					dataO.AnsId = $info[$info.length - 1].id;
			
					for(var i = 0; i < $info.length; i++) {
						var listLi = $('<li>')
						listLi.appendTo($("#"+aimId));
                        detailAnswer($info[i], listLi);
                        if(isbind && i==0){
                            var li = listLi.clone();
                            li.appendTo($("#"+aimIdF));
                            questioninfo($info[i].qid, li);
                            proinfo($info[i].uid, li);
                            leaveMsgCount($info[i].id,4, li);
                        }
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	answerListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
    	},
		questionListVal=function(isbind) {
			var aimId="proQ",newStr="用户尚未发布任何问题"
	        oAjax("/ajax/question/my",{
				"uid":professorId,
				"time":dataO.QuTime,
                "id":dataO.QuId,
                "rows":rows,
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					dataO.QuTime = $info[$info.length - 1].createTime;
					dataO.QuId = $info[$info.length - 1].id;
			
					for(var i = 0; i < $info.length; i++) {
						var listLi = $('<li class="mui-table-view-cell">').appendTo($("#proQ"));
                        detailQuestion($info[i], listLi);
                        if(isbind && i==0){
                            $("#"+aimId).html();
                        }
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	questionListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
	    },
		relevantarticalList=function(){//相关文章信息
			oAjax("/ajax/article/byAssProfessor",{
				"id":professorId
			}, "get", function(data){
				if(data.data.length>0){
					$("#relateArt").parents(".conBlock").removeClass("displayNone");
					var itemlist = '';
					$("#relateArt").html("");
					for(var i = 0; i < data.data.length; i++) {
						var itemlist = '<li class="flexCenter"><a target="_blank" href="/'+ pageUrl('a',data.data[i]) +'" class="urlgo">';
							itemlist += '<p class="h2Font ellipsisSty-2"><em class="circlePre"></em>'+data.data[i].articleTitle+'</p>';
							itemlist += '</a></li>';
							$itemlist = $(itemlist);
						$("#relateArt").append($itemlist);
					}
				}
			});
		},
		likeExperts=function(){//感兴趣
			oAjax("/ajax/professor/ralateProfessors",{
				"professorId":professorId
			}, "get", function(data){
					var lengthT;
					if(data.data.length>5){
						lengthT=5;
					}else{
						lengthT=data.data.length
					}
					for(var i = 0; i < lengthT; i++) {
						var ExpId = data.data[i].id;
						(function(Id){
							oAjax("/ajax/professor/info/"+Id,{}, "get", function(data){
								$("#likePro").parents(".conBlock").removeClass("displayNone");
								var itemlist = '<li class="flexCenter"><a  target="_blank" href="" class="urlgo">';
									itemlist += '<div class="madiaHead useHead" id="userimg"></div>';
									itemlist += '<div class="madiaInfo">';
									itemlist += '<p><span class="h1Font" id="userName"></span><em class="authiconNew" title=""></em></p>';
									itemlist += '<p class="ellipsisSty h2Font" id="usertitle"></p>';
									itemlist += '</div></a></li>';
								var $itemlist = $(itemlist);
								$("#likePro").append($itemlist);
								if(data.data.title) {
									if(data.data.orgName) {
										$itemlist.find("#usertitle").text(data.data.title +"，"+ data.data.orgName);
									}else{
										$itemlist.find("#usertitle").text(data.data.title);
									}
								}else{
									if(data.data.office) {
										if(data.data.orgName) {
											$itemlist.find("#usertitle").text(data.data.office +"，"+ data.data.orgName);
										}else{
											$itemlist.find("#usertitle").text(data.data.office);
										}
									}else{
										if(data.data.orgName) {
											$itemlist.find("#usertitle").text(data.data.orgName);
										}
									}
								}
								$itemlist.find("#userName").text(data.data.name);
								$itemlist.find(".urlgo").attr("href", "userInforShow.html?professorId="+data.data.id);
								
								if(data.data.hasHeadImage == 1) {
									$itemlist.find("#userimg").attr("style", "background-image: url(/images/head/" + data.data.id + "_l.jpg);");
								}
								var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
								$itemlist.find(".authiconNew").attr("title", userType.title);
								$itemlist.find(".authiconNew").addClass(userType.sty);
							})
						})(ExpId)
					}
			});
		},
		relevantExperts=function(){
			oAjax("/ajax/professor/coadjutant",{
				"id":professorId
			}, "get", function(data){
					var lengthT;
					if(data.data.length>5){
						lengthT=5;
					}else{
						lengthT=data.data.length
					}
					for(var i = 0; i < lengthT; i++) {
						var ExpId = data.data[i].professorId;
						var paperN=data.data[i].paperCount;
						var patentN=data.data[i].patentCount;
						(function(Id,numL,numZ){
							oAjax("/ajax/professor/info/"+Id,{}, "get", function(data){
								$("#relatePro").parents(".conBlock").removeClass("displayNone");
								var itemlist = '<li class="flexCenter"><a target="_blank" href="" class="urlgo">';
									itemlist += '<div class="madiaHead useHead" id="userimg"></div>';
									itemlist += '<div class="madiaInfo">';
									itemlist += '<p><span class="h1Font" id="userName"></span><em class="authiconNew" title=""></em></p>';
									itemlist += '<p class="ellipsisSty h2Font" id="usertitle"></p>';
									itemlist += '<p class="h2Font ellipsisSty" id="copNum"></p>';
									itemlist += '</div></a></li>';
								var $itemlist = $(itemlist);
								$("#relatePro").append($itemlist);
								if(numL){
									if(numZ){
										$itemlist.find("#copNum").text("合作："+numZ+"项专利，"+numL+"篇论文")
									}else{
										$itemlist.find("#copNum").text("合作："+numL+"篇论文")
									}
								}else{
									if(numZ){
										$itemlist.find("#copNum").text("合作："+numZ+"项专利")
									}else{
										
									}
								}
								if(data.data.title) {
									if(data.data.orgName) {
										$itemlist.find("#usertitle").text(data.data.title +"，"+ data.data.orgName);
									}else{
										$itemlist.find("#usertitle").text(data.data.title);
									}
								}else{
									if(data.data.office) {
										if(data.data.orgName) {
											$itemlist.find("#usertitle").text(data.data.office +"，"+ data.data.orgName);
										}else{
											$itemlist.find("#usertitle").text(data.data.office);
										}
									}else{
										if(data.data.orgName) {
											$itemlist.find("#usertitle").text(data.data.orgName);
										}
									}
								}
								$itemlist.find("#userName").text(data.data.name);
								
								$itemlist.find(".urlgo").attr("href", "userInforShow.html?professorId="+data.data.id);
								
								if(data.data.hasHeadImage == 1) {
									$itemlist.find("#userimg").attr("style", "background-image: url(/images/head/" + data.data.id + "_l.jpg);");
								}
								var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
								$itemlist.find(".authiconNew").attr("title", userType.title);
								$itemlist.find(".authiconNew").addClass(userType.sty);
							})
						})(ExpId,paperN,patentN)
					}
			});
		},
		isActUser=function(){
			oAjax("/ajax/baseUserInfo",{
				"id": professorId
			}, "get", function(data){
				if(!data.data.activeTime){
					$(".last_meg").removeClass("displayNone");
					$(".message_b").on("click",function(){
						$(".meg_md5").toggle();
						if(data.data.email && data.data.mobilePhone){
						 	$("#wayTel").text('尾号为 '+data.data.mobilePhone+' 的手机号或邮箱 '+data.data.email);
						}else if(data.data.mobilePhone && !data.data.email){
							$("#wayTel").text('尾号为 '+data.data.mobilePhone+' 的手机号');
						}else if(data.data.email && !data.data.mobilePhone){
							$("#wayTel").text('邮箱 '+data.data.email);
						}
					})
				}else{
					$(".last_meg").addClass("displayNone");
				}
			})
		},
		queryPubCount=function(){
			oAjax("/ajax/watch/countProfessor",{//关注我的
				"id": professorId,
				"type":"1"
			}, "GET", function(data){
				$("#focusMe").text(data.data);
			});
			oAjax("/ajax/watch/countObject",{//我关注的
				"id": professorId,
				"type":"1"
			}, "GET", function(data){
				$("#myFocus").text(data.data);
			});
			oAjax("/ajax/professor/agree/sum",{//总获赞
				"id": professorId,
			}, "GET", function(data){
				$("#agreeMecount").text(data.data);
			});
			
			oAjax("/ajax/team/count",{//团队总数
				"id": professorId
			}, "GET", function(data){
				if(data.data>0 && data.data<99){
					$("#teamCount").text(data.data);
				}
				if(data.data>99){
					$("#teamCount").text("99+");
				}
			});
			oAjax("/ajax/article/count/publish",{//文章总数
				"owner": professorId,
				"category":"1"
			}, "GET", function(data){
				if(data.data>0 && data.data<99){
					$("#artCount").text(data.data);
				}
				if(data.data>99){
					$("#artCount").text("99+");
				}
			});
			oAjax("/ajax/resource/count/publish",{//资源总数
				"owner": professorId,
				"category":"1"
			}, "GET", function(data){
				if(data.data>0 && data.data<99){
					$("#resCount").text(data.data);
				}
				if(data.data>99){
					$("#resCount").text("99+");
				}
			});
			oAjax("/ajax/ware/count/publish",{//服务总数
				"owner": professorId,
				"category":"1"
			}, "GET", function(data){
				if(data.data>0 && data.data<99){
					$("#serCount").text(data.data);
				}
				if(data.data>99){
					$("#serCount").text("99+");
				}
			});
			oAjax("/ajax/ppatent/count/publish",{//专利总数
				"owner": professorId,
			}, "GET", function(data){
				if(data.data>0 && data.data<99){
					$("#patCount").text(data.data);
				}
				if(data.data>99){
					$("#patCount").text("99+");
				}
			});
			oAjax("/ajax/resResult/count/researcher",{//非专利成果总数
				"id": professorId
			}, "GET", function(data){
				if(data.data>0 && data.data<99){
					$("#unpatCount").text(data.data);
				}
				if(data.data>99){
					$("#unpatCount").text("99+");
				}
			});
			oAjax("/ajax/ppaper/count/publish",{//论文总数
				"owner": professorId,
			}, "GET", function(data){
				if(data.data>0 && data.data<99){
					$("#parCount").text(data.data);
				}
				if(data.data>99){
					$("#parCount").text("99+");
				}
			});
		},
		attentMyself=function(isbind){
			var aimId="attendMy",newStr="用户尚未被任何人关注"
			oAjax("/ajax/watch/watchList",{//关注我的列表
				"watchObject": professorId,
				"createTime": watchO.beiTime,
				"professorId":watchO.beiProId,
				"rows":rows
			}, "GET", function(res){
				console.log(res)
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					watchO.beiTime = $info[$info.length - 1].createTime;
					watchO.beiProId = $info[$info.length - 1].professorId;

					var arr=[];
					for(var i in $info) {
						arr[i]=$info[i].professorId;
					}
					detailPro(arr,aimId);
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	attentMyself(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		collectAnswer=function(isbind){
			var aimId="attendAnswer",newStr="用户还未收藏任何回答"
			oAjax("/ajax/question/answer/byWatch",{
				"time":watchO.WATime,
                "id":watchO.WAId,
                "uid":professorId,
                "rows":rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					watchO.WATime = $info[$info.length - 1].createTime;
					watchO.WAId = $info[$info.length - 1].id;
			
					for(var i = 0; i < $info.length; i++) {
						var listLi = $('<li>')
						listLi.appendTo($("#"+aimId));
                        detailAnswer($info[i], listLi);
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	collectAnswer(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
    	},
    	collectQuestion=function(isbind){
			var aimId="attendQuestion",newStr="用户还未关注任何问题"
			oAjax("/ajax/question/watch",{
				"time":watchO.WQTime,
                "id":watchO.WQId,
                "uid":professorId,
                "rows":rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					watchO.WQTime = $info[$info.length - 1].createTime;
					watchO.WQId = $info[$info.length - 1].id;
			
					for(var i = 0; i < $info.length; i++) {
						var listLi = $('<li>')
						listLi.appendTo($("#"+aimId));
                        detailQuestion($info[i], listLi);
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	collectQuestion(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
    	},
		collectSorts=function(type,isbind){
			var aimId="",newStr=""
			oAjax("/ajax/watch/proList",{//我关注的列表
				"professorId": professorId,
				"watchType":type,
				"createTime": watchO.watchTime,
				"watchObject":watchO.watchObjId,
				"rows":rows
			}, "GET", function(res){
				var $info = res.data;
				var arr=[];
				if($info.length > 0) {
					$("#"+aimId).show()
					watchO.watchTime = $info[$info.length - 1].createTime;
					watchO.watchObjId = $info[$info.length - 1].watchObject;
					for(var i in $info) {
						arr[i]=$info[i].watchObject;
					}
				}
				if(type==1){
                	aimId="attendPro"
                	newStr="用户还未关注任何专家"
                	detailPro(arr,aimId);
                }else if(type==2){
                	aimId="attendRes"
                	newStr="用户还未收藏任何资源"
                	detailRes(arr,aimId);
				}else if(type==3){
					aimId="attendArt"
					newStr="用户还未收藏任何文章"
					detailArt(arr,aimId);
				}else if(type==4){
					aimId="attendPatent"
					newStr="用户还未收藏任何专利成果"
					detailPat(arr,aimId);
				}else if(type==5){
					aimId="attendPaper"
					newStr="用户还未收藏任何论文"
					detailPer(arr,aimId);
				}else if(type==6){
					aimId="attendCmp"
					newStr="用户还未关注任何企业"
					detailCmp(arr,aimId);
				}else if(type==7){
					aimId="attendDemand"
					newStr="用户还未收藏任何需求"
					detailDemand(arr,aimId);
				}else if(type==10){
					aimId="attendSer"
					newStr="用户还未收藏任何服务"
					detailService(arr,aimId);
				}else if(type==11){
					aimId="attendProduct"
					newStr="用户还未收藏任何产品"
					detailProduct(arr,aimId);
				}
				else if(type==12){
					aimId="attendUnPatent"
					newStr="用户还未收藏任何非专利成果"
					detailUnPat(arr,aimId);
				}else if(type==13){
					aimId="attendTeam"
					newStr="用户还未关注任何团队"
					detailTeam(arr,aimId);
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	collectSorts(type,false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		detailTeam=function(arr,obj) {	
			oAjax("/ajax/team/qm",{
				id:arr,
			},"get",function(data){
				var dataStr=data.data;
				for(var i =0; i< dataStr.length; ++i){
					var li = document.createElement("li");
					li.className = "mui-table-view-cell";
				
					var strAdd = '';
						strAdd += '<a  target="_blank" href="teamInforShow.html?id='+ dataStr[i].id +'" class="flexCenter urlgo">';
						strAdd += '<div class="madiaInfo" style="padding-left:0"><p class="h1Font ellipsisSty">' + dataStr[i].name + '</span> <small> 团队人数 <span class="teamMembers"></span>人</small></p>';
						strAdd += '<p class="h2Font ellipsisSty">' + dataStr[i].city +' '+  dataStr[i].orgName + '</p>';
						strAdd += '</div>';
						strAdd += '</a>'
					var $itemlist = $(strAdd);
					$("#"+obj).append($itemlist);
					teamProCount(dataStr[i].id, $itemlist)
				}
			});
		},
		teamProCount=function (id, $list) {
			oAjax("/ajax/team/pro/count",{
				"id": id
			}, 'get', function($data) {
				$list.find('.teamMembers').html($data.data)
			})
		},
		detailPro=function(arr,obj) {
			oAjax("/ajax/professor/qm",{
				id:arr,
			},"get",function(data){
				var dataStr=data.data;
				for(var i = 0; i < dataStr.length; i++) {
					var li = document.createElement("li");
					li.className = "mui-table-view-cell";
					var userType = autho(dataStr[i].authType, dataStr[i].orgAuth, dataStr[i].authStatus);
					var os = "";
					if(dataStr[i].title) {
						if(dataStr[i].orgName) {
							os = dataStr[i].title + "，" + dataStr[i].orgName;
						} else {
							os = dataStr[i].title;
						}
					} else {
						if(dataStr[i].office) {
							if(dataStr[i].orgName) {
								os = dataStr[i].office + "，" + dataStr[i].orgName;
							} else {
								os = dataStr[i].office;
							}
						} else {
							if(dataStr[i].orgName) {
								os = dataStr[i].orgName;
							}
						}
					}
					var baImg = "../images/default-photo.jpg";
					if(dataStr[i].hasHeadImage == 1) {
						baImg = "/images/head/" + dataStr[i].id + "_l.jpg";
					}
				
					var strAdd = '';
						strAdd += '<a  target="_blank" href="userInforShow.html?professorId='+ dataStr[i].id +'" class="flexCenter urlgo">';
						strAdd += '<div class="madiaHead useHead" style="width: 80px;height: 80px;margin-top: -40px;background-image:url(' + baImg + ')"></div>';
						strAdd += '<div class="madiaInfo" style="padding-left:92px"><p class="h1Font ellipsisSty">' + dataStr[i].name + '</span><em class="authicon ' + userType.sty + '" title="'+userType.title+'"></em></p>';
						strAdd += '<p class="h2Font ellipsisSty">' + os + '</p>';
						strAdd += '</div>';
						strAdd += '</a>'
					li.innerHTML = strAdd
					document.getElementById(obj).appendChild(li);
				}
			});
		},
		detailCmp=function(arr,obj) {
			oAjax("/ajax/org/qm",{
				id:arr,
			},"get",function(data){
				var dataStr=data.data;
				for(var i = 0; i < dataStr.length; i++) {
					var li = document.createElement("li");
					li.setAttribute("data-id", dataStr[i].id);
					var oimg = (dataStr[i].hasOrgLogo) ?"/images/org/" + dataStr[i].id + ".jpg" : "../images/default-icon.jpg";
					var oAuth = (dataStr[i].authStatus == 3) ? 'authicon-com-ok' : '';
					var orgName = (dataStr[i].forShort) ? dataStr[i].forShort : dataStr[i].name;
					var orgType = (dataStr[i].orgType == '2') ? "上市企业" : "";
					var orgOther = (dataStr[i].industry) ? dataStr[i].industry.replace(/,/gi, " | ") : "";
					li.className = "mui-table-view-cell";
					var itemlist=''
						itemlist += '<a class="flexCenter" target="_blank" href="cmpInforShow.html?orgId='+dataStr[i].id+'"><div class="madiaHead cmpHead">';
						itemlist += '<div class="boxBlock"><img class="boxBlockimg" src="' + oimg + '"></div></div>';
						itemlist += '<div class="madiaInfo">';
						itemlist += '<p class="h1Font"><span>' + orgName + '</span><em class="authiconNew ' + oAuth + '" title="科袖认证企业"></em></p>';
	            		itemlist += '<p class="h2Font ellipsisSty"><span>' + orgType + '</span> <span>' + orgOther + '</span></p>';
						itemlist += '</div></a>';
					li.innerHTML = itemlist
					document.getElementById(obj).appendChild(li);
				}
			});
		},
		detailPat=function(arr,obj) {
			oAjax("/ajax/ppatent/qm",{
				id:arr,
			},"get",function(data){
				var dataStr=data.data;
				for(var i = 0; i < dataStr.length; i++) {
					var li = document.createElement("li");
					li.className = "mui-table-view-cell";
					var strAdd = '';
						strAdd += '<a  target="_blank" href="/'+ pageUrl("pt",dataStr[i]) +'" class="flexCenter urlgo">';
						strAdd += '<div class="madiaHead patentHead"></div>';
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr[i].name +'</p>';
						strAdd += '<p class="h2Font ellipsisSty">发明人：'+ dataStr[i].authors.substring(0, dataStr[i].authors.length - 1) +'</p>';
						strAdd += '<p class="h2Font ellipsisSty">申请人：'+ dataStr[i].reqPerson +'</p>';
						strAdd += '</div>';
						strAdd += '</a>';
					li.innerHTML = strAdd
					document.getElementById(obj).appendChild(li);
				}
			});
		},
		detailUnPat=function(arr,obj) {
			oAjax("/ajax/resResult/qm",{
				id:arr,
			},"get",function(data){
				var dataStr=data.data;
				for(var i = 0; i < dataStr.length; i++) {
					var li = document.createElement("li");
					li.className = "mui-table-view-cell";
					var resIM='<div class="madiaHead patentHead"></div>'
					if (dataStr[i].pic) {
						var src = '/data/researchResult' + dataStr[i].pic.split(",")[0]
						resIM = '<div class="madiaHead patentHead" style="background-image:url('+ src +')"></div>';
					}
					var strAdd = '';
						strAdd += '<a  target="_blank" href="unPatentShow.html?id='+dataStr[i].id+'" class="flexCenter urlgo">';
						strAdd += resIM
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr[i].name +'</p>';
						strAdd += '<p class="h2Font ellipsisSty displayNone">研究者：<span class="researchers"></span></p>';
						if (dataStr[i].orgId){
							strAdd += '<p class="h2Font ellipsisSty">所属机构：<span class="resOrgName"></span></p>';
						}
						strAdd += '</div>';
						strAdd += '</a>';
					li.innerHTML = strAdd
					document.getElementById(obj).appendChild(li);
					var $itemlist = $(li);
					queryResearcher(dataStr[i].id, $itemlist)
					if (dataStr[i].orgId) {
						queryReseOrgName(dataStr[i].orgId, $itemlist)
					}
				}
			});
		},
		queryResearcher = function (id, $list) {
			if (id) {
				oAjax("/ajax/resResult/researcher",{
					"id": id
				}, 'get', function($data) {
					var arr = []
					if($data.data.length) {
						$list.find('.researchers').parent().removeClass('displayNone')
						for (var i = 0; i < $data.data.length;i++) {
							arr.push($data.data[i].name)
						}
						$list.find('.researchers').html(arr.join(','))
					}
				})
			}
		},
		queryReseOrgName = function (id, $list) {
			if (id) {
				cacheModel.getCompany(id,function(sc,value){
					if(sc){
						if(value.forShort){
							$list.find(".resOrgName").html(value.forShort)
						}else{
							$list.find(".resOrgName").html(value.name)
						}
					}
				})
			}
		},
		detailPer=function(arr,obj) {
			oAjax("/ajax/ppaper/qm",{
				id:arr,
			},"get",function(data){
				var dataStr=data.data;
				for(var i = 0; i < dataStr.length; i++) {
					var moreInf=""
					if(!dataStr[i].cn4periodical){
						dataStr[i].cn4periodical="";
					}
					if(!dataStr[i].en4periodical){
						dataStr[i].en4periodical="";
					}
					if(!dataStr[i].pubDay){
						dataStr[i].pubDay="";
					}
					moreInf = dataStr[i].cn4periodical+ " " +dataStr[i].en4periodical+ " " +dataStr[i].pubDay
					
					var li = document.createElement("li");
					li.className = "mui-table-view-cell";
					var strAdd = '';
						strAdd += '<a  target="_blank" href="/'+ pageUrl("pp",dataStr[i]) +'" class="flexCenter urlgo">';
						strAdd += '<div class="madiaHead paperHead"></div>';
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr[i].name +'</p>';
						strAdd += '<p class="h2Font ellipsisSty">作者：'+ dataStr[i].authors.substring(0, dataStr[i].authors.length - 1) +'</p>';
						strAdd += '<p class="h2Font ellipsisSty">期刊：'+ moreInf +'</p>';
						strAdd += '</div>';
						strAdd += '</a>';
					li.innerHTML = strAdd
					document.getElementById(obj).appendChild(li);
				}
			});
		},
		detailRes=function(arr,obj) {
			oAjax("/ajax/resource/qm",{
				id:arr,
			},"get",function(data){
				console.log(data)
				var dataItem=data.data;
				for(var i = 0; i < dataItem.length; i++) {
					var dataStr=dataItem[i]
					var rImg = "../images/default-resource.jpg";
					if(dataStr.images.length) {
						rImg = "/data/resource/" + dataStr.images[0].imageSrc;
					}
					var li = document.createElement("li");
					li.className = "mui-table-view-cell";
					var strAdd = '';
						strAdd += '<a target="_blank" href="resourceShow.html?resourceId='+ dataStr.resourceId +'" class="flexCenter urlgo">';
						strAdd += '<div class="madiaHead resouseHead" style="background-image:url('+ rImg +')"></div>';
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr.resourceName +'</p>';
						strAdd += '<p class="h1Font ellipsisSty"><span class="ownerName"></span><em class="authiconNew ownerSty"></em></p>';
						strAdd += '<p class="h2Font ellipsisSty-2">用途：'+ dataStr.supportedServices+'</p></div>';
						strAdd += '</a>';
					li.innerHTML =strAdd
					var $itemlist = $(li);
					document.getElementById(obj).appendChild(li);
					if(dataStr.resourceType=="1"){
						(function(mo){
							cacheModel.getProfessor(dataStr.professorId,function(sc,value){
								if(sc){
									mo.find(".ownerName").html(value.name)
									var userType = autho(value.authType, value.orgAuth, value.authStatus);
									mo.find(".ownerSty").addClass(userType.sty).attr("title",userType.title)
								}else{
									console.log("error")
								}
							})
						})($itemlist);
					}else if(dataStr.resourceType=="2"){
						(function(mo){
							cacheModel.getCompany(dataStr.orgId,function(sc,value){
								if(sc){
									if(value.forShort){
										mo.find(".ownerName").html(value.forShort)
									}else{
										mo.find(".ownerName").html(value.name)
									}
									if(value.authStatus==3) {
										mo.find(".ownerSty").addClass("authicon-com-ok").attr("title","科袖认证企业")
									}
								}else{
									console.log("error")
								}
							})
						})($itemlist);
					}
				}
			});
		},
		detailArt=function (arr,obj) {
			oAjax("/ajax/article/qm",{
				id:arr,
			},"get",function(data){
				var dataStr=data.data;
				for(var i = 0; i < dataStr.length; i++) {
					var dataItem=dataStr[i]
					var arImg = "../images/default-artical.jpg";
					if(dataItem.articleImg) {
						arImg ="/data/article/" + dataItem.articleImg
					}
					var li = document.createElement("li");
					li.className = "mui-table-view-cell";
					var strAdd = '';
						strAdd += '<a  target="_blank" href="/'+ pageUrl('a',dataItem) +'" class="flexCenter urlgo">';
						strAdd += '<div class="madiaHead artHead" style="background-image:url('+ arImg +')"></div>';
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty-2">'+ dataItem.articleTitle +'</p>';
						strAdd += '<ul class="h2Font clearfix">';
						strAdd += '<li><span class="ownerName"></span></li>';
						strAdd += '<li><span class="time">'+ commenTime(dataItem.publishTime) +'</span></li>';
						strAdd += '<li><span class="comment"></span></li>';
						strAdd += '</ul></div>';
						strAdd += '</a>';
					li.innerHTML =strAdd
					var $itemlist = $(li);
					document.getElementById(obj).appendChild(li);
					if(dataItem.articleType=="1"){
						(function(mo){
							cacheModel.getProfessor(dataItem.ownerId,function(sc,value){
								if(sc){
									mo.find(".ownerName").html(value.name)
								}else{
									console.log("error")
								}
							})
						})($itemlist);
					}else if(dataItem.articleType=="2"){
						(function(mo){
							cacheModel.getCompany(dataItem.ownerId,function(sc,value){
								if(sc){
									if(value.forShort){
										mo.find(".ownerName").html(value.forShort)
									}else{
										mo.find(".ownerName").html(value.name)
									}
								}else{
									console.log("error")
								}
							})
						})($itemlist);
					}else if(dataItem.articleType=="3"){
						(function(mo){
							cacheModel.getPlatform(dataItem.ownerId,function(sc,value){
								if(sc){
									mo.find(".ownerName").html(value.name)
								}else{
									console.log("error")
								}
							})
						})($itemlist);
					}
				}
			});
		},
		detailDemand=function(arr,obj) {
			oAjax("/ajax/demand/qm",{
				id:arr,
			},"get",function(data){
				var dataStr=data.data;
				for(var i = 0; i < dataStr.length; i++) {
					var li = document.createElement("li");
					li.className = "mui-table-view-cell";
					var strCon='<a  target="_blank" href="demandShow.html?demandId='+ dataStr[i].id +'" class="flexCenter urlgo">';
					strCon+='<div class="madiaInfo" style="padding-left:0">'
					strCon+='<p class="h1Font ellipsisSty">'+ dataStr[i].title +'</p>'
					strCon+='<ul class="showli clearfix h3Font">'
					
					if(dataStr[i].city){ strCon+='<li>'+dataStr[i].city+'</li>' }
					if(dataStr[i].duration!=0){ strCon+='<li>预期 '+demandDuration[dataStr[i].duration]+'</li>' }
					if(dataStr[i].cost!=0){ strCon+='<li>预算 '+demandCost[dataStr[i].cost]+'</li>' }
					if(dataStr[i].invalidDay){ strCon+='<li>有效期至 '+TimeTr(dataStr[i].invalidDay)+'</li>' }
					
					strCon+='</ul></div></a>'
					
					li.innerHTML = strCon
					document.getElementById(obj).appendChild(li);
				}
				
			});
		},
		detailAnswer=function(dataStr,listLi){
	        var strAdd = '<a target="_blank" href="/qa-show.html?id='+dataStr.qid+'&topid='+dataStr.id+'">'+
	            '<div class="madiaInfo" style="padding-left: 0">' +
	            '<div class="ellipsisSty qa-question"></div>' +
	            '<div class="flexCenter qa-owner">' +
	            '</div>' +
	            '<div class="qa-con ellipsisSty-3">' + listConCut(dataStr.cnt) +'</div>' +
	            '<div class="showspan">' +
	            '<span>'+commenTime(dataStr.createTime)+'</span>' +
	            '<span class="agree"></span>' +
	            '<span class="leaveMsgCount"></span>' +
	            '</div>' +
	            '</div></a>';
	        var $strAdd = $(strAdd);
	        listLi.append( $strAdd);
	        if(dataStr.agree > 0) {
	            $strAdd.find(".agree").html("赞	"+dataStr.agree);
	        }
	        questioninfo(dataStr.qid, $strAdd);
	        proinfo(dataStr.uid, $strAdd);
	        leaveMsgCount(dataStr.id,4, $strAdd);
	    },
		detailQuestion=function(dataStr,listLi) {
	        var baImg = "../images/default-q&a.jpg";
	        var subs = new Array();
	        if(dataStr.img) {
	        	var subs=strToAry(dataStr.img)
	            baImg = "/data/question"+ subs[0];
	        }
	        var hd = "";
	        if (dataStr.replyCount > 0) {
	            hd = '<li><span>回答 ' + dataStr.replyCount + '</span></li>'
	        }
	        var strAdd = '<a target="_blank" href="/qa-show.html?id='+dataStr.id+'" class="flexCenter urlgo">'
	        strAdd += '<div class="madiaHead qa-Head" style="background-image:url('+ baImg +')"></div>';
	        strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty-2">'+ dataStr.title +'</p>';
	        strAdd += '<ul class="h2Font clearfix">'
	        strAdd += '<li><span class="time">'+commenTime(dataStr.createTime)+'</span></li><li><span class="qaPageview"></span></li>'+hd+'<li><span class="attendCount"></span></li>'
	        strAdd += '</ul></div></a>'
	
	        var $str = $(strAdd);
	        listLi.append($str);
	   },
		detailService=function(arr,obj) {
			oAjax("/ajax/ware/qm",{
				id:arr,
			},"get",function(data){
				console.log(data)
				var dataItem=data.data;
				for(var i = 0; i < dataItem.length; i++) {
					var dataStr=dataItem[i]
					var li = document.createElement("li");
					li.className = "mui-table-view-cell";
					var cnt="", rImg = "../images/default-service.jpg";
					if(dataStr.images) {
						var subs = strToAry(dataStr.images)
						if(subs.length > 0) {
							rImg="/data/ware" + subs[0]
						}
					}
					if(dataStr.cnt){
						cnt="内容："+dataStr.cnt
					}
					var strAdd = '';
						strAdd += '<a target="_blank" href="sevriceShow.html?sevriceId='+dataStr.id+'" class="flexCenter urlgo">';
						strAdd += '<div class="madiaHead resouseHead" style="background-image:url('+ rImg +')"></div>';
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr.name +'</p>';
						strAdd += '<p class="h1Font ellipsisSty"><span class="ownerName"></span><em class="authiconNew ownerSty"></em></p>';
						strAdd += '<p class="h2Font ellipsisSty-2">'+ cnt+'</p></div>';
						strAdd += '</a>';
					li.innerHTML = strAdd
					var $itemlist = $(li);
					document.getElementById(obj).appendChild(li);
					if(dataStr.category=="1"){
						(function(mo){
							cacheModel.getProfessor(dataStr.owner,function(sc,value){
								if(sc){
									mo.find(".ownerName").html(value.name)
									var userType = autho(value.authType, value.orgAuth, value.authStatus);
									mo.find(".ownerSty").addClass(userType.sty).attr("title",userType.title)
								}else{
									console.log("error")
								}
							})
						})($itemlist);
					}else if(dataStr.category=="2"){
						(function(mo){
							cacheModel.getCompany(dataStr.owner,function(sc,value){
								if(sc){
									if(value.forShort){
										mo.find(".ownerName").html(value.forShort)
									}else{
										mo.find(".ownerName").html(value.name)
									}
									if(value.authStatus==3) {
										mo.find(".ownerSty").addClass("authicon-com-ok").attr("title","科袖认证企业")
									}
								}else{
									console.log("error")
								}
							})
						})($itemlist);
					}
					
				}
			});
		},
		detailProduct=function(arr,obj) {
			oAjax("/ajax/product/qm",{
				id:arr,
			},"get",function(data){
				console.log(data)
				var dataItem=data.data;
				for(var i = 0; i < dataItem.length; i++) {
					var dataStr=dataItem[i]
					var li = document.createElement("li");
					li.className = "mui-table-view-cell";
					var cnt="", rImg = "../images/default-product.jpg";
					if(dataStr.images) {
						var subs = strToAry(dataStr.images)
						if(subs.length > 0) {
							rImg="/data/product" + subs[0]
						}
					}
					if(dataStr.cnt){
						cnt="简介："+dataStr.cnt
					}
					var strAdd = '';
						strAdd += '<a target="_blank" href="productShow.html?productId='+dataStr.id+'" class="flexCenter urlgo">';
						strAdd += '<div class="madiaHead resouseHead" style="background-image:url('+ rImg +')"></div>';
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr.name +'</p>';
						strAdd += '<p class="h1Font ellipsisSty"><span class="ownerName"></span><em class="authiconNew ownerSty"></em></p>';
						strAdd += '<p class="h2Font ellipsisSty-2">'+ cnt+'</p></div>';
						strAdd += '</a>';
					li.innerHTML = strAdd
					var $itemlist = $(li);
					document.getElementById(obj).appendChild(li);
					(function(mo){
						cacheModel.getCompany(dataStr.owner,function(sc,value){
							if(sc){
								if(value.forShort){
									mo.find(".ownerName").html(value.forShort)
								}else{
									mo.find(".ownerName").html(value.name)
								}
								if(value.authStatus==3) {
									mo.find(".ownerSty").addClass("authicon-com-ok").attr("title","科袖认证企业")
								}
							}else{
								console.log("error")
							}
						})
					})($itemlist);
				}
			});
		},
		proinfo=function(pid, $str) {
			oAjax("/ajax/professor/baseInfo/" + pid,{}, "get", function(data){
                var dataStr = data.data
                var baImg = "../images/default-photo.jpg";
                if (dataStr.hasHeadImage == 1) {
                    baImg = "/images/head/" + dataStr.id + "_l.jpg";
                }
                var userType = autho(dataStr.authType, dataStr.orgAuth, dataStr.authStatus);
                var os = "";
                if (dataStr.title) {
                    if (dataStr.orgName) {
                        os = dataStr.title + "，" + dataStr.orgName;
                    } else {
                        os = dataStr.title;
                    }
                } else {
                    if (dataStr.office) {
                        if (dataStr.orgName) {
                            os = dataStr.office + "，" + dataStr.orgName;
                        } else {
                            os = dataStr.office;
                        }
                    } else {
                        if (dataStr.orgName) {
                            os = dataStr.orgName;
                        }
                    }
                }
                var str = '<div class="owner-head useHead" style="background-image:url(' + baImg + ')"></div>' +
                    '<div class="owner-info">' +
                    '<div class="owner-name"><span class="h1Font">' + dataStr.name + '</span><em class="authiconNew ' + userType.sty + '" title="' + userType.title + '"></em></div>' +
                    '<div class="owner-tit mui-ellipsis h2Font">' + os + '</div>' +
                    '</div>'
                $str.find(".qa-owner").html(str)
	        });
	    },
	    questioninfo=function(qid, $str) {
	        oAjax("/ajax/question/qo",{
	        	id:qid
	        }, "get", function(data){
                $str.find(".qa-question").html(data.data.title);
                if(data.data.pageViews>0){
                    $str.find(".qaPageview").html("阅读量 "+data.data.pageViews);
                }else{
                    $str.find(".qaPageview").hide()
                }
	        });
	    },
		attendCount=function(id, $str) {
			 oAjax("/ajax/watch/countProfessor",{
	        	id:id,
            	type: "8"
	        }, "get", function(data){
                if(data.data > 0) {
                    $str.find(".attendCount").html("关注 "+data.data);
                }
		    });
		},
		bindClickFun=function(){
			$("#myAttends").unbind("click").on("click",function(){//关注与收藏
				openAttend()
			})
			
			$("#tab8user").unbind("click").on("click",function(){//点击更多
				watchO={
					beiTime:"",
					beiProId:"",
					
					watchTime:"",
					watchObjId:"",
				};
				var pa=$(".moreNavUl.moreBuUl>li.liNow").attr("rel")
				$("#"+pa).find("ul").html("")
				$("#"+pa).find(".js-load-more").show();
				if(userid!=professorId){
					//关注他的人
					$(".moreNavUl.moreBuUl>li.attentType").hide();
					$(".moreNavUl.moreBuUl>li.attendMy").addClass("liNow").text("关注他的人");
					$("#item8drop5").show().siblings().hide();
					attentMyself(true);
				}else{
					$("#item8drop1").show().siblings().hide();
					collectSorts(1,true);
				}
				collectSorts(3,true);
			})
			$("#tab6user").unbind("click").on("click",function(){//点击问答
				dataO = {
					AnsTime:"",
					AnsId:"",
					
					QuTime:"",
					QuId:"",
					
				};
				var pa=$(".moreNavUl.wendaUl>li.liNow").attr("rel")
				$("#"+pa).find("ul").html("")
				$("#"+pa).find(".js-load-more").show();
				if(userid!=professorId){
					//他的回答
					$(".moreNavUl.wendaUl>li").eq(0).hide().siblings().addClass("liNow").text("他的回答");
					$("#item6drop2").show().siblings().hide();
					answerListVal(true);
				}else{
					$(".wendaNav li").eq(0).addClass("liNow").siblings().removeClass("liNow");
					$("#item6drop1").show().siblings().hide();
					questionListVal(true);
				}
			})
			$("#item6more").on("click","li",function(){//问答tab切换
				var pa=$(this).attr("rel")
				$("#"+pa).find("ul").html("")
				$("#"+pa).find(".js-load-more").show();
				var sortN=$(this).attr("data-num");
				dataO = {
					AnsTime:"",
					AnsId:"",
					
					QuTime:"",
					QuId:"",
					
				};
				if(sortN==1){
					questionListVal(true);
				}else if(sortN==2){
					answerListVal(true);
				}
			})
			$("#tab4user").unbind("click").on("click",function(){//点击成果
				pageNo = 1
				var pa=$(".moreNavUl.wendaUl>li.liNow").attr("rel")
				$("#"+pa).find("ul").html("")
				$("#"+pa).find(".js-load-more").show();
				unPatentListVal(true);
			})
			$("#item4more").on("click","li",function(){
				var pa=$(this).attr("rel")
				$("#"+pa).find("ul").html("")
				$("#"+pa).find(".js-load-more").show();
				var sortN=$(this).attr("data-num");
				dataO = {
					patTime:"",
					patId:""
				};
				pageNo = 1
				if(sortN==1){
					unPatentListVal(true);
				}else if(sortN==2){
					patentListVal(true);
				}
			})
			$(".moreNavUl.moreBuUl").on("click","li.attentType:not(.rightbtn)",function(){//关注tab切换
				var pa=$(this).attr("rel")
				$("#"+pa).find("ul").html("")
				$("#"+pa).find(".js-load-more").show();
				var sortN=$(this).attr("data-num");
				watchO={
					watchTime:"",
					watchObjId:"",
					
					WATime:"",
					WAId:"",
					
					WQTime:"",
					WQId:"",
				};
				if(sortN==8){
					collectQuestion(true)	
				}else if(sortN==9){
					collectAnswer(true)	
				}else{
					collectSorts(sortN,true);
				}
			})
			
			$("#tabAttendMy").unbind("click").on("click",function(){//关注我的人
				var pa=$(this).attr("rel")
				$("#"+pa).find("ul").html("")
				$("#"+pa).find(".js-load-more").show();
				watchO={
					beiTime:"",
					beiProId:"",
				}
				attentMyself(true);
			})
			$("#attendmyGo").unbind("click").on("click",function(){
				if(userid!=professorId){
					$(".moreNavUl.moreBuUl>li.attentType").hide();//关注他的人
					$(".moreNavUl.moreBuUl>li.attendMy").addClass("liNow").text("关注他的人");
				}
				$(".mainNavUl li.rightbtn").addClass("liNow").siblings().removeClass("liNow");
				$(".moreNav").hide()
				$("#item8more").fadeIn();
				$("#item8user").show().siblings().hide();
				$(".moreBuUl li.attendMy").addClass("liNow").siblings().removeClass("liNow");
				$("#item8drop5").show().siblings().hide();
				watchO={
					beiTime:"",
					beiProId:"",
				}
				$("#item8drop5").find("ul").html("")
				$("#item8drop5").find(".js-load-more").show();
				attentMyself(true);
			})
			
			/*研究方向点赞*/
			var clFlag = 1;
			$("#researchAreaShow").on("click", ".plus", function() {
				if(userid && userid != null && userid != "null") {
					//点赞变化样式
					if(clFlag) {
						clFlag = 0;
					} else {
						return;
					}
					if($(this).data("isagree") > -1) {
						$(this).stop(true, true).animate({
							backgroundPositionY: 0
						}, 300); //变成未点赞样式
					} else {
						$(this).stop(true, true).animate({
							backgroundPositionY: -26
						}, 300); //变成点赞样式
					}
	
					$.ajax({
						"url": $(this).data("isagree") > -1 ? "/ajax/researchArea/unAgree" : "/ajax/researchArea/agree",
						"type": "POST",
						"data": {
							"targetId": $(this).data("pid"),
							"targetCaption": oArray[$(this).data("caption")],
							"opId": userid,
							"uname":$.cookie("userName")
						},
						"contentType": "application/x-www-form-urlencoded",
						"success": function(dataStr) {
							if(dataStr.success) {
								$.get("/ajax/professor/info/" + professorId, function(dataStr) {
									if(dataStr.success) {
										clFlag = 1;
										var $info = dataStr.data;
										if($info) {
											$("#researchAreaShow").empty("")
											if($info.researchAreas) {
												researchAreaShow($info.researchAreas, $info.editResearchAreaLogs);
											}
										}
									}
								})
							} else {
								$.MsgBox.Alert("提示", dataStr.msg);
							}
						}
					});
				} else {
					quickLog();
					operatTab();
					closeLog();
				}
	
			})
			
			//点击每个研究方向弹出研究方向详情窗口
			$("#researchAreaShow").on("click", ".favorBox,.favorCount", function() {
				var cap = $(this).attr("caption");
				researchAlert(cap)
			});
			
			//关闭按钮
			$("#workclose").click(function() {
				$(".resAreaCover").fadeOut();
			    $("body").css("position", "");
			});
			
			//点击查看全部资源
			$(".coninfobox").on("click","#seeMoreR",function(){
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				$("#tab2user").addClass("liNow").siblings().removeClass("liNow");
				$("#item1user").hide();
				$("#item2user").show();
			})
			//点击查看全部服务
			$(".coninfobox").on("click","#seeMoreS",function(){
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				$("#tab9user").addClass("liNow").siblings().removeClass("liNow");
				$("#item1user").hide();
				$("#item9user").show();
			})
			//点击查看全部文章
			$(".coninfobox").on("click","#seeMoreA",function(){
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				$("#tab3user").addClass("liNow").siblings().removeClass("liNow");
				$("#item1user").hide();
				$("#item3user").show();
			})
			//点击查看全部专利
			$(".coninfobox").on("click","#seeMoreP",function(){
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				$("#tab4user").addClass("liNow").siblings().removeClass("liNow");
				$("#item1user").hide();
				$("#item4user").show();
			})
			//点击查看全部论文
			$(".coninfobox").on("click","#seeMoreL",function(){
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				$("#tab5user").addClass("liNow").siblings().removeClass("liNow");
				$("#item1user").hide();
				$("#item5user").show();
			})
			//点击查看全部问题
	        $(".coninfobox").on("click","#seeMoreQA",function(){
	            document.body.scrollTop = document.documentElement.scrollTop = 0;
	            $("#tab6user").addClass("liNow").siblings().removeClass("liNow");
	            $("#item1user").hide();
	            $("#item6user").show();
	            if(userid === professorId) {
	                $(".wendaNav").show();
	            }
	            $(".wendaNav li").eq(1).addClass("liNow").siblings().removeClass("liNow");
	            $("#item6drop2").show().siblings().hide();
	        })
	
			//点击关注按钮
			$("#attentBtn").on('click', function() {
				if(userid && userid != null && userid != "null") {
					if($(this).is('.attenedSpan')){
						cancelCollectionAbout(professorId,$(this),1)
					} else {
						collectionAbout(professorId,$(this), 1);
					}
					queryPubCount();
					watchO={
						beiTime:"",
						beiProId:"",
					}
					$("#item8drop5").find("ul").html("")
					$("#item8drop5").find(".js-load-more").show();
					attentMyself(true);
				}else{
					quickLog();
					operatTab();
					closeLog();
				}
			});	
			//点击联系按钮
			$("#conbtn").on('click', function(){
				if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {
					location.href="tidings.html?id="+professorId
				} else {
					quickLog();
					operatTab();
					closeLog();
				}
			});
			
			//纠错反馈
			$(".correctSubmit").on("click",function(){
				var cntCon=$(this).siblings(".correctCon").val();
				var cntUser="";
				if(userid && userid != null && userid != "null") {
					cntUser = userid;
				}
				if(cntCon.length>500){
					$.MsgBox.Alert('提示', '纠错反馈内容不得超过500个字');
					return;
				}else{
					oAjax("/ajax/feedback/error/professor",{
						"id": professorId,
						"cnt":cntCon,
						"user":cntUser
					}, "POST", function(data){
						backSuccessed();
					});
				}
			})
	
		}

	if(GetQueryString("flag")) {
		researchAlert(GetQueryString("flag"))
	}
	if(GetQueryString("iLike")){
		openAttend();
	}
	if(userid!=professorId){
		pageViewLog(professorId,1)
		relevantExperts();//合作专家
		relevantarticalList();//相关文章
		likeExperts();//感兴趣专家
		isActUser();//判断用户是否被激活
		ifcollectionAbout(professorId,$(".goSpan").find(".attenSpan"), 1)
		$(".goSpan").show();
	}else{
		$(".goSpanTo").show();
		$(".myoneself").show();
	}
	queryPubCount();
	getUserInfo(); //获取详细信息
	demandListVal(true);
	articalListVal(true);
	teamListVal(true);
	resourceListVal(true);
	serviceListVal(true);
	patentListVal(true);
	unPatentListVal(true)
	paperListVal(true);
	answerListVal(true);
	bindClickFun();

	
		
})

