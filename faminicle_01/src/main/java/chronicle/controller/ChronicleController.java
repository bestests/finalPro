package chronicle.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import chronicle.domain.Chronicle;
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
	
	
}
