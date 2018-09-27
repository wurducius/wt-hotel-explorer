const defaultState = {
  errorPage: {},
  hotels: {},
};

const reducer = (state = defaultState, action) => {
  let modifiedHotels;
  let hotelMessages;
  switch (action.type) {
    case 'FETCH_DETAIL_FAILED':
      return Object.assign({}, state, {
        errorPage: {
          status: action.payload.status,
          message: action.payload.message,
        },
      });
    case 'FETCH_LIST_FAILED':
      return Object.assign({}, state, {
        errorPage: {
          status: action.payload.status,
          message: action.payload.message,
        },
      });
    case 'FETCH_HOTEL_ROOM_TYPES_FAILED':
    case 'FETCH_HOTEL_RATE_PLANS_FAILED':
    case 'FETCH_HOTEL_AVAILABILITY_FAILED':
      hotelMessages = [].concat(state.hotels[action.payload.code])
        .concat([action.payload.message])
        .filter(m => !!m);
      return Object.assign({}, state, {
        hotels: Object.assign({}, state.hotels, {
          [action.payload.code]: hotelMessages,
        }),
      });
    case 'FETCH_HOTEL_ROOM_TYPES_SUCCEEDED':
    case 'FETCH_HOTEL_RATE_PLANS_SUCCEEDED':
    case 'FETCH_HOTEL_AVAILABILITY_SUCCEEDED':
      modifiedHotels = Object.assign({}, state.hotels);
      delete modifiedHotels[action.payload.id];
      return state;
    default:
      return state;
  }
};

export default reducer;
