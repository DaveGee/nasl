import React from 'react';
import Header from './header';
import ProductListView from './product-list-view';
import { getAllProducts } from './services/product-service';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  componentWillMount() {
    getAllProducts().then(data => this.setState({ products: data }));
  }
  componentWillUnmount() {

  }

  render() {
    return <div>
      <Header products={this.state.products.map(p => p.name)} />
      <ProductListView products={this.state.products} />
    </div >;
  }
}