const defaultState = {
  errorPage: {},
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'FETCH_DETAIL_FAILED':
      return Object.assign({}, state, {
        errorPage: {
          status: action.payload.status,
          message: action.payload.message,
        },
      });
    default:
      return state;
  }
};

export default reducer;
