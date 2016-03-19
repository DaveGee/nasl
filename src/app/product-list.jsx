import React from 'react';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: props.productList
    };
  }
  
  componentWillMount() { }
  
  render() {
    return <ul>
        <li>Lait</li>  
        <li>Sucre</li>
        <li>Sel</li>
        <li>Truc pas nécessaire</li>
      </ul>;
  }
}