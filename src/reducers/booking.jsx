import dayjs from 'dayjs';

const baseDate = dayjs().day() <= 3 ? dayjs() : dayjs().set('day', 0).add(7, 'days');
const defaultArrival = dayjs(baseDate).set('day', 5).startOf('day');
const defaultDeparture = dayjs(baseDate).set('day', 7).startOf('day');


const defaultState = {
  guest: {
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
  hotel: {},
};

const reducer = (state = defaultState, action) => {
  let arrivalDateDayjs;
  let departureDateDayjs;
  let lengthOfStay;
  let numberOfGuests;
  let updatedHotel;
  let roomType;
  switch (action.type) {
    case 'SET_GUEST_DATA':
      arrivalDateDayjs = dayjs(action.payload.arrival);
      departureDateDayjs = dayjs(action.payload.departure);
      lengthOfStay = departureDateDayjs.diff(arrivalDateDayjs, 'days');
      numberOfGuests = action.payload.guestAges.length;
      return Object.assign({}, state, {
        guest: {
          ...action.payload,
          helpers: {
            numberOfGuests,
            lengthOfStay,
            arrivalDateDayjs,
            departureDateDayjs,
          },
        },
      });
    case 'ADD_ROOM_TYPE':
      updatedHotel = state.hotel && state.hotel.id === action.payload.hotelId ? state.hotel : {
        id: action.payload.hotelId,
        roomTypes: {},
      };
      roomType = updatedHotel.roomTypes[action.payload.roomTypeId] || {};
      updatedHotel.roomTypes[action.payload.roomTypeId] = Object.assign({}, roomType, {
        quantity: roomType.quantity ? roomType.quantity + 1 : 1,
      });
      return Object.assign({}, state, {
        hotel: updatedHotel,
      });
    default:
      return state;
  }
};

export default reducer;
