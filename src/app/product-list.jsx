import React from 'react';
import Header from './header';
import ProductListView from './product-list-view';
import { getAllProducts, getShoppingList } from './services/product-service';


// actions : 
// sur tous : "je viens d'en acheter", "il en faut dès que possible"

// filtres : 
//    bientôt à court
//    acheté récemment (et par qui)

// tri : par needed, lastBuy
function productSorter(a, b) {
  // if < 0 => a smaller. if > 0 => b smaller
  let aState = a.shopStatus || { needed: false, lastBuyTime: null };
  let bState = b.shopStatus || { needed: false, lastBuyTime: null };
  
  // products marked as "needed" are always on top
  let needed = !!bState.needed - !!aState.needed;
  if(needed !== 0) return needed;
  
  // products almost empty are sorted by emptyness
  return new Date(bState.lastBuyTime) - new Date(aState.lastBuyTime);
}

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }
  
  matchProducts(products, shoppingList) {
    if(!products) return [];
    shoppingList = shoppingList || [];
    
    shoppingList.forEach(s => {
      let product = products.find(p => p.objectId === s.productId);
      if (product) product.shopStatus = s;  
    });
    
    return products.sort(productSorter);
  }

  componentWillMount() {
    
    // fetch list products quickly then load
    // background fetch rest of products trankouil

    // getMoreProducts(0).then(products => {
    //   this.setState({ products: products.data });
    //   this.nextDataOffset = products.nextDataOffset;
    // });
    
    this.loadData();
  }
  
  loadData() {
    return getAllProducts()
      .then(products => {
        return getShoppingList()
          .then(list => this.matchProducts(products, list));
      })
      .then(data => this.setState({ products: data }));
  }
  
  reloadData() {
    if (this._reloading)
      clearTimeout(this._reloading);
      
    this._reloading = setTimeout(() => {
      this._reloading = null;
      this.loadData();
    }, 1800);
  }

  render() {
    return <div>
      <Header products={this.state.products.map(p => p.name)} />
      <ProductListView products={this.state.products} onItemStateChanged={this.reloadData.bind(this)} />
    </div >;
  }
}