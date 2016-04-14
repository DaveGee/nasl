module.exports = {
  normalize: function(str) {
    if(!str) return str;
    
    return require('diacritics').remove(str.trim().toLowerCase()).replace(/[^a-z0-9]+/g, '_');
  }
};