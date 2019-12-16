$(document).ready(function(){
	$(".onlogin .headnavbtn li.mywork").addClass("navcurrent");
	$(".workmenu>ul>li:contains('成果')").addClass("nowLi");
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	var patentId;
	/*资源列表查询*/
	function getPatentMe(n,isbind,num) {
		var patentNameVa=$("#patentName").val();
		var $info={};
		$info.id=userid;
		$info.pageSize=10;
		if(patentNameVa !="") {
			$info.name=patentNameVa;
		}
		$info.pageNo=n;
		$.ajax({
			"url": "/ajax/ppatent/byProfessor",
			"type": "GET",
			"data": $info,
			"dataType": "json",
			"success": function(data) {
				console.log(data)
				if(data.success) {
					var dataStr = data.data.data;
					$("#patentList").html("");
					if(num==1) {
						if(dataStr.length==0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("您还未导入任何专利");
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
					patentHtml(dataStr);
					if(isbind == true) {
						$(".tcdPageCode").createPage({
							pageCount: Math.ceil(data.data.total / data.data.pageSize),
							current: data.data.pageNo,
							backFn: function(p) {
								getPatentMe(p,false);
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
		url:"/ajax/ppatent/agreeCount",
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

	 getPatentMe(1,true,1);
	 function patentHtml($data) {
	 	for(var i=0;i<$data.length;i++) {
	 		var oTime,pageview="",oHtml,oLi='';
	 		
 			oTime="导入于 "+TimeTr($data[i].assTime);
 			pageview='<li><span>阅读量 '+$data[i].pageViews+'</span></li>';
 			oHtml="patentShow.html"
 			var thub="";
 			if(isAgreeNum($data[i].id)!=0){
 				thub='<li><span>赞 '+isAgreeNum($data[i].id)+'</span></li>';
 			}
 			
	 	var oStr='<li '+oLi+'>'+
				'<a href="'+oHtml+'?patentId='+$data[i].id+'" target="_blank">'+
					'<div class="madiaHead patentHead"></div>'	+						
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
			$("#patentList").append($oStr);
			leaveMsgCount($data[i].id,3,$oStr);
	 	}
	 }
	/*点击修改跳转修改页面*/
	$("#patentList").on("click",".editThis",function(){
		location.href="patentShow.html?patentId="+$(this).attr("data-id")+"&flag=1"
	})
	/*点击删除跳转修改页面*/
	$("#patentList").on("click",".deteleThis2",function(){
		patentId=$(this).attr("data-id");
		$.MsgBox.Confirm("提示", "确认删除该资源？",deleResource);
	})
	/*删除函数*/
	function deleResource() {
			$.ajax({
					"url": "/ajax/ppatent/cAss",
					"type": "POST",
					"success": function(data) {
						if(data.success) {	
							getPatentMe(1,false);
						}
					},
					"data": {
						"id":patentId,
						"uid":userid
					},
					"beforeSend": function() { /*console.log(this.data)*/ },
					"contentType": "application/x-www-form-urlencoded",
					dataType: "json"
				});
	}
	/*输入资源名称限制字数*/
	$("#patentName").bind({
		keyup: function() {
			if($(this).val().length > 30) {
				$(this).val($(this).val().substr(0, 30));
			}
		}
	});
	/*点击搜索*/
	$(".searchSpan").click(function(){
		$(".tcdPageCode").remove();
		$(".aboutRes").append('<div class="tcdPageCode"></div>');
		getPatentMe(1,true);
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
