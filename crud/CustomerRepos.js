//-- Module Dependency
const CrudRepository = require('./CrudRepository');

class CustomerRepository extends CrudRepository{
  constructor(){
    super('customers', null);
  }
}

module.exports = new CustomerRepository();