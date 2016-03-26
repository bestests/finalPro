	var startDate;
	var endDate;
	var startNo;
	var endNo;
 	// Create a DataSet (allows two way data-binding)
	var items = new vis.DataSet([]);
	$(function () {
	 	var html = "";
		$.getJSON(contextRoot + "/chronicle/list.do?pageNo=&startDate=&endDate=", function (result) {
			console.dir(result);
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
			$("#infoId").html(result.member.name + " 님");
			$("<input type='hidden' id='hiddenId'>").val(result.member.id).appendTo(".modal-body");	
			console.log(result.member.memPicPath);
			if (result.member.memPicPath) {
				$("#infoModalImg").attr("src", result.member.memPicPath);
				$("#thumbnail").attr("src",result.member.picMiniFilePath);
			}
			$("#content").append(html);
			maxNum = 0;
			
			console.log("items");
			console.dir(items);
		}).fail(function () {
			alert("로그인 해주세요");
			location.href="main5.html";
			
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
				
				// info 메뉴 ** 추가
				$("#header").css({
					top: "-10%"
					});
				
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
				// info 메뉴 ** 추가
				$("#header").css({
					top: "0%",
					"z-index": "1000"
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
		
		/* 파일 업로드 */
		$("#modalImgDrop").click(function (){
			$("#file").click();
		})
		
		
		/* info modal */
		$("#infoId").on("click" , function (event) {
			event.stopPropagation();
			/* 비밀번호 초기화 작업 */ 
			$("#passchk").val("");
			$("#pass").val("");
			$("#pass2").val("");
			
			$("#infoModal").modal();
			$("#pass, #pass2, [name='eMail'], #tel").attr("readonly", true);
						$.post(
				contextRoot + "/chronicle/selectInfo.do",
				{id : $("#hiddenId").val()},
				function(result) {
					var info = result.ajaxResult.data;
					$("[name=eMail]").val(info.eMail);
					$("#tel").val(info.tel);
					$("#hidden").val($("#hiddenId").val());
				} , "json"
			)
		})
		
		/* 비밀번호 체크 */
		$("#passchk").keyup(function () {
			var $this = $(this);
			console.log($("#hiddenId").val());
			$.getJSON(
				contextRoot + "/chronicle/checkPass.do",
				{
					id: $("#hiddenId").val(),
					check: $("#passchk").val()
				},
				function (result) {
					if(result.ajaxResult.data) {	
						$this.prev().html("현재 비밀번호 (비밀번호가 일치합니다.)");
						$("#pass, #pass2, [name='eMail'], #tel").attr("readonly", false);
					} else {
						$this.prev().html("현재 비밀번호 (비밀번호가 일치하지않습니다.)");
						$("#pass, #pass2, [name='eMail'], #tel").attr("readonly", true);
					}
				}
			);
		});
		
		/* update */
		$("#updatebt").click(function () {
			
			if($("#pass").val()) {
				var regPass = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
				if( !regPass.test($("#pass").val())){
					alert("비밀번호는 특수문자와 숫자를 포함하여 8~16자로 설정하여야합니다.");
					return false;
				}
				
				if($("#pass").val() != $("#pass2").val()){
					alert("비밀번호가 일치하지 않습니다. 다시한번 확인해주세요");
					$("#pass2").focus();
					
					return false;
				}
			} else {
				$("#pass").val($("#passchk").val());
				$("#pass2").val($("#passchk").val());
			}
			
			var regTel = /^\d{10,11}$/;
			if( !regTel.test($("#tel").val())){
				alert("연락처는 -없이 숫자(10~11자리)만 입력 가능합니다");
				return false;
			}
			
			$.post(
				contextRoot + "/chronicle/updateMember.do",
				{
					pass: $("#pass").val(),
					eMail: $("[name='eMail']").val(),
					tel: $("#tel").val(),
					id: $("#hidden").val()
				},
				function (resultObj) {
					alert("수정이 완료되었습니다");
					$("#passchk").val("");
					$("#pass").val("");
					$("#pass2").val("");
					$("#infoModal").modal('hide');
				}, "json");
			return false;
		})
		
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
		  $.get(
			contextRoot + "/chronicle/eventList.do?evStart=" + items._data[properties.items[0]].start + "&evEnd=" + items._data[properties.items[0]].end,
			function (result) {
				
			}
		  );
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
		
		//스크롤 내릴때 #header 내려옴 // info 메뉴 ** 추가
		if(event.originalEvent.deltaY > 0) $("#header").css({"top": "0%", "z-index": "1001"});
		//스크롤 올릴때 #header 올라감 // info 메뉴 ** 추가
		if(event.originalEvent.deltaY < 0) $("#header").css({"top": "-10%", "z-index":"1000"});
		
		
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
		
		$("#updateCon").submit(function () {
			alert($(this).serialize());
			
			return false;
		});
		
		var upload = document.getElementById('file'),
		holder = document.getElementById('modalImgDrop')

		upload.onchange = function (e) {
			e.preventDefault();
	
			var file = upload.files[0],
		    reader = new FileReader();
			
			
			reader.onload = function (event) {
				var img = new Image();
				img.src = event.target.result;
				holder.innerHTML = '';
				holder.appendChild(img);
				
				updateMemberPic(file);
			};
			reader.readAsDataURL(file);
			return false;
		};	 
		
	 /* update image!! */
		function updateMemberPic() {
		 var form = $("#update");
		 console.dir(form);
		 
		 $('#update').prop('target', 'upload_target');
         $('#update').prop('action', contextRoot + '/chronicle/updateMemberPic.do');
         $('#update').submit();          

// 		 var formData = new FormData(form); 
// 		 console.dir(formData);
// 			$.ajax({
// 				url: contextRoot + "/chronicle/updateMemberPic.do",
// 				processData: false,
// 				contentType: false,
// 				data: formData,
// 				type: 'POST',
// 				success: function(data) {
// 					alert(1);
// 				}, dataType: 'json' 
// 			});
		}
		
		/* 업로드 파일 미리보기 */
	$.fn.setPreview = function(opt){
    "use strict"
    var defaultOpt = {
        inputFile: $(this),
        img: null,
        w: 200,
        h: 200
    };
    $.extend(defaultOpt, opt);
 
    var previewImage = function(){
        if (!defaultOpt.inputFile || !defaultOpt.img) return;
 
        var inputFile = defaultOpt.inputFile.get(0);
        var img       = defaultOpt.img.get(0);
 
        // FileReader
        if (window.FileReader) {
            // image 파일만
            if (!inputFile.files[0].type.match(/image\//)) return;
 
            // preview
            try {
                var reader = new FileReader();
                reader.onload = function(e){
                    img.src = e.target.result;
                    img.style.width  = defaultOpt.w+'px';
                    img.style.height = defaultOpt.h+'px';
                    img.style.display = '';
                }
                reader.readAsDataURL(inputFile.files[0]);
            } catch (e) {
                // exception...
            }
        // img.filters (MSIE)
        } else if (img.filters) {
            inputFile.select();
            inputFile.blur();
            var imgSrc = document.selection.createRange().text;
 
            img.style.width  = defaultOpt.w+'px';
            img.style.height = defaultOpt.h+'px';
            img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\""+imgSrc+"\")";            
            img.style.display = '';
        // no support
        } else {
            // Safari5, ...
        }
    };
	 
	    // onchange
	    $(this).change(function(){
	        previewImage();
	    });
	};
		 
	 
	$(document).ready(function(){
	    var opt = {
	        img: $('#update'),
	        w: 200,
	        h: 200
	    };
	 
	    $('#update').setPreview(opt);
	});
			
	 
	 /* info drag 사진 등록 */
		var dropBox = document.getElementById("modalImgDrop");          
		var dropImage = document.getElementById("infoModalImg");   
		          
		function onDragEnter(event){    
		        event.preventDefault();   
			 }    
 	function onDragOver(event){
		      event.preventDefault();      
		    }                  
		function onDrop(event){     
			console.log(event.file);
		    var file = event.dataTransfer.files[0];      
		           
		    var imageType = /image.*/;
		    var textType = /text.*/;
		    var isImage;
	        updateMemberPic(event.file);
	        
		    if(file.type.match(imageType)){
		      isImage = true; 
		    }
		    else if(file.type.match(textType)){
		      isImage = false;
		    } 
		             
		    var reader = new FileReader();    
		    
		    reader.onload = (function(File){return function(e) {         
		        var result = e.target.result;  
		        if(isImage){
		          dropImage.src = result;                                                                            
		          dropBox.appendChild(dropImage)
		         }
		         else{
		           dropBox.innerHTML = result;
		         }        
		        };
		      })(file);
		      
		    if(isImage){ reader.readAsDataURL(file); }
		    else { reader.readAsText(file,"UTF-8"); }
		    
		    event.stopPropagation();
		    event.preventDefault(); 
		  }                      
		  
		  dropImage.addEventListener("load", function(e) {
			 // $("dropImage > img").css({ width: "200px" , height: "auto"}); 
		  }, true);          
			  	
		  /* thumbnail */ 
				  
		  var thumbFfile = document.querySelector('#infoModalImg');
			
		  thumbFfile.onchange = function () {
			    var thumbFfileList = file.files ;
			
			    // 읽기
			    var reader = new FileReader();
			    reader.readAsDataURL(fileList [0]);
			
			    //로드 한 후
			    reader.onload = function  () {
			        //로컬 이미지를 보여주기
			        document.querySelector("#modalImgDrop").src = reader.result;
			/*
			        //썸네일 이미지 생성
			        var tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
			        tempImage.src = reader.result; //data-uri를 이미지 객체에 주입
			        tempImage.onload = function () {
			            //리사이즈를 위해 캔버스 객체 생성
			            var canvas = document.createElement("canvas");
			            var canvasContext = canvas.getContext("2d");
			
			            //캔버스 크기 설정
			            canvas.width = 50; //가로 100px
			            canvas.height = 50; //세로 100px
			
			            //이미지를 캔버스에 그리기
			            canvasContext.drawImage(this, 0, 0, 50, 50);
			
			            //캔버스에 그린 이미지를 다시 data-uri 형태로 변환
			            var dataURI = canvas.toDataURL("image/jpeg");
			
			            //썸네일 이미지 보여주기
			            document.querySelector("#thumbnail").src = dataURI;
			      
			        };
		  */
			    };
			};
		
		