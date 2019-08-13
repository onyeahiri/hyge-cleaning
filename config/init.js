const bcrypt   = require('bcryptjs');

//-- Admin model
const adminRepository = require('../crud/AdminRepos');

function adminConfig(){
  adminRepository.findMany([])
    .then(admins => {
      
      if(admins.length === 0 || !admins){
        let myAdmin = {email_address:"cleaning@gmail.com",password:"{1345}",username: "John Doe"};

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(myAdmin.password, salt, (err, hash) => {
            if(err) throw err;

            myAdmin.password = hash;
            adminRepository.insert(
              myAdmin
            ).catch(err=>console.log(err));
          });
        });

      }
    }).catch(err=>console.log(err));
}


module.exports = {adminConfig};