const defaultState = {
  ids: [],
  erroredIds: [],
  list: [],
  hotelsInitialLoading: true,
  hotelsLoading: true,
  next: null,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'FETCH_STARTED':
      return Object.assign({}, state, {
        hotelsLoading: true,
      });
    case 'FETCH_SUCCEEDED':
      if (!action.payload.items) {
        return state;
      }
      // TODO somehow handle errored hotels
      return Object.assign({}, state, {
        ids: state.ids
          .concat(action.payload.items.map(i => i.id))
          // Make ids unique
          .filter((value, index, self) => self.indexOf(value) === index),
        erroredIds: [],
        list: state.list.concat(action.payload.items),
        hotelsLoading: false,
        hotelsInitialLoading: false,
        next: action.payload.next,
      });
    default:
      return state;
  }
};

export default reducer;
