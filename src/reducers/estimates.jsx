import moment from 'moment';

const defaultState = {
  guestData: {
    arrival: moment().isoWeekday(5).startOf('day').format('YYYY-MM-DD'),
    departure: moment().isoWeekday(7).startOf('day').format('YYYY-MM-DD'),
    numberOfGuests: 1,
  },
  current: {},
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_GUEST_DATA':
      return Object.assign({}, state, {
        guestData: {
          ...action.payload,
        },
      });
    case 'SET_ESTIMATES':
      return Object.assign({}, state, {
        current: {
          ...state.current,
          [action.payload.id]: action.payload.data,
        },
      });
    default:
      return state;
  }
};

export default reducer;
