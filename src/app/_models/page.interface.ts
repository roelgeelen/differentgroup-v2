export interface IPage<T>
{
  content: T;
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
  // last: boolean;
  // totalPages: number;
  // totalElements: number;
}
