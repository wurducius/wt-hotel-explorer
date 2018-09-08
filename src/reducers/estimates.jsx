import moment from 'moment';

const baseDate = moment().isoWeekday() <= 4 ? moment() : moment().isoWeekday(1).add(7, 'days');
const defaultArrival = moment(baseDate).isoWeekday(5).startOf('day').format('YYYY-MM-DD');
const defaultDeparture = moment(baseDate).isoWeekday(7).startOf('day').format('YYYY-MM-DD');

const defaultState = {
  guestData: {
    arrival: defaultArrival,
    departure: defaultDeparture,
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
