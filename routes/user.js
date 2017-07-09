const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const userController = require('../controllers/userController');

const Order = require('../models/order');
const Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, userController.getProfile);
router.get('/logout', userController.logout);

router.use('/', notLoggedIn, (req, res, next) => {
  next();
})

router.get('/signup', userController.getSignup);

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next) {
      if (req.session.oldUrl) { // if coming from checkout not logged in
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);      
      } else {
      res.redirect('/user/profile'); // if not coming from checkout
      }
    });

router.get('/signin', (req, res, next) => {
  const messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) { // if coming from checkout not logged in
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl); 
  } else {
      res.redirect('/user/profile'); // if not coming from checkout
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
