
import React, { Component } from 'react'
import {
  Button,
  Card,
  Container,
  Divider,
  Dimmer,
  Dropdown,
  Loader,
  Grid,
  Icon,
  Image,
  Input,
  Label,
  Pagination,
  Segment,
  Sidebar,
  Table
} from 'semantic-ui-react'



import Header from '../Header.js'
import ErrorMsg from '../ErrorMsg'


import { connect } from 'react-redux'

import { requestingTableData, addRow, deleteRow, modifyValue, copySelection } from '../actions'


import { DataGrid, ContextMenu, NumberFormatter, DefaultFormatter } from '../data-grid/index.js'

class TableData extends Component {


  state = {
    topLeft: {
      idx: -1,
      col: -1,
    },
    bottomRight: {
      idx: -1,
      col: -1,
    },
  }

  contexMenuHandler(click, row, col, e) {
    console.log('click: ', click, row, col)
    const domain = this.props.domain

    if (col === null) { // is clicked on row index
      switch (click) {
        case 'delete': return this.props.deleteRow(domain, row)
        case 'add': return this.props.addRow(domain, row)
        case 'cut': return
        case 'copy': return
        case 'paste': return
      }
    } else if (row === null ) { // is clicked on column

    } else {
      switch (click) {
        case 'cut': return
        case 'copy': return this.props.copySelection(this.state, e)
        case 'paste': return
      }
    }
  }

  render() {
    const domain = this.props.domain
    let columnInfo = this.props.columnInfo
    let columnNames = this.props.columns.values || []
    console.log('this.props.data: ', this.props)

    let tableData = this.props.data.map((row) => row.values)

    let columns = ['', ...columnNames].map((x, idx) => ({
      key: idx,
      name: x,
      editable: x => (x[0] !== '' && idx !== 0),
      frozen: (idx === 0) ? true : false,
      formatter: (columnInfo[x] && columnInfo[x].dataType === 'integer') ? NumberFormatter : DefaultFormatter,
    }))

    console.log('tableData: ', tableData)
    let data = [columnNames, ...tableData].map((x, idx) => [idx || '', ...x])

    return (
      <DataGrid
        columns={columns}
        domain={domain}
        data={data}
        modifyValue={(rowIdx, colIdx, value) => this.props.modifyValue(domain, rowIdx, colIdx, value)}
        contextMenu={(props) =>
          <ContextMenu
            {...props}
            clickHandler={(click, row, col, e) => this.contexMenuHandler(click, row, col, e)}
          />}
        onSelectionComplete={({ topLeft, bottomRight }) => this.setState({ topLeft, bottomRight })}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  data: state.table.data,
  columns: state.table.columns,
  columnInfo: state.table.columnInfo,
})

const mapDispatchToProps = (dispatch) => ({
  requestingTableData: (domain) => dispatch(requestingTableData(domain)),
  deleteRow: (domain, idx) => dispatch(deleteRow(domain, idx)),
  addRow: (domain, idx) => dispatch(addRow(domain, idx)),
  modifyValue: (domain, rowIdx, colIdx, value) => dispatch(modifyValue(domain, rowIdx, colIdx, value)),
  copySelection: ({ topLeft, bottomRight }, e) => dispatch(copySelection(topLeft, bottomRight, e)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableData)