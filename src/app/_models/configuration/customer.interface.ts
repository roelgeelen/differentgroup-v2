export interface ICustomer
{
  id: string;
  dealId?: string;
  name: string;
}
export interface IRecentCustomer
{
  dealId?: string;
  name: string;
  updatedAt: string;
}
