
import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

import Home from './Home'
import Tables from './table/Tables'
import Queries from './queries/Queries'
import Scripts from './scripts/Scripts'
import Dashboard from './Dashboard'
import Login from './Login'

const isUserLoggedIn = () => {
  const jwt = localStorage.getItem('kakapoJWT')
  if (jwt) {
    let decoded = jwtDecode(jwt)
    let exp = new Date((decoded.exp || 0) * 1000)
    let now = new Date()

    if (now < exp) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

class App extends Component {
  render() {
    return (
      <main>
        <style>
          {`
            i.scheme-green.icon {
              color: #005322!important;
            }
            i.inverted.scheme-green.icon {
              color: #005322!important;
            }
            i.inverted.bordered.scheme-green.icon, i.inverted.circular.scheme-green.icon {
              background-color: #005322!important;
              color: #fff!important;
            }
          `}
        </style>
        <Switch>
          <Route exact path='/' render={() => {
            if (isUserLoggedIn()) {
              return <Home />
            } else {
              return <Redirect to='/login' />
            }
          }} />
          <Route path='/login' component={Login}/>
          <Route path='/:domain' component={Dashboard}/>
          <Route path='/:domain/tables/:name' component={Tables}/>
          <Route path='/:domain/queries/:name' component={Queries}/>
          <Route path='/:domain/scripts/:name' component={Scripts}/>

        </Switch>
      </main>
    )
  }
}

export default App