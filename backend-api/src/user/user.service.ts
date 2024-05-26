import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model, Connection, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async validateUser(email: string, password: string) {
    const user = await this.model.findOne({ email }, {}, { lean: true });
    if (!user) {
      this.logger.warn('User not found with email', { email });
      throw new NotFoundException('Document not found.');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  private async validateCreateUserRequest(request: CreateUserDto) {
    let user: User;
    try {
      user = await this.model.findOne(
        { email: request.email },
        {},
        { lean: true },
      );
    } catch (err) {
      console.log(err); // Todo logger
    }
    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.validateCreateUserRequest(createUserDto);

    const user = new this.model({
      ...{
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
      _id: new Types.ObjectId(),
    });
    user.save();

    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOneByEmail(email: string) {
    const user = await this.model.findOne({ email }, {}, { lean: true });
    return user;
  }

  findOneById(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
