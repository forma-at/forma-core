import { FilterQuery, Collection } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { databaseClient } from '../utils';

type EntityConstructor<T> = new (raw: any) => T;

export abstract class BaseRepository<T> {

  // Entity class
  private readonly entity: EntityConstructor<T>;

  // MongoDB collection name
  private readonly collection: string;

  // BaseRepository constructor
  protected constructor(entity: EntityConstructor<T>, collection: string) {
    this.entity = entity;
    this.collection = collection;
  }

  // Database connection to specified collection
  db(): Collection {
    return databaseClient.db().collection(this.collection);
  }

  // Create entity
  async create(params: Partial<Omit<T, 'id'>>): Promise<T> {
    const now = Date.now();
    const result = await this.db().insertOne({
      id: uuid(),
      ...params,
      createdAt: now,
      updatedAt: now,
    });
    return new this.entity(result.ops[0]);
  }

  // Find one entry in the collection
  async findOne(filter: FilterQuery<T>): Promise<T> {
    const result = await this.db().findOne(filter);
    if (result) {
      return new this.entity(result);
    }
  }

  // Find many entries in the collection
  async findMany(filter: FilterQuery<T>): Promise<T[]> {
    const results = await this.db().find(filter);
    const arrayResults = await results.toArray();
    return arrayResults.map(item => new this.entity(item));
  }

}
