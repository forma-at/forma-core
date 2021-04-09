import { FilterQuery } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { db } from './database';

type EntityConstructor<T> = new (raw: any) => T;

export class BaseRepository<T> {

  // Entity class
  private readonly entity: EntityConstructor<T>;

  // MongoDB collection name
  private readonly collection: string;

  // BaseRepository constructor
  protected constructor(entity: EntityConstructor<T>, collection: string) {
    this.entity = entity;
    this.collection = collection;
  }

  // Create entity
  async create(params: Partial<Omit<T, 'id'>>): Promise<T> {
    const now = Date.now();
    const result = await db().collection(this.collection).insertOne({
      id: uuid(),
      ...params,
      createdAt: now,
      updatedAt: now,
    });
    return new this.entity(result.ops[0]);
  }

  // Find one entry in the collection
  async findOne(filter: FilterQuery<T>): Promise<T> {
    const result = await db().collection(this.collection).findOne(filter);
    if (result) {
      return new this.entity(result);
    }
  }

  // Find many entries in the collection
  async findMany(filter: FilterQuery<T>): Promise<T[]> {
    const results = await db().collection(this.collection).find(filter);
    const arrayResults = await results.toArray();
    return arrayResults.map(item => new this.entity(item));
  }

}
