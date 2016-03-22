//처음리스트가져오기
var startDate;
var endDate;
var startNo;
var endNo;
var maxNum = 0;
var minNum = 999999999999999999999;
var contentFlag = true;
var controlStatus = true;
var slideShow=false;
var slide;
var mapView=false;

//slideEvent
var y_space = 30, z_space = 50;
//controls : 자동재생에 관련된 이전화면, 다음화면 		rotate_controls: 사용자 관점에서보기
var view, lis,z_index;
var prev = $('#controls .prev'), next = $('#controls .next');
var current_index = 1, translate_y = y_space * -1, translate_z = z_space * -1;
//slideEvent
var html="";


getList();


function getList() {
	console.log("버튼체크의 메세지2");
	var root = contextRoot + "/chronicle/list.do?";
	console.log(arguments);
	if(arguments.length == 0) {
		root += "pageNo=&startDate=&endDate=";
	} else {
		root += "pageNo=" + arguments[0] + "&startDate=" + arguments[1] + "&endDate=" + arguments[2];
	}
	console.log(root);
	
	maxNum = 0;	
	minNum = 999999999999999999999;
	
	$.getJSON(root,function(result){
		
		console.log(result);
		console.log("okok");
		if(result.cList.length==0){
			//수정해야함.
			alert("더이상 데이터가 없습니다.");
//			next.trigger('click');
			
		}else{
			current_index = 1;
			$("#stack").empty();//기존에 등록된값 삭제	
			
		for(var i=0;i < result.cList.length ; i++){
			if(maxNum < result.cList[i].no) maxNum = result.cList[i].no;
			if(minNum > result.cList[i].no) minNum = result.cList[i].no;
// 			if(arguments.length != 0) {
// 			}
			html +=	
			   '<li>                                                                                     '
			+'	<div class="imgInfo">                                                          '
			+'		<div class="imgView" id="test">                                                          '
			+'			<img id="'+i+'" src="'+ result.cList[i].filePath+'"/>                                            '
			+'		</div>                                                                             '
			+'	                                                                                       '
			+'		<div class="imgContent" id="pic'+i+'">                                                 '
			+'			<div class="leftContent" >                                                      '
			+'				                                                      '
			+'				<p class="imgDate'+i+'">'+ result.cList[i].regDate + '</p>                                          '
			+'				<p class="imgTitle'+i+'">'+ result.cList[i].content +'</p>                                           '
			+'				                                                                           '
			+'				<div class="imgIcon">                                                      '
			+'					<button id="update" class="left"><img src="../images/slide/modify.png"/></button>'
			+'					<button id="delete" class="left"><img src="../images/slide/delete.png"/></button>'
			+'					<button id="mapView" class="right"><img src="../images/slide/map.png"/></button>'
			+'				</div>                                                                     '
			+'			</div>                                                                         '
			+'			<div class="imgMap">                                                           '
			+'			<iframe></iframe>                                                           '
			+'			<div id="loading"><img src="../images/slide/balls.svg"/><br/>Loading... </div>                                                           '
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
		
// 		if(arguments.length != 0) {
// 			endNo = minNum;
// 			minNum = 999999999999999999999;
// 		} else {
// 			endNo = result.cList[result.cList.length - 1].no;		
// 		}
		
//		console.log("시작일자"+ startDate);
//		console.log("끝날자 " + endDate);
//		console.log("시작번호"+startNo);
//		console.log("끝번호"+endNo);
//		console.log("길이" + lis.length);
//		console.log("최대: " + maxNum + "최소 : "+ minNum);
//		console.log(view);
// 		console.log(lis);
		console.log("현재페이지:"+current_index);
		slideViewEvent();
		}//end getJson
	})
	.fail(function(){
		alert("로그인을 먼저 해주시기 바랍니다. 로그인 페이지로 이동합니다.");
		location.href="../views/main2.html";
	
	});
	
	}
		console.log("이벤트 활성");
// 		$("div.imgView").click(imgDown);
		$("#stack").on("click",".imgView",imgDown);
// 		$("div.imgContent").click(imgUp);
		$("#stack").on("click",".imgContent",imgUp);
		$("body").on("mousewheel", wheelEvent);
		$("#stack").on("click", "#update", updateEvent);
		$("#stack").on("click", "#delete", deleteEvent);
		$("#stack").on("click", "#mapView", mapEvent);
		$("#play").click(slideEvent);
		$("body").dblclick(stopSlide);

			

function imgDown(event) {
// 	var $target = $(event.target).attr('id');
// 	console.log("타겟 : "+$target);
	var numCk = $(event.target).attr("id");
	console.log(numCk);
	console.log($(".imgContent").attr("id"));
	
	if(contentFlag){
		$("#pic"+numCk).css({				
			opacity:"1",
			top:"0"
		});		
//		$(".imgMap").append('<iframe id="sildemap" src="Sildemap.html"></iframe>');
		
		contentFlag=false;
	}
}

function imgUp() {
	if(!contentFlag){
		$(".imgContent").css({
			opacity:"0",
			top:"-100%"
		});
		contentFlag=true;	
	}
}

function wheelEvent() {
	$(".imgContent").css({
		opacity:"0",
		top:"-100%"
	});
	contentFlag=true;
}

function updateEvent(event) {
	console.log($(this));
	
	event.stopPropagation();
	$("#myModal").modal();
	
	$("#mtitle").html("<input type='text' value='ab' style='width:100%;'/>");
	$("#mdate").val("2011-01-01");
	
}

function deleteEvent(event) {
	var result = confirm("정말 삭제하시겠습니까?");
	alert(result);
	event.stopPropagation();
}

function mapEvent(event){
	if(mapView==false){
		$(".leftContent").css("left","0");		
		$("#loading").show();
		$("iframe").show();
//		$(".imgMap").append('<iframe id="sildemap" src="Sildemap.html"></iframe>');
		$("iframe").attr({
			id:'slidemap',
			src:"Sildemap.html"
		});
		//임시
		$('iframe').load(function() {
		    $('#loading').hide();
		});	
		mapView=true;
	}else{
		$(".leftContent").css("left","25%");
		$(".imgMap [id='loading']").hide();
		$("iframe").css("display","none");
		mapView=false;
	}
	
	event.stopPropagation();
}

function slideEvent(event) {
	slideShow=true;
	console.log(current_index);
	$("#controls").hide("slow");
	//재생버튼과 다른각도에서보기 버튼 숨김적용
	$("#view * li").hide();
	console.log(current_index);
	lis.filter(':nth-child(' + (current_index) + ')').show();
	
	//자동재생시 이미지 크기 크게
	
	$(".imgContent").hide();	
	
	$("#stack li").css("margin-top","-10%");
	$(".container").css("background","rgba(0,0,0,.7)");
	//filter: alpha(opacity=50);
//	style="background:rgba(0,0,0,0.5); "
	
	
	//slide 시 hidden 짜르기를 취소
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
	slideShow= false;
	//content 내려왔을때 닫게만든다.
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

		// imgContent 화면 숨기게
		$(".imgInfo").css({
			overflow:"hidden"
		});
		
		
		$(".container").removeAttr("style");
	}
}

