package chronicle.service;

import java.util.List;

import chronicle.domain.Chronicle;
import chronicle.domain.Members;

public interface ChronicleService {
	public List<Chronicle> selectList();
	public void registMember(Members members);
	public Integer checkId(Members members);
}
