//-- Module Dependency
const CrudRepository = require('./CrudRepository');

class ServiceRepository extends CrudRepository{
  constructor(){
    super('services', null);
  }
}

module.exports = new ServiceRepository();