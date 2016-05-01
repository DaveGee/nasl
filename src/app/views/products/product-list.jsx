import React from 'react';
import Header from '../header/header';
import ProductListView from './product-list-view';
import ProductService from '../../services/product-service';
import Identity from '../../services/identity';
import Config from '../../../config';

// actions : 
// sur tous : "je viens d'en acheter", "il en faut dès que possible"

// filtres : 
//    bientôt à court
//    acheté récemment (et par qui)

// tri : par needed, lastBuy
function productSorter(a, b) {
  
  // if < 0 => a smaller. if > 0 => b smaller
  a = Object.assign({ needed: false, lastBuyTime: null }, a);
  b = Object.assign({ needed: false, lastBuyTime: null }, b);
  
  // products marked as "needed" are always on top
  let needed = !!b.needed - !!a.needed;
  if (needed !== 0) return needed;
  
  // products almost empty are sorted by emptyness
  let dateCompare = new Date(b.lastBuyTime) - new Date(a.lastBuyTime);
  if (dateCompare !== 0) return dateCompare;
  
  if (a.product.normalizedName < b.product.normalizedName) return -1;
  if (a.product.normalizedName > b.product.normalizedName) return 1;
  return 0;
}

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      otherListUsers: []
    };
  }
  
  componentWillMount() {  
    this.loadList(true)  // login did cache initial list
      .then(() => this.loadProducts());
  }
  
  mergeItems(products, items) {
    items = items || [];
    if(!products || products.length === 0) return items.sort(productSorter);
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
    let listLoader = cache && Identity.User.list ?
    function() { return Promise.resolve(Identity.User.list); }.bind(this) :
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
    }, Config.refreshInterval);
  }
  
  addItem(selected) {
    ProductService.addProduct(selected)
      .then(p => this._products.push(p))
      .then(() => this.reloadItemsDelayed());
  }
  
  joinList() {
    console.log('join list');
  }
  
  componentDidMount() {
    this.refreshUsers();
  }
  
  refreshUsers() {
    console.log('refresh');
    // load additional things
    console.log('load others on the list');
    Identity.getListParticipants()
      .then(names => this.setState({ otherListUsers: names }));
  }

  render() {
    return <div>
      <Header products={this.state.items.map(i => i.product.name)}
              userInfos={Identity.User}
              onAddItem={this.addItem.bind(this)}
              onJoinList={this.joinList.bind(this)}
              otherListUsers={this.state.otherListUsers}
              onRefreshUsers={() => this.refreshUsers()}
              />
      <ProductListView items={this.state.items} 
                       onItemStateChanged={this.reloadItemsDelayed.bind(this)} />
    </div >;
  }
}