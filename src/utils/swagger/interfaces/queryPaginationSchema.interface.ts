import { ApiQueryOptions } from '@nestjs/swagger/dist/decorators/';

export interface IQueryPaginationSchema {
  QueryLimitSchema: ApiQueryOptions;
  QueryOffsetSchema: ApiQueryOptions;
}
