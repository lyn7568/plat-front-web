$(document).ready(function(){
	$(".onlogin .headnavbtn li.mywork").addClass("navcurrent");
	$(".workmenu>ul>li:contains('资源')").addClass("nowLi");
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	var resourceId;
	/*资源列表查询*/
	function getRecourceMe(n,isbind,num) {
		var resourceNameVa=$("#resouceName").val();
		var $info={};
		$info.professorId=userid;
		$info.pageSize=10;
		if(resourceNameVa !="") {
			$info.key=resourceNameVa;
		}
		$info.pageNo=n;
		$.ajax({
			"url": "/ajax/resTmp/pq",
			"type": "GET",
			"success": function(data) {
				if(data.success) {
					$(".importUl").html("");
					if(num==1) {
						if(data.data.data.length==0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("没有需要导入的资源");
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
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	 getRecourceMe(1,true,1);
function resourceHtml($data) {
	console.log($data);
 	for(var i = 0; i < $data.length; i++) {
 		var imgSrc = "../images/default-resource.jpg";
 		var oSpec="",orgName="",domain="",subject="",orgName="",spec="",comp="",parameter="",descp="";
 		if($data[i].img) {
 			imgSrc = "/data/resource/" + $data[i].img;
 		}
 		if($data[i].spec) {
 			oSpec="厂商型号："+$data[i].spec;
 			spec=$data[i].spec;
 		}
 		if($data[i].domain) {
 			domain="关键词："+$data[i].domain;
 			subject=$data[i].domain
 		}
 		if($data[i].comp) {
 			comp=$data[i].comp;
 			orgName="所属机构："+$data[i].comp;
 		}
 		var oImg="";
 		if($data[i].img) {
 			oImg=$data[i].img;
 		}
 		if($data[i].parameter){
 			parameter=$data[i].parameter
 		}
 		var oName1=$data[i].name;
 		var oId=$data[i].id;
 		var oIndu=$data[i].majorFunc.substring(0,30);
 		descp=$data[i].majorFunc;
 		$.ajax({
			"url": "/ajax/resource/isImportRes",
			"type": "GET",
			"async":false,
			"success": function(data) {
				if(data.success) {
					var oT,oText;
					if(data.data) {
						oT="importSpan-2";
						oText="已导入";
					}else{
						oT="importSpan-1";
						oText="导入";
					}
					var oString = '<li>' +
		 			'<a class="flexCenter">' +
		 			'<div class="madiaHead resouseHead" style="background-image: url('+imgSrc+');"></div>' +
		 			'<div class="madiaInfo">' +
		 			'<p class="h1Font ellipsisSty">'+oName1+'</p>' +
		 			'<p class="h2Font ellipsisSty">'+oSpec+'</p>' +
		 			'<p class="h2Font ellipsisSty">'+orgName+'</p>' +
		 			'<p class="h2Font ellipsisSty">'+domain+'</p>' +
		 			'</div>' +
		 			'</a>' +
		 			'<div class="importBtn">' +
		 			'<span class="importResource '+oT+'" data-id="'+oId+'" data-descp="'+descp+'" data-parameter="'+parameter+'" data-comp="'+comp+'" data-spec="'+spec+'" data-subject="'+subject+'" data-name="'+oName1+'" data-indu="'+oIndu+'" flag="1" data-img="'+oImg+'">'+oText+'</span>' +
		 			/*'<span class="importSpan-2">再次导入</span>' +
		 			'<span class="importSpan-3">已导入</span>' +*/
		 			'</div>' +
		 			'</li>'
		 			$(".importUl").append(oString);
				}
			},
			"data": {
				id:userid,
				resourceTmpId:$data[i].id,
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
 	}
 }
	/*输入资源名称限制字数*/
	$("#resouceName").bind({
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

	/*导入资源*/
	$(".importUl").on("click",".importResource",function(){
		var oF=$(this).attr("flag");
		if(oF!=1) return;
		var $this=$(this);
		$.ajax({
			"url": "/ajax/resource/importRes",
			"type": "POST",
			"success": function(data) {
				if(data.success) {
					$this.text("导入成功").addClass("importSpan-3").removeClass("importSpan-1").removeClass("importSpan-2").attr("flag","2").css("cursor","auto");
				}
					
			},
			"data": {
				subject:$(this).attr("data-subject"),
				comp:$(this).attr("data-comp"),
				spec:$(this).attr("data-spec"),
				parameter:$(this).attr("data-parameter"),
				resourceTmpId:$(this).attr("data-id"),
				resourceName:$(this).attr("data-name"),
				professorId:userid,
				supportedServices:$(this).attr("data-indu"),
				imgSrc:$(this).attr("data-img"),
				descp:$(this).attr("data-descp")
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	});
	 
	/*hover事件*/
	$(".importUl").on({
		mouseover:function() {
			$(this).text("再次导入")
			},
		mouseout:function() {
			$(this).text("已导入")
			}
		},".importResource:contains(已导入),.importResource:contains(再次导入)"
	)

})
