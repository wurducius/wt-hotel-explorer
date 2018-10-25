import { createActionThunk } from 'redux-thunk-actions';

import {
  HttpError,
  Http404Error,
  HttpBadRequestError,
  HttpInternalServerError,
  HttpBadGatewayError,
} from '../services/errors';

const LIMIT = 5;
const ERRORED_REFRESH_TIMEOUT = 10 * 1000;

const LIST_FIELDS = [
  'id',
  'name',
  'description',
  'images',
];

const DETAIL_FIELDS = [
  'id',
  'name',
  'description',
  'location',
  'images',
  'contacts',
  'address',
  'amenities',
  'defaultCancellationAmount',
  'cancellationPolicies',
  'roomTypes',
];

const translateNetworkError = (status, code, message) => {
  if (status === 400) {
    return new HttpBadRequestError(code, message);
  }
  // Consider 422 as a 404
  if (status === 404 || status === 422) {
    return new Http404Error(code, message);
  }
  if (status === 502) {
    return new HttpBadGatewayError(code, message);
  }
  if (status === 500) {
    return new HttpInternalServerError(code, message);
  }

  const e = new HttpError(code, message);
  e.status = status;
  return e;
};

var randomNumber = Math.floor(Math.random() * (10000+1));
const fetchHotelsList = createActionThunk('FETCH_LIST', ({ getState }) => {
  let url = `${process.env.WT_READ_API}/hotels?fields=${LIST_FIELDS.join(',')}&limit=30&random=`+randomNumber;
  const state = getState();
  if (state.hotels.next) {
    url = state.hotels.next;
  }
  return fetch(url).then((response) => {
    if (response.status > 299) {
      throw translateNetworkError(response.status, 'missingHotel', 'Cannot get hotel list!');
    }
    return response.json();
  });
});

const fetchHotelDetail = createActionThunk('FETCH_DETAIL', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}?fields=${DETAIL_FIELDS.join(',')}`;
  return fetch(url).then((response) => {
    if (response.status > 299) {
      throw translateNetworkError(response.status, id, 'Cannot get hotel detail!');
    }
    return response.json();
  });
});

const eventuallyResolveErroredHotels = () => (dispatch, getState) => {
  setTimeout(() => {
    const { hotels } = getState();
    const freshErroredHotelIds = Object.keys(hotels.erroredHotels).filter(id => hotels.erroredHotels[id] === 'fresh');
    if (freshErroredHotelIds.length) {
      for (let i = 0; i < freshErroredHotelIds.length; i += 1) {
        dispatch({
          type: 'REFETCH_ERRORED_HOTEL_STARTED',
          payload: {
            id: freshErroredHotelIds[i],
          },
        });
        dispatch(fetchHotelDetail({
          id: freshErroredHotelIds[i],
          dispatch,
        })).catch(() => {}); // silent catch to prevent error leaking into console
      }
      dispatch(eventuallyResolveErroredHotels());
    }
  }, ERRORED_REFRESH_TIMEOUT);
};


const fetchHotelRatePlans = createActionThunk('FETCH_HOTEL_RATE_PLANS', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}/ratePlans`;
  return fetch(url)
    .then((response) => {
      if (response.status > 299) {
        throw translateNetworkError(response.status, id, 'Cannot get hotel rate plans!');
      }
      return response.json();
    })
    .then(data => ({
      data,
      id,
    }));
});

const fetchHotelAvailability = createActionThunk('FETCH_HOTEL_AVAILABILITY', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}/availability`;
  return fetch(url)
    .then((response) => {
      if (response.status > 299) {
        throw translateNetworkError(response.status, id, 'Cannot get hotel availability!');
      }
      return response.json();
    })
    .then(data => ({
      data,
      id,
    }));
});

const fetchHotelRoomTypes = createActionThunk('FETCH_HOTEL_ROOM_TYPES', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}/roomTypes`;
  return fetch(url)
    .then((response) => {
      if (response.status > 299) {
        throw translateNetworkError(response.status, id, 'Cannot get hotel room types!');
      }
      return response.json();
    })
    .then(data => ({
      data,
      id,
    }));
});

const actions = {
  fetchHotelsList,
  fetchHotelDetail,
  fetchHotelRatePlans,
  fetchHotelAvailability,
  fetchHotelRoomTypes,
  eventuallyResolveErroredHotels,
};

export default actions;
