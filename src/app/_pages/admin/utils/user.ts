export interface IUser {
  user_id: string;
  name?: string;
  manager?: string;
  given_name?: string;
  family_name?: string;
  job_title?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  last_login?: string;
  logins_count?: number;
  user_metadata?: any;
  app_metadata?: { points?:number, managers?:string[], function_group?:string};
  groups?: string[];

}
