$(function() {
	$("#feedback").hide();
	loginStatus();//判断个人是否登录
	var userid = $.cookie("userid");
	var searchTmp,
		searchContent = $.trim(GetQueryString("searchContent")),
	    subjectText = $.trim(GetQueryString("subject")),
	    tagnum = $.trim(GetQueryString("tagflag"));
	    
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
	 	location.href="http://" + window.location.host + "/e/search.html?key="+searchContent;
	}
	var keyt,subject,industry,address,subject2,industry2,address2;
	var rows = 20,
		pageNo = 1,
		dataO = {
			proSortFirst:"",
			proStarLevel: "",
			proId: "",
			
			orgSortNum:"",
			orgModifyTime:"",
			orgId:"",
			
			artSortNum:"",
			artPublishTime:"",
			artId:"",
			
			resSortNum:"",
			resPublishTime:"",
			resId:"",
			
			patSortNum:"",
			patCreateTime:"",
			patId:"",
			
			parSortNum:"",
			parCreateTime:"",
			parId:"",
			
			serSortFirst:"",
			serTime: "",
			serId: "",
		};
	var objSort={
			"1":{
				obj:"professor",
				holder:"请输入专家姓名、机构、研究方向或相关关键词",
				tab:"#tabUser",
				conbox:"#itemUser"
			},
			"2":{
				obj:"resource",
				holder:"请输入资源名称、用途、发布者或相关关键词",
				tab:"#tabRes",
				conbox:"#itemRes"
			},
			"3":{
				obj:"article",
				holder:"请输入文章标题、作者或相关关键词",
				tab:"#tabArt",
				conbox:"#itemArt"
			},
			"4":{
				obj:"org",
				holder:"请输入企业名称、产品名称或相关关键词",
				tab:"#tabCmp",
				conbox:"#itemCmp"
			},
			"5":{
				obj:"ppatent",
				holder:"请输入成果名称、发明人或相关关键词",
				tab:"#tabPat",
				conbox:"#itemPat"
			},
			"6":{
				obj:"ppaper",
				holder:"请输入论文题目、作者或相关关键词",
				tab:"#tabPar",
				conbox:"#itemPar"
			},
			"7":{
				obj:"ware",
				holder:"请输入服务内容、发布者或相关关键词",
				tab:"#tabSer",
				conbox:"#itemSer"
			},
			"8":{
				obj:"team",
				holder:"请输入团队名称、机构或相关关键词",
				tab:"#tabTeam",
				conbox:"#itemTeam"
			}
		}
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
		filterList=function(subjectText){
			oAjax("/ajax/dataDict/qaDictCode",{//subject
				"dictCode":"SUBJECT",
			}, "get", function(data) {
				console.log(data);
				$(".academicField").html("");
				$(".academicField").append('<li class="filterCurrent">不限</li>');
				for(var i = 0; i < data.data.length; i++) {
					var itemlist = '<li class="ititle">'+data.data[i].caption+'</li>';
					$(".academicField").append(itemlist);
					if(i > 20)
						break;
				}
				$(".academicField li").each(function(i){
				    var textt = $(this).text();
				    if(textt == subjectText){
				    	$(this).addClass("filterCurrent").siblings().removeClass("filterCurrent");
				    }
				});
			})
			oAjax("/ajax/dataDict/qaDictCode",{//industry
				"dictCode":"INDUSTRY",
			}, "get", function(data) {
				$(".applicationIndustry").html("");
				$(".applicationIndustry").append('<li class="filterCurrent">不限</li>');
				for(var i = 0; i < data.data.length; i++) {
					var itemlist = '<li class="ititle">'+data.data[i].caption+'</li>';
					$(".applicationIndustry").append(itemlist);
					if(i > 20)
						break;
				}
			})
			oAjax("/ajax/dataDict/qaCity",{//address
				"dictCode":"ADDRESS",
			}, "get", function(data) {
				$(".cityList").html("");
				$(".cityList").append('<li class="filterCurrent">不限</li>');
				for(var i = 0; i < data.data.length; i++) {
					var itemlist = '<li class="ititle">'+data.data[i].caption+'</li>';
					$(".cityList").append(itemlist);
					if(i > 20)
						break;
				}
			})
			
			//筛选条件的选择
			$(".filterUl").on("click","li",function(){
				this.parentNode.querySelector('li.filterCurrent').classList.remove("filterCurrent");
				this.classList.add("filterCurrent");
			})
			//筛选条件的展开关闭
			$(".filterListNew").on("click",".rightbtn",function(){
				if(this.querySelector("em").className == "unfoldtr") {
					this.querySelector("em").classList.remove("unfoldtr");
					this.querySelector("em").classList.add("foldtr");
					this.parentNode.querySelector(".filterUl").classList.remove("filterUlactive");
				} else {
					this.querySelector("em").classList.add("unfoldtr");
					this.querySelector("em").classList.remove("foldtr");
					this.parentNode.querySelector(".filterUl").classList.add("filterUlactive");
				}
			})
		},
		expertBox=function(){
			var  subjectVal= $("#academicField1 li.filterCurrent").text();
			if(subjectVal=="不限"){
				subject = "";
			}else{
				subject = subjectVal;
			}
			var  industryVal= $("#applicationIndustry1 li.filterCurrent").text();
			if(industryVal=="不限"){
				industry = "";
			}else{
				industry = industryVal;
			}
			var  addressVal= $("#cityList1 li.filterCurrent").text();
			if(addressVal=="不限"){
				address = "";
			}else{
				address = addressVal;
			}
		},
		teamBox=function(){
			var  subjectVal= $("#academicField2 li.filterCurrent").text();
			if(subjectVal=="不限"){
				subject2 = "";
			}else{
				subject2 = subjectVal;
			}
			var  industryVal= $("#applicationIndustry2 li.filterCurrent").text();
			if(industryVal=="不限"){
				industry2 = "";
			}else{
				industry2 = industryVal;
			}
			var  addressVal= $("#cityList2 li.filterCurrent").text();
			if(addressVal=="不限"){
				address2 = "";
			}else{
				address2 = addressVal;
			}
		},
		professorListVal = function(subject,industry,address,isbind) {
			var aimId="expertList"
			oAjax("/ajax/professor/index/search",{
				"key":keyt,
				"subject":subject,
				"industry":industry,
				"address":address,
				"authType":1,
				"sortFirst": dataO.proSortFirst,
				"starLevel":dataO.proStarLevel,
				"id": dataO.proId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					dataO.proSortFirst = $info[$info.length - 1].sortFirst;
					dataO.proStarLevel = $info[$info.length - 1].starLevel;
					dataO.proId = $info[$info.length - 1].id;
			
					for(var i = 0; i < $info.length; i++) {
						var owner="",ownerSty="",ownerSt="",cnt="",hasImg="../images/default-photo.jpg"
						var userType = autho($info[i].authType, $info[i].orgAuth, $info[i].authStatus);
							ownerSt= userType.title;
							ownerSty=userType.sty;
						if($info[i].hasHeadImage) {
							hasImg="/images/head/" + $info[i].id + "_l.jpg"
						}
						var title = $info[i].title || "";
						var orgName = $info[i].orgName || "";
						var office = $info[i].office || "";
						if(title != "") {
							var ttitle = title + "，";
						}else{
							if(office!=""){
								var ttitle = office  + "，";	
							}else{
								var ttitle = office;	
							}
						}
						if(orgName != "") {
							orgName = orgName;
						}
						/*获取研究方向信息*/
						var researchAreas = $info[i].researchAreas;
						var rlist=""
						if( researchAreas.length > 0){
							rlist = '研究方向：';
							for(var n = 0; n < researchAreas.length; n++) {
								rlist += researchAreas[n].caption
								if(n < researchAreas.length - 1) {
									rlist += "；"
								}
							}
						}
						
						var itemlist = '<li class="flexCenter">';
							itemlist += '<a target="_blank" href="userInforShow.html?professorId=' + $info[i].id +'" class="linkhref"><div class="lefthead userheadt" style="background-image:url('+hasImg+')"></div>';
							itemlist += '<div class="centercon">';
							itemlist += '<p class="h1font">';
							itemlist += '<span class="nameSpan">'+$info[i].name+'</span>';
							itemlist += '<em class="authiconNew '+ownerSty+'" title="'+ownerSt+'"></em></p>';
							itemlist += '<p class="h2font ellipsisSty">'+ttitle+orgName+'</p>';
							itemlist += '<p class="h2font ellipsisSty">'+rlist+'</p>';
							itemlist += '</div></a>';
							itemlist += '</li>';
						
						$("#"+aimId).append(itemlist)
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	professorListVal(subject,industry,address,false)
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
		teamListVal = function(subject,industry,address,isbind) {
			var aimId="teamList"
			oAjax("/ajax/team/pq",{
				"status": 3,
				"key":keyt,
				"subject":subject,
				"industry":industry,
				"city":address,
				"pageSize": rows,
				"pageNo": pageNo
			}, "get", function(res){
				var $info = res.data.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					if(res.data.pageNo !== pageNo){
						$("#"+aimId).parent().find(".js-load-more").unbind("click");
						$("#"+aimId).parent().find(".js-load-more").hide();
						return
					}
					for(var i = 0; i < $info.length; i++) {
						var itemlist = '<li class="flexCenter">';
							itemlist += '<a target="_blank" href="teamInfoShow.html?id=' + $info[i].id +'" class="linkhref">';
							itemlist += '<div class="centercon" style="padding-left:0">';
							itemlist += '<p class="h1font">';
							itemlist += '<span class="nameSpan">'+$info[i].name+'  <small> 团队人数 <span class="teamMembers"></span>人</small></span>';
							itemlist += '<p class="h2font ellipsisSty"><span>' + $info[i].city + '</span> <span>' + $info[i].orgName + '</span></p>';
							itemlist += '</div></a>';
							itemlist += '</li>';
						
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						teamProCount($info[i].id, $itemlist)
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
						pageNo++
					 	teamListVal(subject,industry,address,false)
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
		teamProCount=function (id, $list) {
			oAjax("/ajax/team/pro/count",{
				"id": id
			}, 'get', function($data) {
				$list.find('.teamMembers').html($data.data)
			})
		},
		companyListVal=function(isbind){
			var aimId="companyList"
			oAjax("/ajax/org/index/search",{
				"key": keyt,
				"sortNum": dataO.orgSortNum,
				"modifyTime":dataO.orgModifyTime,
				"id": dataO.orgId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					dataO.orgSortNum = $info[$info.length - 1].sortNum;
					dataO.orgModifyTime = $info[$info.length - 1].modifyTime;
					dataO.orgId = $info[$info.length - 1].id;
			
					for(var i = 0; i < $info.length; i++) {
						var cmpname="",orgOther = "",orgType="",orgSty="",orgSt="",orgLogo="/images/default-icon.jpg"
						if($info[i].forShort){
							cmpname=$info[i].forShort;
						}else{
							cmpname=$info[i].name;
						}
						if($info[i].hasOrgLogo) {
							orgLogo="/images/org/" + $info[i].id + ".jpg";
						}
						if($info[i].authStatus == 3) {
							orgSty="authicon-com-ok"
							orgSt="科袖认证企业"
						}
						if($info[i].industry) {
							orgOther = $info[i].industry.replace(/,/gi, " | ");
						}
						if($info[i].orgType == "2") {
							orgType=orgTypeShow[$info[i].orgType] + "<span style='margin-right:10px;'></span>";
						}
						var itemlist = '<li class="flexCenter">';
							itemlist += '<a target="_blank" href="cmpInforShow.html?orgId='+ $info[i].id +'" class="linkhref"><div class="lefthead companyhead">';
							itemlist += '<div class="boxBlock"><img class="boxBlockimg" src="'+orgLogo+'"></div></div>';
							itemlist += '<div class="centercon centercon2">';
							itemlist += '<p class="h1font"><span>'+cmpname+'</span><em class="authiconNew '+orgSty+'" title="'+orgSt+'"></em></p>';
	                		itemlist += '<p class="h2font ellipsisSty"><span>'+orgType+'</span> <span>'+orgOther+'</span></p>';
							itemlist += '</div></a></li>';
							
						$("#"+aimId).append(itemlist)
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	companyListVal(false)
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
		articalListVal=function(isbind){
			var aimId="articalList"
			oAjax("/ajax/article/index/search",{
				"key": keyt,
				"sortNum": dataO.artSortNum,
				"publishTime":dataO.artPublishTime,
				"id": dataO.artId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					dataO.artSortNum = $info[$info.length - 1].sortNum;
					dataO.artPublishTime = $info[$info.length - 1].publishTime;
					dataO.artId = $info[$info.length - 1].articleId;
			
					for(var i = 0; i < $info.length; i++) {
						var sowU="",hasImg="/images/default-artical.jpg"
						if($info[i].pageViews!=0){
							if($info[i].articleAgree!=0){
								sowU='<span>阅读量 '+$info[i].pageViews+'</span><span>赞 '+$info[i].articleAgree+'</span>'
							}else{
								sowU='<span>阅读量 '+$info[i].pageViews+'</span>'
							}
						}
						if($info[i].articleImg) {
							hasImg="/data/article/" + $info[i].articleImg
						}

						var itemlist = '<li class="flexCenter">';
							itemlist += '<a target="_blank" href="/'+pageUrl('a',$info[i])+'" class="linkhref"><div class="lefthead articalhead" style="background-image:url('+hasImg+')"></div>';
							itemlist += '<div class="centercon centercon2">';
							itemlist += '<p class="h1font ellipsisSty-2">'+$info[i].articleTitle+'</p>';
							itemlist += '<div class="h2font showInfo" id="showInfo">'
							itemlist += '<span class="nameSpan ownerName"></span>'
							itemlist += '<span class="time">'+commenTime($info[i].publishTime)+'</span>'
							itemlist += sowU
							itemlist += '<span class="leaveMsgCount"></span>'
							itemlist += '</div>'
							itemlist += '</div></a></li>';
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						leaveMsgCount($info[i].articleId,1,$itemlist);
							
						if($info[i].articleType=="1"){
							(function(mo){
								cacheModel.getProfessor($info[i].ownerId,function(sc,value){
									if(sc){
										mo.find(".ownerName").html(value.name);
									}else{
										console.log("error")
									}
								});
							})($itemlist);
						}else if($info[i].articleType=="2"){
							(function(mo){
								cacheModel.getCompany($info[i].ownerId,function(sc, value){
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
						}else if($info[i].articleType=="3"){
							(function(mo){
								cacheModel.getPlatform($info[i].ownerId,function(sc, value){
									if(sc){
										mo.find(".ownerName").html(value.name)
									}else{
										console.log("error")
									}
								})
							})($itemlist);
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
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
			var aimId="resourceList"
			oAjax("/ajax/resource/index/search",{
				"key": keyt,
				"sortNum": dataO.resSortNum,
				"publishTime":dataO.resPublishTime,
				"id": dataO.resId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					dataO.resSortNum = $info[$info.length - 1].sortNum;
					dataO.resPublishTime = $info[$info.length - 1].publishTime;
					dataO.resId = $info[$info.length - 1].resourceId;
			
					for(var i = 0; i < $info.length; i++) {
						var hasImg="/images/default-resource.jpg"
						if($info[i].images.length > 0) {
							hasImg="/data/resource/" + $info[i].images[0].imageSrc
						}
						
						var itemlist = '<li class="flexCenter">';
							itemlist += '<a target="_blank" href="resourceShow.html?resourceId=' + $info[i].resourceId +'" class="linkhref"><div class="lefthead resouhead" style="background-image:url('+hasImg+')"></div>';
							itemlist += '<div class="centercon">';
							itemlist += '<p class="h1font">'+$info[i].resourceName+'</p>';
							itemlist += '<p class="h2font">';
							itemlist += '<span class="nameSpan ownerName"></span>';
							itemlist += '<em class="ownerSty authiconNew"></em></p>';
							itemlist += '<p class="h2font ellipsisSty-2">用途：'+ $info[i].supportedServices+'</p>';
							itemlist += '</div></a></li>';
							
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						if($info[i].resourceType=="1"){
							(function(mo){
								cacheModel.getProfessor($info[i].professorId,function(sc,value){
									if(sc){
										mo.find(".ownerName").html(value.name)
										var userType = autho(value.authType, value.orgAuth, value.authStatus);
										mo.find(".ownerSty").addClass(userType.sty).attr("title",userType.title)
									}else{
										console.log("error")
									}
								})
							})($itemlist);
						}else if($info[i].resourceType=="2"){
							(function(mo){
								cacheModel.getCompany($info[i].orgId,function(sc,value){
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
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
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
		patentListVal = function(isbind) {
			var aimId="patentList"
			oAjax("/ajax/ppatent/index/search",{
				"key": keyt,
				"sortNum": dataO.patSortNum,
				"createTime":dataO.patCreateTime,
				"id": dataO.patId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					dataO.patSortNum = $info[$info.length - 1].sortNum;
					dataO.patCreateTime = $info[$info.length - 1].createTime;
					dataO.patId = $info[$info.length - 1].id;
			
					for(var i = 0; i < $info.length; i++) {
						var itemlist = '<li class="flexCenter">';
							itemlist += '<a target="_blank" href="/' + pageUrl("pt",$info[i]) +'" class="linkhref"><div class="lefthead patenthead"></div>';
							itemlist += '<div class="centercon centercon2">';
							itemlist += '<p class="h1font ellipsisSty">'+ $info[i].name +'</p>';
							itemlist += '<p class="h2font ellipsisSty">发明人：'+ $info[i].authors.substring(0, $info[i].authors.length - 1) +'</p>';
							itemlist += '<p class="h2font ellipsisSty">申请人：'+ $info[i].reqPerson +'</p>';
							itemlist += '</div></a></li>';
						$("#"+aimId).append(itemlist)
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
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
		unpatentListVal = function(isbind) {
			var aimId="unpatentList"
			oAjax("/ajax/resResult/pq",{
				"key": keyt,
				"status": ['1'],
				"pageSize": rows,
				"pageNo": pageNo
			}, "get", function(res){
				var $info = res.data.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					if(res.data.pageNo !== pageNo){
						$("#"+aimId).parent().find(".js-load-more").unbind("click");
						$("#"+aimId).parent().find(".js-load-more").hide();
						return
					}
					for(var i = 0; i < $info.length; i++) {
						var resIM='<div class="lefthead patenthead"></div>'
						if ($info[i].pic) {
							var src = '/data/researchResult' + $info[i].pic.split(",")[0]
							resIM = '<div class="lefthead patenthead" style="background-image:url('+ src +')"></div>';
						}
						var itemlist = '<li class="flexCenter">';
							itemlist += '<a target="_blank" href="unPatentShow.html?id='+$info[i].id+'" class="linkhref">';
							itemlist += resIM
							itemlist += '<div class="centercon centercon2">';
							itemlist += '<p class="h1font ellipsisSty">'+ $info[i].name +'</p>';
							itemlist += '<p class="h2font ellipsisSty displayNone">研究者：<span class="researchers"></span></p>';
							if ($info[i].orgId) {
								itemlist += '<p class="h2font ellipsisSty">所属机构：<span class="resOrgName"></span></p>';
							}
							itemlist += '</div></a></li>';
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
                    insertNodata(aimId);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
						pageNo++
					 	unpatentListVal(false)
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
		paperListVal = function(isbind) {
			var aimId="paperList"
			oAjax("/ajax/ppaper/index/search",{
				"key": keyt,
				"sortNum": dataO.parSortNum,
				"createTime":dataO.parCreateTime,
				"id": dataO.parId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					dataO.parSortNum = $info[$info.length - 1].sortNum;
					dataO.parCreateTime = $info[$info.length - 1].createTime;
					dataO.parId = $info[$info.length - 1].id;
			
					for(var i = 0; i < $info.length; i++) {
						var moreInf=""
						if(!$info[i].cn4periodical){
							$info[i].cn4periodical="";
						}
						if(!$info[i].en4periodical){
							$info[i].en4periodical="";
						}
						if(!$info[i].pubDay){
							$info[i].pubDay="";
						}
						moreInf = $info[i].cn4periodical+ " " +$info[i].en4periodical+ " " +$info[i].pubDay;
						
						var itemlist = '<li class="flexCenter">';
						itemlist += '<a target="_blank" href="/' + pageUrl("pp",$info[i]) +'" class="linkhref"><div class="lefthead paperhead"></div>';
						itemlist += '<div class="centercon centercon2">';
						itemlist += '<p class="h1font ellipsisSty">'+ $info[i].name +'</p>';
						itemlist += '<p class="h2font ellipsisSty">作者：'+ $info[i].authors.substring(0, $info[i].authors.length - 1) +'</p>';
						itemlist += '<p class="h2font ellipsisSty">期刊：'+ moreInf +'</p>';
						itemlist += '</div></a></li>';
						$("#"+aimId).append(itemlist)
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
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
		serviceListVal = function(isbind) {
			var aimId="serviceList"
			oAjax("/ajax/ware/index/search",{
				"key": keyt,
				"sortFirst": dataO.serSortFirst,
				"time":dataO.serTime,
				"id": dataO.serId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					dataO.serSortFirst = $info[$info.length - 1].sortFirst;
					dataO.serTime = $info[$info.length - 1].modifyTime;
					dataO.serId = $info[$info.length - 1].id;
			
					for(var i = 0; i < $info.length; i++) {
						var cnt="", img="../images/default-service.jpg"
						if($info[i].images) {
							var subs = strToAry($info[i].images)
							if(subs.length > 0) {
								img="/data/ware" + subs[0]
							}
						}
						if($info[i].cnt){
							cnt="内容："+$info[i].cnt
						}
						
						var itemlist ='<li class="flexCenter">';
							itemlist+= '<a href="sevriceShow.html?sevriceId='+$info[i].id+'" target="_blank" class="resourceUrl linkhref">';
							itemlist += '<div class="lefthead resouhead" style="background-image:url('+ img +')"></div>';
							itemlist += '<div class="centercon">';
							itemlist += '<div class="h1font">'+$info[i].name+'</div>';
							itemlist += '<div class="h2font">';
							itemlist += '<span class="nameSpan ownerName"></span>';
							itemlist += '<em class="ownerSty authiconNew"></em></div>';
							itemlist += '<div class="h2font ellipsisSty-2">'+ cnt +'</div>';
							itemlist += '</div></a></li>';
							
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						if($info[i].category=="1"){
							(function(mo){
								cacheModel.getProfessor($info[i].owner,function(sc,value){
									if(sc){
										mo.find(".ownerName").html(value.name)
										var userType = autho(value.authType, value.orgAuth, value.authStatus);
										mo.find(".ownerSty").addClass(userType.sty).attr("title",userType.title)
									}else{
										console.log("error")
									}
								})
							})($itemlist);
						}else if($info[i].category=="2"){
							(function(mo){
								cacheModel.getCompany($info[i].owner,function(sc,value){
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
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
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
		searchToFun=function(){
			var sortN = $(".filterdiv .liactive").attr("data-id");
			var sC=$.trim($(".searchsome").val());
			if(sC){
				keyt =sC
				searchTmp=keyt
			}
			dataO = {
				proSortFirst:"",
				proStarLevel: "",
				proId: "",
				
				orgSortNum:"",
				orgModifyTime:"",
				orgId:"",
				
				artSortNum:"",
				artPublishTime:"",
				artId:"",
				
				resSortNum:"",
				resPublishTime:"",
				resId:"",
				
				patSortNum:"",
				patCreateTime:"",
				patId:"",
				
				parSortNum:"",
				parCreateTime:"",
				parId:"",
				
				serSortFirst:"",
				serTime: "",
				serId: "",
			};
			pageNo = 1
			if(!keyt) return;
			tabToFun(sortN)
		},
		tabToFun=function(item){
			$(objSort[item].tab).addClass("liactive").siblings().removeClass("liactive")
			$(objSort[item].conbox).show().siblings().hide()
			$(objSort[item].conbox).find("ul.listitemdiv").html("")
			$(".searchsome").attr("placeholder",objSort[item].holder)
			$(".searchsome").val(searchTmp)
			$(".search-txt").val(searchTmp)
			$(".js-load-more").show()
			if(item==1){
				expertBox();
				professorListVal(subject,industry,address,true) 
			}else if(item==2){
				resourceListVal(true);
			}else if(item==3){
				articalListVal(true);
			}else if(item==4){
				companyListVal(true);
			}else if(item==5){
				unpatentListVal(true);
			}else if(item==6){
				paperListVal(true);
			}else if(item==7){
				serviceListVal(true);
			}else if(item==8){
				teamBox();
				teamListVal(subject2,industry2,address2,true) 
			}
		},
		bindComEvent=function(){
			$('#itemPat').on('click', '.steptit>a', function(){
				$('#itemPat .steptit>a').removeClass('active')
				$(this).addClass('active')
				var st = $(this).attr("data-index")
				$('#itemPat .searchCon').addClass('displayNone')
				$('#itemPat .searchCon').eq(st).removeClass('displayNone')
				if (st === '0') {
					$('#unpatentList').html('')
					pageNo = 1
					unpatentListVal(true)
				} else if(st === '1'){
					$('#patentList').html('')
					dataO = {
						patSortNum:"",
						patCreateTime:"",
						patId:""
					}
					patentListVal(true);
				}
			})
			$("#academicField1,#applicationIndustry1,#cityList1").on("click","li",function(){//筛选搜索
				$(objSort[1].conbox).find("ul.listitemdiv").html("")
				dataO = {
					proSortFirst:"",
					proStarLevel: "",
					proId: "",
				};
				expertBox();
				professorListVal(subject,industry,address,true) 
			})
			$("#academicField2,#applicationIndustry2,#cityList2").on("click","li",function(){//筛选搜索
				$(objSort[8].conbox).find("ul.listitemdiv").html("")
				pageNo = 1
				teamBox();
				teamListVal(subject2,industry2,address2,true) 
			})
			$(".filterdiv.choosediv").on("click","li",function(){//tab切换
				var sortN=$(this).attr("data-id");
				dataO = {
					proSortFirst:"",
					proStarLevel: "",
					proId: "",
					
					orgSortNum:"",
					orgModifyTime:"",
					orgId:"",
					
					artSortNum:"",
					artPublishTime:"",
					artId:"",
					
					resSortNum:"",
					resPublishTime:"",
					resId:"",
					
					patSortNum:"",
					patCreateTime:"",
					patId:"",
					
					parSortNum:"",
					parCreateTime:"",
					parId:"",
					
					serSortFirst:"",
					serTime: "",
					serId: "",
				};
				pageNo = 1
				tabToFun(sortN)
			})
			$(".searchsome").keydown(function(e) {//搜索enter
				if(e.which == 13) { searchToFun() }
			})
			$(".searchgo").on("click",function(e) {//搜索click
				searchToFun()
			})
			
			$(".searchblock").hide();//顶部搜索条
			$(document).scroll(function() {
				var top = $(document).scrollTop();
				if (top >= 80) {
					$(".searchblock").stop(true,false).fadeIn();
				}else{
					$(".searchblock").stop(true,false).fadeOut();
				}
			})	
			
			window.setTimeout(function() {//不随滚动条滚动的固定层广告代码
		        $('#scroll-fixed-ad').scrollFix({
		        	oflag:true,
		        	startTop:'#scroll-fixed-ad',
		            distanceTop: $("header").outerHeight(true) + 20,
		            endPos: 'footer',
		            zIndex: 998
		        });
			}, 300);
		}
	
	
	if(subjectText==""){
		subject="";
	}else{
		subject=subjectText;
	}
	if(searchContent==""){
		keyt="";
	}else{
		keyt=searchContent;
		searchTmp=keyt;
		$(".searchsome").val(searchContent);
		$(".search-txt").val(searchContent)
	}
	if(tagnum){
		keyt=searchContent;
		searchTmp=keyt;
		tabToFun(tagnum)
	}

	filterList()
	professorListVal(subject,industry,address,true)
	bindComEvent()
	
});