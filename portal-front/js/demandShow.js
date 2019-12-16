$(document).ready(function() {
	loginStatus(); //判断个人是否登录
	var userid=$.cookie("userid");
	var demandId = GetQueryString("demandId");
	var consuId, demandTitle, demandContent;
	getDemandinfo();
	pageViewLog(demandId,7)
	ifcollectionAbout(demandId,$("#collectBtn"), 7)
	$("#collectBtn").on("click",function() {
		if(userid && userid != "null" && userid != null) {
			if($(this).is('.icon-collected')) {
				cancelCollectionAbout(demandId,$(this), 7);
			} else {
				collectionAbout(demandId,$(this), 7);
			}
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
	})
	//点击关注按钮
	$(".goSpan").on('click',"span.attenSpan", function() {
		var cId=$(this).parent().siblings("a").attr("data-id");
		if(userid && userid != null && userid != "null") {
			if($(this).is('.attenedSpan')){
				cancelCollectionAbout(cId, $(this),6)
			} else {
				collectionAbout(cId, $(this),6);
			}
		}else{
			quickLog();
			operatTab();
			closeLog();
		}
	});

	$(".showStatus").on('click',".meSendBack",function(){
		if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {
			location.href="tidings.html?id="+consuId
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
	});
	$("#expertli").on("click","li",function(){
		var dataId=$(this).attr("data-id");
		location.href="userInforShow.html?professorId="+dataId;
	})
		
	function getDemandinfo(){
		$.ajax({
			"url": "/ajax/demand/qo",
			"type": "GET",
			"data": {
				"id": demandId
			 },
			"dataType": "json",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					var $da=data.data;
					$("#demandTit").text($da.title); //名字
					var thisNum="";
					thisNum+='<li><span>'+commenTime($da.createTime)+'</span></li>';
					if($da.pageViews!=0){
						thisNum+='<li><span>浏览量</span> <span>'+$da.pageViews+'</span></li>';
					}
					$("#demandNum").prepend(thisNum);
					$("#demandDesp")[0].innerText=$da.descp; //内容
					var weibopic = "http://" + window.location.host + "/images/default-paper.jpg"
					var weibotitle = $da.title;
					var weibourl = window.location.href;
					$("#weibo").attr("href","http://service.weibo.com/share/share.php?appkey=3677230589&title="+encodeURIComponent(weibotitle)+"&url="+encodeURIComponent(weibourl)+"&pic="+encodeURIComponent(weibopic)+"&content=utf-8"+"&ralateUid=6242830109&searchPic=false&style=simple");
					var demandTit = $da.title + "-科袖网";
					document.title = demandTit;
					var strCon="";
					if($da.city){ strCon+='<li>所在城市：'+$da.city+'</li>' }
					if($da.duration!=0){ strCon+='<li>预计周期：'+demandDuration[$da.duration]+'</li>' }
					if($da.cost!=0){ strCon+='<li>费用预算：'+demandCost[$da.cost]+'</li>' }
					if($da.invalidDay){ strCon+='<li>有效期至：'+TimeTr($da.invalidDay)+'</li>' }
					$(strCon).appendTo($("#demandInf"));
					
					if($da.state==0){
						$(".showStatus").html('已过期');
					}else if($da.state==1){
						if(userid==$da.creator){
							$(".showStatus").html('发布中');
						}else{
							$(".showStatus").html('<input type="button" class="frmconbtn btnModel meSendBack" value="立即回复">')
						}
					}else if($da.state==2){
						$(".showStatus").html('已完成');
					}else if($da.state==3){
						$(".showStatus").html('已关闭');
					}
					cmpFun($da.orgName);
					userFun($da.creator);
					
					consuId = $da.creator;
					demandTitle = $da.title;
					demandContent = $da.descp;
				}
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
		
	}
	/*企业用户信息*/
	function cmpFun(par) {
		$.ajax({
			"url": "/ajax/org/queryByName",
			'data': {
				name: par
			},
			"type": "get",
			"async": true,
			"success": function(data) {
				if(data.success) {
					if(data.data != null) {
						$(".goSpan").show();
						if(data.data.forShort) {
							$("#Qname").text(data.data.forShort);
						}else{
							$("#Qname").text(data.data.name);
						}
						var img="/images/default-icon.jpg";
						if(data.data.hasOrgLogo==1){
							img="/images/org/" + data.data.id + ".jpg";
						}
						if(data.data.industry) {
							$("#industry").text(data.data.industry.replace(/,/g, " | "));
						}
						$("#companyImg").attr("src",img);
						$("#companyImg").parents(".cmpHead").attr("href","cmpInforShow.html?orgId="+data.data.id);
						$("#companyImg").parents(".cmpHead").attr("data-id",data.data.id);
						$("#Qname").attr("href","cmpInforShow.html?orgId="+data.data.id);
						if(data.data.authStatus==3){
							$("#QauthFlag").addClass("authicon-com-ok").attr("title","科袖认证企业")
						}
						if(userid){
							ifcollectionAbout(data.data.id,$(".goSpan").find(".attenSpan"), 6)
						}
					} else {
						$("#companyImg").attr("src",'/images/default-icon.jpg');
						$("#Qname").text(par);
						$("#companyImg").parents(".cmpHead").removeAttr("href");
						$("#Qname").parents(".cmpHead").removeAttr("href");
					}
				}else {
					$("#companyImg").attr("src",'/images/default-icon.jpg');
					$("#Qname").text(par);
					$("#companyImg").parents(".cmpHead").removeAttr("href");
					$("#Qname").parents(".cmpHead").removeAttr("href");
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}
	function userFun(id) {
		$.ajax({
			"url": "/ajax/professor/editBaseInfo/" + id,
			"type": "get",
			"async": true,
			"datatype":"json",
			"success": function(data) {
				if(data.success && data.data) {
					console.log(data)
					var $data=data.data;
					var img;
					var oClass = autho($data.authType, $data.orgAuth, $data.authStatus);
					var oTitle = "";
					if($data.title) {
						oTitle = $data.title;
					} else {
						if($data.office) {
							oTitle = $data.office;
						}
					}
					if($data.hasHeadImage==1) {
						img = "/images/head/" + $data.id + "_l.jpg";
					} else {
						img = "../images/default-photo.jpg"
					}
					var oSt = '<li class="flexCenter" style="cursor:pointer" data-id="'+$data.id +'">'
					oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url(' + img + ');"></div>'
					oSt += '<div class = "madiaInfo" style="padding-right:0">'
					oSt += '<p class = "ellipsisSty">'
					oSt += '<span class = "h1Font" id="name">' + $data.name + '</span><em class="authiconNew ' + oClass.sty + '" title="' + oClass.title + '"></em >'
					oSt += '</p>'
					oSt += '<p class="h2Font ellipsisSty">' + oTitle + '</p>'
					oSt += '</div>'
					oSt += '</li>'
					var $oSt=$(oSt);
					$("#expertli").append($oSt);
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
		
	}

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
			$.ajax({
				"url": "/ajax/feedback/error/demand",
				"type": "POST",
				"dataType": "json",
				"async": true,
				"data": {
					"id": demandId,
					"cnt":cntCon,
					"user":cntUser
				},
				"success": function(data) {
					if(data.success) {
						backSuccessed();
					}
				},
				"error": function() {
					$.MsgBox.Alert('提示', '链接服务器超时')
				}
			});
		}
	})
})