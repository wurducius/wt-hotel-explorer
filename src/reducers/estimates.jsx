import moment from 'moment';

const baseDate = moment().isoWeekday() <= 4 ? moment() : moment().isoWeekday(1).add(7, 'days');
const defaultArrival = moment(baseDate).isoWeekday(5).startOf('day');
const defaultDeparture = moment(baseDate).isoWeekday(7).startOf('day');

const defaultState = {
  guestData: {
    arrival: defaultArrival.format('YYYY-MM-DD'),
    departure: defaultDeparture.format('YYYY-MM-DD'),
    numberOfGuests: 1,
    helpers: {
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
  switch (action.type) {
    case 'SET_GUEST_DATA':
      arrivalDateMoment = moment.utc(action.payload.arrival);
      departureDateMoment = moment.utc(action.payload.departure);
      lengthOfStay = departureDateMoment.diff(arrivalDateMoment, 'days');
      return Object.assign({}, state, {
        guestData: {
          ...action.payload,
          helpers: {
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
