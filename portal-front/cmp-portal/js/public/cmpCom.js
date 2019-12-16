$(document).ready(function() {
	$(".unlogin").removeClass("displayNone");
	var footerHeight = $("footer").outerHeight(true);
	$('#container').css("padding-bottom", footerHeight + "px");
	//窗口大小变更事件
	$(window).resize(function() {
		footerHeight = $("footer").outerHeight(true);
		$('#container').css("padding-bottom", footerHeight + "px");
		//console.log(footerHeight)
	});

	$(document).scroll(function() {
		var top = $(document).scrollTop();
		if(top == 0) {
			$(".navheader").removeClass("navhdown");
		} else {
			$(".navheader").addClass("navhdown");
		}
	})
	//退出登录转态
	$("#exitLogin").on("click", function() {
		exit();
	})
	//判断登录转态
	var orgId = $.cookie("orgId");
	if(orgId && orgId != "null" && orgId != null) {
		$(".unlogin").addClass("displayNone");
		$(".onlogin").removeClass("displayNone");
		$.ajax("/ajax/image/hasOrgLogo", {
			data: {
				"id": orgId
			},
			type: "GET",
			dataType: 'json',
			async: false,
			success: function($data) {
				if($data.success) {
					if($data.data) {
						$("#imglogo").attr("src", "/images/org/" + orgId + ".jpg");
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', '服务器请求失败')
			},
		});
		$("#imglogo").on("click",function(){
			location.href="cmpInformation.html";
		})
	} else {
		$(".unlogin").removeClass("displayNone");
		$(".onlogin").addClass("displayNone");
	}
	
	/*选择省份*/
	$(document).on("click", "#Province li a", function() {
		var aVal = $(this).text();
		$(this).parent().parent().parent().find('.mr_show').text(aVal);
		$(this).parent().parent().parent().find('input[name=cho_Province]').val(aVal);
	
		if($("#oprovince").text() == "请选择企业总部所在省或直辖市") {
			$("#oprovince").removeClass("mr_select");
			$("#ocity").removeClass("mr_select");
		} else {
			$("#oprovince").addClass("mr_select");
			$("#ocity").removeClass("mr_select");
		}
	});
	/*选择城市填充js	*/
	$(document).on("click", "#City li a", function() {
		var aVal = $(this).text();
		$(this).parent().parent().parent().find('.mr_show').text(aVal);
		$(this).parent().parent().parent().find('input[name=cho_City]').val(aVal);
		if($("#ocity").text() == "请选择企业总部所在城市") {
			$("#ocity").removeClass("mr_select");
		} else {
			$("#ocity").addClass("mr_select");
		}
	});
});
//Model模态框打开关闭
function modelOpen() {
	$(".blackcover").fadeIn();
	$(".modelContain").slideDown();
	$("body").addClass("modelOpen");
}

function modelClose() {
	$(".modelContain").slideUp();
	$(".blackcover").fadeOut();
	$("body").removeClass("modelOpen");
}

function exit() {
	$.cookie('orgId', null, {
		path: "/"
	});
	$.cookie('orgAuth', null, {
		path: "/"
	});
	$.cookie('orgEmail', null, {
		path: "/"
	});
	$.cookie('orgName', null, {
		path: "/"
	});
	$.cookie('orgType', null, {
		path: "/"
	});
	location.href = "cmp-settled-log.html"
}

function fillColum(allnum){//填充栏目选项
	var zCount=allnum+3;
	for(var i=3;i<zCount;i++){
		var colum=$('<option value="'+i+'">'+columnType[i].fullName+'</option>')
		$(".form-column").append(colum);
	}
}

function resMgr(oid) {
	$.ajax({
			url: "/ajax/org/" +oid,
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async:"true",
			success: function(data, textState) {
				if(data.success) {
					if(data.data.resMgr) {
						$('a:contains("资源")').parent().show();						
					}
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
}
