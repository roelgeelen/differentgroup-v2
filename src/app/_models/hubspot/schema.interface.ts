export interface ISchema
{
  id: string;
  fullyQualifiedName: string;
  properties: ISchemaProperty[];
}
export interface ISchemaProperty
{
  archived: boolean;
  description: string;
  fieldType: string;
}
