//邀请码登录设置密码页面
$(function(){  
	$(".serviceBox").hover(function(){
		$(".serviceTel").fadeToggle();
	})
	var userid=$.cookie("userid");
	$.ajax({
		"url":"/ajax/professor/info/" + userid,
		"data":{"id":userid},
		"success":function(response){
			$("#name").text(response.data.name);
		},
		"error":function(error){
			$.MsgBox.Alert('消息', '服务器请求失败');
		}
	})
}); 

/*校验登录按钮显示状态*/
function checkLoginButtn(_this) {
	var passwordVal = $(_this).parents(".waysBlock").find("#password").val();
	var passwordokVal = $(_this).parents(".waysBlock").find("#passwordok").val();
	if(passwordVal == "" || passwordokVal == "") {
		$(_this).parents(".waysBlock").find("#ButSubmit").attr("disabled", true);
	} else {
		$(_this).parents(".waysBlock").find("#ButSubmit").attr("disabled", false);
	}
}
/*获取焦点*/
function getFocus(_this) {
	$(_this).next().find("span").text("");
	$(_this).removeClass("frmmsg-warning");
}

var isPass = false;
var isPass1=false;
function valPassword(_this){
	if($(_this).val().length==0){
		 $(_this).next().find("span").text("请设置您的登录密码");
		 $(_this).addClass("frmmsg-warning");
	}else if($(_this).val().length<6){
		 $(_this).next().find("span").text("密码由6-24个字符组成，区分大小写");
		 $(_this).addClass("frmmsg-warning");
	}else{
		$(_this).next().find("span").text("");
		$(_this).removeClass("frmmsg-warning");
		isPass1=true;
	}
}

function valPassword2(_this){
	var passwordval = $("#password").val();
	var password2 = $("#password2").val();
	if($(_this).val().length==0){
		 $(_this).next().find("span").text("请设置您的登录密码");
		 $(_this).addClass("frmmsg-warning");
	}else if($(_this).val().length<6){
		 $(_this).next().find("span").text("密码由6-24个字符组成，区分大小写");
		 $(_this).addClass("frmmsg-warning");
	}else if($(_this).val() != passwordval){
		 $(_this).next().find("span").text("两次输入不一致，请重新输入");
		 $(_this).addClass("frmmsg-warning");
	}else{
		isPass = true;
		 $(_this).next().find("span").text("");
		 $(_this).removeClass("frmmsg-warning");
	}
}
function savePassword(){
	if(isPass&&isPass1){
		$.ajax("/ajax/cp",{
			type:"POST",
			async: false,
			success:function(data){
				console.log(data)
				if(data.success){
					if(data.data == true){	
						$.cookie("userAuth","true");
						location.href = "index.html";
					}
				}
			},
			error:function(){$.MsgBox.Alert('消息', '服务器请求失败');},
			data:{"id":$.cookie("userid"),"npw":$("#passwordok").val() },
		 	dataType: 'json'
		});
	}

}