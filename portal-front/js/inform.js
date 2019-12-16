$(function() {
	$(".onlogin .headnavbtn li.myinform").addClass("navcurrent");
	var obj = {
		rows: 20,
		uid:$.cookie("userid")
	};
	var count = 1;
		informList(obj);
		module.lWord;
		loginStatus();//判断个人是否登录
		$("#feedback").hide();
	function informList(objec) {
		$.ajax({
			url: '/ajax/notify',
			data: objec,
			async: true,
			dataType: 'json', //服务器返回json格式数据
			type: 'GET', //HTTP请求类型
			traditional: true, //传数组必须加这个
			success: function(data) {
				if(data.success) {
					var $info = data.data;
					if($info.length == 0) {
						return;
					}
					readed({
						uid: obj.uid,
						mid: $info[0].id,
						time: $info[0].createTime
					})

					informHtml($info);
					if(data.data.length == obj.rows) {
						obj.time = $info[$info.length - 1].createTime;
						obj.mid = $info[$info.length - 1].id;
						$(".js-load-more").removeClass("displayNone");
					}else{
						$(".js-load-more").addClass("displayNone");
					}

				}

			}
		});
	}

	function informHtml($data) {
		for(var i = 0; i < $data.length; i++) {
			var str = '<li class="list-qa">' +
				'<div class="madiaInfo">' +
				'<div class="flexCenter qa-owner">' +
				'<div class="owner-head useHead" style="cursor:pointer"></div>' +
				'<div class="owner-info reWidth">' +
				'<div class="owner-tit h2Font cnt" style="cursor:pointer">' + $data[i].cnt + '</div></div>' +
				'<div class="creTime">' + commenTime($data[i].createTime) + '</div></div></div></li>'
			var $str = $(str);
			$str.data("obj", $data[i]);
			$("#curAnswers").append($str);
			uinfo($str, $data[i].uid)
		}
	}

	function uinfo(li, uid) {
		$.ajax({
			url:"/ajax/professor/editBaseInfo/" + uid, 
			async: true,
			dataType: 'json', //服务器返回json格式数据
			type: 'GET', //HTTP请求类型
			traditional: true, //传数组必须加这个
			success: function(data) {
				if(data.success) {
					var $data = data.data;
					if($data.hasHeadImage == 1) {
						li.find(".useHead").css('background-image', "url(/images/head/" + $data.id + "_l.jpg");
					}
				}
			}
		});
	}

	function readed(objec) {
		$.ajax({
			url: '/ajax/notify/readed',
			data: objec,
			async: true,
			dataType: 'json', //服务器返回json格式数据
			type: 'POST', //HTTP请求类型
			traditional: true, //传数组必须加这个
			success: function(data) {
				if(data.success) {
					$(".myinform").eq(0).find(".badge").text("")
				}

			}
		});
	}
	$("#curAnswers").on("click", ".cnt", function() {
		var dobj = $(this).parents("li").data("obj");
		var our = "";
		if(dobj.opType == 0) {
			ourl = "userInforShow.html?professorId=" + dobj.uid;
		} else if(dobj.opType == 1) {
			ourl = 'userInforShow.html?professorId=' + dobj.pid + '&flag='+encodeURI(dobj.cnt.substring(dobj.cnt.indexOf(">") + 1, dobj.cnt.lastIndexOf("<")));
		} else if(dobj.opType == 2) {
			$.ajax({
				url: "/ajax/article/query?articleId="+dobj.pid
			}).done(function(data) {
				if(data.success) {
					window.open("shtml/a/"+data.data.createTime.substr(0,8)+"/"+data.data.shareId+".html");
				}
			});
		} else if(dobj.opType == 3 || dobj.opType == 4 ) {
			var arr=dobj.pid.split(":")
			ourl = "qa-show.html?id=" + arr[1]+"&topid="+arr[0];
		}else if(dobj.opType == 5){
			ourl = "qa-show.html?id=" + dobj.pid;
		} else if(dobj.opType == 6) {
			$.ajax({
				url: "ajax/ppatent/qo?id="+dobj.pid
			}).done(function(data) {
				if(data.success) {
					window.open("shtml/pt/"+data.data.createTime.substr(0,8)+"/"+data.data.shareId+".html");
				}
			});
		} else if(dobj.opType == 7) {
			$.ajax({
				url: "ajax/ppaper/qo?id="+dobj.pid
			}).done(function(data) {
				if(data.success) {
					window.open("shtml/pp/"+data.data.createTime.substr(0,8)+"/"+data.data.shareId+".html");
				}
			});
		} else {
			module.lWord.init({id:dobj.pid});
			$(".blackcover").removeClass("displayNone");
			return;
		}
		if(dobj.opType == 2 || dobj.opType == 6 || dobj.opType == 7)
			return;
		window.open(ourl);
	})
	$("#curAnswers").on("click", ".useHead", function() {
		var dobj = $(this).parents("li").data("obj");
		window.open("userInforShow.html?professorId=" + dobj.uid);
		return false;
	})
	$(".js-load-more").click(function(){
		informList(obj);
	})
})
