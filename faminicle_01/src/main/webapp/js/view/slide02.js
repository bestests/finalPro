//처음리스트가져오기
var startDate;
var endDate;
var startNo;
var endNo;
var pageNo =1;
var maxNum = 0;
var minNum = 999999999999999999999;
var contentFlag = true;
var controlStatus = true;
var slideShow=false;
var slide;
var mapView=false;

//selete Content
var selectDate;
var selectContent;
var selectNo;
var selectXpoint;
var selectYpoint;
var selectIndex;



//slideEvent
var y_space = 30, z_space = 50;
//controls : 자동재생에 관련된 이전화면, 다음화면 		rotate_controls: 사용자 관점에서보기
var view, lis,z_index;
var prev = $('#controls .prev'), next = $('#controls .next');
var current_index = 1, translate_y = y_space * -1, translate_z = z_space * -1;
var realCurrent_index;
var realFlag=false;
var doubleStopFlag=false;// 다음페이지,이전페이지 중복 방지
//slideEvent
var html="";


getList();


function getList() {
	
	var root = contextRoot + "/chronicle/list.do?";
	if(arguments.length == 0) {
		root += "pageNo=&startDate=&endDate=";
	} else {
		root += "pageNo=" + arguments[0] + "&startDate=" + arguments[1] + "&endDate=" + arguments[2];
	}
	
	maxNum = 0;	
	minNum = 999999999999999999999;
	
	$.getJSON(root,function(result){
		
		if(result.cList.length==0){
			//수정해야함.
			
			swal({   
				title: "<span style='color:#FF0000'> 더이상 데이터가 없습니다!</span>",   
				text: "휠 그만 !!!",
				type:"error",
//				imageUrl: "../images/slide/box.gif",
				timer:1500,
				html:true,
				showConfirmButton: false 
			});
//			alert("더이상 데이터가 없습니다.");
			
			
			doubleStopFlag=false;//더블체크 해제;
			
		}else{
			current_index = 1;
			$("#stack").empty();//기존에 등록된값 삭제	
			
		for(var i=0;i < result.cList.length ; i++){
			if(maxNum < result.cList[i].no) maxNum = result.cList[i].no;
			if(minNum > result.cList[i].no) minNum = result.cList[i].no;
			html +=	
			   '<li id="con_' + result.cList[i].no + '">                                                                                     '
			+'	<div class="imgInfo">                                                          '
			+'		<div class="imgView" id="test">                                                          '
			+'			<img id="'+i+'" src="'+ result.cList[i].filePath+'"/>                                            '
			+'		</div>                                                                             '
			+'	                                                                                       '
			+'		<div class="imgContent" id="pic'+i+'">                                                 '
			+'			<div class="leftContent" >                                                      '
			+'				<p class="imgDate'+i+'">'+ result.cList[i].regDate + '</p>                                        '
			+'				<p class="imgTitle'+i+'">'+ result.cList[i].content +'</p>                                           '
			+'				<input type="hidden" id="mId" value="'+result.cList[i].no+'" />                                                     '
			+'				<input type="hidden" id="xPoint" value=""/>                                                     '
			+'				<input type="hidden" id="yPoint" value="" />                                                     '
			+'				                                                                           '
			+'				<div class="imgIcon">                                                      '
			+'					<button id="update" class="left"><img src="../images/slide/modify.png"/></button>'
			+'					<button id="delete" class="left"><img src="../images/slide/delete.png"/></button>'
			+'					<button id="mapView" class="right"><img src="../images/slide/map.png"/></button>'
			+'				</div>                                                                     '
			+'			</div>                                                                         '
			+'			<div class="imgMap">                                                           '
			+'				<div id="map_canvas'+i+'" class="mapclass"></div>                                                                   '
			+'			</div>                                                                         '
			+'		</div>                                                                             '
			+'		                                                                                   '
			+'	</div>                                                                                 '
			+'</li>																			   ';
			
		}
		$("#stack").append(html);
		//시작 끝 데이터 가져온다(페이징 위해서)
		startDate = result.cList[0].regDate;
		startNo = maxNum;
		
		endDate = result.cList[result.cList.length - 1].regDate;
		endNo = minNum;
		
		$(".calendar").html($(".imgDate"+(current_index-1)).html());
		
		//slide초기값
		view = $('#view'), lis = $('li');
		z_index = lis.length;
		
		doubleStopFlag=false;//더블중복체크 해제
		
		console.log("현재 y : "+translate_y+"현재 x: "+translate_z);
		slideViewEvent();
		if(slideShow==true){
			$("#controls").hide("slow");
			$("#view * li").hide();
			lis.filter(':nth-child(' + (current_index) + ')').show();
			$("#stack li").css("margin-top","-5%");
			$(".imgInfo").css({
				overflow:"visible"
			});
			$(".imgView img").css({
							transform: "scale(1.3)"
							});
		}
		}//end getJson
	})
	.fail(function(){
		swal({   title: "<span style='color:#FF0000'> Login Error!</span>",   
				text: "로그인을 먼저 해주세요. 로그인 페이지로 이동합니다.",   
				imageUrl: "../images/slide/login.png",
				confirmButtonColor:"#DD6B55",
				html:true
			},
			function(){
				location.href="../views/main5.html";
			}
		);
	});
	
	}
		$("#stack").on("click",".imgView",imgDown);
		$("#stack").on("click",".leftContent",imgUp);
		$("body").on("mousewheel", wheelEvent);
		$("#stack").on("click", "#update", updateEvent);
		$("#stack").on("click", "#delete", deleteEvent);
		$("#stack").on("click", "#mapView", mapEvent);
		$("#play").click(slideEvent);
		$("body").dblclick(stopSlide);
		$("#mUpdate").submit(mUpdate);
			

