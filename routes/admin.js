//-- Module Dependcies
const router = require('express').Router();
const passport = require('passport');

//-- Load Repository
const adminRepository = require('../crud/AdminRepos');
const serviceRepository = require('../crud/ServicesRepos');
const customerRepository = require('../crud/CustomerRepos');

router.get('/login/', (req, res) => {
  res.render('admin/login', {
    pageTitle: 'Admin | Login'
  })
});

//-- Process Admin Login
router.post('/login', (req, res, next) => {
  require('../config/passport')(passport, adminRepository);
  passport.authenticate('local', {
    successFlash: true,
    successRedirect: '/admin/',
    failureFlash: true,
    failureRedirect: '/admin/login/'
  })(req, res, next);
});

router.get('/', (req, res) => {
  customerRepository.count()
    .then(totalCus=>{
      totalCus = totalCus.total;
      res.render('admin/dashboard', {
        pageTitle: 'Admin Dashboard',
        totalCus
      });
    })
    .catch(err=>{
      console.log(err);
      req.flash('error', 'failed to load dashboard.');
      res.redirect('/');
    });
});

router.get('/post/new/service/', (req, res) => {
  res.render('admin/new_service', {
    pageTitle: 'Admin | new service'
  })
});

router.post('/post/new/service', (req, res) => {
  //-- Post new service
  let {serviceName, amount} = req.body;
  let service = {
    name: serviceName,
    amount
  };

  serviceRepository.insert(service)
    .then(inserted => {
      req.flash('success', 'New service has been posted.');
      res.redirect('/admin/');
    })
    .catch(err => {
      console.log(err);
      req.flash('error', 'Failed to post new service');
      res.redirect('/admin/');
    })
})

router.get('/all/customers/', (req, res)=>{
  customerRepository.findMany([])
    .then(customers=>{
      res.render('admin/customers', {
        pageTitle: 'Admin | Customers',
        customers
      });
    })
    .catch(err=>{
      console.log(err);
      req.flash('error', 'Failed to load customers');
      res.redirect('/admin/');
    });
});

router.get('/all/services/', (req, res) => {
  serviceRepository.findMany([])
    .then(services=>{
      res.render('admin/services', {
        pageTitle: 'Admin | Services',
        services
      });
    })
    .catch(err => {
      console.log(err);
      req.flash('error', 'Failed to load services');
      res.redirect('/admin/');
    });
});
module.exports = router;