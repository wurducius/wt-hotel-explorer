export const setGuestData = ({ arrival, departure, guestAges }) => (dispatch) => {
  dispatch({
    type: 'SET_GUEST_DATA',
    payload: {
      arrival,
      departure,
      guestAges,
    },
  });
};

export default {
  setGuestData,
};
