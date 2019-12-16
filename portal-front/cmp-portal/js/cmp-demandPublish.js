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
	/*需求主题*/
	$("#demandTitle").bind({
		focus: function() {
			$(this).siblings().find("span").show();
		},
		blur: function() {
			$(this).siblings().find("span").hide();
		}
	})
	/*需求内容*/
	$("#remarkContent").bind({
		focus: function() {
			$(this).parent().siblings().find(".frmconmsg").show();
		},
		blur: function() {
			$(this).parent().siblings().find(".frmconmsg").hide();
		},
		input: function() {
			$(".msgconNum").find("em").text($(this).val().length);
		}
	})
	/*联系电话*/
	$("#phone").bind({
		focus: function() {
			$(this).siblings().find("span").show();
		},
		blur: function() {
			$(this).siblings().find("span").hide();
		}
	})
	 DefaultContact() 
	function DefaultContact() {
		$.ajax({
			url: "/ajax/org/linkman/queryAll",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async:"true",
			data: {
				"oid": $.cookie("orgId")
			},
			success: function(data, textState) {
				if(data.success) {
					var $data = data.data;
					if($data.length) {
						UnauthorizedUser($data[0].pid)
					}else {
						UnauthorizedUser('')
					}
						
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	cmpFun()
	function cmpFun() {
		$.ajax({
			"url": "/ajax/org/queryByName",
			'data': {
				name: $.cookie('orgName')
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
						if(data.data.contactNum) {
							$("#phone").val(data.data.contactNum)
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
		if($("#demandTitle").val().trim() == "") {
			$.MsgBox.Alert('提示', '请填写需求主题');
			return;
		} else if($("#demandTitle").val().length > 50) {
			$.MsgBox.Alert('提示', '需求主题不得超过50个字');
			return;
		}
		if($("#remarkContent").val().trim() == "") {
			$.MsgBox.Alert('提示', '请填写需求内容');
			return;
		} else if($("#remarkContent").val().length > 1000) {
			$.MsgBox.Alert('提示', '需求内容不得超过1000个字');
			return;
		}
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
		}
		if($("#phone").val().trim() == "") {
			$.MsgBox.Alert('提示', '请填写联系电话');
			return;
		} else if($("#phone").val().length > 50) {
			$.MsgBox.Alert('提示', '联系电话不得超过50个字');
			return;
		}
		var len=$("#expertli").find(".selectAdd");
		if(len.length==0) {
			$.MsgBox.Alert('提示', '请至少选择一个联系人。');
			return 0;
		}
		return 1;
	}
	/*时间转换成6位传给后台*/
	function st6(osr) {
		var tim = osr.substring(0, 4) + osr.substring(5, 7) + osr.substring(8, 10);
		return tim;
	}
	
	$(".posted").click(function() {
		if(test()) {
			$.MsgBox.Confirm("提示", "确认发布需求？", pDemand);
		}
		event.stopPropagation();
	});
	function pDemand() {
		$.ajax({
			"url": "/ajax/demand",
			"type": "POST",
			"data": {
				"title": $("#demandTitle").val(),
				"descp": $("#remarkContent").val(),
				"province": $("#oprovince").text(),
				"city": $("#ocity").text(),
				"cost": $("#spendCost").val(),
				"duration": $("#budget").val(),
				"invalidDay": st6($("#createTime").val()),
				"contactNum": $("#phone").val(),
				"creator": $("#expertli").find(".selectAdd").parents('li').attr('id'),
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
	/*选择用户*/
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