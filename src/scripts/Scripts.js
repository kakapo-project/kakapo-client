
import React, { Component } from 'react'
import { Button, Card, Container, Divider, Dropdown, Form, Grid, Icon, Input, Image, Label, Menu, Segment, Select, Sidebar } from 'semantic-ui-react'

import { connect } from 'react-redux'


import ErrorMsg from '../ErrorMsg'
import { DEFAULT_TYPE, ALL_TYPES } from '../actions/columns'


import { Controlled as CodeMirror } from 'react-codemirror2'
import _ from 'lodash'


import Header from '../Header.js'

import { loadedPage } from '../actions'
import Stator from '../Stator.js'
import ScriptBox from './ScriptBox';


const ScriptsSidebar = (props) => (
  <Sidebar
    as={Menu}
    animation='overlay'
    icon='labeled'
    inverted
    direction='right'
    vertical
    visible={props.sidebarOpen}
    width='thin'
  >
    <Menu.Item
        as='a'>
      <Icon name='download' />
      Download File
    </Menu.Item>
    <Menu.Item
        as='a'>
      <Icon name='upload' />
      Upload File
    </Menu.Item>
    <Menu.Item
        as='a'>
      <Icon name='anchor' />
      API
    </Menu.Item>
    <Menu.Item
        as='a'>
      <Icon name='history' />
      History
    </Menu.Item>
    <Divider />
    <Menu.Item
        as='a'>
      <Icon name='plus' />
      Create New
    </Menu.Item>
    <Menu.Item
        as='a'>
      <Icon name='clone' />
      Duplicate
    </Menu.Item>
    <Menu.Item
        as='a'>
      <Icon name='edit' />
      Modify
    </Menu.Item>
    <Menu.Item
        as='a'>
      <Icon name='undo alternate' />
      Rollback
    </Menu.Item>
    <Menu.Item
        as='a'>
      <Icon name='trash' />
      Delete
    </Menu.Item>
    <Divider />
    <Menu.Item
        as='a'>
      <Icon name='shield' />
      Access
    </Menu.Item>
  </Sidebar>
)

class Scripts extends Component {

  componentWillMount() {
    this.props.loadedPage()
  }

  render() {
    const { name, domain } = this.props.match.params

    return (
      <Stator>
        <style>
          {`
            .react-codemirror2 > div.CodeMirror {
              border-radius: 5px;
            }
          `}
        </style>
        <Header editor />
        <Sidebar.Pushable className='basic attached' as={Segment} style={{height: '100vh', border: 0}}>
          <ScriptsSidebar sidebarOpen={this.props.isSidebarOpen} />
          <Sidebar.Pusher>
            <ScriptBox name={name} domain={domain} />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Stator>
    )
  }

  // Generate Query fields
  // Run Button
  // Dry Run Button
  // NOTE: Auto run if no changes within 5 seconds
}

const mapStateToProps = (state) => ({
  isSidebarOpen: state.sidebar.isOpen,
  error: null,
})

const mapDispatchToProps = (dispatch) => ({
  loadedPage: () => dispatch(loadedPage()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scripts)