const dbString = {
  host: '',
  password: '',
  username: '',
  port: '3306',
  database: ''
};

if(process.env.NODE_ENV === "production"){
  dbString.host = "";
  dbString.username = "";
  dbString.password = "";
}else{
  dbString.host = "localhost";
  dbString.username = "root";
  dbString.password = "";
  dbString.database = "cleaning_service"
}

module.exports = dbString;