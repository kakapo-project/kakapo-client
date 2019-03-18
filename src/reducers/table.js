
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
      console.log('reached getTable')


      let schema = data.schema
      let columnSchema = schema.columns
      let constraint = schema.constraint

      //get primary key
      let primaryKey = constraint.map(x => x.key).filter(x => x)
      if (primaryKey.length !== 1) {
        return { error: 'This table does not have any keys' }
      }
      primaryKey = primaryKey[0]

      //format column infor into map
      let columnInfo = {}
      for (let x of columnSchema) {
        columnInfo[x.name] = x
      }
      console.log('reached here')

      //done
      return {
        columnInfo: columnInfo,
        constraint: constraint,
        primaryKey: primaryKey,

        isTableMetaLoaded: true,
        isLoaded: state.isTableDataLoaded
      }
    case 'queryTableData':
      console.log('Got getTableData')

      let dataset = data.data
      let columns = data.columns

      return {
        data: dataset,
        columns: columns,

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

  let oldData, newData, rowIdx, rowKey, colIdx;

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
    case ACTIONS.SET_CURRENT_TABLE:
      return {
        ...state,
        currentTable: action.tableName,
      }
    case ACTIONS.UNSET_CURRENT_SCRIPT:
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
        console.log('stateMod for action: ', action, stateModification)

        return { ...state, ...stateModification }

      }

    case ACTIONS.ADD_ROW:
      oldData = state.data
      rowIdx = action.idx
      let emptyRow = Object.keys(state.columnInfo).map(x => null) //just count the number of columns and create row with null values
      newData = [...oldData.slice(0, rowIdx), emptyRow, ...oldData.slice(rowIdx)]
      return { ...state, data: newData }

    case ACTIONS.DELETE_ROW:
      oldData = state.data
      rowIdx = action.idx
      rowKey = action.key
      newData = [...oldData.slice(0, rowIdx), ...oldData.slice(rowIdx + 1)]
      let userDeleted = [...state.userDeleted, rowKey] //TODO: remove item when websocket message returns remove

      return { ...state, data: newData, userDeleted: userDeleted }

    case ACTIONS.UPDATE_VALUE:
      oldData = state.data
      rowIdx = action.rowIdx
      colIdx = action.colIdx

      console.log('oldData: ', oldData)
      console.log('rowIdx: ', rowIdx)
      let oldRowValues = oldData[rowIdx].values
      let oldRowKeys = oldData[rowIdx].keys

      let value = action.value

      let newRowValues = [...oldRowValues.slice(0, colIdx), value, ...oldRowValues.slice(colIdx + 1)]
      let newRow = {
          keys: oldRowKeys, //TODO: how to do keys
          values: newRowValues,
      }
      newData = [...oldData.slice(0, rowIdx), newRow, ...oldData.slice(rowIdx + 1)]

      return { ...state, data: newData }

    default:
      return state
  }
}

export default table