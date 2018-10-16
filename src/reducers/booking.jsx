import dayjs from 'dayjs';

const baseDate = dayjs().day() <= 3 ? dayjs() : dayjs().set('day', 0).add(7, 'days');
const defaultArrival = dayjs(baseDate).set('day', 5).startOf('day');
const defaultDeparture = dayjs(baseDate).set('day', 7).startOf('day');


const defaultState = {
  guestData: {
    arrival: defaultArrival.format('YYYY-MM-DD'),
    departure: defaultDeparture.format('YYYY-MM-DD'),
    guestAges: [],
    helpers: {
      numberOfGuests: 0,
      lengthOfStay: defaultDeparture.diff(defaultArrival, 'days'),
      arrivalDateDayjs: defaultArrival,
      departureDateDayjs: defaultDeparture,
    },
  },
};

const reducer = (state = defaultState, action) => {
  let arrivalDateDayjs;
  let departureDateDayjs;
  let lengthOfStay;
  let numberOfGuests;
  switch (action.type) {
    case 'SET_GUEST_DATA':
      arrivalDateDayjs = dayjs(action.payload.arrival);
      departureDateDayjs = dayjs(action.payload.departure);
      lengthOfStay = departureDateDayjs.diff(arrivalDateDayjs, 'days');
      numberOfGuests = action.payload.guestAges.length;
      return Object.assign({}, state, {
        guestData: {
          ...action.payload,
          helpers: {
            numberOfGuests,
            lengthOfStay,
            arrivalDateDayjs,
            departureDateDayjs,
          },
        },
      });
    default:
      return state;
  }
};

export default reducer;
