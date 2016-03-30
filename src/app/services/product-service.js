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

export function setItemState(productId, state) {
  // get shop list item by product id in my list
    // if doesn't exist, create
    // if exists, change state 
  
      
  // exists in my shoplist ?
  return B.fetch({
    table: 'shopListItems',
    props: ['state', 'lastBuyTime', 'objectId', 'productId', 'listRef'],
    filters: [
      { colName: 'productId', value: productId },
      { colName: 'listRef', value: Security.user.listRef }
    ]
  }, false)
  
  // item found in shoplist ? (404 if shoplist does not exist)
  .then(response => {
    
    if(!response.totalObjects || response.totalObjects === 0)
      return B.create('shopListItems', {
        productId: productId,
        state: state,
        lastBuyTime: null,
        listRef: Security.user.listRef
      });
    else
      return B.update('shopListItems', response.data[0].objectId, { state: state });
  });
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