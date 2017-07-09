const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const Cart = require('../models/cart');


exports.getProfile = (req, res, next) => {
  Order.find({user: req.user}, function(err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', { orders: orders });
    });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.getSignup = (req, res, next) => {
// error messages coming from passport stored under 'error'
  const messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
};


