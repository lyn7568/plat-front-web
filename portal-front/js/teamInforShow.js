var userid = $.cookie("userid");
var tId = GetQueryString("id");
//微信分享
var qrcode = new QRCode(document.getElementById("qrcode"), {
	width: 100,
	height: 100
});

function makeCode() {
	var hurl = window.location.href;
	var elurl = hurl;
	qrcode.makeCode(elurl);
}
makeCode();

//分享关注按钮
$('.shareWeixin').hover(function(){$('.shareCode').stop(true,false).fadeToggle();});

$(function() {
	loginStatus();//判断个人是否登录
	// if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
	//  	location.href="http://" + window.location.host + "/e/p.html?id="+tId;
	// }
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

	var pageNo = 1,
		pagePerNo = 1,
		rows = 20,
		rowsTen = 10,
		secretaryId = '',
		chiefId = ''
	var memberArr = {}, paperArr = [], patentArr = [], unpatentArr=[]
	var oAjax = function(url, dataS, otype, oFun,beforeFun,completeFun,async) {
			$.ajax({
				async:async==null?true:async,
				url:url,
				dataType: 'json',
				type: otype,
				data: dataS,
				traditional: true,
				beforeSend: beforeFun,
				success: function(res) {
					oFun(res)
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
       		oAjax("/ajax/team/qo", {
				   id: tId
			   }, "get", function(data){
				var $info = data.data;
				$("#proName").text($info.name);
				if($info.city){
					$("#proAddress").html($info.city + "<span style='margin-right:10px;'></span>");
				}
				$("#proOther").text($info.orgName);
				document.title = $info.name + "-科袖网"
				
				//简介
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
				//行业领域	
				if($info.industry) {
					$("#industryShow").parents(".coninfobox").removeClass("displayNone");
					$("#item1user>.nodatabox").addClass("displayNone");
					industryShow($info.industry);
				}
				
				var weibotitle = $info.name;
				var weibourl = window.location.href;
				var weibopic ="";
				$("#weibo").attr("href","http://service.weibo.com/share/share.php?appkey=3677230589&title="+weibotitle+"&url="+weibourl+"&pic="+weibopic+"&ralateUid=6242830109&searchPic=false&style=simple");
			});
		},
		professorListVal=function(isbind){
			var aimId="expertli"
			oAjax("/ajax/team/pro",{
				id:tId,
				pageSize:rowsTen,
				pageNo: pageNo,
			}, "get", function(res){
				var $info = res.data.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					for(var i = 0; i < $info.length; i++) {
						var item = $info[i].professor;
						memberArr[item]={};
						if ($info[i].secretary) {
							secretaryId = $info[i].professor
						}
						if ($info[i].chief) {
							chiefId = $info[i].professor
						}
					}
					if (userid in memberArr) {
						$('.memberShow').show()
					} else{
						$('.normalShow').show()
					}
					detailPro(aimId)
				}
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
						pageNo++
						professorListVal(false)
					})
                }
				if ($info.length < rowsTen) {
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
			var aimId="proPatent",newStr="尚未关联任何专利成果"
			oAjax("/ajax/team/patent",{
				id:tId,
				pageSize:rows,
				pageNo: pageNo,
			}, "get", function(res){
				var $info = res.data.data;
				$("#showPatent").html("")
				if($info.length > 0) {
					if(res.data.total>0 && res.data.total<99){
						$("#patCount").text(res.data.total);
					}
					if(res.data.total>99){
						$("#patCount").text("99+");
					}
					$("#"+aimId).show()
					for(var i = 0; i < $info.length; i++) {
						patentArr.push($info[i].patent)
					}
					detailPat(aimId)
				} else {
					$("#showPatent").parents('.otherShow').hide()
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
		unpatentListVal=function(isbind){
			var aimId="proUnPatent",aimIdF="showUnPatent",newStr="尚未关联任何非专利成果"
			oAjax("/ajax/team/resResult",{
				id:tId,
				pageSize:rows,
				pageNo: pageNo,
			}, "get", function(res){
				var $info = res.data.data;
				$("#showUnPatent").html("")
				if($info.length > 0) {
					if(res.data.total>0 && res.data.total<99){
						$("#unpatCount").text(res.data.total);
					}
					if(res.data.total>99){
						$("#unpatCount").text("99+");
					}
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					$("#"+aimIdF).parents(".form-item").removeClass("displayNone");
					$("#"+aimIdF).parents(".coninfobox").show();
					for(var i = 0; i < $info.length; i++) {
						unpatentArr.push($info[i].researchResult)
					}
					detailUnPat(aimId)
				}else {
					$("#showUnPatent").parents('.otherShow').hide()
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
		paperListVal=function(isbind){
			var aimId="proPaper",newStr="尚未关联任何论文"
			oAjax("/ajax/team/paper",{
				id:tId,
				pageSize:rows,
				pageNo: pageNo,
			}, "get", function(res){
				var $info = res.data.data;
				$("#showPaper").html("")
				if($info.length > 0) {
					if(res.data.total>0 && res.data.total<99){
						$("#parCount").text(res.data.total);
					}
					if(res.data.total>99){
						$("#parCount").text("99+");
					}
					$("#"+aimId).show()
					for(var i = 0; i < $info.length; i++) {
						paperArr.push($info[i].paper)
					}
					detailPer(aimId)
				}else {
					$("#showPaper").parents(".otherShow").hide()
				}
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
						pageNo++
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
		detailPat=function(obj) {
			oAjax("/ajax/ppatent/qm",{
				id:patentArr,
			},"get",function(data){
				var dataStr=data.data;
				for(var i = 0; i < dataStr.length; i++) {
					
					var strAdd = '';
						strAdd += '<li class="mui-table-view-cell"><a  target="_blank" href="/'+ pageUrl("pt",dataStr[i]) +'" class="flexCenter urlgo">';
						strAdd += '<div class="madiaHead patentHead"></div>';
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr[i].name +'</p>';
						strAdd += '<p class="h2Font ellipsisSty">发明人：'+ dataStr[i].authors.substring(0, dataStr[i].authors.length - 1) +'</p>';
						strAdd += '<p class="h2Font ellipsisSty">申请人：'+ dataStr[i].reqPerson +'</p>';
						strAdd += '</div>';
						strAdd += '</a></li>';
						$("#"+obj).append(strAdd)
						if (i < 3) {
							$("#showPatent").append(strAdd);
						}
				}
			});
		},
		detailUnPat=function(obj) {
			oAjax("/ajax/resResult/qm",{
				id:unpatentArr,
			},"get",function(data){
				var dataStr=data.data;
				for(var i = 0; i < dataStr.length; i++) {
					
					var resIM='<div class="madiaHead patentHead"></div>'
					if (dataStr[i].pic) {
						var src = '/data/researchResult' + dataStr[i].pic.split(",")[0]
						resIM = '<div class="madiaHead patentHead" style="background-image:url('+ src +')"></div>';
					}
					var strAdd = '';
						strAdd += '<li class="mui-table-view-cell"><a  target="_blank" href="unPatentShow.html?id='+dataStr[i].id+'" class="flexCenter urlgo">';
						strAdd += resIM
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr[i].name +'</p>';
						strAdd += '<p class="h2Font ellipsisSty displayNone">研究者：<span class="researchers"></span></p>';
						if (dataStr[i].orgId) {
							strAdd += '<p class="h2Font ellipsisSty">所属机构：<span class="resOrgName"></span></p>';
						}
						strAdd += '</div>';
						strAdd += '</a></li>';
			
						$("#"+obj).append(strAdd);
						if (i < 3) {
							$("#showUnPatent").append(strAdd)
						}
					var $itemlist = $(strAdd);
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
				}, function(){},false)
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
		detailPer=function(obj) {
			oAjax("/ajax/ppaper/qm",{
				id:paperArr,
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
					
					
					var strAdd = '';
						strAdd += '<li class="mui-table-view-cell"><a  target="_blank" href="/'+ pageUrl("pp",dataStr[i]) +'" class="flexCenter urlgo">';
						strAdd += '<div class="madiaHead paperHead"></div>';
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr[i].name +'</p>';
						strAdd += '<p class="h2Font ellipsisSty">作者：'+ dataStr[i].authors.substring(0, dataStr[i].authors.length - 1) +'</p>';
						strAdd += '<p class="h2Font ellipsisSty">期刊：'+ moreInf +'</p>';
						strAdd += '</div>';
						strAdd += '</a></li>';
						if(i < 3) {
							$('#showPaper').append(strAdd)
						}
						$('#'+obj).append(strAdd)
				}
			});
		},
		detailPro=function(obj) {
			document.getElementById(obj).innerHTML=""
			var li;
			for(item in memberArr){
				oAjax("/ajax/professor/info/"+item, null, "get", function(data){memberArr[item]=data.data},function(){},function(){},false)
			}
			for(item in memberArr) {
				if (item!={}){
				
					var dataStr = memberArr[item]
					var dImg = "../images/default-photo.jpg"
					if (dataStr.hasHeadImage){
						dImg = "/images/head/" + dataStr.id + "_l.jpg"
					}
					var li = document.createElement("li");
						li.className = "mui-table-view-cell";
					var li2 = ''
					if(secretaryId===dataStr.id){
						li2 += '<span>团队秘书</span>'
					}
					if(chiefId===dataStr.id) {
						li2 += '<span>首席专家</span>'
					}
					var strAdd = '';
						strAdd += '<li class="mui-table-view-cell"><a target="_blank" href="userInforShow.html?professorId='+ dataStr.id +'" class="flexCenter urlgo" style="min-height: 60px">';
						strAdd += '<div class="madiaHead useHead" style="background-image:url(' + dImg + ')"></div>';
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr.name +'</p>';
						strAdd += '<p class="h2Font ellipsisSty">'+ dataStr.title|| dataStr.orgName ||'' +'</p>';
						strAdd += '</div>';
						strAdd += '<div class="tag-show">'+li2+'</div>'
						strAdd += '</a></li>';
						if(chiefId===dataStr.id) {
					
							$("#"+obj).prepend(strAdd)
						} else {
							$("#"+obj).append(strAdd)
						}
				}
			}
	    },
		bindClickFun=function(){
			$("#tab6user").unbind("click").on("click",function(){
				var pa=$(".moreNavUl.wendaUl>li.liNow").attr("rel")
				$("#"+pa).find("ul").html("")
				$("#"+pa).find(".js-load-more").show();
				
				$(".wendaNav li").eq(0).addClass("liNow").siblings().removeClass("liNow");
				$("#item6drop1").show().siblings().hide();
				unpatentListVal(true);
			})
			$(".moreNavUl.wendaUl").on("click","li",function(){
				var pa=$(this).attr("rel")
				$("#"+pa).find("ul").html("")
				$("#"+pa).find(".js-load-more").show();
				var sortN=$(this).attr("data-num");
				if(sortN==1){
					unpatentListVal(true);
				}else if(sortN==2){
					patentListVal(true);
				}
			})
			
			//点击关注按钮
			$("#attentBtn").on('click', function() {
				if(userid && userid != null && userid != "null") {
					if($(this).is('.attenedSpan')){
						cancelCollectionAbout(tId,$(this),13)
					} else {
						collectionAbout(tId,$(this), 13);
					}
				}else{
					quickLog();
					operatTab();
					closeLog();
				}
			});	
			//点击联系按钮
			$("#conbtn").on('click', function(){
				if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {
					location.href="tidings.html?id="+secretaryId
				} else {
					quickLog();
					operatTab();
					closeLog();
				}
			});

			//退出团队
			$("#quitTeam").on('click', function(){
				if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {
					$.MsgBox.Confirm("提示", "确定要退出该团队？", function(){
						oAjax("/ajax/team/quit", {
							id: tId,
							professor: userid
						}, "post", function(data){
							if (data.code===801) {
								$.MsgBox.Alert('提示', '团队秘书不能退出团队');
								return
							}
							location.reload()
						})
					});
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
					oAjax("/ajax/feedback/error/team",{
						"id": tId,
						"cnt":cntCon,
						"user":cntUser
					}, "POST", function(data){
						backSuccessed();
					});
				}
			})
	
		}
		$('#seeMoreF,#seeMoreZ').unbind("click").on("click",function(){
			$(".leftconItem").hide();
			var activeTab = $('#item6user').attr("rel");
			$("#item6user").show()
			$("ul.mainNavUl li").removeClass("liNow");
			$('#tab6user').addClass("liNow");
			$(".moreNav").hide();
			
			var pa=$(".moreNavUl.wendaUl>li.liNow").attr("rel")
			$("#"+pa).find("ul").html("")
			$("#"+pa).find(".js-load-more").show();
			
			$(".wendaNav li").eq(0).addClass("liNow").siblings().removeClass("liNow");
			$("#item6drop1").show()
			$("#item6more").show()
			unpatentListVal(true);
		})
		$('#seeMoreL').unbind("click").on("click",function(){
			$(".leftconItem").hide();
			var activeTab = $('#item5user').attr("rel");
			$("#item5user").show()
			$("ul.mainNavUl li").removeClass("liNow");
			$('#tab5user').addClass("liNow");
			$(".moreNav").hide();
		})
	ifcollectionAbout(tId,$(".goSpan").find(".attenSpan"), 13)
	getUserInfo(); //获取详细信息
	professorListVal(true);
	patentListVal(true);
	paperListVal(true);
	unpatentListVal(true);
	bindClickFun();	
})

