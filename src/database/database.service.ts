import { Injectable } from '@nestjs/common';
import Datastore = require('nedb-promises');

@Injectable()
export class DatabaseService {
  readonly db: Datastore;
  constructor() {
    this.db = Datastore.create('./store.db')
  }
  async get(id: string) {
    return this.db.findOne({'_id': id});
  }
  async insert(obj) {
    return this.db.insert(obj);
  }
  async find(field) {
    return this.db.find(field);
  }
  async remove(obj) {
    await this.db.remove({ _id: obj._id }, {});
  }
  async set(obj, prop) {
    await this.db.update({ _id: obj._id }, { $set: prop });
  }
  async replace(obj) {
    await this.db.update({ _id: obj._id }, obj);
  }
}
