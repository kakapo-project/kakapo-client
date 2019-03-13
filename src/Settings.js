
import React, { Component } from 'react'

import { Button, Card, Container, Divider, Grid, Icon, Image, Menu, Message, Segment, Sidebar, Tab } from 'semantic-ui-react'
import Header from './Header.js'

class Settings extends Component {
  state = { activeItem: 'Profile' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  renderContent() {
    let selection = this.state.activeItem

    switch (selection) {
      case 'Users':
        return <div></div>
      case 'Preferences':
        return <div></div>
      case 'Themes':
        return <div></div>
      case 'Authorization':
        return <div></div>
      case 'Plugins':
        return <div></div>
      case 'Environment':
        return <div></div>
      case 'Maintenance':
        return <div></div>
      case 'Updates':
        return <Message
          icon='check'
          header='Up to Date'
          content='Your Software is up to date.'
        />
    }
  }

  render() {
    const { activeItem } = this.state

    // Tabs: My Profile, Preferences, Themes, Auth, Plugins, Environment, Maintenance, Updates
    return (
      <div>
        <Header hideSidebarToggle={true} />
        <Divider hidden />
        <Container>
          <Menu pointing secondary icon='labeled' fluid widths={8}>
            <Menu.Item
              name='Users'
              active={activeItem === 'Users'}
              onClick={this.handleItemClick}
            >
              <Icon name='users' />
              Users
            </Menu.Item>
            <Menu.Item
              name='Preferences'
              active={activeItem === 'Preferences'}
              onClick={this.handleItemClick}
            >
              <Icon name='cog' />
              Preferences
            </Menu.Item>
            <Menu.Item
              name='Themes'
              active={activeItem === 'Themes'}
              onClick={this.handleItemClick}
            >
              <Icon name='paint brush' />
              Themes
            </Menu.Item>
            <Menu.Item
              name='Authorization'
              active={activeItem === 'Authorization'}
              onClick={this.handleItemClick}
            >
              <Icon name='key' />
              Authorization
            </Menu.Item>
            <Menu.Item
              name='Plugins'
              active={activeItem === 'Plugins'}
              onClick={this.handleItemClick}
            >
              <Icon name='puzzle' />
              Plugins
            </Menu.Item>
            <Menu.Item
              name='Environment'
              active={activeItem === 'Environment'}
              onClick={this.handleItemClick}
            >
              <Icon name='compass' />
              Environment
            </Menu.Item>
            <Menu.Item
              name='Maintenance'
              active={activeItem === 'Maintenance'}
              onClick={this.handleItemClick}
            >
              <Icon name='wrench' />
              Maintenance
            </Menu.Item>
            <Menu.Item
              name='Updates'
              active={activeItem === 'Updates'}
              onClick={this.handleItemClick}
            >
              <Icon name='refresh' />
              Updates
            </Menu.Item>
          </Menu>

          { this.renderContent() }
        </Container>
      </div>
    )
  }
}

export default Settings

