import React from 'react';
import ReactDom from 'react-dom';
import First from './app/views/welcome/first';
import ProductList from './app/views/products/product-list';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Identity from './app/services/identity';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Config from './config';


// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const initApp = (userInfos) => {
  Identity.clearToken();
  // register cache, change name, etc..
  if(userInfos) {
    Identity.Cache.Username = userInfos.email;
    Identity.Cache.Name = userInfos.name;
  }
    
  //TODO: no registering here.. account must have been created before
  //TODO: handle private mode (with password...) => userInfos.simpleMode
    
  return Identity.auth(Identity.Cache.Username, Config.anonymousPassword)
            .then(() => Identity.updateName(Identity.Cache.Name))
            .then(() => LaunchApp())
            .catch(res => Welcome('Err: ' + res));
};

const LaunchApp = () => ReactDom.render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <ProductList />
    </MuiThemeProvider>,
    document.querySelector('.root')
  );

const Welcome = (msg) => ReactDom.render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <First message={msg} onConnect={initApp} email={Identity.Cache.Username} name={Identity.Cache.Name} />
    </MuiThemeProvider>,
    document.querySelector('.root')
  );

// if user already never logged in, then go to login screen
if(Identity.Cache.UserToken) {
  Identity.auth(Identity.Cache.Username)
    .then(() => LaunchApp())
    .catch(error => {      
      if(error.response) {
        error.response.json()
          .then(body => Welcome(`${body.code}: ${body.message}`));
        throw error;
      }
      else {
        Welcome(error.message);
        throw error;
      }
    });
}
else {
  Welcome();
} 