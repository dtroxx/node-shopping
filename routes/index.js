const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

const Product = require('../models/product');

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

router.get('/checkout', (req, res, next) => {
  if (!req.session.cart) {    
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0]; // stores any errors from stripe creating charge
  res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});

router.post('/checkout', (req, res, next) => {
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
    req.flash('success', 'Purchase Successful!');
    req.session.cart = null; // clear the cart
    res.redirect('/');
  });
});

module.exports = router;
