import {IForm} from "../../_components/dynamic-form-builder/models/form.interface";
import {ICustomer} from "./customer.interface";
import {IQuoteLine} from "../../_components/dynamic-form-builder/form-controls/form-control-options.interface";

export interface IConfiguration {
  id?: string;
  customer: ICustomer;
  form: IForm;
  title: string;
  preview?: {
    url3D?: string;
  };
  values?: IConfigurationItem[];
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface IConfigurationItem {
  page: string;
  values: IConfigurationItemValue[];
}

export interface IConfigurationItemValue {
  id?: string;
  type: string;
  image?: string;
  title: string;
  subtitle?: string;
  fields?: any;
  value?: any;
  columns?: IConfigurationItemValue[];
}

export interface IConfigurationAttachment {
  id: string;
  configuration?: IConfiguration;
  external?: string;
  field?: string;
  name?: string;
  type?: string;
  url?: string;
}
