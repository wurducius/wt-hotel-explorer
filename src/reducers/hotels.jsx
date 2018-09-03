const defaultState = {
  list: [],
  hotelsLoading: true,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'FETCH_SUCCEEDED':
      return Object.assign({}, state, {
        list: action.payload.items,
        hotelsLoading: false,
      });
    default:
      return state;
  }
};

export default reducer;
