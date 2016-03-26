
import moment from 'moment';

var products = [
  { id: 1, name: 'Lait', lastBuy: null, image: 'http://images.all-free-download.com/images/graphiclarge/glass_of_milk_200243.jpg' },
  { id: 2, name: 'Sucre', lastBuy: moment(), image: 'http://images.all-free-download.com/images/graphiclarge/crystal_flavor_sugar_237691.jpg' },
  { id: 3, name: 'Sel', lastBuy: null, image: 'http://images.all-free-download.com/images/graphiclarge/salt_nature_eat_215510.jpg' },
  { id: 4, name: 'Thé', lastBuy: moment(), image: 'http://images.all-free-download.com/images/graphiclarge/mint_tea_185149.jpg' },
  { id: 5, name: 'Café', lastBuy: moment(), image: 'http://images.all-free-download.com/images/graphiclarge/coffee_sugar_bica_236903.jpg' },
  { id: 6, name: 'Yoghurts', lastBuy: null },
  { id: 7, name: 'Eau minérale', lastBuy: moment(), image: 'http://images.all-free-download.com/images/graphiclarge/water_minerals_bottle_270951.jpg' },
  { id: 8, name: 'Bières', lastBuy: null },
  { id: 9, name: 'Tablettes machine à laver', lastBuy: null },
  { id: 10, name: 'P.Q.', lastBuy: null },
  
];

function getNextId() {
  return products.map(p => p.id).reduce((previous, current) => Math.max(previous, current)) + 2;
}

export function getAllProducts() {
  return products;
};

export function addProduct(name) {
  let found = products.find(p => p.name == name);
  
  if(found) return found;
  
  let newProduct = {
    // common props
    id: getNextId(),
    name: name,
    lastBuy: null,
    image: null,
    
    // personalized props 
    needed: true,
    bought: false
  };
  
  products.push(newProduct);
  
  return newProduct;
}

export function getAllProductsNames() {
  return products.map(p => p.name);
}