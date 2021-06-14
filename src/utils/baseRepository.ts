import { FilterQuery, Collection } from 'mongodb';
import { databaseClient } from './databaseClient';

type EntityConstructor<T> = new (raw: unknown) => T;

export abstract class BaseRepository<T> {

  // Entity class
  private readonly Entity: EntityConstructor<T>;

  // MongoDB collection name
  private readonly collection: string;

  // BaseRepository constructor
  protected constructor(entity: EntityConstructor<T>, collection: string) {
    this.Entity = entity;
    this.collection = collection;
  }

  // Database connection to specified collection
  db(): Collection {
    return databaseClient.db().collection(this.collection);
  }

  // Create entity
  async create(params: Partial<T>): Promise<T> {
    const now = Date.now();
    const result = await this.db().insertOne({
      ...params,
      createdAt: now,
      updatedAt: now,
    });
    return new this.Entity(result.ops[0]);
  }

  // Update entity
  async update(filter: FilterQuery<T>, params: Partial<T>): Promise<T> {
    const now = Date.now();
    const options = { returnOriginal: false };
    const result = await this.db().findOneAndUpdate(filter, {
      $set: {
        ...params,
        updatedAt: now,
      },
    }, options);
    return new this.Entity(result.value);
  }

  // Delete one entity
  async deleteOne(filter: FilterQuery<T>): Promise<void> {
    await this.db().deleteOne(filter);
  }

  // Delete many entities
  async deleteMany(filter: FilterQuery<T>): Promise<void> {
    await this.db().deleteMany(filter);
  }

  // Find one entry in the collection
  async findOne(filter: FilterQuery<T>): Promise<T | void> {
    const result = await this.db().findOne(filter);
    if (result) {
      return new this.Entity(result);
    }
  }

  // Find many entries in the collection
  async findMany(filter: FilterQuery<T>): Promise<T[]> {
    const results = await this.db().find(filter);
    const arrayResults = await results.toArray();
    return arrayResults.map((item) => new this.Entity(item));
  }

}
