const mongoose = require('mongoose');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, docs) {
    const productChunks = [];
    const chunkSize = 3;
    for (let i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  });
};