package chronicle.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import chronicle.domain.Chronicle;
import chronicle.service.ChronicleService;

@Controller
@RequestMapping("/chronicle/*")
public class ChronicleController {
	
	@Autowired
	ChronicleService service;
	
	@RequestMapping("list")
	public List<Chronicle> list () {
		return service.selectList();
	}
	public static void main(String[] args) {
		System.out.println("ddd");
	}
}
