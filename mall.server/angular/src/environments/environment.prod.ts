import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44301/',
  redirectUri: baseUrl,
  clientId: 'Mall_App',
  responseType: 'code',
  scope: 'offline_access Mall',
  requireHttps: true,
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'Mall',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44301',
      rootNamespace: 'Wallee.Mall',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
  remoteEnv: {
    url: '/getEnvConfig',
    mergeStrategy: 'deepmerge'
  }
} as Environment;
