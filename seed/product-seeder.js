const Product = require('../models/product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shopping');

const products = [
  new Product({
    imagePath: 'https://cdn.tutsplus.com/psd/uploads/legacy/psdtutsarticles/linkb_60vgamecovers/35.jpg',
    title: 'Gear of Wars',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    price: 12
  }),
  new Product({
    imagePath: 'https://cdn.tutsplus.com/psd/uploads/legacy/psdtutsarticles/linkb_60vgamecovers/1.jpg',
    title: 'Grand Theft Auto IV',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    price: 15
  }),
  new Product({
    imagePath: 'https://cdn.tutsplus.com/psd/uploads/legacy/psdtutsarticles/linkb_60vgamecovers/42.jpg',
    title: 'Fallout 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    price: 11
  }),
  new Product({
    imagePath: 'http://www.treknews.net/wp-content/uploads/2012/12/star-trek-video-game-cover-art.jpg',
    title: 'Star Trek',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    price: 18
  }),
  new Product({
    imagePath: 'https://cdn.tutsplus.com/psd/uploads/legacy/psdtutsarticles/linkb_60vgamecovers/27.jpg',
    title: 'Mass Effect',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    price: 14
  })
];

let done = 0;
for (let i = 0; i < products.length; i++) {
  products[i].save((err, result) => {
    done++;
    if (done === products.length) {
      exit();
    }
  })
}

const exit = () => {
  mongoose.disconnect();
}
