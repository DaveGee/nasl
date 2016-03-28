import moment from 'moment';
import B from './backendless';
import Config from '../../config';

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
  let found = products.find(p => p.name == name);

  if (found) return found;

  let newProduct = {
    // common props
    id: getNextId(),
    name: name,
    lastBuyTime: null,
    image: null,

    // personalized props 
    needed: true,
    bought: false
  };

  //products.push(newProduct);

  return newProduct;
}