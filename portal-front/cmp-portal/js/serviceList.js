$(document).ready(function() {
	$(".onlogin .headnavbtn li").eq(0).addClass("navcurrent");
	$(".workmenu>ul>li.serIcon").addClass("nowLi");
	var orgId = $.cookie('orgId');
	if(orgId == "" || orgId == null || orgId == "null") {
		location.href = "cmp-settled-log.html";
	}
	var resourceId;
	function companyAuthentState() {
		$.ajax({
			url: '/ajax/org/authStatus',
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"id": orgId
			},
			beforeSend: function() {},
			success: function(data, textState) {
				if(data.success) {
					console.log(data);
					if(data.data == 3) {
						$("#companyDemandList").show();
					} else {
						$("#identityState").show();
					}
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	companyAuthentState();
	$(".issueSpan").click(function(e){
		UnauthorizedUser()
		 e.preventDefault(); 
	})
	function UnauthorizedUser() {
		$.ajax({
			url: "/ajax/professor/qaOrgAuth",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async:"true",
			data: {
				"orgId": orgId,
				"orgAuth": 1
			},
			success: function(data, textState) {
				if(data.success) {
					if(data.data.length==0) {
						$.MsgBox.Confirm("提示", "请至少认证1位员工</br><span style='margin-top:20px;font-size:14px;color:#ccc;'>选择认证员工作为联系人，代表企业与对方沟通。</span>", function(){
							location.href="cmp-staffList.html";
						});
						$("#mb_btn_no").val("稍后再说");
						$("#mb_btn_ok").val("去认证");
					}else if(data.data.length>0){
						window.open("cmp-sevriceIssue.html")
					}
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}

	/*资源列表查询*/
	function getRecourceMe(n,isbind,num) {
		var resourceNameVa=$("#resouceName").val();
		var $info={};
		$info.oid=orgId;
		$info.pageSize=10;
		if(resourceNameVa !="") {
			$info.key=resourceNameVa;
		}
		$info.pageNo=n;
		$.ajax({
			"url": "/ajax/ware/pq/org/search",
			"type": "GET",
			"success": function(data) {
				if(data.success) {
					$("#resourceList").html("");
					if(num==1) {
						if(data.data.total==0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("您还未发布任何服务");
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
							pageCount: Math.ceil(data.data.total / 10),
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
		for(var i = 0; i < $data.length; i++) {
			var imgSrc="../images/default-service.jpg";
	 		var oTime,pageview="",draftLable="",oHtml,oLi='';
	 		if($data[i].images) {
	 			imgSrc="/data/ware"+$data[i].images.split(",")[0]
	 		}
	 		if($data[i].state=='2') {
	 			console.log($data[i].modifyTime)
	 			oTime="修改于 "+TimeTr($data[i].modifyTime);
	 			draftLable='<span class="draftLable">草稿</span>';
	 			oHtml="cmp-sevriceIssue.html";
	 			oLi="class='draftList'"
	 		}else if($data[i].state=='1'){
	 			console.log($data[i].createTime)
	 			oTime="发布于 "+TimeTr($data[i].createTime);
	 			pageview='<li><span>浏览量 '+$data[i].pageViews+'</span></li>';
	 			oHtml="../sevriceShow.html"
	 		}
	 		var oStr='<li '+oLi+'>'+
				'<a href="'+oHtml+'?sevriceId='+$data[i].id+'" target="_blank">'+
					'<div class="madiaHead resouseHead" style="background-image: url('+imgSrc+');"></div>'	+						
						'<div class="madiaInfo">'+					
							'<p class="h1Font ellipsisSty">'+$data[i].name+'</p>'+						
							'<ul class="showliTop h2Font clearfix">'+
								'<li><span>'+oTime+'</span></li>'+pageview+'<li><span class="link-class oop"></span></li>' +
							'</ul><p>'+draftLable+'<span class="crel link-class"></span></p>' +
						'</div>'+
				'</a>'+
				'<ul class="madiaEdit">'+
					'<li><span class="deteleThis2" data-id="'+$data[i].id+'"></span></li>'+
					'<li><span class="editThis" data-id="'+$data[i].id+'"></span></li>'+
				'</ul>'+
			'</li>'	
			var $os = $(oStr);
			$("#resourceList").append($os);
			if($data[i].status == 2) {
				resourecRel.call($os.find(".crel"), $data[i].id);
			} else {
				resourecRel.call($os.find(".oop"), $data[i].id);
			}
		}
	}
	/*点击修改跳转修改页面*/
	$("#resourceList").on("click",".editThis",function(){
		location.href="cmp-sevriceIssue.html?sevriceId="+$(this).attr("data-id");
	})
	/*点击删除跳转修改页面*/
	$("#resourceList").on("click",".deteleThis2",function(){
		resourceId=$(this).attr("data-id");
		$.MsgBox.Confirm("提示", "确认删除该资源？",deleResource);
	})
	/*删除函数*/
	function deleResource() {
			$.ajax({
					"url": "/ajax/ware/delete",
					"type": "POST",
					"success": function(data) {
						if(data.success) {	
							getRecourceMe(1,false);
						}
					},
					"data": {"id":resourceId},
					"beforeSend": function() {  },
					"contentType": "application/x-www-form-urlencoded",
					dataType: "json"
				});
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
	function professList(par) {
		$.ajax({
			"url": "/ajax/professor/qm",
			"type": "GET",
			"context": this,
			"traditional":true,
			"success": function(data) {
				if(data.success) {
					var $data = data.data;
					var arr = []
					if($data.length) {
						for(var i=0;i<$data.length;i++) {
							arr.push($data[i].name)
						}
						this.text("联系人 " + arr.join("、"))
					}
					
				}
			},
			"data": {
				"id": par
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*判断资源是否设置了资源联系人*/
	function resourecRel(rsd) {
		$.ajax({
			"url": "/ajax/ware/pro",
			"type": "GET",
			"context": this,
			"success": function(data) {
				if(data.success) {
					var $data = data.data;
					if($data.length == 0) {
						this.text("未设置联系人").css("color","#e03b43");
					}else {
						var arr = [];
						for(var i =0;i<$data.length;i++) {
							arr.push($data[i].professor)
						}
						professList.call(this,arr);
					}
				}
			},
			"data": {
				"id": rsd
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
})