
import moment from 'moment';

function getNextId() {
  return products.map(p => p.id).reduce((previous, current) => Math.max(previous, current)) + 2;
}

function fetchProducts() {
  return fetch('/data/products.json')
      .then(response => response.json());
} 

export function getAllProducts() {
  return fetchProducts();
};

export function addProduct(name) {
  let found = products.find(p => p.name == name);
  
  if(found) return found;
  
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