function imgDown(event) {
	
	var $this = $(this).siblings($(".imgContent")).children("div.leftContent");
	
	selectIndex = $(event.target).attr("id");
	selectDate = $this.children(":eq(0)").html();
	selectContent = $this.children(":eq(1)").html();
	selectNo = $this.children(":eq(2)").val();
	selectXpoint = $this.children(":eq(3)").val();
	selectYpoint = $this.children(":eq(4)").val();
	
	console.log(selectDate);
	console.log(selectXpoint);
	console.log(selectNo);
	
	
	if(contentFlag){
		$("#pic"+selectIndex).css({				
			opacity:"1",
			top:"0"
		});		
		
		
		
		contentFlag=false;
	}
}

function imgUp() {
	if(!contentFlag){
		$(".imgContent").css({
			opacity:"0",
			top:"-100%"
		});
		$(".leftContent").css("left","25%");
		contentFlag=true;
		$(".mapclass").hide();
		mapView=false;
	}
}

function wheelEvent() {
	$(".imgContent").css({
		opacity:"0",
		top:"-100%"
	});
	$(".leftContent").css("left","25%");
	contentFlag=true;
	$(".mapclass").hide();
	mapView=false;
}

function updateEvent(event) {
//	var date=$(this).parents()[1].children[0].innerHTML;  
//	var title=$(this).parents()[1].children[1].innerHTML;  
//	var num=$(this).parents()[1].children[2].value;  
	
	$("#myModal").modal();
	
	$("#content").val(selectContent);
	$("#regDate").val(selectDate);
	$("#no").val(selectNo);	
	event.stopPropagation();
}
function mUpdate(){
	var param = $(this).serialize();
	console.dir(param);
	console.log()
	
	var result=false;
	
	swal({   title: "<span style='color:#FF0000'> 수정하시겠습니까? </span>",   
				text: "수정시 사진의 정보가 변경됩니다.",   
				imageUrl: "../images/slide/balls.svg",
				confirmButtonColor:"#DD6B55",
				showCancelButton:true,
				closeOnConfirm:false,
				html:true
			},
	function(inConfirm){
				
				if(inConfirm){
					$.post(
							contextRoot + "/chronicle/update.do",
							param,
							function (resultObj) {	
								var $this = $("[value='"+$("#no").val()+"']");
								
								console.log(resultObj);							
								console.log($("#no").val());
								console.log($("#content").val());
								console.log($("#regDate").val());
								
								$this.parent().children(":eq(0)").html($("#regDate").val());
								$this.parent().children(":eq(1)").html($("#content").val());
								$(".calendar").html($("#regDate").val());		
								
								$("#myModal").modal("hide");
							},"json");
					
					swal({   title: "수정 완료",   
						text: "해당 이미지의 정보가 변경되었습니다.",   
						imageUrl: "../images/slide/success.jpg" });
					
				}
			});
	
	return false;
}


