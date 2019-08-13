//-- Module Dependency
const CrudRepository = require('./CrudRepository');

class BookingRepository extends CrudRepository{
  constructor(){
    super('bookings', null);
  }
}

module.exports = new BookingRepository();