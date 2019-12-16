$(document).ready(function(){
	$(".onlogin .headnavbtn li.mywork").addClass("navcurrent");
	$(".workmenu>ul>li:contains('成果')").addClass("nowLi");
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	var resourceId;
	/*资源列表查询*/
	function getRecourceMe(n,isbind,num) {
		var resourceNameVa=$("#patentName").val();
		var $info={};
		$info.pageSize=10;
		if(resourceNameVa !="") {
			$info.key=resourceNameVa;
		}
		$info.pageNo=n;
		$info.status=[1,2];
		$.ajax({
			"url": "/ajax/resResult/pq",
			"type": "GET",
			"success": function(data) {
				if(data.success) {
					$("#patentList").html("");
					if(num==1) {
						if(data.data.data.length==0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("您还未发布任何非专利成果");
							return;
						}else{
							$("#noresource").addClass("displayNone");
						}
					}else{
						if(data.data.data.length==0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("没有符合该搜索条件的内容");
							return;
						}else{
							$("#noresource").addClass("displayNone");
						}
					}
					resourceHtml(data.data.data);
					if(isbind == true) {
						$(".tcdPageCode").createPage({
							pageCount: Math.ceil(data.data.total / data.data.pageSize),
							current: data.data.pageNo,
							backFn: function(p) {
								getRecourceMe(p,false);
							}
						});
					}
				}
			},
			"data": $info,
			dataType: "json",
			traditional: true,
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	 getRecourceMe(1,true,1);
	 function resourceHtml($data) {
	 	for(var i=0;i<$data.length;i++) {
			 var oTime,pageview="",draftLable="",oHtml,oLi='',mg= '';
			 if ($data[i].pic)
	 			var imgSrc="/data/researchResult"+$data[i].pic.split(",")[0];
	 		if($data[i].status=='2') {
	 			oTime="修改于 "+TimeTr($data[i].modifyTime);
	 			draftLable='<span class="draftLable" style="margin-left: 20px;">草稿</span>';
	 			oHtml="unPatentIssue.html";
				 oLi="class='draftList'"
				 mg = '<li><span>'+oTime+'</span>'+draftLable+'</li>'
	 		}else if($data[i].status=='1'){
	 			oHtml="unPatentShow.html"
	 		}
	 	var oStr='<li '+oLi+'>'+
				'<a href="'+oHtml+'?id='+$data[i].id+'&flag='+$data[i].state+'" target="_blank">'+
					'<div class="madiaHead resouseHead" style="background-image: url('+imgSrc+');"></div>'	+						
						'<div class="madiaInfo">'+					
							'<p class="h1Font ellipsisSty">'+$data[i].name+'</p>'+						
							'<ul class="showliTop h2Font clearfix hu2">'+
								mg +
							'</ul>'+
							'<ul class="showliTop h2Font clearfix hu1">'+
							'</ul>'+
						'</div>'+
				'</a>'+
				'<ul class="madiaEdit">'+
					'<li><span class="deteleThis2" data-id="'+$data[i].id+'"></span></li>'+
					'<li><span class="editThis" data-id="'+$data[i].id+'"></span></li>'+
				'</ul>'+
			'</li>'	
			var $oStr=$(oStr);
			$("#patentList").append($oStr);
			if ($data[i].status=='1') {
				proList($data[i].id,$oStr,$data[i].orgId||'')
			
			}
			$oStr.find(".editThis").attr("data-state",$data[i].status);
	 	}
	 }
	 function proList(par,$pa,p3) {
		$.ajax({
			"url": "/ajax/resResult/researcher",
			"type": "GET",
			"data": {
				id: par
			},
			"success": function(data) {	
				if(data.success) {
					var $da = data.data
					if($da.length) {
						var arr =[];
						for(var i=0;i<$da.length;i++){
							arr.push($da[i].name)
						}
						$pa.find('.hu2').append('<li>研究者：'+arr.join(',')+'</li>')
						if(p3)
						orgname(p3,$pa)
					}
				}
			},
			"data": {
				"id":par
			},
			dataType: "json",
			'error':function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	function orgname(par,$pa) {
		$.ajax({
			"url": "ajax/org/"+par,
			"type": "GET",
			"success": function(data) {
				if(data.success) {
					$pa.find('.hu1').append('<li>所属机构：'+data.data.name+'</li>')
				}
			},
			"data": {
				"id":par
			},
			dataType: "json",
			'error':function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*点击修改跳转修改页面*/
	$("#patentList").on("click",".editThis",function(){
		location.href="unPatentIssue.html?id="+$(this).attr("data-id")+"&flag="+$(this).attr("data-state");
	})
	/*点击删除跳转修改页面*/
	$("#patentList").on("click",".deteleThis2",function(){
		resourceId=$(this).attr("data-id");
		$.MsgBox.Confirm("提示", "确认删除该该成果？",deleResource);
	})
	/*删除函数*/
	function deleResource() {
			$.ajax({
					"url": "/ajax/resResult/delete",
					"type": "POST",
					"success": function(data) {
						if(data.success) {	
							getRecourceMe(1,true);
						}
					},
					"data": {"id":resourceId},
					"beforeSend": function() {  },
					"contentType": "application/x-www-form-urlencoded",
					dataType: "json"
				});
	}
	/*输入资源名称限制字数*/
	$("#patentList").bind({
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
		getRecourceMe(1,true);
	})
})
