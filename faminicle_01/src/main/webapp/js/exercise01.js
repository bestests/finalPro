	var startDate;
	var endDate;
	var startNo;
	var endNo;
 	// Create a DataSet (allows two way data-binding)
	var items = new vis.DataSet([]);
	$(function () {
	 	
		$.getJSON(contextRoot + "/chronicle/list.do?pageNo=&startDate=&endDate=", function (result) {
			console.dir(result);
			var html = "";
			var index = 1;
			for(var i in result.cList) {	
				if(maxNum < result.cList[i].no) maxNum = result.cList[i].no;
				html += "<div class='box'>"
					  + "	<img src='" + result.cList[i].filePath + "' />"
					  + "	<div class='detail' onselectstart='return false;'>"
					  + "		<input type='hidden' value='" + result.cList[i].no + "' />" 	
					  + "		<div class='detailDate'>" + result.cList[i].regDate + "</div>"
					  + "		<div class='detailTitle'>" + result.cList[i].content + "</div>"
					  + "	</div>"
					  + "</div>";
			};
			
			;
			
			for(var j in result.eventDay) {
				if(result.eventDay[j].evEnd == '1000-01-01') {
					items.add({id: result.eventDay[j].evNo, content: result.eventDay[j].evTitle, start: result.eventDay[j].evStart});
				} else {
					items.add({id: result.eventDay[j].evNo, content: result.eventDay[j].evTitle, start: result.eventDay[j].evStart, end: result.eventDay[j].evEnd});
				}
			}
			
			
			startDate = result.cList[0].regDate;
			startNo = maxNum;
			
			endDate = result.cList[result.cList.length - 1].regDate;
			endNo = result.cList[result.cList.length - 1].no;
			
			console.log(startDate);
			console.log(endDate);
			$("#hiddenMemNo").val(result.member.memNo);
			$("#content").append(html);
			maxNum = 0;
			
			console.log("items");
			console.dir(items);
		}).fail(function () {
			alert("로그인 해주세요");
			location.href="main2.html";
			
		});
		
		
		init_masonry();
		
		var menuStatus = false;
		$("#menu").click(function (event) {
			if(!menuStatus) {
				$("#menu").css({
					left: "0%",
					background: "white",
					borderRadius: "0px",
					backgroundImage: "url('../images/c_background.jpg')",
					backgroundSize: "100% 100%",
					backgroundRepeat: "no-repeat"
				});
				$("#toggleBox").show("slow");
				event.stopPropagation();
				menuStatus = true;
				$(".main-3d").hide();
			} 
			event.stopPropagation();
		});
		$("#all").click(function (event) {
			if(menuStatus) {
				$("#menu").css({
					left: "-93%",
					columnWidth: 0,
					background: "aquamarine",
					borderRadius: "0px 2% 2% 0px"
				});
				$("#toggleBox").hide("slow");
				$("#submenuBox").hide("slow");
				menuStatus = false;
				submenuStatus = false;
				$(".main-3d").show();
			}
		});
		var submenuStatus = false;
		$("#toggleBox").click(function (event) {
			if(!submenuStatus) {
				$("#submenuBox").show("slow");
				submenuStatus = true;
			} else {
				$("#submenuBox").hide("slow");
				submenuStatus = false;
			}
			event.stopPropagation();
		});
		
		$("#submenuBox").click(function (event) {
			event.stopPropagation();
		});
		
		$("#content").on("dblclick", ".detail", function () {
			var $check = $(this).parent();
			var src = $(this).prev().attr("src");
			var no = $(this).children("[type='hidden']").val();
			var title = $(this).children("[class='detailTitle']").html();
			var date  = $(this).children("[class='detailDate']").html();
			$("#modalImg").attr("src", src);
			$("#title").val(title);
			$("#date").val(date);
			$("[name='no']").val(no);
			$("#myModal").modal();
		});
		
		var endDateStatus = false;
		$("#eventTypeChk").click(function () {
			$(this).attr("checked", !endDateStatus);
			
			if(endDateStatus) {
				$("#endDateLabel, #endDate").hide();
				$("#endDate").val("");
//				$("#endDate").attr("required", false);
				$("#startDateLavel").html("Date");
			} else {
				$("#endDateLabel, #endDate").show();
				$("#endDate").attr("required", true);
				$("#startDateLavel").html("StartDate");
			}
			endDateStatus = !endDateStatus;
		});
		
		$("#startDate").change(function () {
			$("#endDate").attr("min", $(this).val());
		});
	});
	
	function init_masonry () {
		var $container = $("#content");
		
		$container.imagesLoaded(function () {
			$container.masonry({
				itemSelector: ".box"
			});
		});
	};
	
	var eventTypeChk = function () {
		alert($("#eventTypeChk").val());
	};
	
	var deleteEvent = function (item) {
		items.remove(item.id);
		timeline.fit();
		$.get(
			contextRoot + "/chronicle/deleteEvent.do?evNo=" + item.id,
			function (result) {
				
			}
		);
	};
	
