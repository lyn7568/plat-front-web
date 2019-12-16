/**
 * 邮箱注册二三步
 */
loginStatus();//判断个人是否登录
//获取邮箱传值
var mailVal = $.cookie('mailVal');
var mailCode = GetQueryString('sc');
//初始化
emailSuccess();
//获取邮箱验证码传值注册
if(mailCode != '') {
	$.ajax("/ajax/regmail/" + mailCode, {
		type: "GET",
		async: true,
		success: function(data) {
			if(data.success) {
				location.href = "bind-mail-ok.html";
			} else {
				location.href = "bind-mail-no.html";
			}
		},
		error: function() {
			//$.MsgBox.Alert('消息提醒','邮箱注册失败')
			location.href = "bind-mail-no.html";
		},
		dataType: 'json'
	});
}

function emailSuccess() {
	$('#receiveMail').text(mailVal);
	$(".maillink").each(function() {
		var url = mailVal.split('@')[1];
		for(var j in hash) {
			if(hash[url]==undefined){
        		$(this).attr("href", "http://mail." + url);
        	}else{
        	 	$(this).attr("href", hash[url]);
        	}
		}
	});
}