CREATE TABLE fam_pic(
	PIC_NO 		 	INT  	NOT  NULL  	PRIMARY KEY	 	  		AUTO_INCREMENT 
	,MEM_NO	 	 	INT	  	NOT  NULL  
	,TITLE	  		VARCHAR(100)  
	,PIC_DATE	 	VARCHAR(100) 	NOT NULL  
	,PIC_FILE_PATH	 VARCHAR(100)	 NOT NULL
	,LAT	 	 	VARCHAR(30)	 	 
	,LNG	 	 	VARCHAR(30)	 
);



insert into fam_pic(MEM_NO, TITLE, PIC_DATE, PIC_FILE_PATH, LAT, LNG)
		values("1","test","2016-03-14","/images/1.jpg","37.4944","127.02803333333333")






