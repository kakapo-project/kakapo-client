
import { WEBSOCKET_CONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket'
import { WS_URL } from './config.js'

import { ACTIONS } from './index'

export const retrieveScript = (scriptName) => {
  return async (dispatch, getState) => {
    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: {
          action: 'call',
          procedure: 'getScript',
          params: {
            name: scriptName,
          },
          data: {},
        },
      },
      {
        type: WEBSOCKET_SEND,
        payload: {
          action: 'call',
          procedure: 'subscribeTo',
          params: {},
          data: {
              script: scriptName
          }
        }
      }
    ])
  }
}
