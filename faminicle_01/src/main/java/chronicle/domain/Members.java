package chronicle.domain;

public class Members {
	
	private int memNo;
	private String id;
	private String pass;
	private String eMail;
	private String memFilePath;
	private	String picMiniFilePath;
	private String name;
	private String birthday;
	private int tel;
	
	public String getMemFilePath() {
		return memFilePath;
	}
	public void setMemFilePath(String memFilePath) {
		this.memFilePath = memFilePath;
	}
	public String getPicMiniFilePath() {
		return picMiniFilePath;
	}
	public void setPicMiniFilePath(String picMiniFilePath) {
		this.picMiniFilePath = picMiniFilePath;
	}
	public int getMemNo() {
		return memNo;
	}
	public void setMemNo(int memNo) {
		this.memNo = memNo;
	}
	public int getTel() {
		return tel;
	}
	public void setTel(int tel) {
		this.tel = tel;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPass() {
		return pass;
	}
	public void setPass(String pass) {
		this.pass = pass;
	}
	public String geteMail() {
		return eMail;
	}
	public void seteMail(String eMail) {
		this.eMail = eMail;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	
	
}
