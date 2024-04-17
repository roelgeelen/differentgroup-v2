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
  groupName: string;
  label: string;
  name: string;
  options: ISchemaPropertyOption[];
}
export interface ISchemaPropertyOption
{
  hidden: boolean;
  label: string;
  value: string;
}
