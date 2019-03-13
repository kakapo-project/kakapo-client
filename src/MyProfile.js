
import React, { Component } from 'react'

import { Button, Card, Container, Divider, Form, Grid, Icon, Image, Menu, Message, Segment, Sidebar, Tab } from 'semantic-ui-react'
import Header from './Header.js'

class MyProfile extends Component {

  render() {
    return (
      <div>
        <Header hideSidebarToggle={true} />
        <Divider hidden />
        <Container>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' circular />
              </Grid.Column>
              <Grid.Column width={2}></Grid.Column>
              <Grid.Column width={10}>
                <Form>
                  <Form.Input fluid label='Username' placeholder='Username' readOnly/>
                  <Form.Input fluid label='Email' placeholder='user@example.com' readOnly/>
                  <Form.Input fluid label='Name' placeholder='John Doe' />
                </Form>
                <Divider hidden />
                <Divider hidden />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <Button fluid>Change Avatar</Button>
              </Grid.Column>
              <Grid.Column width={2}></Grid.Column>
              <Grid.Column width={10}>
                <Button>Change Password</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }
}

export default MyProfile

