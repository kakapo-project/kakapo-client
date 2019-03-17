
import { WEBSOCKET_CLOSED, WEBSOCKET_OPEN, WEBSOCKET_MESSAGE } from '@giantmachines/redux-websocket'
import { ACTIONS, ACTION_STATUS } from '../actions'

const initialState = {
  status: ACTION_STATUS.NOT_CONNECTED,
}

const sidebar = (state = initialState, action) => {
  switch (action.type) {
    case WEBSOCKET_OPEN:
      return {
        ...state,
        status: ACTION_STATUS.CONNECTED
      }
    case WEBSOCKET_CLOSED:
      return {
        ...state,
        status: ACTION_STATUS.NOT_CONNECTED
      }
    case ACTIONS.WEBSOCKET_DID_AUTH:
      return {
        ...state,
        status: ACTION_STATUS.AUTHENTICATED
      }
    case ACTIONS.WEBSOCKET_WAITING_FOR_AUTH:
      return {
        ...state,
        status: ACTION_STATUS.REQUIRE_AUTH
      }
    default:
      return state
  }
}

export default sidebar