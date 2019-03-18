import React, { Component } from 'react'
import {
  Button,
  Card,
  Container,
  Divider,
  Dimmer,
  Loader,
  Grid,
  Icon,
  Image,
  Input,
  Label,
  Menu,
  Modal,
  Pagination,
  Segment,
  Sidebar,
  Table
} from 'semantic-ui-react'


import Header from '../Header.js'
import ErrorMsg from '../ErrorMsg'


import { connect } from 'react-redux'

import { retrieveTable, requestingTableData, exitTable, loadedPage } from '../actions'

import TableData from './TableData'
import { DataExporter, DataImporter, Api } from './menus'
import Stator from '../Stator.js'


const actions = [
  {
    name: 'exportData',
    button: (props) => <><Icon name='download' />Export Data</>,
    modal: (props) => <DataExporter {...props} />,
  },
  {
    name: 'importData',
    button: (props) => <><Icon name='cloud upload' />Import Data</>,
    modal: (props) => <DataImporter {...props} />,
  },
  {
    name: 'api',
    button: (props) => <><Icon name='anchor' />API</>,
    modal: (props) => <Api {...props} />,
  },
  {
    name: 'history',
    button: (props) => <><Icon name='history' />History</>,
    modal: (props) => <></>,
  },
  null,
  {
    name: 'history',
    button: (props) => <><Icon name='plus' />Create New</>,
    modal: (props) => <></>,
  },
  {
    name: 'history',
    button: (props) => <><Icon name='clone' />Duplicate</>,
    modal: (props) => <></>,
  },
  {
    name: 'history',
    button: (props) => <><Icon name='edit' />Modify</>,
    modal: (props) => <></>,
  },
  {
    name: 'history',
    button: (props) => <><Icon name='undo alternate' />Rollback</>,
    modal: (props) => <></>,
  },
  {
    name: 'history',
    button: (props) => <><Icon name='trash' />Delete</>,
    modal: (props) => <></>,
  },
  {
    name: 'history',
    button: (props) => <><Icon name='shield' />Access</>,
    modal: (props) => <></>,
  },

]

const TableSidebar = (props) => (
  <Sidebar
    as={Menu}
    animation='overlay'
    icon='labeled'
    inverted
    direction='right'
    vertical
    visible={props.visible}
    width='thin'
  >

    {actions.map((x, idx) => (
      (x === null) ?
      <Divider idx={idx} key={idx} />
      :
      <Modal
        trigger={
          <Menu.Item
            as='a'
            onClick={() => props.openModal(x.name)}
          >
            {x.button({})}
          </Menu.Item>
        }
        open={props.modalOpen === x.name}
        onClose={() => props.onComplete(null, {})}
        idx={idx}
        key={idx}
        basic
      >
        {
          x.modal({
            onComplete: (data) => props.onComplete(x.name, data)
          })
        }
      </Modal>
    ))}
  </Sidebar>
)

class Tables extends Component {

  state = {
    modalOpen: null,
  }


  componentDidMount() {
    const { name } = this.props.match.params
    this.props.loadedPage()

    setTimeout(() => { //TODO: why?
      this.props.retrieveTable(name)
      this.props.requestingTableData()
    }, 0)
  }

  componentWillUnmount() {
    setTimeout(() => { //TODO: why?
      this.props.exitTable()
    }, 0)
  }

  onFormComplete(action, data) {
    switch (action) {
      case 'exportData': {
        let { fileName, fileType } = data
        console.log('fileName: ', fileName, 'fileType', fileType)
      }
    }

    this.setState({ modalOpen: null })
  }

  render() {
    console.log('isTableLoaded: ', this.props.isTableLoaded)


    return (
      <Stator>
        <Header editor />
        {/* <ErrorMsg error={this.props.error} onClose={(type) => this.closeErrorMessage(type)} types={this.errorMsgTypes}/> */}
        <Sidebar.Pushable className='basic attached' as={Segment} style={{height: '100vh', border: 0}}>
          <TableSidebar
            visible={ this.props.isSidebarOpen }
            onComplete={ (action, data) => this.onFormComplete(action, data) }
            openModal={ (modal) => this.setState({ modalOpen: modal }) }
            modalOpen={ this.state.modalOpen }
          />

          <Sidebar.Pusher>
            <Dimmer active={!this.props.isTableLoaded}>
              <Loader size='big'>Loading</Loader>
            </Dimmer>
            <Segment basic padded style={{}}>
              <Segment padded style={{ height: '100%', overflowX: 'hidden'}}>
                <Segment>
                  <Label as='a'>
                    <Icon name='mouse pointer' />
                    select
                    <Icon name='delete' />
                  </Label>
                  <Label as='a'>
                    <Icon name='filter' />
                    where
                    <Icon name='delete' />
                  </Label>
                  <Label as='a'>
                    <Icon name='sort' />
                    order by
                    <Icon name='delete' />
                  </Label>
                  <Label as='a' color='green'>
                    <Icon name='add' style={{marginRight: 0}}/>
                  </Label>
                </Segment>
                { this.props.isTableConnected ?
                  <TableData />
                  :
                  <></>
                }
              </Segment>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Stator>
    );
  }
}


const mapStateToProps = (state) => ({
  isTableConnected: state.table.isConnected,
  isTableLoaded: state.table.isLoaded,
  isSidebarOpen: state.sidebar.isOpen,
  error: null,
})

const mapDispatchToProps = (dispatch) => ({
  retrieveTable: (tableName) => dispatch(retrieveTable(tableName)),
  requestingTableData: () => dispatch(requestingTableData()),
  exitTable: () => dispatch(exitTable()),
  loadedPage: () => dispatch(loadedPage()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tables)