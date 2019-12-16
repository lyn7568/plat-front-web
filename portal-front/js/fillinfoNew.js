$(function() {
	var userid = $.cookie('userid');
	userInformation(userid);
	//获取用户信息
	function userInformation(userid) {
		$.ajax("/ajax/professor/baseInfo/" + userid, {
			type: "GET",
			async: true,
			success: function($data) {
				console.log($data)
				if($data.success) {
					$("#username").text($data.data.name);
					if($data.data.hasHeadImage == 1) {
						var imgvar = '<img src="/images/head/' + userid + '_l.jpg" style="width:100%"/>';
						$("#userimg").append(imgvar);
					}
					if($data.data.orgName){
						$("#orgName").text($data.data.orgName);
						$("#orgName").removeAttr("contenteditable");
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '服务器请求失败')
			},
		});
	}

})

//校验信息
function nameVal(_this, num) {
	var inputval = $(_this).text().replace(/[^\u0000-\u00ff]/g, "aa").length;
	if(inputval > num) {
		$(_this).next().find("span").text("最多输入" + num / 2 + "个字");
		$(_this).addClass("frmmsg-warning");
	} else {
		$(_this).next().find("span").text("");
		$(_this).removeClass("frmmsg-warning");
	}
}

/*获取焦点*/
function getFocus(_this) {
	$(_this).next().find("span").text("");
	$(_this).removeClass("frmmsg-warning");
}

//进入科袖按钮
function modifyUserInformation() {
	var $data = {};
	$data.name = $("#username").text(); //名字				
	$data.orgName = $("#orgName").text(); //机构名称
	$data.title = $("#title").text(); //职称
	$data.office = $("#office").text(); //职位
	$data.department = $("#department").text(); //部门
	var province = $("#oprovince").text();
	var address = $("#ocity").text(); //市
	if(province == "请选择省/直辖市") {
		$data.province = "";
	} else {
		$data.province = province; //省
	}
	if(address == "请选择城市") {
		$data.address = "";
	} else {
		$data.address = address; //省
	}
	$data.id = $.cookie('userid');
	console.log($data);
	$.ajax("/ajax/professor/updatePro", {
		type: "POST",
		dataType: "json",
		data: $data,
		success: function($data) {
			console.log($data)
			if($data.success) {
				location.href = "index.html";
			}
		},
		error: function() {
			$.MsgBox.Alert('消息', '服务器请求失败')
		},
	});
}