const defaultState = {
  erroredIds: [],
  list: [],
  hotelsInitialized: false,
  hotelsLoading: false,
  next: null,
};

const reducer = (state = defaultState, action) => {
  let modifiedList;
  let hotel;
  let hotelIndex;
  switch (action.type) {
    case 'FETCH_LIST_STARTED':
      return Object.assign({}, state, {
        hotelsLoading: true,
      });
    case 'FETCH_LIST_SUCCEEDED':
      if (!action.payload.items) {
        return state;
      }
      // TODO somehow handle errored hotels
      // TODO do not overwrite already downloaded hotel details
      return Object.assign({}, state, {
        erroredIds: [],
        list: state.list.concat(
          action.payload.items.map(item => Object.assign({}, item, {
            hasDetailLoaded: false,
            hasDetailLoading: false,
          })).filter(h => !!h),
        ),
        hotelsLoading: false,
        hotelsInitialized: true,
        next: action.payload.next,
      });
    case 'FETCH_DETAIL_STARTED':
      modifiedList = [].concat(state.list);
      hotel = modifiedList.find(h => h.id === action.payload[0].id);
      if (!hotel) {
        hotel = {
          id: action.payload[0].id,
        };
        modifiedList.push(hotel);
      }
      hotelIndex = modifiedList.indexOf(hotel);
      hotel.hasDetailLoaded = false;
      hotel.hasDetailLoading = true;
      modifiedList[hotelIndex] = hotel;
      return Object.assign({}, state, {
        list: modifiedList,
        hotelsInitialized: true,
      });
    case 'FETCH_DETAIL_SUCCEEDED':
      modifiedList = [].concat(state.list);
      hotel = modifiedList.find(h => h.id === action.payload.id);
      if (!hotel) {
        return state;
      }
      hotelIndex = modifiedList.indexOf(hotel);
      hotel = Object.assign({}, hotel, action.payload);
      hotel.hasDetailLoaded = true;
      hotel.hasDetailLoading = false;
      modifiedList[hotelIndex] = hotel;
      return Object.assign({}, state, {
        list: modifiedList,
      });
    default:
      return state;
  }
};

export default reducer;
