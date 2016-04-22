import React from 'react';
import ReactDom from 'react-dom';
import First from './app/views/welcome/first';
import ProductList from './app/views/products/product-list';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Identity from './app/services/identity';
import Dialog from 'material-ui/dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';


// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// mode sans login:
  // n'importe qui peut utiliser la liste (indication des connexion dans le menu)
  // ideal pour rejoindre la liste de qq1
  // compte effacé lorsque pas d'activité depuis XXX
  // impossible de récupérer la liste si le local storage est perdu
// mode avec mot de passe
  // securiser l'acces à la liste

// demander Nom + mode (anonyme/registered)
  // anonyme : creer compte temp avec mot de passe par default
  // creer/rejoindre liste
  // pas anonyme :
  
//const theme = darkBaseTheme;
  
function renderError(code, message) {
  ReactDom.render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          title="Error at login"
          modal={true}
          open={true}
        >
          {code}: {message}
        </Dialog>
    </MuiThemeProvider>,          
    document.querySelector('.root')
  );
} 
  
if(!Identity.isUnknown()) {
  ReactDom.render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <First />
    </MuiThemeProvider>,
    document.querySelector('.root')
  );
}
else {

  Identity.auth()
    .then(() => {
      ReactDom.render(
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <ProductList />
        </MuiThemeProvider>,
        document.querySelector('.root')
      );    
    })
    .catch(error => {      
      if(error.response) {
        error.response.json()
          .then(body => renderError(body.code, body.message));
        throw error;
      }
      else {
        renderError(0, error.message);
        throw error;
      }
    });
}