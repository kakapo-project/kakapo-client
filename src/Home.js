import React, { Component } from 'react'
import { Button, Card, Container, Dropdown, Grid, Icon, Image, Input, Menu, Modal, Segment, Sidebar, Transition } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'


import Login from './Login.js'

import Header from './Header.js'
import Entities from './entities/Entities.js'
import Settings from './Settings.js'

import { pullDomains, setEntitySelection, Selections } from './actions'

class Home extends Component {

  state = {
  }

  componentWillMount() {
    this.props.pullDomains()
  }

  render() {
    console.log('domains: ', this.props.domain)
    return (
      <div>
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
                    <Icon circular inverted size='huge' color='black' name='settings' />
                  </Segment>
                  <Card.Content>
                    <Card.Header>{domain.name}</Card.Header>
                    <Card.Meta>{domain.type}</Card.Meta>
                    <Card.Description>{domain.description}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <a>
                      <Icon name='favorite' color='grey'/>
                      Bookmark
                    </a>
                  </Card.Content>
                </Card>
              </Grid.Column>
            )}
          </Transition.Group>
        </Segment>
      </div>
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
)(Home)