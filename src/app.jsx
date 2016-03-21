import React from 'react';
import ReactDom from 'react-dom';
import ProductList from './app/product-list';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var products = [
  { id: 1, name: 'Lait', lastBuy: null, next: true },
  { id: 2, name: 'Sucre', lastBuy: new Date() },
  { id: 3, name: 'Sel', lastBuy: new Date() },
  { id: 4, name: 'Thé', lastBuy: new Date(), next: true },
  { id: 5, name: 'Caffé', lastBuy: new Date() },
  { id: 6, name: 'Yoghurts', lastBuy: null },
  { id: 7, name: 'Eau minérale', lastBuy: new Date() },
  { id: 8, name: 'Bières', lastBuy: null }
];

ReactDom.render(
    <ProductList products={products} />,
    document.querySelector('.root')
);
