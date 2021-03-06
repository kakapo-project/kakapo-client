import React, { Component } from 'react'
import { Button, Card, Container, Dropdown, Grid, Icon, Image, Input, Menu, Modal, Segment, Sidebar, Transition } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'


import Login from '../Login.js'

import Header from '../Header.js'
import Entities from '../entities/Entities.js'
import Stator from '../Stator.js'

import { pullDomains, setEntitySelection, Selections } from '../actions'

class ChooseDomain extends Component {

  componentWillMount() {
    this.props.pullDomains()
  }

  getDomainIcon(domainType) {
    switch (domainType) {
      case 'POSTGRES':
        return 'cube'
      case 'REDIS':
        return 'lightning'
      case 'SIMPLE_RUNNER':
        return 'terminal'
      default:
        return 'exchange'
    }
  }

  getDomainColor(domainType) {
    switch (domainType) {
      case 'POSTGRES':
        return 'scheme-green'
      case 'REDIS':
        return 'black'
      case 'SIMPLE_RUNNER':
        return 'grey'
      default:
        return 'black'
    }
  }

  render() {
    console.log('domains: ', this.props.domain)
    return (
      <Stator>
        <Header hideSidebarToggle={true} />
        <Segment basic>
          <Transition.Group as={Grid} animation='scale' duration={400} container doubling columns={3} >
            { this.props.domains.map( (domain, idx) =>
              <Grid.Column key={domain.name}>
                <Card
                  link
                  as={Link}
                  to={`/${domain.name}`}
                >
                  <Segment textAlign='center' basic>
                    <Icon
                      circular
                      inverted
                      size='huge'
                      color={this.getDomainIcon(domain.type)}
                      name={this.getDomainColor(domain.type)}
                    />
                  </Segment>
                  <Card.Content>
                    <Card.Header>{domain.name}</Card.Header>
                    <Card.Meta>{domain.type}</Card.Meta>
                    <Card.Description>{domain.description}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Icon name='favorite' color='grey'/>
                    Bookmark
                  </Card.Content>
                </Card>
              </Grid.Column>
            )}
          </Transition.Group>
        </Segment>
      </Stator>
    )
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
)(ChooseDomain)