import { createActionThunk } from 'redux-thunk-actions';

const getRatePlan = createActionThunk('FETCH_HOTEL_RATE_PLAN', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}/ratePlans`;
  return fetch(url).then(data => data.json());
});

const recomputeEstimates = () => {
  return (dispatch, getState) => {
    // TODO do some computing magic
  }
}

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
    // Do not hit hotels with rate plans already downloaded
    .filter(h => !state.estimates.ratePlans[h.id])
    .map(h => dispatch(getRatePlan({ id: h.id })));
  
  Promise.all(ratePlansPromises).then((results) => {
    return dispatch(recomputeEstimates());
  }).then(() => {
    formActions.setSubmitting(false);
  });
};

export default {
  recomputeAllPrices,
  getRatePlan,

};
