// auth.config.ts
import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://login.microsoftonline.com/437aeb62-3231-4344-81db-3335e75bfee0/v2.0',
  redirectUri: window.location.origin + '/home',
  clientId: 'de1920f5-5c18-4314-8042-84a6b9f0944a',
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  scope: 'openid api://de1920f5-5c18-4314-8042-84a6b9f0944a/User.Read',
}
