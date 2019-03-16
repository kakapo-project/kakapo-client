
import { WEBSOCKET_CONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket'
import { WS_URL } from './config.js'

export * from './table.js'
export * from './entityCreator.js'
export * from './data.js'
export * from './ws.js'
export * from './script.js'

export const ACTIONS = {
  OPEN_SIDEBAR: 'OPEN_SIDEBAR',
  CLOSE_SIDEBAR: 'CLOSE_SIDEBAR',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_ENTITY_SELECTION: 'SET_ENTITY_SELECTION',

  ADD_ROW: 'ADD_ROW',
  DELETE_ROW: 'DELETE_ROW',
  UPDATE_VALUE: 'UPDATE_VALUE',

  PULL_DATA_ERROR: 'PULL_DATA_ERROR',
  CLEAR_PULL_DATA_ERROR: 'CLEAR_PULL_DATA_ERROR',
  SET_DOMAINS: 'SET_DOMAINS',
  SET_TABLE_DATA: 'SET_TABLE_DATA',
  SET_QUERY_DATA: 'SET_QUERY_DATA',
  SET_SCRIPT_DATA: 'SET_SCRIPT_DATA',

  ENTITY_CREATOR: {
    ERROR: 'ENTITY_CREATOR:ERROR',
    CLEAR_ERROR: 'ENTITY_CREATOR:CLEAR_ERROR',
    SET_MODE: 'ENTITY_CREATOR:SET_MODE',
    CLEAR_DIRTY_ENTITIES: 'ENTITY_CREATOR:CLEAR_DIRTY_ENTITIES',
    COMMIT_CHANGES: 'ENTITY_CREATOR:COMMIT_CHANGES',
    START_CREATING_ENTITIES: 'ENTITY_CREATOR:START_CREATING_ENTITIES',
    SET_TABLE_NAME: 'ENTITY_CREATOR:SET_TABLE_NAME',
    SET_QUERY_NAME: 'ENTITY_CREATOR:SET_QUERY_NAME',
    SET_SCRIPT_NAME: 'ENTITY_CREATOR:SET_SCRIPT_NAME',
    MODIFY_STATE: 'ENTITY_CREATOR:MODIFY_STATE',
  },

  WEBSOCKET_DID_AUTH: 'WEBSOCKET_DID_AUTH',
  WEBSOCKET_WAITING_FOR_AUTH: 'WEBSOCKET_WAITING_FOR_AUTH',
}

//TODO: this should be in a different file
export const Selections = Object.freeze({
  tables: 'table',
  queries: 'query',
  views: 'view',
  scripts: 'script',
})

export const setEntitySelection = (selection) => {

  return {
    type: ACTIONS.SET_ENTITY_SELECTION,
    selection: selection
  }

}


export const clickToggleSidebar = () => {
  return { type: ACTIONS.TOGGLE_SIDEBAR }
}

export const loadedPage = (defaultIsOpen = false) => {
  if (defaultIsOpen) {
    return { type: ACTIONS.OPEN_SIDEBAR }
  } else {
    return { type: ACTIONS.CLOSE_SIDEBAR }
  }
}