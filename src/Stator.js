// @flow
import React, { Component, Node } from 'react'
import { connect } from 'react-redux'

import { Button, Card, Container, Divider, Form, Grid, Icon, Image, Menu, Message, Segment, Sidebar, Tab } from 'semantic-ui-react'
import Header from './Header.js'

import { ACTION_STATUS, startWebsocketConnection, authenticateWebsocket, finishAuthenticateWebsocket } from './actions'


type Props = {
  children?: Node,
}

class Stator extends Component<Props> {

  componentWillMount() {
    switch (this.props.ws.status) {
      case ACTION_STATUS.NOT_CONNECTED:
        this.props.startWebsocketConnection()
        return
      default:
        return
    }

  }

  componentWillUnmount() {
    //TODO: stop websocket connection
  }

  render() {
    switch (this.props.ws.status) {
      case ACTION_STATUS.CONNECTED:
      case ACTION_STATUS.REQUIRE_AUTH:
        const token = localStorage.getItem('kakapoJWT')
        this.props.authenticateWebsocket(token)
        break
      case ACTION_STATUS.AUTHENTICATED:
        this.props.finishAuthenticateWebsocket()
        break
      default:
        break
    }

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
  authenticateWebsocket: (token) => dispatch(authenticateWebsocket(token)),
  finishAuthenticateWebsocket: () => dispatch(finishAuthenticateWebsocket()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stator)