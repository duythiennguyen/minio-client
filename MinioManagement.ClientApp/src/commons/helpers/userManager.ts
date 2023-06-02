import { createUserManager } from 'redux-oidc';
import { WebStorageStateStore } from 'oidc-client';

const userStore = new WebStorageStateStore({ store: localStorage });

const userManagerConfig: any = {
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: `${process.env.REACT_APP_URL}/callback`,
  response_type: 'token id_token',
  scope: process.env.REACT_APP_SCOPE,
  authority: process.env.REACT_APP_AUTHORITY,
  jwks_uri: `${process.env.REACT_APP_AUTHORITY}/.well-known/openid-configuration/jwks`,
  silent_redirect_uri: `${process.env.REACT_APP_URL}/silent_renew`,
  post_logout_redirect_uri: process.env.REACT_APP_LOGOUT,
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true,
  monitorSession: true,
  userStore: userStore,
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
