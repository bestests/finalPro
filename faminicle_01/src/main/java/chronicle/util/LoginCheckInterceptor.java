package chronicle.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import chronicle.domain.Members;

//세션이 존재하지 않거나 사용자 정보가 세션에 없으면 로그인(메인)화면으로 이동하게하는
//인터셉터
public class LoginCheckInterceptor extends HandlerInterceptorAdapter{
	
	public boolean preHandle(HttpServletRequest request,HttpServletResponse response,
			Object handler)throws Exception{
		System.out.println("인터셉터에 들어옴");
		
		
//		return true;
		
//		try{
//			if(request.getSession().getAttribute("loginInfo")==null){
//				System.out.println("세션값없음");
//				return false;
//			}
//			
//		}catch(Exception e){
//			e.printStackTrace();
//		}
		
		
//		return true;
		
		String servletPath = request.getServletPath();
		System.out.println(servletPath);
		
//		Members check = (Member) session.getAttribute("loginInfo");
		Members check = (Members) request.getSession().getAttribute("loginInfo");
		System.out.println("세션값 " +check);
//		System.out.println(check.getName());
		if(!("/chronicle/login.do".equals(servletPath)||"/chronicle/checkId.do".equals(servletPath)) && check == null) {
			System.out.println("로그인페이지 아니면서 세션이 없을때");
			
			response.setContentType("900");
			return false;
		}
		System.out.println("통과함");
//		System.out.println(check.getId());
		return true;
		/*
		System.out.println("인터셉터 로그인 여부: "+ check);
		
		if(check==null){
			System.out.println("꽝");
			return false;
		}
		System.out.println("연결");
		return true;
		*/

		
		/*
		HttpSession session = request.getSession();
		
		
		if(session == null){
			response.sendRedirect(request.getContextPath()+"/src/main/views/main2.html");
			return false;
		}
		
		Members member = (Members)session.getAttribute("loginInfo");
		
		if(member == null){
			response.sendRedirect(request.getContextPath()+"/src/main/views/main2.html");
			return false;
		}
		
		return true;
		*/		
	}
	
}
