CREATE TABLE FAMINICLE_MEMBER(
	ID				VARCHAR2(60)		PRIMARY KEY
	,PASS			VARCHAR2(60)		NOT NULL
	,E_MAIL			VARCHAR2(100)		NOT NULL
	,NAME			VARCHAR2(20)		NOT NULL
	,BIRTHDAY		VARCHAR2(20)		NOT NULL
	,PHONE_NUMBER	NUMBER(11)			NOT NULL
)

CREATE SEQUENCE SEQ_MEMBER_NO;

/*
	사용자 아이디
	사용자 비밀번호
	사용자 이메일
	사용자 이름
	사용자 생년월일
	사용자 연락처
*/


