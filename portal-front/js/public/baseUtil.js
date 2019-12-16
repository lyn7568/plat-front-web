

//var wlogurl="http://192.168.3.233:8080"  测试环境
var wlogurl="http://www.ekexiu.com:8082";   // 正式环境
//var platUrl ="http://192.168.3.233:84";  测试环境
var platUrl= "http://xttjpt.cn"             //正式环境




function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	var context = "";
	if(r != null)
		context = r[2];
	reg = null;
	r = null;
	return context == null || context == "" || context == "undefined" ? "" : decodeURI(context);
}

function listConCut(str){//**回答内容过滤html标签**//
	var regTag =/<\/?[a-zA-Z]+[^><]*?>/g;
	var strTo=str.replace(/<img(.*?)>/g, "[图片]").replace(regTag,"")
	return strTo
}
//字符串string转换为数组[]
function strToAry(str){
	var subs = new Array();
	if(str.indexOf(',')) {
		subs = str.split(',');
	} else {
		subs[0] = str;
	}
	return subs
}
//字符串string转换为数组Boolean
function stringToBoolean(str){
	switch(str.toLowerCase()){
		case "true": case "yes": case "1": return true;
		case "false": case "no": case "0": case null: return false;
		default: return Boolean(str);
	}
}
//保留小数
function SplitAndRound(a, n) {
	a = a * Math.pow(10, n);
	return (Math.round(a)) / (Math.pow(10, n));
}

