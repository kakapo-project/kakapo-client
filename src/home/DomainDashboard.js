import React, { Component } from 'react'
import Tab, { Button, Icon, Image, Menu, Search, Segment, Sidebar } from 'semantic-ui-react'

import { connect } from 'react-redux'


import Login from '../Login.js'

import Header from '../Header.js'
import Entities from '../entities/Entities.js'
import Stator from '../Stator.js'

import { loadedPage, setEntitySelection, Selections } from '../actions'

class DomainDashboard extends Component {

  state = {}

  isEntityActive(selection) {
    return this.props.selections.includes(selection)
  }

  componentWillMount() {
    this.props.loadedPage()
  }

  render() {
    const { domain } = this.props.match.params
    const { selections } = this.props

    return (
      <Stator>
        <Header />
        <Sidebar.Pushable className='basic attached' as={Segment} style={{height: '100vh', border: 0}}>
          <Sidebar
            as={Menu}
            animation='scale down'
            icon='labeled'
            inverted
            vertical
            visible={this.props.isSidebarOpen}
            width='thin'
            style={{backgroundImage: 'linear-gradient(#1b1c1d, rgb(0, 83, 34)'}}
          >
            <Menu.Item
                as='a'
                active={this.isEntityActive(Selections.tables)}
                style={{marginTop: '4vh'}}
                onClick={e => this.props.setEntitySelection(Selections.tables)}>
              <Icon name='database' />
              Tables
            </Menu.Item>
            <Menu.Item
                as='a'
                active={this.isEntityActive(Selections.views)}
                onClick={e => this.props.setEntitySelection(Selections.views)}>
              <Icon name='eye' />
              Views
            </Menu.Item>
            <Menu.Item
                as='a'
                active={this.isEntityActive(Selections.queries)}
                onClick={e => this.props.setEntitySelection(Selections.queries)}>
              <Icon name='find' />
              Queries
            </Menu.Item>
            <Menu.Item
                as='a'
                active={this.isEntityActive(Selections.scripts)}
                onClick={e => this.props.setEntitySelection(Selections.scripts)}>
              <Icon name='code' />
              Scripts
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher>
            <Entities domain={domain} select={selections} />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Stator>
    )
  }
}


const mapStateToProps = (state) => ({
  isSidebarOpen: state.sidebar.isOpen,
  selections: state.home.selections,
  error: null,
})

const mapDispatchToProps = (dispatch) => ({
  loadedPage: () => dispatch(loadedPage(true)),
  setEntitySelection: (selection) => dispatch(setEntitySelection(selection)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DomainDashboard)