function deleteEvent(event) {
//	var cNo = $(this).parents("[class='leftContent']").children(":eq(2)").val();
//	var result = confirm("정말 삭제하시겠습니까?");
	
	
	swal({   title: "<span style='color:#FF0000'> 삭제 하시겠습니까? </span>",   
		text: "삭제시 사진의 정보가 삭제됩니다.",   
		imageUrl: "../images/slide/balls.svg",
		confirmButtonColor:"#DD6B55",
		showCancelButton:true,
		closeOnConfirm:false,
		html:true
	},
	function(inConfirm){
			
			if(inConfirm){
				$.post(
						contextRoot + "/chronicle/delete.do",
						{no: selectNo},
						function(resultObj){
							console.log(resultObj);
							$("#con_"+selectNo).remove();
							lis=$("li");
							z_index=lis.length;
						},"json"
					);
				
				swal({   title: "삭제 완료",   
					text: "해당 이미지의 정보가 삭제되었습니다.",   
					imageUrl: "../images/slide/success.jpg" });
				
			}
		});
	
	event.stopPropagation();
}

function mapEvent(event){
	
//	var numCk = $(this).parents()[3].children[0].children[0].id;
//	var date = $(this).parents()[1].children[0].innerHTML;
//	var content = $(this).parents()[1].children[1].innerHTML;	
//	
//	var xPoint = $(this).parents()[1].children[3].value;
//	var yPoint = $(this).parents()[1].children[4].value;
	
//	console.log(" x : "+xPoint+" y :"+yPoint);
	
	if(mapView==false){
		$(".leftContent").css("left","0");	
		$(".mapclass").show();
		
//		console.log(selectNo+":"+selectDate+":"+selectContent+":"+selectXpoint+":"+selectYpoint);
//		console.log(numCk+":"+date+":"+content+":"+xPoint+":"+yPoint);
		
		initialize(selectIndex,selectDate,selectContent,selectXpoint,selectYpoint);
		
		
//		initialize(numCk,date,content,xPoint,yPoint);
		
		mapView=true;
	}else{
		$(".leftContent").css("left","25%");
		$(".mapclass").hide();
		mapView=false;
	}
	
	event.stopPropagation();
}

function slideEvent(event) {
	slideShow=true;
	$("#controls").hide("slow");
	$("#view * li").hide();
	lis.filter(':nth-child(' + (current_index) + ')').show();
	
	
	$(".imgContent").hide();	
	
	$("#stack li").css("margin-top","-5%");
	$(".container").css("background","rgba(0,0,0,.7)");
	
	
	$(".imgInfo").css({
		overflow:"visible"
	});
	$(".imgView img").css({
					transform: "scale(1.3)"
					});
	
	controlStatus = false;
	slide = setInterval(showImg, $("#speed").val() * 1000);
	event.stopPropagation();
}

