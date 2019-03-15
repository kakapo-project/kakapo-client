
import { WEBSOCKET_CONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket'
import { WS_URL } from './config.js'

import { ACTIONS } from './index'

export const ACTION_STATUS = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  CONNECTED: 'CONNECTED', //Connected, but not authenticated
  AUTHENTICATED: 'AUTHENTICATED',
}

export const startWebsocketConnection = () => {
  return async (dispatch, getState) => {
    const url = `${WS_URL}/listen`
    console.log('starting websocket listen')
    return dispatch({
      type: WEBSOCKET_CONNECT,
      payload: { url }
    })
  }
}

export const authenticateWebsocket = (token) => {
  console.log('authenticating websocket...')
  return async (dispatch, getState) => {
    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: { action: 'authenticate', token },
      },
      {
        type: ACTIONS.WEBSOCKET_DID_AUTH,
        payload: {},
      }
    ])
  }
}

export const finishAuthenticateWebsocket = () => {
  return async (dispatch, getState) => {
    setTimeout(() => {
      dispatch({
        type: ACTIONS.WEBSOCKET_WAITING_FOR_AUTH,
        payload: {},
      })
    }, 2 * 60 * 1000) //TODO: magic number, 2 minute auth refresh

  }
}