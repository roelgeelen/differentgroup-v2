export interface IPage<T>
{
  content: T;
  last: boolean;
  totalPages: number;
  totalElements: number;
}
