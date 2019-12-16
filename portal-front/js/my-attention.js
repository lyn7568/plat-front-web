$(function(){
	
	/*设置全局变量*/
	var professorId = GetQueryString("professorId");
	var resourceId = GetQueryString("resourceId");
	var userid=$.cookie("userid");
	var returnId;
	var ifurl = window.location.href;
	
	ifCollection();
	
	$('.attentBtn').click(function(){
		if (userid && userid != "null" && userid != null) {
			if($(this).is('.attented')){
				cancelCollectionExpert();
			}else{
				collectionExpert();
			}	
		}else{
			$.MsgBox.Alert('提示',"请先登录再进行关注");
			$("#mb_btn_ok").val("去登录");
			var aele = document.createElement('a');
			$("#mb_btnbox").append(aele);
			$("#mb_btnbox a").css({
				'display': "block",
				'width': '100%',
				'height': '40px',
				'position': 'absolute',
				'bottom': '-6px',
				'left': '0'
			});
			aele.setAttribute('href', '../login.html');
		}
	})
	
	/*判断是非关注专家*/
	function ifCollection() {
		if(ifurl.indexOf("professorId") >= 0){
			var data = {"professorId": userid,"watchObject": professorId}
		}else{
			var data = {"professorId": userid,"watchObject": resourceId}
		}
		//alert(JSON.stringify(data))
		$.ajax({		
			url:"/ajax/watch/hasWatch",
			data:data,
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				if(data.success && data.data != null) {
					$(".attentBtn").addClass('attented');
					$('.attentBtn i').text('已关注');
					returnId = data.data.watchObject;
				} else {
					$(".attentBtn").removeClass('attented');
					$('.attentBtn i').text('关注');
				}
			},
			error: function() {
				$.MsgBox.Alert('提示',"服务器链接超时");
			}
		});
	}
	
	/*关注专家*/
	function collectionExpert() {
		if(ifurl.indexOf("professorId") >= 0){
			var data = {"professorId": userid,"watchObject": professorId,"watchType": 1}
		}else{
			var data = {"professorId": userid,"watchObject": resourceId,"watchType": 2}
		}
		data.uname=$.cookie("userName");
		$.ajax({		
			url:"/ajax/watch",
			data:data,
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				//console.log(data.success)
				if(data.success) {
					returnId = data.data;
					$(".attentBtn").addClass('attented');
					$('.attentBtn i').text('已关注');
					//$.MsgBox.Alert('提示',"专家关注成功");
				}
			},
			error: function() {
				$.MsgBox.Alert('提示',"服务器链接超时");
			}
		});
	}
	
    /*取消收藏专家*/
	function cancelCollectionExpert() {
		$.ajax({		
			url:"/ajax/watch/delete",
			data: {
				professorId: userid,
				watchObject: returnId
			},
			dataType: 'json', //数据格式类型
			type: 'post', //http请求类型
			timeout: 10000,
			async: true,
			success: function(data) {
				//console.log(data.success)
				if(data.success) {
					$(".attentBtn").removeClass('attented');
					$('.attentBtn i').text('关注');
					//$.MsgBox.Alert('提示',"取消关注成功");
				}
			},
			error: function(data) {
				$.MsgBox.Alert('提示',"服务器链接超时");
			}
		});

	}
	
})
