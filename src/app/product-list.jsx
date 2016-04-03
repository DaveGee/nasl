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
    this.loadList(true)  // login did cache initial list
      .then(() => this.loadProducts());
  }
  
  mergeItems(products, items) {
    items = items || [];
    if(!products || products.length === 0) return items;
    return products.map(p => items.find(i => i.product.objectId === p.objectId) || { product: p }).sort(productSorter);
  }
  
  loadProducts() {
    return ProductService.getAllProducts()
      .then(products => {
        this._products = products; //cache list of products, this should not be reloaded during use
        
        return this.loadList(true);
      });
  }
  
  loadList(cache = false) {
    let listLoader = cache && Identity.user.list ?
    function() { return Promise.resolve(Identity.user.list); }.bind(this) :
    ProductService.loadShoppingList;
    
    return listLoader()
      .then(list => {
        return Promise.resolve(this._products || [])
          .then(products => this.mergeItems(products, list.items));
      })
      .then(data => this.setState({ items: data }));
  }
  
  reloadItemsDelayed() {
    if (this._reloading)
      clearTimeout(this._reloading);
      
    this._reloading = setTimeout(() => {
      this._reloading = null;
      this.loadList();
    }, 1500);
  }
  
  handleNewProduct(product) {
    // add product to cache
    this._products.push(product);
    this.reloadItemsDelayed();
  }

  render() {
    return <div>
      <Header products={this.state.items.map(i => i.product.name)} onProductSelected={this.handleNewProduct.bind(this)} />
      <ProductListView items={this.state.items} onItemStateChanged={this.reloadItemsDelayed.bind(this)} />
    </div >;
  }
}