//转换MB、KB、B
function sizeTo(str){
	if(str < 1024){
		return str + ' B';
	}else if(str >= 1024 && str < 1024*1024){
		return SplitAndRound(str/1024,2) + ' KB';
	}else if(str >= 1024*1024 && str < 1024*1024*1024){
		return SplitAndRound(str/1024/1024,2) + ' MB';
	}
}
/*标志*/
function autho() {
	if(arguments[0] == 1) {
		return {
			"sty": "authicon-pro",
			"title": "科袖认证专家"
		}
	} else {
		if(arguments[1] == 1) {
			return {
				"sty": "authicon-staff-ok",
				"title": "企业认证员工"
			}
		} else {
			if(arguments[2] == 3) {
				return {
					"sty": "authicon-real",
					"title": "实名认证用户"
				}
			} else {
				return {
					"sty": "e",
					"title": " "
				}
			}
		}
	}
}
//转换格式
function changeTime(dealtime) {
	var s = dealtime;
	if(dealtime.length == 8) {
		var y = s.substr(0, 4);
		var m = s.substr(4, 2);
		var d = s.substr(6, 2);
		var formatTime = y + "-" + m + "-" + d;
		return formatTime;
	} else {
		var y = s.substr(0, 4);
		var m = s.substr(4, 2);
		var d = s.substr(6, 2);
		var h = s.substr(8, 2);
		var minute = s.substr(10, 2);
		var formatTime = y + "-" + m + "-" + d + " " + h + ":" + minute;
		return formatTime;
	}

}
//时间显示规则
function commenTime(startTime) {
	var nowTimg = new Date();
	var startdate = new Date();
	startdate.setFullYear(parseInt(startTime.substring(0, 4)));
	startdate.setMonth(parseInt(startTime.substring(4, 6)) - 1);
	startdate.setDate(parseInt(startTime.substring(6, 8)));
	startdate.setHours(parseInt(startTime.substring(8, 10)));
	startdate.setMinutes(parseInt(startTime.substring(10, 12)));
	startdate.setSeconds(parseInt(startTime.substring(12, 14)));
	var date3 = nowTimg.getTime() - startdate.getTime(); //时间差的毫秒数
	var hours = parseInt((date3 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = parseInt((date3 % (1000 * 60 * 60)) / (1000 * 60));
	if(date3 < 60000) {
		return "刚刚";
	} else if(date3 >= 60000 && date3 < 3600000) {
		return minutes + "分钟前";
	} else if(date3 >= 3600000 && date3 < 86400000) {
		return hours + "小时前";
	} else if(date3 >= 86400000) {
		if(nowTimg.getFullYear() == startTime.substring(0, 4)) {
			return startTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + startTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + startTime.substring(8, 10) + ":" + startTime.substring(10, 12);
		} else {
			return startTime.substring(0, 4) + "年" + startTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + startTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + startTime.substring(8, 10) + ":" + startTime.substring(10, 12);
		}
	}
}
function TimeTr(dealtime) {
	var myDate = new Date();
	var s = dealtime;
	var y = s.substr(0, 4);
	var m = s.substr(4, 2);
	var d = s.substr(6, 2);
	var h = s.substr(8, 2);
	var minute = s.substr(10, 2);
	var formatTime;
	if(s.length <= 6) {
		formatTime = y + "年" + m.replace(/\b(0+)/gi, "") + "月";
	} else if(s.length > 6 && s.length <= 8) {
		formatTime = m.replace(/\b(0+)/gi, "") + "月" + d.replace(/\b(0+)/gi, "") + "日 ";
		if(y != myDate.getFullYear()) {
			formatTime = y + "年" + m.replace(/\b(0+)/gi, "") + "月" + d.replace(/\b(0+)/gi, "") + "日 ";
		}
	} else {
		formatTime = m.replace(/\b(0+)/gi, "") + "月" + d.replace(/\b(0+)/gi, "") + "日 " + h + ":" + minute;
		if(y != myDate.getFullYear()) {
			formatTime = y + "年" + m.replace(/\b(0+)/gi, "") + "月" + d.replace(/\b(0+)/gi, "") + "日 " + h + ":" + minute;
		}
	}
	return formatTime;
}

var currentdate;
function getNowFormatDate(num) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var getHours = date.getHours();
    var getMinutes = date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (getMinutes >= 0 && getMinutes <= 9) {
        getMinutes = "0" + getMinutes;
    }
     if (getHours >= 0 && getHours <= 9) {
        getHours = "0" + getHours;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + getHours + seperator2 + getMinutes
    if(num==1){
    	currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    }
    return currentdate;
}
function hotKey(sel, num) {
	$(sel).bind({
		paste: function(e) {
			var pastedText;
			if (window.clipboardData  &&  window.clipboardData.getData)  {  // IE
				pastedText  = $(this).val() +  window.clipboardData.getData('Text');          
			}else{            
				pastedText  = $(this).val() +  e.originalEvent.clipboardData.getData('Text'); //e.clipboardData.getData('text/plain');
			}
			$(this).val(pastedText);

			var $this = $(this);
			setTimeout(function() {
				if($this.val().trim()) {
					$this.siblings("button").show();
				} else {
					$this.siblings("button").hide();
				}
			}, 1);
			e.preventDefault();
		},
		cut: function(e) {
			var $this = $(this);
			setTimeout(function() {
				if($this.val().trim()) {
					$this.siblings("button").show();
				} else {
					$this.siblings("button").hide();
				}
			}, 1);
		},
		blur: function() {
			var $this = $(this);
			setTimeout(function() {
				$this.siblings(".keydrop").hide();
			}, 500)
		},
		focus: function() {
			$(this).siblings(".keydrop").show();
		},
		keyup: function(e) {
			 var ti=$(this).val();
			 var $t=this;
			 $t.comr=ti;
			 var $this=$(this);
			if($(this).val().trim()) {
				$(this).siblings("button").show();
				var lNum = $.trim($(this).val()).length;
				if(0 < lNum) {
					setTimeout(function(){
						if( ti===$t.comr && ti!== $t.comrEnd) {
							var tt=ti;
							$t.comrEnd=tt;
					$("#addKeyword").show();
					$.ajax({
						"url": "/ajax/dataDict/qaHotKey",
						"type": "GET",
						"success": function(data) {
							console.log(data);
							if(data.success) {
								if($t.comrEnd==tt) {
									if(data.data.length == 0) {
										$this.siblings(".keydrop").addClass("displayNone");
										$this.siblings(".keydrop").find("ul").html("");
									} else {
										$this.siblings(".keydrop").removeClass("displayNone");
										var oSr = "";
										for(var i = 0; i < Math.min(data.data.length,5); i++) {
											oSr += '<li>' + data.data[i].caption + '<div class="closeThis"></div></li>';
										}
										$this.siblings(".keydrop").find("ul").html(oSr);
									}
								}	
							} else {
								$this.siblings(".keydrop").addClass("displayNone");
								$this.siblings(".keydrop").find("ul").html("");
							}
						},
						"data": {
							"key": $this.val()
						},
						dataType: "json",
						'error': function() {
							$.MsgBox.Alert('提示', '服务器连接超时！');
						}
					});
					}
					},500);
				}
			} else {
				$(this).siblings("button").hide();
				$(this).siblings(".keydrop").addClass("displayNone");
				$(this).siblings(".keydrop").find("ul").html("");
			}
		}
	})
	$(".keydrop").on("click", "li", function() {
		var oValue = $(this).text();
		var oJudge = $(this).parents(".col-w-12").siblings().find("ul.ulspace li");
		var addNum = $(this).parents(".keydrop").siblings("input").attr("data-num");

		for(var i = 0; i < oJudge.length; i++) {
			if(oValue == oJudge[i].innerText) {
				$.MsgBox.Alert('提示', '添加内容不能重复');
				return;
			}
		}
		$(this).parents(".col-w-12").siblings().find("ul.ulspace").append('<li>' + oValue + '<div class="closeThis"></div></li>');
		$(this).parents(".keydrop").siblings("input").val("");
		$(this).parents(".keydrop").siblings("button").hide();
		if(oJudge.length == addNum - 1) {
			$(this).parents(".keydrop").siblings("input").val("");
			$(this).parents(".col-w-12").hide();
		}
		$(this).parent("ul").html("")
	})
	if(num == 1) {
		return;
	} else {
		$(".addButton").siblings("input").keypress(function(){/*添加*/
			var e = event || window.event;
			if(e.keyCode == 13) {
				var oValue = $(this).val().trim();
				var oJudge = $(this).parent().siblings().find("ul.ulspace li");
				var addContent = $(this).attr("data-pro");
				var addNum = $(this).attr("data-num");
				var addfontSizeNum = $(this).attr("data-fontSizeN");
				if(!oValue) {
					$.MsgBox.Alert('提示', '请先填写内容');
					return;
				}
				if(oValue.length > addfontSizeNum) {
					$.MsgBox.Alert('提示', addContent);
					return;
				}
				for(var i = 0; i < oJudge.length; i++) {
					if(oValue == oJudge[i].innerText) {
						$.MsgBox.Alert('提示', '添加内容不能重复');
						return;
					}
				}
				$(this).parent().siblings().find("ul.ulspace").append('<li>' + oValue + '<div class="closeThis"></div></li>');
				$(this).siblings(".addButton").hide();
				$(this).val("");
				if(oJudge.length == addNum - 1) {
					$(this).val("").parents(".col-w-12").hide();
				}
				$(this).siblings(".keydrop").find("ul").html("");
			}
		})
		$(".addButton").click(function() {
			var oValue = $(this).siblings("input").val().trim();
			var oJudge = $(this).parent().siblings().find("ul.ulspace li");
			var addContent = $(this).siblings("input").attr("data-pro");
			var addNum = $(this).siblings("input").attr("data-num");
			var addfontSizeNum = $(this).siblings("input").attr("data-fontSizeN");
			if(!oValue) {
				$.MsgBox.Alert('提示', '请先填写内容');
				return;
			}
			if(oValue.length > addfontSizeNum) {
				$.MsgBox.Alert('提示', addContent);
				return;
			}
			for(var i = 0; i < oJudge.length; i++) {
				if(oValue == oJudge[i].innerText) {
					$.MsgBox.Alert('提示', '添加内容不能重复');
					return;
				}
			}
			$(this).parent().siblings().find("ul.ulspace").append('<li>' + oValue + '<div class="closeThis"></div></li>');
			$(this).hide();
			$(this).siblings("input").val("");
			if(oJudge.length == addNum - 1) {
				$(this).val("").parents(".col-w-12").hide();
			}
			$(this).siblings(".keydrop").find("ul").html("");
		})
	}
}
//带有限制字数的多行文本框
function limitObj(obj,maxNum){
	$(obj).bind({
		paste: function(e) {
			if($(this).val().length==""){
				$(this).parent().siblings(".btnModel").attr("disabled", true);
			}else{
				$(this).parent().siblings(".btnModel").attr("disabled", false);
			}
			var pastedText;
			if (window.clipboardData  &&  window.clipboardData.getData)  {  // IE
				pastedText  = $(this).val() +  window.clipboardData.getData('Text');          
			} 
			else  {            
				pastedText  = $(this).val() +  e.originalEvent.clipboardData.getData('Text'); //e.clipboardData.getData('text/plain');
			}
			$(this).val(pastedText);
			setTimeout(function() {
				$(this).siblings().find("em").text($(obj).val().length);
			}, 1);
			e.preventDefault();
		},
		cut: function(e) {
			if($(this).val().length==""){
				$(this).parent().siblings(".btnModel").attr("disabled", true);
			}else{
				$(this).parent().siblings(".btnModel").attr("disabled", false);
			}
			setTimeout(function() {
				$(obj).siblings().find("em").text($(obj).val().length);
			}, 1);
		},
		focus: function(e) {
			$(obj).parents("li").find(".frmconmsg").show();
			$(obj).siblings().find("em").text($(obj).val().length);
		},
		blur: function(e) {
			$(obj).parents("li").find(".frmconmsg").hide();
		},
		keyup: function(e) {
			if($(this).val().length==""){
				$(this).parent().siblings(".btnModel").attr("disabled", true);
			}else{
				$(this).parent().siblings(".btnModel").attr("disabled", false);
			}
			if($(this).val().length > maxNum) {
				$(obj).val($(obj).val().substring(0, maxNum));
				e.preventDefault();
			}
			setTimeout(function() {
				$(obj).siblings().find("em").text($(obj).val().length);
			}, 1);
		}
	});
}

var r64 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "-", "_"];
var d64 = {
	"0": 0,
	"1": 1,
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9,
	"A": 10,
	"B": 11,
	"C": 12,
	"D": 13,
	"E": 14,
	"F": 15,
	"G": 16,
	"H": 17,
	"I": 18,
	"J": 19,
	"K": 20,
	"L": 21,
	"M": 22,
	"N": 23,
	"O": 24,
	"P": 25,
	"Q": 26,
	"R": 27,
	"S": 28,
	"T": 29,
	"U": 30,
	"V": 31,
	"W": 32,
	"X": 33,
	"Y": 34,
	"Z": 35,
	"a": 36,
	"b": 37,
	"c": 38,
	"d": 39,
	"e": 40,
	"f": 41,
	"g": 42,
	"h": 43,
	"i": 44,
	"j": 45,
	"k": 46,
	"l": 47,
	"m": 48,
	"n": 49,
	"o": 50,
	"p": 51,
	"q": 52,
	"r": 53,
	"s": 54,
	"t": 55,
	"u": 56,
	"v": 57,
	"w": 58,
	"x": 59,
	"y": 60,
	"z": 61,
	"-": 62,
	"_": 63
};
function s16to64(s) {
	var out, idx, n1, n2, n3;
	idx = s.length - 1;
	out = "";
	while(idx >= 0) {
		n1 = d64[s.charAt(idx--)];
		if(idx < 0) {
			out = r64[n1] + out;
			break;
		}
		n2 = d64[s.charAt(idx--)];
		if(idx < 0) {
			out = r64[(n2 >>> 2)] + r64[((n2 & 0x3) << 4) + n1] + out;
			break;
		}
		n3 = d64[s.charAt(idx--)];
		out = r64[(n2 >>> 2) + (n3 << 2)] + r64[((n2 & 0x3) << 4) + n1] + out;
	}
	return out;
}

function s64to16(s) {
	var out, idx, n1, n2;
	idx = s.length - 1;
	out = "";
	while(idx >= 0) {
		n1 = d64[s.charAt(idx--)];
		if(idx < 0) {
			out = r64[n1 >>> 4] + r64[n1 & 0xF] + out;
			break;
		}
		n2 = d64[s.charAt(idx--)];
		out = r64[(n2 >>> 2)] + r64[(n1 >>> 4) + ((n2 & 0x3) << 2)] + r64[n1 & 0xF] + out;
	}
	if(out.length>32) {
		return out.substring(1);
	}
	return out;
}


//根据用户输入的Email跳转到相应的电子邮箱首页  
var hash = {
	'qq.com': 'http://mail.qq.com',
	'gmail.com': 'http://mail.google.com',
	'sina.com': 'http://mail.sina.com.cn',
	'163.com': 'http://mail.163.com',
	'126.com': 'http://mail.126.com',
	'yeah.net': 'http://www.yeah.net/',
	'sohu.com': 'http://mail.sohu.com/',
	'tom.com': 'http://mail.tom.com/',
	'sogou.com': 'http://mail.sogou.com/',
	'139.com': 'http://mail.10086.cn/',
	'hotmail.com': 'http://www.hotmail.com',
	'live.com': 'http://login.live.com/',
	'live.cn': 'http://login.live.cn/',
	'live.com.cn': 'http://login.live.com.cn',
	'189.com': 'http://webmail16.189.cn/webmail/',
	'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
	'yahoo.cn': 'http://mail.cn.yahoo.com/',
	'eyou.com': 'http://www.eyou.com/',
	'21cn.com': 'http://mail.21cn.com/',
	'188.com': 'http://www.188.com/',
	'ustb.edu.cn': 'http://mail.ustb.edu.cn/',
	'foxmail.coom': 'http://www.foxmail.com'
};

//企业规模
var orgSizeShow = {
	'1': '50人以内',
	'2': '50-100人',
	'3': '100-200人',
	'4': '200-500人',
	'5': '500-1000人',
	'6': '1000人以上'
}
//企业类型
var orgTypeShow = {
	"2": "上市企业",
	"3": "外资企业",
	"4": "合资企业",
	"5": "独资企业",
	"6": "个体经营",
	"7": "政府机构",
	"8": "公益组织",
	"9": "协会学会",
	"10": "新闻媒体",
	"11": "教育机构",
	"undefined":""
}
//学位
var eduDegree = {
	"1": "博士",
	"2": "硕士",
	"3": "学士",
	"4": "大专",
	"5": "其他"
}
//栏目
var columnType = {
	"1":{
		fullName:"个人原创",
		shortName:"原创"
	},
	"2":{
		fullName:"企业原创",
		shortName:"原创"
	},
	"3":{
		fullName:"科研",
		shortName:"科研"
	},
	"4":{
		fullName:"智库",
		shortName:"智库"
	},
	"5":{
		fullName:"检测",
		shortName:"检测"
	},
	"6":{
		fullName:"会议",
		shortName:"会议"
	},
	"7":{
		fullName:"企业",
		shortName:"企业"
	},
	"8":{
		fullName:"招聘",
		shortName:"招聘"
	},
	"9":{
		fullName:"新闻",
		shortName:"新闻"
	},
	"10":{
		fullName:"问答",
		shortName:"问答"
	}
}
//需求的费用预算
var demandCost = {
	'1': '1万元以内',
	'2': '1-5万元',
	'3': '5-10万元',
	'4': '10-20万元',
	'5': '20-50万元',
	'6': '50万元以上'
}
//需求的预期时长
var demandDuration = {
	'1': '1个月内',
	'2': '1-3个月',
	'3': '3-6个月',
	'4': '6-12个月',
	'5': '1年以上'
}

function seleCo(obj){//下拉select选择js
	var sleTd=$(obj).val();
	if(sleTd==0){
		$(obj).css("color","#999");	
	}else{
		$(obj).css("color","#666");
	}
}

function leaveMsgCount(id,type, $str) {//查看留言数
	$.ajax({
		"url":"/ajax/leavemsg/count",
		"type": "GET",
		"dataType": "json",
		"data": {
			sid:id,
			stype: type
		},
		"success": function(data) {
			if(data.success) {
				if(data.data > 0) {
					$str.find(".leaveMsgCount").html("留言 " + data.data);
					$str.find(".leaveMsgCount2").html(data.data);
				}
			}
		}
	});
}

function pageUrl(type,datalist) {
	return ("shtml/"+type+"/"+datalist.createTime.substring(0,8)+"/"+datalist.shareId+".html");
}

function wlog(dt, id, src) {
	var src = src || "1";
	var $img=$("<img src='"+wlogurl+"/log/img?__lt="+dt+"&src="+src+"&id="+id+"&_t="+(new Date().getTime())+"' style='display:none;' ></img>");
    $img.appendTo($("body"));
    
    setTimeout(function(){
    	$img.remove();
    },5000);
}

function pageViewLog(id,type){//增加浏览量
	var str = {
	    "1": {//专家
	      url: '/ajax/professor/incPageViews',
	      data: { 'id': id }
	    },
	    "2": {//资源
	      url: '/ajax/resource/pageViews',
	      data: { 'resourceId': id }
	    },
	    "3": {//文章
	      url: '/ajax/article/pageViews',
	      data: { 'articleId': id }
	    },
	    "4": {//专利
	      url: '/ajax/ppatent/incPageViews',
	      data: { 'id': id }
	    },
	    "5": {//论文
	      url: '/ajax/ppaper/incPageViews',
	      data: { 'id': id }
	    },
	    "6": {//企业
	      url: '/ajax/org/incPageViews',
	      data: { 'id': id }
	    },
	    "7":{//需求
	    	url: '/ajax/demand/incPageViews',
	     	data: { 'id': id }
	    },
	    "8":{//问题
	    	url: '/ajax/question/pageViews',
	     	data: { 'qid': id }
	    },
	    "9":{//回答
	    	url: '',
	     	data: {}
	    },
	    "10":{//服务
	    	url: '/ajax/ware/incPageViews',
	     	data: { 'id': id }
	    },
	    "11":{//产品
	    	url: '/ajax/product/incPageViews',
	    	data: {'id': id}
		},
		"12":{//非专利成果
	    	url: '/ajax/resResult/incPageViews',
	    	data: {'id': id}
	    }
	    
	};
	var datastr = str[type].data,
    url = str[type].url;
	$.ajax({
	    url: url,
	    data: datastr,
	    type: "POST",
	    success: function (data) {
	      console.log(data);
	    }
  	});
	
}

//广告相关操作
function addscript(that){
	var script=document.createElement("script");  
	script.setAttribute("type", "text/javascript");  
	var srclink= "https://www.ekexiu.com/data/inc/ad/"+ that +".js?r=" + new Date().getTime();
	script.setAttribute("src", srclink);  
	var heads = document.getElementsByTagName("head");  
	if(heads.length){  
	    heads[0].appendChild(script);  
	}else{
		document.documentElement.appendChild(script);
	}
}
