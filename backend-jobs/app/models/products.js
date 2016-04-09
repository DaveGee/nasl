/* global Backendless */

'use strict';

class Products extends Backendless.ServerCode.PersistenceItem {
  constructor() {
    super();
    
    /**
     @name Products#name
     @type String
     */
    this.name = undefined;

    /**
     @name Products#image
     @type String
     */
    this.image = undefined;

    /**
     @name Products#normalizedName
     @type String
     */
    this.normalizedName = undefined;

  }
}

module.exports = Backendless.ServerCode.addType(Products);