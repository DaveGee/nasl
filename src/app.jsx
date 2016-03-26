import React from 'react';
import ReactDom from 'react-dom';
import ProductList from './app/product-list';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ReactDom.render(
    <ProductList />,
    document.querySelector('.root')
);
