package chronicle.service;

import java.util.List;

import chronicle.domain.Chronicle;
import chronicle.domain.EventDay;
import chronicle.domain.LoginCheck;
import chronicle.domain.Members;
import chronicle.domain.Regist;

public interface ChronicleService {
	public List<Chronicle> selectList(String startDate, String endDate, String pageNo);
	public void registMember(Members members);
	public Integer checkId(Members members);
	public Members loginCheck(LoginCheck loginInfo);
	public void registpic(Regist regist);
	public EventDay registEvent(EventDay evDay);
	public List<EventDay> selectEvent(int memNo);
	public void deleteEvent(int evNo);
}
