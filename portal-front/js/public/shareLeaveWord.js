(function(window) {
	function ajaxRequist(url, obj, type, fn) {
		$.ajax({
			url:url,
			data: obj,
			dataType: 'json', 
			type: type,
			traditional: true,
			success: function(data) {
				if(data.success) {
					fn(data.data)
				}
			},
			error: function() {
				
			}
		});
	}
	var LeaveWord = function() {
		var self = this;
		self.sid = module.sid;
		self.stype = module.stype;
		self.init();
		self.bindEvent();
		
		self.LwordTotal();
		var str=document.createElement("div");
		str.className="con-kong displayNone";
		var tNode=document.createTextNode("暂无留言")
		str.appendChild(tNode);
		document.getElementsByClassName('commentBlock')[0].parentNode.appendChild(str);
	}

	LeaveWord.prototype.init = function() {
		console.log(JSON.stringify(this))
		var self = this;
		ajaxRequist("/ajax/leavemsg/subject", {
			sid: self.sid,
			stype: self.stype,
			time: 0,
			id: 0,
			rows: 500
		}, "GET", function(data) {
			document.getElementsByClassName('commentBlock')[0].innerHTML = ""
			if(data.length == 0) {
				return;
			}
			document.getElementById("olisten").parentNode.classList.remove("displayNone");
			for(var i = 0; i < data.length; i++) {
				var oText = "",
					reply = "",
					re ='<span class="spanitem plusbtn"><em class="hold-icon icon-zan" data-id="' + data[i].id + '" data-num="' + data[i].agreeCount + '"></em><em style="margin-left:3px;font-size: 14px;display:' + (data[i].agreeCount ? "inline-block" : "none") + '">' + data[i].agreeCount + ' </em></span>'+
						'<span class="spanitem replyLew" data-id="' + data[i].id + '">回复</span>';
				if(data[i].reciver) {
					reply = '<em style="font-style:normal;padding:0 6px;">回复</em>' +  '<span class="h1Font reply2"></span>'
				}
				var baImg = "../images/default-photo.jpg";
				var li = document.createElement("li");
				li.className = "mui-table-view-cell leaveWord";
				li.innerHTML = '<div class="flexCenter mui-clearfix">' +
					'<div class="madiaHead useHead" style="background-image:url(' + baImg + ')" data-id="' + data[i].sender + '"></div>' +
					'<div class="madiaInfo">' +
					'<p class="h2Font"><span class="h1Font replay1"></span>' + reply + '</p>' +
					'</div>' +
					'</div>' +
					'<div class="madiaInfo">' +
					'<p class="h1Font">' + data[i].cnt + '</p>' +
					'<p class="operateSpan">' +
					'<span class="spanitem commenttime">' + commenTime(data[i].createTime) + '</span>' + re + oText +
					'</p>' +
					'</div>'
				document.getElementsByClassName("commentBlock")[0].appendChild(li);
				if(data[i].reciver) {
					self.userInfo(data[i].sender, li, 1);
					self.userInfo(data[i].reciver, li, 2)
				} else {
					self.userInfo(data[i].sender, li, 1);
				}
			}
		})
	}
		
	LeaveWord.prototype.userInfo = function(uId, li, parNum) {
		ajaxRequist("/ajax/professor/editBaseInfo/" + uId, {}, "GET", function($data) {
			if(parNum == 1) {
				if($data.hasHeadImage == 1) {
					li.getElementsByClassName("useHead")[0].style.backgroundImage = "url(/images/head/" + $data.id + "_l.jpg)";
				}
			}
			var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
			var styStr='<em class="authiconNew ' + userType.sty + '" title="'+userType.title+'"></em>'
			if(userType.sty=="e"){
				styStr=""
			}
			var str = '<span class="h1Font" >' + $data.name + '</span>'+styStr
			if(parNum == 1) {
				li.getElementsByClassName("replay1")[0].innerHTML = str;
			} else {
				li.getElementsByClassName("reply2")[0].innerHTML = str;
			}
			if(li.getElementsByClassName("replyLew")[0])
				li.getElementsByClassName("replyLew")[0].setAttribute("name", "回复 " + $data.name + "：");
		})
	}
	LeaveWord.prototype.bindEvent = function() {
		$(".commentBlock").on("click",".useHead",function(){
			var OdataId=this.getAttribute("data-id");
			location.href="p.html?id=" + OdataId;
		})
	}
	LeaveWord.prototype.LwordTotal = function() {
		var self = this;
		ajaxRequist("/ajax/leavemsg/count", {
			sid: self.sid,
			stype: self.stype
		}, "get", function($data) {
			if($data > 0) {
				document.getElementsByClassName("con-kong")[0].classList.add("displayNone");
			}else{
				document.getElementsByClassName("con-kong")[0].classList.remove("displayNone");
			}
		})
	}
	
	var module = {
		lWord: function(sid, stype) {
			this.sid = sid;
			this.stype = stype;
			var lw = new LeaveWord();
			this.init = lw.init;
		}
	}
	window.module = module;
})(window)