import moment from 'moment';
import hotelActions from './hotels';

const computeDailyPrice = (basePrice, numberOfGuests) => basePrice * numberOfGuests;

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
  const lengthOfStay = departureDate.diff(arrivalDate, 'days');

  const data = roomTypes.map((roomType) => {
    // select rateplans that are totally out of bounds
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
      // Rate plan is totally out of bounds of travel dates
      if (availableForTravelTo.isBefore(arrivalDate)
        || availableForTravelFrom.isAfter(departureDate)) {
        return false;
      }
      return true;
    });

    // no rate plans available at all, bail
    if (!applicableRatePlans.length) {
      return {
        id: roomType.id,
        price: undefined,
        currency: hotel.currency,
      };
    }
    const currentDate = moment(arrivalDate);
    const dailyPrices = [];
    // Find an appropriate rate plan for every day
    for (let i = 0; i < lengthOfStay; i += 1) {
      // TODO Keep rate plans together by currency in addition to this
      dailyPrices.push(applicableRatePlans.reduce((acc, cur) => {
        const availableForTravelFrom = moment.utc(cur.availableForTravel.from);
        const availableForTravelTo = moment.utc(cur.availableForTravel.to);
        // Deal with a rate plan ending sometimes during the stay
        if (currentDate < availableForTravelFrom || currentDate > availableForTravelTo) {
          return acc;
        }
        const currentPrice = computeDailyPrice(cur.price, guestData.numberOfGuests);
        if (!acc.price || currentPrice <= acc.price) {
          return currentPrice;
        }
        return acc;
      }, -1));
      currentDate.add(1, 'day');
    }
    return {
      id: roomType.id,
      price: dailyPrices.indexOf(-1) > -1 ? undefined : dailyPrices.reduce((a, b) => a + b, 0),
      // TODO fix the currency decision making
      currency: applicableRatePlans[0].currency || hotel.currency,
    };
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
