import React from 'react';
import ReactDom from 'react-dom';
import Header from './app/header';
import ProductList from './app/product-list';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Security from './app/services/security';
import Dialog from 'material-ui/lib/dialog';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

Security.auth()
  .then(() => {
    ReactDom.render(
      <ProductList />,
      document.querySelector('.root')
    );    
  })
  .catch(error => {
    error.response.json()
      .then(body => {
        ReactDom.render(
          <Dialog
            title="Error at login"
            modal={true}
            open={true}
          >
            {body.code}: {body.message}
          </Dialog>,          
          document.querySelector('.root')
        );
      });
  });
