const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//-- Load admin repository
//-- const adminRepository = require('../lib/repository/AdminRepos');
//-- Load candidate repository
const customerRepository = require('../crud/CustomerRepos');
const adminRepository = require('../crud/AdminRepos');

module.exports = function (passport, User) {
  
  passport.use(new LocalStrategy({usernameField: 'emailAddress'}, (emailAddress, password, done) =>{
    //-- Match User
    User.findOne([{email_address: emailAddress}])
      .then(user => { 
        if (!user) {
          return done(null, false, {message:'No User with such email found'});
        }

        //-- Match User password
        bcrypt.compare(password ,user.password, (err, isMatch) => {
          if(err) throw err;

          if(isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {message: 'Password Incorrect'});
          }
        });
        
      })
      .catch(err => {
        console.log(err);
        return done(null, false, {message: 'Db not responding'});
      });
  }));

  passport.serializeUser(function(user, done){
    
    done(null, {_id:user.id, type: user.userType});
  });

  passport.deserializeUser(function(key, done){
    User = {};

    if(key.type === 0) User = adminRepository;
    if(key.type === 1) User = customerRepository;

    User.findById(key._id)
     .then((user)=>{
      done(null, user);
    },(err)=>{
      done(err, false);
    });
  });
}