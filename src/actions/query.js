
import { WEBSOCKET_CONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket'
import { WS_URL } from './config.js'

import { ACTIONS } from './index'

export const retrieveQuery = (queryName) => {
  return async (dispatch, getState) => {
    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: {
          action: 'call',
          procedure: 'getQuery',
          params: {
            name: queryName,
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
            query: queryName,
          },
        },
      },
      {
        type: ACTIONS.SET_CURRENT_QUERY,
        queryName
      }
    ])
  }
}

export const exitQuery = () => {
  return async (dispatch, getState) => {
    let state = getState()
    let queryName = state.query.currentQuery
    if (queryName) {
      return dispatch([
        {
          type: WEBSOCKET_SEND,
          payload: {
            action: 'call',
            procedure: 'unsubscribeFrom',
            params: {},
            data: {
              query: queryName,
            },
          },
        },
        {
          type: ACTIONS.UNSET_CURRENT_QUERY,
        }
      ])
    } else {
      return dispatch([
        {
          type: ACTIONS.UNSET_CURRENT_QUERY,
        }
      ])
    }
  }
}

export const modifyQueryStatement = (queryStatement) => {
  return async (dispatch, getState) => {
    let state = getState()
    let queryData = state.query.queryData
    if (!queryData) {
      return dispatch([])//TODO: error handling, this should never happen
    }

    return dispatch([
      {
        type: ACTIONS.MODIFY_CURRENT_QUERY_STATEMENT,
        queryStatement,
      }
    ])

  }
}

export const commitQueryChanges = () => {
  return async (dispatch, getState) => {
    let state = getState()
    let queryName = state.query.currentQuery
    let queryData = state.query.queryData

    let queryStatement = state.query.queryStatement
    if (!queryStatement || !queryData || !queryName) {
      return dispatch([])//TODO: error handling, this should never happen
    }

    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: {
          action: 'call',
          procedure: 'updateQuery',
          params: {
            name: queryName,
          },
          data: {
            name: queryName, //TODO: should you be able to change it?
            description: queryData.description,
            statement: queryStatement,
          },
        },
      },
    ])
  }
}