const defaultState = {
  erroredHotels: {},
  list: [],
  hotelsInitialized: false,
  hotelsLoading: false,
  next: null,
};

const remapErroredIds = list => list
  .map(e => e.data && e.data.id)
  .filter(h => !!h)
  .reduce((agg, cur) => {
    if (agg[cur]) {
      return agg;
    }
    return Object.assign({}, agg, {
      [cur]: 'fresh',
    });
  }, {});

const reducer = (state = defaultState, action) => {
  let modifiedList;
  let existingIds;
  let currentErroredHotels;
  let hotel;
  let hotelIndex;
  switch (action.type) {
    case 'FETCH_LIST_STARTED':
      return Object.assign({}, state, {
        hotelsLoading: true,
      });
    case 'FETCH_LIST_SUCCEEDED':
      if (!action.payload.items) {
        if (action.payload.errors) {
          currentErroredHotels = remapErroredIds(action.payload.errors);
          return Object.assign({}, state, {
            erroredHotels: Object.assign({}, state.erroredHotels, currentErroredHotels),
          });
        }
        return state;
      }

      if (action.payload.errors) {
        currentErroredHotels = Object.assign({},
          state.erroredHotels,
          remapErroredIds(action.payload.errors));
      } else {
        currentErroredHotels = Object.assign({}, state.erroredHotels);
      }

      modifiedList = state.list;
      existingIds = state.list.map(h => h.id).reduce((acc, cur, i) => {
        acc[cur] = i;
        return acc;
      }, {});
      for (let i = 0; i < action.payload.items.length; i += 1) {
        if (existingIds[action.payload.items[i].id] !== undefined) {
          modifiedList[existingIds[action.payload.items[i].id]] = Object.assign({},
            modifiedList[existingIds[action.payload.items[i].id]],
            action.payload.items[i]);
        } else {
          modifiedList.push(Object.assign({}, action.payload.items[i], {
            hasDetailLoaded: false,
            hasDetailLoading: false,
          }));
        }
        // Drop successfully refreshed hotel from errored
        if (currentErroredHotels[action.payload.items[i].id]) {
          delete currentErroredHotels[action.payload.items[i].id];
        }
      }
      return Object.assign({}, state, {
        erroredHotels: currentErroredHotels,
        list: modifiedList,
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
      currentErroredHotels = Object.assign({}, state.erroredHotels);

      // Drop successfully refreshed hotel from errored
      if (currentErroredHotels[action.payload.id]) {
        delete currentErroredHotels[action.payload.id];
      }

      return Object.assign({}, state, {
        list: modifiedList,
        erroredHotels: currentErroredHotels,
      });
    case 'FETCH_DETAIL_FAILED':
      modifiedList = state.list.filter(h => h.id !== action.payload.code);
      currentErroredHotels = Object.assign({}, state.erroredHotels);
      // No other HTTP status gets queued, these are the only states we might
      // potentially recover from
      if (action.payload.status > 499) {
        currentErroredHotels[action.payload.code] = 'fresh';
      }
      return Object.assign({}, state, {
        erroredHotels: currentErroredHotels,
        list: modifiedList,
      });
    case 'FETCH_HOTEL_ROOM_TYPES_SUCCEEDED':
      modifiedList = [].concat(state.list);
      hotel = modifiedList.find(h => h.id === action.payload.id);
      if (!hotel) {
        return state;
      }
      hotelIndex = modifiedList.indexOf(hotel);
      hotel = Object.assign({}, hotel, {
        roomTypes: action.payload.data,
      });
      modifiedList[hotelIndex] = hotel;
      return Object.assign({}, state, {
        list: modifiedList,
      });
    case 'FETCH_HOTEL_RATE_PLANS_SUCCEEDED':
      modifiedList = [].concat(state.list);
      hotel = modifiedList.find(h => h.id === action.payload.id);
      if (!hotel) {
        return state;
      }
      hotelIndex = modifiedList.indexOf(hotel);
      hotel = Object.assign({}, hotel, {
        ratePlans: action.payload.data,
      });
      modifiedList[hotelIndex] = hotel;
      return Object.assign({}, state, {
        list: modifiedList,
      });
    default:
      return state;
  }
};

export default reducer;
