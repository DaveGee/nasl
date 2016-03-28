import React from 'react';
import Header from './header';
import ProductListView from './product-list-view';
import { getAllProducts } from './services/product-service';


// actions : 
// sur tous : "je viens d'en acheter", "il en faut dès que possible"

// filtres : 
//    bientôt à court
//    acheté récemment (et par qui)

// tri : par needed, lastBuy
function productSorter(a, b) {
  // if < 0 => a smaller. if > 0 => b smaller
  
  // products marked as "needed" are always on top
  let needed = !!b.flagNeeded - !!a.flagNeeded;
  if(needed !== 0) return needed;
  
  // products almost empty are sorted by emptyness
  return new Date(b.lastBuyTime) - new Date(a.lastBuyTime);
}

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  componentWillMount() {
    
    // fetch list products quickly then load
    // background fetch rest of products trankouil

    // getMoreProducts(0).then(products => {
    //   this.setState({ products: products.data });
    //   this.nextDataOffset = products.nextDataOffset;
    // });
    
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