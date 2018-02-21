/* globals window */
export const MODE = 'production';
export const ENDPOINT = '/';

// export const WEBSOCKET_URL = 'ws://localhost:8080/socket/';
const scheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
export const WEBSOCKET_URL = `${scheme}//${window.location.host}/socket/`;

export const VAT = 0.13;
export const SERVICE_CHARGE = 0.1;

export const VAT_DEFAULT = false;
export const SERVICE_CHARGE_DEFAULT = true;
