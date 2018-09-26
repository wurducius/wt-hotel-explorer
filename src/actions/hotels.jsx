import { createActionThunk } from 'redux-thunk-actions';

import {
  HttpError,
  Http404Error,
  HttpBadRequestError,
  HttpInternalServerError,
  HttpBadGatewayError,
} from '../services/errors';

const LIMIT = 5;

const LIST_FIELDS = [
  'id',
  'name',
  'description',
  'location',
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

const eventuallyResolveErroredHotels = () => (/* dispatch, getState */) => {
  // fetchHotelDetail(id)
  // console.log('dispatch a errored list refresh after a
  // certain time if any errored hotels are returned', dispatch);
};

const fetchHotelsList = createActionThunk('FETCH_LIST', ({ dispatch, getState }) => {
  let url = `${process.env.WT_READ_API}/hotels?fields=${LIST_FIELDS.join(',')}&limit=${LIMIT}`;
  const state = getState();
  if (state.hotels.next) {
    url = state.hotels.next;
  }
  return fetch(url).then((response) => {
    if (response.status > 299) {
      throw translateNetworkError(response.status, 'missingHotel', 'Cannot get hotel list!');
    }
    return response.json();
  }).then((data) => {
    if (data.errors) {
      dispatch(eventuallyResolveErroredHotels());
    }
    return data;
  });
});

const fetchHotelDetail = createActionThunk('FETCH_DETAIL', ({ id, dispatch }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}?fields=${DETAIL_FIELDS.join(',')}`;
  return fetch(url).then((response) => {
    if (response.status > 299) {
      // No other HTTP status gets queued, these are the only states we might
      // potentially recover from
      if (response.status > 499) {
        dispatch(eventuallyResolveErroredHotels());
      }
      throw translateNetworkError(response.status, id, 'Cannot get hotel detail!');
    }
    return response.json();
  });
});

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
  fetchHotelRoomTypes,
};

export default actions;
