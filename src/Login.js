import React, { Component } from 'react'
import { Button, Divider, Form, Grid, Header, Image, Message, Segment, Transition } from 'semantic-ui-react'

import logo from './logo.svg'
import { API_URL } from './actions/config';
import { Route, Redirect } from 'react-router'



class LoginForm extends Component {

  state = {
    username: '',
    password: '',
    status: 'NONE',
  }

  async login(e) {

    try {
      let response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
      })

      let data = await response.json()

      if (data && data.error === 'Unauthorized') {
        this.setState({ status: 'UNAUTHORIZED' })
      } else if (data && data.error) {
        this.setState({ status: 'FAILED' })
      } else {
        localStorage.setItem('kakapoJWT', data.accessToken)
        localStorage.setItem('kakapoRefresh', data.refreshToken)
        this.setState({ status: 'SUCCESS' })
      }
    } catch (err) {
      this.setState({ status: 'FAILED' })
    }
  }

  render() {
    return ( this.state.status === 'SUCCESS' ?
      <Redirect to='/' />
      :
      <div className='login-form' style={{height: '100vh', background: 'linear-gradient(45deg, #222 0%, #005322 30%, #D8DD87 100%)'}}>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100vh;
          }
        `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Transition visible transitionOnMount animation='fade' duration={600}>
              <Form size='large'>
                <Segment style={{border: 0, boxShadow: '0px 0px 15px 0px rgba(10, 40, 30, 0.8)'}}>
                  <Header as='h2' color='grey' textAlign='center'>
                    <Image src={logo} /> Log in to Your Account
                  </Header>

                  { this.state.status === 'UNAUTHORIZED' ?
                    <Message
                      icon='lock'
                      header='Log in failed'
                      content='Was the username/password correct?'
                    />
                    :
                    this.state.status === 'FAILED' ?
                    <Message
                      icon='question circle'
                      header='Oops'
                      content='Something went wrong'
                    />
                    :
                    <></>
                  }

                  <Form.Input
                    fluid
                    icon='user'
                    iconPosition='left'
                    placeholder='E-mail address'
                    value={this.state.username}
                    onChange={(e, data) => this.setState({ username: data.value })}
                  />

                  <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    value={this.state.password}
                    onChange={(e, data) => this.setState({ password: data.value })}
                  />

                  <Button onClick={ (e) => this.login(e) } color='grey' fluid size='large'>
                    Login
                  </Button>
                </Segment>
              </Form>
            </Transition>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default LoginForm