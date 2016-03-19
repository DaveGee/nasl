import React from 'react';
import ReactDom from 'react-dom';
import AllProducts from './app/all-products';
import NextTrip from './app/next-trip';

var products = ['Lait', 'Sucre', 'Sel', 'Truc pas utile', 'Thé'];
var toBuy = [];

ReactDom.render(
    toBuy.length ? <NextTrip /> : <AllProducts />,
    document.querySelector('.root')
);
