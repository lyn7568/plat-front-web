/*企业认证上传*/
function aa(name,names){
	var index=name.lastIndexOf(".");
	var hou;
	if(index>0) {
		 hou=name.substring(index+1).toUpperCase();
		 for(var i in names) {
		 	if(hou==names[i]) {
		 		return true;
		 	}
		 }
	}
	return false;
}

function uploadFun(_this, num) {
	
	var fileval = $(_this).val();
	var reg = /[^\\\/]*[\\\/]+/g;     
	var name = fileval.replace(reg, '');      
	var postfix = /\.[^\.]+/.exec(name);      
	var filename = name.substr(0, postfix['index']);
	console.log(postfix[0]);
	if(aa(name,['PNG','JPG','JPEG'])) {
		if(fileval != "") {
			$(_this).parents(".upFront").addClass("displayNone");
			$(_this).parents(".uploadlogo").find(".upBack").removeClass("displayNone");
			$(_this).parents(".uploadlogo").find(".upBack span").html(filename);
			ajaxFileUpload(num);
		}
	} else {
		$.MsgBox.Alert('提示', '请您上传正确的文件格式');
	}
}

/*上传文件生成cacheKey码*/
function ajaxFileUpload(num) {
	$.ajaxFileUpload({
		url: '/ajax/cachedFileUpload?text=1',
		secureuri: false,
		fileElementId: 'fileone' + num,
		type: "POST", 
		dataType:"text/html",
		success: function(data, status) {
			var $data = JSON.parse(data);
			if($data.success) {
				$("#fileone" + num).attr("data-id", $data.data[0].cacheKey);
			}
		}
	})
}

/*删除文件*/
function deluploadFun(_this, numt) {
	$(_this).parent().addClass("displayNone");
	$(_this).parents(".uploadlogo").find(".upFront").removeClass("displayNone");
	$("#fileone" + numt).attr("data-id", "");
}