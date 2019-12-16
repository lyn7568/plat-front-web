//修改密码
$(function(){
	loginStatus();//判断个人是否登录
	valUser();
	istyle();
	var temp=[];
	//提交上传
	$('.subUp').on("click", function() {
		var imglen = $(".uploader-list .thumbnail").length;
		if(imglen == 0) {
			$.MsgBox.Alert("消息提醒","请上传您身份证的正反面。");
		}else if(imglen > 3){
			$.MsgBox.Alert("消息提醒","最多上传3张照片。");
		}else{
			typeimg(temp);
		}
	})
	
	/*图片上传*/
	var uploader = WebUploader.create({
	     auto: true,// 选完文件后，是否自动上传。
	     swf: 'webuploader/Uploader.swf',// swf文件路径
	     server: '../ajax/cachedFileUpload',
	     // 添加的文件数量
		 //fileNumLimit: 3,
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

	/*图片上传成功*/
	uploader.on( 'uploadSuccess', function(file,data) {
		var cacheImageKey =data.data[0].cacheKey;
		temp.push(cacheImageKey);
	})
    
	/*删除图片*/
	$("#fileList").on("click",".cancel",function(){
		$(this).parent().parent().remove();
	})

})

/*实名认证*/
function istyle() {
	$.ajax("/ajax/professor/auth", {
		data: {
			"id": $.cookie("userid")
		},
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		timeout: 10000, //超时设置
		async: false,
		success: function(data) {
			//console.log(JSON.stringify(data));
			var $info = data.data || {};
			if(data.success && data.data) {
				authStatus = $info.authStatus;
				//console.log(authStatus)
				if(authStatus == -1) {
					$("#identBtn").show();
					$("#identProcess").text("很遗憾，您提交的材料没有通过认证，请更换符合要求的认证材料再试试。");
					$("#identProcess").css({"width":"350px"});
					$("#identBtn").text("重新认证");
				} else if(authStatus == 0) {
					$("#identBtn").show();
					$("#identProcess").text("您还未进行实名认证");
					$("#identBtn").text("开始认证");
				} else if(authStatus == 1) {
					$("#identProcess").text("认证信息提交成功！");
					$("#identts").text("我们将尽快对您的信息进行认证。");
				} else if(authStatus == 2) {
					$("#identProcess").text("我们正在对您的材料进行认证，请稍等片刻。");
					$("#identProcess").css({"width":"280px"});
				} else if(authStatus == 3) {
					$("#identProcess").text("恭喜您实名认证成功！");
				}
				
				if(authStatus == -1 || authStatus == 0){
					$("#identBtn").on("click",function(){
						$(".IdentityUp").show();
						$(".IdentityState").hide();
					})
				}
				
			}
		},
		error: function() {
			$.MsgBox.Alert('消息','服务器链接超时');
		}
	});
}

//提交实名认证图片
function typeimg(temp) {
	$.ajax("/ajax/authApply/realName", {
		data: {
			"professorId": $.cookie("userid"),
			"fns": temp
		},
		dataType: 'json', //数据格式类型
		type: 'post', //http请求类型
		//async: false,
		timeout: 10000, //超时设置
		traditional:true,//传数组必须加这个
		success: function(data) {
			//console.log(JSON.stringify(data));
			if(data.success) {
				$(".IdentityUp").hide();
				$(".IdentityState").show();
				location.reload(true);
			}
		},
		error: function() {
			$.MsgBox.Alert('消息','服务器链接超时');
		}
	});
}
