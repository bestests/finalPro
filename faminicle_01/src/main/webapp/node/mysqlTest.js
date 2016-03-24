var io = require("socket.io")();
var mysql = require("mysql");

io.on("connection", function (socket) {
	console.log("요청 옴");
	socket.on("checkId", function (data) {
		console.log(idCheck(data));
	});
});

io.listen(9002);



var checked = false;
var idCheck = function (id) {
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'java77',
		password: '1111',
		database: 'test01db'
	});
	connection.connect();
	
	connection.query("select * from fam_member where ID = '" + id + "'", function (err, rows, fields) {
		if(!err) {
			console.log("The solution is : " + rows);
			if(rows.length != 0) {
				checked = true;
			} else {
				checked = false;
			}
		} else {
			console.log("Error!!!");
		}
	});
	return checked;
}


