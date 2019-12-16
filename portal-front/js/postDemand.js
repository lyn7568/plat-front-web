$(document).ready(function() {
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	var orgId = "";
	/*$("body").on("click", function(event) {
		var event = event ? event : window.event;
		var obj = event.srcElement ? event.srcElement : event.target;
		if($('.boxHid').css("display") === "none") {
			if($(obj).hasClass("howbtn")) {} else {
				return;
			}
		}
		if($(obj).hasClass("closeFeed")) {} else {
			if($(obj).parents(".boxHid").hasClass("boxHid")) {
				return;
			}
		}
		$('.boxHid').toggle();
		event.stopPropagation();
	})*/
	$(".btnModel,.closeFeed").click(function(){
		$('.boxHid').toggle();
	})
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
		startDate: c,
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
		if($("#org").val().trim() == "") {
			$.MsgBox.Alert('提示', '您所在的企业名称');
			return;
		} else if($("#org").val().length > 50) {
			$.MsgBox.Alert('提示', '您所在的企业名称不得超过50个字');
			return;
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
	$(".posted").click(function() {
		if(test()) {
			$.MsgBox.Confirm("提示", "确认发布需求？", pDemand);
		}
		event.stopPropagation();
	});
	/*时间转换成6位传给后台*/
	function st6(osr) {
		var tim = osr.substring(0, 4) + osr.substring(5, 7) + osr.substring(8, 10);
		return tim;
	}

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
				"creator": userid,
    			'orgName': $("#org").val(),
    			'source': 'ekexiuWeb'
			},
			"contentType": "application/x-www-form-urlencoded",
			"traditional": true,
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
					location.href = "myDemand.html";
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
	personMess()

	function personMess() {
		$.ajax({
			"url": "/ajax/professor/editInfo/" + userid,
			"type": "GET",
			"traditional": true,
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
					var $data = data.data;
					$("#proName").text($data.name);
					if($data.province) {
						$("#oprovince").text($data.province)
					}
					if($data.address) {
						$("#ocity").text($data.address) 
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
					$("#spendCost").css("color", "#999");
					
					$("#budget").css("color", "#999");
					if($data.phone) {
						$('#phone').val($data.phone)
					} else {
						 if($.cookie('userMobilePhone')) {
						 	$("#phone").val($.cookie('userMobilePhone'));
						 } else {
						 	$("#phone").val('');
						 }
						
					}
					if($data.orgName) {
						$('#org').val($data.orgName);
					}
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
})