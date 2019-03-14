// @flow
import React, { Component, Node } from 'react'
import { connect } from 'react-redux'

import { Button, Card, Container, Divider, Form, Grid, Icon, Image, Menu, Message, Segment, Sidebar, Tab } from 'semantic-ui-react'
import Header from './Header.js'

import { startWebsocketConnection } from './actions'

type Props = {
  children?: Node,
}

class Stator extends Component<Props> {

  componentWillMount() {
    this.props.startWebsocketConnection()
  }

  render() {
    console.log('ws status: ', this.props.ws)
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ws: state.ws,
})

const mapDispatchToProps = (dispatch) => ({
  startWebsocketConnection: () => dispatch(startWebsocketConnection()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stator)