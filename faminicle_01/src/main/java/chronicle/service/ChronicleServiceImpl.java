package chronicle.service;

import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import chronicle.dao.ChronicleDAO;
import chronicle.domain.EventDay;
import chronicle.domain.FamMember;
import chronicle.domain.Family;
import chronicle.domain.LoginCheck;
import chronicle.domain.Members;
import chronicle.domain.Page;
import chronicle.domain.Regist;

@Service
public class ChronicleServiceImpl implements ChronicleService{

	
	@Autowired
	ChronicleDAO dao;
	
	@Override
	public List<Regist> selectList(Page page) {
		return dao.selectList(page);
	}
	
	@Override
	public List<Regist> selectNextList(Page page) {
		System.out.println("형식:"+page.getCall()+"페이지번호:"+page.getPageNo()+"시작일자:"+page.getStartDate()+"회원번호:"+page.getMemNo());
		return dao.selectNextList(page);
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

	@Override
	public void registFam(Family fam) {
		String famName = picFamName(fam.getFamName());
		
		System.out.println("처리 후 : " +famName);
		
		fam.setFamName(famName);
		System.out.println(fam.getFamName());
		System.out.println("reqNo : " + fam.getFamReqIdNo());
		System.out.println("resNo : " + fam.getFamResIdNo());
		
		
		dao.updateFamAfterAccept(fam);
		
		int reqCnt = dao.selectCountReqIdNo(fam.getFamReqIdNo());
		// 신청자가 가족을 만들었는지 체크
		if(reqCnt==0){
			dao.insertFam(new FamMember(fam.getFamName(),fam.getFamReqIdNo()));
			//신청자가 가족을 만든적이 없다면 신청자 가족에등록
		}
			dao.insertFam(new FamMember(fam.getFamName(),fam.getFamResIdNo()));
			//신청받은자를 등록(신청자가 만든적있아면 받은자만등록) 
		
		System.out.println("가족 신청 완료");
	}
	
	public String picFamName(String famName) {
		while (true) {
			int index = famName.lastIndexOf("#");
			
			if(index != -1) {
				famName = famName.substring(0, index);
			} 
			String ranNo = Integer.toString(new Random().nextInt(9000) + 1000);
			
			famName += "#" + ranNo;
			
			System.out.println(famName);
			
			int count = dao.selectFamByName(famName);
			
			if(count == 0) break;
		}
		return famName;
	}

	
}