package chronicle.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import chronicle.dao.ChronicleDAO;
import chronicle.domain.Chronicle;
import chronicle.domain.EventDay;
import chronicle.domain.LoginCheck;
import chronicle.domain.Members;
import chronicle.domain.Page;
import chronicle.domain.Regist;

@Service
public class ChronicleServiceImpl implements ChronicleService{

	
	@Autowired
	ChronicleDAO dao;
	
	@Override
	public List<Regist> selectList(String startDate, String endDate, String pageNo) {
		System.out.println("서비스 들어 옴");
		List<Regist> result = null;
		
		int pageNoInt = 0;
		
		if(!pageNo.equals("")) {
			pageNoInt = Integer.parseInt(pageNo);
		}
		
		Page page = new Page();
		
		//"".equals(startDate);
		if(startDate.equals("") && endDate.equals("")) {
			result = dao.selectList();
		} else if(endDate.equals("") && !startDate.equals("")) {
			System.out.println("이전 글 선택 : " + startDate);
			page.setStartDate(startDate);
			page.setPageNo(pageNoInt);
			result = dao.selectPrevList(page);
		} else if(startDate.equals("") && !endDate.equals("")) {
			System.out.println("다음 글 선택 : " + endDate);
			page.setEndDate(endDate);
			page.setPageNo(pageNoInt);
			result = dao.selectNextList(page);
		}
		
		return result;
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
	
	@Override
	public void registpic(Regist regist) {
		dao.insertpic(regist);
	}

	@Override
	public Members checkPass(Members members) {
		return dao.checkPass(members);
	}

	@Override
	public Members memberInfo(Members members) {
		Members info = dao.memberInfo(members);
		return info;
	}

	@Override
	public void updateMember(Members members) {
		dao.updateMember(members);
	}
	
	
	
	@Override
	public void updateMemberPic(Members members) {
		dao.updateMemberPic(members);
	}
	
	@Override
	public EventDay registEvent(EventDay evDay) {
		
		dao.insertEvent(evDay);
		
		return dao.selectEventOne(evDay.getEvNo());
	}
	
	@Override
	public List<EventDay> selectEvent(int memNo) {
		return dao.selectEventByMem(memNo);
	}

	@Override
	public void deleteEvent(int evNo) {
		dao.deleteEvent(evNo);
	}
	@Override
	public void updateEvent(Regist chronicle) {
		dao.updateEvent(chronicle);
	}

	@Override
	public void deletePic(int no) {
		dao.deletePic(no);
	}

	@Override
	public List<Regist> seletePicByEvent(EventDay evDay) {
		
		return dao.seletePicByEvent(evDay);
	}

	
	

}