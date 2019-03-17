
import React, { Component } from 'react'
import { Button, Card, Container, Divider, Dropdown, Form, Grid, Header, Icon, Input, Image, Label, Menu, Segment, Select, Sidebar } from 'semantic-ui-react'

import { connect } from 'react-redux'


import ErrorMsg from '../ErrorMsg'
import { DEFAULT_TYPE, ALL_TYPES } from '../actions/columns'


import { Controlled as CodeMirror } from 'react-codemirror2'
import _ from 'lodash'

import 'codemirror/mode/python/python'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/darcula.css'



import { retrieveScript, exitScript, modifyScriptText, commitScriptChanges, ACTION_STATUS } from '../actions'

class Scripts extends Component {

  state = {
    statement: '',
    isRunningQuery: false,
    error: null,
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

  setupConnection() {
    const { name, domain } = this.props

    console.log('supposedly sending dispatch')
    this.props.retrieveScript(name)
  }

  uploadText(value) {
    this.props.modifyScript(value)
  }

  uploadEditorChange = _.debounce(() => {
    this.props.commitScriptChanges()
  }, 500)

  runQuery() {
    this.setState({ isRunningQuery: true })

    let sendRunQuery = {
      action: 'runQuery',
      params: []
    }
    this.socket.send(JSON.stringify(sendRunQuery))
  }

  componentDidMount() {
    setTimeout(() => { //TODO: why?
      this.setupConnection()
    }, 0)
  }

  componentWillUnmount() {
    setTimeout(() => { //TODO: why?
      this.props.exitScript()
    }, 0)
  }

  render() {

    let scriptText = ''
    let scriptName = ''
    let scriptDescription = ''

    if (this.props.scriptData) {
      scriptText = this.props.scriptText
      scriptDescription = this.props.scriptData.description
      scriptName = this.props.scriptData.name
    }

    return (
      <Segment basic padded style={{}}>
        <ErrorMsg error={this.state.error} onClose={(type) => this.closeErrorMessage(type)} types={this.errorMsgTypes}/>
        <Segment padded='very' style={{ minHeight: '100%' }}>
          <Header as='h2'>
            <Icon circular inverted color='scheme-green' name='code' />
            <Header.Content>
              {scriptName}
              <Header.Subheader>{scriptDescription}</Header.Subheader>
            </Header.Content>
          </Header>
          <Form>
            <CodeMirror
              options={{
                theme: 'darcula',
                mode: 'python',
                lineNumbers: true,
                styleActiveLine: true,
              }}
              autoSave
              value={scriptText}
              onBeforeChange={(editor, data, value) => {
                this.uploadText(value)
                this.uploadEditorChange()
              }}
              onChange={(editor, data, value) => {
                console.log('statment changed: ', editor, data, value) //TODO: when to use this
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
  scriptData: state.script.scriptData,
  scriptText: state.script.scriptText,
})

const mapDispatchToProps = (dispatch) => ({
  retrieveScript: (name) => dispatch(retrieveScript(name)),
  exitScript: () => dispatch(exitScript()),
  modifyScript: (newScriptText) => dispatch(modifyScriptText(newScriptText)),
  commitScriptChanges: () => dispatch(commitScriptChanges()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scripts)