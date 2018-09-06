import hotelActions from './hotels';

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
  const data = roomTypes.map((roomType) => {
    const applicableRatePlans = ratePlans.filter(rp => rp.roomTypeIds.indexOf(roomType.id > -1));
    if (!applicableRatePlans.length) {
      return {
        id: roomType.id,
        price: undefined,
        currency: hotel.currency,
      };
    }
    // TODO introduce computing magic affected by guest data, dates etc.
    return {
      id: roomType.id,
      price: applicableRatePlans[0].price,
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
  const ratePlansPromises = state.hotels.list
    .map((h) => {
      let ratePlans; let
        roomTypes;
      // Do not hit hotels with rate plans already downloaded
      if (h.ratePlans) {
        ratePlans = Promise.resolve();
      } else {
        ratePlans = dispatch(hotelActions.fetchHotelRatePlans({ id: h.id }));
      }
      // Do not hit hotels with room types already downloaded
      if (h.roomTypes) {
        roomTypes = Promise.resolve();
      } else {
        roomTypes = dispatch(hotelActions.fetchHotelRoomTypes({ id: h.id }));
      }
      // for each hotel in parallel get rate plan, room types and recompute estimates
      return Promise.all([ratePlans, roomTypes]).then(() => {
        dispatch(recomputeHotelEstimates({ id: h.id }));
      });
    });
  // Wait for everything and enable form resubmission
  Promise.all(ratePlansPromises).then(() => {
    formActions.setSubmitting(false);
  });
};

export default {
  recomputeAllPrices,
  recomputeHotelEstimates,
};
