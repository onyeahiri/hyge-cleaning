const dbString = {
  host: '',
  password: '',
  username: '',
  port: '3306',
  database: ''
};

if(process.env.NODE_ENV === "production"){
  dbString.host = "us-cdbr-iron-east-02.cleardb.net";
  dbString.username = "b5ba90678a14fc";
  dbString.password = "d192ee2b";
  dbString.database = 'heroku_993be6745153f57';
}else{
  dbString.host = "localhost";
  dbString.username = "root";
  dbString.password = "";
  dbString.database = "cleaning_service"
}

module.exports = dbString;