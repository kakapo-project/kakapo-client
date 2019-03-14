
import { WEBSOCKET_CLOSED, WEBSOCKET_OPEN, WEBSOCKET_MESSAGE } from '@giantmachines/redux-websocket'
import { ACTIONS } from '../actions'

const Status = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  CONNECTED: 'CONNECTED',
}

const initialState = {
  status: Status.NOT_CONNECTED,
}

const sidebar = (state = initialState, action) => {
  switch (action.type) {
    case WEBSOCKET_OPEN:
      return {
        ...state,
        status: Status.CONNECTED
      }
    case WEBSOCKET_CLOSED:
      return {
        ...state,
        status: Status.NOT_CONNECTED
      }
    default:
      return state
  }
}

export default sidebar