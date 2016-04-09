/* global Backendless */

'use strict';

class ListItems extends Backendless.ServerCode.PersistenceItem {
  constructor() {
    super();
    
    /**
     @name ListItems#needed
     @type Boolean
     */
    this.needed = undefined;

    /**
     @name ListItems#product
     @type Products
     */
    this.product = undefined;

    /**
     @name ListItems#history
     @type Array.<BuyingLog>
     */
    this.history = undefined;

    /**
     @name ListItems#lastBuyTime
     @type String
     */
    this.lastBuyTime = undefined;

  }
}

module.exports = Backendless.ServerCode.addType(ListItems);