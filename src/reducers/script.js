import { WEBSOCKET_CLOSED, WEBSOCKET_OPEN, WEBSOCKET_MESSAGE } from '@giantmachines/redux-websocket'

import { ACTIONS } from '../actions'

const initialState = {
  isConnected: false,
  isTableMetaLoaded: false, //TODO: put these in reselect
  isTableDataLoaded: false, //TODO: put these in reselect
  isLoaded: false,
  error: null,

  columnInfo: {},

  data: [[]],
  columns: [],

  //user actions, to update
  userDeleted: [], //buffered when user calls the row to be delete, removed from buffer when message received
  userInserted: [], //buffered when user's newly added row (i.e. null key) has been updated with a key, meaning it can be sent, removed when message received
  userUpdated: [], //buffered when user is updating value of an object that has a key
}

const handleWebsocketMessage = (action, data, state) => {

  switch (action) {
    case 'getTable':
      break

  }

  return state
}

const script = (state = initialState, action) => {

  console.log('script, received action: ', action)

  switch (action.type) {
    case WEBSOCKET_OPEN:
      return {
        ...state,
        isConnected: true,
        isLoaded: false,
        isTableMetaLoaded: false,
        isTableDataLoaded: false,
      }
    case WEBSOCKET_CLOSED:
      return {
        ...state,
        isConnected: false,
        isLoaded: false,
        isTableMetaLoaded: false,
        isTableDataLoaded: false,
      }
    case WEBSOCKET_MESSAGE:
      let { data, event } = action.payload

      let json = JSON.parse(data)

      let stateModification = handleWebsocketMessage(json.action, json.data, state)
      return { ...state, ...stateModification }

    default:
      return state
  }
}

export default script