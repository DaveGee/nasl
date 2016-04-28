import moment from 'moment';
import B from '../data/backendless';
import Config from '../../config';
import {normalize} from '../helpers/strings';
import Identity from './identity';
import Enums from '../helpers/enums';
import {meanBuyInterval} from '../business/stock-manager';

class ProductService {
  constructor(database) { 
    
  }
  
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
      where: `(ownerId is null or ownerId='${Identity.User.objectId}')`,
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
      props: ['objectId', 'image', 'name', 'normalizedName'],
      where: `(ownerId is null or ownerId='${Identity.User.objectId}')`,
      order: ['name']
    }, true);
  }

  /**
   * load items for the current list of the user (item states etc...)
   * 
   */
  loadShoppingList() {
    if(Identity.User.list && Identity.User.userId)
      return B.fetchOne('users', Identity.User.userId)
        .then(user => {
          Identity.User.list = user.list;
          return user.list;
        });
    else
      return B.update('users', Identity.User.userId, {
        list: {
          humanRef: null,
          items: [],
          ___class: 'lists'
        }
      })
      .then(user => {
        Identity.User.list = user.list;
        return user.list;
      });
  }

  /**
   * reset the buy status of a product => not needed, cancel recent buy (go back in history)
   * 
   */
  cancelLastActions(shopListItem) {
    if (shopListItem.objectId) {
      
      var lastBuyTime = shopListItem.lastBuyTime;
      
      if(this.boughtRecently(shopListItem)
        && shopListItem.history && shopListItem.history.length > 0) {
          
        shopListItem.history.sort(function(a, b) {
          return new Date(b.buyTime) - new Date(a.buyTime);
        });
        
        lastBuyTime = shopListItem.history.length > 1 ? shopListItem.history[1].buyTime : null;
        
        B.delete('buyingLog', shopListItem.history[0].objectId);
      }
      
      return B.update('listItems', shopListItem.objectId, {
        needed: false,
        lastBuyTime: lastBuyTime,
        meanBuyInterval: meanBuyInterval(shopListItem)
      })
      .then(() => lastBuyTime);
    }
  }
  
  /**
   * save the state of a product as "Bought" => not needed anymore
   * 
   */
  setItemBoughtNotNeeded(shopListItem, timeStr) {
    let now = timeStr || new Date().toISOString();
    
    // if timeStr is the same, it means we are buying something we bought recently => don't update history
    let updateHistory = shopListItem.lastBuyTime !== now ?
       [{ buyTime: now, ___class: 'buyingLog' }] : [];
    
    let diff = {
          needed: false,
          lastBuyTime: now,
          ___class: 'listItems',
          history: updateHistory,
          meanBuyInterval: meanBuyInterval(shopListItem)
        };
    
    if (shopListItem.objectId)
      return B.update('listItems', shopListItem.objectId, diff);
    else
      return B.update('lists', Identity.User.list.objectId,
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
                  meanBuyInterval: meanBuyInterval(shopListItem),
                  needed: true,
                  ___class: 'listItems'
               };
    // if item does not exist in list yet
    if (shopListItem.objectId)
      return B.update('listItems', shopListItem.objectId, diff);
    else
      return B.update('lists', Identity.User.list.objectId,
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
      where: `(ownerId is null or ownerId='${Identity.User.objectId}')`,
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
        if(Identity.User.list)
          item = Identity.User.list.items.find(i => i.product.objectId === product.objectId) || { product: product };
        
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