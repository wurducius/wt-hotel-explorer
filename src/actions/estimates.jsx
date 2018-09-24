import hotelActions from './hotels';
import pricingAlgorithm from '../services/pricing-algorithm'; // TODO named import
import { enhancePricingEstimates } from '../services/availability';

const recomputeHotelEstimates = ({ id }) => (dispatch, getState) => {
  const state = getState();
  const hotel = state.hotels.list.find(h => h.id === id);
  if (!hotel) {
    return;
  }
  const { roomTypes, ratePlans, availability } = hotel;
  if (!roomTypes || !ratePlans || !availability) {
    return;
  }
  const { guestData } = state.estimates;
  if (
    !guestData
    || !guestData.arrival
    || !guestData.departure
    || !guestData.guestAges
    || !guestData.guestAges.length
  ) {
    return;
  }
  const pricingEstimates = pricingAlgorithm.computePrices(guestData, hotel);
  dispatch({
    type: 'SET_ESTIMATES',
    payload: {
      id,
      data: enhancePricingEstimates(guestData, pricingEstimates, hotel),
    },
  });
};

const fetchAndComputeHotelEstimates = ({
  id, ratePlans, roomTypes, availability,
}) => (dispatch) => {
  let ratePlansPromise;
  let roomTypesPromise;
  let availabilityPromise;
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
  // Do not hit hotels with availability already downloaded
  if (availability) {
    availabilityPromise = Promise.resolve();
  } else {
    availabilityPromise = dispatch(hotelActions.fetchHotelAvailability({ id }));
  }
  // for each hotel in parallel get rate plan, room types, availability and recompute estimates
  return Promise.all([ratePlansPromise, roomTypesPromise, availabilityPromise])
    .then(() => dispatch(recomputeHotelEstimates({ id })));
};

const recomputeAllPrices = ({
  arrival, departure, guestAges, formActions,
}) => (dispatch, getState) => {
  dispatch({
    type: 'SET_GUEST_DATA',
    payload: {
      arrival,
      departure,
      guestAges,
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
