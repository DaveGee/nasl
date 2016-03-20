import React from 'react';
import ProductList from './product-list';
import Divider from 'material-ui/lib/divider';

export default class AllProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: props.products,
      shoppingList: props.toBuy
    };
  }
  
  render() {
    return <div>
        <ProductList products={this.state.shoppingList} />
        <Divider inset={true} />
        <ProductList products={this.state.products} />
      </div>;
  }
}