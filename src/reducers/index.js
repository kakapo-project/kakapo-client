
import { combineReducers } from 'redux'
import table from './table.js'
import script from './script.js'
import sidebar from './sidebar.js'
import entityCreator from './entityCreator.js'
import data from './data.js'
import home from './home.js'


import createTable from './createTable.js'
import createScript from './createScript.js'
import createQuery from './createQuery.js'
import ws from './ws.js'

export default combineReducers({
  sidebar,
  table,
  script,
  entityCreator,
  data,
  home,
  ws,
  createQuery,
  createTable,
  createScript,
})
