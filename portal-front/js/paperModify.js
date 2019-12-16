$(document).ready(function() {
	loginStatus(); //判断个人是否登录
	var userid = $.cookie("userid");
	var paperId = GetQueryString("paperId");
	getPaperMe();
	hotKey(".oinput");//
	/*删除标签*/
	$("body").on("click", ".closeThis", function() {
		if($(this).parent().length < 5) {
			$(this).parents(".keyResult").siblings("div").show();
		}
		$(this).parent().remove();

	})
	//论文发布
	$("#release").on("click",function(){
		$.MsgBox.Confirm("提示","确认发布该论文?",paperUpdate);	
	})
	//删除论文
	$("#delete").on("click",function(){
		$.MsgBox.Confirm("提示","确认删除该论文？",paperDelet);
	})
	
	/*获取论文信息*/
	function getPaperMe() {
		$.ajax({
			"url": "/ajax/ppaper/qo",
			"type": "GET",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					paperHtml(data.data);
					getPaperAuthors(data.data.id);
					var paperName = data.data.name + "-科袖网";
					document.title = paperName;
				}
			},
			"data": {
				"id": paperId
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*获取论文作者信息*/
	function getPaperAuthors(stritrm) {
		$.ajax({
			"url": "/ajax/ppaper/authors",
			"type": "GET",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					if(data.data.length>0){
						for(var i=0;i<data.data.length;i++){
							var authTy="",authTit="",baseInfo="",imgbg="../images/default-photo.jpg";
							if(data.data[i].professorId.substring(0, 1) != "#"){
								$.ajax({
									type:"get",
									url:"/ajax/professor/editBaseInfo/" + data.data[i].professorId,
									async:true,
									success:function($proData){
										console.log($proData)
										if($proData.success){
											var showPro = $proData.data;
											if(showPro.hasHeadImage == 1) {
												imgbg = "/images/head/" + showPro.id + "_l.jpg";
											} else {
												imgbg = "../images/default-photo.jpg";
											}
											//认证
											var oSty = autho(showPro.authType,showPro.orgAuth,showPro.authStatus);
											authTy = oSty.sty;
											authTit = oSty.title;
											
											var title = showPro.title || "";
											var orgName = showPro.orgName || "";
											var office = showPro.office || "";
											if(orgName!=""){
												if(title != "") {
													baseInfo = title + "，" + orgName;
												}else{
													if(office!=""){
														baseInfo = office  + "，" + orgName;	
													}else{
														baseInfo = orgName;	
													}
												}
											}else{
												if(title != "") {
													baseInfo = title;
												}else{
													if(office!=""){
														baseInfo = office;	
													}else{
														baseInfo = "";	
													}
												}
											}
											var str="";
											str +='<li class="flexCenter" data-id="'+ showPro.id +'">'
											str +='<div class="madiaHead useHead" style="background-image:url('+ imgbg +')"></div>'
											str +='<div class="madiaInfo" style="margin-top:-4px">'
											str +='<p class="ellipsisSty"><span class="h1Font">'+ showPro.name +'</span><em class="authiconNew '+ authTy +'" title="'+ authTit +'"></em></p>'
											str +='<p class="h2Font ellipsisSty">'+ baseInfo +'</p>'
											str +='</div></li>';
											var $str=$(str);
											$("#aboutAuthors").append($str);
										}
									}
								})
							}else{
								var str="";
								str +='<li class="flexCenter" data-id="'+ data.data[i].professorId +'">'
								str +='<div class="madiaHead useHead" style="background-image:url('+ imgbg +')"></div>'
								str +='<div class="madiaInfo">'
								str +='<p class="ellipsisSty"><span class="h1Font">'+ data.data[i].name +'</span></p>'
								str +='</div></li>';
								var $str=$(str);
								$("#aboutAuthors").append($str);
							}
						}
						
					}
				}
			},
			"data": {
				"id": stritrm
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*处理论文html代码*/
	function paperHtml($da) {
		$("#paperName").text($da.name); //名字
		$("#pageView").text($da.pageViews); //浏览量
		$("#paperAbstract").text($da.summary); //摘要内容
		if(!$da.cn4periodical){
			$da.cn4periodical=""
		}
		if(!$da.en4periodical){
			$da.en4periodical=""
		}
		if(!$da.cn4periodical && !$da.en4periodical){
			$("#paperJournal").parents("li").hide();
		}else{
			$("#paperJournal").text($da.cn4periodical +" " + $da.en4periodical);
		}

		if(!$da.pubDay){
			$("#paperVolume").parents("li").hide();
		}else{
			$("#paperVolume").text($da.pubDay);
		}
		if($da.keywords != undefined && $da.keywords.length != 0 ){
			var subs = strToAry($da.keywords)
			if(subs.length>0){
				for (var i = 0; i < subs.length; i++) 
				{
					$("#paperSList").append('<li>'+ subs[i] +'<div class="closeThis"></div></li>');
				};
			}
			if( $("#paperSList").find("li").length >= 5) {
				$("#paperSList").parents(".keyResult").siblings("div.col-w-12").hide();
			}
		}		
	}
	/*论文添加*/
	function paperUpdate(){
		$.ajax({
			"url" : "/ajax/ppaper/kw",
			"type" :  "post" ,
			"dataType" : "json",
			"data" :{
				"id":paperId,
				"keywords":captiureSubInd("paperSList li")
			},
			"traditional": true, //传数组必须加这个
			"success" : function(data) {
				console.log(data);
				if (data.success){
					$.MsgBox.Alert("提示","论文发表成功！",function paperList(){
						location.href = "paperList.html";	
					});
					$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
				} else {
					$.MsgBox.Alert("提示", "论文发表失败！");
				}
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}
	//组合关键字
	function captiureSubInd(subIndu) {
		var industrys = $("#" + subIndu + "");
		var industryAll = "";
		if(industrys.size() > 0) {
			for(var i = 0; i < industrys.size(); i++) {
				industryAll += industrys[i].innerText.trim();
				industryAll += ',';
			};
			industryAll = industryAll.substring(0, industryAll.length - 1);
		}
		return industryAll;
	}
	/*论文删除*/
    function paperDelet() {
    	$.ajax({
			"url" : "/ajax/ppaper/cAss",
			"type" : "POST",
			"dataType" : "json",
			"data": {
				"id": paperId,
				"uid":userid
			},
			"success" : function($data) {							
				if ($data.success) {
					location.href = "paperList.html";	
				} 
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		})
	}
	
	//纠错反馈
	$(".feedBack").click(function(){
		$(".feedbackBox").fadeToggle();
	})
	$(".closeBack").click(function(){
		$(".feedbackBox").fadeToggle();
	})
	$(".correctBlock").on("keyup",".correctCon",function(){
		var cntCon=$(this).val();
		if(cntCon.length>0){
			$(this).siblings(".correctSubmit").attr("disabled",false);
		}else{
			$(this).siblings(".correctSubmit").attr("disabled",true);
		}
	})
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
				"url": "/ajax/feedback/error/paper",
				"type": "POST",
				"dataType": "json",
				"async": true,
				"data": {
					"id": paperId,
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