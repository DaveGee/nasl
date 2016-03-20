import React from 'react';
import ReactDom from 'react-dom';
import AllProducts from './app/all-products';
import NextTrip from './app/next-trip';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var more = '123456789abcdefghijklmnopqrstuvwxyz'.split('').map(x => x.repeat(8));

var products = ['Lait', 'Sucre', 'Sel', 'Truc pas utile', 'Thé', ...more];
var toBuy = [];

ReactDom.render(
    toBuy.length ? <NextTrip /> : <AllProducts products={products} toBuy={toBuy} />,
    document.querySelector('.root')
);
