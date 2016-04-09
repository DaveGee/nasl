import React from 'react';
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import Subheader from 'material-ui/lib/Subheader';
import ProductItem from './product-item';
import IconButton from 'material-ui/lib/icon-button';
import ProductService from './services/product-service';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
    var toItem = (item) => {
      return <ProductItem key={item.product.objectId}
        item={item} onItemStateChanged={this.handleChange.bind(this)} />;
    };
    
    function isInShopList(item) {
      return item.needed || ProductService.boughtRecently(item);
    }

    return <div>
      <List>
        <Subheader inset={true}>Ma liste habituelle</Subheader>
        <ReactCSSTransitionGroup transitionName="mylist" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {this.props.items.filter(p => isInShopList(p)).map(toItem) }
        </ReactCSSTransitionGroup>
      </List>
      <Divider inset={true} />
      <List>
        <Subheader inset={true}>Tous les autres produits</Subheader>
        {this.props.items.filter(p => !isInShopList(p)).map(toItem) }
      </List>
    </div >;
  }
}