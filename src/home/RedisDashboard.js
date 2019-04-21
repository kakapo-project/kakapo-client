import React, { Component } from 'react'
import Tab, { Button, Icon, Image, Menu, Search, Segment, Sidebar } from 'semantic-ui-react'

import { connect } from 'react-redux'


import Login from '../Login.js'

import Header from '../Header.js'
import Entities from '../entities/Entities.js'
import Stator from '../Stator.js'

import { loadedPage, setEntitySelection, Selections } from '../actions'

class RedisDashboard extends Component {

  state = {}

  isEntityActive(selection) {
    return this.props.selections.includes(selection)
  }

  componentWillMount() {
    this.props.loadedPage()
  }

  render() {
    const { domain } = this.props
    const selections = [Selections.tables]

    return (
      <Stator>
        <Header hideSidebarToggle={true} />
        <Entities domain={domain} select={selections} />
      </Stator>
    )
  }
}


const mapStateToProps = (state) => ({
  isSidebarOpen: state.sidebar.isOpen,
  error: null,
})

const mapDispatchToProps = (dispatch) => ({
  loadedPage: () => dispatch(loadedPage(true)),
  setEntitySelection: (selection) => dispatch(setEntitySelection(selection)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RedisDashboard)