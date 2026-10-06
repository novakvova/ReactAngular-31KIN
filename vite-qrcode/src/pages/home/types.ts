export interface IUser {
  id: number;
  fullName: string;
  email: string;
  image: string;
}

export interface IPagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}