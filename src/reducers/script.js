import { WEBSOCKET_CLOSED, WEBSOCKET_OPEN, WEBSOCKET_MESSAGE } from '@giantmachines/redux-websocket'

import { ACTIONS } from '../actions'

const initialState = {
  isConnected: false,
  currentScript: null,
  scriptData: null,
  scriptText: null,
  error: null,
}

const handleWebsocketMessage = (action, data, state) => {

  switch (action) {
    case 'getScript':
      return {
        scriptData: data,
        scriptText: data.text,
      }
    case 'subscribeTo':
      return {}
    case 'unsubscribeFrom':
      return {}
    default:
      return {}
  }
}

const handleWebsocketError = (error, state) => {
  if (error === 'Already subscribed') {
    return {}
  }

  return {}
}

const script = (state = initialState, action) => {

  switch (action.type) {
    case WEBSOCKET_OPEN:
      return {
        ...state,
        isConnected: true,
      }
    case WEBSOCKET_CLOSED:
      return {
        ...state,
        isConnected: false,
      }
    case ACTIONS.SET_CURRENT_SCRIPT:
      return {
        ...state,
        currentScript: action.scriptName,
      }
    case ACTIONS.UNSET_CURRENT_SCRIPT:
      return {
        ...state,
        currentScript: null,
      }
    case ACTIONS.MODIFY_CURRENT_SCRIPT_TEXT:
      return {
        ...state,
        scriptText: action.scriptText,
      }
    case WEBSOCKET_MESSAGE:
      let { data, event } = action.payload

      let json = JSON.parse(data)

      if (json.error) {
        let { error } = json

        let stateModification = handleWebsocketError(error, state)
        return { ...state, ...stateModification }

      } else {
        let { action, data } = json

        let stateModification = handleWebsocketMessage(action, data, state)
        return { ...state, ...stateModification }

      }

    default:
      return state
  }
}

export default script