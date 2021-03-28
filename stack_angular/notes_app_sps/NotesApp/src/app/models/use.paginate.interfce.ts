import { User } from "./user.interface";

export interface UserPaginate {
  docs?:[User]
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
