package chronicle.domain;

import java.util.Date;

public class Chronicle {
	private int no;
	private String content;
	private Date regDate;
	private Date picDate;
	private String filePath;
	
	public int getNo() {
		return no;
	}
	public void setNo(int no) {
		this.no = no;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Date getRegDate() {
		return regDate;
	}
	public void setRegDate(Date regDate) {
		this.regDate = regDate;
	}
	public Date getPicDate() {
		return picDate;
	}
	public void setPicDate(Date picDate) {
		this.picDate = picDate;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
}
