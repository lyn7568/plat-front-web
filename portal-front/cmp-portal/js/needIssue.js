$(document).ready(function() {
	var demandId = GetQueryString("demandId");
	var a = new Date();
	var c = a.getFullYear() + "-" + (Number(a.getMonth()) + 1) + "-" + (Number(a.getDate()) + 1);
	$('.dateBtn').datetimepicker({
		language: 'ch',
		weekStart: 0,
		todayBtn: false,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		startDate: c
	});
	/*联系电话*/
	$("#phone").bind({
		focus: function() {
			$(this).siblings().find("span").show();
		},
		blur: function() {
			$(this).siblings().find("span").hide();
		}
	})
	queryOnedemand()

	function queryOnedemand() {
		$.ajax({
			"url": "/ajax/demand/qo",
			"type": "GET",
			"data": {
				"id": demandId,
			},
			"contentType": "application/x-www-form-urlencoded",
			"traditional": true,
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
					var $data = data.data;
					var demandTit =$data.title + "-科袖网";
					document.title = demandTit;
					UnauthorizedUser($data.creator)
					if($data.state == 0) {
						$('.overdue').removeClass("displayNone")
					}
					$("#demandTitle").text($data.title);
					$("#publishTime").text(commenTime($data.createTime));
					$("#pageView").text($data.pageViews);
					$("#demandContent").text($data.descp);
					$("#oprovince").text($data.province);
					$("#ocity").text($data.city);
					$("#spendCost").val($data.cost);
					$("#budget").val($data.duration);
					$("#createTime").val(changeTime($data.invalidDay));
					$("#phone").val($data.contactNum);
					$("#org").val($data.orgName);
					cmpFun($data.orgName);
					if($data.cost == 0) {
						$("#spendCost").css("color", "#999");
					}
					if($data.duration ==0) {
						$("#budget").css("color", "#999");
					}
					//省份城市颜色
					if($("#oprovince").text() == "请选择省/直辖市") {
						$("#oprovince").removeClass("mr_select");
					} else {
						$("#oprovince").addClass("mr_select");
					}
					if($("#ocity").text() == "请选择城市") {
						$("#ocity").removeClass("mr_select");
					} else {
						$("#ocity").addClass("mr_select");
					}
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
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
	function UnauthorizedUser(par) {
		$.ajax({
			url: "/ajax/professor/qaOrgAuth",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async:"false",
			data: {
				"orgId": $.cookie('orgId'),
				"orgAuth": 1
			},
			success: function(data, textState) {
				if(data.success) {
					console.log(data);
					unauthUser(data.data,par);
					if(data.data.length ==0) {
						$(".seRe").removeClass("displayNone")
					}
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	function unauthUser($res,par) {
	var osting=""
	for(var i = 0; i < $res.length; i++) {
		var img;
		var oClass = autho($res[i].authType, $res[i].orgAuth, $res[i].authStatus);
		var oTitle="";
		if($res[i].title) {
			oTitle=$res[i].title;
		}else{
			if($res[i].office) {
				oTitle=$res[i].office;
			}
		}
		var cls='';
		if($res[i].id == par) {
			cls = 'selectAdd'
		}
		if($res[i].hasHeadImage) {
				img = "/images/head/" + $res[i].id + "_l.jpg";
			} else {
				img = "../images/default-photo.jpg"
			}
		var oSt = '<li class="flexCenter" style="cursor:pointer;" id="'+$res[i].id+'">'
		oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url('+img+');"></div>'
		oSt += '<div class = "madiaInfo">'
		oSt += '<p class = "ellipsisSty">'
		oSt += '<span class = "h1Font" id="name">'+$res[i].name+'</span><em class="authicon '+oClass.sty+'" title="'+oClass.title+'"></em >'
		oSt += '</p>'
		oSt += '<p class="h2Font ellipsisSty">'+oTitle+'</p>'
		oSt += '</div>'
		oSt += '<div class="selectNull '+cls+'" flag=1></div>'
		oSt += '</li>'
		osting+=oSt;
	}
	$("#expertli").html(osting);
}
	function formatDate(date) {
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? '0' + m : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		return y + '-' + m + '-' + d;
	};

	function test() {
		if($("#oprovince").text() == "请选择省/直辖市") {
			$.MsgBox.Alert('提示', '请选择省/直辖市');
			return;
		}
		if($("#ocity").text() == "请选择城市") {
			$.MsgBox.Alert('提示', '请选择城市');
			return;
		}
		if($("#createTime").val() == "") {
			$.MsgBox.Alert('提示', '请选择需求有效期');
			return;
		} else {
			if(formatDate(a) > $("#createTime").val()) {
				$.MsgBox.Alert('提示', '该需求已过期，请修改有效期，若已解决请点击「需求已完成」按钮');
				return;
			}
		}
		if($("#phone").val().trim() == "") {
			$.MsgBox.Alert('提示', '请填写联系电话');
			return;
		} else if($("#phone").val().length > 50) {
			$.MsgBox.Alert('提示', '联系电话不得超过50个字');
			return;
		}
		return 1;
	}
	$("#modia").click(function() {
		if(test()) {
			$.MsgBox.Confirm("提示", "确认修改需求？", pDemand);
		}
	});
	$("#complete").click(function() {
		$.MsgBox.Confirm("提示", "确认需求已完成？", com);
	});
	$("#closeDemand").click(function() {
		$.MsgBox.Confirm("提示", "确认关闭该需求？", closeDe);
	});

	function com() {
		$.ajax({
			"url": "/ajax/demand/over",
			"type": "POST",
			"data": {
				"id": demandId
			},
			"contentType": "application/x-www-form-urlencoded",
			"traditional": true,
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
					location.href = "cmp-needList.html";
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}

	function closeDe() {
		$.ajax({
			"url": "/ajax/demand/close",
			"type": "POST",
			"data": {
				"id": demandId
			},
			"contentType": "application/x-www-form-urlencoded",
			"traditional": true,
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
					location.href = "cmp-needList.html";
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
	/*时间转换成6位传给后台*/
	function st6(osr) {
		var tim = osr.substring(0, 4) + osr.substring(5, 7) + osr.substring(8, 10);
		return tim;
	}

	function pDemand() {
		var time=new Date(),
 			y=time.getFullYear();
 			m=time.getMonth()+1;
 			if(m<10) {
 				m="0"+m;
 			}
 			d=time.getDate();
 			if(d<10) {
 				d="0"+d;
 			}
 			var oTime=Number(y+""+m+""+d);
 			var seleTime=Number(st6($("#createTime").val()));
			if(oTime>seleTime) {
				$.MsgBox.Alert('提示', '该需求已过期，请修改有效期，若已解决请点击「需求已完成」按钮');
				return;
			}
		$.ajax({
			"url": "/ajax/demand/modify/org",
			"type": "POST",
			"data": {
				"province": $("#oprovince").text(),
				"city": $("#ocity").text(),
				"cost": $("#spendCost").val() != "0" ? $("#spendCost").val() : "",
				"duration": $("#budget").val() != "0" ? $("#budget").val() : "",
				"invalidDay": st6($("#createTime").val()),
				"contactNum": $("#phone").val(),
				"creator":$("#expertli").find(".selectAdd").parents('li').attr('id'),
				"id": demandId,
			    'orgName': $.cookie("orgName"),
			    'source': 'ekexiuWeb'
			},
			"contentType": "application/x-www-form-urlencoded",
			"traditional": true,
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
					location.href = "cmp-needList.html";
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
	$("#expertli").on("click","li",function(){
		var userL=$("#expertli").find(".selectAdd").length;
		console.log($(this).find('.selectNull').hasClass("selectAdd"))
		if($(this).find('.selectNull').hasClass("selectAdd")) {
			$(this).find('.selectNull').removeClass("selectAdd");
			return;
		}
		$("#linkman").text("");
		if(userL ==1) {
			$("#linkman").text("最多选择1位联系人");
			return;
		}
		$(this).find('.selectNull').addClass("selectAdd");	
	});
});