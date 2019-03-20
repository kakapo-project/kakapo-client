
import { WEBSOCKET_CONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket'
import { WS_URL } from './config'

import { ACTIONS } from './index'


export const retrieveTable = (tableName) => {
  return async (dispatch, getState) => {
    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: {
          action: 'call',
          procedure: 'getTable',
          params: {
            name: tableName,
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
            table: tableName,
          },
        },
      },
      {
        type: ACTIONS.SET_CURRENT_REDIS_TABLE,
        tableName
      }
    ])
  }
}

export const exitTable = () => {
  return async (dispatch, getState) => {
    let state = getState()
    let tableName = state.table.currentTable
    if (tableName) {
      return dispatch([
        {
          type: WEBSOCKET_SEND,
          payload: {
            action: 'call',
            procedure: 'unsubscribeFrom',
            params: {},
            data: {
              table: tableName,
            },
          },
        },
        {
          type: ACTIONS.UNSET_CURRENT_REDIS_TABLE,
        }
      ])
    } else {
      return dispatch([
        {
          type: ACTIONS.UNSET_CURRENT_REDIS_TABLE,
        }
      ])
    }
  }
}

export const requestingTableData = () => {
  return async (dispatch, getState) => {
    let state = getState()
    let tableName = state.table.currentTable

    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: {
          action: 'call',
          procedure: 'queryTableData',
          params: {
            name: tableName,
          },
          data: {},
        },
      },
    ])
  }
}

export const addRow = (key, value) => {
  return async (dispatch, getState) => {
    let state = getState()
    let tableName = state.table.currentTable

    const modifyTableData = {
      action: 'call',
      procedure: 'insertTableData',
      params: {
        name: tableName,
      },
      data: {
        [key]: value,
      }
    }

    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: modifyTableData,
      },
      {
        type: ACTIONS.REDIS_ADD_ROW,
        key: key,
        value: value,
      }
    ])

  }
}

export const deleteRow = (key) => {
  return async (dispatch, getState) => {
    let state = getState()
    let tableName = state.table.currentTable

    let removeTableData =  {
      action: 'call',
      procedure: 'removeTableData',
      params: {
        name: tableName,
      },
      data: [key],
    }

    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: removeTableData,
      },
      {
        type: ACTIONS.REDIS_DELETE_ROW,
        key: key,
      },
    ])
  }
}

export const modifyValue = (key, value) => {

  return async (dispatch, getState) => {
    let state = getState()
    let tableName = state.table.currentTable

    const modifyTableData = {
      action: 'call',
      procedure: 'modifyTableData',
      params: {
        name: tableName,
      },
      data: {
        [key]: value,
      }
    }

    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: modifyTableData,
      },
      {
        type: ACTIONS.REDIS_UPDATE_VALUE,
        key: key,
        value: value,
      }
    ])

  }
}