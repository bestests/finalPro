package chronicle.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/chronicle/*")
public class ChronicleController {
	
	@RequestMapping("list")
	public String list () {
		System.out.println("list.do 요청 옴");
		
		return "test";
	}
}
