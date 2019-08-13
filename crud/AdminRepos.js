//-- Module Dependency
const CrudRepository = require('./CrudRepository');

class AdminRepository extends CrudRepository{
  constructor(){
    super('admins', null);
  }
}

module.exports = new AdminRepository();