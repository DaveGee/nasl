import { remove } from 'diacritics';

export function normalize(str) {
  if(!str) return str;
  
  return remove(str.trim().toLowerCase()).replace(/[^a-z0-9]+/g, '_');
}

export function encode(str) {
  if(!str) return str;
  
  return encodeURIComponent(str.trim()).replace(/\./g, '%2E');
}