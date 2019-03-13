import React from 'react';
import ReactDOM from 'react-dom'
import App from './App';
import * as serviceWorker from './serviceWorker'

import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import { API_URL } from './actions/config';


import 'semantic-ui-css/semantic.min.css'


function runRefreshLoop(expiresIn) {
  let timeout = expiresIn / 2
  setTimeout(async () => {
    const jwt = localStorage.getItem('kakapoJWT')
    const refreshToken = localStorage.getItem('kakapoRefresh')
    if (!jwt || !refreshToken) {
      console.log('no jwt or refresh token, user not logged in')
      localStorage.removeItem('kakapoJWT')
      localStorage.removeItem('kakapoRefresh')
      return
    }

    try {
      let response = await fetch(`${API_URL}/users/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ refreshToken }),
      })

      let data = await response.json()

      if (!data) {
        console.log('No data, error')
        localStorage.removeItem('kakapoJWT')
        localStorage.removeItem('kakapoRefresh')
        return
      }

      if (data.error) {
        console.log('Error refreshing token: ', data.error)
        localStorage.removeItem('kakapoJWT')
        localStorage.removeItem('kakapoRefresh')
        return
      }

      localStorage.setItem('kakapoJWT', data.accessToken)
      localStorage.setItem('kakapoRefresh', data.refreshToken)

      runRefreshLoop(data.expiresIn)

    } catch (err) {
      console.log('Encountered exception in refresh loop: ', err)
    }
  }, timeout * 1000)
}

runRefreshLoop(0)
//TODO: add a clearTimeout utility for logout

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root'));

serviceWorker.unregister();
