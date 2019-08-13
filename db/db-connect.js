//-- App Modules
const mysql = require('mysql');
const {host,database, password, port, username} = require('../db/db-config');

const connectPool = mysql.createPool({
  host,
  user: username,
  password,
  port,
  database,
  connectionLimit: 10
});

function connect(){
  return new Promise((resolve, reject)=>{
    connectPool.getConnection((err, connection)=>{
      if(err){
        reject(err);
      }
      resolve(connection);
    });
  });
}

module.exports = connect;