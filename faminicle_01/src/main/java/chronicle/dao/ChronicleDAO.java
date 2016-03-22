package chronicle.dao;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartHttpServletRequest;
import chronicle.domain.Chronicle;
import chronicle.domain.EventDay;
import chronicle.domain.LoginCheck;
import chronicle.domain.Members;
import chronicle.domain.Page;
import chronicle.domain.Regist;

public interface ChronicleDAO {
	//쿼리문에서 id값(insert) result타입을 같게해주면 자동적으로 xml에 들어가서 처리해서 반환값으로 자동 처리하게해준다.
	public List<Chronicle> selectList();
	public List<Chronicle> selectPrevList(Page page);
	public List<Chronicle> selectNextList(Page page);
	public void insertMember(Members members);
	public Integer checkId(Members members);
	public Members loginCheck(LoginCheck loginInfo);
	public void insertpic(Regist regist);
	public int insertEvent(EventDay evDay);
	public EventDay selectEventOne(int enNo);
	public List<EventDay> selectEventByMem(int memNo);
	public void deleteEvent(int evNo);
	public Members checkPass(Members members);
	public void updateMember(Members members);
	public Members memberInfo(Members members);
	public void updateMemberPic(Members members);
}
