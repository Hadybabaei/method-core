import { Inject, Injectable } from '@nestjs/common';
import { IUserMeta, IUserRepository, IUserService } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { USER_REPOSITORY } from '../../utils';
import { UserNotFoundException } from '../exceptions';

@Injectable()
export class UserService implements IUserService {
  constructor(
    protected readonly configService: ConfigService,
    @Inject(USER_REPOSITORY)
    protected readonly repository: IUserRepository,
  ) {}

  async lookUpUser(userMeta: IUserMeta) {
    const user = await this.repository.getUserById(userMeta.id);
    if (!user) throw new UserNotFoundException(userMeta.id);
    return user;
  }
}
