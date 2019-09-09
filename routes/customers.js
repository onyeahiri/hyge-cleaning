//-- Module Dependencies
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const stripe = require("stripe")("sk_test_SqgdB52IG9KL6y1OqJReIU8i005ey4QHVZ");

//-- Load Repositories
const customerRepository = require("../crud/CustomerRepos");
const bookingRepository = require("../crud/BookingRepos");
const serviceRepository = require("../crud/ServicesRepos");
const transactionRepository = require("../crud/TransactionRepos");

//-- Customer Login route
router.get("/login", (req, res) => {
  res.render("customer/login", {
    pageTitle: "Customer | Login"
  });
});

//-- Process Login
router.post("/login", (req, res, next) => {
  require("../config/passport")(passport, customerRepository);
  passport.authenticate("local", {
    successRedirect: "/",
    successFlash: true,
    failureRedirect: "/customer/login",
    failureFlash: true
  })(req, res, next);
});

// display customer signup page
router.get("/signup", (req, res) => {
  res.render("signup", {
    pageTitle: "sign up page for new users"
  });
});
//-- process customer signup
router.post("/signup", (req, res) => {
  const { fullname, emailAddress, password, address, phoneNo } = req.body;
  //-- Nigeria country code
  const countryCode = "234";

  //-- new customer
  let customer = {
    name: fullname,
    email_address: emailAddress,
    password,
    address,
    phone_no: countryCode + phoneNo
  };
  //-- ensure email is used by only one user.
  customerRepository
    .findOne([{ email_address: customer.email_address }])
    .then(emailExists => {
      if (emailExists) {
        req.flash("error", "Sorry, email is already in use.");
        res.render("signup", {
          pageTitle: "sign up page for new users",
          emailAddress,
          phoneNo,
          fullname,
          address
        });
        return;
      }
      //-- ensure phone number is used by only one user.
      customerRepository
        .findOne([{ phone_no: customer.phone_no }])
        .then(phoneNoExists => {
          if (phoneNoExists) {
            req.flash("error", "Sorry, phone number is already in use.");
            res.render("signup", {
              pageTitle: "sign up page for new users",
              emailAddress,
              phoneNo,
              fullname,
              address
            });
            return;
          }
          //-- all is well register the user

          //-- hash user password
          bcrypt.genSalt(12, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(customer.password, salt, (err, hash) => {
              if (err) throw err;
              //-- password hashed
              customer.password = hash;
              //-- save user data
              customerRepository
                .insert(customer)
                .then(inserted => {
                  req.flash(
                    "success",
                    inserted.name + " thank you for creating  account with us"
                  );
                  res.redirect("/customer/login/");
                })
                .catch(err => {
                  console.log(err);
                });
            });
          });
        })
        .catch(err => {
          console.log(err);
          req.flash("error", "Sorry, an error occured during registration.");
          res.redirect("/customer/signup");
        });
    })
    .catch(err => {
      console.log(err);
      req.flash("error", "Sorry, an error occured during registration.");
      res.redirect("/customer/signup");
    });
});

router.get("/mybookings/", (req, res) => {
  let userID;
  if(req.user){
    userID = req.user.id;
  }
  bookingRepository
    .findJoin(
      {
        services: [
          { column: "name", alias: "serviceName" },
          { column: "amount", alias: "serviceAmount" }
        ],
        bookings: [{ column: "id" }]
      },
      {
        services: "service_id"
      },
      [{ table: "bookings", column: "customer_id", value: userID, operator: "=" }]
    )
    .then(mybookings => {
      res.render("customer/mybookings", {
        pageTitle: "My Bookings",
        mybookings
      });
    })
    .catch(err => {
      console.log(err);
    });
});

//-- customer booking route
router.get("/booking/", (req, res) => {
  serviceRepository
    .findMany([])
    .then(bookingServices => {
      res.render("customer/booking", {
        pageTitle: "Customer | Booking Services",
        bookingServices
      });
    })
    .catch(err => {
      console.log(err);
      req.flash("error", "Sorry, an error occured during registration.");
      res.redirect("/customer/signup");
    });
});

//-- make payment route
router.get("/make/payment/:sid/", (req, res) => {
  let sid = req.params.sid;

  serviceRepository
    .findById(sid)
    .then(service => {
      res.render("customer/makepayment", {
        pageTitle: "Make Payment",
        service
      });
    })
    .catch(err => {
      console.log(err);
      req.flash("error", "sorry an error occured");
      res.redirect("/customer/booking");
    });
});

// process payment
router.post("/make/payment/", (req, res) => {
  let token = req.body.stripeToken;
  let sid = req.body.sid;

  if (!req.user) {
    req.flash("error", "you must login first.");
    return res.redirect("/customer/login/");
  }

  let userID = req.user.id;
  let newBooking = {
    customer_id: userID,
    service_id: sid
  };

  //-- book this service for customer
  bookingRepository
    .insert(newBooking)
    .then(booking => {
      //-- get service amount
      serviceRepository
        .findById(sid)
        .then(service => {
          //-- create charge
          stripe.charges
            .create({
              amount: service.amount,
              currency: "ngn",
              description: "cleaning service",
              source: token
            })
            .then(info => {
              if (info.Error) {
                req.flash("error", "failed to create charge.");
                return res.redirect("/customer/booking/");
              }
              //-- create transation
              let newTransact = {
                booking_id: booking.id,
                stripe_token: token
              };

              transactionRepository
                .insert(newTransact)
                .then(transact => {
                  //-- send mail

                  req.flash(
                    "success",
                    `${req.user.name} your service request has been saved.`
                  );
                  res.redirect("/customer/booking/");
                })
                .catch(err => {
                  console.log(err);
                  req.flash("error", "failed to execute transaction.");
                  res.redirect("/customer/booking");
                });
            })
            .catch(err => {
              console.log(err);
              req.flash("error", "failed to execute transaction.");
              res.redirect("/customer/booking");
            });
        })
        .catch(err => {
          console.log(err);
          req.flash("error", "failed to execute transaction.");
          res.redirect("/customer/booking");
        });
    })
    .catch(err => {
      console.log(err);
      req.flash("error", "failed to execute transaction.");
      res.redirect("/customer/booking");
    });
});

module.exports = router;
