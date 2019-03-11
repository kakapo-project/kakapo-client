
import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Home from './Home'
import Tables from './table/Tables'
import Queries from './queries/Queries'
import Scripts from './scripts/Scripts'
import Login from './Login'

const isUserLoggedIn = () => {
  const jwt = localStorage.getItem('kakapoJWT')
  if (jwt) {
    //TODO: check jwt
    return true
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
          <Route path='/tables/:name' component={Tables}/>
          <Route path='/queries/:name' component={Queries}/>
          <Route path='/scripts/:name' component={Scripts}/>
          <Route path='/login' component={Login}/>
        </Switch>
      </main>
    )
  }
}

export default App