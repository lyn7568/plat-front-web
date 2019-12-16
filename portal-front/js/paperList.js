$(document).ready(function(){
	$(".onlogin .headnavbtn li.mywork").addClass("navcurrent");
	$(".workmenu>ul>li:contains('论文')").addClass("nowLi");
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	var userName = $.cookie("userName");
	var paperId;
	/*论文列表查询*/
	function getPaperMe(n,isbind,num) {
		var paperNameVa=$("#paperName").val();
		var $info={};
		$info.id=userid;
		$info.author = userName;
		$info.pageSize=10;
		if(paperNameVa !="") {
			$info.name=paperNameVa;
		}
		$info.pageNo=n;
		$.ajax({
			"url": "/ajax/ppaper/byProfessor",
			"type": "GET",
			"data": $info,
			"dataType": "json",
			"success": function(data) {
				console.log(data)
				if(data.success) {
					var dataStr = data.data.data;
					$("#paperList").html("");
					if(num==1) {
						if(dataStr.length==0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("您还未导入任何论文");
							return;
						}else{
							$("#noresource").addClass("displayNone");
						}
					}else{
						if(dataStr.length==0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("没有符合该搜索条件的内容");
							return;
						}else{
							$("#noresource").addClass("displayNone");
						}
					}
					paperHtml(dataStr);
					if(isbind == true) {
						$(".tcdPageCode").createPage({
							pageCount: Math.ceil(data.data.total / data.data.pageSize),
							current: data.data.pageNo,
							backFn: function(p) {
								getPaperMe(p,false);
							}
						});
					}
				}
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	function isAgreeNum(pId) {
		var num;
	var data = {"id": pId}
	$.ajax({		
		url:"/ajax/ppaper/agreeCount",
		data:data,
		dataType: 'json', //数据格式类型
		type: 'get', //http请求类型
		timeout: 10000,
		async: false,
		success: function(data) {
			if(data.success){
				num=data.data
			}
		},
		error: function() {
			$.MsgBox.Alert('提示',"服务器链接超时");
		}
	});
	return num;
}

	 getPaperMe(1,true,1);
	 function paperHtml($data) {
	 	for(var i=0;i<$data.length;i++) {
	 		var oTime,pageview="",oHtml,oLi='';
 			oTime="导入于 "+TimeTr($data[i].assTime);
 			pageview='<li><span>阅读量 '+$data[i].pageViews+'</span></li>';
 			oHtml="paperShow.html"
 			var thub="";
 			if(isAgreeNum($data[i].id)!=0){
 				thub='<li><span>赞 '+isAgreeNum($data[i].id)+'</span></li>';
 			}
 			
	 		var oStr='<li '+oLi+'>'+
				'<a href="'+oHtml+'?paperId='+$data[i].id+'" target="_blank">'+
					'<div class="madiaHead paperHead"></div>'	+						
						'<div class="madiaInfo">'+					
							'<p class="h1Font ellipsisSty">'+$data[i].name+'</p>'+						
							'<ul class="showliTop h2Font clearfix">'+
								'<li><span>'+oTime+'</span></li>'+pageview+thub+'<li><span class="leaveMsgCount"></span></li>'+
							'</ul>'+
						'</div>'+
				'</a>'+
				'<ul class="madiaEdit">'+
					'<li><span class="deteleThis2" data-id="'+$data[i].id+'"></span></li>'+
					'<li><span class="editThis" data-id="'+$data[i].id+'"></span></li>'+
				'</ul>'+
			'</li>'	
			var $oStr = $(oStr);
			$("#paperList").append($oStr);
			leaveMsgCount($data[i].id,2,$oStr);
	 	}
	 }
	/*点击修改跳转修改页面*/
	$("#paperList").on("click",".editThis",function(){
		location.href="paperModify.html?paperId="+$(this).attr("data-id")
	})
	/*点击删除跳转修改页面*/
	$("#paperList").on("click",".deteleThis2",function(){
		paperId=$(this).attr("data-id");
		$.MsgBox.Confirm("提示", "确认删除该论文？",delePaper);
	})
	/*删除函数*/
	function delePaper() {
			$.ajax({
					"url": "/ajax/ppaper/cAss",
					"type": "POST",
					"success": function(data) {
						if(data.success) {	
							getPaperMe(1,false);
						}
					},
					"data": {
						"id":paperId,
						"uid":userid
					},
					"beforeSend": function() { /*console.log(this.data)*/ },
					"contentType": "application/x-www-form-urlencoded",
					dataType: "json"
				});
	}
	/*输入论文名称限制字数*/
	$("#paperName").bind({
		keyup: function() {
			if($(this).val().length > 50) {
				$(this).val($(this).val().substr(0, 50));
			}
		}
	});
	/*点击搜索*/
	$(".searchSpan").click(function(){
		$(".tcdPageCode").remove();
		$(".aboutRes").append('<div class="tcdPageCode"></div>');
		getPaperMe(1,true);
	})
//	getProfessorData(userid);
//	function getProfessorData(professorId) {
//		$.ajax({
//			"url": "/ajax/professor/editBaseInfo/" + professorId,
//			"type": "get",
//			"async": true,
//			"success": function(data) {
//				if(data.success) {
//					var oAuthType=data.data.authType;
//					if(oAuthType==0){
//						$("a:contains('需求')").attr("href","myDemand.html");
//					}else if(oAuthType==1){
//						$("a:contains('需求')").attr("href","needList.html");
//					}
//					
//					
//				} else {
//					$.MsgBox.Alert("提示", "服务器连接失败");
//				}
//			},
//			"error": function() {
//				$.MsgBox.Alert('提示', '服务器连接失败');
//			}
//		})
//	}
})
