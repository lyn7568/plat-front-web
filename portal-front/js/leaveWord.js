(function(window) {
	function ajaxRequist(url, obj, type, fn) {
		$.ajax({
			url:url,
			data: obj,
			dataType: 'json', //服务器返回json格式数据
			type: type, //支持'GET'和'POST'
			traditional: true,
			success: function(data) {
				if(data.success) {
					fn(data.data)
				}
			},
			error: function(xhr, type, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败');
			}
		});
	}
	var LeaveWord = function() {
		var self = this;
		self.sid = module.sid;
		self.stype = module.stype;
		self.init( {
			sid: self.sid,
			stype: self.stype,
			rows: 5
		});
		self.bindEvent();
		self.LwordTotal();
		self.addHtml();
	}

	function lgin() {
		if($.cookie('userid') !="null") {
			return true;
		}
		quickLog();
		operatTab();
		closeLog();
		return false;
	}
	LeaveWord.prototype.addHtml=function() {
		$("body").append('<textarea class="txtArea" id="tt" style="position:absolute;top:0;left:-999px;"></textarea>')
	}
	LeaveWord.prototype.init = function(obj) {
		var id = $.cookie('userid');
		var self = this;
		ajaxRequist("/ajax/leavemsg/subject",obj, "GET", function(data) {
			(data.length>4)?$(".js-load-more").removeClass("displayNone"):$(".js-load-more").addClass("displayNone");
			
			if(!self.id) {
				$(".commentList").html("").append("<div class='con-kong displayNone'>暂无留言</div>");
			}
			if(data.length == 0) {
				return;
			}
			var oUrl=""
			if(location.href.indexOf("shtml")) {
				oUrl="../../../"
			}
			for(var i = 0; i < data.length; i++) {
				var reply="";
				if(data[i].reciver) {
					reply = '<span class="huifu">回复 </span><a href="'+oUrl+'userInforShow.html?professorId='+data[i].reciver+'" class="userhref"><span class="h2Font messageName">张某某</span><em class="authiconNew" title="科袖认证专家"></em></a>'
				}
				var itemlist = '<li class="li-item">';
				itemlist += '<a href="'+oUrl+'userInforShow.html?professorId='+data[i].sender+'" class="userhref"> <div class="madiaHead useHead useHeadMsg"></div></a>';
				itemlist += '<div class="madiaInfo">';
				itemlist += '<p><a href="'+oUrl+'userInforShow.html?professorId='+data[i].sender+'" class="userhref"><span class="h2Font messageName">张某某</span><em class="authiconNew" title="科袖认证专家"></em></a>'+reply+'<span class="commenttime" style="float:right;">'+commenTime(data[i].createTime)+'</span></p>';
				itemlist += '<p class="h2Font messageContent">'+data[i].cnt+'</p>';
				itemlist += '<div class="operateSpan">'
				itemlist += '<span class="dzthumb dzthumbCan"><em class="hold-icon icon-zan"></em><em class="agreeCount" style="margin-left: 6px;">'+data[i].agreeCount+'</em></span>'
				itemlist += '<span class="callBack">回复</span>'
				itemlist += '<span class="messageDel displayNone">删除</span></div>';
				itemlist += '<div class="displayNone replyLeword"><textarea class="txtArea"></textarea><p class="pTxt"><span class="qCancel">取消</span><button class="hReply btnModel" disabled>回复</button></p></div></div></li>';
				$itemlist = $(itemlist);
				$(".commentList").append($itemlist); 
				$itemlist.attr('data-obj',JSON.stringify(data[i]));
				if(id == data[i].sender) {
					$itemlist.find(".dzthumb").removeClass("dzthumbCan");
					$itemlist.find(".messageDel").removeClass("displayNone").end().find(".callBack").hide();
				}
				if(data[i].reciver) {
					self.userInfo(data[i].sender, $itemlist, 0);
					self.userInfo(data[i].reciver, $itemlist, 1)
				} else {
					self.userInfo(data[i].sender, $itemlist, 0);
				}
				if(data[i].agreeCount)
					self.referThup(data[i].id, $itemlist);
			}
			self.time=data[data.length-1].createTime;
			self.id=data[data.length-1].id;
		})
	}
	LeaveWord.prototype.userInfo = function(uId, li, parNum) {
		ajaxRequist("/ajax/professor/editBaseInfo/" + uId, {}, "GET", function($data) {
			if(parNum == 0) {  
				if($data.hasHeadImage == 1) {
					li.find(".useHead")[0].style.backgroundImage = "url(/images/head/" + $data.id + "_l.jpg" + ")";
				}
				li.find("textarea").attr("placeholder","回复  "+$data.name+"：")
			}
			var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
			li.find(".messageName").eq(parNum).html($data.name).end().end().find(".authiconNew").eq(parNum).addClass(userType.sty).attr("title",userType.title);
		})
	}
	LeaveWord.prototype.size = function() {
		if(this.val().length > 200) {
			$.MsgBox.Alert('提示', '留言不得超过200个字');
			return false;
		}
		return true;
	}
	LeaveWord.prototype.topLw = function() {
		var self = this;
		if(!self.size.call($(".msgCont")) ){
			return;
		}
        $.ajax({
            url:"/ajax/leavemsg",
            data: {
                cnt: $(".msgCont").val(),
                refId: self.sid,
                refType: self.stype,
                sender: $.cookie('userid'),
                uname: $.cookie('userName')
			},
            dataType: 'json',
            type: "POST",
            beforeSend: function() {
            	$(".commentList").parent().siblings(".ifLogin").find(" .ifLoginOn input").attr("disabled","true");
            },
            
            traditional: true,
            success: function (data) {
                if (data.success) {
                    $(".msgCont").val("");
                    if (self.id) {
                        delete self.id;
                        delete self.time;
                    }
                    self.init({
                        sid: self.sid,
                        stype: self.stype,
                        rows: 5
                    });
                }
            }
        });
	}
	LeaveWord.prototype.autoGrow=function(){
		document.getElementById("tt").style.width=this.scrollWidth+"px";
		document.getElementById("tt").value=this.value;
		this.style.height=this.scrollHeight+"px";
	}
	LeaveWord.prototype.bindEvent = function() {
		var self = this;
		$("#meSendtt").click(function() {
			if(!lgin()) {
				return;
			}
			self.topLw();
		});
		$(".commentList").on("click", "li", function(e) {
			if(!lgin()) {
				return;
			}
			var obj=JSON.parse($(this).attr("data-obj")),
			target=e.target;
			switch (target.className){
				case "dzthumb dzthumbCan":self.thub.call(target, obj.id,obj.agreeCount);
					break;
				case "callBack":self.LwordBack(target, obj);
					break;
				case "messageDel":self.LwordDel(target, obj.id);
					break;
				case "hReply btnModel":self.replyLword(target,obj.id)
					break;
				case "qCancel": $(target).parent().siblings("textarea").val("").parents(".replyLeword").addClass("displayNone").siblings(".operateSpan").removeClass("displayNone")
					break;
			}
		});
		$(".msgCont").on("input",function(){
			if($.trim($(this).val()).length>0) {
					$("#meSendtt").removeAttr("disabled");
				}else{
					$("#meSendtt").attr("disabled","disabled");
				}
		})
		$(".commentList").on("input", "textarea", function(e) {
				if($.trim($(this).val()).length>0) {
					$(this).siblings().find(".btnModel").removeAttr("disabled");
					self.autoGrow.call(this);
				}else{
					$(this).siblings().find(".btnModel").attr("disabled","disabled");
				}
		})
		$(".js-load-more").click(function(){
			self.init({
				sid: self.sid,
				stype: self.stype,
				time: self.time,
				id: self.id,
				rows: 5
			});
		})
	}
	LeaveWord.prototype.referThup = function(lid, li, num) {
		ajaxRequist("/ajax/leavemsg/agree", { 
			id: lid,
			uid: $.cookie('userid')
		}, "GET", function(data) {
			if(data) {
				li.find(".dzthumbCan").addClass("dzthumbed");
			}
		})
	}
	LeaveWord.prototype.thub = function(lid,num) {
		var self = this;
		ajaxRequist("/ajax/leavemsg/agree", {
			id: lid,
			uid: $.cookie('userid'),
			uname: $.cookie('userName')
		}, "POST", function(data) {
			$(self).addClass('dzthumbed').find(".agreeCount").html(num+1)
		})
	}
	LeaveWord.prototype.replyLword = function( $th,lid) {
		var self = this;
		if(!self.size.call($($th).parents(".pTxt").siblings("textarea")) ){
			return;
		}
		ajaxRequist("/ajax/leavemsg/reply", {
			cnt: $($th).parents(".pTxt").siblings("textarea").val(),
			id: lid,
			uid: $.cookie('userid'),
			uname: $.cookie('userName')
		}, "POST", function(data) {
			$($th).parents(".pTxt").siblings("textarea").val("").parents(".replyLeword").addClass("displayNone").siblings(".operateSpan").removeClass("displayNone")
			if(self.id) {
				delete self.id;
				delete self.time;
			}
			self.init({
				sid: self.sid,
				stype: self.stype,
				rows: 5
			});
			self.LwordTotal();
		})
	}
	LeaveWord.prototype.LwordDel = function($this, lid) {
		var self = this;
		ajaxRequist("/ajax/leavemsg/del", {
			id: lid
		}, "GET", function(data) {
			$($this).parents(".li-item").remove();
			self.LwordTotal();
		})
	}
	LeaveWord.prototype.LwordBack = function($this, lid) {
		$(".replyLeword").each(function(item){
			$(".replyLeword").eq(item).addClass("displayNone").siblings(".operateSpan").removeClass("displayNone");
		})
		$($this).parents(".operateSpan").addClass("displayNone").siblings(".replyLeword").removeClass("displayNone")
	}
	LeaveWord.prototype.LwordTotal = function() {
		var self = this;
		ajaxRequist("/ajax/leavemsg/count", {
			sid: self.sid,
			stype: self.stype
		}, "get", function($data) {
			$(".message").text($data);
			if($data==0) {
				$(".con-kong").removeClass("displayNone")
			}else{
				$(".con-kong").addClass("displayNone");
			}
		})
	}

	var module = {
		lWord: function(sid, stype) {
			this.sid = sid;
			this.stype = stype;
			if(arguments[2]) {
				this.flag=arguments[2]
			}
			var lw = new LeaveWord();
			this.init = lw.init;
		}
	}
	window.module = module;
})(window)