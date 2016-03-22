import React from 'react';
import ReactDom from 'react-dom';
import ProductList from './app/product-list';
import injectTapEventPlugin from 'react-tap-event-plugin';
import moment from 'moment';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var products = [
  { id: 1, name: 'Lait', lastBuy: null },
  { id: 2, name: 'Sucre', lastBuy: moment() },
  { id: 3, name: 'Sel', lastBuy: null },
  { id: 4, name: 'Thé', lastBuy: moment() },
  { id: 5, name: 'Café', lastBuy: moment() },
  { id: 6, name: 'Yoghurts', lastBuy: null },
  { id: 7, name: 'Eau minérale', lastBuy: moment() },
  { id: 8, name: 'Bières', lastBuy: null },
  { id: 9, name: 'Tablettes machine à laver', lastBuy: null },
  { id: 10, name: 'P.Q.', lastBuy: null },
  
];

ReactDom.render(
    <ProductList products={products} />,
    document.querySelector('.root')
);
