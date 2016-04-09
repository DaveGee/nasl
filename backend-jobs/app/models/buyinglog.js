/* global Backendless */

'use strict';

class BuyingLog extends Backendless.ServerCode.PersistenceItem {
  constructor() {
    super();
    
    /**
     @name BuyingLog#buyTime
     @type String
     */
    this.buyTime = undefined;

  }
}

module.exports = Backendless.ServerCode.addType(BuyingLog);