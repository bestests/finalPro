package chronicle.controller;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import chronicle.domain.Chronicle;
import chronicle.domain.LoginCheck;
import chronicle.domain.Members;
import chronicle.domain.Regist;
import chronicle.service.ChronicleService;

@Controller
@RequestMapping("/chronicle/*")
public class ChronicleController {
	
	@Autowired
	ChronicleService service;
	@Autowired
	private ServletContext servletContext;
	
	@RequestMapping("list.do")
	public Map<String, Object> list (String startDate, String endDate, String pageNo, HttpServletRequest req) {
		Map<String, Object> result = new HashMap<>();
		
		result.put("cList", service.selectList(startDate, endDate, pageNo));
		result.put("member", (Members)req.getSession().getAttribute("loginInfo"));
		
		return result;
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
	
	@RequestMapping("Regist.do")
	@ResponseBody
	public AjaxResult register(Regist regist, MultipartHttpServletRequest mRequest) throws Exception{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd/");
		String realPath = servletContext.getRealPath("/upload/");
		String sdfPath = sdf.format(new Date());
		String filePath = realPath + sdfPath;
		File file = new File(filePath);
		file.mkdirs();
		Iterator<String> iter = mRequest.getFileNames();
		if(iter.hasNext()){
			MultipartFile mFile =  mRequest.getFile(iter.next());
			String oriFileName = mFile.getOriginalFilename();
			System.out.println(oriFileName);
			if(oriFileName != null && !oriFileName.equals("")){
				String ext = oriFileName.substring(oriFileName.lastIndexOf("."));
				String realFileName = UUID.randomUUID().toString()+ext;
				String saveFullFileName = filePath+"/"+realFileName;
				String srcPath = "../upload/"+ sdfPath;
				mFile.transferTo(new File(saveFullFileName));
				regist.setPicFilePath(srcPath+realFileName);
			}
		}
		service.registpic(regist);
		AjaxResult result = new AjaxResult("ok", "ok");
		return result;
	}
	
	
	
	
}

	

