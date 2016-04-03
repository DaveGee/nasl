import React from 'react';
import Header from './header';
import ProductListView from './product-list-view';
import ProductService from './services/product-service';
import Identity from './services/identity';


// actions : 
// sur tous : "je viens d'en acheter", "il en faut dès que possible"

// filtres : 
//    bientôt à court
//    acheté récemment (et par qui)

// tri : par needed, lastBuy
function productSorter(a, b) {
  // if < 0 => a smaller. if > 0 => b smaller
  let aState = a || { needed: false, lastBuyTime: null };
  let bState = b || { needed: false, lastBuyTime: null };
  
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
      items: []
    };
  }
  
  componentWillMount() {  
    this.loadData(true, false); // list is already in Identity
  }
  
  mergeItems(products, list) {
    list = list || { items: [] };
    return products.map(p => list.items.find(i => i.product.objectId === p.objectId) || { product: p }).sort(productSorter);
  }
  
  loadData(reloadProduct = false, reloadList = false) {
    
    let productLoader = reloadProduct ?
      ProductService.getAllProducts :
      function() { return Promise.resolve(this._products); }.bind(this);
    
    let listLoader = reloadList ?
      ProductService.loadShoppingList :
      function() { return Promise.resolve(Identity.user.list); }.bind(this);
    
    return productLoader()
      .then(products => {
        this._products = products;
        
        return listLoader()
          .then(list => this.mergeItems(products, list))
          .catch(() => this.mergeItems(products));
      })
      .then(data => this.setState({ items: data }));
  }
  
  reloadItems(reloadProduct = false, reloadList = false) {
    if (this._reloading)
      clearTimeout(this._reloading);
      
    this._reloading = setTimeout(() => {
      this._reloading = null;
      this.loadData(reloadProduct, reloadList);
    }, 1500);
  }
  
  handleNewProduct(product) {
    reloadItems();
  }

  render() {
    return <div>
      <Header products={this.state.items.map(i => i.product.name)} onProductSelected={this.reloadItems.bind(this, true, true)} />
      <ProductListView items={this.state.items} onItemStateChanged={this.reloadItems.bind(this, false, true)} />
    </div >;
  }
}