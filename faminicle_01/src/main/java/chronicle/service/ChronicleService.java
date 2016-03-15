package chronicle.service;

import java.util.List;

import chronicle.domain.Chronicle;
import chronicle.domain.LoginCheck;
import chronicle.domain.Members;
import chronicle.domain.Regist;

public interface ChronicleService {
	public List<Chronicle> selectList();
	public void registMember(Members members);
	public Integer checkId(Members members);
	public Members loginCheck(LoginCheck loginInfo);
	public void registpic(Regist regist);
}
