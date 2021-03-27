import { nota } from './nota.interface';
export interface NotaPaginate {
  docs?:[nota]
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number
  nextPage?: number;
  page: number;
  pagingCounter: number;
  prevPage?: number
  totalDocs: number
  totalPages: number

}
