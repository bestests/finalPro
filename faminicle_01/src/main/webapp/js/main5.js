$("#loginForm").submit(function(){
		var param = $(this).serialize();
		console.log(param);
		
		//ajax로 아이디와 비밀번호 가져오기
		$.post(
			contextRoot+"/chronicle/login.do",
			{
				id:$("#id").val(),
				pass:$("#pass").val()
			},
			function(resultObj){
				console.log(resultObj);
				console.log("로그인 상태 : "+resultObj.ajaxResult.status);
				
				if(resultObj.ajaxResult.status == "success"){
					alert("로그인 되었습니다. "+resultObj.ajaxResult.data.name+" 님 안녕하세요!")
					location.href="exercise01.html";
				}else{
					console.log("로그인 실패");
					alert("아이디 혹은 비밀번호가 일치하지 않습니다.다시한번 확인해주세요^^");
				}
				    
			},"json");
		return false;
});