function stopSlide() {
	
	if(slideShow){
		slideShow= false;
		if(!contentFlag){
			$(".imgContent").css({
				opacity:"0",
				top:"-100%"
			});
			contentFlag=true;	
		}		
		
		if (!controlStatus) {
			$("#controls").show("slow");
			$("#view * li").show();
			clearInterval(slide);
			controlStatus = true;
			
			$(".imgView img").css({
						transform: "scale(1)"
						});	
			$(".imgContent").show();	
			$("#stack li").css("margin-top","0");		
	
			$(".imgInfo").css({
				overflow:"hidden"
			});
			
			
			$(".container").removeAttr("style");
		}
	}
}

function showImg(event) {
	next.trigger('click');
}	



//3d효과적용
function slideViewEvent(){

	lis.each(function() {
	this.style['-webkit-transform'] = 'translate3d(0px, '+ translate_y + 'px, ' + translate_z + 'px)';
	this.style['z-index'] = z_index;
	
	$(this).data('translate_y', translate_y);		//스크롤 될때마다 y축 위,아래
	$(this).data('translate_z', translate_z);		//스크롤 될때마다 z축 앞,뒤
	
	z_index--;
	translate_y -= y_space;
	translate_z -= z_space;

});
}

function check_buttons() {
	if(realFlag==true){
	if (realCurrent_index < 1 && doubleStopFlag==false) {
		
		swal({   
			title: "다음 사진을 불러옵니다.",   
			text: "자동으로 닫혀요~.",
			imageUrl: "../images/slide/box.gif",
			timer:1000,
			showConfirmButton: false 
		});
		
//		alert("다음 사진을 불러옵니다.");
		
		y_space = 30,z_space = 50;
		translate_y = y_space * -1;
		translate_z = z_space * -1;
		html="";
		realFlag=false;
		
		doubleStopFlag=true;
		getList(startNo,startDate,"");
		
	} else {
		prev.attr('disabled', false);
	}
	if (realCurrent_index > lis.length && doubleStopFlag == false) {
		
		swal({   
			title: "이전 사진을 불러옵니다.",   
			text: "자동으로 닫혀요~.",
			imageUrl: "../images/slide/box.gif",
			timer:1000,
			showConfirmButton: false 
		});
		
		
//		alert("이전 사진을 불러옵니다.");
		
		y_space = 30,z_space = 50;

		translate_y = y_space * -1;
		translate_z = z_space * -1;
		html="";
		realFlag=false;
		
		
		doubleStopFlag=true;
		getList(endNo,"",endDate);
		
		console.log("버튼체크의 메세지");
	 }else {
		next.attr('disabled', false);
	}
	}
}

next.bind('click', function(event) {
	if(slideShow==true){
		lis.filter(':nth-child(' + (current_index+1) + ')').show();
	}
	if(doubleStopFlag=true){
		doubleStopFlag=false; // 더블 중복효과 초기화
	}
	
	
	if ($(this).attr('disabled'))
	return false;
	console.log("prev현재 index:"+current_index);
	if((current_index+1) > lis.length){
		realCurrent_index= current_index+1;
		realFlag=true;
		check_buttons();
	}else{
		lis.each(function() {
			animate_stack(this, y_space, z_space);
		});
		
		lis.filter(':nth-child(' + current_index + ')').css('top','-200%');//해당되는 자식만 위로 이동하게 설정
		$(".calendar").html($(".imgDate"+current_index).html());//캘린더에 날짜표시
		
		current_index++;
		
		check_buttons();
		
	}
});

prev.bind('click', function() {
	if ($(this).attr('disabled')) 
		return false;
	
	// 현재보다 작을경우 체크확인
	console.log("prev현재 index:"+current_index);
	if((current_index-1) < 1){
		console.log("현제페이지 1보다작다");
		realCurrent_index= current_index-1;
		realFlag=true;
		check_buttons();
	}else{
		console.log("현제페이지 1보다작지않다.");
		lis.each(function() {
		animate_stack(this, -y_space, -z_space);
		});
		
		lis.filter(':nth-child(' + (current_index - 1) + ')').css('top', '30%');
		$(".calendar").html($(".imgDate"+(current_index-2)).html());//날짜표시
		
		current_index--;
		
	}
	
});

