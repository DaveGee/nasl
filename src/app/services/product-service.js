import moment from 'moment';
import B from './backendless';
import Config from '../../config';
import {normalize} from '../helpers/strings';
import Security from './security';
import Enums from '../helpers/enums';

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

export function getAllProducts() {
  return B.fetch({
    table: 'products',
    props: ['objectId', 'image', 'name'],
    where: `(ownerId is null or ownerId='${Security.user.userId}')`,
    order: ['name']
  }, true);
}

export function getShoppingList() {
  return B.fetch({
    table: 'shopListItems',
    props: ['objectId', 'productId', 'needed', 'listRef', 'lastBuyTime'],
    where: `listRef='${Security.user.listRef}'`
  }, true);
}

export function setItemBoughtNotNeeded(shopListItem) {
  var now = new Date().toISOString();
  
  if(shopListItem.objectId) 
    return B.update('shopListItems', shopListItem.objectId, 
                    {
                      needed: false,
                      lastBuyTime: boughtRecently(shopListItem.lastBuyTime) ? shopListItem.lastBuyTime : now
                    });
  
  else
    return B.create('shopListItems', Object.assign(
      {
        listRef: Security.user.listRef,
        needed: false,
        lastBuyTime: now
      }
    ));
}

export function cancelLastActions(shopListItem) {
  if(shopListItem.objectId)
    return B.update('shopListItems', shopListItem.objectId, 
                    { 
                      needed: false,
                      lastBuyTime: null // bullshit => this should be the next in history
                    });
                    
  // else if not created, nothing to do
}

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

export function addProduct(name) {

  // find by name
  // if not found, create product with owner = me
  // add/update to my list (+needed)

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
    // product created or retrieved...
    .then(product => setItemState(product.objectId, Enums.ItemState.Needed));
}

// check whether an item has been bought in the last x hours
export function boughtRecently(lastBuyTime) {
  return lastBuyTime && moment(lastBuyTime) >= moment().subtract(24, 'hours'); 
}