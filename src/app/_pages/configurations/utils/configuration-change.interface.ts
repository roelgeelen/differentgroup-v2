export interface IConfigChanges {
  createdBy?: string;
  createdAt?: string;
  changes: IFieldChange[];
}
export interface IFieldChange {
  fieldName: string;
  fieldType: string;
  oldValue: any;
  newValue: any;
}
