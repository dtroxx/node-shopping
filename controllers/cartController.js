const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addToCart = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
};

exports.getCart = (req, res, next) => {
  // check if there is a cart
  if (!req.session.cart) {
    // if not then show shopping cart view and pass null for products
    return res.render('shop/shopping-cart', { products: null });
  }
  // if cart create cart from cart in session
  var cart = new Cart(req.session.cart);
  // show cart view and pass cart products to generate array of products + total price
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
};

exports.reduceByOne = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
};

exports.removeItem = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
};