import moment from 'moment';
import B from './backendless';
import Config from '../../config';
import {normalize} from '../helpers/strings';
import Identity from './identity';
import Enums from '../helpers/enums';

class ProductService {
  constructor() { }
  
  get myList() {
    return this._list;
  }

  /**
   * get product paged on default paged size. Use for an "infinite scroll" load style
   * 
   */
  getMoreProducts(offset) {
    return B.fetch({
      table: 'products',
      props: ['objectId', 'image', 'name'],
      order: ['name'],
      startAt: offset || 0
    }, false)
      .then(function(response) {
        return {
          data: response.data,
          nextDataOffset: response.nextPage ?
            response.offset + Config.defaultPageSize : null
        }
      });
  };

  /**
   * Recursively load all product so they're all available at once
   * 
   */
  getAllProducts() {
    return B.fetch({
      table: 'products',
      props: ['objectId', 'image', 'name'],
      order: ['name']
    }, true);
  }

  /**
   * load items for the current list of the user (item states etc...)
   * 
   */
  loadShoppingList() {
    if(Identity.user.list && Identity.user.objectId)
      return B.fetchOne('users', Identity.user.objectId)
        .then(user => {
          Identity.user.lost = user.list;
          return user.list;
        });
    else
      return B.update('users', Identity.user.objectId, {
        list: {
          humanRef: Identity.user.name + '\'s list',
          items: [],
          ___class: 'lists'
        }
      })
      .then(user => {
        Identity.user.list = user.list;
        return user.list;
      });
  }

  /**
   * reset the buy status of a product => not needed, cancel recent buy (go back in history)
   * 
   */
  cancelLastActions(shopListItem) {
    if (shopListItem.objectId) {
      
      let previous = null;
      if(shopListItem.history) {
        shopListItem.history.sort(function(a, b) {
          return new Date(a.buyTime) - new Date(b.buyTime);
        });
        
        shopListItem.history.shift();
        
        if(shopListItem.history.length > 0)
          previous = shopListItem.history[0];
      }
      
      shopListItem.needed = false;
      shopListItem.lastBuyTime = previous;
      
      return B.update('listItems', shopListItem.objectId, shopListItem)
        .then(() => previous);
    }
  }
  
  /**
   * save the state of a product as "Bought" => not needed anymore
   * 
   */
  setItemBoughtNotNeeded(shopListItem, timeStr) {
    let now = timeStr || new Date().toISOString();
    
    let diff = {
          needed: false,
          lastBuyTime: now,
          ___class: 'listItems',
          history: [{
            buyTime: now,
            ___class: 'buyingLog'
          }]
        };
    
    if (shopListItem.objectId)
      return B.update('listItems', shopListItem.objectId, diff);
    else
      return B.update('lists', Identity.user.list.objectId,
        {
          items: [
            Object.assign(diff, shopListItem)
          ]
        });
  }

  /**
   * saves the state of a product as needed in the list
   * 
   */
  setItemNeeded(shopListItem) {
    let diff = {
                  needed: true,
                  ___class: 'listItems'
               };
    // if item does not exist in list yet
    if (shopListItem.objectId)
      return B.update('listItems', shopListItem.objectId, diff);
    else
      return B.update('lists', Identity.user.list.objectId,
        {
          items: [
            Object.assign(diff, shopListItem)
          ]
        });
  }

  /**
   * add a new product in the list (the product will be available only to the current user, not 
   * in the global list of product.)
   * Typically called from "search+add" product in the title bar (popup)
   * 
   */
  addProduct(name) {

    return B.fetch({
      table: 'products',
      props: ['objectId', 'name', 'normalizedName'],
      filters: [{ colName: 'normalizedName', value: normalize(name) }]
    }, false)
      // product found ?      
      .then(response => {

        if (response.totalObjects === 0)
          return B.create('products', {
            name: name,
            normalizedName: normalize(name),
            image: null
          }); // create object with owner
        else
          return response.data[0]; // return first found
      })
      // product created or retrieved...=> set as needed
      .then(product => {
        let item = { product: product }; // create a new one if none found
        // find item related to product in the cache
        if(Identity.user.list)
          item = Identity.user.list.items.find(i => i.product.objectId === product.objectId) || { product: product };
        
        // save new item in backend
        return this.setItemNeeded(item)
          .then(() => product);
      });
  }

  /**
   * check whether an item has been bought in the last x hours
   * 
   */
  boughtRecently(itemOrTime) {
    if(itemOrTime && typeof itemOrTime === 'object') {
      itemOrTime = itemOrTime.lastBuyTime;
    }
      
    return itemOrTime && moment(itemOrTime) >= moment().subtract(24, 'hours');
  }
}

export default new ProductService();