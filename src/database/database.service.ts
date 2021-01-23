import { BadRequestException, Injectable } from '@nestjs/common';
import Datastore = require('nedb-promises');
import { RangeDTO } from './range.dto';

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

  async runID(id: string, func) {
    const item = await this.get(id);
    return func(item);
  }
  async runIDs(ids: string[], func) {
    const response = [];
    for(const id of ids) {
      response.push(await this.runID(id, func));
    }
    return response;
  }
  async runField(field, func) {
    const items = await this.find(field);
    const response = [];
    for (const item of items) {      
      response.push(await func(item));
    }
    return response;
  }
  rangeHandler(range: RangeDTO, func) {
    if (range.id) {
      if (range.ids || range.field) throw new BadRequestException();
      return this.runID(range.id, func);
    }
    if (range.ids) {
      if (range.id || range.field) throw new BadRequestException();
      return this.runIDs(range.ids, func);
    }
    if (range.field) {
      if (range.id || range.ids) throw new BadRequestException();
      return this.runField(range.field, func);
    }
  }
}
