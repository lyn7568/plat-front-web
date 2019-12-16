var typenum,authStatus;
var userid = $.cookie("userid");
var sett = GetQueryString("set");
if(sett==3){
	$("#sfnav").addClass("bgcolor").siblings().removeClass("bgcolor");	
	$("#sfbox").show().siblings().hide();	
}
//角色切换
$(".IdentityChoice").on("click",".boxnav li",function(){
	$(this).addClass("set").siblings().removeClass("set");
})

//初始化身份状态
$.ajax("/ajax/professor/auth",{
	data:{"id":userid},
	type:"GET",
 	dataType: 'json',
	async: false,
	success:function(data){ 
		var $info = data.data || {};
		if(data.success && data.data) {
			authStatus=$info.authStatus;
			//console.log(authStatus)
			if($info.authStatus==0){
				$(".identProcess").text("暂时还未进行身份认证");
				$(".identBtn").text("现在去认证");
			}else if($info.authStatus==1){
				$(".identProcess").text("已经通过身份认证");
				$(".identBtn").text("重新认证");
			}else if($info.authStatus==2){
				$(".identProcess").text("身份待审核 ");
				$(".identts").text("（认证审核期间不能重复认证操作） ");
				$(".identBtn").hide();
			}else if($info.authStatus==3){
				$(".identProcess").text("身份审核中");
				$(".identts").text("（认证审核期间不能重复认证操作） ");
				$(".identBtn").hide();
			}else if($info.authStatus==4){
				$(".identProcess").text("身份认证通过");
				$(".identBtn").text("重新认证");
			}else if($info.authStatus==5){
				$(".identProcess").text("身份认证失败，请重新认证");
				$(".identBtn").text("重新认证");
			}
			typenum = $info.authentication;
			authStatus=$info.authStatus;
		}else{
			$.MsgBox.Alert("消息提醒","系统异常!");
		}
	},
	error:function(){
		$.MsgBox.Alert("消息提醒","系统异常!");
    }
	
});

$(".boxnav span").each(function () {
	var datanum =$(this).attr("data-num");
	if(datanum==typenum){
		$(this).parent().addClass("set");
	}
});

$(".identBtn").on("click",function(){
	$(".IdentityUp").show();
	$('.IdentityState').hide();
	/*if(authStatus==0 && authStatus==4 && authStatus==5){
		$(".IdentityUp").show();
		$('.IdentityState').hide();
	}else if(authStatus==1){ 
		$(".IdentityUp").show();
		$('.IdentityState').hide();
	}*/
})

//提交上传
$('.subUp').on("click", function() {
	var imglen = $(".uploader-list .thumbnail").length;
	if(imglen == 0) {
		$.MsgBox.Alert("消息提醒","请上传能够证明您身份的相关证件");
	} else {
		typename(userid, typenum);
	}
})


//添加认证申请信息
function typename(userid, usertype) {
	$.ajax("/ajax/authApply",{
		data:{"professorId":userid,"applyType":usertype},
		type:"post",
	 	dataType: 'json',
		async: false,
		success:function(data){ 
			if(data.success) {
				var authapplyid = data.data;
				$(".uploader-list img").each(function() {
					var str = $(this).attr("src");
					var base64 = str.replace("data:image/jpeg;base64,", "");
					//console.log(base64);
				    typeimg(authapplyid, base64);
				});
			}else{
				$.MsgBox.Alert("消息提醒","系统异常!");
			}
		},
		error:function(){
			$.MsgBox.Alert("消息提醒","系统异常!");
	    }
		
	});
}

//添加申请认证图片
function typeimg(authapplyid, base64) {
	$.ajax("/ajax/authImage",{
		data:{"authApplyId":authapplyid,"base64":base64},
		type:"post",
	 	dataType: 'json',
		async: false,
		success:function(data){ 
			if(data.success) {
				$.MsgBox.Alert("消息提醒","认证图片上传成功");
				$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
				window.location.href="account-set.html?set=3"; 
			}
		},
		error:function(){
			$.MsgBox.Alert("消息提醒","系统异常!");
	    }
		
	});
}


/*图片上传*/
var uploader = WebUploader.create({
     auto: true,// 选完文件后，是否自动上传。
     swf: 'webuploader/Uploader.swf',// swf文件路径
   	 pick: '#filePicker',  // 选择文件的按钮。可选。
   	 duplicate :true ,//允许图片重复上传
   	 // 只允许选择图片文件。
     accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
     }
});

// 当有文件添加进来的时候
uploader.on( 'fileQueued', function( file ) {
    var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                //'<div class="info">' + file.name + '</div>' +
            '</div>'
            ),
        $btns = $('<div class="file-panel">' +
                    '<span class="cancel">删除</span>' +
                    '</div>').appendTo( $li ),
        $img = $li.find('img');
     	var $list = $("#fileList");
    	$list.prepend( $li );

	    // 创建缩略图
	    // 如果为非图片文件，可以不用调用此方法。
	    // thumbnailWidth x thumbnailHeight 为 100 x 100
	    uploader.makeThumb( file, function( error, src ) {
	        if ( error ) {
	            $img.replaceWith('<span>不能预览</span>');
	            return;
	        }
	
	        $img.attr( 'src', src );
	    }, 1000, 1000 );
	    
	    $li.on( 'mouseenter', function() {
		    $btns.stop().animate({height: 30});
		});
		
		$li.on( 'mouseleave', function() {
		    $btns.stop().animate({height: 0});
		});
});

/*

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
uploader.on( 'uploadSuccess', function( file ) {
   	
});*/

$("#fileList").on("click",".cancel",function(){
	$(this).parent().parent().remove();
})

$(".webuploader-pick").css({"width":"100px","height":"100px"});

/*图片上传结束*/





