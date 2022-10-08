import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

import { UserDocument, UserEntity } from './schemas/user.schema';
import {
  CreateUserDto,
  ProfileDto,
} from './dto';

import { Logger } from '@/common';

const encryptPassword = async (password: string): Promise<string> =>
  bcrypt.hash(password, 10);

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserDocument>,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(UserService.name);

  }

  public async findOne(id: string): Promise<UserEntity | null> {
    return this.userModel.findById(id);
  }

  public async getProfile(id: string): Promise<ProfileDto> {
    const foundUser = await this.userModel.findById(id);
    if (!foundUser) {
      throw new BadRequestException('user_not_found');
    }

    const userJson = foundUser.toJSON();
    const profile = { ...userJson, isPasswordEmpty: userJson['password'] ? undefined : true };

    return plainToClass(ProfileDto, <ProfileDto> profile, {
      excludeExtraneousValues: true,
    });
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ email });
  }

  public async updateNewPassword(
    userId: string,
    password: string,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne(
      { _id: userId },
      {
        password: await encryptPassword(password),
      },
    );
  }

  public async create(registerDto: CreateUserDto): Promise<UserEntity> {
    const oldUser = await this.userModel.findOne({ email: registerDto.email });
    if (!_.isEmpty(oldUser)) {
      throw new BadRequestException('email_does_exist', 'Email does exist');
    }

    const user = await this.userModel.create({
      ...registerDto,
      password: await encryptPassword(registerDto.password),
    });

    console.log(user);

    return user;
  }

  public async validatePassword(
    userPassword: string,
    password: string,
  ): Promise<boolean> {
    if (!password) {
      throw new BadRequestException('old_password_is_not_correct');
    }

    return bcrypt.compare(password, userPassword);
  }
}
