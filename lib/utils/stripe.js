'use strict';

module.exports = {
  accountType: (type) => {
    if (type === 'driver') return 'connect';
    else return 'customer';
  }
}