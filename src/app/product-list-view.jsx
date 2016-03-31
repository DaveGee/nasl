import React from 'react';
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import Subheader from 'material-ui/lib/Subheader';
import ProductItem from './product-item';
import IconButton from 'material-ui/lib/icon-button';
import { getAllProducts, boughtRecently } from './services/product-service';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  
  handleChange() {
    this.props.onItemStateChanged();
  }

  render() {
    var toItem = (product) => {
      return <ProductItem key={product.objectId}
        product={product} shopStatus={product.shopStatus} 
        onItemStateChanged={this.handleChange.bind(this)} />;
    };
    
    function isInShopList(product) {
      return product.shopStatus && (product.shopStatus.needed || boughtRecently(product.shopStatus.lastBuyTime));
    }

    return <div>
      <List>
        <Subheader inset={true}>Ma liste habituelle</Subheader>
        {this.props.products.filter(p => isInShopList(p)).map(toItem) }
      </List>
      <Divider inset={true} />
      <List>
        <Subheader inset={true}>Tous les autres produits</Subheader>
        {this.props.products.filter(p => !isInShopList(p)).map(toItem) }
      </List>
    </div >;
  }
}