import { remove } from 'diacritics';

export function normalize(str) {
  if(!str) return str;
  
  return remove(str.trim().toLowerCase()).replace(/[^a-z0-9]+/g, '_');
}