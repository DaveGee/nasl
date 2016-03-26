import React from 'react';
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import Subheader from 'material-ui/lib/Subheader';
import AppBar from 'material-ui/lib/app-bar';
import ProductItem from './product-item';
import IconButton from 'material-ui/lib/icon-button';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import AutoComplete from 'material-ui/lib/auto-complete';
import { getAllProducts, getAllProductsNames, addProduct } from './services/product-service';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
      
    this.state = {
      products: getAllProducts(),
      addingItem: false
    };
  }

  componentWillMount() { }
  
  addItem() {
    let test = addProduct(this._autoComplete.state.searchText);
    //this.state.products.push(test);
    this.closeDialog();
  }

  openDialogAdd() {
    this.setState({ addingItem: true });
  }
  
  closeDialog() {
    this.setState({ addingItem: false });
  }

  render() {
    var toItem = function(product) {
      // actions : 
      // sur tous : "je viens d'en acheter", "il en faut dès que possible"

      // filtres : 
      //    bientôt à court
      //    acheté récemment (et par qui)

      // tri : par needed, lastBuy

      return <ProductItem key={product.id}
        product={product} />;
    };

    const buttonAdd = <IconButton touch={true} 
                                 onTouchTap={this.openDialogAdd.bind(this)}
                                 iconClassName="material-icons">add
                     </IconButton>;
    
    const actions = [
      <FlatButton
        label="Annuler"
        secondary={true}
        onTouchTap={this.closeDialog.bind(this)}
      />,
      <FlatButton
        label="Ajouter"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.addItem.bind(this)}
      />,
    ];  

    return <div>
      <AppBar title="Les courses" 
              iconElementRight={buttonAdd} 
              />
      <Dialog
          title="Ajouter un truc à la liste"
          actions={actions}
          modal={false}
          open={this.state.addingItem}
          onRequestClose={this.closeDialog.bind(this)}
          >
            <AutoComplete
              hintText="De quoi avez-vous besoin ?"
              dataSource={getAllProductsNames()}
              filter={AutoComplete.fuzzyFilter}
              ref={(c) => this._autoComplete = c} 
            />
          </Dialog>
      <List>
        <Subheader inset={true}>Ma liste habituelle</Subheader>
        {this.state.products.filter(p => !!p.lastBuy).map(toItem) }
      </List>
      <Divider inset={true} />
      <List>
        <Subheader inset={true}>Tous les autres produits</Subheader>
        {this.state.products.filter(p => !!!p.lastBuy).map(toItem) }
      </List>
    </div>;
  }
}