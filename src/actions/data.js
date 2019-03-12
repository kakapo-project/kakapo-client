
import { ACTIONS } from './index'

import { API_URL } from './config'

export const clearPullDataError = () => {
  return {
    type: ACTIONS.CLEAR_PULL_DATA_ERROR
  }
}

export const pullDomains = () => {
  return async (dispatch, getState) => {
    try {
      let response = await fetch(`${API_URL}/manage/getAllDomains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${localStorage.getItem('kakapoJWT')}`,
        },
        body: JSON.stringify({}),
      })

      let data = await response.json()

      let domains = data.map(x => ({
        name: x.name,
        type: x.type,
        description: x.description,
      }))

      dispatch({
        type: ACTIONS.SET_DOMAINS,
        domains: domains,
      })
    } catch (err) {
      dispatch({
        type: ACTIONS.PULL_DATA_ERROR,
        msg: err.message,
      })
    }
  }
}

const pullTables = async (dispatch, getState) => {
  try {
    let response = await fetch(`${API_URL}/manage/getAllTables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${localStorage.getItem('kakapoJWT')}`,
      },
      body: JSON.stringify({}),
    })

    let data = await response.json()

    let entities = data.map(x => ({
      name: x.name,
      type: 'table',
      icon: 'database',
      lastUpdated: 'yesterday',
      description: x.description,
      isBookmarked: false,
    }))

    dispatch([
      {
        type: ACTIONS.SET_TABLE_DATA,
        entities: entities,
      },
      {
        type: ACTIONS.ENTITY_CREATOR.CLEAR_DIRTY_ENTITIES,
      }
    ])
  } catch (err) {
    dispatch({
      type: ACTIONS.PULL_DATA_ERROR,
      msg: err.message,
    })
  }
}

const pullQueries = async (dispatch, getState) => {
  try {
    let response = await fetch(`${API_URL}/manage/getAllQueries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${localStorage.getItem('kakapoJWT')}`,
      },
      body: JSON.stringify({}),
    })

    let data = await response.json()

    let entities = data.map(x => ({
      name: x.name,
      type: 'query',
      icon: 'search',
      lastUpdated: 'yesterday',
      description: x.description,
      isBookmarked: false,
    }))

    dispatch([
      {
        type: ACTIONS.SET_QUERY_DATA,
        entities: entities,
      },
      {
        type: ACTIONS.ENTITY_CREATOR.CLEAR_DIRTY_ENTITIES,
      }
    ])
  } catch (err) {
    dispatch({
      type: ACTIONS.PULL_DATA_ERROR,
      msg: err.message,
    })
  }
}

const pullScripts = async (dispatch, getState) => {
  try {
    let response = await fetch(`${API_URL}/manage/getAllScripts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${localStorage.getItem('kakapoJWT')}`,
      },
      body: JSON.stringify({}),
    })

    let data = await response.json()

    let entities = data.map(x => ({
      name: x.name,
      type: 'script',
      icon: 'code',
      lastUpdated: 'yesterday',
      description: x.description,
      isBookmarked: false,
    }))

    dispatch([
      {
        type: ACTIONS.SET_SCRIPT_DATA,
        entities: entities,
      },
      {
        type: ACTIONS.ENTITY_CREATOR.CLEAR_DIRTY_ENTITIES,
      }
    ])
  } catch (err) {
    dispatch({
      type: ACTIONS.PULL_DATA_ERROR,
      msg: err.message,
    })
  }
}

export const pullData = () => {
  return async (dispatch, getState) => {
    let pullTablesPromise = pullTables(dispatch, getState)
    let pullQueriesPromise = pullQueries(dispatch, getState)
    let pullScriptsPromise = pullScripts(dispatch, getState)

    await pullTablesPromise
    await pullQueriesPromise
    await pullScriptsPromise
  }
}