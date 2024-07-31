import config from '../../auth_config.json';

const { domain, clientId, authorizationParams: { audience }, apiUri, errorPath } = config as {
  domain: string;
  clientId: string;
  authorizationParams: {
    audience?: string;
  },
  apiUri: string;
  errorPath: string;
};

export const environment = {
  production: false,
  apiUrl:"https://6a72-81-173-49-231.ngrok-free.app",
  apiUrlV2:"https://api.differentgroup.nl/differentgroupv2",
  auth: {
    domain,
    clientId,
    authorizationParams: {
      ...(audience && audience !== 'YOUR_API_IDENTIFIER' ? { audience } : null),
      redirect_uri: window.location.origin,
    },
    errorPath,
  },
  httpInterceptor: {
    allowedList: [`${apiUri}/*`, 'http://localhost:8082/*'],
  },
};
