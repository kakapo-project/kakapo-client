
import { WEBSOCKET_CONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket'
import { WS_URL } from './config.js'

export const startWebsocketConnection = () => {
  return async (dispatch, getState) => {
    const url = `${WS_URL}/listen`
    return dispatch({
      type: WEBSOCKET_CONNECT,
      payload: { url }
    })
  }
}
