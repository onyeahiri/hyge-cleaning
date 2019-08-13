//-- Module Dependency
const CrudRepository = require('./CrudRepository');

class TransactionRepository extends CrudRepository{
  constructor(){
    super('transactions', null);
  }
}

module.exports = new TransactionRepository();