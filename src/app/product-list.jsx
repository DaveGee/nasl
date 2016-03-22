import React from 'react';
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import Subheader from 'material-ui/lib/Subheader';
import ProductItem from './product-item';


export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myList: props.products.filter(p => !!p.lastBuy),
      allProducts: props.products.filter(p => !!!p.lastBuy)
    };
  }
  
  componentWillMount() { }
  
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
    
    return <div>
        <List>
          <Subheader inset={true}>Ma liste habituelle</Subheader>
          {this.state.myList.map(toItem)}
        </List>
        <Divider inset={true} />
        <Subheader inset={true}>Tous les autres produits</Subheader>
        <List>
          {this.state.allProducts.map(toItem)}
        </List>
      </div>;
  }
}