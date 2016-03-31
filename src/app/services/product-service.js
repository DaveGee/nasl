import moment from 'moment';
import B from './backendless';
import Config from '../../config';
import {normalize} from '../helpers/strings';
import Security from './security';
import Enums from '../helpers/enums';

/**
 * get product paged on default paged size. Use for an "infinite scroll" load style
 * 
 */
export function getMoreProducts(offset) {
  return B.fetch({
    table: 'products',
    props: ['objectId', 'image', 'name'],
    where: `(ownerId is null or ownerId='${Security.user.userId}')`,
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
export function getAllProducts() {
  return B.fetch({
    table: 'products',
    props: ['objectId', 'image', 'name'],
    where: `(ownerId is null or ownerId='${Security.user.userId}')`,
    order: ['name']
  }, true);
}

/**
 * Get items for the current list of the user (item states etc...)
 * 
 */
export function getShoppingList() {
  return B.fetch({
    table: 'shopListItems',
    props: ['objectId', 'productId', 'needed', 'listRef', 'lastBuyTime'],
    where: `listRef='${Security.user.listRef}'`
  }, true);
}

/**
 * save the state of a product as "Bought" => not needed anymore
 * 
 */
export function setItemBoughtNotNeeded(shopListItem) {
  var now = new Date().toISOString();
  
  if(shopListItem.objectId) 
    return B.update('shopListItems', shopListItem.objectId, 
                    {
                      needed: false,
                      lastBuyTime: boughtRecently(shopListItem.lastBuyTime) ? shopListItem.lastBuyTime : now,
                      history: boughtRecently(shopListItem.lastBuyTime) ? [] : [{
                        buyingDateTime: now,
                        ___class: 'buyingLog'
                      }] 
                    });
  
  else
    return B.create('shopListItems', Object.assign(
      {
        listRef: Security.user.listRef,
        needed: false,
        lastBuyTime: now,
        history: [{
          buyingDateTime: now,
          ___class: 'buyingLog'
        }]
      }, shopListItem
    ));
}

/**
 * reset the buy status of a product => not needed, cancel recent buy (go back in history)
 * 
 */
export function cancelLastActions(shopListItem) {
  if(shopListItem.objectId)
    return B.fetchOne('shopListItems', shopListItem.objectId)
      .then(item => {
        let history = item.history.sort(function(a, b) {
          return new Date(b.buyingDateTime) - new Date(a.buyingDateTime);
        });
        
        history.shift();
        //TODO should delete entity log and not only relation! (delete by date, no need to retrieve whole list)
        return B.update('shopListItems', shopListItem.objectId, 
                        Object.assign({ 
                          needed: false,
                          lastBuyTime: history.length > 0 ? history[0].buyingDateTime : null,
                          history: history
                        }, item));
      });
                    
  // else if not created, nothing to do
}

/**
 * saves the state of a product as needed in the list
 * 
 */
export function setItemNeeded(shopListItem) {
  
  // if object was just created by the front (no id)
  if (shopListItem.objectId) 
    return B.update('shopListItems', shopListItem.objectId, 
        { 
          needed: true
        });
        
  else
    return B.create('shopListItems', Object.assign(
      { 
        listRef: Security.user.listRef,
        needed: true 
      }, shopListItem));
}

/**
 * add a new product in the list (the product will be available only to the current user, not 
 * in the global list of product.)
 * Typically called from "search+add" product in the title bar (popup)
 * 
 */
export function addProduct(name) {

  return B.fetch({
            table: 'products',
            props: ['objectId', 'name', 'normalizedName'],
            where: `(ownerId is null or ownerId='${Security.user.userId}')`,
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
    .then(product => setItemNeeded({ productId: product.objectId }));
}

/**
 * check whether an item has been bought in the last x hours
 * 
 */
export function boughtRecently(lastBuyTime) {
  return lastBuyTime && moment(lastBuyTime) >= moment().subtract(24, 'hours'); 
}