//마우스 휠(업,다운)에 대한 이벤트 처리 $("[name=textStr]").trigger("focus"); --> 해당 객체의 이벤트를 발생시키는 명령어
$(document).bind('mousewheel',
	//deltaY 1이면 위로 스크롤 -1이면 아래로 스크롤
	function(event, deltaY) {
	if (deltaY >= 0) {
		console.log("마우스 휠업");
		if(doubleStopFlag==false){
			next.trigger('click');
		}
	} else {
		console.log("마우스 휠 다운")
		if(doubleStopFlag==false){
			prev.trigger('click');
		}
	}
});
//prev:-   next:+
function animate_stack(obj, y, z) {
	
	var new_y = $(obj).data('translate_y') + y;
	var new_z = $(obj).data('translate_z') + z;
	
	
	obj.style['-webkit-transform'] = 'translate3d(0px, ' + new_y
	+ 'px, ' + new_z + 'px)';
	
	$(obj).data('translate_y', new_y)
	.data('translate_z', new_z);

}

//Map Event
function initialize(numCk,date,content,xPoint,yPoint) {
	console.log(typeof xPoint);
	
	if(xPoint==""&&yPoint==""){
		swal({   
			title: "<span style='color:#FF0000'>사진에 위치정보가 없습니다.</span>",   
			text: "Default값을 우선 적용시킵니다.",
			imageUrl: "../images/slide/balls.svg",
			timer:1500,
			html:true,
			showConfirmButton: false 
		});
		
		
//		alert("위치정보 null, Default값 적용");
			xPoint=37.544553;
			yPoint=127.017309;
//			return false;
	}
	
	var markerTitle = "마커 테스트";
	
	var mapOptions = {
			zoom:15,		// 지도의 확대 레벨 : 숫자가 클수록 확대정도가 큼
			center : new google.maps.LatLng(xPoint, yPoint),
			disableDefaultUI : false,
			mapTypeId: google.maps.MapTypeId.ROADMAP ,
			draggable : true
	}
	var map = new google.maps.Map(document.getElementById("map_canvas"+numCk), mapOptions); //div영역에 맵 생성

	var image = "marker.png"; //마커 이미지		
	//여러개 표시할 위치값 배열로 지정
	 var locations = [
//		            	['company 1', 37.5375772, 127.0062798, 2], // 1번 타이틀, 마커 좌표값, 우선순위(z-index)
//		            	['company 3', 37.535412, 127.011081, 2], // 1번 타이틀, 마커 좌표값, 우선순위(z-index)
		            	[content, xPoint, yPoint, 1] // 2번 타이틀, 마커 좌표값, 우선순위(z-index)
   	];		
	setMarkers(map, locations,date,content);
	
	
	
	
	
}

//다중마커사용시 적용
function setMarkers(map, locations,date,content){
	var image = new google.maps.MarkerImage("../images/slide/marker.png", null, null, null, new google.maps.Size(40,40));
	
	for(var i=0; i < locations.length; i++){
		
		var compa = locations[i];
		var myLatLng = new google.maps.LatLng(compa[1], compa[2]);
		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title : compa[0],
			zIndex : compa[3],
			icon:image
		});
	}	
	
	
	var markerMaxWidth	= 300;	//마커클릭했을때 말풍선의 최대크기
	var contentString = 
		"<div>               		"
		+"<h3>"+date+	"</h3>		"
		+"<p>"+content+"</p> 		"
		+"</div>             		";
	
	
	var infowindow = new google.maps.InfoWindow(
			{
				content: contentString,
				maxWidth: markerMaxWidth
			}
	);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map, marker);
	});
	
	
}




