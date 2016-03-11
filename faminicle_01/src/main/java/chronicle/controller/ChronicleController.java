package chronicle.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import chronicle.domain.Chronicle;
import chronicle.domain.LoginCheck;
import chronicle.domain.Members;
import chronicle.service.ChronicleService;

@Controller
@RequestMapping("/chronicle/*")
public class ChronicleController {
	
	@Autowired
	ChronicleService service;
	
	@RequestMapping("list.do")
	public List<Chronicle> list () {
		System.out.println("요청 옴");
		
		return service.selectList();
	}
	
	@RequestMapping("registMember.do")
	public Map<String,Object> insertMember(Members members){	
		
		System.out.println("회원가입요청");
		
		System.out.println(members.getId());
		
		service.registMember(members);	
		
		Map<String,Object> result = new HashMap<>();
		result.put("data", "전송성공");
//		return new AjaxResult("data","전송성공");
		return result;
	}
	
	@RequestMapping("checkId.do")
	public Map<String,Object> checkId(Members members){
		System.out.println("체크할 아이디 : "+members.getId());
		
		int ckId = service.checkId(members);
		Map<String,Object> result = new HashMap<>();
		result.put("data", ckId);
		
		return result;
	}
	
	@RequestMapping("login.do")
	public AjaxResult login(LoginCheck loginInfo, HttpSession session){
//		System.out.println(loginInfo.getId()+" : "+loginInfo.getPass());		
		
		Members member = (Members) service.loginCheck(loginInfo);
		
		if(member !=null){
			System.out.println("아이디 찾기성공");
			
//			session.setAttribute("loginInfo", loginInfo);
			session.setAttribute("loginInfo", member);
//			session.setMaxInactiveInterval(3600);
			
			
			Test(session);
//			Members mem = (Members)session.getAttribute("loginInfo");
//			System.out.println("세션에서 가져온값 " + mem.getName());
			
			
			
		}else{
			 System.out.println("찾는 아이디 없음");
//	         session.invalidate(); // 세션을 무효화시킴. => 새로 세션 객체 생성!
			
			return new AjaxResult("fail",null);
		}
		//return 객체를 보낸다. html에서 사용시 
		// 받을변수명.return하는객체명.객체내변수명&Object타입으로 접근
		return new AjaxResult("success", member);
	}
	@RequestMapping("test001.do")
	public void Test(HttpSession session){
		Members mem = (Members)session.getAttribute("loginInfo");
		
		System.out.println("세션에서 가져온 아이디"+mem.getId());
		
	}
	
	
	
	
}

	

