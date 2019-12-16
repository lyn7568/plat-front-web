//企业认证
$(function() {

	var orgid = $.cookie('orgId');
	if(orgid == "" || orgid == null || orgid == "null"){
    	location.href = "cmp-settled-log.html";
    }
	var auth = GetQueryString("auth");
	var temp = [];
	/*查询企业认证状态*/
	authStatus();	

	$("#authsubmet").on("click", function() {
		var fileoneVal = $("#fileone1").attr("data-id");
		var filetwoVal = $("#fileone2").attr("data-id");
		if(fileoneVal == "") {
			$.MsgBox.Alert('提示', '请上传《企业法人营业执照》');
		} else if(filetwoVal == "") {
			$.MsgBox.Alert('提示', '请上传加盖公章的《入驻科袖授权证明》');
		} else {
			temp.push(fileoneVal);
			temp.push(filetwoVal);
			authsubmetFun(temp);
		}
	})

	function authStatus() {
		$.ajax("/ajax/org/authStatus", {
			data: {
				"id": orgid
			},
			type: "GET",
			dataType: 'json',
			async: false,
			success: function($data) {
				console.log($data)
				if($data.success) {
					if($data.data == -1) { //认证失败
						$(".authsb").removeClass("displayNone");
						$("#authsb").on("click", function() {
							$(this).parents(".authsb").addClass("displayNone");
							$(".authup").removeClass("displayNone");
						})
					} else if($data.data == 0) { //未认证
						if(auth==1){
							$(".authup").removeClass("displayNone");
						}else{
							$(".authks").removeClass("displayNone");
							$("#authks").on("click", function() {
								$(this).parents(".authks").addClass("displayNone");
								$(".authup").removeClass("displayNone");
							})
						}
					} else if($data.data == 1) { //待认证
						$(".authtj").removeClass("displayNone");
					} else if($data.data == 2) { //认证中
						$(".authz").removeClass("displayNone");
					} else if($data.data == 3) { //已认证
						$(".authok").removeClass("displayNone");
					} else {
						$.MsgBox.Alert('提示', '不存在该企业或该企业认证状态为空');
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', '服务器请求失败');
			},
		});
	}

	function authsubmetFun(temp) {
		console.log(temp)
		console.log(orgid)
		$.ajax("/ajax/authApply/org", {
			data: {
				"professorId": orgid,
				"fns": temp
			},
			type: "POST",
			dataType: 'json',
			async: false,
			traditional: true, //传数组必须加这个
			success: function($data) {
				console.log($data)
				if($data.success) {
					//location.reload(true);
					location.href = "cmp-setAuth.html";
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', '服务器请求失败');
			},
		});
	}

})
