/* @flow */

export const SET_CURRENT_PANEL = 'SET_CURRENT_PANEL';
export const SET_CURRENT_CONNECTION_TOKEN = 'SET_CURRENT_CONNECTION_TOKEN';

export function setCurrentPanel(panel_index: string) {
    return {
        type: SET_CURRENT_PANEL,
        panel_index
    };
};

export function setCurrentConnectionURL(url: string) {
    return {
        type: SET_CURRENT_CONNECTION_TOKEN,
        url,
    }
}

