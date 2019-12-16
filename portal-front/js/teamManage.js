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
		professorListVal=function(isbind, ff){
			var aimId="expertli",aimIdF="teamMembers",newStr=""
			oAjax("/ajax/team/pro",{
				id:tId,
				pageSize: rowsTen,
				pageNo: pageNo,
			}, "get", function(res){
				var $info = res.data.data;
				if($info.length > 0) {
					$("#"+aimId).parent().find(".js-load-more").show();
					$("#"+aimIdF).parent().find(".js-load-more").show();
					if (res.data.pageNo !== pageNo) {
						if (ff) {
							$("#"+aimIdF).parent().find(".js-load-more").unbind("click");
							$("#"+aimIdF).parent().find(".js-load-more").hide();
						} else {
							$("#"+aimId).parent().find(".js-load-more").unbind("click");
							$("#"+aimId).parent().find(".js-load-more").hide();
							$("#"+aimIdF).parent().find(".js-load-more").unbind("click");
							$("#"+aimIdF).parent().find(".js-load-more").hide();
						}
						return
					}
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
					console.log($info[i])
					if (ff) {
						detailPro(aimIdF, 1)	
					} else {
						detailPro(aimId)
						detailPro(aimIdF, 1)
					}
				}
                if(isbind){
					if (ff) {
						$("#"+aimIdF).parent().find(".js-load-more").unbind("click").on("click",function(){
							pageNo++
							professorListVal(false)
						})
					} else{
						$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
							pageNo++
							professorListVal(false)
						})
						$("#"+aimIdF).parent().find(".js-load-more").unbind("click").on("click",function(){
							pageNo++
							professorListVal(false)
						})
					}
                }
				if ($info.length < rowsTen) {
					if (ff) {
						$("#"+aimIdF).parent().find(".js-load-more").unbind("click");
						$("#"+aimIdF).parent().find(".js-load-more").hide();
					} else {
						$("#"+aimId).parent().find(".js-load-more").unbind("click");
						$("#"+aimId).parent().find(".js-load-more").hide();
						$("#"+aimIdF).parent().find(".js-load-more").unbind("click");
						$("#"+aimIdF).parent().find(".js-load-more").hide();
					}
                }
			},function(){
				if (ff) {
					$("#"+aimIdF).parent().find(".js-load-more").attr("disabled",true);
					$("#"+aimIdF).parent().find(".js-load-more").addClass("active");
				}else{
					$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
					$("#"+aimId).parent().find(".js-load-more").addClass("active");
					$("#"+aimIdF).parent().find(".js-load-more").attr("disabled",true);
					$("#"+aimIdF).parent().find(".js-load-more").addClass("active");
				}
			},function(){
				if (ff) {
					$("#"+aimIdF).parent().find(".js-load-more").removeAttr("disabled");
					$("#"+aimIdF).parent().find(".js-load-more").removeClass("active");
				} else {
					$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
					$("#"+aimId).parent().find(".js-load-more").removeClass("active");
					$("#"+aimIdF).parent().find(".js-load-more").removeAttr("disabled");
					$("#"+aimIdF).parent().find(".js-load-more").removeClass("active");
				}
			})
		},
		searchProfessor=function(){
			var keyt = $('#searchMe').val()
			if(keyt===''){
				return
			}
			var aimId="searchMembers"
			oAjax("/ajax/team/pro/search",{
				"team": tId,
				"key":keyt,
				"authType":1,
				"rows": 10
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					removeNodata(aimId);
					$("#"+aimId).html('')
					$("#"+aimId).show()
					for(var i = 0; i < $info.length; i++) {
						var li4 = ''
						if ($info[i].id in memberArr) {
							li4 = '<li class="added">已添加</li>'
						}else{
							li4 = '<li class="addThis" data-id="'+$info[i].id+'" data-flag="1">添加</li>'	
						}
						var ownerSty="",ownerSt="",hasImg="../images/default-photo.jpg"
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
						var itemlist = '<li class="flexCenter">';
							itemlist += '<a target="_blank" href="userInforShow.html?professorId=' + $info[i].id +'">'
							itemlist += '<div class="madiaHead userHead" style="border-radius:50%;background-image:url('+hasImg+')"></div>';
							itemlist += '<div class="madiaInfo">';
							itemlist += '<p class="h1Font ellipsisSty">';
							itemlist += '<span class="nameSpan">'+$info[i].name+'</span>';
							itemlist += '<em class="authiconNew '+ownerSty+'" title="'+ownerSt+'"></em></p>';
							itemlist += '<p class="h2Font ellipsisSty">'+ttitle+orgName+'</p>';
							itemlist += '</div></a>';
							itemlist += '<ul class="madiaEdit">'
							itemlist += li4
							itemlist += '</ul>'
							itemlist += '</li>';
						
						$("#"+aimId).append(itemlist)
					}
				} else {
					$("#"+aimId).hide()
                    insertNodata(aimId);
				}
			})
		},
		unpatentListVal=function(isbind){
			var aimId="proUnPatent",newStr="尚未关联任何非专利成果"
			oAjax("/ajax/team/resResult",{
				id:tId,
				pageSize:rows,
				pageNo: pagePerNo,
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
						pagePerNo++
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
		searchUnPatent=function(){
			var keyt = $('#searchUnPatentKey').val()
			if(keyt===''){
				return
			}
			var aimId="searchUnPatent"
			oAjax("/ajax/team/resResult/search",{
				"team": tId,
				"key": keyt,
				"status": ['1'],
				"pageSize": 10,
				"pageNo": 1
			}, "get", function(res){
				var $info = res.data.data;
				if($info.length > 0) {
					removeNodata(aimId);
					$("#"+aimId).html('')
					$("#"+aimId).show()
					for(var i = 0; i < $info.length; i++) {
						var li4 = ''
						if (unpatentArr.indexOf($info[i].id)>-1) {
							li4 = '<li class="added">已添加</li>'
						}else{
							li4 = '<li class="addThis" data-id="'+$info[i].id+'" data-flag="1" style="cursor:pointer;">添加</li>'	
						}
						var resIM='<div class="madiaHead patentHead"></div>'
						if ($info[i].pic) {
							var src = '/data/researchResult' + $info[i].pic.split(",")[0]
							resIM = '<div class="madiaHead patentHead" style="background-image:url('+ src +')"></div>';
						}
						var itemlist = '<li style="position:relative;">';
							itemlist += '<a target="_blank" href="unPatentShow.html?id='+$info[i].id+'" class="flexCenter urlgo">';
							itemlist += resIM
							itemlist += '<div class="madiaInfo">';
							itemlist += '<p class="h1Font ellipsisSty">'+ $info[i].name +'</p>';
							itemlist += '<p class="h2Font ellipsisSty displayNone">研究者：<span class="researchers"></span></p>';
							itemlist += '<p class="h2Font ellipsisSty displayNone">所属机构：<span class="resOrgName"></span></p>';
							itemlist += '</div></a>';
							itemlist += '<ul class="madiaEdit">'
							itemlist += li4
							itemlist += '</ul>'
							itemlist += '</li>';
							var $itemlist = $(itemlist);
							$("#"+aimId).append($itemlist)
							queryResearcher($info[i].id, $itemlist)
							if ($info[i].orgId) {
								queryReseOrgName($info[i].orgId, $itemlist)
							}
					}
				} else {
					$("#"+aimId).hide()
                    insertNodata(aimId);
				}
			})
		},
		patentListVal=function(isbind){
			var aimId="proPatent",newStr="尚未关联任何专利成果"
			oAjax("/ajax/team/patent",{
				id:tId,
				pageSize:rows,
				pageNo: pagePerNo,
			}, "get", function(res){
				$("#showPatent").html("")
				var $info = res.data.data;
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
						pagePerNo++
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
		searchPatent=function(){
			var keyt = $('#searchPatentKey').val()
			if(keyt===''){
				return
			}
			var aimId="searchPatent"
			oAjax("/ajax/team/patent/search",{
				"team": tId,
				"key":keyt,
				"rows": 10
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					removeNodata(aimId);
					$("#"+aimId).html('')
					$("#"+aimId).show()
					for(var i = 0; i < $info.length; i++) {
						var li4 = ''
						if (patentArr.indexOf($info[i].id)>-1) {
							li4 = '<li class="added">已添加</li>'
						}else{
							li4 = '<li class="addThis" data-id="'+$info[i].id+'" data-flag="1" style="cursor:pointer;">添加</li>'	
						}
						var itemlist = '<li style="position:relative;">';
							itemlist += '<a target="_blank" href="/' + pageUrl("pt",$info[i]) +'" class="flexCenter urlgo"><div class="madiaHead patentHead"></div>';
							itemlist += '<div class="madiaInfo">';
							itemlist += '<p class="h1Font ellipsisSty">'+ $info[i].name +'</p>';
							itemlist += '<p class="h2Font ellipsisSty">发明人：'+ $info[i].authors.substring(0, $info[i].authors.length - 1) +'</p>';
							itemlist += '<p class="h2Font ellipsisSty">申请人：'+ $info[i].reqPerson +'</p>';
							itemlist += '</div></a>';
							itemlist += '<ul class="madiaEdit">'
							itemlist += li4
							itemlist += '</ul>'
							itemlist += '</li>';
						$("#"+aimId).append(itemlist)
					}
				} else {
					$("#"+aimId).hide()
                    insertNodata(aimId);
				}
			})
		},
		paperListVal=function(isbind){
			var aimId="proPaper",newStr="尚未关联任何论文"
			oAjax("/ajax/team/paper",{
				id:tId,
				pageSize: rows,
				pageNo: pagePerNo
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
					if (res.data.pageNo !== pagePerNo) {
						$("#"+aimId).parent().find(".js-load-more").unbind("click");
						$("#"+aimId).parent().find(".js-load-more").hide();
						return
					}
					$("#"+aimId).show()
					for(var i = 0; i < $info.length; i++) {
						paperArr.push($info[i].paper)
					}
					detailPer(aimId)
				} else {
					$("#showPaper").parents(".otherShow").hide()
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
						pagePerNo++
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
		searchPaper=function(){
			var keyt = $('#searchPaperKey').val()
			if(keyt===''){
				return
			}
			var aimId="searchPaper"
			oAjax("/ajax/team/paper/search",{
				"team": tId,
				"key":keyt,
				"rows": 10
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					removeNodata(aimId);
					$("#"+aimId).html('')
					$("#"+aimId).show()
					for(var i = 0; i < $info.length; i++) {
						var li4 = ''
						if (paperArr.indexOf($info[i].id)>-1) {
							li4 = '<li class="added">已添加</li>'
						}else{
							li4 = '<li class="addThis" data-id="'+$info[i].id+'" data-flag="1" style="cursor:pointer;">添加</li>'	
						}
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
						
						var itemlist = '<li style="position: relative;">';
						itemlist += '<a target="_blank" href="/' + pageUrl("pp",$info[i]) +'" class="flexCenter urlgo"><div class="madiaHead paperHead"></div>';
						itemlist += '<div class="madiaInfo">';
						itemlist += '<p class="h1Font ellipsisSty">'+ $info[i].name +'</p>';
						itemlist += '<p class="h2Font ellipsisSty">作者：'+ $info[i].authors.substring(0, $info[i].authors.length - 1) +'</p>';
						itemlist += '<p class="h2Font ellipsisSty">期刊：'+ moreInf +'</p>';
						itemlist += '</div></a>';
						itemlist += '<ul class="madiaEdit">'
						itemlist += li4
						itemlist += '</ul>'
						itemlist += '</li>';
						$("#"+aimId).append(itemlist)
					}
				} else {
					$("#"+aimId).hide()
                    insertNodata(aimId);
				}
			})
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
						strAdd += '<p class="h2Font ellipsisSty displayNone">所属机构：<span class="resOrgName"></span></p>';
						strAdd += '</div>';
						strAdd += '</a>'
						strAdd += '<ul class="madiaEdit">'
						strAdd += '<li class="deloutPro" data-id="'+dataStr[i].id+'">取消关联</li>'
						strAdd += '</ul></li>'
				
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
			},function(){},false);
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
						$list.find(".resOrgName").parent().removeClass('displayNone')
						if(value.forShort){
							$list.find(".resOrgName").html(value.forShort)
						}else{
							$list.find(".resOrgName").html(value.name)
						}
					}
				})
			}
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
						strAdd += '</a>';
						strAdd += '<ul class="madiaEdit">'
						strAdd += '<li class="deloutPro" data-id="'+dataStr[i].id+'">取消关联</li>'
						strAdd += '</ul></li>'
					$("#"+obj).append(strAdd)
					if (i < 3) {
						$("#showPatent").append(strAdd);
					}
				}
			});
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
						strAdd += '<li class="mui-table-view-cell"><a target="_blank" href="/'+ pageUrl("pp",dataStr[i]) +'" class="flexCenter urlgo">';
						strAdd += '<div class="madiaHead paperHead"></div>';
						strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr[i].name +'</p>';
						strAdd += '<p class="h2Font ellipsisSty">作者：'+ dataStr[i].authors.substring(0, dataStr[i].authors.length - 1) +'</p>';
						strAdd += '<p class="h2Font ellipsisSty">期刊：'+ moreInf +'</p>';
						strAdd += '</div>';
						strAdd += '</a>';
						strAdd += '<ul class="madiaEdit">'
						strAdd += '<li class="deloutPro" data-id="'+dataStr[i].id+'">取消关联</li>'
						strAdd += '</ul></li>'
					if(i < 3) {
						$('#showPaper').append(strAdd)
					}
					$('#'+obj).append(strAdd)
				}
			});
		},
		detailPro=function(obj, flag) {
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
					var li2 = '',li4=""
					var tatu;
					if (flag === 1) {
						if(chiefId===dataStr.id) {
							li4 += '<li class="authTeamSta cancelTeamSta" style="cursor:pointer">首席专家</li>'
						}else{
							li4 +='<li class="setFirstPro" data-id="'+dataStr.id+'">设为首席专家</li>'
						}
						if(secretaryId===dataStr.id){
							li4 += '<li class="authTeamSta">团队秘书</li>'
						}else{
							li4 +='<li class="setAdmin" data-id="'+dataStr.id+'">设为团队秘书</li>'
							li4 += '<li class="deloutPro" data-id="'+dataStr.id+'">移出团队</li>'
						}
					}else{
						if(secretaryId===dataStr.id){
							li2 += '<span>团队秘书</span>'
						}
						if(chiefId===dataStr.id) {
							li2 += '<span>首席专家</span>'
						}
					}
					var title = dataStr.title || "";
					var orgName = dataStr.orgName || "";
					var office = dataStr.office || "";
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
					var strAdd = '';
					strAdd += '<li class="mui-table-view-cell"><a target="_blank" href="userInforShow.html?professorId='+ dataStr.id +'" class="flexCenter urlgo" style="min-height: 60px">';
					strAdd += '<div class="madiaHead useHead" style="background-image:url(' + dImg + ')"></div>';
					strAdd += '<div class="madiaInfo"><p class="h1Font ellipsisSty">'+ dataStr.name +'</p>';
					strAdd += '<p class="h2Font ellipsisSty">'+ttitle+orgName +'</p>';
					strAdd += '</div>';
					strAdd += '<div class="tag-show">'+li2+'</div>'
					strAdd += '</a>';
					strAdd += '<ul class="madiaEdit">'
					strAdd += li4
					strAdd += '</ul></li>'
					console.log(chiefId)
					if(chiefId===dataStr.id) {
					
						$("#"+obj).prepend(strAdd)
					} else {
						$("#"+obj).append(strAdd)
					}
					
					
				}
			}
	    },
		bindClickFun=function(){
			//==== members model =====//
			$("#manageMembers").on("click", function(){
				$(".questionCover").fadeIn();
				$("body").css("position", "fixed");
			})
			$("#workclose,#btnCancel").on("click",function(){
				$(".questionCover").fadeOut();
				$("body").css("position", "");
				$('#teamMembers').html('')
				$('#expertli').html('')
				memberArr={}
				pageNo = 1
				professorListVal(true)
			})
			$('.queStep').on('click', '.steptit>a', function(){
				$('.queStep .steptit>a').removeClass('active')
				$(this).addClass('active')
				var st = $(this).attr("data-index")
				$('.queStep .quemain .artAbout').addClass('displayNone')
				$('.queStep .quemain .artAbout').eq(st).removeClass('displayNone')
				if (st === '0') {
					memberArr={}
					$('#teamMembers').html('')
					pageNo = 1
					professorListVal(true, true)
				} else if(st === '1'){
					$('#searchMembers').html('')
					$('#searchMe').val('')
					searchProfessor()
				}
			})
			$('.queStep').on('click', '.searchSpan', function(){
				searchProfessor()
			})
			$('.queStep').on('click', '.addThis',function(e) {
				var _this = this
				var fl = $(this).attr("data-flag")
				if (fl === '1') {
					var pid = $(this).attr("data-id")
					oAjax("/ajax/team/insertPro", {
						id: tId,
						professor: pid
					}, "post", function(data){
						$(_this).addClass("added").text("已添加")
						$(_this).attr("data-flag", '0')
					})
				}
				e.stopPropagation()
			})
			$('.queStep').on('click', '.setAdmin',function() {
				var pid = $(this).attr("data-id")
				$.MsgBox.Confirm("提示", "此操作会退出登录，您将是去对该团队的管理权，确认设置团队秘书？", function(){
					oAjax("/ajax/team/secretary", {
						id: tId,
						professor: pid
					}, "post", function(data){
						if (data.success){
							exit()
							location.href = "index.html"
						}
					})
				});
			})
			$('.queStep').on('click', '.setFirstPro',function() {
				var pid = $(this).attr("data-id")
				$.MsgBox.Confirm("提示", "此操作会取消原有首席专家，确认设置首席专家？", function(){
					oAjax("/ajax/team/chief", {
						id: tId,
						newPro: pid
					}, "post", function(data){
						if (data.success) {
							memberArr={}
							$('#teamMembers').html('')
							pageNo = 1
							secretaryId=''
							chiefId=''
							professorListVal(true, true)
						}
					})
				});
			})
			$('.queStep').on('mouseenter', ".cancelTeamSta", function(e) {
				$(this).removeClass('authTeamSta').text('取消首席身份')
			})
			$('.queStep').on('mouseleave', ".cancelTeamSta", function(e) {
				$(this).addClass('authTeamSta').text('首席专家')
			})
			$('.queStep').on('click', '.cancelTeamSta',function() {
				$.MsgBox.Confirm("提示", "确认取消首席专家？", function(){
					oAjax("/ajax/team/chief", {
						id: tId,
						newPro: ''
					}, "post", function(data){
						if (data.success) {
							memberArr={}
							$('#teamMembers').html('')
							pageNo = 1
							secretaryId=''
							chiefId=''
							professorListVal(true, true)
						}
					})
				});
			})
			$('.queStep').on('click', '.deloutPro',function() {
				var pid = $(this).attr("data-id")
				$.MsgBox.Confirm("提示", "确定将该成员移出团队？", function(){
					oAjax("/ajax/team/deletePro", {
						id: tId,
						professor: pid
					}, "post", function(data){
						if(data.success){
							memberArr={}
							$('#teamMembers').html('')
							pageNo = 1
							secretaryId=''
							chiefId=''
							professorListVal(true, true)
						}
					})
				});
			})
			//==== members model =====//

			$("#updateTeam").on('click', function() {
				location.href="updateTeam.html?id=" + tId
			});
			$("#delTeam").on('click', function() {
				$.MsgBox.Confirm("提示", "确定删除该团队？", function(){
					oAjax("/ajax/team/delete", {
						id: tId
					}, "post", function(data){
						if(data.success){
							location.href="teamList.html"
						}
					})
				});
			});

			//==== paper =====//
			$('#item5user').on('click', '.steptit>a', function(){
				console.log(124)
				$('#item5user .steptit>a').removeClass('active')
				$(this).addClass('active')
				var st = $(this).attr("data-index")
				$('#item5user>.otherShow>.aboutRes').addClass('displayNone')
				$('#item5user>.otherShow>.aboutRes').eq(st).removeClass('displayNone')
				if (st === '0') {
					paperArr=[]
					$('#proPaper').html('')
					pagePerNo = 1
					paperListVal(true)
				} else if(st === '1'){
					$('#searchPaper').html('')
					$('#searchPaperKey').val('')
					searchPaper()
				}
			})
			$('#item5user').on('click', '.searchSpan', function(){
				searchPaper()
			})
			$('#item5user').on('click', 'li.addThis',function() {
				var _this = this
				var fl = $(this).attr("data-flag")
				if (fl === '1') {
					var pid = $(this).attr("data-id")
					oAjax("/ajax/team/insertPaper", {
						id: tId,
						paper: pid
					}, "post", function(data){
						$(_this).addClass("added").text("已添加")
						$(_this).attr("data-flag", '0')
					})
				}
			})
			$('#item5user,#showPaper').on('click', '.deloutPro',function() {
				var pid = $(this).attr("data-id")
				$.MsgBox.Confirm("提示", "确定取消关联该论文？", function(){
					oAjax("/ajax/team/deletePaper", {
						id: tId,
						paper: pid
					}, "post", function(data){
						if(data.success){
							paperArr=[]
							$('#proPaper').html('')
							pagePerNo = 1
							paperListVal(true)
						}
					})
				});
			})
			//==== paper =====//

			//==== patent =====//
			$('#item6drop2').on('click', '.steptit>a', function(){
				$('#item6drop2 .steptit>a').removeClass('active')
				$(this).addClass('active')
				var st = $(this).attr("data-index")
				$('#item6drop2 .aboutRes').addClass('displayNone')
				$('#item6drop2 .aboutRes').eq(st).removeClass('displayNone')
				if (st === '0') {
					patentArr=[]
					$('#proPatent').html('')
					pagePerNo = 1
					patentListVal(true)
				} else if(st === '1'){
					$('#searchPatent').html('')
					$('#searchPatentKey').val('')
					searchPatent()
				}
			})
			$('#item6drop2').on('click', '.searchSpan', function(){
				searchPatent()
			})
			$('#item6drop2').on('click', 'li.addThis',function() {
				var _this = this
				var fl = $(this).attr("data-flag")
				if (fl === '1') {
					var pid = $(this).attr("data-id")
					oAjax("/ajax/team/insertPatent", {
						id: tId,
						patent: pid
					}, "post", function(data){
						$(_this).addClass("added").text("已添加")
						$(_this).attr("data-flag", '0')
					})
				}
			})
			$('#item6drop2,#showPatent').on('click', '.deloutPro',function() {
				var pid = $(this).attr("data-id")
				$.MsgBox.Confirm("提示", "确定取消关联该专利成果？", function(){
					oAjax("/ajax/team/deletePatent", {
						id: tId,
						patent: pid
					}, "post", function(data){
						if(data.success){
							patentArr=[]
							$('#proPatent').html('')
							pagePerNo = 1
							patentListVal(true)
						}
					})
				});
			})
			//==== patent =====//

			//==== unpatent =====//
			$('#item6drop1').on('click', '.steptit>a', function(){
				$('#item6drop1 .steptit>a').removeClass('active')
				$(this).addClass('active')
				var st = $(this).attr("data-index")
				$('#item6drop1 .aboutRes').addClass('displayNone')
				$('#item6drop1 .aboutRes').eq(st).removeClass('displayNone')
				if (st === '0') {
					unpatentArr=[]
					$('#proUnPatent').html('')
					pagePerNo = 1
					unpatentListVal(true)
				} else if(st === '1'){
					$('#searchUnPatent').html('')
					$('#searchUnPatentKey').val('')
					searchUnPatent()
				}
			})
			$('#item6drop1').on('click', '.searchSpan', function(){
				searchUnPatent()
			})
			$('#item6drop1').on('click', 'li.addThis',function() {
				var _this = this
				var fl = $(this).attr("data-flag")
				if (fl === '1') {
					var pid = $(this).attr("data-id")
					oAjax("/ajax/team/insertResResult", {
						id: tId,
						researchResult: pid
					}, "post", function(data){
						$(_this).addClass("added").text("已添加")
						$(_this).attr("data-flag", '0')
					})
				}
			})
			$('#item6drop1,#showUnPatent').on('click', '.deloutPro',function() {
				var pid = $(this).attr("data-id")
				$.MsgBox.Confirm("提示", "确定取消关联该非专利成果？", function(){
					oAjax("/ajax/team/deleteResResult", {
						id: tId,
						researchResult: pid
					}, "post", function(data){
						if(data.success){
							unpatentArr=[]
							$('#proUnPatent').html('')
							pagePerNo = 1
							unpatentListVal(true)
						}
					})
				});
			})
			//==== unpatent =====//
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
			
		}

	getUserInfo();
	professorListVal(true);
	unpatentListVal(true);
	patentListVal(true);
	paperListVal(true);
	bindClickFun();	
})

