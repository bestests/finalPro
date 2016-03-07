package chronicle.dao;

import java.util.List;

import chronicle.domain.Chronicle;

public interface ChronicleDAO {
	public List<Chronicle> selectList();
}
