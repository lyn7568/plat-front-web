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
		$info.id = userid;
		$info.author = userName;
		$info.pageSize=10;
		if(paperNameVa !="") {
			$info.name=paperNameVa;
		}
		$info.pageNo=n;
		$.ajax({
			"url": "/ajax/ppaper/byAuthor",
			"type": "GET",
			"success": function(data) {
				if(data.success) {
					console.log(data);
					$(".importUl").html("");
					if(num==1) {
						if(data.data.data.length==0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("没有需要导入的论文");
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
					paperHtml(data.data.data);
					
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
			"data": $info,
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	 getPaperMe(1,true,1);
function paperHtml($data) {
	console.log($data);
 	for(var i = 0; i < $data.length; i++) {
 		var oAuthors="";
 		if($data[i].authors) {
 			oAuthors="作者："+$data[i].authors;
 		}
 		var moreInf=""
		if(!$data[i].cn4periodical){
			$data[i].cn4periodical="";
		}
		if(!$data[i].en4periodical){
			$data[i].en4periodical="";
		}
		if(!$data[i].pubDay){
			$data[i].pubDay="";
		}
		moreInf = "期刊：" + $data[i].cn4periodical+ " " +$data[i].en4periodical+ " " +$data[i].pubDay;
 		var oName1=$data[i].name;
 		var oId=$data[i].id;
 		
		var oT,oText,cs;
		if($data[i].professorId.substring(0,1)!="#") {
			oT="importSpan-3";
			oText="已导入";
			cs="auto";
		}else{
			oT="importSpan-1";
			oText="导入";
			cs="pointer";
		}
		var oString = '<li>' +
		'<a class="flexCenter">' +
		'<div class="madiaHead paperHead"></div>' +
		'<div class="madiaInfo">' +
		'<p class="h1Font ellipsisSty">'+oName1+'</p>' +
		'<p class="h2Font ellipsisSty">'+oAuthors+'</p>' +
		'<p class="h2Font ellipsisSty">'+moreInf+'</p>' +
		'</div>' +
		'</a>' +
		'<div class="importBtn">' +
		'<span class="importResource '+oT+'" data-id="'+oId+'" flag="1" style="cursor:'+cs+'">'+oText+'</span>' +
		/*'<span class="importSpan-2">再次导入</span>' +
		'<span class="importSpan-3">已导入</span>' +*/
		'</div>' +
		'</li>'
		$(".importUl").append(oString);
 	}
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

	/*导入论文*/
	$(".importUl").on("click",".importResource",function(){
		var oF=$(this).attr("flag");
		if(oF!=1) return;
		var $this=$(this);
		$.ajax({
			"url": "/ajax/ppaper/ass",
			"type": "POST",
			"success": function(data) {
				if(data.success) {
					if(data.data){
						$this.text("导入成功").addClass("importSpan-3").removeClass("importSpan-1").removeClass("importSpan-2").attr("flag","2").css("cursor","auto");
					}
				}
					
			},
			"data": {
				id:$(this).attr("data-id"),
				uid:userid,
				author: userName
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	});

})
