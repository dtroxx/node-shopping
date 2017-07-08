const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

const Product = require('../models/product');
const Order = require('../models/order');

/* GET home page. */
router.get('/', (req, res, next) => {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, docs) {
    const productChunks = [];
    const chunkSize = 3;
    for (let i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  });
});

router.get('/add-to-cart/:id', (req, res, next) => {
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
});

router.get('/reduce/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', (req, res, next) => {
  // check if there is a cart
  if (!req.session.cart) {
    // if not then show shopping cart view and pass null for products
    return res.render('shop/shopping-cart', { products: null });
  }
  // if cart create cart from cart in session
  var cart = new Cart(req.session.cart);
  // show cart view and pass cart products to generate array of products + total price
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {    
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0]; // stores any errors from stripe creating charge
  res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});

router.post('/checkout', isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {    
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  
  var stripe = require("stripe")(
  "sk_test_RDtaLjxLJ8AV9ULqeH9gghtA"
);

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js passed via form in hidden input
    description: "Test Charge"
}, function(err, charge) {
    if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id  // passed to callback of stripe.charges.create
    });
    order.save(function(err, result){ // save order to database
      if (err) {
        console.log(err);
      }
      req.flash('success', 'Purchase Successful!');
      req.session.cart = null; // clear the cart
      res.redirect('/');
    });    
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url; // url where non logged in user came from
  res.redirect('/user/signin');
}