package chronicle.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import chronicle.dao.ChronicleDAO;
import chronicle.domain.Chronicle;
import chronicle.domain.LoginCheck;
import chronicle.domain.Members;

@Service
public class ChronicleServiceImpl implements ChronicleService{

	@Autowired
	ChronicleDAO dao;
	
	@Override
	public List<Chronicle> selectList() {
		return dao.selectList();
	}

	@Override
	public void registMember(Members members) {
		dao.insertMember(members);
	}

	@Override
	public Integer checkId(Members members) {
		int ckId = dao.checkId(members);		
		
		System.out.println("검색할 아이디 :  "+members.getId()+"돌아온 id개수 : " + ckId);
		
		return ckId;
	}

	@Override
	public Members loginCheck(LoginCheck loginInfo) {
		return dao.loginCheck(loginInfo);
	}
	
	
	
}
