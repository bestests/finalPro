package chronicle.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import chronicle.dao.ChronicleDAO;
import chronicle.domain.Chronicle;

@Service
public class ChronicleServiceImpl implements ChronicleService{

	@Autowired
	ChronicleDAO dao;
	
	@Override
	public List<Chronicle> selectList() {
		return dao.selectList();
	}
	
}
