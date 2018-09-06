const defaultState = {
  guestData: {},
  ratePlans: {},
  estimates: {},
  isComputing: false,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_GUEST_DATA':
      return Object.assign({}, state, {
        guestData: {
          ...action.payload,
        },
      });
    default:
      return state;
  }
};

export default reducer;
