
import { WEBSOCKET_CONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket'
import { WS_URL } from './config'

import { ACTIONS } from './index'

import ClipBoard from 'clipboard'
const csvParse = require('csv-stringify/lib/sync')

const encodeByType = (data, type) => {
  switch (type) {
    case 'string':
      return data
    case 'integer':
      return parseInt(data)
  }
}

function clipboardWrite(text, event) {
  const cb = new ClipBoard('.null', {
      text: () => text
  });

  cb.on('success', function(e) {
      console.log(e);
      cb.off('error');
      cb.off('success');
  });

  cb.on('error', function(e) {
      console.log(e);
      cb.off('error');
      cb.off('success');
  });

  cb.onClick(event);
}

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
        type: ACTIONS.SET_CURRENT_TABLE,
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
          type: ACTIONS.UNSET_CURRENT_TABLE,
        }
      ])
    } else {
      return dispatch([
        {
          type: ACTIONS.UNSET_CURRENT_TABLE,
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

export const copySelection = (topLeft, bottomRight, e) => {
  return async (dispatch, getState) => {
    let y0 = topLeft.idx
    let x0 = topLeft.col
    let y1 = bottomRight.idx
    let x1 = bottomRight.col

    let state = getState()
    let data = state.table.data

    let filteredData = data.slice(y0, y1 + 1).map(x => x.slice(x0, x1 + 1))

    let output = csvParse(filteredData) //need to use the sync api for the clipboard write to work (this is a browser restriction)
    clipboardWrite(output, e)
  }
}

export const addRow = (idx) => {
  return {
    type: ACTIONS.ADD_ROW,
    idx: idx,
  }
}

export const deleteRow = (idx) => {
  return async (dispatch, getState) => {
    let state = getState()

    let data = state.table.data
    let columns = state.table.columns
    let primaryKey = state.table.primaryKey

    let primaryKeyIdx = columns.findIndex(x => x === primaryKey)
    let key = data[idx][primaryKeyIdx]

    //TODO: ...
    let removeTableData =  {
      action: 'call',
      procedure: 'removeTableData',
      params: {
        //name: tableName,
      },
      data: {},
    }

    return dispatch([
      {
        type: WEBSOCKET_SEND,
        payload: removeTableData,
      },
      {
        type: ACTIONS.DELETE_ROW,
        idx: idx,
        key: key,
      },
    ])
  }
}

export const modifyValue = (rowIdx, colIdx, value) => {

  const updateVirtualValue = () => {
    return {
      type: ACTIONS.UPDATE_VALUE,
      rowIdx: rowIdx,
      colIdx: colIdx,
      value: value,
    }
  }

  const updateValue = (tableName, keyRow, newRow) => {

    ///   "columns": {
    ///     "keys": [ "id" ],
    ///     "values": [ "message", "category" ]
    ///   },
    ///   "data": [
    ///     {
    ///       "keys": [ 42 ],
    ///       "values": [ "hello world", "greeting" ]
    ///     },
    ///     {
    ///       "keys": [ 43 ],
    ///       "values": [ "goodbye world", "farewell" ]
    ///     }
    ///   ]
    /// }

    let modifyTableData =  {
      action: 'call',
      procedure: 'modifyTableData',
      params: {
        name: tableName,
      },
      data: {
        columns: {
          keys: Object.keys(keyRow),
          values: Object.keys(newRow)
        },
        data: [
          {
            keys: Object.values(keyRow),
            values: Object.values(newRow)
          }
        ]
      }
    }

    return [
      {
        type: WEBSOCKET_SEND,
        payload: modifyTableData,
      },
      {
        type: ACTIONS.UPDATE_VALUE,
        rowIdx: rowIdx,
        colIdx: colIdx,
        value: value,
      },
    ]
  }

  const insertRow = (newRow) => {
    return [
      {
        type: WEBSOCKET_SEND,
        payload: {
          action: 'create',
          data: newRow,
        },
      },
      {
        type: ACTIONS.UPDATE_VALUE,
        rowIdx: rowIdx,
        colIdx: colIdx,
        value: value,
      },
    ]
  }

  return async (dispatch, getState) => {
    let state = getState()
    let tableName = state.table.currentTable

    let data = state.table.data
    let columns = state.table.columns.values
    let primaryKey = state.table.primaryKey
    let columnData = state.table.columnInfo

    let primaryKeyIdx = columns.findIndex(x => x === primaryKey)
    let row = data[rowIdx]
    let key = row.values[primaryKeyIdx]

    //case 1, row is actually new, don't push to database until we have a key
    if (key === null && primaryKeyIdx !== colIdx) {
      return dispatch(updateVirtualValue())
    }
    //case 2, row is actually new, but we have the key and we can push
    else if (key === null && primaryKeyIdx === colIdx) {
      let newRow = {}
      columns.map((columnName, idx) => {
        let type = columnData[columnName].dataType
        newRow[columnName] = encodeByType((idx == colIdx) ? value : row[idx], type)
      })
      return dispatch(insertRow(newRow))
    }
    //case 3, a value was modified
    else {
      let keyType = columnData[primaryKey].dataType
      let keyRow = {
        [primaryKey]: encodeByType(key, keyType),
      }

      let otherColumnName = columns[colIdx]
      let type = columnData[otherColumnName].dataType
      let newRow = {
        [otherColumnName]: encodeByType(value, type),
      }
      return dispatch(updateValue(tableName, keyRow, newRow))
    }
  }
}