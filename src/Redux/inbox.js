import {GetMessage} from '@api';

const FETCH_MESSAGE_REQUEST = 'FETCH_MESSAGE_REQUEST';
const FETCH_MESSAGE_SUCCESS = 'FETCH_MESSAGE_SUCCESS';
const FETCH_MESSAGE_ERROR = 'FETCH_MESSAGE_ERROR';

const MESSAGE_SINGLEDATA_RESET = 'MESSAGE_SINGLEDATA_RESET';
const MESSAGE_DATA_RESET = 'MESSAGE_DATA_RESET';
const MESSAGE_COUNT_RESET = 'MESSAGE_COUNT_RESET';

const messageIntialState = {
  messageCount: 0,
  loader: false,
  inboxData: [],
  error: false,
};

const messageRequestProcess = () => {
  return {
    type: FETCH_MESSAGE_REQUEST,
  };
};

const messageRequestFail = () => {
  return {
    type: FETCH_MESSAGE_ERROR,
  };
};

const messageRequestSuccess = (payload, computeMessageCount) => {
  return {
    type: FETCH_MESSAGE_SUCCESS,
    payload,
    computeMessageCount,
  };
};

export const messageCountReset = () => {
  return {
    type: MESSAGE_COUNT_RESET,
  };
};
export const messageDataReset = () => {
  return {
    type: MESSAGE_DATA_RESET,
  };
};

export const messageSingleDataReset = (InboxNumber) => {
  return {
    type: MESSAGE_SINGLEDATA_RESET,
    InboxNumber,
  };
};
const messageReducer = (intialState = messageIntialState, action) => {
  const {type} = action;
  switch (type) {
    case FETCH_MESSAGE_REQUEST:
      return {
        ...intialState,
        loader: true,
        error: false,
      };
    case FETCH_MESSAGE_ERROR:
      return {
        ...intialState,
        loader: false,
        error: true,
      };
    case FETCH_MESSAGE_SUCCESS:
      return {
        inboxData: action.payload,
        loader: false,
        error: false,
        messageCount: action.computeMessageCount,
      };
    case MESSAGE_DATA_RESET:
      return {
        messageCount: 0,
        loader: false,
        inboxData: [],
        error: false,
      };
    case MESSAGE_COUNT_RESET:
      return {
        ...intialState,
        messageCount: 0,
      };
    case MESSAGE_SINGLEDATA_RESET:
      let updatedInbox = intialState.inboxData.filter(
        (singleInbox) => singleInbox.InboxNumber !== action.InboxNumber,
      );
      return {
        ...intialState,
        inboxData: updatedInbox,
      };
    default:
      return intialState;
  }
};

export const getMessageData = () => async (dispatch) => {
  dispatch(messageRequestProcess());

  const messageDetails = await GetMessage();
  let computeMessageCount = 0;
  if (messageDetails.result) {
    let updatedResponse = messageDetails.response.map((singleResponse) => {
      if (!singleResponse.IsRead) {
        computeMessageCount = computeMessageCount + 1;
      }

      return {...singleResponse};
    });

    dispatch(messageRequestSuccess(updatedResponse, computeMessageCount));
  } else {
    dispatch(messageRequestFail());
  }
};

export default messageReducer;
