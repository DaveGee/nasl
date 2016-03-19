import React from 'react';

export default class AllProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: props.allProducts
    };
  }
  
  render() {
    return <div className="all-products">
        All Products
      </div>
  }
}