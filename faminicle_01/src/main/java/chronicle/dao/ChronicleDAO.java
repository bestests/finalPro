package chronicle.dao;

import java.util.List;

import chronicle.domain.Chronicle;
import chronicle.domain.LoginCheck;
import chronicle.domain.Members;

public interface ChronicleDAO {
	//쿼리문에서 id값(insert) result타입을 같게해주면 자동적으로 xml에 들어가서 처리해서 반환값으로 자동 처리하게해준다. 
	public List<Chronicle> selectList();
	public void insertMember(Members members);
	public Integer checkId(Members members);
	public Members loginCheck(LoginCheck loginInfo);
}
