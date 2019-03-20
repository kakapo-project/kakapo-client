
import { WEBSOCKET_CONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket'
import { WS_URL } from './config'

import { ACTIONS } from './index'


export const retrieveTable = (domainName, tableName) => {
  return async (dispatch, getState) => {
    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: {
          action: 'call',
          procedure: 'getTable',
          params: {
            name: tableName,
            domain: domainName,
          },
          data: {},
        },
      },
      {
        type: WEBSOCKET_SEND,
        payload: {
          action: 'call',
          procedure: 'subscribeTo',
          params: {
            domain: domainName,
          },
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

export const exitTable = (domainName) => {
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
            params: {
              domain: domainName
            },
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

export const requestingTableData = (domainName) => {
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
            domain: domainName,
          },
          data: {},
        },
      },
    ])
  }
}

export const addRow = (domainName, key, value) => {
  return async (dispatch, getState) => {
    let state = getState()
    let tableName = state.table.currentTable

    const modifyTableData = {
      action: 'call',
      procedure: 'insertTableData',
      params: {
        name: tableName,
        domain: domainName,
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

export const deleteRow = (domainName, key) => {
  return async (dispatch, getState) => {
    let state = getState()
    let tableName = state.table.currentTable

    let removeTableData =  {
      action: 'call',
      procedure: 'removeTableData',
      params: {
        name: tableName,
        domain: domainName,
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

export const modifyValue = (domainName, key, value) => {

  return async (dispatch, getState) => {
    let state = getState()
    let tableName = state.table.currentTable

    const modifyTableData = {
      action: 'call',
      procedure: 'modifyTableData',
      params: {
        name: tableName,
        domain: domainName,
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