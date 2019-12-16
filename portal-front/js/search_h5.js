
$(function() {
	
	var searchTmp,
		searchContent = $.trim(GetQueryString("key")),
	    tagnum = $.trim(GetQueryString("flag"));
	var keyt,subject,industry,address,authType = 1;
	if(searchContent!=""){
		keyt=searchContent;
		searchTmp=searchContent;
		document.getElementById("searchval").value=searchContent;
	}
	var rows = 20,
		dataO = {
			proSortFirst:"",
			proStarLevel: "",
			proId: "",
			
			orgSortNum:"",
			orgModifyTime:"",
			orgId:"",
			
			// artSortNum:"",
			// artPublishTime:"",
			// artId:"",
			
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
				loadFlag:true,
				conbox:"#proList"
			},
			"2":{
				obj:"resource",
				loadFlag:true,
				conbox:"#resourceList"
			},
			"3":{
				obj:"article",
				loadFlag:true,
				conbox:"#articleList"
			},
			"4":{
				obj:"ppatent",
				loadFlag:true,
				conbox:"#patentList"
			},
			"5":{
				obj:"ppaper",
				loadFlag:true,
				conbox:"#paperList"
			},
			"6":{
				obj:"org",
				loadFlag:true,
				conbox:"#companyList"
			},
			"7":{
				obj:"ware",
				loadFlag:true,
				conbox:"#serviceList"
			}
		}
	// var tabOrder=["1","7","2","4","5","3","6"]
	var tabOrder=["1","7","2","4","5","6"]
	var mySwiperTab = new Swiper('.swiper-container-tab',{
		freeMode : true,
		slidesPerView : 'auto',
		freeModeSticky : true ,
	})

	var mySwiper = new Swiper('.swiper-container-main',{//内容列表mainSwiper
		direction: 'vertical',
		scrollbar: '.swiper-scrollbar',
		autoplay : 500,
		mode : 'vertical',
		slidesPerView: 'auto',
		mousewheelControl: true,
		freeMode: true,
		onTouchMove: function(swiper){		//手动滑动中触发
			var _viewHeight = document.getElementsByClassName('swiper-wrapper-main')[0].offsetHeight;
            var _contentHeight = document.getElementsByClassName('swiper-slide')[0].offsetHeight;
		},
		onTouchEnd: function(swiper) {
			var _viewHeight = document.getElementsByClassName('swiper-wrapper-main')[0].offsetHeight;
            var _contentHeight = document.getElementsByClassName('swiper-slide')[0].offsetHeight;
             // 上拉加载
            if(mySwiper.translate <= _viewHeight - _contentHeight - 50 && mySwiper.translate < 0) {
                setTimeout(function() {
                	var item;
                	if(tagnum){
                		item=tagnum
                	}else{
                		item=$('.swiper-slide-tab.active-tab').attr("data-tab")
                	}
                	tabToFun(item)
                }, 300);
            }
            if(mySwiper.translate >= 50) {
                setTimeout(function() {
                    //刷新操作
                    mySwiper.update(); // 重新计算高度;
                }, 1000);
            }else if(mySwiper.translate >= 0 && mySwiper.translate < 50){

            }
            //return false;
		}
	});
	var mySwiper2 = new Swiper('.swiper-container2',{//tabSwiper
		onTransitionEnd: function(swiper){
			$('.w').css('transform', 'translate3d(0px, 0px, 0px)')
			$('.swiper-container2 .swiper-slide-active').css('height','auto').siblings('.swiper-slide').css('height','0px');
			mySwiper.update();
			$('.swiper-slide-tab').eq(mySwiper2.activeIndex).addClass('active-tab').siblings('.swiper-slide-tab').removeClass('active-tab');
			var tabitem=$('.swiper-slide-tab').eq(mySwiper2.activeIndex).attr("data-tab");
			mySwiperTab.slideTo(mySwiper2.activeIndex, 500, false);
			if(mySwiper2.activeIndex<3){
				$(".tr").css('transform', 'translate3d(0px, 0px, 0px)')
			}
			tagnum=tabitem
			clearToFun(tagnum)
			if(mySwiper2.activeIndex==0){
				$("#sele").removeClass("displayNone");
				$("#searB").addClass("searchboxNewT");
			}else{
				$("#sele").addClass("displayNone");
				$("#searB").removeClass("searchboxNewT");
			}
			
		}
	});
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
				// console.log(data);
				$("#subject").html("");
				$("#subject").append('<li class="filterCurrent">不限</li>');
				for(var i = 0; i < data.data.length; i++) {
					var itemlist = '<li class="ititle">'+data.data[i].caption+'</li>';
					$("#subject").append(itemlist);
				}
				$("#subject li").each(function(i){
				    var textt = $(this).text();
				    if(textt == subjectText){
				    	$(this).addClass("filterCurrent").siblings().removeClass("filterCurrent");
				    }
				});
			})
			oAjax("/ajax/dataDict/qaDictCode",{//industry
				"dictCode":"INDUSTRY",
			}, "get", function(data) {
				$("#industry").html("");
				$("#industry").append('<li class="filterCurrent">不限</li>');
				for(var i = 0; i < data.data.length; i++) {
					var itemlist = '<li class="ititle">'+data.data[i].caption+'</li>';
					$("#industry").append(itemlist);
				}
			})
			oAjax("/ajax/dataDict/qaCity",{//address
				"dictCode":"ADDRESS",
			}, "get", function(data) {
				$("#address").html("");
				$("#address").append('<li class="filterCurrent">不限</li>');
				for(var i = 0; i < data.data.length; i++) {
					var itemlist = '<li class="ititle">'+data.data[i].caption+'</li>';
					$("#address").append(itemlist);
				}
			})
		},
		expertBox=function(){
			var  subjectVal= $("#subject li.filterCurrent").text();
			if(subjectVal=="不限"){
				subject = "";
			}else{
				subject = subjectVal;
			}
			var  industryVal= $("#industry li.filterCurrent").text();
			if(industryVal=="不限"){
				industry = "";
			}else{
				industry = industryVal;
			}
			var  addressVal= $("#address li.filterCurrent").text();
			if(addressVal=="不限"){
				address = "";
			}else{
				address = addressVal;
			}
			professorListVal() 
		},
		professorListVal = function() {
			var aimId="proList"
			oAjax("/ajax/professor/index/search",{
				"key":keyt,
				"subject":subject,
				"industry":industry,
				"address":address,
				"authType":authType,
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
						var baImg = "../images/default-photo.jpg";
						if($info[i].hasHeadImage == 1) {
							baImg = "/images/head/" + $info[i].id + "_l.jpg";
						}
						var liItem = document.createElement("li");
							liItem.className = "mui-table-view-cell"
							liItem.setAttribute("data-id",$info[i].id)
						var oString = '<div class="flexCenter clearfix">'
							oString += '<div class="madiaHead useHead" style="background-image:url('+baImg+')"></div>'
							oString += '<div class="madiaInfo">'
							oString += '<p class="ellipsisSty"><span class="h1Font">'+$info[i].name+'</span><em class="authiconNew '+userType.sty+'" title="'+userType.title+'"></em></p>'
							oString += '<p class="h2Font ellipsisSty">'+ttitle+orgName+'</p>'
							oString += '<p class="h2Font ellipsisSty">'+rlist+'</p>'
							oString += '</div></div>'
						liItem.innerHTML = oString;
						document.getElementById(aimId).appendChild(liItem)
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
                }
				if ($info.length > rows) {
                    objSort[1].loadFlag=true;
                }
				if($info.length == 0){
                	objSort[1].loadFlag=false;
					$(".loadtip").html('没有更多数据了');
					return;
                }
			})
		},
		companyListVal=function(){
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
						var imgL,thisName,thisAuth,thisTitle,otherI="";
						if($info[i].hasOrgLogo == 1) {
							imgL="/images/org/" + $info[i].id + ".jpg";
						}else{
							imgL='../images/default-icon.jpg'
						}
						if($info[i].forShort){
							thisName=$info[i].forShort
						}else{
							thisName=$info[i].name
						}
						if($info[i].industry){
							otherI=$info[i].industry.replace(/,/gi, " | ");
						}
						if($info[i].authStatus==3){
							thisAuth="authicon-com-ok"
							thisTitle="科袖认证企业"
						}
						var liItem = document.createElement("li");
							liItem.className = "mui-table-view-cell"
							liItem.setAttribute("data-id",$info[i].id)
						var oString = '<div class="flexCenter OflexCenter clearfix">'
						oString += '<div class="madiaHead cmpHead"><div class="boxBlock"><img class="boxBlockimg" src="'+imgL+'" /></div></div>'
						oString += '<div class="madiaInfo OmadiaInfo">'
						oString += '<p class="ellipsisSty"><span class="h1Font">'+thisName+'</span><em class="authiconNew '+thisAuth+'" title="'+thisTitle+'"></em></p>'
						oString += '<p class="ellipsisSty h2Font">'+otherI+'</p>'
						oString += '</div></div>'
						liItem.innerHTML = oString;
						document.getElementById(aimId).appendChild(liItem)
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
                }
                if ($info.length > rows) {
                    objSort[6].loadFlag=true;
                }
                if($info.length == 0){
                	objSort[6].loadFlag=false;
					$(".loadtip").html('没有更多数据了');
					return;
                }
			})
		},
		articalListVal=function(){
			var aimId="articleList"
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
						var hasImg="/images/default-artical.jpg"
						if($info[i].articleImg) {
							hasImg="/data/article/" + $info[i].articleImg
						}
						
						var liItem = document.createElement("li");
						liItem.setAttribute("data-id",$info[i].articleId);
						liItem.className = "mui-table-view-cell"
						var itemlist ='<div class="flexCenter OflexCenter clearfix">';
							itemlist += '<div class="madiaHead artHead" style="background-image:url('+hasImg+')"></div>';
							itemlist += '<div class="madiaInfo OmadiaInfo">';
							itemlist += '<p class="ellipsisSty-2 h1Font">'+$info[i].articleTitle+'</p>';
							itemlist += '<div class="h2Font">'
							itemlist += '<span class="nameSpan ownerName" style="margin-right:10px"></span>'
							itemlist += '<span class="time">'+commenTime($info[i].publishTime)+'</span>'
							itemlist += '</div>'
							itemlist += '</div>';
						liItem.innerHTML = itemlist;
						var $itemlist = $(liItem);
						document.getElementById(aimId).appendChild(liItem)
							
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
                                        mo.find(".ownerName").html(value.name);
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
                if ($info.length > rows) {
                    objSort[3].loadFlag=true;
                }
                if($info.length == 0){
                	objSort[3].loadFlag=false;
					$(".loadtip").html('没有更多数据了');
					return;
                }
			})
		},
		resourceListVal=function(){
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
						
						var liItem = document.createElement("li");
						liItem.setAttribute("data-id",$info[i].resourceId);
						liItem.className = "mui-table-view-cell"
						var itemlist ='<div class="flexCenter OflexCenter clearfix">';
							itemlist += '<div class="madiaHead resouseHead" style="background-image:url('+hasImg+')"></div>';
							itemlist += '<div class="madiaInfo OmadiaInfo">';
							itemlist += '<p class="ellipsisSty-2 h1Font">'+$info[i].resourceName+'</p>';
							itemlist +='<p class="h2Font ellipsisSty"><span class="ownerName"></span><em class="authiconNew ownerSty"></em></p>'
							itemlist += '<p class="h2Font ellipsisSty">用途：' + $info[i].supportedServices + '</p>'
							itemlist += '</div>'
							itemlist += '</div>';
						liItem.innerHTML = itemlist;
						var $itemlist = $(liItem);
						document.getElementById(aimId).appendChild(liItem)
						
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
                if ($info.length > rows) {
                    objSort[2].loadFlag=true;
                }
                if($info.length == 0){
                	objSort[2].loadFlag=false;
					$(".loadtip").html('没有更多数据了');
					return;
                }
			})
		},
		patentListVal = function() {
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
						var liItem = document.createElement("li");
						liItem.setAttribute("data-id",$info[i].id);
						liItem.className = "mui-table-view-cell"
						var oString = '<div class="flexCenter OflexCenter clearfix">'
						oString += '<div class="madiaHead patentHead"></div>'
						oString += '<div class="madiaInfo OmadiaInfo"><p class="ellipsisSty-2 h1Font">' + $info[i].name + '</p>'
						oString += '<p class="ellipsisSty h2Font">' + $info[i].authors.substring(0, $info[i].authors.length - 1) + '</p>'
						oString += '</div></div>'
						liItem.innerHTML = oString;
						document.getElementById(aimId).appendChild(liItem)
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
                }
                if ($info.length > rows) {
                    objSort[4].loadFlag=true;
                }
                if($info.length == 0){
                	objSort[4].loadFlag=false;
					$(".loadtip").html('没有更多数据了');
					return;
                }
			})
		},
		paperListVal = function() {
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
						var liItem = document.createElement("li");
						liItem.setAttribute("data-id",$info[i].id);
						liItem.className = "mui-table-view-cell"
						var oString = '<div class="flexCenter OflexCenter clearfix">'
						oString += '<div class="madiaHead paperHead"></div>'
						oString += '<div class="madiaInfo OmadiaInfo"><p class="ellipsisSty-2 h1Font">' + $info[i].name + '</p>'
						oString += '<p class="ellipsisSty h2Font">' + $info[i].authors.substring(0, $info[i].authors.length - 1) + '</p>'
						oString += '</div></div>'
						liItem.innerHTML = oString;
						document.getElementById(aimId).appendChild(liItem)
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId);
                }
                if ($info.length > rows) {
                    objSort[5].loadFlag=true;
                }
                if($info.length == 0){
                	objSort[5].loadFlag=false;
					$(".loadtip").html('没有更多数据了');
					return;
                }
			})
		},
		serviceListVal = function() {
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
						var liItem = document.createElement("li");
						liItem.setAttribute("data-id",$info[i].id);
						liItem.className = "mui-table-view-cell"
						var itemlist ='<div class="flexCenter OflexCenter clearfix">';
							itemlist += '<div class="madiaHead resouseHead" style="background-image:url('+img+')"></div>';
							itemlist += '<div class="madiaInfo OmadiaInfo">';
							itemlist += '<p class="ellipsisSty-2 h1Font">'+$info[i].name+'</p>';
							itemlist +='<p class="h2Font ellipsisSty"><span class="ownerName"></span><em class="authiconNew ownerSty"></em></p>'
							itemlist += '<p class="h2Font ellipsisSty">' + cnt + '</p>'
							itemlist += '</div>'
							itemlist += '</div>';
						liItem.innerHTML = itemlist;
						var $itemlist = $(liItem);
						document.getElementById(aimId).appendChild(liItem)
						
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
               	if ($info.length > rows) {
                    objSort[7].loadFlag=true;
                }
               	if($info.length == 0){
                	objSort[7].loadFlag=false;
					$(".loadtip").html('没有更多数据了');
					return;
                }
			})
		},
		clearToFun=function(sortN){
			objSort[sortN].loadFlag=true
			$(objSort[sortN].conbox).html("");
			$('.w').css('transform', 'translate3d(0px, 0px, 0px)')
			$('.swiper-container2 .swiper-slide-active').css('height','auto').siblings('.swiper-slide').css('height','0px');
			mySwiper.update();
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

			tabToFun(sortN)
		},
		tabToFun=function(item){
			if(!item){ item=1 }
			var tabLoad=objSort[item].loadFlag
			//console.log(item+"*****"+tabLoad)
			$("#searchval").val(searchTmp)

			if(item==1 && tabLoad){
				expertBox();
				$(".loadtip").html('上拉加载更多');
				mySwiper.update(); 
			}else if(item==2 && tabLoad){
				resourceListVal();
				$(".loadtip").html('上拉加载更多');
				mySwiper.update(); 
			}else if(item==3 && tabLoad){
				articalListVal();
				$(".loadtip").html('上拉加载更多');
				mySwiper.update();
			}else if(item==4 && tabLoad){
				patentListVal();
				$(".loadtip").html('上拉加载更多');
				mySwiper.update();
			}else if(item==5 && tabLoad){
				paperListVal();
				$(".loadtip").html('上拉加载更多');
				mySwiper.update();
			}else if(item==6 && tabLoad){
				companyListVal();
				$(".loadtip").html('上拉加载更多');
				mySwiper.update();
			}else if(item==7 && tabLoad){
				serviceListVal();
				$(".loadtip").html('上拉加载更多');
				mySwiper.update();
			}
			if(!tabLoad){
				$(".loadtip").html('没有更多数据了');
			}
		},
		bindComEvent=function(){
			//============open首次加载================
				if(tagnum){
					tabToFun(tagnum)
					var indexTab=0;
					for(var i in tabOrder){
						if(tabOrder[i]==tagnum){
							indexTab=i
						}
					}
					$('.swiper-slide-tab').eq(indexTab).addClass('active-tab').siblings('.swiper-slide-tab').removeClass('active-tab');
					mySwiperTab.slideTo(indexTab,500, false);
					mySwiper2.slideTo(indexTab, 500, false)
					$("#sele").addClass("displayNone");
					$("#searB").removeClass("searchboxNewT");
				}
			//============open首次加载================
			
			//============open筛选条件================
				document.getElementById("oRes").addEventListener("click", function() {//重置条件筛选
					filterList()
				})
				document.getElementById("com").addEventListener('click', function() {//完成条件筛选
					var arr = [],tagm=0;
					for(var n = 0; n < 3; n++) {
						if(document.getElementsByClassName('spantext')[n].innerHTML == "不限") {
							arr[n] = "";
						} else {
							arr[n] = document.getElementsByClassName('spantext')[n].innerHTML;
							tagm++;
						}
					}
					if(tagm>0){
						document.getElementById("sele").getElementsByTagName("span")[0].innerHTML=tagm;
					}
					
					$(objSort[1].conbox).html("");
					objSort[1].loadFlag=true
					clearToFun(1)
					//expertBox()
					
					$('html').removeClass('mmenu-opening');
					setTimeout(function(){
						$('html').removeClass('mmenu-opened').removeClass('mmenu-right');
						$('#menu').removeClass('mmenu-opened');
		
						$(window).unbind('resize.mmenu');
					},525);
				})
				
				$(".filterUl").on("click", "li", function() {//筛选条件的选择
					this.parentNode.querySelector('li.filterCurrent').classList.remove("filterCurrent");
					this.classList.add("filterCurrent");
					this.parentNode.parentNode.querySelector(".spantext").innerText = this.innerText;
				})
				$(".filterListNew").on("click", ".rightbtn", function() {//筛选条件的展开关闭
					if(this.className == "rightbtn filterActive") {
						this.classList.remove("filterActive");
						this.parentNode.querySelector(".filterUl").classList.remove("filterUlactive");
						this.querySelector("em").classList.remove("unfoldtr");
						this.querySelector("em").classList.add("foldtr");
					} else {
						this.classList.add("filterActive");
						this.parentNode.querySelector(".filterUl").classList.add("filterUlactive");
						this.querySelector("em").classList.remove("foldtr");
						this.querySelector("em").classList.add("unfoldtr");
					}
				})
			//============end筛选条件================

			//============open搜索================
				document.getElementById("searchval").addEventListener("keypress", function() {//搜索enter
					var e = event || window.event;
					if(e.keyCode == 13) {
				 		e.preventDefault();  
						var sC=$.trim($("#searchval").val());
						var item=$('.swiper-slide-tab.active-tab').attr("data-tab")
						tagnum=item
						if(sC){
							keyt =sC
							searchTmp=keyt
							wlog("kw", keyt);
							clearToFun(tagnum)
						}else{
							bombox("请输入关键词");
							return;
						}
				    }
				});
			//============end搜索================	
			
			//============open swiper================
				$('.swiper-slide-tab').unbind("click").on("click",function(){//tabClick
					if($(this).index()==0){
						console.log(1)
						$("#sele").removeClass("displayNone");
						$("#searB").addClass("searchboxNewT");
					}else{
						$("#sele").addClass("displayNone");
						$("#searB").removeClass("searchboxNewT");
					}
					$(this).addClass('active-tab').siblings('.swiper-slide-tab').removeClass('active-tab');
					var tabitem=$(this).attr("data-tab");
					mySwiper2.slideTo($(this).index(), 500, false)  //滚动时间 sideTo
					mySwiperTab.slideTo($(this).index(), 500, false)
					if($(this).index()<3){
						$(".tr").css('transform', 'translate3d(0px, 0px, 0px)')
					}
					tagnum=tabitem
					clearToFun(tagnum)
					
					// $('.w').css('transform', 'translate3d(0px, 0px, 0px)')
					// $('.swiper-container2 .swiper-slide-active').css('height','auto').siblings('.swiper-slide').css('height','0px');
					mySwiper.update();
				});
			//============end swiper================
			
			//============open模块链接跳转================
				$("#proList").on("click", "li", function() {
					var id = this.getAttribute("data-id");
					location.href="http://" + window.location.host + "/e/p.html?id=" + id;
				})
				$("#serviceList").on("click", "li", function() {
					var id = this.getAttribute("data-id");
					location.href="http://" + window.location.host + "/e/s.html?id=" + id;
				})
				$("#resourceList").on("click", "li", function() {
					var id = this.getAttribute("data-id");
					location.href="http://" + window.location.host + "/e/r.html?id=" + id;
				})
				$("#articleList").on("click", "li", function() {
					var id = this.getAttribute("data-id");
					location.href="http://" + window.location.host + "/e/a.html?id=" + id;
				})
				$("#paperList").on("click", "li", function() {
					var id = this.getAttribute("data-id");
					location.href="http://" + window.location.host + "/e/l.html?id=" + id;
				})
				$("#patentList").on("click", "li", function() {
					var id = this.getAttribute("data-id");
					location.href="http://" + window.location.host + "/e/z.html?id=" + id;
				})
				$("#companyList").on("click", "li", function() {
					var id = this.getAttribute("data-id");
					location.href="http://" + window.location.host + "/e/c.html?id=" + id;
				})
			//============end模块链接跳转================

		}
	
	filterList()
	expertBox()
	bindComEvent()
})



