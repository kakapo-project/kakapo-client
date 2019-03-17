
import React, { Component } from 'react'
import { Button, Card, Container, Divider, Dropdown, Form, Grid, Header, Icon, Input, Image, Label, Menu, Segment, Select, Sidebar } from 'semantic-ui-react'

import { connect } from 'react-redux'


import ErrorMsg from '../ErrorMsg'
import { DEFAULT_TYPE, ALL_TYPES } from '../actions/columns'


import { Controlled as CodeMirror } from 'react-codemirror2'
import _ from 'lodash'

import 'codemirror/addon/hint/sql-hint'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/darcula.css'


import { retrieveQuery, exitQuery, modifyQueryStatement, commitQueryChanges, ACTION_STATUS } from '../actions'

import QueryData from './QueryData.js'


const ParameterList = (props) => {
  const grouped = (arr, n) => {
    let result = []
    arr.map((x, idx) => {
      let g = idx / n >> 0
      result[g] = result[g] ? result[g].concat([x]) : [x]
    })
    return result
  }
  Array.prototype.grouped = function(n) { return grouped(this, n) }
  const N = 4

  return props.params.grouped(N).map((row, rowIdx) => (
    <Grid.Row key={rowIdx} style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
      {row.map((x, idx) => {
        let key = rowIdx * N + idx
        return (
          <Grid.Column key={key} width={16 / N >> 0}>
            <Input
              labelPosition='right'
              placeholder='Column Name'
              fluid
              value={x.value || ''}
              onChange={(e, data) => props.modifyParam(key, { value: data.value, type: 'string' })}
              action
            >
              <input />
              <Select
                compact
                defaultValue={DEFAULT_TYPE}
                options={ALL_TYPES.map(x => ({key: x, text: x, value: x}))}
                onChange={(e, data) => console.log('...')}
              />
              <Button icon='delete' color='orange' onClick={(e) => props.deleteParam(key)} />
            </Input>

          </Grid.Column>
        )
      })}
    </Grid.Row>
  ))
}

class QueriesBox extends Component {

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
    this.props.retrieveQuery(name)
  }

  uploadText(value) {
    this.props.modifyQuery(value)
  }

  uploadEditorChange = _.debounce(() => {
    this.props.commitQueryChanges()
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
      this.props.exitQuery()
    }, 0)
  }

  render() {

    let queryStatement = ''
    let queryName = ''
    let queryDescription = ''

    if (this.props.queryData) {
      queryStatement = this.props.queryStatement
      queryDescription = this.props.queryData.description
      queryName = this.props.queryData.name
    }

    return (
      <Segment basic padded style={{}}>
        <ErrorMsg error={this.state.error} onClose={(type) => this.closeErrorMessage(type)} types={this.errorMsgTypes}/>
        <Segment padded='very' style={{ minHeight: '100%' }}>
          <Header as='h2'>
            <Icon circular inverted color='scheme-green' name='find' />
            <Header.Content>
              {queryName}
              <Header.Subheader>{queryDescription}</Header.Subheader>
            </Header.Content>
          </Header>
          <Form>
            <CodeMirror
              options={{
                theme: 'darcula',
                mode: 'text/x-mysql',
                lineNumbers: true,
                styleActiveLine: true,
              }}
              autoSave
              value={queryStatement}
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
                <Grid.Column>
                  <Button
                    icon
                    circular
                    color='black'
                    size='large'
                    floated='right'
                    onClick={() => this.setState({ params: this.state.params.concat([{ value: '', type: DEFAULT_TYPE }]) })}
                  >
                    <Icon  name='add' /> {/* TODO: parameters, technically, don't need the add */}
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <ParameterList
                params={this.props.params}
                modifyParam={(key, value) => this.setState({params:
                  [...this.props.params.slice(0, key), value, ...this.props.params.slice(key + 1) ]
                })}
                deleteParam={(key) => this.setState({params:
                  [...this.props.params.slice(0, key), ...this.props.params.slice(key + 1) ]
                })}
              />
              <Divider hidden style={{ margin: '0.25rem' }}/>
            </Grid>

            {this.state.isTableLoaded ?
              <>
                <Divider />
                <QueryData
                  columns={this.state.columns}
                  data={this.state.data}
                />
              </>
              : <></>
            }
          </Segment>
        </Segment>
      </Segment>

    )
  }
}

const mapStateToProps = (state) => ({
  queryData: state.query.queryData,
  queryStatement: state.query.queryStatement,
  params: [], //TODO: put this in redux
})

const mapDispatchToProps = (dispatch) => ({
  retrieveQuery: (name) => dispatch(retrieveQuery(name)),
  exitQuery: () => dispatch(exitQuery()),
  modifyQuery: (newQueryStatement) => dispatch(modifyQueryStatement(newQueryStatement)),
  commitQueryChanges: () => dispatch(commitQueryChanges()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QueriesBox)