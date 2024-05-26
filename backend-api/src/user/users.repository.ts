import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Types, Connection, SaveOptions, FilterQuery } from 'mongoose';
import { BaseDocument, User } from './entities/user.entity';

// Todo Create TBaseEntity
export abstract class BaseRepository<TDocument extends BaseDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne<TDocument>(
      filterQuery,
      {},
      { lean: true },
    );

    if (!document) {
      this.logger.warn('Document not found ', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as TDocument;
  }
}

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(User.name) userModel: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }
}
