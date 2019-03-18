import { WEBSOCKET_CLOSED, WEBSOCKET_OPEN, WEBSOCKET_MESSAGE } from '@giantmachines/redux-websocket'

import { ACTIONS } from '../actions'

const initialState = {
  isConnected: false,
  currentScript: null,
  queryData: null,
  queryStatement: null,
  error: null,
}

const handleWebsocketMessage = (action, data, state) => {
  switch (action) {
    case 'getQuery':
      return {
        queryData: data,
        queryStatement: data.statement,
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

const query = (state = initialState, action) => {

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
    case ACTIONS.SET_CURRENT_QUERY:
      return {
        ...state,
        currentQuery: action.queryName,
      }
    case ACTIONS.UNSET_CURRENT_QUERY:
      return {
        ...state,
        currentQuery: null,
      }
    case ACTIONS.MODIFY_CURRENT_QUERY_STATEMENT:
      return {
        ...state,
        queryStatement: action.queryStatement,
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

export default query