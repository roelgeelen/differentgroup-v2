export interface ICustomer
{
  id: string;
  dealId?: string;
  name: string;
  signature: string;
}
export interface IRecentCustomer
{
  dealId?: string;
  name: string;
  updatedBy: string;
  updatedAt: string;
  count: number;
}
