
// Set up public folder
const express = require('express');
const exphbs  = require('express-handlebars');
const dbConnect = require('./db/db-connect');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var favicon = require('serve-favicon');
var path = require('path');

//-- Load routes
const customer = require('./routes/customers');
const admin = require('./routes/admin');

//-- init admin
const {adminConfig} =  require('./config/init');

//-- Connect to Mysql Db
dbConnect()
  .then(conn=>{
    console.log('connected to mysql db');
    //-- console.log(conn);
    adminConfig();
  })
  .catch(err=>{
    console.log(err);
  });

//Initialize app entry point
const app = express();
//Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

//-- body-parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//-- express-session middleware
app.use(session({saveUninitialized: true, resave: true, secret: '1234'}));

//-- connet-flash middleware
app.use(flash());

//-- passport middleware
app.use(passport.initialize());
app.use(passport.session());


//-- Setup Global Variables
app.use((req, res, next)=>{
  res.locals.user = req.user || null;
  res.locals.error = req.flash('error');
  res.locals.success  = req.flash('success');

  next();
})
//Index route
app.get('/', (req, res) => {
  res.render('main', {
    pageTitle: 'main page'
  });
});

//signup route
app.get('/staff', (req, res) => {
  res.render('staff', {
    pageTitle: 'sign up page for new users'
  });
});

//-- logout route
app.get('/logout', (req, res)=>{
  req.logout();
  req.flash('success', 'Thanks for using our service.')
  res.redirect('/');
})


//-- Setup routes
app.use('/customer', customer);
app.use('/admin', admin);

// favicons
app.use('/favicon.ico', express.static('/img/favicon.ico'));
//Server port
port = process.env.PORT || 5000;

app.listen(port, () =>{
  console.log(`server is started in ${port}`);
});