//	타임라인	
	 // DOM element where the Timeline will be attached
	  var container = document.getElementById('visualization');
	
	 
	
	  // Configuration for the Timeline
	  var options = {
			  height: "100%",
			  editable: {
				  add: true,
				  remove: true
			  },
			  onAdd: function () {
				  $("#eventModal").modal();
			  },
			  onRemove: function (item) {
				  deleteEvent(item);
			  }
	  };
	  
	
	  // Create a Timeline
	  var timeline = new vis.Timeline(container, items, options);
	  // 처음 로딩 시 연대기 오늘 날짜로 이동
	  timeline.moveTo(new Date());
	  
	  var z = 8;
	  var addEvent = function () {
			
			items.add({id: z, content: 'test', start: ('2016-03-' + z++)});
//			timeline.fit();
			console.log(items.length);
	  };
		
		
		
	  // 이벤트 선택 시 날짜 데이터
	  timeline.on('select', function (properties) {
		  console.log("start : " + items._data[properties.items[0]].start);
		  console.log("end : " + items._data[properties.items[0]].end);
	  });
	 
	 var currDate = "";
	 var currScroll = 0;
	 $("#visualization").click(function (event) {
		var props = timeline.getEventProperties(event);
		var itemNum = props.item;
		console.dir(props);
		console.log("item : " + props.item);
		currDate = props.time;
		currDate = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
//		timeline.moveTo(currDate);
		$.getJSON(
				
				contextRoot + "/chronicle/list.do?pageNo=&startDate=" + currDate + "&endDate=",
				function (result) {
					var html = "";
					console.dir(result.cList);
					for(var i in result.cList) {	
						if(maxNum < result.cList[i].no) maxNum = result.cList[i].no;
						if(minNum > result.cList[i].no) minNum = result.cList[i].no;
						html += "<div class='box'>"
							  + "	<img src='" + result.cList[i].filePath + "' />"
							  + "	<div class='detail' onselectstart='return false;'>"
							  + "		<div class='detailDate'>" + result.cList[i].regDate + "</div>"
							  + "		<div class='detailTitle'>" + result.cList[i].content + "</div>"
							  + "	</div>"
							  + "</div>";
					};
					
					$("#content").html("");
					$("#content").append(html).masonry("appended", html, true);	        
					$("#content").masonry("reloadItems");	        
					$("#content").masonry("layout");
					
					startDate = result.cList[0].regDate;
					startNo = maxNum;
					
					endDate = result.cList[result.cList.length - 1].regDate;
					endNo = minNum;
					
					console.log(startDate);
					timeline.moveTo(new Date(startDate), {animation: {duration: 1500, easingFunction: 'linear'}});
					
					console.log("startDate : " + startDate);
					console.log("startNo : " + startNo);
					$("#container").scrollTop(0);
					
					maxNum = 0;
					minNum = 999999999999999999999;
				}
			
		);
	 });
	 $("#container").on("mousewheel", function (event) {
		var scrollHeight = $("#container").prop('scrollHeight'); // 컨테이너 전체 height값(스크롤 영역 포함)
		var conHeight = $("#container").height();				 // 컨테이너 전체 height값(스크롤 영역 미포함)	
		var scrollTop = $("#container").scrollTop();			 // 스크롤 위치 값
		var maxHeight = conHeight + scrollTop;					 // 현재 화면상 마지막 위치 값
		
		if(scrollHeight == conHeight + scrollTop) {
			if(event.originalEvent.deltaY > 0) {
				nextList();
			}
		}
		if(scrollTop == 0) {
			if(event.originalEvent.deltaY < 0) {
				prevList();
			}
		}
	 });
	 var maxNum = 0;
	 var minNum = 999999999999999999999;
	 var nextList = function () {
			console.log(endDate);
			$.getJSON(
					contextRoot + "/chronicle/list.do?pageNo=" + endNo + "&startDate=&endDate=" + endDate,
					function (result) {
						if (result.cList.length == 0){
							alert("마지막 페이지 입니다.");
						} else {
							console.log("다음 글 로딩 완료");
							console.dir(result);
							var html = "";
							for(var i in result.cList) {	
								
								if(minNum > result.cList[i].no) minNum = result.cList[i].no;
								
								html += "<div class='box'>"
									  + "	<img src='" + result.cList[i].filePath + "' />"
									  + "	<div class='detail' onselectstart='return false;'>"
									  + "		<div class='detailDate'>" + result.cList[i].regDate + "</div>"
									  + "		<div class='detailTitle'>" + result.cList[i].content + "</div>"
									  + "	</div>"
									  + "</div>";
							};
							
							endDate = result.cList[result.cList.length - 1].regDate;
							endNo = minNum;
							
							
							$("#content").append(html).masonry("appended", html, true);	        
							$("#content").masonry("reloadItems");	        
							$("#content").masonry("layout");
							console.log(endDate);
							timeline.moveTo(new Date(result.cList[0].regDate), {animation: {duration: 1500, easingFunction: 'linear'}});
							minNum = 999999999999999999999;
						}
					}
	 
			);
			
		};
		
		 
		var prevList = function () {
			$.getJSON(
					contextRoot + "/chronicle/list.do?pageNo=" + startNo + "&startDate=" + startDate + "&endDate=",
					function (result) {
						if(result.cList.length == 0) {
								alert("처음 페이지 입니다.");
						} else {
							var html = "";
							console.dir(result.cList);
							for(var i in result.cList) {	
								if(maxNum < result.cList[i].no) maxNum = result.cList[i].no;
								html += "<div class='box'>"
									  + "	<img src='" + result.cList[i].filePath + "' />"
									  + "	<div class='detail' onselectstart='return false;'>"
									  + "		<div class='detailDate'>" + result.cList[i].regDate + "</div>"
									  + "		<div class='detailTitle'>" + result.cList[i].content + "</div>"
									  + "	</div>"
									  + "</div>";
							};
							
							$("#content").prepend(html).masonry("appended", html, true);	        
							$("#content").masonry("reloadItems");	        
							$("#content").masonry("layout");
							
							startDate = result.cList[0].regDate;
							startNo = maxNum;
							
							console.log(startDate);
							timeline.moveTo(new Date(startDate), {animation: {duration: 1500, easingFunction: 'linear'}});
							$("#container").scrollTop(0);
							maxNum = 0;
						}
					}
			);
		};
		$("#eventForm").submit(function () {
			var param = $(this).serialize();
			
			$.post(
				contextRoot + "/chronicle/eventRegist.do",
				param,
				function (result) {
					result = result.eventDay;
					if(result.evEnd == '1000-01-01') {
						items.add({id: result.evNo, content: result.evTitle, start: result.evStart});
					} else {
						items.add({id: result.evNo, content: result.evTitle, start: result.evStart, end: result.evEnd});
					}
					timeline.fit();
					console.dir(items);
					timeline.moveTo(new Date(result.evStart));
				},
				"json"
			);
			
			return false;
		});