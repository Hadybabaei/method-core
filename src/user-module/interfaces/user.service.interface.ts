import { IUserMeta } from '../interfaces';

export interface IUserService {
  lookUpUser(userMeta: IUserMeta);
}
