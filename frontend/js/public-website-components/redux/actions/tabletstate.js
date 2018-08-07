/* @flow */

export const SET_CURRENT_PANEL = 'SET_CURRENT_PANEL';
export const SET_CURRENT_CONNECTION_TOKEN = 'SET_CURRENT_CONNECTION_TOKEN';
export const SET_CURRENT_QRCODE_URL = 'SET_CURRENT_QRCODE_URL';

export function setCurrentPanel(panel_index: string) {
    return {
        type: SET_CURRENT_PANEL,
        panel_index
    };
}

export function setCurrentConnectionURL(url: string) {
    return {
        type: SET_CURRENT_CONNECTION_TOKEN,
        url,
    };
}
;
export function setCurrentQrcodeURL(url: string) {
  return {
    type: SET_CURRENT_QRCODE_URL,
    url
  };
}
