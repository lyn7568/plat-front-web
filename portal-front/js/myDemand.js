$(document).ready(function() {
	$(".onlogin .headnavbtn li.mywork").addClass("navcurrent");
	$(".workmenu>ul>li:contains('需求')").addClass("nowLi");
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
    var statusN="";
	myDemandList(true, 1, 10);
	
	var sureOrg ='<div class="mb-list mb-listL" style="text-align:left"><p class="msg-tit">请先确认您的所在机构：<small>（建议填写正式全称）</small></p>'+
		'<div style="height:56px;"><input type="text" class="form-control sureOrg" placeholder="如：北京科袖科技有限公司" /><p class="msg-warning">50字以内</p></div>'+
		'<div class="msg-tip"><p>注：</p><p>1. 只能发布您所在机构的需求。</p><p>2. 当您在资料中变更了所在机构后，该需求将会自动关闭。</p></div></div>';
	var seleTime = '<div class="mb-list mb-listR"><p class="msg-tit">请设置需求的有效期：</p>'+
			'<div style="position:relative"><div class="input-append date form_date form_datetime" data-link-field="dtp_input2" >'+
				'<em class="mr_sj"></em>'+
				'<input size="16" type="text" readonly class="frmtype frmcontype fColor" placeholder="请设置需求的有效期">'+
				'<span class="dateIcon"><i class="icon-calendar displayNone"></i></span>'+
				'<span class="add-on"><i class="icon-th displayNone"></i></span>'+
			'</div>'+
			'<input type="hidden" id="dtp_input2"/>'+
			'<span></span></div></div>'
	
	$(".setTimeBlock").on("focus",".sureOrg",function(){
		$(".msg-warning").show();
	}).on("blur",".sureOrg",function(){
		$(".msg-warning").hide();
	}).on("keyup",".sureOrg",function(){
		if($(this).val().length>0){
			$(".setTimeBlock").find(".mb_btnOkpub").removeAttr("disabled");
		}else{
			$(".setTimeBlock").find(".mb_btnOkpub").attr("disabled",true)
		}
	})
	$(".issueSpanBlock").on("click",".issueSpan",function(){
		window.open("postDemand.html");
	});
	
	$("#myneedList").on("click",".delayThis",function(){//延期
		var dataId=$(this).parents("li").find(".urlHref").attr("data-id");
		$(".blackcover2").fadeIn();
		var btnOk='<input class="mb_btn mb_btnOk mb_btnOkset" type="button" value="确定">'
		$(".mb_btnOk").remove(); $("#promotGt").prepend(btnOk);
		$(".modelContain").show(); $("body").addClass("modelOpen");
		$(".mb-listR").remove(); $("#promotTh").append(seleTime);//时间选择器
		var a = new Date();
	    var c = a.getFullYear() + "-" + (Number(a.getMonth()) + 1) + "-" + (Number(a.getDate()) + 1);
		$(".mb-listR .form_datetime").datetimepicker({
			language: 'ch',
			format: 'yyyy-mm-dd',
			weekStart: 0,
			todayBtn: false,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0,
			startDate: getNowFormatDate(),
			oflag: 1,
			startDate: c,
		});
		$(".mb-listR .form_datetime").val(getNowFormatDate(1));
		$(".mb_btnOkset").on("click", function() {
			var delayTime=$(".mb-listR .form_datetime .fColor").val();
			$.ajax({
				"url": "/ajax/demand/defer",
				"type": "POST",
				"async": true,
				"data":{
					"id":dataId,
					"uid":userid,
					"day":st6This(delayTime)
				},
				"success": function(data) {
					if(data.success && data.data) {
						$(".blackcover2").fadeOut();
						$(".modelContain").hide();
						$("body").removeClass("modelOpen");
						myDemandList(true,1,10);
					}
				}
			});
		})
	})
	$("#myneedList").on("click",".updateThis",function(){//修改
		var dataId=$(this).parents("li").find(".urlHref").attr("data-id");
		window.open("demandModify.html?demandId="+dataId)
	})
	$("#myneedList").on("click",".overThis",function(){//完成
		var dataId=$(this).parents("li").find(".urlHref").attr("data-id");
		$.MsgBox.Confirm("提示", "确认该需求已解决？",function(){
			$.ajax({
				"url": "/ajax/demand/over",
				"type": "POST",
				"async": true,
				"data":{
					"id":dataId,
					"uid":userid
				},
				"success": function(data) {
					if(data.success && data.data) {
						console.log(data);
						$(".madiaEdit").remove();
						myDemandList(true,1, 10);
					}
				}
			});
		});
	})
	
	/*我的需求列表*/
	function myDemandList(isbind, page, pageNum) {
		$.ajax({
			url: "/ajax/demand/pq",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			traditional:true,
			data: {
				"state": [0,1,2,3],
				"uid": userid,
				"pageNo": page,
				"pageSize": pageNum
			},
			beforeSend: function() {
				$("#myneedList").append('<img src="../images/loading.gif" class="loading" />');
			},
			success: function(data) {
				if(data.success) {
					$("#myneedList").html("");
					var $info = data.data.data;
					console.log(data)
					if($info.length > 0){
						for(var i = 0; i < $info.length; i++) {
							var liStr=$("<li></li>").appendTo("#myneedList");
							demandHtml($info[i],liStr);
							if($info[i].state==0 || $info[i].state==1){
								liStr.find(".urlHref").attr("href","demandModify.html?demandId="+$info[i].id);
							}else{
								liStr.find(".urlHref").attr("href","demandShow.html?demandId="+$info[i].id);
							}
						}
						if(isbind == true) {
							$(".tcdPageCode").createPage({
								pageCount: Math.ceil(data.data.total / pageNum),
								current: data.data.pageNo,
								backFn: function(p) {
									$("#myneedList").html("");
									myDemandList(false, p, 10);
									document.body.scrollTop = document.documentElement.scrollTop = 0;
								}
							});
						}
					}else{
						$("#myneedList").parent().find(".nodatabox").removeClass("displayNone")
					}
				}
				$(".loading").remove();
			},
			error: function() {

			}
		})
	}
	function demandHtml($data,liStr) {
		var sowU="";
		if($data.pageViews!=0){
			sowU='<li><span>浏览量 '+$data.pageViews+'</span></li>'
		}
		var statusU="";
		var dateGap = delayDay($data.invalidDay);
		if($data.state==1 && dateGap=="1"){
			statusU='<li><span class="draftLable">即将于 '+TimeTr($data.invalidDay)+' 过期</span></li>'
		}
		if($data.state==0){
			statusU='<li><span class="draftLable">已于 '+TimeTr($data.invalidDay)+' 过期</span></li>'
		}else if($data.state==2){
			statusU='<li><span class="overLable">已于 '+TimeTr($data.modifyTime)+' 完成</span></li>'
		}else if($data.state==3){
			statusU='<li><span>已于 '+TimeTr($data.modifyTime)+' 关闭</span></li>'
		}
		var closStr='',pdRight="";
		if($data.state==1 && dateGap=="0"){
			pdRight="padding-right:170px";
			closStr += '<ul class="madiaEdit"><li><span class="updateThis">修改</span></li><li><span class="overThis">完成</span></li></ul>'
		}else if($data.state==0 || ($data.state==1 && dateGap=="1")){
			pdRight="padding-right:260px";
			closStr += '<ul class="madiaEdit"><li><span class="delayThis">延期</span></li><li><span class="updateThis">修改</span></li><li><span class="overThis">完成</span></li></ul>'
		}
		var strCon='';
			strCon+='<a class="madiaInfo urlHref" style="'+pdRight+'" target="_blank" data-id="'+$data.id+'">'
			strCon+='<p class="h1Font ellipsisSty">'+ $data.title +'</p>'
			strCon+='<ul class="showliTop h2Font clearfix">'
			strCon+='<li><span>发布于 '+TimeTr($data.createTime)+'</span></li>'
			strCon+= sowU
			strCon+= statusU
			strCon+='</ul>'
			strCon+='</a>'+closStr
			
		$(strCon).appendTo(liStr);
		
		
	}

	//修改机构名称
	function updateOrgName(newName){
		$.ajax({
			"url": "/ajax/professor/org",
			"type": "POST",
			"async": true,
			"data":{
				"id":userid,
				"name":newName
			},
			"success": function(data) {
				if(data.success && data.data) {
					console.log(data)
					$.MsgBox.Confirm("提示", "机构名称修改成功",function(){
						location.href="postDemand.html";
					});
					$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
				}
			}
		});
	}
	
	function delayDay(startTime){
		var dateToday = new Date();
		var dateInvalid = new Date();
		dateInvalid.setFullYear(parseInt(startTime.substring(0, 4)));
		dateInvalid.setMonth(parseInt(startTime.substring(4, 6)) - 1);
		dateInvalid.setDate(parseInt(startTime.substring(6, 8)));
		
		var dateGap = Math.abs(dateToday.getTime() - dateInvalid.getTime());
		var ifDelay="0";
		if(dateGap < 604800000){
			ifDelay="1";
		}
		return ifDelay;
	}
	
	function st6This(osr) {
		var tim = osr.substring(0, 4) + osr.substring(5, 7) + osr.substring(8, 10) ;
		return tim;
	}

})