function showImg(event) {
	next.trigger('click');
//		event.stopPropagation();
}	



//3d효과적용
function slideViewEvent(){

	console.log("li갯수 : "+lis.length);
	lis.each(function() {
	this.style['-webkit-transform'] = 'translate3d(0px, '+ translate_y + 'px, ' + translate_z + 'px)';
// 	console.log("변경전"+translate_y+":"+translate_z);
	this.style['z-index'] = z_index;
	
	$(this).data('translate_y', translate_y);		//스크롤 될때마다 y축 위,아래
	$(this).data('translate_z', translate_z);		//스크롤 될때마다 z축 앞,뒤
// 	console.log("변경후"+translate_y+":"+translate_z);
	
	z_index--;
	translate_y -= y_space;
	translate_z -= z_space;

});
}

function check_buttons() {
	// 현재페이지 1일때 이전(앞) 버튼 비활성화 
	if (current_index < 1) {
//		alert("좀더 미래로 갑니다!.||  첫페이지 번호"+startNo+"|| 첫 일자 :"+startDate);
		alert("다음 사진을 불러옵니다.");
		y_space = 30,z_space = 50;
		translate_y = y_space * -1;
		translate_z = z_space * -1;
		html="";
		getList(startNo,startDate,"");
		console.log("버튼체크의 메세지");
//			next.attr('disabled', true);
		
//			prev.attr('disabled', true);
	} else {
		prev.attr('disabled', false);
	}
	// ************* 현재페이지 최대일때 다음(뒤) 버튼 비활성화
	if (current_index > lis.length) {
//		alert("좀더 과거로 갑니다!.||  끝페이지 : "+lis.length +"끝페이지 번호"+endNo+"|| 마지막 일자 :"+endDate);
		alert("이전 사진을 불러옵니다.");
		console.log(endNo+":"+startDate+""+endDate);
		
		y_space = 30,z_space = 50;

		translate_y = y_space * -1;
		translate_z = z_space * -1;
		html="";
		getList(endNo,"",endDate);
		
		console.log("버튼체크의 메세지");
//			next.attr('disabled', true);


	 }else {
		next.attr('disabled', false);
	}
}



	//next이란 요소에 click라는 이벤트를 연결시킬수있다 (bind)
next.bind('click', function(event) {
	if(slideShow==true){
		lis.filter(':nth-child(' + (current_index+1) + ')').show();
	}
	
	
	console.log("최종길이"+lis.length);
	if ($(this).attr('disabled'))
	return false;
	console.log("next현재 index :"+current_index);
	// 현재보다 클경우 체크확인
	if((current_index+1) > lis.length){
		current_index++;
		check_buttons();
	}else{
		lis.each(function() {
			animate_stack(this, y_space, z_space);
		});
		
		lis.filter(':nth-child(' + current_index + ')').css('top','-200%');//해당되는 자식만 위로 이동하게 설정
		$(".calendar").html($(".imgDate"+current_index).html());//캘린더에 날짜표시
		
		current_index++;
		
//		lis.filter(':nth-child(' + current_index + ')').show();
		check_buttons();
		
	}
});

prev.bind('click', function() {
	if ($(this).attr('disabled'))
	return false;
	
	// 현재보다 작을경우 체크확인
	console.log("prev현재 index:"+current_index);
	if((current_index-1) < 1){
		current_index--;
		check_buttons();
	}else{
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
	//console.log(event);
	if (deltaY >= 0) {
		next.trigger('click');
	} else {
		prev.trigger('click');
	}
});
//prev:-   next:+
function animate_stack(obj, y, z) {
	//console.log(obj);
	console.log("y: "+y+"//z :"+z);
	
	var new_y = $(obj).data('translate_y') + y;
	var new_z = $(obj).data('translate_z') + z;
	
	obj.style['-webkit-transform'] = 'translate3d(0px, ' + new_y
	+ 'px, ' + new_z + 'px)';
	
	$(obj).data('translate_y', new_y)
	.data('translate_z', new_z);

}
