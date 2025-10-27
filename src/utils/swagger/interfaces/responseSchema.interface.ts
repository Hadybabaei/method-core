import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/';

export interface IResponseSchema {
  createdResponse: ApiResponseOptions;
  updatedResponse: ApiResponseOptions;
  badRequestResponse: ApiResponseOptions;
  okResponse: ApiResponseOptions;
}
