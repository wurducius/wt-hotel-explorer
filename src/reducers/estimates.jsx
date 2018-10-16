const defaultState = {
  current: {},
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
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
