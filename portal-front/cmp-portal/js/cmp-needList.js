$(document).ready(function() {
	$(".onlogin .headnavbtn li").eq(0).addClass("navcurrent");
	$(".workmenu>ul>li.demandIcon").addClass("nowLi");
	var id = $.cookie('orgId');
	if(id == "" || id == null || id == "null"){
    	location.href = "cmp-settled-log.html";
    }
	resMgr(id);
	demandList(true,10, 1);
	/*查询企业认证状态*/
	function companyAuthentState() {
		$.ajax({
			url: '/ajax/org/authStatus',
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"id": id
			},
			beforeSend: function() {},
			success: function(data, textState) {
				if(data.success) {
					console.log(data);
					if(data.data == 3) {
						$("#companyDemandList").show();
					} else {
						$("#identityState").show();
					}
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	companyAuthentState();
	function st6This(osr) {
		var tim = osr.substring(0, 4) + osr.substring(5, 7) + osr.substring(8, 10) ;
		return tim;
	}
	var seleTime = '<div class="mb-list mb-listR"><p class="msg-tit">请设置需求的有效期：</p>'+
			'<div style="position:relative"><div class="input-append date form_date form_datetime" data-link-field="dtp_input2" >'+
				'<em class="mr_sj"></em>'+
				'<input size="16" type="text" readonly class="frmtype frmcontype fColor" placeholder="请设置需求的有效期">'+
				'<span class="dateIcon"><i class="icon-calendar displayNone"></i></span>'+
				'<span class="add-on"><i class="icon-th displayNone"></i></span>'+
			'</div>'+
			'<input type="hidden" id="dtp_input2"/>'+
			'<span></span></div></div>'
	$("#cmpneedList").on("click",".delayThis",function(){//延期
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
					"day":st6This(delayTime)
				},
				"success": function(data) {
					if(data.success && data.data) {
						$(".blackcover2").fadeOut();
						$(".modelContain").hide();
						$("body").removeClass("modelOpen");
						demandList(true,10,1);
					}
				}
			});
		})
	})
	$("#cmpneedList").on("click",".overThis",function(){//完成
		var dataId=$(this).parents("li").find(".urlHref").attr("data-id");
		$.MsgBox.Confirm("提示", "确认该需求已解决？",function(){
			$.ajax({
				"url": "/ajax/demand/over",
				"type": "POST",
				"async": true,
				"data":{
					"id":dataId,
				},
				"success": function(data) {
					if(data.success && data.data) {
						console.log(data);
						$(".madiaEdit").remove();
						demandList(true,10,1);
					}
				}
			});
		});
	})
	$("#cmpneedList").on("click",".closeThis",function(){//关闭
		var dataId=$(this).parents("li").find(".urlHref").attr("data-id");
		$.MsgBox.Confirm("提示", "确认要关闭该需求？",function(){
			$.ajax({
				"url": "/ajax/demand/close",
				"type": "POST",
				"async": true,
				"data":{
					"id":dataId
				},
				"success": function(data) {
					if(data.success && data.data) {
						$(".madiaEdit").remove();
						demandList(true,10, 1);
					}
				}
			});
		});
	})
	$("#cmpneedList").on("click",".updateThis",function(){//修改
		var dataId=$(this).parents("li").find(".urlHref").attr("data-id");
		window.open("needIssue.html?demandId="+dataId)
	})
	$(".issueSpan").click(function(e){
		UnauthorizedUser()
		 e.preventDefault(); 
	})
	function UnauthorizedUser() {
		$.ajax({
			url: "/ajax/professor/qaOrgAuth",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async:"true",
			data: {
				"orgId": $.cookie("orgId"),
				"orgAuth": 1
			},
			success: function(data, textState) {
				if(data.success) {
					if(data.data.length==0) {
						$.MsgBox.Confirm("提示", "请至少认证1位员工</br><span style='margin-top:20px;font-size:14px;color:#ccc;'>选择认证员工作为联系人，代表企业与对方沟通。</span>", function(){
							location.href="cmp-staffList.html";
						});
						$("#mb_btn_no").val("稍后再说");
						$("#mb_btn_ok").val("去认证");
					}else if(data.data.length>0){
						window.open("cmp-demandPublish.html")
					}
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	/*需求列表*/
	function demandList(isbind, pageSize, pageNo) {
		$.ajax({
			url: "/ajax/demand/pq/org",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			traditional: true,
			data: {
				"state":[0,1,2,3],
    			'oname':$.cookie('orgName'),
				"pageNo": pageNo,
				"pageSize": pageSize
			},
			"beforeSend": function() {
				$("#cmpneedList").append('<img src="../images/loading.gif" class="loading" />');
			},
			success: function(data, textState) {
				if(data.success) {
					console.log(data);
					$("#cmpneedList").html("");
					var $info = data.data.data;
					if($info.length > 0){
						for(var i = 0; i < $info.length; i++) {
							var liStr=$("<li></li>").appendTo("#cmpneedList");
							demandHtml($info[i],liStr);
							userFun($info[i].creator,liStr);
						}
						if($info.length != 0) {
							if(isbind == true) {
								$(".tcdPageCode").createPage({
									pageCount: Math.ceil(data.data.total / pageSize),
									current: data.data.data.pageNo,
									backFn: function(p) {
										$("#cmpneedList").html("");
										demandList(false,10, p);
										document.body.scrollTop = document.documentElement.scrollTop = 0;
									}
								});
							}
						}
					}else{
						$("#cmpneedList").parent().find(".nodatabox").removeClass("displayNone")
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
			pdRight="padding-right:80px";
			closStr += '<ul class="madiaEdit"><li><span class="updateThis">修改</span></li><li><span class="overThis">完成</span></li></ul>'
		}else if($data.state==0 || ($data.state==1 && dateGap=="1")){
			pdRight="padding-right:260px";
			closStr += '<ul class="madiaEdit"><li><span class="delayThis">延期</span></li><li><span class="updateThis">修改</span></li><li><span class="overThis">完成</span></li></ul>'
		}
		var strCon='';
			strCon+='<a class="madiaInfo urlHref" style="'+pdRight+'" target="_blank" href="../demandShow.html?demandId='+$data.id+'" data-id="'+$data.id+'">'
			strCon+='<p class="h1Font ellipsisSty">'+ $data.title +'</p>'
			strCon+='<ul class="showliTop h2Font clearfix">'
			strCon+='<li><span>发布于 '+TimeTr($data.createTime)+'</span></li>'
			strCon+= sowU
			strCon+='<li><span class="creator"></span></li>'
			strCon+= statusU
			strCon+='</ul>'
			strCon+='</a>'+closStr
			
		$(strCon).appendTo(liStr);								
	}

	function userFun(id,$listItem) {
		$.ajax({
			"url": "/ajax/professor/editBaseInfo/" + id,
			"type": "get",
			"async": true,
			"data":{
				"id":id
			},
			"success": function(data) {
				if(data.success && data.data) {
					$listItem.find(".creator").text('联系人 ' +data.data.name);
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
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
	
})