const defaultState = {
  guestData: {},
  current: {},
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_GUEST_DATA':
      return Object.assign({}, state, {
        guestData: {
          ...action.payload,
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
