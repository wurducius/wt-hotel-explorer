import moment from 'moment';
import hotelActions from './hotels';

const computeTotalPrice = (basePrice,
  numberOfGuests,
  numberOfNights) => basePrice * numberOfGuests * numberOfNights;


const recomputeHotelEstimates = ({ id }) => (dispatch, getState) => {
  const state = getState();
  const hotel = state.hotels.list.find(h => h.id === id);
  if (!hotel) {
    return;
  }
  let { roomTypes, ratePlans } = hotel;
  if (!roomTypes) {
    return;
  }
  if (!ratePlans) {
    return;
  }
  const { guestData } = state.estimates;
  if (!guestData || !guestData.arrival || !guestData.departure || !guestData.numberOfGuests) {
    return;
  }
  ratePlans = Object.values(ratePlans);
  roomTypes = Object.values(roomTypes);
  const now = moment.utc();
  const arrivalDate = moment.utc(guestData.arrival);
  const departureDate = moment.utc(guestData.departure);
  const data = roomTypes.map((roomType) => {
    const applicableRatePlans = ratePlans.filter((rp) => {
      const availableForTravelFrom = moment.utc(rp.availableForTravel.from);
      const availableForTravelTo = moment.utc(rp.availableForTravel.to);
      const availableForReservationFrom = moment.utc(rp.availableForReservation.from);
      const availableForReservationTo = moment.utc(rp.availableForReservation.to);
      // Rate plan is not tied to this room type
      if (rp.roomTypeIds.indexOf(roomType.id) === -1) {
        return false;
      }
      // Rate plan cannot be used today
      if (availableForReservationTo.isBefore(now)
        || availableForReservationFrom.isAfter(now)) {
        return false;
      }
      // Rate plan is totally out of bounds
      if (availableForTravelTo.isBefore(arrivalDate)
        || availableForTravelFrom.isAfter(departureDate)) {
        return false;
      }
      return true;
    });
    if (!applicableRatePlans.length) {
      return {
        id: roomType.id,
        price: undefined,
        currency: hotel.currency,
      };
    }
    return applicableRatePlans.reduce((acc, cur) => {
      const currentPrice = computeTotalPrice(cur.price, guestData.numberOfGuests, departureDate.diff(arrivalDate, 'days'));
      if (!acc.price || currentPrice <= acc.price) {
        return {
          id: roomType.id,
          price: currentPrice,
          currency: cur.currency || hotel.currency,
        };
      }
      return acc;
    }, {});
  });
  dispatch({
    type: 'SET_ESTIMATES',
    payload: {
      id,
      data,
    },
  });
};

const fetchAndComputeHotelEstimates = ({ id, ratePlans, roomTypes }) => (dispatch) => {
  let ratePlansPromise;
  let roomTypesPromise;
  // Do not hit hotels with rate plans already downloaded
  if (ratePlans) {
    ratePlansPromise = Promise.resolve();
  } else {
    ratePlansPromise = dispatch(hotelActions.fetchHotelRatePlans({ id }));
  }
  // Do not hit hotels with room types already downloaded
  if (roomTypes) {
    roomTypesPromise = Promise.resolve();
  } else {
    roomTypesPromise = dispatch(hotelActions.fetchHotelRoomTypes({ id }));
  }
  // for each hotel in parallel get rate plan, room types and recompute estimates
  return Promise.all([ratePlansPromise, roomTypesPromise])
    .then(() => dispatch(recomputeHotelEstimates({ id })));
};

const recomputeAllPrices = ({
  arrival, departure, numberOfGuests, formActions,
}) => (dispatch, getState) => {
  dispatch({
    type: 'SET_GUEST_DATA',
    payload: {
      arrival,
      departure,
      numberOfGuests,
    },
  });

  // Collect all rate plans
  const state = getState();
  const ratePlansPromises = state.hotels.list.map(h => dispatch(fetchAndComputeHotelEstimates(h)));
  // Wait for everything and enable form resubmission
  Promise.all(ratePlansPromises).then(() => {
    formActions.setSubmitting(false);
  });
};

export default {
  recomputeAllPrices,
  recomputeHotelEstimates,
  fetchAndComputeHotelEstimates,
};
