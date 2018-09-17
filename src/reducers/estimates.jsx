import moment from 'moment';

const baseDate = moment().isoWeekday() <= 4 ? moment() : moment().isoWeekday(1).add(7, 'days');
const defaultArrival = moment(baseDate).isoWeekday(5).startOf('day');
const defaultDeparture = moment(baseDate).isoWeekday(7).startOf('day');

const defaultState = {
  guestData: {
    arrival: defaultArrival.format('YYYY-MM-DD'),
    departure: defaultDeparture.format('YYYY-MM-DD'),
    guestAges: [],
    helpers: {
      numberOfGuests: 0,
      lengthOfStay: defaultDeparture.diff(defaultArrival, 'days'),
      arrivalDateMoment: defaultArrival,
      departureDateMoment: defaultDeparture,
    },
  },
  current: {},
};

const reducer = (state = defaultState, action) => {
  let arrivalDateMoment;
  let departureDateMoment;
  let lengthOfStay;
  let numberOfGuests;
  switch (action.type) {
    case 'SET_GUEST_DATA':
      arrivalDateMoment = moment.utc(action.payload.arrival);
      departureDateMoment = moment.utc(action.payload.departure);
      lengthOfStay = departureDateMoment.diff(arrivalDateMoment, 'days');
      numberOfGuests = action.payload.guestAges.length;
      return Object.assign({}, state, {
        guestData: {
          ...action.payload,
          helpers: {
            numberOfGuests,
            lengthOfStay,
            arrivalDateMoment,
            departureDateMoment,
          },
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
