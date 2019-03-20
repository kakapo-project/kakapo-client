
import { WEBSOCKET_CLOSED, WEBSOCKET_OPEN, WEBSOCKET_MESSAGE } from '@giantmachines/redux-websocket'

import { ACTIONS } from '../actions'

const initialState = {
  isConnected: false,
  currentTable: null,

  isTableMetaLoaded: false, //TODO: put these in reselect
  isTableDataLoaded: false, //TODO: put these in reselect
  isLoaded: false,
  error: null,

  columnInfo: {},

  data: [],
  columns: [],

  //user actions, to update
  userDeleted: [], //buffered when user calls the row to be delete, removed from buffer when message received
  userInserted: [], //buffered when user's newly added row (i.e. null key) has been updated with a key, meaning it can be sent, removed when message received
  userUpdated: [], //buffered when user is updating value of an object that has a key
}

const handleWebsocketMessage = (action, data, state) => {

  console.log(`action: "${action}"`)
  console.log('data: ', data)

  switch (action) {
    case 'getTable':
      return {
        isTableMetaLoaded: true,
        isLoaded: state.isTableDataLoaded
      }
    case 'queryTableData':
      return {
        data: data,

        isTableDataLoaded: true,
        isLoaded: state.isTableMetaLoaded
      }

    case 'update':
    case 'create':
    case 'delete':

    default:
      return {}
  }
}

const handleWebsocketError = (error, state) => {
  console.log('received error: ', error)

  if (error === 'Already subscribed') {
    return {}
  }

  return {}
}

const table = (state = initialState, action) => {

  let oldData, newData, key, value;

  switch (action.type) {
    case WEBSOCKET_OPEN:
      return {
        ...state,
        isConnected: true,
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
    case ACTIONS.SET_CURRENT_REDIS_TABLE:
      return {
        ...state,
        currentTable: action.tableName,
      }
    case ACTIONS.UNSET_CURRENT_REDIS_SCRIPT:
      return {
        ...state,
        currentTable: null,
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

    case ACTIONS.ADD_ROW_REDIS:
      oldData = state.data
      key = action.key
      value = action.value

      newData = {...oldData, [key]: value}

      return { ...state, data: newData }


    case ACTIONS.DELETE_ROW_REDIS:
      oldData = state.data
      key = action.key

      newData = {...oldData, [key]: undefined }

      return { ...state, data: newData }

    case ACTIONS.UPDATE_VALUE_REDIS:
      oldData = state.data
      key = action.key
      value = action.value

      newData = {...oldData, [key]: value}

      return { ...state, data: newData }

    default:
      return state
  }
}

export default table