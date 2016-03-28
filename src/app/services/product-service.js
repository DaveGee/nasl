import moment from 'moment';
import B from './backendless';
import Config from '../../config';
import {normalize} from './strings';

export function getMoreProducts(offset) {
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

export function getAllProducts() {
  return B.fetch({
    table: 'products',
    props: ['objectId', 'image', 'name'],
    order: ['name']
  }, true);
}

export function getMyList() {
  return B.fetchAll({
    table: 'shoplist',
    props: [],
    order: []
  }, true);
};

export function addProduct(name) {

  // find by name
  // if not found, create product with owner = me
  // add/update to my list (+needed)

  B.fetch({
            table: 'products',
            props: ['objectId', 'name', 'normalizedName'],
            filter: { colName: 'normalizedName', value: normalize(name) }
          }, false)
    .then(response => {
      if (response.totalObjects === 0)
        return B.createProduct({
                                name: name,
                                normalizedName: normalize(name),
                                image: null
                              }); // create object with owner
      else
        return response.data[0]; // return first found
    })
    .then(theProduct => {
      // add or create record in my list related to this object
      console.log(theProduct);
    });
}