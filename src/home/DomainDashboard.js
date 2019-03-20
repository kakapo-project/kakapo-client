import React, { Component } from 'react'
import { Button, Card, Container, Dropdown, Grid, Icon, Image, Input, Menu, Modal, Segment, Sidebar, Transition } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'

import { connect } from 'react-redux'


import Login from '../Login.js'

import Header from '../Header.js'
import Entities from '../entities/Entities.js'
import Stator from '../Stator.js'

import { pullDomains, setEntitySelection, Selections } from '../actions'
import PostgresDashboard from './PostgresDashboard.js';
import RedisDashboard from './RedisDashboard.js';

class DomainDashboard extends Component {

  componentWillMount() {
    this.props.pullDomains()
  }

  render() {
    const domainName = this.props.match.params.domain
    const domains = this.props.domains.filter(x => x.name === domainName)

    if (domains.length === 0) {
      return <Redirect to='/' />
    }

    const domain = domains[0]

    switch (domain.type) {
      case 'POSTGRES':
        return <PostgresDashboard domain={domainName} />
      case 'REDIS':
        return <RedisDashboard domain={domainName} />
      default:
        return <Redirect to='/' />
    }
  }
}

const mapStateToProps = (state) => ({
  error: null,
  domains: state.data.domains,
})

const mapDispatchToProps = (dispatch) => ({
  pullDomains: () => dispatch(pullDomains()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DomainDashboard)