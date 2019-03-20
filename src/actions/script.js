
import { WEBSOCKET_CONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket'
import { WS_URL } from './config.js'

import { ACTIONS } from './index'

export const retrieveScript = (domainName, scriptName) => {
  return async (dispatch, getState) => {
    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: {
          action: 'call',
          procedure: 'getScript',
          params: {
            name: scriptName,
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
            script: scriptName,
          },
        },
      },
      {
        type: ACTIONS.SET_CURRENT_SCRIPT,
        scriptName
      }
    ])
  }
}

export const exitScript = (domainName) => {
  return async (dispatch, getState) => {
    let state = getState()
    let scriptName = state.script.currentScript
    if (scriptName) {
      return dispatch([
        {
          type: WEBSOCKET_SEND,
          payload: {
            action: 'call',
            procedure: 'unsubscribeFrom',
            params: {},
            data: {
              script: scriptName,
              domain: domainName,
            },
          },
        },
        {
          type: ACTIONS.UNSET_CURRENT_SCRIPT,
        }
      ])
    } else {
      return dispatch([
        {
          type: ACTIONS.UNSET_CURRENT_SCRIPT,
        }
      ])
    }
  }
}

export const modifyScriptText = (scriptText) => {
  return async (dispatch, getState) => {
    let state = getState()
    let scriptData = state.script.scriptData
    if (!scriptData) {
      return dispatch([])//TODO: error handling, this should never happen
    }

    return dispatch([
      {
        type: ACTIONS.MODIFY_CURRENT_SCRIPT_TEXT,
        scriptText,
      }
    ])

  }
}

export const commitScriptChanges = (domainName) => {
  return async (dispatch, getState) => {
    let state = getState()
    let scriptName = state.script.currentScript
    let scriptData = state.script.scriptData

    let scriptText = state.script.scriptText
    if (!scriptText || !scriptData || !scriptName) {
      return dispatch([])//TODO: error handling, this should never happen
    }

    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: {
          action: 'call',
          procedure: 'updateScript',
          params: {
            name: scriptName,
            domain: domainName,
          },
          data: {
            name: scriptName, //TODO: should you be able to change it?
            description: scriptData.description,
            text: scriptText,
          },
        },
      },
    ])
  }
}