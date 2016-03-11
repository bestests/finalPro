package chronicle.dao;

import java.util.List;

import chronicle.domain.Chronicle;
import chronicle.domain.Members;

public interface ChronicleDAO {
	public List<Chronicle> selectList();
	public void insertMember(Members members);
	public Integer checkId(Members members);
}
