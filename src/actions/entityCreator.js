

import { ACTIONS } from './index'

import { API_URL } from './config'
import { DEFAULT_TYPE, ALL_TYPES } from './columns'


export const startCreatingEntities = () => {
  return {
    type: ACTIONS.ENTITY_CREATOR.START_CREATING_ENTITIES,
  }
}

export const exitCreatingEntities = () => {
  return {
    type: ACTIONS.ENTITY_CREATOR.COMMIT_CHANGES,
  }
}

export const setMode = (mode) => {
  return {
    type: ACTIONS.ENTITY_CREATOR.SET_MODE,
    mode: mode,
  }
}

export const closeEntityCreatorErrorMessage = () => {
  return {
    type: ACTIONS.ENTITY_CREATOR.CLEAR_ERROR,
  }
}

const commitTableChanges = async (dispatch, data) => {

  const getAllKeys = (obj) => Object.keys(obj).map(x => parseInt(x))

  console.log('entityCreator: ', data)
  if (!data.tableName) {
    return dispatch({
      type: ACTIONS.ENTITY_CREATOR.ERROR,
      msg: 'No table name given',
    })
  }
  let columnsObj = data.columns
  let primaryKeyColumn = columnsObj[data.primaryKey]
  if (!primaryKeyColumn || !primaryKeyColumn.name) {
    return dispatch({
      type: ACTIONS.ENTITY_CREATOR.ERROR,
      msg: 'Primary key is empty',
    })
  }

  let columnIdx = getAllKeys(columnsObj)
  columnIdx.sort()
  let columns = columnIdx
    .map(idx => columnsObj[idx])
    .filter(x => x !== null)
  for (let column of columns) {
    if (!column.name) {
      return dispatch({
        type: ACTIONS.ENTITY_CREATOR.ERROR,
        msg: 'column is empty',
      })
    }
  }
  //parse data
  let postData = {
    name: `${data.tableName}`,
    description: '',
    schema: {
      columns: columns.map(x => (
        {
          name: x.name,
          dataType: x.typeName || DEFAULT_TYPE
        }
      )),
      constraint: [
        {
          key: primaryKeyColumn.name
        }
      ]
    }
  }

  try {
    let response = await fetch(`${API_URL}/manage/createTable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${localStorage.getItem('kakapoJWT')}`,
      },
      body: JSON.stringify(postData),
    })

    let data = await response.json()

    if (data.error) { //For some reason it returned an error message, but it was a 200 http code
      return dispatch({
        type: ACTIONS.ENTITY_CREATOR.ERROR,
        msg: data.error,
      })
    } else {
      return dispatch({
        type: ACTIONS.ENTITY_CREATOR.COMMIT_CHANGES,
      })
    }
  } catch (err) {
    return dispatch({
      type: ACTIONS.ENTITY_CREATOR.ERROR,
      msg: err && err.message,
    })
  }
}

const commitScriptChanges = async (dispatch, data) => {
  //parse data
  let postData = {
    name: `${data.scriptName}`,
    description: '',
    text: '',
  }

  try {
    let response = await fetch(`${API_URL}/manage/createScript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${localStorage.getItem('kakapoJWT')}`,
      },
      body: JSON.stringify(postData),
    })

    let data = await response.json()

    if (data.error) { //For some reason it returned an error message, but it was a 200 http code
      return dispatch({
        type: ACTIONS.ENTITY_CREATOR.ERROR,
        msg: data.error,
      })
    } else {
      return dispatch({
        type: ACTIONS.ENTITY_CREATOR.COMMIT_CHANGES,
      })
    }
  } catch (err) {
    return dispatch({
      type: ACTIONS.ENTITY_CREATOR.ERROR,
      msg: err && err.message,
    })
  }
}

const commitQueryChanges = async (dispatch, data) => {
  //parse data
  let postData = {
    name: `${data.queryName}`,
    description: '',
    statement: '',
  }

  try {
    let response = await fetch(`${API_URL}/manage/createQuery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${localStorage.getItem('kakapoJWT')}`,
      },
      body: JSON.stringify(postData),
    })

    let data = await response.json()

    if (data.error) { //For some reason it returned an error message, but it was a 200 http code
      return dispatch({
        type: ACTIONS.ENTITY_CREATOR.ERROR,
        msg: data.error,
      })
    } else {
      return dispatch({
        type: ACTIONS.ENTITY_CREATOR.COMMIT_CHANGES,
      })
    }
  } catch (err) {
    return dispatch({
      type: ACTIONS.ENTITY_CREATOR.ERROR,
      msg: err && err.message,
    })
  }
}

export const commitChanges = () => {

  return async (dispatch, getState) => {

    let data = getState().entityCreator
    switch (data.mode) {
      case 'Table':
        return await commitTableChanges(dispatch, data)
      case 'Query':
        return await commitQueryChanges(dispatch, data)
      case 'Script':
        return await commitScriptChanges(dispatch, data)
    }

  }
}