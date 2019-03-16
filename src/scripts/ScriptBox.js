
import React, { Component } from 'react'
import { Button, Card, Container, Divider, Dropdown, Form, Grid, Icon, Input, Image, Label, Menu, Segment, Select, Sidebar } from 'semantic-ui-react'

import { connect } from 'react-redux'


import ErrorMsg from '../ErrorMsg'
import { DEFAULT_TYPE, ALL_TYPES } from '../actions/columns'


import { Controlled as CodeMirror } from 'react-codemirror2'
import _ from 'lodash'

import 'codemirror/addon/hint/sql-hint'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/darcula.css'


import Header from '../Header.js'

import { loadedPage, retrieveScript, ACTION_STATUS } from '../actions'

class Scripts extends Component {

  state = {
    sidebarOpen: false,
    localStatement: null,
    statement: '',
    isRunningQuery: false,
    isTableLoaded: false,
    error: null,
  }

  setupConnection() {
    const { name, domain } = this.props

    console.log('supposedly sending dispatch')
    this.props.retrieveScript(name)

    /*
    const url = `${WS_URL}/script/${name}`
    this.socket = new WebSocket(url);
    console.log('socket: ', this.socket)

    let sendGetQuery = {
      action: 'getScript',
    }

    this.socket.onopen = (event) => {
      this.socket.send(JSON.stringify(sendGetQuery))
    }

    this.socket.onerror = (event) => {
      console.log('error')
      this.raiseError('Could not setup connection')
    }

    this.socket.onclose = (event) => {
      console.error('WebSocket closed: ', event)
    }

    this.socket.onmessage = (event) => {
      let incomingData = JSON.parse(event.data)

      let action = incomingData.action
      let rawData = incomingData.data

      switch (action) {
        case 'getScript':
        case 'postScript':
          console.log('getTable: rawData: ', rawData)
          this.setState({
            statement: rawData.statement,
          })
          return
        case 'runScript': {
          console.log('runScript: rawData: ', rawData)
          return
        }
      }
    }
    */
  }

  uploadText(value) {
    console.log('uploadText')
    const { name } = this.props.match.params

    let postScriptQuery = {
      action: 'postScript',
      data: {
        name: name,
        text: value
      }
    }
    this.socket.send(JSON.stringify(postScriptQuery))
  }

  updateEvent = _.debounce((e) => console.log('e: ', e), 500)

  toggleSidebar() {
    this.setState({
      sidebarOpen: !this.state.sidebarOpen,
    })
  }

  raiseError(msg) {
    this.setState({ error: msg })
  }

  errorMsgTypes = ['Retry', 'Go Back']
  closeErrorMessage(type) {
    switch (type) {
      case this.errorMsgTypes[0]:
        this.setupConnection()
        this.setState({ error: null })
        return
      case this.errorMsgTypes[1]:
        this.props.history.push('/')
        return
    }
  }

  runQuery() {
    this.setState({ isRunningQuery: true })

    let sendRunQuery = {
      action: 'runQuery',
      params: []
    }
    this.socket.send(JSON.stringify(sendRunQuery))
  }

  uploadEditorChange = _.debounce((value) => {
    this.uploadText(value)
  }, 500)

  componentDidMount() {
    setTimeout(() => { //TODO: why?
      this.setupConnection()
    }, 0)
  }

  render() {
    return (
      <Segment basic padded style={{}}>
        <ErrorMsg error={this.state.error} onClose={(type) => this.closeErrorMessage(type)} types={this.errorMsgTypes}/>
        <Segment padded='very' style={{ minHeight: '100%' }}>
          <Form>
            <CodeMirror
              options={{
                theme: 'darcula',
                mode: 'text/x-mysql',
                lineNumbers: true,
                styleActiveLine: true,
              }}
              autoSave
              value={this.state.localStatement || this.state.statement}
              onBeforeChange={(editor, data, value) => {
                this.setState({ localStatement: value })
                this.uploadEditorChange(value)
              }}
              onChange={(editor, data, value) => {
                console.log('statment        changed: ', editor, data, value) //TODO: when to use this
              }}
            />
          </Form>
          <Segment>
          <Grid columns='equal'>
            <Grid.Row>
              <Grid.Column>
                <Button
                  color='black'
                  icon
                  size='large'
                  floated='left'
                  labelPosition='right'
                  loading={this.state.isRunningQuery}
                  onClick={(e) => this.runQuery()}
                >
                  Run
                  {this.state.isRunningQuery ? <></> :
                    <Icon color='green' name='play' />
                  }
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>

        </Segment>
        </Segment>
      </Segment>

    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
  loadedPage: () => dispatch(loadedPage()),
  retrieveScript: (name) => dispatch(retrieveScript(name)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scripts)